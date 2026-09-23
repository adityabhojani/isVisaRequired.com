// Submit sitemap URLs to IndexNow (Bing/Yandex/Naver/Seznam — DuckDuckGo and
// Copilot draw on Bing's index; Google ignores IndexNow entirely).
//
// Submit only what changed. Until 2026-09-22 this pushed every URL in the
// sitemap on every run, and the weekly job plus hand runs had told Bing about
// all ~37,800 pages six times in three weeks. indexnow.org asks sites to
// "avoid submitting unchanged URLs"; a 429 is its rate limit. Every <lastmod>
// is now a real per-page date (seo/freshness.ts), so `--since=YYYY-MM-DD`
// submits the pages whose lastmod is on or after that day and nothing else.
// With no --since the whole inventory goes, which is right only after a
// change that touched every page — say so on the command line, on purpose.
//
// Batches of ≤100 are what this key has been accepted at (larger ones came
// back 403, which IndexNow documents as a key problem, not a size limit; the
// response body is printed so the next person can read what Bing actually
// said). Core and blog sitemaps go first, then the pair sitemaps.
const HOST = "www.isvisarequired.com";
const KEY = "0f8264930bf723c4519dfd306237a820";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://www.bing.com/indexnow";

const sinceArg = process.argv.find((a) => a.startsWith("--since="))?.slice("--since=".length);
if (sinceArg !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(sinceArg)) {
  console.error(`--since must be YYYY-MM-DD, got "${sinceArg}"`);
  process.exit(2);
}
const since = sinceArg ?? null;
// --dry-run collects and counts but posts nothing: the way to test a --since.
const dryRun = process.argv.includes("--dry-run");

const fetchText = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(`${u} -> ${r.status}`); return r.text(); };
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
// One <url> block at a time, so a lastmod can never be paired with the wrong loc.
const entries = (xml) => [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
  lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? "",
})).filter((e) => e.loc);

const children = locs(await fetchText(`https://${HOST}/sitemap.xml`));
children.sort((a, b) => (a.includes("pairs-") ? 1 : 0) - (b.includes("pairs-") ? 1 : 0));
const urls = [];
let seen = 0;
for (const sm of children) {
  try {
    for (const e of entries(await fetchText(sm))) {
      seen++;
      if (since && e.lastmod && e.lastmod < since) continue;
      urls.push(e.loc);
    }
  } catch (e) { console.error("skip", sm, String(e)); }
}
console.log(since
  ? `collected ${urls.length} of ${seen} URLs changed on or after ${since}`
  : `collected ${urls.length} URLs (no --since: submitting the whole inventory)`);
if (urls.length === 0) { console.log("nothing to submit"); process.exit(0); }
if (dryRun) { console.log(`dry run: would submit ${urls.length} URLs in ${Math.ceil(urls.length / 100)} batches; first: ${urls[0]}`); process.exit(0); }

let ok = 0, fail = 0, streak = 0;
for (let i = 0; i < urls.length; i += 100) {
  const batch = urls.slice(i, i + 100);
  let status = 0, text = "";
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
    });
    status = res.status;
    text = (await res.text()).slice(0, 200);
  } catch (e) { status = -1; text = String(e); }
  if (status === 200 || status === 202) { ok += batch.length; streak = 0; }
  else { fail += batch.length; streak++; console.log(`batch ${i / 100 + 1}: HTTP ${status} ${text}`); }
  if ((i / 100) % 20 === 0) console.log(`progress: ${i + batch.length}/${urls.length} (accepted ${ok})`);
  if (streak >= 5) { console.log(`stopping: ${streak} consecutive refusals — read the responses above before retrying.`); break; }
  await new Promise((r) => setTimeout(r, 1000));
}
console.log(`DONE: accepted ${ok} URLs, refused ${fail}`);
