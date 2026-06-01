#!/usr/bin/env node
// Refreshes the base visa dataset from the upstream open-source Passport Index
// dataset and reports exactly what changed.
//
// What it does:
//   1. Downloads the latest upstream matrix CSV.
//   2. Compares it cell-by-cell with our committed base CSV
//      (artifacts/api-server/src/data/passport-index.csv).
//   3. Prints a human-readable summary of every changed country pair.
//   4. Writes the new data into the base CSV (unless run with --check).
//
// Manual corrections in artifacts/api-server/src/data/visa-overrides.ts are NOT
// touched — they are applied on top of this base file at runtime and always win.
// So refreshing the base can never silently undo a verified correction.
//
// Usage:
//   node scripts/refresh-visa-data.mjs          # update the base CSV if changed
//   node scripts/refresh-visa-data.mjs --check   # report only, do not write
//
// Run automatically every week by .github/workflows/refresh-visa-data.yml,
// which opens a Pull Request whenever upstream changes — so the data can never
// silently rot.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const UPSTREAM_URL =
  "https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-matrix.csv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(
  scriptDir,
  "../artifacts/api-server/src/data/passport-index.csv",
);

const checkOnly = process.argv.includes("--check");

function parseMatrix(text) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const header = lines[0].split(",").map((s) => s.trim());
  const dests = header.slice(1);
  const grid = new Map(); // passport -> Map(dest -> value)
  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    const passport = cols[0].trim();
    const row = new Map();
    for (let j = 1; j < cols.length; j++) {
      row.set(dests[j - 1], (cols[j] ?? "").trim());
    }
    grid.set(passport, row);
  }
  return grid;
}

async function main() {
  let upstreamText;
  try {
    const res = await fetch(UPSTREAM_URL, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    upstreamText = await res.text();
  } catch (err) {
    console.error(`ERROR: could not fetch upstream dataset: ${err.message}`);
    process.exit(2);
  }

  const baseText = readFileSync(CSV_PATH, "utf-8");
  if (upstreamText.replace(/\r/g, "") === baseText.replace(/\r/g, "")) {
    console.log("Visa base dataset is already up to date with upstream. No changes.");
    return;
  }

  const base = parseMatrix(baseText);
  const next = parseMatrix(upstreamText);

  const changes = [];
  for (const [passport, row] of next) {
    const baseRow = base.get(passport);
    for (const [dest, val] of row) {
      const old = baseRow?.get(dest);
      if (old !== undefined && old !== val) {
        changes.push({ passport, dest, old, new: val });
      }
    }
  }

  // Markdown summary (used as the Pull Request body in CI)
  console.log(`## Visa data: ${changes.length} upstream change(s) detected\n`);
  console.log(
    `Source: [ilyankou/passport-index-dataset](${UPSTREAM_URL})\n`,
  );
  console.log(
    "> Manual corrections in `visa-overrides.ts` are applied on top of this file and are unaffected. Review the changes below before merging.\n",
  );
  if (changes.length) {
    console.log("| Passport | Destination | Old | New |");
    console.log("|---|---|---|---|");
    for (const c of changes.sort((a, b) =>
      `${a.passport}${a.dest}`.localeCompare(`${b.passport}${b.dest}`),
    )) {
      console.log(`| ${c.passport} | ${c.dest} | ${c.old} | ${c.new} |`);
    }
  }

  if (checkOnly) {
    console.log(`\n(--check) Not writing. ${changes.length} cell change(s) pending.`);
    return;
  }

  writeFileSync(CSV_PATH, upstreamText, "utf-8");
  console.log(`\nUpdated ${path.relative(process.cwd(), CSV_PATH)} (${changes.length} cell change(s)).`);
}

main();
