// Explainer: how a residence permit or a "strong" visa (US, UK, Schengen, etc.)
// can change your visa requirement for third countries. YMYL topic + no
// per-document dataset, so this is a conservative principle-level guide with
// only well-established examples and strong "verify per destination" framing.
import { SITE_ORIGIN, DATA_LAST_UPDATED } from "./render";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const STYLE = `:root{--navy:#0A2FA1;--accent:#0DB5E8;--bg:#F7F9FC;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.65}
a{color:var(--navy)}.wrap{max-width:760px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px;max-width:860px}
.logo{font-weight:800;color:var(--navy);text-decoration:none;font-size:18px}.logo span{color:var(--accent)}
nav.crumbs{font-size:13px;color:var(--muted);padding:14px 0}nav.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:30px;line-height:1.2;margin:6px 0 4px}h2{font-size:21px;margin:26px 0 8px}
.updated{color:var(--muted);font-size:13px;margin-bottom:8px}.lead{font-size:18px;color:#334155}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 22px;margin:16px 0}
.card h3{margin:0 0 6px;font-size:17px}
.note{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px 18px;margin:18px 0;font-size:14px;color:#9a3412}
.faq{border-top:1px solid var(--line);padding:12px 0}.faq:first-of-type{border-top:0}.faq h3{margin:0 0 4px;font-size:16px}.faq p{margin:0;color:#334155}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}footer.site .wrap{max-width:860px}footer.site a{color:var(--muted)}`;

export function renderResidence(): string {
  const canonical = `${SITE_ORIGIN}/residence-permit-visa-benefits`;
  const title = "Does a US visa, Green Card or residence permit change your visa requirements?";
  const desc = "How holding a US visa/Green Card, or a Schengen, UK or other residence permit can unlock visa-free or visa-on-arrival entry and transit to certain third countries — with the rock-solid examples and how to verify yours.";

  const faqs = [
    { q: "Does a residence permit change which visas I need?", a: "Often yes. Many countries grant easier entry — visa-free, visa on arrival, or transit exemptions — to people who hold a residence permit or a valid visa from a major country such as the US, UK, Canada or a Schengen state. The rules are specific to your exact document and destination, so always confirm with the destination's official portal." },
    { q: "Can I travel to Mexico with a US visa or Green Card?", a: "Travelers holding a valid US visa or US Green Card can generally enter Mexico for tourism without a separate Mexican visa. Several Central American and Caribbean countries have similar policies. Confirm the current rule with the destination's official immigration site before you travel." },
    { q: "What does a Schengen residence permit let me do?", a: "A valid Schengen residence permit generally allows short visa-free visits to the non-EU Western Balkan countries (such as Albania, North Macedonia, Serbia, Montenegro, Bosnia and Herzegovina and Kosovo) and exempts you from the Schengen airport transit visa. It does not replace a visa for countries outside that scope." },
    { q: "Why doesn't your checker ask about my residence permit yet?", a: "Second-document rules are detailed and change often. We're upfront that our main checker is based on passport nationality; for residence-based exemptions, use this guide and confirm the specific rule with the official source for your destination." },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Residence permits & visa requirements", item: canonical },
    ],
  };

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
<style>${STYLE}</style></head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>
<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › Residence permits &amp; visa requirements</nav>
<h1>Does a residence permit or US/UK/Schengen visa change your visa requirements?</h1>
<div class="updated">Last reviewed: ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">Your passport isn't always the whole story. Holding a residence permit — or a valid visa from a major country — can unlock easier entry to certain third countries. Here's how it works, and the cases that are well established.</p>

<div class="note"><strong>This is general guidance, not a ruling for your case.</strong> Second-document rules are specific to your exact permit/visa and destination, and they change often. Always confirm with the destination's official immigration portal (linked on each destination page) before you book or travel.</div>

<h2>The general principle</h2>
<p>Many countries will admit you — visa-free, on arrival, or in transit — if you hold a residence permit or a valid multiple-entry visa from a country they trust (commonly the US, UK, Canada, Australia, or a Schengen state). The idea is that you've already been vetted by that country. What it unlocks depends entirely on the destination's own rules.</p>

<h2>Well-established examples</h2>
<div class="card"><h3>US visa or US Green Card</h3><p>A valid US visa or Green Card commonly allows entry without a separate visa to <strong>Mexico</strong>, and to several Central American and Caribbean countries. It does not waive the US ESTA/visa itself, and the US has no airside transit.</p></div>
<div class="card"><h3>Schengen residence permit</h3><p>Generally allows short visa-free visits to the non-EU <strong>Western Balkans</strong> (Albania, North Macedonia, Serbia, Montenegro, Bosnia and Herzegovina, Kosovo) and exempts you from the <a href="/transit-visa/schengen-area">Schengen airport transit visa</a>.</p></div>
<div class="card"><h3>UK visa or residence</h3><p>Can ease transit and, under specific schemes, travel to <strong>Ireland</strong> for certain visa holders. Check the British-Irish visa scheme and the destination's rules.</p></div>
<div class="card"><h3>GCC residence (UAE, Saudi Arabia, etc.)</h3><p>May grant visa-on-arrival or eased entry to some neighbouring countries for residents in certain job categories. This varies a lot — verify per destination.</p></div>

<h2>How to check your exact case</h2>
<p>Until our checker supports second documents directly, the reliable path is: look up your destination, then confirm on its official portal whether your specific residence permit or visa qualifies. Every <a href="/">destination page</a> links the official source.</p>

<section class="card"><h3 style="font-size:20px">Frequently asked questions</h3>${faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("")}</section>
</main>
<footer class="site"><div class="wrap">© isvisarequired.com — general guidance only; always confirm with official government sources. Last reviewed ${esc(DATA_LAST_UPDATED)}. · <a href="/methodology">How we source our data</a></div></footer>
</body></html>`;
}
