// Submit sitemap URLs to IndexNow (Bing/DuckDuckGo/Yandex/Naver — also feeds
// AI search). Google ignores IndexNow. New keys get modest quotas: batches of
// ≤100 are accepted (202), larger ones 403. Core pages are submitted first,
// then the pair pages; a sustained 403 streak (quota) stops the run cleanly.
const HOST = "www.isvisarequired.com";
const KEY = "0f8264930bf723c4519dfd306237a820";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://www.bing.com/indexnow";

const fetchText = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(`${u} -> ${r.status}`); return r.text(); };
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const children = locs(await fetchText(`https://${HOST}/sitemap.xml`));
// core + blog first (hubs, guides, report, tools), then the pair sitemaps
children.sort((a, b) => (a.includes("pairs-") ? 1 : 0) - (b.includes("pairs-") ? 1 : 0));
const urls = [];
for (const sm of children) { try { urls.push(...locs(await fetchText(sm))); } catch (e) { console.error("skip", sm, String(e)); } }
console.log(`collected ${urls.length} URLs`);

let ok = 0, fail = 0, streak = 0;
for (let i = 0; i < urls.length; i += 100) {
  const batch = urls.slice(i, i + 100);
  let status = 0;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
    });
    status = res.status;
  } catch { status = -1; }
  if (status === 200 || status === 202) { ok += batch.length; streak = 0; }
  else { fail += batch.length; streak++; }
  if ((i / 100) % 20 === 0) console.log(`progress: ${i + batch.length}/${urls.length} (accepted ${ok})`);
  if (streak >= 5) { console.log(`stopping: ${streak} consecutive failures (likely daily quota). Re-run tomorrow to continue.`); break; }
  await new Promise((r) => setTimeout(r, 1000));
}
console.log(`DONE: accepted ${ok} URLs, failed ${fail}`);
