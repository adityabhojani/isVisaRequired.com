#!/usr/bin/env node
// Deploy-time guard. Runs inside the Vercel buildCommand, right after
// check-clerk-env.mjs, and fails the build — so the previous, working
// deployment stays live — when any of these is true:
//
//   1. tokens.generated.css is stale against lib/travel-data.
//   2. The app's font <link> differs from FONT_HREF (the server pages' font).
//   3. A file outside lib/travel-data declares its own visa-status colour.
//   4. Any of the 37,830 pair pages fails to render, shows "Varies" inside its
//      answer card, has other than one <h1>, or has FAQ structured data that
//      doesn't match the visible FAQ text (a manual-action risk with Google).
//   5. The golden pairs stop saying what they must say.
//   3b. The files behind a kind of page (pair pages, destination hubs, passport
//      hubs) change while the "last modified" date those pages report does not,
//      or a hub template starts using a file that is neither fingerprinted nor
//      excused (see FRESHNESS_CHECKS in artifacts/api-server/src/seo/freshness.ts).
//
// Why this exists: this repo has shipped the same class of bug five times — the
// server-rendered page and the React app drifting apart (heading levels, footer
// links, a markdown link rule, two status palettes, two copies of the entry-
// requirements data with different ETIAS and NZ facts). Nothing typechecked or
// tested on deploy. This is that check.
import { build } from "../artifacts/api-server/node_modules/esbuild/lib/main.js";
import { readFileSync, readdirSync, statSync, mkdtempSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);
const t0 = Date.now();

// ── 1. tokens ────────────────────────────────────────────────────────────────
try {
  execSync("node scripts/gen-tokens.mjs --check", { cwd: root, stdio: "pipe" });
  console.log("✓ tokens.generated.css is current");
} catch (e) {
  fail(`tokens.generated.css is stale: run \`pnpm run tokens\` and commit it.\n${e.stderr?.toString() ?? ""}`);
}

// Bundle the shared package and the pair renderer once; everything below uses them.
const dir = mkdtempSync(join(tmpdir(), "drift-"));
const entry = join(dir, "entry.ts");
const out = join(dir, "entry.mjs");
const { writeFileSync } = await import("node:fs");
writeFileSync(entry, `
export * from ${JSON.stringify(join(root, "lib/travel-data/src/index.ts"))};
export { renderPairPage } from ${JSON.stringify(join(root, "artifacts/api-server/src/seo/render.ts"))};
export { countries } from ${JSON.stringify(join(root, "artifacts/api-server/src/data/countries.ts"))};
export { getDefaultEntry } from ${JSON.stringify(join(root, "artifacts/api-server/src/data/visaData.ts"))};
export { FRESHNESS_CHECKS } from ${JSON.stringify(join(root, "artifacts/api-server/src/seo/freshness.ts"))};
`);
await build({ entryPoints: [entry], bundle: true, platform: "node", format: "esm", outfile: out, logLevel: "error" });
const M = await import(pathToFileURL(out).href);

// ── 2. fonts ─────────────────────────────────────────────────────────────────
{
  const html = readFileSync(join(root, "artifacts/visa-checker/index.html"), "utf8");
  const css = readFileSync(join(root, "artifacts/visa-checker/src/index.css"), "utf8");
  const href = M.FONT_HREF.replace(/&/g, "&");
  if (!html.includes(`href="${href}"`)) fail(`index.html's font <link> is not FONT_HREF (${M.FONT_HREF}).`);
  if (/fonts\.googleapis\.com/.test(css)) fail("index.css imports a font stylesheet — fonts load from index.html only (an @import there is a chained, render-blocking request).");
  else console.log("✓ one font stylesheet, identical on server and app");
}

