// Server-side enhancement for the SPA's marketing/tool routes.
//
// The Vite app ships an index.html with an EMPTY <div id="root"></div>, so search
// engines see no content until JS runs. For the highest-value routes we read the
// built index.html, inject route-specific <title>/meta/canonical + real crawlable
// content into #root, and return that. The React app boots from the same script
// tags and replaces #root on load (createRoot), so users get the full interactive
// app. If the shell can't be read we fall back to the raw shell (never break the page).
import fs from "fs";
import path from "path";
import { computeReport } from "./report";
import { DATA_LAST_UPDATED } from "./hubLayout";
import { slugify } from "./render";
import { digitalNomadVisas } from "@workspace/travel-data";

export const SITE = "https://www.isvisarequired.com";

let _shell: string | null = null;
let _shellTried = false;

export function loadShell(): string | null {
  if (_shellTried) return _shell;
  _shellTried = true;
  // On Vercel the build renames index.html → shell.html so the filesystem
  // no longer beats the "/" rewrite (static files are served before rewrites,
  // which silently disabled homepage SSR). index.html kept for local dev.
  const candidates = [
    path.join(process.cwd(), "artifacts/visa-checker/dist/public/shell.html"),
    path.join(process.cwd(), "artifacts/visa-checker/dist/public/index.html"),
    path.join(process.cwd(), "shell.html"),
    path.join(process.cwd(), "index.html"),
    path.join(process.cwd(), "public/index.html"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) { _shell = fs.readFileSync(p, "utf-8"); break; }
    } catch { /* keep trying */ }
  }
  return _shell;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export interface RouteSeo {
  title: string;
  description: string;
  h1: string;
  // Crawlable HTML injected into #root (React replaces it on mount). Use a
  // thunk when the body is computed from the visa matrix — it keeps the 195x195
  // scan off the cold-start path for every OTHER route.
  body: string | (() => string);
  jsonLd?: object[]; // structured data injected into <head>
  noindex?: boolean; // utility/account routes that should not be indexed
}

// Shared crawlable link block (internal links boost crawl + relevance).
const POPULAR = [
  ["united-states", "Japan", "japan"], ["india", "Thailand", "thailand"],
  ["united-kingdom", "USA", "united-states"], ["germany", "United States", "united-states"],
  ["nigeria", "United Kingdom", "united-kingdom"], ["china", "Singapore", "singapore"],
];
function linkBlock(): string {
  const pairs = POPULAR.map(([f, label, t]) => `<li><a href="/visa-requirements/${f}/${t}">${esc(f.replace(/-/g, " "))} → ${esc(label)}</a></li>`).join("");
  return `<nav aria-label="Popular" style="margin-top:24px"><p style="font-weight:600">Popular visa checks</p><ul>${pairs}</ul>
    <p style="font-weight:600;margin-top:12px">Browse</p>
    <ul>
      <li><a href="/visa-requirements">Visa requirements by passport</a></li>
      <li><a href="/countries">Visa requirements by country</a></li>
      <li><a href="/guides">Visa &amp; travel guides</a></li>
      <li><a href="/reports/passport-power-2026">Global Passport Power Report 2026</a></li>
    </ul>
    <p style="font-weight:600;margin-top:12px">Guides</p>
    <ul>
      <li><a href="/transit-visa">Transit visa guides</a></li>
      <li><a href="/travel-authorization">ETIAS, ESTA &amp; ETA</a></li>
      <li><a href="/residence-permit-visa-benefits">Travelling with a residence permit</a></li>
      <li><a href="/methodology">How we source our data</a></li>
    </ul></nav>`;
}

