// Shared layout + helpers for the rich passport & destination hub pages.
import { SITE_ORIGIN, DATA_LAST_UPDATED } from "./render";

export { SITE_ORIGIN, DATA_LAST_UPDATED };

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const REQ_LABEL: Record<string, string> = {
  visa_free: "Visa-free",
  visa_on_arrival: "Visa on arrival",
  e_visa: "eVisa",
  visa_required: "Visa required",
  no_admission: "Entry not permitted",
};
export const REQ_COLOR: Record<string, string> = {
  visa_free: "#10b981",
  visa_on_arrival: "#f59e0b",
  e_visa: "#0DB5E8",
  visa_required: "#ef4444",
  no_admission: "#6b7280",
};

const STYLE = `:root{--navy:#0A2FA1;--accent:#0DB5E8;--bg:#F7F9FC;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{color:var(--navy)}.wrap{max-width:920px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{font-weight:800;color:var(--navy);text-decoration:none;font-size:18px}.logo span{color:var(--accent)}
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
.badge{display:inline-block;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px}
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
<style>${STYLE}</style></head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>
<main class="wrap">${opts.body}</main>
<footer class="site"><div class="wrap">© isvisarequired.com — general guidance only; always confirm with official government sources. Last reviewed ${esc(DATA_LAST_UPDATED)}. · <a href="/methodology">How we source our data</a></div></footer>
</body></html>`;
}
