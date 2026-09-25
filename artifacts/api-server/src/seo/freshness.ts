// The date a page truthfully reports as "last modified".
//
// Until 2026-09-22 every URL on the site — the sitemap index, all 37,830 pair
// pages, every hub — carried one hand-bumped constant, and nobody had bumped it
// when the redesign changed 1,013 page titles. Bing says it stops trusting
// <lastmod> once the dates look invented; Google uses it only when it is
// "consistently and verifiably accurate". So the date is now assembled from
// things that are each true on their own:
//
//   CONTENT_UPDATED    the day the WORDING of the pair pages last changed: the
//                      template, the verdict vocabulary, the entry rules.
//   DESTINATION_HUB_UPDATED, PASSPORT_HUB_UPDATED
//                      the same, for each kind of hub page. The hubs have their
//                      own templates: on 2026-09-23 every destination hub was
//                      retitled while no pair page changed, and the sitemap went
//                      on saying 2026-09-21 because hubs borrowed the pair-page
//                      date. They no longer do.
//   DATA_LAST_UPDATED  the day the visa dataset was last reviewed.
//   entry.verifiedOn   per pair: the day that one cell was verified against
//                      an official source.
//
// The deploy guard (scripts/check-drift.mjs) fingerprints the files behind each
// kind of page (FRESHNESS_CHECKS below) and fails the build when they change
// without this file being updated, so no date can quietly rot the way the old
// constant did.
//
// A pair page reports the latest of CONTENT_UPDATED, DATA_LAST_UPDATED and its
// own verifiedOn. A hub reports the latest of its own kind's date, any date set
// for that one hub, DATA_LAST_UPDATED and the verifiedOn of every cell it lists.
// A sitemap file reports the latest of its URLs. None of these dates is printed
// on a page — a page names the source and date of an individually verified rule
// instead, where freshness actually matters to a reader.
import { countries, type CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { getVerifiedChanges } from "../data/passportIndexLoader";

/** Day the visa dataset was last reviewed. Bump when the data is refreshed. */
export const DATA_LAST_UPDATED = "2026-09-12";

// ── pair pages (/visa-requirements/{passport}/{destination}) ─────────────────

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
  "artifacts/api-server/src/seo/urls.ts", // every link on the page
  "artifacts/api-server/src/seo/guideLinks.ts", // the guide tiles under "Keep going"
  "artifacts/api-server/src/data/countryDetails.ts",
  "artifacts/api-server/src/data/conditionalExemptions.ts",
  "artifacts/api-server/src/data/officialLinks.ts",
  "lib/travel-data/src/visaStatus.ts",
  "lib/travel-data/src/entryRequirements.ts",
] as const;

/** Bundled into the pair pages but deliberately not fingerprinted, with the reason. */
export const CONTENT_NOT_TRACKED: Record<string, string> = {
  "artifacts/api-server/src/seo/shell.ts": "site chrome (header, footer, base CSS) and the one-word \"Keep going\" heading; the links under it come from guideLinks.ts",
  "lib/travel-data/src/siteNav.ts": "navigation links in the site chrome",
  "lib/travel-data/src/designTokens.ts": "colours and fonts",
  "lib/travel-data/src/index.ts": "the package's entry file: re-exports and nomad-visa data, no pair-page text",
  "artifacts/api-server/src/data/countries.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "artifacts/api-server/src/data/visaData.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "artifacts/api-server/src/data/passportIndexLoader.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "artifacts/api-server/src/data/visa-overrides.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "artifacts/api-server/src/seo/freshness.ts": "this file: dates and the check's own lists, no page text (fingerprinting it would make every date edit need a new fingerprint)",
};

/** sha256 (first 16 hex) of CONTENT_SOURCES, checked by scripts/check-drift.mjs. */
export const CONTENT_FINGERPRINT = "418ef72df4947134";

// ── hubs ─────────────────────────────────────────────────────────────────────
// Same rule as the pair pages, one set per kind of hub. When the guard reports a
// new fingerprint, it prints exactly what to edit. In short: always paste the
// fingerprint; then, if what EVERY page of that kind says changed (title,
// description, headings, text, FAQ, links), set its date to today; if only some
// of them changed, date just those in its *_PAGES_UPDATED map; if only styling
// or code structure changed, change nothing else. Never set a date earlier than
// it already is.
//
// Each *_SOURCES list is every repo file the guard finds inside that hub's
// rendered bundle, minus the ones in *_NOT_TRACKED, each with its reason. The
// guard fails when the bundle gains a file that is on neither list, so hub text
// cannot move into a new file without being fingerprinted.