export const ROUTE_SEO: Record<string, RouteSeo> = {
  "/": {
    title: "Is Visa Required? | Free Visa Checker for 195 Countries",
    description: "Check visa requirements instantly for any passport and destination. Find out if you need a visa, visa on arrival, e-visa, ETA/ETIAS, or can travel visa-free — free, no sign-up.",
    h1: "Do you need a visa?",
    body: `<p>Select your passport and destination to instantly see whether you need a visa, visa on arrival, an e-visa, an electronic travel authorisation (ETIAS/ESTA/ETA), or can travel visa-free — across 195 countries and 37,830 passport–destination combinations. Free, no account needed. Data last reviewed ${DATA_LAST_UPDATED}.</p>`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "isvisarequired.com",
        alternateName: "Is Visa Required?",
        url: SITE,
        description: "Free visa-requirement checker covering 195 countries and 37,830 passport-to-destination combinations.",
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "isvisarequired.com",
        url: SITE,
        logo: `${SITE}/favicon.svg`,
        contactPoint: { "@type": "ContactPoint", url: `${SITE}/contact`, contactType: "customer support" },
      },
    ],
  },
  "/compare": {
    title: "Compare Two Passports — Visa-Free Power & Differences | isvisarequired.com",
    description: "Compare two passports side by side: how many countries each can enter visa-free, where their access differs, and which is stronger for travel.",
    h1: "Compare two passports",
    body: `<p>See two passports side by side — total visa-free destinations, where their access differs, and which opens more of the world. A quick way to understand passport power and plan around the stronger document.</p>`,
  },
  "/discover": {
    title: "Where Can I Go Visa-Free? Discover Destinations by Passport | isvisarequired.com",
    description: "Discover every country your passport can enter visa-free, on arrival, or with an e-visa — filter and explore where you can travel right now.",
    h1: "Where can you go visa-free?",
    body: `<p>Pick your passport and explore every destination you can enter visa-free, with a visa on arrival, or with an e-visa. The fastest way to find your next trip based on where you can actually go.</p>`,
  },
  "/schengen": {
    title: "Schengen 90/180-Day Calculator — Track Your Days | isvisarequired.com",
    description: "Free Schengen 90/180-day calculator. Enter your trips and see exactly how many days you can still stay in the Schengen Area without overstaying.",
    h1: "Schengen 90/180-day calculator",
    body: `<p>Stay compliant with the Schengen rule: a maximum of 90 days in any rolling 180-day period. Enter your past and planned trips to see how many days you have left and avoid an overstay.</p>`,
  },
  "/tier-list": {
    title: "Passport Tier List — S/A/B/C/D Rankings | isvisarequired.com",
    description: "See every passport ranked into S, A, B, C and D tiers by visa-free travel power. Find where your passport sits in the global ranking.",
    h1: "Passport power tier list",
    body: tierListBody,
  },
  "/digital-nomad": {
    title: "Digital Nomad Visas — Countries, Requirements & Income Rules | isvisarequired.com",
    description: "Browse countries offering digital nomad and remote-work visas, with income requirements, length of stay and how to apply.",
    h1: "Digital nomad visas",
    body: digitalNomadBody,
  },
  "/reciprocity": {
    title: "Visa Reciprocity — Who Lets Each Other In Visa-Free | isvisarequired.com",
    description: "See visa reciprocity between countries — where access is mutual, and where one country grants visa-free entry the other doesn't.",
    h1: "Visa reciprocity checker",
    body: reciprocityBody,
  },
  "/map": {
    title: "World Visa Map — See Your Passport's Access at a Glance | isvisarequired.com",
    description: "An interactive world map coloured by your passport's visa requirements — visa-free, on arrival, e-visa or visa required for every country.",
    h1: "World visa map",
    body: `<p>An interactive map of the world coloured by your passport's access: visa-free, visa on arrival, e-visa, or visa required — see your travel freedom at a glance.</p>`,
  },
  "/stats": {
    title: "Passport Power Index — Global Visa-Free Rankings | isvisarequired.com",
    description: "The Passport Power Index ranks every passport by the number of destinations it can access without a prior visa. See the full global ranking.",
    h1: "Passport Power Index",
    body: statsBody,
  },
  "/popular": {
    title: "Most Popular Travel Destinations & Their Visa Rules | isvisarequired.com",
    description: "The world's most popular destinations and what visa each requires for your passport — plan around the trips travelers search for most.",
    h1: "Popular destinations",
    body: `<p>The destinations travelers search for most, with the visa requirement for your passport on each — a quick starting point for planning your next trip.</p>`,
  },
  "/privacy": {
    title: "Privacy Policy | Is Visa Required?",
    description: "Privacy policy for isvisarequired.com — how we collect, use, and protect your information.",
    h1: "Privacy Policy",
    body: `<p>This policy explains what isvisarequired.com collects, why, and what control you have over it. We collect limited, anonymised analytics data to improve the site; we do not sell personal data.</p>
    <h2>What this policy covers</h2>
    <ol>
      <li>Overview</li><li>Information we collect</li><li>How we use your information</li>
      <li>Cookies</li><li>Third-party services</li><li>Your rights (GDPR &amp; CCPA)</li>
      <li>Data retention</li><li>Children's privacy</li><li>Changes to this policy</li><li>Contact</li>
    </ol>
    <p>The full text of each section is shown below once the page loads.</p>`,
  },

  "/terms": {
    title: "Terms of Service | Is Visa Required?",
    description: "Terms of service for isvisarequired.com — rules for using our free visa requirement checker.",
    h1: "Terms of Service",
    body: `<p>These terms govern your use of isvisarequired.com. In short: the visa information here is provided for guidance, it is not legal advice, and you should confirm requirements with the relevant embassy or official government source before you travel.</p>
    <h2>What these terms cover</h2>
    <ol>
      <li>Acceptance of terms</li><li>Description of service</li><li>Accuracy of information</li>
      <li>Limitation of liability</li><li>Permitted use</li><li>Intellectual property</li>
      <li>Third-party links</li><li>Modifications to the service</li><li>Governing law</li><li>Contact</li>
    </ol>
    <p>See our <a href="/methodology">methodology</a> for how the visa dataset is built and reviewed.</p>`,
  },

  "/trip-planner": {
    title: "Trip Planner — Visa Requirements for Every Leg of Your Trip",
    description: "Plan a multi-destination trip and instantly see the visa requirement for every leg, so you know which visas to apply for and in what order.",
    h1: "Multi-destination trip planner",
    body: `<p>Add the countries you plan to visit and see the visa requirement for each leg against your passport in one view — visa-free, visa on arrival, eVisa or full visa — so you know which applications to start first and how long each stay can be.</p>
    <p>Useful when a single trip crosses several visa regimes: a Schengen leg, a transit stop and a visa-on-arrival country each have different lead times. For a single pair, use the <a href="/">visa checker</a>; to compare two passports, use <a href="/compare">compare passports</a>.</p>
    <p>Before you book, it is also worth reading <a href="/guides/visa-validity-vs-duration-of-stay">visa validity vs duration of stay</a> and <a href="/guides/single-entry-vs-multiple-entry-visas">single-entry vs multiple-entry visas</a> — both change what a multi-country itinerary is allowed to look like.</p>`,
  },

  "/alerts": {
    title: "Visa Change Alerts — Get Notified When Requirements Change",
    description: "Save the passport and destination pairs that matter to you and get an email when the visa requirement changes.",
    h1: "Visa change alerts",
    body: `<p>Visa rules move without warning — a country adds an electronic travel authorisation, extends visa-free access, or suspends it. Save the passport–destination pairs you care about and we will email you when the requirement changes.</p>
    <p>Recent examples of exactly this kind of change: the <a href="/travel-authorization/uk-eta">UK ETA</a>, <a href="/travel-authorization/etias">ETIAS</a> in Europe, and China's expanded <a href="/transit-visa/china">240-hour visa-free transit</a>.</p>`,
  },

  "/blog": {
    title: "Travel & Visa Blog — Guides, Policy Changes & Tips | isvisarequired.com",
    description: "Visa and travel guides, policy-change explainers (UK ETA, ETIAS and more), and practical tips to cross borders without surprises.",
    h1: "Travel & visa blog",
    body: `<p>Guides and explainers on visa policy changes, electronic travel authorisations, and practical border tips — so you're never caught out by a rule you didn't know about.</p>`,
  },
};