// ── 3. no private status palettes ────────────────────────────────────────────
{
  // Keys in any casing, and the status LABELS — stats.tsx once slipped past a
  // snake_case-only check with { label: "No Admission", value: stats.noAdmission,
  // color: "text-red-600" }.
  // camelCase only as a property or key (stats.visaFree, {eVisa}, visaFree:) — as a bare word it
  // is ordinary prose ("eVisa/ETA destinations") and would flag every guide.
  const STATUS = /\b(visa_free|visa_on_arrival|e_visa|visa_required|no_admission)\b|[.{]\s*(?:visaFree|visaOnArrival|eVisa|visaRequired|noAdmission)\b|\b(?:visaFree|visaOnArrival|eVisa|visaRequired|noAdmission)\s*:|["'](?:Visa[ -][Ff]ree|Visa on [Aa]rrival|Visa [Rr]equired|No [Aa]dmission|Entry not permitted)["']/;
  const COLOUR = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|\b(?:text|bg|border|fill|stroke|ring|from|to)-(?:red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|rose|pink|lime)-\d{2,3}\b/;
  // The phone app too: it kept its own palette until 2026-09-22 and drifted amber
  // where the site had gone teal.
  const roots = ["artifacts/visa-checker/src", "artifacts/api-server/src", "artifacts/visa-app"];
  const offenders = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) { if (name !== "node_modules" && name !== "generated") walk(p); continue; }
      if (!/\.(tsx?|mjs|js)$/.test(name)) continue;
      readFileSync(p, "utf8").split("\n").forEach((line, i) => {
        if (STATUS.test(line) && COLOUR.test(line) && !/drift-ok/.test(line)) offenders.push(`${relative(root, p)}:${i + 1}: ${line.trim().slice(0, 110)}`);
      });
    }
  };
  roots.forEach((r) => walk(join(root, r)));
  if (offenders.length) fail(`Visa-status colours declared outside lib/travel-data (import from @/lib/requirement or @workspace/travel-data instead):\n  ${offenders.join("\n  ")}`);
  else console.log("✓ no private visa-status palettes");
}

