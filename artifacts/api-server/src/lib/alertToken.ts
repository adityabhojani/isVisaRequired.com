// Signed, no-login unsubscribe and confirmation tokens for visa-alert emails.
import crypto from "crypto";

// The key new links are signed with.
//
// Never read CRON_SECRET here. It used to head this chain, which tied every
// emailed link to Vercel Cron's credential: setting or rotating CRON_SECRET would
// silently have invalidated every unsubscribe and confirm link already in an
// inbox, because tokens are recomputed on verify and never stored. The cron
// credential has to be changeable on its own.
//
// Otherwise unchanged: an explicit ALERT_SECRET, else a key derived from
// DATABASE_URL (which contains the DB password and is always set when alerts
// exist). The old hardcoded fallback lived in a public repo, so anyone could
// forge tokens for sequential alert ids.
function signingSecret(): string {
  const explicit = process.env.ALERT_SECRET;
  if (explicit) return explicit;
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) return crypto.createHash("sha256").update(`ivr-alert:${dbUrl}`).digest("hex");
  return "isvisarequired-alert-fallback"; // dev-only: no DB → no alerts → tokens are moot
}

// Keys a presented token may legitimately have been signed with: the signing
// key, plus CRON_SECRET for any link emailed while it still headed the chain.
// If CRON_SECRET was never set before that change — the expected case — the
// second key matches nothing ever sent, and accepting it is harmless because it
// is itself a secret.
function verificationSecrets(): string[] {
  const keys = [signingSecret()];
  const legacy = process.env.CRON_SECRET;
  if (legacy && !keys.includes(legacy)) keys.push(legacy);
  return keys;
}

function sign(secret: string, message: string): string {
  return crypto.createHmac("sha256", secret).update(message).digest("hex").slice(0, 32);
}

function verify(message: string, token: string): boolean {
  if (typeof token !== "string") return false;
  const presented = Buffer.from(token);
  return verificationSecrets().some((secret) => {
    const expected = Buffer.from(sign(secret, message));
    // Compare byte lengths, not string lengths: a 32-character token holding
    // multi-byte characters would otherwise reach timingSafeEqual and throw.
    return presented.length === expected.length && crypto.timingSafeEqual(presented, expected);
  });
}

export function alertUnsubToken(id: number): string {
  return sign(signingSecret(), `unsub:${id}`);
}

export function verifyUnsubToken(id: number, token: string): boolean {
  return verify(`unsub:${id}`, token);
}

export function alertUnsubUrl(id: number, origin: string): string {
  return `${origin}/api/alerts/unsubscribe?id=${id}&token=${alertUnsubToken(id)}`;
}

// ── confirmation (double-opt-in) tokens ──────────────────────────────────────
// Distinct message prefix so confirm and unsubscribe tokens are never
// interchangeable.
export function alertConfirmToken(id: number): string {
  return sign(signingSecret(), `confirm:${id}`);
}

export function verifyConfirmToken(id: number, token: string): boolean {
  return verify(`confirm:${id}`, token);
}

export function alertConfirmUrl(id: number, origin: string): string {
  return `${origin}/api/alerts/confirm?id=${id}&token=${alertConfirmToken(id)}`;
}