// ---------------------------------------------------------------------------
// Data-backed bodies. These four routes carry facts that exist nowhere else on
// the site; until now the crawler saw only a sentence and a loading spinner, so
// none of it was citable. Everything below is computed from the same matrix
// that powers the checker — no second copy of the data, no drift.
// ---------------------------------------------------------------------------

const TIERS = [
  { label: "S", min: 185, title: "World Elite", note: "Near-universal access" },
  { label: "A", min: 165, title: "Highly Powerful", note: "Excellent global mobility" },
  { label: "B", min: 145, title: "Strong", note: "Strong global access" },
  { label: "C", min: 125, title: "Average", note: "Moderate travel freedom" },
  { label: "D", min: 100, title: "Below Average", note: "Limited access" },
  { label: "E", min: 0, title: "Restricted", note: "Significant travel restrictions" },
];

function table(head: string[], rows: string[][]): string {
  const th = head.map((h) => `<th style="text-align:left;padding:6px 10px;border-bottom:2px solid #e2e8f0">${esc(h)}</th>`).join("");
  const tr = rows.map((r) =>
    `<tr>${r.map((c) => `<td style="padding:6px 10px;border-bottom:1px solid #f1f5f9">${c}</td>`).join("")}</tr>`).join("");
  return `<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:14px"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}

function tierListBody(): string {
  const d = computeReport();
  const counts = TIERS.map((t, i) => {
    const upper = i === 0 ? Infinity : TIERS[i - 1].min;
    const inTier = d.rows.filter((r) => r.mobility >= t.min && r.mobility < upper);
    return { t, inTier };
  });
  // Only render bands that actually contain passports. The client's TIER_CONFIG
  // sets S at 185+, but the highest mobility score in the dataset is 180, so S
  // is currently unreachable — publishing "S — World Elite: 0" as crawlable,
  // citable text would be worse than omitting it.
  const tierRows = counts.filter(({ inTier }) => inTier.length > 0).map(({ t, inTier }) => [
    `<strong>${t.label}</strong> — ${esc(t.title)}`,
    `${t.min}+`,
    String(inTier.length),
    inTier.slice(0, 6).map((r) => esc(r.c.name)).join(", ") || "—",
  ]);
  const top = d.rows.slice(0, 10).map((r, i) => [
    String(i + 1),
    `<a href="/visa-requirements/${slugify(r.c.name)}">${esc(r.c.name)}</a>`,
    String(r.mobility),
  ]);
  return `<p>Every passport in our dataset is scored by <strong>mobility score</strong> — the number of destinations it reaches without arranging a visa in advance (visa-free + visa on arrival + eVisa/ETA) — then banded into tiers. Scores are computed from ${d.totalPairs.toLocaleString()} passport–destination rules, last reviewed ${esc(DATA_LAST_UPDATED)}.</p>
  <h2>The tiers</h2>
  ${table(["Tier", "Score", "Passports", "Examples"], tierRows)}
  <h2>Top 10 passports</h2>
  ${table(["#", "Passport", "Mobility score"], top)}
  <p style="margin-top:12px"><a href="/reports/passport-power-2026">See the full ranking of all ${d.rows.length} passports →</a></p>`;
}

function statsBody(): string {
  const d = computeReport();
  const avg = Math.round(d.rows.reduce((a, r) => a + r.mobility, 0) / d.rows.length);
  const top = d.rows[0], bottom = d.rows[d.rows.length - 1];
  const regionRows = d.regions.map((r) => [esc(r.name), String(r.count), String(r.avg)]);
  const openRows = d.byOpenness.slice(0, 10).map((r, i) => [
    String(i + 1), `<a href="/countries/${slugify(r.c.name)}">${esc(r.c.name)}</a>`, String(r.open),
  ]);
  return `<p>Aggregate figures computed from all ${d.totalPairs.toLocaleString()} passport–destination pairs in our dataset, last reviewed ${esc(DATA_LAST_UPDATED)}. <strong>Mobility score</strong> counts destinations reachable without a prior visa; <strong>openness</strong> counts how many nationalities a country admits without one.</p>
  <h2>Headline numbers</h2>
  ${table(["Measure", "Value"], [
    ["Passports ranked", String(d.rows.length)],
    ["Passport–destination rules", d.totalPairs.toLocaleString()],
    ["Average mobility score", String(avg)],
    ["Strongest passport", `${esc(top.c.name)} (${top.mobility})`],
    ["Most restricted passport", `${esc(bottom.c.name)} (${bottom.mobility})`],
    ["One-sided visa relationships", d.totalAsymmetric.toLocaleString()],
  ])}
  <h2>Average mobility by region</h2>
  ${table(["Region", "Passports", "Avg. mobility score"], regionRows)}
  <h2>Most open destinations</h2>
  ${table(["#", "Destination", "Nationalities admitted without an advance visa"], openRows)}`;
}

function reciprocityBody(): string {
  const d = computeReport();
  const sample = d.asymmetric.slice(0, 20).map((p) => [
    `<a href="/visa-requirements/${slugify(p.a.name)}/${slugify(p.b.name)}">${esc(p.a.name)} → ${esc(p.b.name)}</a>`,
    "Visa-free",
    `<a href="/visa-requirements/${slugify(p.b.name)}/${slugify(p.a.name)}">${esc(p.b.name)} → ${esc(p.a.name)}</a>`,
    "Visa required",
  ]);
  return `<p>Visa access is often <strong>not mutual</strong>. Across ${d.totalPairs.toLocaleString()} passport–destination rules we find <strong>${d.totalAsymmetric.toLocaleString()} one-sided relationships</strong> — pairs where one country's citizens enter visa-free while the other's must apply for a visa. Last reviewed ${esc(DATA_LAST_UPDATED)}.</p>
  <h2>Examples of one-sided access</h2>
  ${table(["Direction", "Requirement", "Reverse direction", "Requirement"], sample)}
  <p style="margin-top:12px">Enter any two countries above to see both directions side by side, or read the <a href="/reports/passport-power-2026">full passport power report</a>.</p>`;
}


function digitalNomadBody(): string {
  const v = digitalNomadVisas;
  const byRegion = new Map<string, number>();
  for (const x of v) byRegion.set(x.region, (byRegion.get(x.region) ?? 0) + 1);
  const regions = [...byRegion].sort((a, b) => b[1] - a[1]);
  const withTax = v.filter((x) => x.taxBenefits).length;
  const freeToApply = v.filter((x) => x.govFee === "Free").length;
  const rows = [...v]
    .sort((a, b) => a.region.localeCompare(b.region) || a.country.localeCompare(b.country))
    .map((x) => [
      `${esc(x.flag)} <strong>${esc(x.country)}</strong>`,
      esc(x.visaName),
      esc(x.minMonthlyIncome ? `${x.minMonthlyIncome}/mo` : x.minAnnualIncome ? `${x.minAnnualIncome}/yr` : "Not stated"),
      esc(x.duration),
      esc(x.govFee ?? "Not stated"),
    ]);
  const regionList = regions.map(([r, n]) => `${esc(r)} (${n})`).join(" · ");
  return `<p><strong>${v.length} countries</strong> currently run a digital nomad or remote-work visa. Below is every programme we track, with the income you must show, how long the permit lasts and the government fee. ${withTax} offer some form of tax benefit and ${freeToApply} charge no government fee. Coverage: ${regionList}.</p>
  <p style="color:#475569;font-size:14px">Income thresholds and fees are set by each government and change without notice — always confirm on the official application site linked from the interactive table before you apply.</p>
  <h2>All ${v.length} digital nomad visa programmes</h2>
  ${table(["Country", "Visa", "Income requirement", "Duration", "Government fee"], rows)}
  <p style="margin-top:12px">A nomad visa is a residence permit, not a tourist entry — check the plain tourist rule for your passport with the <a href="/">visa checker</a>, and read <a href="/guides/visa-validity-vs-duration-of-stay">visa validity vs duration of stay</a> before you plan a long stay.</p>`;
}

export function renderAppRoute(routePath: string, seo: RouteSeo): string | null {
  const shell = loadShell();
  if (!shell) return null;
  const canonical = `${SITE}${routePath === "/" ? "/" : routePath}`;
  const bodyHtml = typeof seo.body === "function" ? seo.body() : seo.body;
  const injected = `<section style="max-width:860px;margin:0 auto;padding:24px 20px;font-family:Inter,system-ui,sans-serif">
    <h1>${esc(seo.h1)}</h1>
    ${bodyHtml}
    ${linkBlock()}
    <p style="margin-top:24px;color:#64748b">Loading the interactive visa checker…</p>
  </section>`;

  let html = shell;
  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(seo.title)}</title>`);
  // Replace meta description (or leave if absent)
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${esc(seo.description)}" />`);
  // Replace canonical
  html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
  if (seo.noindex) {
    html = html.replace(/<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="noindex, follow" />`);
  }
  // Structured data (e.g. WebSite/Organization on the homepage)
  if (seo.jsonLd && seo.jsonLd.length) {
    const ld = seo.jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("");
    html = html.replace("</head>", `${ld}</head>`);
  }
  // Inject crawlable content into the empty root
  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${injected}</div>`);
  return html;
}