// ── 3b. every page reports a truthful "last modified" ───────────────────────
// Every sitemap <lastmod> derives from the dates in seo/freshness.ts. For each
// kind of page (FRESHNESS_CHECKS there) the files whose text reaches it are
// fingerprinted here, so the wording cannot change while the date stays put —
// the failure a hand-bumped constant guarantees. The guard also bundles each
// page template and fails when it now includes a repo file that is neither
// fingerprinted nor excused, so text cannot slip into an untracked file.
{
  const { createHash } = await import("node:crypto");
  const FILE = "artifacts/api-server/src/seo/freshness.ts";
  const today = new Date().toISOString().slice(0, 10);
  // A real calendar day, written YYYY-MM-DD, no later than today (UTC).
  const validDate = (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)
    && !Number.isNaN(Date.parse(`${d}T00:00:00Z`)) && new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) === d && d <= today;
  const codes = new Set(M.countries.map((c) => c.code));
  // Bundle `export { name } from file` on its own. The stdin is plain JS so that a
  // missing export is an error rather than silently read as a TypeScript type.
  let seq = 0;
  const bundle = async (file, exportName, alias) => build({
    stdin: { contents: `export { ${exportName}${alias ? ` as ${alias}` : ""} } from ${JSON.stringify(join(root, file))};`, resolveDir: root, loader: "js" },
    absWorkingDir: root, bundle: true, platform: "node", format: "esm", metafile: true, logLevel: "silent", outfile: join(dir, `freshness-${seq++}.mjs`),
  });
  const firstLine = (e) => String(e?.errors?.[0]?.text ?? e?.message ?? e).split("\n")[0];

  for (const c of M.FRESHNESS_CHECKS) {
    const n = c.names;
    let ok = true;
    const bad = (msg) => { ok = false; fail(msg); };

    if (!validDate(c.updated)) bad(`${n.updated} is "${c.updated}"; it must be a real date no later than today (${today}), written YYYY-MM-DD (${FILE}).`);
    for (const [code, d] of Object.entries(c.pages ?? {})) {
      if (!codes.has(code)) bad(`${n.pages} in ${FILE} has "${code}", which is not a country code in data/countries.ts.`);
      if (!validDate(d)) bad(`${n.pages}.${code} is "${d}"; it must be a real date no later than today (${today}), written YYYY-MM-DD (${FILE}).`);
    }

    const where = { [n.sources]: c.sources, "renderer": c.renderer ? [c.renderer.file] : [], "derived": c.derived ? [c.derived.file] : [] };
    const missing = Object.entries(where).flatMap(([k, fs]) => fs.filter((f) => !existsSync(join(root, f))).map((f) => `${f} (in ${k})`));
    if (missing.length) {
      bad(`The ${c.label} entry in FRESHNESS_CHECKS / ${FILE} names ${missing.join(", ")}, which does not exist. If a file was renamed or moved, put its new path everywhere it is named there; the guard will then print the new fingerprint.`);
      continue;
    }

    // What of a large, mostly-irrelevant file actually reaches these pages.
    let derivedJson = "";
    if (c.derived) {
      try {
        await bundle(c.derived.file, c.derived.exportName, "derived");
        const fn = (await import(pathToFileURL(join(dir, `freshness-${seq - 1}.mjs`)).href)).derived;
        derivedJson = JSON.stringify(fn());
      } catch (e) {
        bad(`The ${c.label} entry in FRESHNESS_CHECKS (${FILE}) fingerprints ${c.derived.exportName}() from ${c.derived.file}, which could not be run: ${firstLine(e)}. If that function was renamed or moved, update derived there.`);
        continue;
      }
    }

    const h = createHash("sha256");
    for (const f of c.sources) h.update(readFileSync(join(root, f)));
    if (c.derived) h.update(derivedJson);
    const fp = h.digest("hex").slice(0, 16);
    if (fp !== c.fingerprint) {
      bad([
        `The files behind the ${c.label} changed, but the date those pages report did not. In ${FILE}:`,
        `  1. Always: replace  ${n.fingerprint} = "${c.fingerprint}"  with  ${n.fingerprint} = "${fp}"`,
        `  2. Then decide whether what these pages SAY changed (title, description, headings, text, FAQ, links):`,
        c.updated === today
          ? `     - ${n.updated} is already today (${today}), so there is nothing more to do.`
          : `     - on every one of them: also set  ${n.updated} = "${today}"`,
        ...(n.pages && c.updated !== today ? [`     - on only some of them: instead add those pages to ${n.pages} by country code, e.g. { XX: "${today}" }`] : []),
        `     - only styling or code structure: change nothing else.`,
        `  Never set a date earlier than it already is: search engines would be told these pages are older than they are.`,
        `  Fingerprinted: ${c.sources.join(", ")}${c.derived ? `, and the result of ${c.derived.exportName}() in ${c.derived.file}` : ""}`,
      ].join("\n"));
    }

    if (c.renderer) {
      let inputs = null;
      try { inputs = Object.values((await bundle(c.renderer.file, c.renderer.exportName)).metafile.outputs)[0].inputs; }
      catch (e) { bad(`The ${c.label} template could not be bundled from ${c.renderer.file} (export ${c.renderer.exportName}): ${firstLine(e)}. If that file or function was renamed or moved, update renderer in FRESHNESS_CHECKS (${FILE}).`); }
      if (inputs) {
        const bundled = Object.keys(inputs).filter((p) => inputs[p].bytesInOutput > 0 && !p.includes("node_modules"));
        if (!bundled.includes(c.renderer.file)) {
          bad(`The ${c.label} template ${c.renderer.file} contributed nothing when bundled through ${c.renderer.exportName}, so the date check could not see what these pages are built from. If the function was renamed or moved, update renderer in FRESHNESS_CHECKS (${FILE}).`);
        } else {
          const listed = new Set([...c.sources, ...Object.keys(c.notTracked ?? {})]);
          const unknown = bundled.filter((p) => !listed.has(p));
          if (unknown.length) bad(`The ${c.label} are now built from ${unknown.join(", ")}, which the date check neither fingerprints nor excuses. In ${FILE}, add each file to ${n.sources} if any of its text can reach these pages (the guard will then print the new fingerprint), or to ${n.notTracked} with the reason none can.`);
          const gone = [...listed].filter((p) => !bundled.includes(p));
          if (gone.length) console.warn(`⚠ ${c.label}: ${gone.join(", ")} no longer reach${gone.length === 1 ? "es" : ""} these pages; remove from ${n.sources} / ${n.notTracked} in ${FILE} when convenient.`);
        }
      }
    }

    if (ok) {
      const pages = Object.keys(c.pages ?? {}).length;
      console.log(`✓ ${c.label}: wording fingerprint matches; they report last modified ${c.updated}${pages ? ` (${pages} later, per page)` : ""}`);
    }
  }
}

