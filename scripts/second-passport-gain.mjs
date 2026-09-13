// Which second passport actually adds the most destinations?
//
// Produces the figures behind /blog/which-second-passport-adds-the-most-countries.
// Run it to reproduce or refresh them:
//
//   node scripts/second-passport-gain.mjs            # headline pairs
//   node scripts/second-passport-gain.mjs DE         # best seconds for one passport
//   node scripts/second-passport-gain.mjs DE BJ      # the exact countries one pair adds
//
// METHOD. "Access" counts destinations a passport enters visa-free or with a visa on
// arrival, out of the other 194. eVisas and ETAs are deliberately excluded: both require
// applying before you travel, which is the thing a second passport is supposed to save
// you. That is the same openness measure as the Most Welcoming Countries Index.
//
// "Gain" is what the second passport adds that the first does not already have — the
// figure that actually matters and that absolute passport rankings never show.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ESBUILD = join(ROOT, "artifacts/api-server/node_modules/.bin/esbuild");
const work = mkdtempSync(join(tmpdir(), "spg-"));

try {
  const entry = join(work, "entry.ts");
  const bundle = join(work, "entry.mjs");
  const src = `
import { getDefaultEntry } from ${JSON.stringify(join(ROOT, "artifacts/api-server/src/data/visaData"))};
import { countries } from ${JSON.stringify(join(ROOT, "artifacts/api-server/src/data/countries"))};
const OPEN = new Set(["visa_free", "visa_on_arrival"]);
const codes = countries.map((c) => c.code);
export const nameOf = new Map(countries.map((c) => [c.code, c.name]));
export const open = new Map();
for (const p of codes) {
  const s = new Set();
  for (const d of codes) if (d !== p && OPEN.has(getDefaultEntry(p, d).requirement)) s.add(d);
  open.set(p, s);
}
export const allCodes = codes;
`;
  execFileSync("node", ["-e", `require("fs").writeFileSync(${JSON.stringify(entry)}, ${JSON.stringify(src)})`]);
  execFileSync(ESBUILD, [entry, "--bundle", "--format=esm", "--platform=node", `--outfile=${bundle}`, "--log-level=error"]);
  const { open, nameOf, allCodes } = await import(`file://${bundle}`);

  const access = (p) => open.get(p).size;
  const addedBy = (base, second) =>
    [...open.get(second)].filter((d) => d !== base && d !== second && !open.get(base).has(d))
      .map((d) => nameOf.get(d)).sort();

  const [base, second] = process.argv.slice(2).map((s) => s.toUpperCase());

  if (base && second) {
    const list = addedBy(base, second);
    console.log(`${nameOf.get(base)} (${access(base)}) + ${nameOf.get(second)} (${access(second)}) = +${list.length}`);
    console.log(list.join(", ") || "(nothing)");
  } else if (base) {
    const ranked = allCodes.filter((s) => s !== base)
      .map((s) => ({ s, gain: addedBy(base, s).length, own: access(s) }))
      .sort((a, b) => b.gain - a.gain || b.own - a.own);
    console.log(`${nameOf.get(base)} already reaches ${access(base)} of 194.\nBest second passports by what they ADD:`);
    for (const r of ranked.slice(0, 15)) {
      console.log(`  +${String(r.gain).padStart(3)}  ${nameOf.get(r.s)} (reaches ${r.own} on its own)`);
    }
  } else {
    const HEADLINE = [["DE", "IE"], ["DE", "BJ"], ["DE", "AE"], ["US", "GB"], ["US", "AE"],
      ["GB", "BJ"], ["JP", "TN"], ["IN", "AE"], ["PK", "AE"], ["NG", "AE"]];
    for (const [a, b] of HEADLINE) {
      console.log(`${nameOf.get(a)} (${access(a)}) + ${nameOf.get(b)} (${access(b)}) = +${addedBy(a, b).length}`);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
