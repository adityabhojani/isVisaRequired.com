// URL helpers shared by every server-rendered page. Changing any of them changes
// URLs across the whole site, so the deploy guard fingerprints this file for
// both the pair pages and the hubs (seo/freshness.ts).
import type { CountryData } from "../data/countries";

// Canonical host (matches existing sitemap/robots). Keep in sync with robots.txt.
export const SITE_ORIGIN = "https://www.isvisarequired.com";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pairPath(from: CountryData, to: CountryData): string {
  return `/visa-requirements/${slugify(from.name)}/${slugify(to.name)}`;
}
