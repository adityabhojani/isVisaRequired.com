// E-E-A-T page: how we source and maintain the visa data. Immigration is a
// "your money or your life" topic, so Google rewards visible authority,
// transparent sourcing, dated reviews and clear limitations. Honest content —
// no invented credentials.
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
h1{font-size:30px;line-height:1.2;margin:6px 0 4px}h2{font-size:21px;margin:28px 0 8px}
.updated{color:var(--muted);font-size:13px;margin-bottom:8px}.lead{font-size:18px;color:#334155}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 22px;margin:18px 0}
.note{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px 18px;margin:18px 0;font-size:14px;color:#9a3412}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}footer.site .wrap{max-width:860px}
footer.site a{color:var(--muted)}`;

export function renderMethodology(): string {
  const canonical = `${SITE_ORIGIN}/methodology`;
  const title = "How we source our visa data — Methodology | isvisarequired.com";
  const desc = "How isvisarequired.com sources, verifies and updates visa-requirement data: official government portals, an open base dataset, source-verified corrections, dated reviews, and our limitations.";

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "isvisarequired.com",
    url: SITE_ORIGIN,
    description: "Free visa-requirement checker covering 199 countries and ~38,000 passport–destination pairs.",
  };
  const webpage = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    url: canonical,
    dateModified: DATA_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
  };

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(org)}</script>
<script type="application/ld+json">${JSON.stringify(webpage)}</script>
<style>${STYLE}</style></head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>
<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › Methodology</nav>
<h1>How we source our visa data</h1>
<div class="updated">Last reviewed: ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">Visa rules affect real money and real travel plans, so we're upfront about where our information comes from, how current it is, and where its limits are.</p>

<h2>What we cover</h2>
<p>isvisarequired.com provides visa-requirement guidance for 199 countries — roughly 38,000 passport-to-destination combinations — plus dedicated guides for airport transit and electronic travel authorisations (ETIAS, ESTA, ETA, eTA).</p>

<h2>Where our data comes from</h2>
<div class="card">
<p>Our requirement data is built from three layers:</p>
<ol>
<li><strong>Official government sources.</strong> Every destination page links directly to that country's official immigration portal and its embassy/consulate finder — the authoritative source for your specific case.</li>
<li><strong>An open base dataset.</strong> Our baseline matrix is derived from the widely-used open-source Passport Index dataset, which gives consistent coverage across all country pairs.</li>
<li><strong>Source-verified corrections.</strong> Where the baseline has gone stale, we layer on manual corrections that we've checked against official government announcements (for example, recent changes to the UK ETA and visa-free transit schemes). These corrections always take precedence over the baseline.</li>
</ol>
</div>

<h2>How current it is</h2>
<p>Every page shows a visible <strong>"last reviewed"</strong> date so you can judge freshness for yourself. Visa policy changes frequently and sometimes with little notice; a date tells you when we last checked, not a guarantee that nothing has changed since.</p>

<h2>Important limitations</h2>
<div class="note">
<p>Our information is <strong>general guidance, not legal or immigration advice</strong>. Your actual requirement can depend on details we can't always capture — your specific nationality and any second nationality, your residence permits, the purpose and length of your trip, your exact route and any layovers, and recent rule changes.</p>
<p><strong>Always confirm with the official government source (linked on every page) or the airline before you book or travel.</strong> We are not liable for decisions made solely on the basis of this site.</p>
</div>

<h2>Transit and residence are separate</h2>
<p>The main checker covers tourist/short-stay entry. Airport <a href="/transit-visa">transit rules</a> and <a href="/travel-authorization">electronic travel authorisations</a> are handled on their own pages, because they follow different rules. Residence permits and second documents can also change your requirement — check the official source for your situation.</p>

<h2>Spotted something wrong?</h2>
<p>We genuinely want to fix errors quickly. If a page looks out of date against an official source, please let us know and we'll review it against the government source and update our corrections.</p>

<h2>Who we are</h2>
<p>isvisarequired.com is an independent travel-information service. We are not affiliated with any government, embassy or visa-processing company, and we never charge for visa applications — we only ever point you to the official portal.</p>
</main>
<footer class="site"><div class="wrap">© isvisarequired.com — general guidance only; always confirm with official government sources. Last reviewed ${esc(DATA_LAST_UPDATED)}. · <a href="/">Home</a></div></footer>
</body></html>`;
}
