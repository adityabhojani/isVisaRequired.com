// Server-rendered transit-visa guide pages (hub + per-hub), reusing the same
// look and SEO structure as the per-pair pages.
import { TRANSIT_GUIDES, type TransitGuide } from "../data/transitData";
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
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:16px 0}
.card h2{margin:0 0 10px;font-size:20px}
.note{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px 18px;margin:16px 0;font-size:14px;color:#9a3412}
.cols{column-width:240px;column-gap:24px}.cols a{display:block;padding:6px 0;text-decoration:none;font-size:15px}
.faq{border-top:1px solid var(--line);padding:12px 0}.faq:first-of-type{border-top:0}.faq h3{margin:0 0 4px;font-size:16px}.faq p{margin:0;color:#334155}
.cta{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-top:6px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}`;

const HEADER = `<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>`;
const FOOTER = (reviewed: string) =>
  `<footer class="site"><div class="wrap">© isvisarequired.com — transit rules are general guidance and change often; always confirm with your airline and the official source before booking. Last reviewed ${esc(reviewed)}.</div></footer>`;

export function renderTransitHub(): string {
  const canonical = `${SITE_ORIGIN}/transit-visa`;
  const title = "Transit Visa Guides — Do You Need a Visa for a Layover?";
  const desc = "Clear, up-to-date transit-visa guides for the world's major connecting airports — airside vs leaving the airport, named transit schemes, and official links.";
  const links = TRANSIT_GUIDES.map(
    (g) => `<a href="/transit-visa/${g.slug}">Transit visa for ${esc(g.name)}</a>`,
  ).join("");
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg"><script defer src="/_vercel/insights/script.js"></script><style>${STYLE}</style></head>
<body>${HEADER}<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › Transit visas</nav>
<h1>Do you need a transit visa for your layover?</h1>
<p class="lead">A "transit visa" lets you pass through a country on the way to somewhere else. Whether you need one depends on the country, your nationality, and whether you stay airside or leave the airport. Pick your connecting country:</p>
<section class="card"><div class="cols">${links}</div></section>
<div class="note"><strong>Heads up:</strong> transit rules change frequently and vary by nationality and route. Use these guides to understand the scheme, then confirm the specifics with your airline and the official government source before you book.</div>
</main>${FOOTER("2026-06-01")}</body></html>`;
}

export function renderTransitGuide(g: TransitGuide): string {
  const canonical = `${SITE_ORIGIN}/transit-visa/${g.slug}`;
  const title = `Do you need a transit visa for ${g.name}? (${new Date(g.reviewed).getFullYear()})`;
  const desc = `${g.summary} Airside vs leaving the airport, transit schemes, and the official source — reviewed ${g.reviewed}.`;

  const faqs = [
    { q: `Do you need a transit visa to connect through ${g.name}?`, a: g.summary },
    { q: `Can you transit airside through ${g.name} without a visa?`, a: g.airside },
    { q: `What if you want to leave the airport during a layover in ${g.name}?`, a: g.landside },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Transit visas", item: SITE_ORIGIN + "/transit-visa" },
      { "@type": "ListItem", position: 3, name: g.name, item: canonical },
    ],
  };

  const schemes = g.schemes.map((s) => `<li>${esc(s)}</li>`).join("");
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");
  const others = TRANSIT_GUIDES.filter((x) => x.slug !== g.slug)
    .map((x) => `<a href="/transit-visa/${x.slug}">Transit visa for ${esc(x.name)}</a>`).join("");

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg"><script defer src="/_vercel/insights/script.js"></script>
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
<style>${STYLE}</style></head>
<body>${HEADER}<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › <a href="/transit-visa">Transit visas</a> › ${esc(g.name)}</nav>
<h1>Do you need a transit visa for ${esc(g.name)}?</h1>
<div class="updated">Last reviewed: ${esc(g.reviewed)}</div>
<p class="lead">${esc(g.summary)}</p>

<section class="card"><h2>Staying airside (not leaving the airport)</h2><p>${esc(g.airside)}</p></section>
<section class="card"><h2>Leaving the airport during your layover</h2><p>${esc(g.landside)}</p></section>
<section class="card"><h2>Key transit schemes &amp; facts</h2><ul>${schemes}</ul></section>

<div class="note"><strong>Always confirm before booking.</strong> Transit rules depend on your exact nationality, route, and airline, and they change often. Verify with your airline and the official source below.</div>

<section class="card"><h2>Official source</h2><p><a href="${esc(g.officialUrl)}" rel="nofollow noopener" target="_blank">${esc(g.officialName)} ↗</a></p></section>

<section class="card"><h2>Frequently asked questions</h2>${faqHtml}</section>

<section class="card"><h2>Check the visa you'll need at your destination</h2>
<p>Beyond transit, you'll need to know the visa rules for where you're actually going.</p>
<a class="cta" href="/">Open the visa checker →</a></section>

<section class="card"><h2>Other transit hubs</h2><div class="cols">${others}</div></section>
</main>${FOOTER(g.reviewed)}</body></html>`;
}
