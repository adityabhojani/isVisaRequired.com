// Build-time guard for Clerk configuration. Runs first in the Vercel build.
//
// The frontend's Clerk key is baked in at build time (VITE_CLERK_PUBLISHABLE_KEY)
// while the server reads CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY at runtime.
// Moving from a development to a production Clerk instance means changing them
// together. A half-finished change — one key live and another still test, or two
// keys from different instances — builds fine and then breaks sign-in for
// everyone. Failing the build instead keeps the previous, working deployment
// live until the variables agree.
//
// Enforced for Production builds only; Preview and local builds just warn.
// Never prints a secret: only a key's type (test/live) and the public Frontend
// API host that a publishable key encodes.

const env = process.env;
const isProduction = env.VERCEL_ENV === "production";
const problems = [];
const warnings = [];

const clean = (v) => (typeof v === "string" ? v.trim() : "");

function typeOf(key, prefix) {
  if (!key) return null;
  if (key.startsWith(`${prefix}_live_`)) return "live";
  if (key.startsWith(`${prefix}_test_`)) return "test";
  return "unrecognised";
}

// Secret keys are sk_live_/sk_test_; Clerk still accepts legacy live_/test_ ones.
function secretTypeOf(key) {
  if (!key) return null;
  if (/^(sk_)?live_/.test(key)) return "live";
  if (/^(sk_)?test_/.test(key)) return "test";
  return "unrecognised";
}

// A publishable key is pk_<type>_ + base64("<frontend api host>$").
function hostOf(publishableKey) {
  const encoded = publishableKey.replace(/^pk_(test|live)_/, "");
  return Buffer.from(encoded, "base64").toString("utf8").replace(/\$$/, "");
}

const frontendKey = clean(env.VITE_CLERK_PUBLISHABLE_KEY);
const serverKey = clean(env.CLERK_PUBLISHABLE_KEY);
const secretKey = clean(env.CLERK_SECRET_KEY);

if (!frontendKey) {
  problems.push(
    "VITE_CLERK_PUBLISHABLE_KEY is not set, so the site would fall back to a hardcoded development key instead of your own.",
  );
} else {
  console.log(`[clerk-env] frontend key: ${typeOf(frontendKey, "pk")}, instance ${hostOf(frontendKey)}`);
  if (typeOf(frontendKey, "pk") === "unrecognised") {
    problems.push("VITE_CLERK_PUBLISHABLE_KEY does not look like a Clerk publishable key (pk_live_… or pk_test_…).");
  }
}

if (frontendKey && serverKey && hostOf(frontendKey) !== hostOf(serverKey)) {
  problems.push(
    `VITE_CLERK_PUBLISHABLE_KEY (${hostOf(frontendKey)}) and CLERK_PUBLISHABLE_KEY (${hostOf(serverKey)}) belong to different Clerk instances.`,
  );
}

const publishableType = typeOf(frontendKey || serverKey, "pk");
const secretType = secretTypeOf(secretKey);
if (secretKey) console.log(`[clerk-env] secret key: ${secretType}`);
if (secretType === "unrecognised") {
  // Warn only: a format this script doesn't know is not proof of a broken
  // site, and failing here would block every deploy on a guess.
  warnings.push("CLERK_SECRET_KEY doesn't look like a Clerk secret key (sk_live_… or sk_test_…).");
} else if (publishableType && secretType && publishableType !== "unrecognised" && publishableType !== secretType) {
  problems.push(
    `The publishable key is a ${publishableType} key but CLERK_SECRET_KEY is a ${secretType} key. All Clerk keys must come from the same instance.`,
  );
}

if (secretKey && !frontendKey && !serverKey) {
  warnings.push("CLERK_SECRET_KEY is set but neither publishable key is, so the server will leave sign-in switched off.");
}

if (isProduction && publishableType === "test") {
  console.log(
    "[clerk-env] note: Production is still on a Clerk DEVELOPMENT instance (pk_test). It works, but is capped at 100 users and not meant for production traffic.",
  );
}

for (const w of warnings) console.warn(`[clerk-env] warning: ${w}`);
if (problems.length > 0) {
  for (const p of problems) console.error(`[clerk-env] ${isProduction ? "ERROR" : "warning"}: ${p}`);
  if (isProduction) {
    console.error(
      "[clerk-env] Refusing to build Production. The current live site keeps running. Fix the Clerk variables for Production in Vercel > Settings > Environment Variables, then redeploy.",
    );
    process.exit(1);
  }
}
console.log(`[clerk-env] ok (${isProduction ? "production" : env.VERCEL_ENV || "local"})`);
