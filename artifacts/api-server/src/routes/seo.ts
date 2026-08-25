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
import { renderPassportHub } from "../seo/passportHub";
import { renderDestinationHub } from "../seo/destinationHub";
import { GUIDES, getGuide } from "../data/guidesData";
import { renderGuidesHub, renderGuide } from "../seo/guides";
import { ROUTE_SEO, renderAppRoute, loadShell } from "../seo/appShell";
import { renderBlogPostShell, type BlogPostRow } from "../seo/blogSeo";
import { db, isDatabaseConfigured } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const HTML_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";
const XML_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function hubShell(title: string, h1: string, intro: string, body: string, canonical: string = SITE_ORIGIN): string {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(intro)}">
<link rel="canonical" href="${esc(canonical)}">
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
      `${SITE_ORIGIN}/visa-requirements`,
    ),
  );
});

// ── hub: one passport → all destinations (rich passport hub) ─────────────────
router.get("/visa-requirements/:from", (req: Request, res: Response): void => {
  const from = countryFromSlug(req.params.from as string);
  if (!from) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderPassportHub(from));
});

// ── hub: all destinations index ──────────────────────────────────────────────
router.get("/countries", (_req: Request, res: Response): void => {
  const links = allCountries()
    .map((c) => `<a href="/countries/${slugify(c.name)}">${esc(c.flag)} ${esc(c.name)} visa requirements</a>`)
    .join("");
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(
    hubShell(
      "Visa requirements by country — isvisarequired.com",
      "Visa requirements by destination country",
      "Pick a destination to see which nationalities need a visa, who can enter visa-free, and the country's entry requirements.",
      `<div class="cols">${links}</div>`,
      `${SITE_ORIGIN}/countries`,
    ),
  );
});

// ── hub: one destination → who needs a visa (rich destination hub) ───────────
router.get("/countries/:slug", (req: Request, res: Response): void => {
  const to = countryFromSlug(req.params.slug as string);
  if (!to) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderDestinationHub(to));
});

// ── transit-visa hub + per-hub guides ────────────────────────────────────────
router.get("/transit-visa", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderTransitHub());
});

router.get("/transit-visa/:slug", (req: Request, res: Response): void => {
  const guide = getTransitGuide(req.params.slug as string);
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
  const guide = getTravelAuth(req.params.slug as string);
  if (!guide) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderAuthGuide(guide));
});

// ── editorial cornerstone guides ─────────────────────────────────────────────
router.get("/guides", (_req: Request, res: Response): void => {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderGuidesHub());
});

router.get("/guides/:slug", (req: Request, res: Response): void => {
  const guide = getGuide(req.params.slug as string);
  if (!guide) {
    res.status(404).setHeader("Cache-Control", "no-store");
    res.type("html").send(renderPairNotFound());
    return;
  }
  res.setHeader("Cache-Control", HTML_CACHE);
  res.type("html").send(renderGuide(guide));
});

// ── per-pair page ────────────────────────────────────────────────────────────
router.get("/visa-requirements/:from/:to", (req: Request, res: Response): void => {
  const from = countryFromSlug(req.params.from as string);
  const to = countryFromSlug(req.params.to as string);
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
    `${SITE_ORIGIN}/sitemaps/blog.xml`,
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
    "/visa-requirements", "/countries", "/methodology", "/residence-permit-visa-benefits", "/privacy", "/terms",
  ];
  const urls: string[] = [];
  for (const p of staticPaths) urls.push(`${SITE_ORIGIN}${p}`);
  urls.push(`${SITE_ORIGIN}/transit-visa`);
  for (const g of TRANSIT_GUIDES) urls.push(`${SITE_ORIGIN}/transit-visa/${g.slug}`);
  urls.push(`${SITE_ORIGIN}/travel-authorization`);
  for (const a of TRAVEL_AUTHS) urls.push(`${SITE_ORIGIN}/travel-authorization/${a.slug}`);
  urls.push(`${SITE_ORIGIN}/guides`);
  for (const g of GUIDES) urls.push(`${SITE_ORIGIN}/guides/${g.slug}`);
  // Canonical passport & destination hubs (server-rendered). The SPA
  // /passport/{code} and /destination/{code} routes canonicalise here, so they
  // are deliberately kept OUT of the sitemap to avoid duplicate-URL signals.
  for (const c of allCountries()) {
    urls.push(`${SITE_ORIGIN}/visa-requirements/${slugify(c.name)}`);
    urls.push(`${SITE_ORIGIN}/countries/${slugify(c.name)}`);
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

// ── blog posts: server-rendered into the SPA shell (crawlable editorial) ─────
router.get("/blog/:slug", async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug ?? "").toLowerCase().trim();
  const shell = loadShell();
  if (!isDatabaseConfigured() || !slug) {
    if (shell) { res.type("html").send(shell); return; }
    res.status(503).type("html").send("Temporarily unavailable.");
    return;
  }
  try {
    const result = await db.execute(sql`
      SELECT title, slug, excerpt, content, cover_url, author, created_at, updated_at
      FROM blog_posts WHERE slug = ${slug} AND published = true
    `);
    const post = result.rows[0] as unknown as BlogPostRow | undefined;
    if (!post) {
      // Real 404 for crawlers; React still renders its own not-found UI.
      res.status(404).setHeader("Cache-Control", "no-store");
      if (shell) { res.type("html").send(shell); return; }
      res.type("html").send(renderPairNotFound());
      return;
    }
    const html = renderBlogPostShell(post) ?? shell;
    if (!html) { res.status(503).type("html").send("Temporarily unavailable."); return; }
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    res.type("html").send(html);
  } catch {
    if (shell) { res.type("html").send(shell); return; }
    res.status(503).type("html").send("Temporarily unavailable.");
  }
});

// ── blog sitemap (dynamic, from the DB) ──────────────────────────────────────
router.get("/sitemaps/blog.xml", async (_req: Request, res: Response): Promise<void> => {
  let body = "";
  if (isDatabaseConfigured()) {
    try {
      const result = await db.execute(sql`
        SELECT slug, updated_at, created_at FROM blog_posts WHERE published = true ORDER BY created_at DESC LIMIT 5000
      `);
      body = (result.rows as { slug: string; updated_at?: string; created_at?: string }[])
        .map((p) => {
          const d = new Date(p.updated_at ?? p.created_at ?? Date.now());
          const lastmod = isNaN(d.getTime()) ? DATA_LAST_UPDATED : d.toISOString().slice(0, 10);
          return `  <url><loc>${SITE_ORIGIN}/blog/${p.slug}</loc><lastmod>${lastmod}</lastmod></url>`;
        })
        .join("\n");
    } catch { /* empty sitemap on DB error */ }
  }
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
  );
});

// ── SPA marketing/tool routes: serve the index.html shell with route-specific
// SEO content injected into #root (React takes over on load). Falls back to the
// raw shell so the page never breaks.
for (const [routePath, seo] of Object.entries(ROUTE_SEO)) {
  router.get(routePath, (_req: Request, res: Response): void => {
    try {
      const html = renderAppRoute(routePath, seo) ?? loadShell();
      if (!html) { res.status(503).type("html").send("Temporarily unavailable. Please refresh."); return; }
      res.setHeader("Cache-Control", HTML_CACHE);
      res.type("html").send(html);
    } catch {
      const shell = loadShell();
      if (shell) { res.type("html").send(shell); return; }
      res.status(503).type("html").send("Temporarily unavailable. Please refresh.");
    }
  });
}

export default router;
