// Site coverage figures.
//
// MUST stay identical to the server: `countries` is the length of
// api-server/src/data/countries.ts.
//
// A build-time constant rather than a value derived from the async countries
// query, so text that uses it paints its final value on the first frame with
// no layout shift. The site previously advertised "199 countries" while the
// checker only ever returns 195.
export const COVERAGE = {
  countries: 195,
} as const;
