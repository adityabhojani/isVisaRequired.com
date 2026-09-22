// Cache-Control values for JSON the API serves to everyone.
//
// The CDN only caches a function response when the header carries `s-maxage`
// (Vercel: "you must include Cache-Control headers with s-maxage"). Until
// 2026-09-22 the visa endpoints sent a bare `max-age=86400`, which the browser
// honours and the CDN merely tolerates, and /api/countries sent nothing at all
// — so the 195-country list, fetched by fifteen pages, ran a function on every
// page view of every visitor and every bot. A CDN hit costs no function
// invocation, no CPU and no origin transfer; on a free plan that is the budget.
//
// `max-age` (the browser) stays short so a corrected fact reaches a returning
// reader within the hour; `s-maxage` (the CDN) can be a day because every
// deployment purges the CDN, and a fact fix is a deployment.

/** Data that only changes with a deployment: countries, visa answers, rankings. */
export const CACHE_STATIC = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

/** Data that changes rarely but not only on deploy: cache status, counts. */
export const CACHE_SHORT = "public, max-age=300, s-maxage=300, stale-while-revalidate=3600";

/** Editable content (blog, site settings): a minute stale is fine, a day is not. */
export const CACHE_EDITABLE = "public, max-age=60, s-maxage=60, stale-while-revalidate=300";