/** Files in both hub bundles that carry no hub wording: site chrome, status styling, the dataset, this file. */
const HUB_CHROME_AND_DATA = {
  "artifacts/api-server/src/seo/shell.ts": "header, footer and base CSS of every page: site chrome, not the hub's content",
  "lib/travel-data/src/siteNav.ts": "navigation links in the site chrome",
  "lib/travel-data/src/designTokens.ts": "colours and fonts",
  "artifacts/api-server/src/data/countries.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "artifacts/api-server/src/data/visaData.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "artifacts/api-server/src/data/passportIndexLoader.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "artifacts/api-server/src/data/visa-overrides.ts": "the dataset, dated by DATA_LAST_UPDATED and per-cell verifiedOn",
  "lib/travel-data/src/index.ts": "the package's entry file: re-exports and nomad-visa data, no hub text",
  "lib/travel-data/src/visaStatus.ts": "status icons and colours only: no status word is printed on a hub (hubLayout's statusBadge/statusStat, which print them, are used only by the guides)",
  "artifacts/api-server/src/seo/freshness.ts": "this file: dates and the check's own lists, no page text (fingerprinting it would make every date edit need a new fingerprint)",
} as const;

/** Day the destination hubs' (/countries/{country}) wording last changed: a75f4f6 retitled all of them, live 2026-09-23. */
export const DESTINATION_HUB_UPDATED = "2026-09-23";

/** Destination hubs whose own wording changed later than DESTINATION_HUB_UPDATED, by country code, e.g. { HR: "2026-10-01" }. */
export const DESTINATION_HUB_PAGES_UPDATED: Record<string, string> = {};

/** Files whose text reaches the destination hubs, relative to the repo root. */
export const DESTINATION_HUB_SOURCES = [
  "artifacts/api-server/src/seo/destinationHub.ts",
  "artifacts/api-server/src/seo/hubLayout.ts",
  "artifacts/api-server/src/seo/guideLinks.ts",
  "artifacts/api-server/src/seo/urls.ts", // every link on the page
  // report.ts and welcoming.ts also hold the report pages' own text. If only that
  // changed, the hubs did not: paste the fingerprint and change nothing else.
  "artifacts/api-server/src/seo/report.ts", // the Most Welcoming Countries Index link and ranking
  "artifacts/api-server/src/seo/welcoming.ts", // the "ranks #N of …" sentence (opennessRankOf)
  "artifacts/api-server/src/data/conditionalExemptions.ts", // the "enter visa-free with a US/UK/Schengen visa" lists
  "lib/travel-data/src/entryRequirements.ts", // the entry rules summarised on each hub
] as const;

/** Bundled into the destination hubs but deliberately not fingerprinted, with the reason. */
export const DESTINATION_HUB_NOT_TRACKED: Record<string, string> = { ...HUB_CHROME_AND_DATA };

/** sha256 (first 16 hex) of DESTINATION_HUB_SOURCES, checked by scripts/check-drift.mjs. */
export const DESTINATION_HUB_FINGERPRINT = "46a355c277ee0334";

/**
 * Day the passport hubs' (/visa-requirements/{passport}) last changed: 46cffc5
 * restyled all of them on 2026-09-21. Their wording last changed on 2026-09-16
 * (2143148); 2026-09-21 is kept because it is the date already published and a
 * date must never move backwards.
 */
export const PASSPORT_HUB_UPDATED = "2026-09-21";

/** Passport hubs whose own wording changed later than PASSPORT_HUB_UPDATED, by country code, e.g. { IN: "2026-10-01" }. */
export const PASSPORT_HUB_PAGES_UPDATED: Record<string, string> = {};

/** Files whose text reaches the passport hubs, relative to the repo root. */
export const PASSPORT_HUB_SOURCES = [
  "artifacts/api-server/src/seo/passportHub.ts",
  "artifacts/api-server/src/seo/hubLayout.ts",
  "artifacts/api-server/src/seo/guideLinks.ts",
  "artifacts/api-server/src/seo/urls.ts", // every link on the page
] as const;

/** Bundled into the passport hubs but deliberately not fingerprinted, with the reason. */
export const PASSPORT_HUB_NOT_TRACKED: Record<string, string> = {
  ...HUB_CHROME_AND_DATA,
  "artifacts/api-server/src/data/guidesData.ts": "only passportRoundupLinks() reaches these pages, and the guard fingerprints its result",
  "lib/travel-data/src/entryRequirements.ts": "bundled through the package's entry file; the passport hubs never read it",
};

