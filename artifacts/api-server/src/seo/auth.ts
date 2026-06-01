// Server-rendered explainer pages for electronic travel authorisations
// (ETIAS, UK ETA, US ESTA, Canada eTA, Australia ETA). Same look/SEO structure
// as the transit + pair pages.
import { TRAVEL_AUTHS, type TravelAuth } from "../data/authData";
import { SITE_ORIGIN } from "./render";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const STYLE = `:root{--navy:#0A2FA1;--accent:#0DB5E8;--bg:#F7F9FC;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{color:var(--navy)}.wrap{max-width:860px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{font-weight:800;color:var(--navy);text-decoration:none;font-size:18px}.logo span{color:var(--accent)}
nav.crumbs{font-size:13px;color:var(--muted);padding:14px 0}nav.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:28px;line-height:1.25;margin:6px 0 4px}.updated{color:var(--muted);font-size:13px;margin-bottom:18px}
.lead{font-size:18px}
.badge{display:inline-block;font-weight:700;font-size:13px;padding:4px 10px;border-radius:999px;color:#fff}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:16px 0}
.card h2{margin:0 0 10px;font-size:20px}
.statusbox{border-radius:12px;padding:14px 18px;margin:16px 0;font-size:14px}
.status-upcoming{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412}
.status-live{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:18px 0}
.stat{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.stat .k{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}.stat .v{font-size:15px;font-weight:600;margin-top:2px}
.faq{border-top:1px solid var(--line);padding:12px 0}.faq:first-of-type{border-top:0}.faq h3{margin:0 0 4px;font-size:16px}.faq p{margin:0;color:#334155}
.cols{column-width:240px;column-gap:24px}.cols a{display:block;padding:6px 0;text-decoration:none;font-size:15px}
.cta{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-top:6px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}`;

const HEADER = `<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>`;
const FOOTER = (reviewed: string) =>
  `<footer class="site"><div class="wrap">© isvisarequired.com — travel-authorisation rules, fees and dates change; always confirm on the official site before applying or booking. Last reviewed ${esc(reviewed)}.</div></footer>`;

export function renderAuthHub(): string {
  const canonical = `${SITE_ORIGIN}/travel-authorization`;
  const title = "ETIAS, ESTA, ETA & eTA — Travel Authorisation Guides";
  const desc = "Plain-English guides to electronic travel authorisations: Europe's ETIAS, the UK ETA, US ESTA, Canada eTA and Australia ETA — who needs them, cost, validity, and how to apply.";
  const cards = TRAVEL_AUTHS.map((a) => {
    const label = a.status === "live" ? "Live" : "Not yet required";
    const color = a.status === "live" ? "#10b981" : "#f59e0b";
    return `<a href="/travel-authorization/${a.slug}" style="text-decoration:none;color:inherit"><div class="card"><span class="badge" style="background:${color}">${label}</span><h2 style="margin-top:8px">${esc(a.name)}</h2><p style="color:#334155;margin:0">${esc(a.summary)}</p></div></a>`;
  }).join("");
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg"><style>${STYLE}</style></head>
<body>${HEADER}<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › Travel authorisations</nav>
<h1>ETIAS, ESTA, ETA & eTA — what they are and who needs them</h1>
<p class="lead">An electronic travel authorisation is <strong>not a visa</strong> — it's a quick online approval that visa-exempt travellers get before a trip. Here's each major one:</p>
${cards}
</main>${FOOTER("2026-06-01")}</body></html>`;
}

export function renderAuthGuide(a: TravelAuth): string {
  const canonical = `${SITE_ORIGIN}/travel-authorization/${a.slug}`;
  const yr = new Date(a.reviewed).getFullYear();
  const title = a.status === "upcoming"
    ? `${a.name}: what it is & when you'll need it (${yr})`
    : `${a.name}: who needs it, cost & how to apply (${yr})`;
  const desc = `${a.summary} ${a.statusNote}`.slice(0, 320);

  const faqs = [
    { q: `What is ${a.name}?`, a: a.whatItIs },
    { q: `Do you need ${a.name} right now?`, a: a.statusNote },
    { q: `Who needs ${a.name}?`, a: a.whoNeeds },
    { q: `How much does ${a.name} cost?`, a: a.cost },
    { q: `How long is ${a.name} valid?`, a: a.validity },
    { q: `How do you apply for ${a.name}?`, a: a.howToApply },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Travel authorisations", item: SITE_ORIGIN + "/travel-authorization" },
      { "@type": "ListItem", position: 3, name: a.name, item: canonical },
    ],
  };

  const statusCls = a.status === "live" ? "status-live" : "status-upcoming";
  const statusLabel = a.status === "live" ? "✓ Live — may already apply to you" : "⏳ Not yet required";
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");
  const others = TRAVEL_AUTHS.filter((x) => x.slug !== a.slug)
    .map((x) => `<a href="/travel-authorization/${x.slug}">${esc(x.name)}</a>`).join("");

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
<style>${STYLE}</style></head>
<body>${HEADER}<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › <a href="/travel-authorization">Travel authorisations</a> › ${esc(a.name)}</nav>
<h1>${esc(a.name)} — ${esc(a.scheme)}</h1>
<div class="updated">Last reviewed: ${esc(a.reviewed)}</div>
<div class="statusbox ${statusCls}"><strong>${statusLabel}.</strong> ${esc(a.statusNote)}</div>
<p class="lead">${esc(a.summary)}</p>

<section class="card"><h2>What it is</h2><p>${esc(a.whatItIs)}</p></section>
<section class="card"><h2>Who needs it</h2><p>${esc(a.whoNeeds)}</p></section>

<div class="grid">
  <div class="stat"><div class="k">Cost</div><div class="v">${esc(a.cost)}</div></div>
  <div class="stat"><div class="k">Validity</div><div class="v">${esc(a.validity)}</div></div>
</div>

<section class="card"><h2>How to apply</h2><p>${esc(a.howToApply)}</p></section>
<section class="card"><h2>Official source</h2><p><a href="${esc(a.officialUrl)}" rel="nofollow noopener" target="_blank">${esc(a.officialName)} ↗</a></p>
<p style="color:#64748b;font-size:13px">Apply only on the official site — many paid look-alike sites charge extra for the same thing.</p></section>

<section class="card"><h2>Frequently asked questions</h2>${faqHtml}</section>

<section class="card"><h2>Check the visa rules for your trip</h2>
<p>This authorisation is separate from your destination's visa rules. Check those for your passport:</p>
<a class="cta" href="/">Open the visa checker →</a></section>

<section class="card"><h2>Other travel authorisations</h2><div class="cols">${others}</div></section>
</main>${FOOTER(a.reviewed)}</body></html>`;
}
