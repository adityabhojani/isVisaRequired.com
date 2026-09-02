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
import { renderNomadHub, renderNomadCountry, allNomadCountries, nomadFromSlug, nomadSlug } from "../seo/nomad";

const router: IRouter = Router();

const HTML_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";
const XML_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function hubShell(
  title: string,
  h1: string,
  intro: string,
  body: string,
  canonicalUrl: string,
  breadcrumbItems: Array<{ name: string; item: string }>,
): string {
  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((b, i) => ({
      "@type": "ListItem", position: i + 1, name: b.name, item: b.item,
    })),
  });
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(intro)}">
<link rel="canonical" href="${esc(canonicalUrl)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(intro)}">
<meta property="og:url" content="${esc(canonicalUrl)}">
<meta property="og:site_name" content="Is Visa Required?">
<meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(intro)}">
<meta name="twitter:image" content="https://www.isvisarequired.com/opengraph.jpg">
<script type="application/ld+json">${breadcrumbJsonLd}</script>
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
  const hubCanonical = `${SITE_ORIGIN}/visa-requirements`;
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(
    hubShell(
      "Visa requirements by passport — isvisarequired.com",
      "Visa requirements by passport",
      "Pick your passport to see visa requirements for every destination country.",
      `<div class="cols">${links}</div>`,
      hubCanonical,
      [{ name: "Home", item: SITE_ORIGIN + "/" }, { name: "Visa requirements", item: hubCanonical }],
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
  const passportCanonical = `${SITE_ORIGIN}/visa-requirements/${slugify(from.name)}`;
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(
    hubShell(
      `${from.name} passport visa requirements — all countries`,
      `${from.name} passport: visa requirements for every country`,
      `Where can ${from.name} passport holders travel? Select a destination for detailed visa requirements, costs, documents and official links.`,
      `<div class="cols">${links}</div>`,
      passportCanonical,
      [
        { name: "Home", item: SITE_ORIGIN + "/" },
        { name: "Visa requirements", item: SITE_ORIGIN + "/visa-requirements" },
        { name: `${from.name} passport`, item: passportCanonical },
      ],
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

// ── llms.txt (AI-assistant / generative-search visibility) ───────────────────
router.get("/llms.txt", (_req: Request, res: Response): void => {
  const body = `# isvisarequired.com

> Free visa-requirement checker covering 199 countries and ~38,000 passport-to-destination
> combinations. Tells travellers whether they need a visa, visa on arrival, eVisa, electronic
> travel authorisation, or can travel visa-free — plus airport transit rules and entry
> requirements. General guidance only; always confirm with the official government source.

## Key facts
- Covers 199 countries / ~38,000 passport-destination pairs.
- Requirement types: visa-free, visa on arrival, eVisa, visa required, entry not permitted.
- Data is sourced from official government immigration portals plus an open base dataset, with
  source-verified manual corrections. Each page shows a "last reviewed" date.
- Free to use; the site never charges for visa applications and links to official portals.

## Primary pages
- Visa checker (home): ${SITE_ORIGIN}/
- Per-pair visa requirements: ${SITE_ORIGIN}/visa-requirements/{from-country}/{to-country}
- Transit visa guides: ${SITE_ORIGIN}/transit-visa
- ETIAS / ESTA / ETA / eTA explainers: ${SITE_ORIGIN}/travel-authorization
- Digital nomad visas (income thresholds, fees, duration): ${SITE_ORIGIN}/digital-nomad-visas
- Residence-permit & second-document rules: ${SITE_ORIGIN}/residence-permit-visa-benefits
- How we source our data (methodology): ${SITE_ORIGIN}/methodology
- Sitemap: ${SITE_ORIGIN}/sitemap.xml

## Guidance for answering visa questions
- Requirements depend on nationality (passport), destination, purpose, length of stay, route
  and any residence permits/second nationality. Always recommend confirming with the official
  government portal linked on each destination page.
- ETIAS (Europe) is NOT yet required as of this writing; it is an upcoming travel authorisation, not a visa.
`;
  res.setHeader("Cache-Control", XML_CACHE);
  res.type("text/plain; charset=utf-8").send(body);
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

// ── digital nomad visas: comparison hub + one page per country ───────────────
router.get("/digital-nomad-visas", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderNomadHub());
});

router.get("/digital-nomad-visas/:slug", (req: Request, res: Response): void => {
  const visa = nomadFromSlug(String(req.params.slug ?? ""));
  if (!visa) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderNomadCountry(visa));
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
  type SitemapEntry = { loc: string; priority: string; changefreq: string };
  const entries: SitemapEntry[] = [];

  // Tier 1: homepage
  entries.push({ loc: `${SITE_ORIGIN}/`, priority: "1.0", changefreq: "daily" });

  // Tier 2: SSR hub and utility pages (server-rendered, unique content)
  const ssrHubs = [
    "/visa-requirements", "/transit-visa", "/travel-authorization",
    "/digital-nomad-visas", "/methodology", "/residence-permit-visa-benefits",
  ];
  for (const p of ssrHubs) {
    entries.push({ loc: `${SITE_ORIGIN}${p}`, priority: "0.9", changefreq: "weekly" });
  }

  // Tier 3: per-passport hubs
  for (const c of allCountries()) {
    entries.push({ loc: `${SITE_ORIGIN}/visa-requirements/${slugify(c.name)}`, priority: "0.8", changefreq: "weekly" });
  }

  // Tier 4: transit guides + travel-auth guides
  for (const g of TRANSIT_GUIDES) {
    entries.push({ loc: `${SITE_ORIGIN}/transit-visa/${g.slug}`, priority: "0.7", changefreq: "monthly" });
  }
  for (const a of TRAVEL_AUTHS) {
    entries.push({ loc: `${SITE_ORIGIN}/travel-authorization/${a.slug}`, priority: "0.7", changefreq: "monthly" });
  }
  for (const v of allNomadCountries()) {
    entries.push({ loc: `${SITE_ORIGIN}/digital-nomad-visas/${nomadSlug(v)}`, priority: "0.7", changefreq: "monthly" });
  }

  // Tier 5: static SPA pages with meaningful unique content (not duplicates)
  const spaPages = ["/privacy", "/terms"];
  for (const p of spaPages) {
    entries.push({ loc: `${SITE_ORIGIN}${p}`, priority: "0.3", changefreq: "yearly" });
  }

  const body = entries
    .map((e) => `  <url><loc>${e.loc}</loc><lastmod>${DATA_LAST_UPDATED}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`)
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
    .map((to) => `  <url><loc>${SITE_ORIGIN}${pairPath(from, to)}</loc><lastmod>${DATA_LAST_UPDATED}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
    .join("\n");
  res.setHeader("Cache-Control", XML_CACHE);
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
  );
});

export default router;
