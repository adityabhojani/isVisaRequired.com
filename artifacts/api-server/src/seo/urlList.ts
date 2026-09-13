// The site's indexable URL inventory, in the order we want search engines to
// see it. One definition, used by both /sitemaps/core.xml and the daily
// URL-submission job, so the two can never drift apart.
import { allCountries, pairPath, slugify, SITE_ORIGIN } from "./render";
import { TRANSIT_GUIDES } from "../data/transitData";
import { TRAVEL_AUTHS } from "../data/authData";
import { GUIDES } from "../data/guidesData";
import { REPORT_PATH, WELCOMING_PATH } from "./report";
import { CHANGES_PATH } from "./visaChanges";
import { staticPostsNewestFirst } from "../content/posts";

/** Landing pages and tools. */
export const STATIC_PATHS = [
  "/", "/compare", "/dual-citizenship", "/discover", "/stats", "/popular", "/map", "/trip-planner",
  "/schengen", "/tier-list", "/digital-nomad", "/reciprocity", "/blog", "/alerts",
  "/visa-requirements", "/countries", "/methodology", "/residence-permit-visa-benefits", "/privacy", "/terms",
];

/**
 * Everything in /sitemaps/core.xml: landing pages, guides, reports and the two
 * per-country hubs. Roughly 450 URLs.
 */
export function coreUrls(): string[] {
  const urls: string[] = [];
  for (const p of STATIC_PATHS) urls.push(`${SITE_ORIGIN}${p}`);
  urls.push(`${SITE_ORIGIN}/transit-visa`);
  for (const g of TRANSIT_GUIDES) urls.push(`${SITE_ORIGIN}/transit-visa/${g.slug}`);
  urls.push(`${SITE_ORIGIN}/travel-authorization`);
  for (const a of TRAVEL_AUTHS) urls.push(`${SITE_ORIGIN}/travel-authorization/${a.slug}`);
  urls.push(`${SITE_ORIGIN}${REPORT_PATH}`);
  urls.push(`${SITE_ORIGIN}${WELCOMING_PATH}`);
  urls.push(`${SITE_ORIGIN}${CHANGES_PATH}`);
  urls.push(`${SITE_ORIGIN}/guides`);
  for (const g of GUIDES) urls.push(`${SITE_ORIGIN}/guides/${g.slug}`);
  // The SPA's /passport/{code} and /destination/{code} routes canonicalise to
  // these, so only the canonical form is ever advertised.
  for (const c of allCountries()) {
    urls.push(`${SITE_ORIGIN}/visa-requirements/${slugify(c.name)}`);
    urls.push(`${SITE_ORIGIN}/countries/${slugify(c.name)}`);
  }
  return urls;
}

/** Blog posts that ship in the repo. Database posts are added by the caller. */
export function staticBlogUrls(): string[] {
  return staticPostsNewestFirst().map((p) => `${SITE_ORIGIN}/blog/${p.slug}`);
}

/**
 * Every passport → destination page: 195 × 194 ≈ 37,830 URLs.
 *
 * Ordered breadth-first across passports rather than country by country, so a
 * daily submission budget spreads over the whole world instead of exhausting
 * itself on Afghanistan. Materialising the array costs a few MB and about a
 * hundred milliseconds; only the submission job asks for it.
 */
export function pairUrls(): string[] {
  const list = allCountries();
  const n = list.length;
  const urls: string[] = [];
  for (let offset = 1; offset < n; offset++) {
    for (let i = 0; i < n; i++) {
      const from = list[i];
      const to = list[(i + offset) % n];
      if (!from || !to || from.code === to.code) continue;
      urls.push(`${SITE_ORIGIN}${pairPath(from, to)}`);
    }
  }
  return urls;
}