/** sha256 (first 16 hex) of PASSPORT_HUB_SOURCES followed by passportRoundupLinks(), checked by scripts/check-drift.mjs. */
export const PASSPORT_HUB_FINGERPRINT = "f9ee7b0de07893bd";

// ── what the deploy guard checks ─────────────────────────────────────────────
// One entry per kind of page. `names` are the constants above, so the guard can
// say exactly which line to edit. `renderer` lets the guard bundle the page's
// template and compare the files inside it with `sources` + `notTracked`.
export interface FreshnessCheck {
  label: string;
  names: { updated: string; sources: string; fingerprint: string; pages?: string; notTracked?: string };
  updated: string;
  sources: readonly string[];
  fingerprint: string;
  pages?: Record<string, string>;
  /** A function whose result is fingerprinted too, for a large file of which only a little reaches these pages. */
  derived?: { file: string; exportName: string };
  renderer?: { file: string; exportName: string };
  notTracked?: Record<string, string>;
}

export const FRESHNESS_CHECKS: FreshnessCheck[] = [
  {
    label: "pair pages (/visa-requirements/{passport}/{destination})",
    names: { updated: "CONTENT_UPDATED", sources: "CONTENT_SOURCES", fingerprint: "CONTENT_FINGERPRINT", notTracked: "CONTENT_NOT_TRACKED" },
    updated: CONTENT_UPDATED, sources: CONTENT_SOURCES, fingerprint: CONTENT_FINGERPRINT, notTracked: CONTENT_NOT_TRACKED,
    renderer: { file: "artifacts/api-server/src/seo/render.ts", exportName: "renderPairPage" },
  },
  {
    label: "destination hubs (/countries/{country})",
    names: { updated: "DESTINATION_HUB_UPDATED", sources: "DESTINATION_HUB_SOURCES", fingerprint: "DESTINATION_HUB_FINGERPRINT", pages: "DESTINATION_HUB_PAGES_UPDATED", notTracked: "DESTINATION_HUB_NOT_TRACKED" },
    updated: DESTINATION_HUB_UPDATED, sources: DESTINATION_HUB_SOURCES, fingerprint: DESTINATION_HUB_FINGERPRINT,
    pages: DESTINATION_HUB_PAGES_UPDATED, notTracked: DESTINATION_HUB_NOT_TRACKED,
    renderer: { file: "artifacts/api-server/src/seo/destinationHub.ts", exportName: "renderDestinationHub" },
  },
  {
    label: "passport hubs (/visa-requirements/{passport})",
    names: { updated: "PASSPORT_HUB_UPDATED", sources: "PASSPORT_HUB_SOURCES", fingerprint: "PASSPORT_HUB_FINGERPRINT", pages: "PASSPORT_HUB_PAGES_UPDATED", notTracked: "PASSPORT_HUB_NOT_TRACKED" },
    updated: PASSPORT_HUB_UPDATED, sources: PASSPORT_HUB_SOURCES, fingerprint: PASSPORT_HUB_FINGERPRINT,
    pages: PASSPORT_HUB_PAGES_UPDATED, notTracked: PASSPORT_HUB_NOT_TRACKED,
    derived: { file: "artifacts/api-server/src/data/guidesData.ts", exportName: "passportRoundupLinks" },
    renderer: { file: "artifacts/api-server/src/seo/passportHub.ts", exportName: "renderPassportHub" },
  },
];

// ── the dates ────────────────────────────────────────────────────────────────

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

/** A pairs-XX.xml sitemap file: the latest of the pair pages it lists (never a hub date). */
export function pairsSitemapLastmod(from: CountryData): string {
  return latest(...countries.filter((c) => c.code !== from.code).map((to) => pairLastmod(from, to)));
}

export function passportHubLastmod(from: CountryData): string {
  return latest(
    PASSPORT_HUB_UPDATED, PASSPORT_HUB_PAGES_UPDATED[from.code], DATA_LAST_UPDATED,
    ...countries.filter((c) => c.code !== from.code).map((to) => getDefaultEntry(from.code, to.code).verifiedOn),
  );
}

export function destinationHubLastmod(to: CountryData): string {
  return latest(
    DESTINATION_HUB_UPDATED, DESTINATION_HUB_PAGES_UPDATED[to.code], DATA_LAST_UPDATED,
    ...countries.filter((c) => c.code !== to.code).map((from) => getDefaultEntry(from.code, to.code).verifiedOn),
  );
}

let site: string | null = null;
/** The site as a whole: the latest date any pair page reports. */
export function siteLastmod(): string {
  if (!site) site = latest(CONTENT_UPDATED, DATA_LAST_UPDATED, ...getVerifiedChanges().map((c) => c.verifiedOn));
  return site;
}
