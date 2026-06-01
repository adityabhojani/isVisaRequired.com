// Root-level (non-/api) routes for programmatic SEO:
//   GET /visa-requirements                  → hub of all passports
//   GET /visa-requirements/:from            → all destinations for a passport
//   GET /visa-requirements/:from/:to        → the per-pair page
//   GET /sitemap.xml                         → sitemap index
//   GET /sitemaps/core.xml                   → core + passport + destination pages
//   GET /sitemaps/pairs-:code.xml            → all pairs for one passport
import { Router, type IRouter, type Request, type Response } from "express";
import {
  allCountries,
  countryFromSlug,
  pairPath,
  renderPairPage,
  renderPairNotFound,
  slugify,
  SITE_ORIGIN,
  DATA_LAST_UPDATED,
} from "../seo/render";
import { renderTransitHub, renderTransitGuide } from "../seo/transit";
import { TRANSIT_GUIDES, getTransitGuide } from "../data/transitData";
import { renderAuthHub, renderAuthGuide } from "../seo/auth";
import { TRAVEL_AUTHS, getTravelAuth } from "../data/authData";
import { renderMethodology } from "../seo/methodology";
import { renderResidence } from "../seo/residence";

const router: IRouter = Router();

const HTML_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";
const XML_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function hubShell(title: string, h1: string, intro: string, body: string): string {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(intro)}">
<link rel="canonical" href="${esc(SITE_ORIGIN)}">
<meta name="robots" content="index,follow">
<link rel="icon" href="/favicon.svg">
<style>:root{--navy:#0A2FA1;--accent:#0DB5E8;--bg:#F7F9FC;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{color:var(--navy)}.wrap{max-width:960px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{font-weight:800;color:var(--navy);text-decoration:none;font-size:18px}.logo span{color:var(--accent)}
h1{font-size:26px;margin:18px 0 6px}.intro{color:var(--muted);margin-bottom:18px}
.cols{column-width:220px;column-gap:24px}.cols a{display:block;padding:5px 0;text-decoration:none;font-size:15px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}</style></head>
<body><header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>
<main class="wrap"><h1>${esc(h1)}</h1><p class="intro">${esc(intro)}</p>${body}</main>
<footer class="site"><div class="wrap">© isvisarequired.com — always confirm with official government sources. Updated ${esc(DATA_LAST_UPDATED)}.</div></footer></body></html>`;
}

// ── hub: all passports ───────────────────────────────────────────────────────
router.get("/visa-requirements", (_req: Request, res: Response): void => {
  const links = allCountries()
    .map((c) => `<a href="/visa-requirements/${slugify(c.name)}">${esc(c.flag)} ${esc(c.name)} passport</a>`)
    .join("");
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(
    hubShell(
      "Visa requirements by passport — isvisarequired.com",
      "Visa requirements by passport",
      "Pick your passport to see visa requirements for every destination country.",
      `<div class="cols">${links}</div>`,
    ),
  );
});

// ── hub: one passport → all destinations ─────────────────────────────────────
router.get("/visa-requirements/:from", (req: Request, res: Response): void => {
  const from = countryFromSlug(req.params.from);
  if (!from) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  const links = allCountries()
    .filter((c) => c.code !== from.code)
    .map((c) => `<a href="${pairPath(from, c)}">${esc(from.name)} → ${esc(c.flag)} ${esc(c.name)}</a>`)
    .join("");
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(
    hubShell(
      `${from.name} passport visa requirements — all countries`,
      `${from.name} passport: visa requirements for every country`,
      `Where can ${from.name} passport holders travel? Select a destination for detailed visa requirements, costs, documents and official links.`,
      `<div class="cols">${links}</div>`,
    ),
  );
});

// ── transit-visa hub + per-hub guides ────────────────────────────────────────
router.get("/transit-visa", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderTransitHub());
});

router.get("/transit-visa/:slug", (req: Request, res: Response): void => {
  const guide = getTransitGuide(req.params.slug);
  if (!guide) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderTransitGuide(guide));
});

// ── methodology / how-we-source-data (E-E-A-T) ───────────────────────────────
router.get("/methodology", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderMethodology());
});

router.get("/residence-permit-visa-benefits", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderResidence());
});

// ── travel-authorization hub + guides (ETIAS / ESTA / ETA / eTA) ─────────────
router.get("/travel-authorization", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderAuthHub());
});

router.get("/travel-authorization/:slug", (req: Request, res: Response): void => {
  const guide = getTravelAuth(req.params.slug);
  if (!guide) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderAuthGuide(guide));
});

// ── per-pair page ────────────────────────────────────────────────────────────
router.get("/visa-requirements/:from/:to", (req: Request, res: Response): void => {
  const from = countryFromSlug(req.params.from);
  const to = countryFromSlug(req.params.to);
  if (!from || !to || from.code === to.code) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderPairPage(from, to));
});

// ── sitemaps ─────────────────────────────────────────────────────────────────
router.get("/sitemap.xml", (_req: Request, res: Response): void => {
  const sitemaps = [
    `${SITE_ORIGIN}/sitemaps/core.xml`,
    ...allCountries().map((c) => `${SITE_ORIGIN}/sitemaps/pairs-${c.code}.xml`),
  ];
  const body = sitemaps
    .map((loc) => `  <sitemap><loc>${loc}</loc><lastmod>${DATA_LAST_UPDATED}</lastmod></sitemap>`)
    .join("\n");
  res.setHeader("Cache-Control", XML_CACHE);
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`,
  );
});

