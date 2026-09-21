// Shared layout + helpers for the rich passport & destination hub pages.
import { VISA_STATUS, VISA_STATUS_ORDER, statusIconSvg, type VisaRequirement } from "@workspace/travel-data";
import { FONT_LINKS, BASE_STYLE, renderHeader, renderFooter } from "./shell";
import { SITE_ORIGIN, DATA_LAST_UPDATED } from "./render";

export { SITE_ORIGIN, DATA_LAST_UPDATED };

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Status presentation. This file used to export its own label and colour
// maps — bright hexes under 11px white text (as low as 2.15:1), with
// visa_required red and no_admission grey where the app said orange and red.
// Everything now comes from the shared record in @workspace/travel-data: the
// word and icon from VISA_STATUS, the colours from the --status-* custom
// properties that BASE_STYLE (seo/shell.ts) puts on every page. No status
// colour is written here.

/** Status badge: icon + the shared label, ink on tint. */
export function statusBadge(req: VisaRequirement): string {
  return `<span class="badge s-${req}">${statusIconSvg(req, 16)}<span>${esc(VISA_STATUS[req].label)}</span></span>`;
}

/** A stat card whose number is a count of one status: the number in its ink, the badge beneath. */
export function statusStat(req: VisaRequirement, count: number): string {
  return `<div class="stat status s-${req}"><div class="n">${count}</div><div class="k">${statusBadge(req)}</div></div>`;
}

/**
 * The h2 above one status group. The page's own heading words carry the
 * status; the icon tile and the count take its colours. `id` stays the
 * requirement key so existing #visa_free-style anchors keep working.
 */
export function statusHeading(req: VisaRequirement, heading: string, count: number): string {
  return `<h2 id="${req}" class="sh s-${req}"><span class="sicon">${statusIconSvg(req, 16)}</span>${esc(heading)} <span class="sn">(${count})</span></h2>`;
}

// One scope class per status. It only points four local properties at the
// shared tokens, so the components below read var(--s-ink) etc. Built from the
// shared order so a status can't be left out.
const STATUS_SCOPES = VISA_STATUS_ORDER.map((k) => {
  const v = k.replace(/_/g, "-");
  return `.s-${k}{--s-ink:var(--status-${v}-ink);--s-tint:var(--status-${v}-tint);--s-line:var(--status-${v}-line)}`;
}).join("");

// No :root block here: BASE_STYLE (appended below) supplies every variable
// this uses. The old copy also declared a sky-blue --accent that exists
// nowhere in the shared token set.
const STYLE = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{color:var(--navy)}.wrap{max-width:920px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
nav.crumbs{font-size:13px;color:var(--muted);padding:14px 0}nav.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:29px;line-height:1.2;margin:6px 0 4px}h2{font-size:21px;margin:28px 0 10px}
.updated{color:var(--muted);font-size:13px;margin-bottom:14px}.lead{font-size:18px;color:#334155}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin:18px 0}
.stat{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px;text-align:center}
.stat .n{font-size:26px;font-weight:800}.stat .k{font-size:12px;color:var(--muted);margin-top:2px}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin:14px 0}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line)}
th{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.03em}
td a{text-decoration:none;font-weight:600}
${STATUS_SCOPES}
.badge{display:inline-flex;align-items:center;gap:6px;max-width:100%;font-size:var(--type-meta);font-weight:600;line-height:1.3;padding:3px 10px;border-radius:var(--r-pill);color:var(--s-ink);background:var(--s-tint);border:1px solid var(--s-line)}
.badge svg{flex:none}
.stat.status .n{color:var(--s-ink)}.stat.status .k{margin-top:6px}
.sh .sicon{display:inline-grid;place-items:center;width:28px;height:28px;margin-right:10px;vertical-align:middle;border-radius:var(--r-chip);color:var(--s-ink);background:var(--s-tint);border:1px solid var(--s-line)}
.sh .sn{color:var(--s-ink)}
.cols{column-width:220px;column-gap:24px}.cols a{display:block;padding:5px 0;text-decoration:none;font-size:14px}
.note{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:12px 16px;margin:14px 0;font-size:14px;color:#9a3412}
.faq{border-top:1px solid var(--line);padding:12px 0}.faq:first-of-type{border-top:0}.faq h3{margin:0 0 4px;font-size:16px}.faq p{margin:0;color:#334155}
.cta{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-top:6px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}footer.site a{color:var(--muted)}`;

export function page(opts: {
  title: string;
  description: string;
  canonical: string;
  jsonLd: object[];
  body: string;
}): string {
  const ld = opts.jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("");
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
<link rel="canonical" href="${esc(opts.canonical)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(opts.title)}"><meta property="og:description" content="${esc(opts.description)}"><meta property="og:url" content="${esc(opts.canonical)}">
<meta property="og:image" content="${SITE_ORIGIN}/opengraph.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg"><script defer src="/_vercel/insights/script.js"></script>
${ld}
${FONT_LINKS}<style>${STYLE}${BASE_STYLE}</style></head>
<body>
${renderHeader()}
<main class="wrap">${opts.body}</main>
${renderFooter()}
</body></html>`;
}
