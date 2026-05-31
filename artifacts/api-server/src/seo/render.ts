// Programmatic-SEO page rendering for every passport→destination pair.
//
// These are fully server-rendered HTML documents (not the SPA shell) so they are
// directly indexable: unique <title>/meta, canonical, FAQPage + BreadcrumbList
// JSON-LD, a visible "last updated" date, and rich pair-specific content. Each
// page is CDN-cached (see Cache-Control in the route), so serving ~38k pages
// on-demand is cheap.

import { countries, type CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { getVisaDetail, getCountryTouristInfo } from "../data/countryDetails";
import { officialLinks } from "../data/officialLinks";

// Canonical host (matches existing sitemap/robots). Keep in sync with robots.txt.
export const SITE_ORIGIN = "https://www.isvisarequired.com";

// Date the visa dataset was last reviewed. Bump when data is refreshed.
export const DATA_LAST_UPDATED = "2026-05-30";

// ── slug helpers ─────────────────────────────────────────────────────────────
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const byCode = new Map<string, CountryData>();
const bySlug = new Map<string, CountryData>();
for (const c of countries) {
  byCode.set(c.code, c);
  bySlug.set(slugify(c.name), c);
}

export function countryFromSlug(slug: string): CountryData | undefined {
  return bySlug.get(slug.toLowerCase());
}

export function pairPath(from: CountryData, to: CountryData): string {
  return `/visa-requirements/${slugify(from.name)}/${slugify(to.name)}`;
}

export function allCountries(): CountryData[] {
  return countries;
}

// ── small html utilities ─────────────────────────────────────────────────────
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const REQUIREMENT_LABEL: Record<string, string> = {
  visa_free: "Visa-free",
  visa_on_arrival: "Visa on arrival",
  e_visa: "eVisa (apply online)",
  visa_required: "Visa required",
  no_admission: "Entry not permitted",
};

const REQUIREMENT_COLOR: Record<string, string> = {
  visa_free: "#10b981",
  visa_on_arrival: "#f59e0b",
  e_visa: "#0DB5E8",
  visa_required: "#ef4444",
  no_admission: "#6b7280",
};

function answerSentence(req: string, from: string, to: string): string {
  switch (req) {
    case "visa_free":
      return `No — ${from} passport holders do not need a visa for short tourist stays in ${to}. You can enter visa-free.`;
    case "visa_on_arrival":
      return `${from} passport holders do not need a visa in advance for ${to} — a visa is issued on arrival at the border.`;
    case "e_visa":
      return `${from} passport holders need an eVisa for ${to}. It is applied for online before you travel — no embassy visit required.`;
    case "visa_required":
      return `Yes — ${from} passport holders need a visa to enter ${to}. It must be arranged in advance, usually at an embassy or consulate.`;
    case "no_admission":
      return `${from} passport holders are currently not permitted to enter ${to}. Check with your foreign ministry before making plans.`;
    default:
      return `Visa requirements for ${from} passport holders travelling to ${to}.`;
  }
}

interface FaqItem {
  q: string;
  a: string;
}

// ── page renderer ────────────────────────────────────────────────────────────
export function renderPairPage(from: CountryData, to: CountryData): string {
  const entry = getDefaultEntry(from.code, to.code);
  const requirement = entry.requirement;
  const detail = getVisaDetail(from.code, to.code, requirement);
  const tourist = getCountryTouristInfo(to.code);
  const links = officialLinks[to.code] ?? null;

  const reqLabel = REQUIREMENT_LABEL[requirement] ?? "Check requirements";
  const reqColor = REQUIREMENT_COLOR[requirement] ?? "#0A2FA1";
  const maxStay = entry.maxStay || detail.maxStay || "Varies — check on entry";
  const fee =
    detail.feeUSD === 0
      ? "Free"
      : detail.feeUSD != null
        ? `≈ US$${detail.feeUSD}`
        : "Varies — check official portal";
  const processing = detail.processingDays || "Varies";
  const answer = answerSentence(requirement, from.name, to.name);

  const canonical = `${SITE_ORIGIN}${pairPath(from, to)}`;
  const title = `Do ${from.name} citizens need a visa for ${to.name}? (${new Date(DATA_LAST_UPDATED).getFullYear()})`;
  const metaDesc = `${answer} Visa type: ${reqLabel}. Max stay: ${maxStay}. Fee: ${fee}. Processing: ${processing}. Documents, costs and official links — updated ${DATA_LAST_UPDATED}.`;

  // FAQ (kept identical between visible content and JSON-LD)
  const faqs: FaqItem[] = [
    { q: `Do ${from.name} citizens need a visa to visit ${to.name}?`, a: answer },
    { q: `How long can ${from.name} passport holders stay in ${to.name}?`, a: `Maximum stay: ${maxStay}.` },
    { q: `How much does a ${to.name} visa cost for ${from.name} citizens?`, a: `Typical fee: ${fee}. Fees can change — confirm on the official portal before applying.` },
    { q: `How long does it take to get a ${to.name} visa?`, a: `Processing time: ${processing}.` },
    { q: `What documents do ${from.name} citizens need for ${to.name}?`, a: detail.documents.length ? detail.documents.join("; ") + "." : "Check the official portal for the current document checklist." },
  ];
  if (links?.visaPortal) {
    faqs.push({ q: `Where do ${from.name} citizens apply for a ${to.name} visa?`, a: `Apply via the official portal: ${links.visaPortal}` });
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Visa requirements", item: SITE_ORIGIN + "/visa-requirements" },
      { "@type": "ListItem", position: 3, name: `${from.name} to ${to.name}`, item: canonical },
    ],
  };

  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: metaDesc,
    url: canonical,
    dateModified: DATA_LAST_UPDATED,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "isvisarequired.com", url: SITE_ORIGIN },
  };

  // Related internal links (crawlable graph): same destination / other passports,
  // and same passport / other destinations.
  const others = countries.filter((c) => c.code !== from.code && c.code !== to.code);
  const otherPassports = others.slice(0, 12);
  const otherDestinations = others.slice(12, 24);

  const docsList = detail.documents.map((d) => `<li>${esc(d)}</li>`).join("");
  const processList = detail.process.map((p) => `<li>${esc(p)}</li>`).join("");

  const officialBlock = links
    ? `<section class="card"><h2>Official sources</h2>
        <p>Always confirm with the destination's official government portal before you travel:</p>
        <ul>
          <li><a href="${esc(links.visaPortal)}" rel="nofollow noopener" target="_blank">${esc(to.name)} official visa portal ↗</a></li>
          <li><a href="${esc(links.embassyFinder)}" rel="nofollow noopener" target="_blank">${esc(to.name)} embassies &amp; consulates ↗</a></li>
        </ul></section>`
    : "";

  const touristBlock = tourist
    ? `<section class="card"><h2>About ${esc(to.name)}</h2>
        <p>${esc(tourist.tagline)}</p>
        <ul class="facts">
          <li><strong>Capital:</strong> ${esc(tourist.capital)}</li>
          <li><strong>Currency:</strong> ${esc(tourist.currency)}</li>
          <li><strong>Language:</strong> ${esc(tourist.language)}</li>
          <li><strong>Time zone:</strong> ${esc(tourist.timezone)}</li>
          <li><strong>Best time to visit:</strong> ${esc(tourist.bestTimeToVisit)}</li>
        </ul></section>`
    : "";

  const faqHtml = faqs
    .map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`)
    .join("");

  const relatedPassports = otherPassports
    .map((c) => `<a href="${pairPath(c, to)}">${esc(c.flag)} ${esc(c.name)} → ${esc(to.name)}</a>`)
    .join("");
  const relatedDestinations = otherDestinations
    .map((c) => `<a href="${pairPath(from, c)}">${esc(from.name)} → ${esc(c.flag)} ${esc(c.name)}</a>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:site_name" content="isvisarequired.com">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(webpageJsonLd)}</script>
