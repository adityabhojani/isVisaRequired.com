// Shared chrome for every server-rendered page: pair pages, passport and
// destination hubs, guides, transit, travel-authorisation, methodology,
// residence, the report.
//
// These pages are where organic search traffic lands. Until now they wore a
// different brand from the React app - a gradient-text sans logo, no
// navigation, no serif, stock grey shadows, sky-blue accents that exist
// nowhere in the app's token set. A visitor clicking through to the homepage
// saw what looked like a different company.
//
// Everything here mirrors artifacts/visa-checker/src/index.css: the same
// navy, the same cool near-white ground, Inter + Playfair Display, and the
// same navy-tinted shadow scale (rgb 15 23 41 is --foreground's hue).
import {
  FOOTER_GROUPS, FOOTER_LINKS, FOOTER_TAGLINE, FOOTER_DISCLAIMER,
  TOKENS_CSS, FONT_HREF,
} from "@workspace/travel-data";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// One font list for the whole site. The app's index.css @imports the same
// FONT_HREF, so a click from a search-landing page into the app is a cache hit
// rather than a second download of different weights.
export const FONT_LINKS =
  `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
  `<link rel="stylesheet" href="${FONT_HREF}">`;

// Appended AFTER each renderer's own <style> so shared chrome wins on shared
// selectors (header, footer, h1, .card, .cta) while page-specific classes are
// untouched. Kept dependency-free: no JS, no images, ~3KB.
//
// Every colour, radius, shadow and type size comes from TOKENS_CSS — the same
// string the app compiles into tokens.generated.css. This file, and every
// renderer that appends to it, holds no literal colour values of its own.
export const BASE_STYLE = `
${TOKENS_CSS}
@keyframes fade{from{opacity:0}to{opacity:1}}
details[open]>*:not(summary){animation:fade var(--motion-base) var(--motion-ease)}
@media (prefers-reduced-motion:reduce){*,::before,::after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important;scroll-behavior:auto!important}}
html{-webkit-text-size-adjust:100%}body{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:var(--bg)}
a{color:var(--navy)}
.wrap{max-width:920px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line);box-shadow:0 1px 0 rgb(15 23 41/.02)}
header.site .wrap,footer.site .wrap,main.wrap{max-width:920px}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;height:64px}
.brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink)}
.brand .mark{width:32px;height:32px;border-radius:999px;background:var(--navy);display:grid;place-items:center;flex:none}
.brand .mark svg{width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.brand .word{font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:18px;letter-spacing:-.01em}
.brand .tld{color:var(--muted);font-size:13px}
nav.top{display:flex;align-items:center;gap:4px;order:2}
nav.top a{color:var(--muted);text-decoration:none;font-size:14px;font-weight:500;padding:6px 10px;border-radius:8px}
nav.top a:hover{color:var(--ink);background:var(--secondary)}
.brand{order:1;margin-right:auto}
a.hdr-cta{order:3;flex:none;display:inline-flex;align-items:center;color:#fff;background:var(--navy);text-decoration:none;font-size:14px;font-weight:600;padding:8px 14px;border-radius:8px;box-shadow:0 8px 16px -6px rgb(10 47 161/.35)}
a.hdr-cta:hover{background:var(--navy-2)}
/* On a phone the nav used to hide every link but "Check visa", leaving the
   search-landing pages with no visible way to explore. The links now take a
   second row of their own that scrolls sideways; the fade says it scrolls.
   It must be justify-content:flex-start — with flex-end, overflow spills off
   the START of the row, where it can never be scrolled back into view. */
@media(max-width:720px){
header.site .wrap{flex-wrap:wrap;height:auto;padding-top:10px;row-gap:2px}
nav.top{order:4;flex:1 0 100%;justify-content:flex-start;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:0 -20px;padding:2px 14px 8px;mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent)}
nav.top::-webkit-scrollbar{display:none}
nav.top a{flex:none;white-space:nowrap;padding:8px 10px}
}
nav.crumbs{font-size:13px;color:var(--muted);padding:16px 0 8px}nav.crumbs a{color:var(--muted);text-decoration:none}nav.crumbs a:hover{color:var(--ink)}
h1{font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:clamp(28px,4.2vw,40px);line-height:1.1;letter-spacing:-.018em;margin:8px 0 6px}
h2{font-size:20px;font-weight:600;letter-spacing:-.01em;margin:26px 0 10px}
.updated{color:var(--muted);font-size:13px;margin-bottom:16px}
.card,.answer,.stat{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:var(--sh-xs)}
.card{padding:20px 22px;margin:16px 0}
.card h2{margin-top:0}
.answer{border-radius:16px;box-shadow:var(--sh-xl);padding:22px 24px}
.stat{padding:14px 16px}
.cta{display:inline-flex;align-items:center;gap:8px;background:var(--navy);color:#fff;text-decoration:none;font-weight:600;padding:13px 20px;border-radius:12px;margin-top:8px;box-shadow:0 12px 24px -8px rgb(10 47 161/.4);transition:background-color .15s,transform .15s}
.cta:hover{background:var(--navy-2)}.cta:active{transform:translateY(1px)}
/* Page hero: white Playfair on the same navy field as the homepage, with the
   first card straddling the seam - the one elevated object on the page. */
.hero{background:radial-gradient(125% 150% at 50% 0%,hsl(222 89% 34%) 0%,var(--field) 52%,var(--field-deep) 100%);color:#fff;padding:8px 0 52px}
.hero nav.crumbs,.hero nav.crumbs a{color:rgb(255 255 255/.65)}.hero nav.crumbs a:hover{color:#fff}
.hero h1{color:#fff}.hero .updated{color:rgb(255 255 255/.65);margin-bottom:0}
.hero+main{position:relative;margin-top:-32px}
.keep{margin:28px 0 8px}.keep h2{font-size:16px;margin-bottom:12px}
.keep .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.keep a{display:block;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.35;text-decoration:none;color:var(--ink);box-shadow:var(--sh-xs);transition:box-shadow .15s,border-color .15s}
.keep a:hover{box-shadow:var(--sh-md);border-color:rgb(10 47 161/.35)}
.keep a small{display:block;color:var(--muted);font-size:12px;margin-top:2px}
footer.site{margin-top:40px;border-top:1px solid var(--line);background:#fff;color:var(--muted);font-size:13px;padding:32px 0 28px;text-align:left}
footer.site .top{display:flex;align-items:center;justify-content:space-between;gap:12px 24px;flex-wrap:wrap;margin-bottom:28px}footer.site .top p{margin:0;max-width:640px;font-size:12px;line-height:1.55}
footer.site .cols{display:grid;grid-template-columns:repeat(4,1fr);gap:28px 24px;column-width:auto}
footer.site h4{margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
footer.site a{color:var(--muted);text-decoration:none;display:block;padding:3px 0}footer.site a:hover{color:var(--ink)}
footer.site .cols a{display:block;padding:3px 0}
footer.site a.brand{display:inline-flex;padding:0}
footer.site .legal{margin-top:30px;padding-top:16px;border-top:1px solid var(--line);font-size:12px;display:flex;align-items:center;justify-content:space-between;gap:10px 20px;flex-wrap:wrap}footer.site .legal nav{display:flex;flex-wrap:wrap;gap:4px 18px}footer.site .legal nav a{display:inline;padding:0}
footer.site .disclaimer{margin:10px 0 0;font-size:12px}
@media(max-width:640px){footer.site .cols{grid-template-columns:1fr 1fr}}
`;

const GLOBE = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

const NAV: [string, string][] = [
  ["/compare", "Compare"],
  ["/discover", "Discover"],
  ["/stats", "Passports"],
  ["/guides", "Guides"],
  ["/blog", "Blog"],
];

export function renderHeader(): string {
  const links = NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join("");
  return `<header class="site"><div class="wrap"><a class="brand" href="/" aria-label="isvisarequired.com home"><span class="mark">${GLOBE}</span><span class="word">isvisarequired</span><span class="tld">.com</span></a><nav class="top" aria-label="Primary">${links}</nav><a class="hdr-cta" href="/">Check visa →</a></div></header>`;
}

export function renderFooter(): string {
  const groups = FOOTER_GROUPS.map(
    (g) =>
      `<div><h4>${esc(g.title)}</h4>${g.links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}</div>`,
  ).join("");
  const links = FOOTER_LINKS.map(
    (l) => `<a href="${l.href}"${l.newTab ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(l.label)}</a>`,
  ).join("");
  return `<footer class="site"><div class="wrap">
<div class="top"><a class="brand" href="/"><span class="mark">${GLOBE}</span><span class="word">isvisarequired</span><span class="tld">.com</span></a>
<p>${esc(FOOTER_TAGLINE)}</p></div>
<nav class="cols" aria-label="Footer">${groups}</nav>
<div class="legal"><span>© ${new Date().getFullYear()} isvisarequired.com · Data: ilyankou/passport-index-dataset</span><nav aria-label="Site">${links}</nav></div>
<p class="disclaimer">${esc(FOOTER_DISCLAIMER)}</p>
</div></footer>`;
}

// "Keep going" - the continuation block that turned a completed answer into a
// second click on the homepage. Server-rendered here for the pages organic
// traffic actually lands on. Every href is a real route; nothing is asserted.
export function renderKeepGoing(tiles: { href: string; label: string; sub?: string }[]): string {
  if (!tiles.length) return "";
  const t = tiles.map((x) => `<a href="${x.href}">${x.label}${x.sub ? `<small>${x.sub}</small>` : ""}</a>`).join("");
  return `<section class="keep"><h2>Keep going</h2><div class="tiles">${t}</div></section>`;
}
