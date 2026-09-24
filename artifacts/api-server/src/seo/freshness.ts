// The date a page truthfully reports as "last modified".
//
// Until 2026-09-22 every URL on the site — the sitemap index, all 37,830 pair
// pages, every hub — carried one hand-bumped constant, and nobody had bumped it
// when the redesign changed 1,013 page titles. Bing says it stops trusting
// <lastmod> once the dates look invented; Google uses it only when it is
// "consistently and verifiably accurate". So the date is now assembled from
// three things that are each true on their own:
//
//   CONTENT_UPDATED    the day the WORDING of the pair pages last changed: the
//                      template, the verdict vocabulary, the entry rules. The
//                      deploy guard (scripts/check-drift.mjs) fingerprints
//                      CONTENT_SOURCES and fails the build when they change
//                      without this file being updated, so the date cannot
//                      quietly rot the way the old constant did.
//   DATA_LAST_UPDATED  the day the visa dataset was last reviewed.
//   entry.verifiedOn   per pair: the day that one cell was verified against
//                      an official source.
//
// A pair page reports the latest of the three; a hub the latest of its pairs;
// a sitemap file the latest of its URLs. None of these dates is printed on a
// page — a page names the source and date of an individually verified rule
// instead, where freshness actually matters to a reader.
import { countries, type CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { getVerifiedChanges } from "../data/passportIndexLoader";

/** Day the visa dataset was last reviewed. Bump when the data is refreshed. */
export const DATA_LAST_UPDATED = "2026-09-12";

/**
 * Day the pair-page wording last changed. When the guard reports a new
 * fingerprint: if the change alters what a page says, set this to today and
 * paste the fingerprint; if it is a refactor with identical output, paste the
 * fingerprint and leave the date.
 */
export const CONTENT_UPDATED = "2026-09-21";

/** Files whose text reaches the rendered pair pages, relative to the repo root. */
export const CONTENT_SOURCES = [
  "artifacts/api-server/src/seo/render.ts",
  "artifacts/api-server/src/data/countryDetails.ts",
  "artifacts/api-server/src/data/conditionalExemptions.ts",
  "artifacts/api-server/src/data/officialLinks.ts",
  "lib/travel-data/src/visaStatus.ts",
  "lib/travel-data/src/entryRequirements.ts",
] as const;

/** sha256 (first 16 hex) of CONTENT_SOURCES, checked by scripts/check-drift.mjs. */
export const CONTENT_FINGERPRINT = "1f15daa00ab7bd34";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** The latest ISO date among the arguments; blanks and malformed values are ignored. */
export function latest(...dates: (string | null | undefined)[]): string {
  let best = "";
  for (const d of dates) if (d && ISO.test(d) && d > best) best = d;
  return best || CONTENT_UPDATED;
}

export function pairLastmod(from: CountryData, to: CountryData): string {
  return latest(CONTENT_UPDATED, DATA_LAST_UPDATED, getDefaultEntry(from.code, to.code).verifiedOn);
}

export function passportHubLastmod(from: CountryData): string {
  return latest(...countries.filter((c) => c.code !== from.code).map((to) => pairLastmod(from, to)));
}

export function destinationHubLastmod(to: CountryData): string {
  return latest(...countries.filter((c) => c.code !== to.code).map((from) => pairLastmod(from, to)));
}

let site: string | null = null;
/** The site as a whole: the latest date any pair page reports. */
export function siteLastmod(): string {
  if (!site) site = latest(CONTENT_UPDATED, DATA_LAST_UPDATED, ...getVerifiedChanges().map((c) => c.verifiedOn));
  return site;
}
