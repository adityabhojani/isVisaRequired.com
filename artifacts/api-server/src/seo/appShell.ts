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
  body: string; // crawlable HTML injected into #root (React replaces it on mount)
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
    title: "Is Visa Required? | Free Visa Checker for 199 Countries",
    description: "Check visa requirements instantly for any passport and destination. Find out if you need a visa, visa on arrival, e-visa, ETA/ETIAS, or can travel visa-free — free, no sign-up.",
    h1: "Do you need a visa?",
    body: `<p>Select your passport and destination to instantly see whether you need a visa, visa on arrival, an e-visa, an electronic travel authorisation (ETIAS/ESTA/ETA), or can travel visa-free — across 199 countries and ~38,000 passport–destination combinations. Free, no account needed.</p>`,
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
    body: `<p>Every passport ranked S to D by how many destinations it unlocks without a prior visa. See where yours lands and how it compares to the strongest passports in the world.</p>`,
  },
  "/digital-nomad": {
    title: "Digital Nomad Visas — Countries, Requirements & Income Rules | isvisarequired.com",
    description: "Browse countries offering digital nomad and remote-work visas, with income requirements, length of stay and how to apply.",
    h1: "Digital nomad visas",
    body: `<p>Explore the growing list of countries offering digital nomad and remote-work visas — including income thresholds, how long you can stay, and where to apply, so you can base yourself abroad legally.</p>`,
  },
  "/reciprocity": {
    title: "Visa Reciprocity — Who Lets Each Other In Visa-Free | isvisarequired.com",
    description: "See visa reciprocity between countries — where access is mutual, and where one country grants visa-free entry the other doesn't.",
    h1: "Visa reciprocity checker",
    body: `<p>Visa rules aren't always mutual. See where two countries grant each other visa-free access — and where the relationship is one-sided.</p>`,
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
    body: `<p>Our Passport Power Index ranks every passport by how many destinations it can enter without arranging a visa first. See the strongest and weakest passports and where yours ranks globally.</p>`,
  },
  "/popular": {
    title: "Most Popular Travel Destinations & Their Visa Rules | isvisarequired.com",
    description: "The world's most popular destinations and what visa each requires for your passport — plan around the trips travelers search for most.",
    h1: "Popular destinations",
    body: `<p>The destinations travelers search for most, with the visa requirement for your passport on each — a quick starting point for planning your next trip.</p>`,
  },
  "/blog": {
    title: "Travel & Visa Blog — Guides, Policy Changes & Tips | isvisarequired.com",
    description: "Visa and travel guides, policy-change explainers (UK ETA, ETIAS and more), and practical tips to cross borders without surprises.",
    h1: "Travel & visa blog",
    body: `<p>Guides and explainers on visa policy changes, electronic travel authorisations, and practical border tips — so you're never caught out by a rule you didn't know about.</p>`,
  },
};

export function renderAppRoute(routePath: string, seo: RouteSeo): string | null {
  const shell = loadShell();
  if (!shell) return null;
  const canonical = `${SITE}${routePath === "/" ? "/" : routePath}`;
  const injected = `<section style="max-width:860px;margin:0 auto;padding:24px 20px;font-family:Inter,system-ui,sans-serif">
    <h1>${esc(seo.h1)}</h1>
    ${seo.body}
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
  // Inject crawlable content into the empty root
  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${injected}</div>`);
  return html;
}