<style>
:root{--navy:#0A2FA1;--accent:#0DB5E8;--bg:#F7F9FC;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{color:var(--navy)}
.wrap{max-width:860px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{font-weight:800;color:var(--navy);text-decoration:none;font-size:18px}
.logo span{color:var(--accent)}
nav.crumbs{font-size:13px;color:var(--muted);padding:14px 0}
nav.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:28px;line-height:1.25;margin:6px 0 4px}
.updated{color:var(--muted);font-size:13px;margin-bottom:18px}
.answer{background:#fff;border:1px solid var(--line);border-left:6px solid ${reqColor};border-radius:12px;padding:18px 20px;margin-bottom:18px}
.badge{display:inline-block;background:${reqColor};color:#fff;font-weight:700;font-size:13px;padding:4px 10px;border-radius:999px;margin-bottom:8px}
.answer p{margin:6px 0 0;font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:18px 0}
.stat{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.stat .k{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}
.stat .v{font-size:17px;font-weight:700;margin-top:2px}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:16px 0}
.card h2{margin:0 0 10px;font-size:20px}
.facts{list-style:none;padding:0;margin:0}
.facts li{padding:3px 0}
.faq{border-top:1px solid var(--line);padding:12px 0}
.faq:first-of-type{border-top:0}
.faq h3{margin:0 0 4px;font-size:16px}
.faq p{margin:0;color:#334155}
.related a{display:block;padding:6px 0;text-decoration:none;font-size:14px}
.cta{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-top:6px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}
</style>
</head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>
<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › <a href="/visa-requirements">Visa requirements</a> › ${esc(from.name)} → ${esc(to.name)}</nav>
<h1>Do ${esc(from.name)} citizens need a visa for ${esc(to.name)}?</h1>
<div class="updated">Last updated: ${esc(DATA_LAST_UPDATED)}</div>

<div class="answer">
  <span class="badge">${esc(reqLabel)}</span>
  <p>${esc(answer)}</p>
</div>

<div class="grid">
  <div class="stat"><div class="k">Visa type</div><div class="v">${esc(reqLabel)}</div></div>
  <div class="stat"><div class="k">Max stay</div><div class="v">${esc(maxStay)}</div></div>
  <div class="stat"><div class="k">Typical fee</div><div class="v">${esc(fee)}</div></div>
  <div class="stat"><div class="k">Processing</div><div class="v">${esc(processing)}</div></div>
</div>

${detail.documents.length ? `<section class="card"><h2>Documents you'll typically need</h2><ul>${docsList}</ul></section>` : ""}
${detail.process.length ? `<section class="card"><h2>How to apply / enter</h2><ol>${processList}</ol></section>` : ""}
${officialBlock}
${touristBlock}

<section class="card"><h2>Frequently asked questions</h2>${faqHtml}</section>

<section class="card">
  <h2>Check your own trip</h2>
  <p>Requirements depend on your exact passport and itinerary. Use the free interactive checker for live results, multi-country trips and transit.</p>
  <a class="cta" href="/?from=${esc(from.code)}&to=${esc(to.code)}">Open the visa checker →</a>
</section>

<section class="card related">
  <h2>Other passports for ${esc(to.name)}</h2>
  ${relatedPassports}
  <h2 style="margin-top:14px">${esc(from.name)} to other destinations</h2>
  ${relatedDestinations}
</section>
</main>
<footer class="site"><div class="wrap">© isvisarequired.com — General guidance only; always confirm with official government sources before booking travel. Data last reviewed ${esc(DATA_LAST_UPDATED)}.</div></footer>
</body>
</html>`;
}

// ── 404 for unknown pair slugs ───────────────────────────────────────────────
export function renderPairNotFound(): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found — isvisarequired.com</title>
<meta name="robots" content="noindex,follow">
<style>body{font-family:Inter,system-ui,sans-serif;background:#F7F9FC;color:#0f172a;text-align:center;padding:80px 20px}a{color:#0A2FA1}</style></head>
<body><h1>We couldn't find that page</h1><p>That passport or destination wasn't recognised.</p>
<p><a href="/">Go to the visa checker →</a></p></body></html>`;
}