// ── 4 & 5. every pair page ───────────────────────────────────────────────────
{
  const { countries, renderPairPage } = M;
  const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  let n = 0;
  const pairFails = [];
  const html = {};
  for (const a of countries) for (const b of countries) {
    if (a.code === b.code) continue;
    n++;
    let h;
    try { h = renderPairPage(a, b); } catch (e) { pairFails.push(`${a.code}→${b.code}: threw ${e.message}`); continue; }
    const card = h.match(/<section class="verdict"[\s\S]*?<\/section>/)?.[0] ?? "";
    if (!card) pairFails.push(`${a.code}→${b.code}: no verdict card`);
    if (/>\s*Varies/i.test(card)) pairFails.push(`${a.code}→${b.code}: "Varies" inside the verdict card`);
    const h1s = (h.match(/<h1\b/g) || []).length;
    if (h1s !== 1) pairFails.push(`${a.code}→${b.code}: ${h1s} <h1>`);
    const ld = h.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?)<\/script>/)?.[1];
    const vis = [...h.matchAll(/<details class="faq"><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map((m) => [unesc(m[1]), unesc(m[2])]);
    if (!ld) pairFails.push(`${a.code}→${b.code}: no FAQPage JSON-LD`);
    else {
      const q = JSON.parse(ld).mainEntity.map((e) => [e.name, e.acceptedAnswer.text]);
      if (JSON.stringify(q) !== JSON.stringify(vis)) pairFails.push(`${a.code}→${b.code}: FAQ JSON-LD differs from the visible FAQ`);
    }
    if (["IN-JP", "US-GB", "DE-BR", "KP-JP", "IN-TH"].includes(`${a.code}-${b.code}`)) html[`${a.code}-${b.code}`] = h;
    if (pairFails.length > 20) break;
  }
  if (pairFails.length) fail(`Pair pages (${pairFails.length} problems; first 20):\n  ${pairFails.slice(0, 20).join("\n  ")}`);
  else console.log(`✓ all ${n.toLocaleString()} pair pages render, one <h1>, no "Varies" in the answer, FAQ JSON-LD matches the page`);

  // Golden pairs: what each MUST and MUST NOT say.
  const word = (h) => h.match(/id="verdict-word">[\s\S]*?<span>([^<]*)<\/span><\/p>/)?.[1];
  const title = (h) => h.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const g = [];
  const expect = (k, cond, msg) => { if (!html[k]) g.push(`${k}: not rendered`); else if (!cond(html[k])) g.push(`${k}: ${msg}`); };
  expect("IN-JP", (h) => word(h) === "eVisa needed", `verdict should be "eVisa needed"`);
  expect("IN-JP", (h) => !/class="vfacts"/.test(h), "has no stored stay or fee, so must show no fact chips");
  expect("IN-JP", (h) => /Yes — eVisa \(\d{4}\)<\/title>|Yes — eVisa \(\d{4}\)/.test(title(h)), "title must end 'Yes — eVisa (year)'");
  expect("US-GB", (h) => word(h) === "Travel authorisation needed", `the UK ETA must not be headlined as an eVisa`);
  expect("DE-BR", (h) => word(h) === "No visa needed" && /Stay up to 90 days/.test(h) && !/class="vhint"/.test(h), "visa-free with a known stay: show the stay, hide the 'check your stamp' hint");
  expect("KP-JP", (h) => word(h) === "Entry not permitted" && !/class="cta official"/.test(h) && !/How much does a/.test(h) && !/class="card apply"/.test(h), "no-admission pages must not show an apply flow, fee question or official apply button");
  expect("IN-TH", (h) => word(h) === "No visa needed", "India → Thailand is visa-free in the data");
  if (g.length) fail(`Golden pairs:\n  ${g.join("\n  ")}`);
  else console.log("✓ golden pairs say what they must (eVisa, ETA, visa-free with stay, no-admission)");
}

// ── typecheck, where this build has TypeScript ───────────────────────────────
{
  const req = createRequire(join(root, "package.json"));
  let tsc = null;
  try { tsc = req.resolve("typescript/bin/tsc"); } catch { /* not installed in this build */ }
  if (!tsc) {
    console.warn("⚠ typecheck SKIPPED: typescript is not installed in this build. Run `pnpm run typecheck` locally before pushing.");
  } else {
    // The apps typecheck against the libraries' BUILT declarations (project
    // references), which a fresh checkout — i.e. every Vercel build — doesn't
    // have. Build them first, exactly as \`pnpm run typecheck\` does locally.
    try { execSync(`node ${JSON.stringify(tsc)} --build`, { cwd: root, stdio: "pipe" }); console.log("✓ library declarations built"); }
    catch (e) { fail(`tsc --build (library declarations) failed:\n${(e.stdout?.toString() ?? "").slice(0, 3000)}`); }
    for (const p of ["artifacts/api-server", "artifacts/visa-checker"]) {
      try { execSync(`node ${JSON.stringify(tsc)} --noEmit -p ${p}`, { cwd: root, stdio: "pipe" }); console.log(`✓ typecheck ${p}`); }
      catch (e) { fail(`typecheck failed in ${p}:\n${(e.stdout?.toString() ?? "").slice(0, 3000)}`); }
    }
  }
}

console.log(`check-drift: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (failures.length) {
  console.error(`\n✗ check-drift found ${failures.length} problem(s) — build stopped so the current deployment stays live:\n`);
  failures.forEach((f, i) => console.error(`${i + 1}. ${f}\n`));
  process.exit(1);
}
