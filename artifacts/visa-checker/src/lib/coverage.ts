// Site coverage figures.
//
// MUST stay identical to the server: `countries` is the length of
// api-server/src/data/countries.ts, `pairs` is countries x (countries - 1) —
// the same total api-server/src/seo/report.ts computes — and `lastReviewed`
// is DATA_LAST_UPDATED from api-server/src/seo/render.ts.
//
// Build-time constants rather than values derived from the async countries
// query, so the hero paints its final text on the first frame with no layout
// shift. The site previously advertised "199 countries" and "39,601
// combinations" (199 squared, which counts every country against itself)
// while the checker only ever returns 195.
export const COVERAGE = {
  countries: 195,
  pairs: 37830,
  pairsLabel: "37,830",
  lastReviewed: "2026-08-25",
  lastReviewedLabel: "25 Aug 2026",
} as const;