router.get("/sitemaps/core.xml", (_req: Request, res: Response): void => {
  const staticPaths = [
    "/", "/compare", "/discover", "/stats", "/popular", "/map", "/trip-planner",
    "/schengen", "/tier-list", "/digital-nomad", "/reciprocity", "/blog", "/alerts",
    "/visa-requirements", "/methodology", "/residence-permit-visa-benefits", "/privacy", "/terms",
  ];
  const urls: string[] = [];
  for (const p of staticPaths) urls.push(`${SITE_ORIGIN}${p}`);
  urls.push(`${SITE_ORIGIN}/transit-visa`);
  for (const g of TRANSIT_GUIDES) urls.push(`${SITE_ORIGIN}/transit-visa/${g.slug}`);
  urls.push(`${SITE_ORIGIN}/travel-authorization`);
  for (const a of TRAVEL_AUTHS) urls.push(`${SITE_ORIGIN}/travel-authorization/${a.slug}`);
  for (const c of allCountries()) {
    urls.push(`${SITE_ORIGIN}/passport/${c.code}`);
    urls.push(`${SITE_ORIGIN}/destination/${c.code}`);
    urls.push(`${SITE_ORIGIN}/visa-requirements/${slugify(c.name)}`);
  }
  const body = urls
    .map((loc) => `  <url><loc>${loc}</loc><lastmod>${DATA_LAST_UPDATED}</lastmod></url>`)
    .join("\n");
  res.setHeader("Cache-Control", XML_CACHE);
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
  );
});

router.get("/sitemaps/pairs-:code.xml", (req: Request, res: Response): void => {
  const code = String(req.params.code).toUpperCase();
  const from = allCountries().find((c) => c.code === code);
  if (!from) {
    res.status(404).setHeader("Cache-Control", "no-store").type("application/xml").send("<error>unknown</error>");
    return;
  }
  const body = allCountries()
    .filter((c) => c.code !== from.code)
    .map((to) => `  <url><loc>${SITE_ORIGIN}${pairPath(from, to)}</loc><lastmod>${DATA_LAST_UPDATED}</lastmod><changefreq>monthly</changefreq></url>`)
    .join("\n");
  res.setHeader("Cache-Control", XML_CACHE);
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
  );
});

export default router;
