// Submit all sitemap URLs to IndexNow (Bing, DuckDuckGo, Yandex, Seznam, Naver
// — engines that also feed AI search). Google ignores IndexNow; this is for
// everyone else. Usage: node scripts/indexnow-submit.mjs
const HOST = "www.isvisarequired.com";
const KEY = "0f8264930bf723c4519dfd306237a820";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function fetchText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.text();
}
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const index = await fetchText(`https://${HOST}/sitemap.xml`);
const childSitemaps = locs(index);
const urls = [];
for (const sm of childSitemaps) {
  try { urls.push(...locs(await fetchText(sm))); }
  catch (e) { console.error("skip", sm, String(e)); }
}
console.log(`collected ${urls.length} URLs from ${childSitemaps.length} sitemaps`);

for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
  });
  console.log(`batch ${i / 10000 + 1}: ${batch.length} URLs -> HTTP ${res.status}`);
}
