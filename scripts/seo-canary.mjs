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
const CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

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
  if (xr && /noindex|none|unavailable_after/i.test(xr)) {
    fail(url, `X-Robots-Tag says "${xr}" — THIS IS THE JUNE-JULY 2026 OUTAGE MODE`);
  }

  // Any UA-conditional difference is itself the alarm: it means something is
  // branching on user-agent, which is how crawlers get served a worse response
  // than humans without anyone noticing.
  const asChrome = await fetch(url, {
    headers: { "User-Agent": CHROME },
    redirect: "manual",
  }).catch(() => null);
  if (asChrome) {
    const cxr = asChrome.headers.get("x-robots-tag") ?? "";
    if ((xr ?? "") !== cxr) {
      fail(url, `X-Robots-Tag differs by user-agent: Googlebot="${xr ?? "none"}" Chrome="${cxr || "none"}"`);
    }
    if (asChrome.status !== res.status) {
      fail(url, `status differs by user-agent: Googlebot=${res.status} Chrome=${asChrome.status}`);
    }
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


async function checkRobotsTxt() {
  const url = `${ORIGIN}/robots.txt`;
  const res = await fetch(url, { headers: { "User-Agent": GOOGLEBOT } });
  // A 5xx on robots.txt makes Google treat the ENTIRE host as disallowed.
  if (res.status !== 200) return fail(url, `robots.txt must be 200, got ${res.status}`);
  const ct = res.headers.get("content-type") ?? "";
  if (!/text\/plain/i.test(ct)) fail(url, `robots.txt content-type is "${ct}"`);
  const body = await res.text();
  if (/<html/i.test(body)) fail(url, "robots.txt is being served HTML (catch-all swallowed it)");
  for (const line of body.split("\n")) {
    if (/^\s*Disallow:\s*\/\s*$/i.test(line)) {
      fail(url, "robots.txt contains a blanket 'Disallow: /' — the whole site is blocked");
    }
  }
  if (!/^\s*Sitemap:\s*https?:\/\//im.test(body)) fail(url, "robots.txt declares no Sitemap:");
}

// Pull a random sample of real URLs from the live sitemap.
//
// WHY RANDOM: a fixed list of flagship pages is blind by construction to a
// regression that hits only the long tail — which is where 37,830 of this
// site's 38,000 pages live. Sampling fresh each run eventually covers
// everything and cannot be gamed by the pages happening to be on the list.
async function sitemapSample(n) {
  const idx = await fetch(`${ORIGIN}/sitemap.xml`, {
    headers: { "User-Agent": GOOGLEBOT },
  });
  if (idx.status !== 200) {
    fail(`${ORIGIN}/sitemap.xml`, `sitemap index returned ${idx.status}`);
    return [];
  }
  const idxBody = await idx.text();
  if (/<!DOCTYPE html|<html/i.test(idxBody)) {
    fail(`${ORIGIN}/sitemap.xml`, "sitemap is being served HTML, not XML");
    return [];
  }
  const children = [...idxBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pool = [];
  // Sample a few child sitemaps rather than downloading all of them.
  for (const c of children.sort(() => Math.random() - 0.5).slice(0, 4)) {
    const r = await fetch(c, { headers: { "User-Agent": GOOGLEBOT } });
    if (r.status !== 200) { fail(c, `child sitemap returned ${r.status}`); continue; }
    const b = await r.text();
    if (/<!DOCTYPE html|<html/i.test(b)) { fail(c, "child sitemap served HTML"); continue; }
    pool.push(...[...b.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  if (pool.length < 100) fail(`${ORIGIN}/sitemap.xml`, `sitemap pool suspiciously small (${pool.length})`);
  const out = [];
  const seen = new Set();
  while (out.length < Math.min(n, pool.length)) {
    const i = Math.floor(Math.random() * pool.length);
    if (seen.has(i)) continue;
    seen.add(i);
    out.push(pool[i]);
  }
  return out;
}

async function checkSample(urls) {
  const canonicals = [];
  for (const url of urls) {
    const res = await fetch(url, {
      headers: { "User-Agent": GOOGLEBOT },
      redirect: "manual",
    }).catch(() => null);
    if (!res) { fail(url, "request failed"); continue; }

    const xr = res.headers.get("x-robots-tag");
    if (xr && /noindex|none/i.test(xr)) fail(url, `X-Robots-Tag: ${xr}`);
    // A URL listed in the sitemap must be the URL that is actually served.
    if (res.status !== 200) { fail(url, `sitemap URL returns ${res.status}, not 200`); continue; }

    const body = await res.text();
    const meta = body.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? "";
    if (/noindex|none/i.test(meta)) fail(url, `meta robots: ${meta}`);
    const canon = body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
    if (!canon) fail(url, "no canonical");
    else {
      canonicals.push(canon);
      if (!canon.startsWith(`${ORIGIN}/`)) fail(url, `canonical off-origin: ${canon}`);
    }
    if (!/<h1[\s>]/i.test(body)) fail(url, "no <h1> in server HTML");
  }
  // Cross-page assertion: if a templating bug collapses every canonical onto
  // one URL, each page looks fine alone. Only comparing them catches it.
  const distinct = new Set(canonicals).size;
  if (canonicals.length > 2 && distinct < canonicals.length) {
    fail(ORIGIN, `canonicals collapsed: ${canonicals.length} pages share only ${distinct} distinct canonical(s)`);
  }
}

console.log(`SEO canary against ${ORIGIN}\n`);
for (const p of INDEXABLE) await checkIndexable(p);
await checkApexRedirects();
await checkUnknownIs404();
await checkRobotsTxt();

const sample = await sitemapSample(20);
console.log(`sampled ${sample.length} random URLs from the live sitemap`);
await checkSample(sample);

const checked = INDEXABLE.length + 4 + sample.length;
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
