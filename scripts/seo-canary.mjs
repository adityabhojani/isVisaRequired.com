// Production SEO canary.
//
// WHY THIS EXISTS
// Between 6 June and late July 2026 this site lost essentially all of its
// Google impressions. No code change caused it: the last production
// deployment was 6 June, and every deployment after that was a PREVIEW.
// Vercel stamps `x-robots-tag: noindex` on preview deployments, so once the
// live domain was being served by one, all 37,830 pages told Google not to
// index them. Search Console recorded 25,922 pages "Excluded by 'noindex'
// tag", and impressions went to zero.
//
// The failure was invisible from the outside: the pages looked perfect in a
// browser and in view-source, because the directive lived in an HTTP header.
// That is exactly the class of failure a canary catches and a human does not.
//
// This checks the LIVE site the way Googlebot sees it and fails loudly.
// Run it on a schedule and after every production deploy.

const ORIGIN = "https://www.isvisarequired.com";
const APEX = "https://isvisarequired.com";
const GOOGLEBOT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

// One representative URL per page type. If a whole page type regresses, at
// least one of these catches it.
const INDEXABLE = [
  "/",
  "/visa-requirements/india/japan",
  "/visa-requirements/india",
  "/countries/japan",
  "/guides",
  "/guides/six-month-passport-rule",
  "/transit-visa/united-states",
  "/travel-authorization/etias",
  "/reports/passport-power-2026",
  "/tier-list",
  "/stats",
  "/reciprocity",
  "/digital-nomad",
  "/blog",
  "/methodology",
  "/privacy",
  "/sitemap.xml",
];

const failures = [];
const fail = (url, msg) => failures.push(`${url}\n    -> ${msg}`);

async function head(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": GOOGLEBOT },
    redirect: "manual",
  });
  return res;
}

async function checkIndexable(path) {
  const url = `${ORIGIN}${path}`;
  let res;
  try {
    // redirect:"manual" matters. The outage header rides on the FIRST
    // response; following a redirect first would inspect some other page's
    // headers and miss it entirely.
    res = await fetch(url, {
      headers: { "User-Agent": GOOGLEBOT },
      redirect: "manual",
    });
  } catch (e) {
    fail(url, `request failed: ${e.message}`);
    return;
  }

  // The header that caused the outage. It overrides on-page meta and is
  // invisible in view-source. Checked before anything else and before any
  // redirect is followed.
  const xr = res.headers.get("x-robots-tag");
  if (xr && /noindex|none/i.test(xr)) {
    fail(url, `X-Robots-Tag says "${xr}" — THIS IS THE JUNE-JULY 2026 OUTAGE MODE`);
  }

  if (res.status !== 200) {
    fail(url, `expected HTTP 200, got ${res.status}`);
    return; // nothing useful to parse
  }

  const body = await res.text();

  if (path.endsWith(".xml")) {
    if (!body.includes("<urlset") && !body.includes("<sitemapindex")) {
      fail(url, "sitemap is not valid XML");
    }
    return;
  }

  const meta = body.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? "";
  if (/noindex|none/i.test(meta)) fail(url, `on-page meta robots: ${meta}`);

  const canonical = body.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
  )?.[1];
  if (!canonical) fail(url, "no canonical tag");
  else if (!canonical.startsWith(`${ORIGIN}/`)) {
    fail(url, `canonical points off-origin: ${canonical}`);
  }

  // A page that renders nothing is indexable but worthless. The shell is
  // ~9.9KB of empty scaffolding; real pages are well above that.
  if (!/<h1[\s>]/i.test(body)) fail(url, "no <h1> in the server HTML");
}

async function checkApexRedirects() {
  for (const path of ["/", "/guides"]) {
    const res = await head(`${APEX}${path}`);
    if (res.status !== 308 && res.status !== 301) {
      fail(`${APEX}${path}`, `apex should redirect, got ${res.status}`);
    }
  }
}

async function checkUnknownIs404() {
  const url = `${ORIGIN}/this-url-should-not-exist-seo-canary-zzz`;
  const res = await fetch(url, { headers: { "User-Agent": GOOGLEBOT } });
  if (res.status !== 404) {
    fail(url, `unknown paths must 404 (soft-404 guard), got ${res.status}`);
  }
}

console.log(`SEO canary against ${ORIGIN}\n`);
for (const p of INDEXABLE) await checkIndexable(p);
await checkApexRedirects();
await checkUnknownIs404();

const checked = INDEXABLE.length + 3;
if (failures.length) {
  console.error(`\n✗ ${failures.length} FAILURE(S) of ${checked} checks:\n`);
  for (const f of failures) console.error(`  ${f}\n`);
  console.error(
    "If X-Robots-Tag noindex appears: the live domain is almost certainly being\n" +
      "served by a PREVIEW deployment. In Vercel, promote a deployment whose\n" +
      "target is 'production' (Deployments -> the main-branch build -> Promote).\n",
  );
  process.exit(1);
}
console.log(`✓ all ${checked} checks passed — site is indexable`);
