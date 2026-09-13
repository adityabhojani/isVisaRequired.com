// Pushing our URLs at Microsoft, one day's allowance at a time.
//
// WHY THIS EXISTS
// Bing discovers pages from the sitemap eventually, but "eventually" for a site
// with ~38,000 pair pages is a very long time, and Bing Webmaster Tools shows
// most of the site as never crawled. Two mechanisms shorten that:
//
//   1. Bing's URL Submission API. Direct, but rate-limited per site — a new
//      site gets ten a day, and the allowance rises as Bing comes to trust the
//      site. We ASK Bing what today's allowance is rather than guessing, and
//      never submit more than it says. Going over just returns errors and looks
//      like abuse.
//   2. IndexNow. The open protocol behind Bing, Yandex, Naver and Seznam. No
//      account, no quota published, up to 10,000 URLs per request. It needs a
//      key served as a text file on our own host, which proves we control it.
//
// Both are best-effort: this job never fails a deployment or blocks anything.
//
// SETUP (both optional and independent)
//   BING_API_KEY  — Bing Webmaster Tools → Settings → API access → API key.
//   INDEXNOW_KEY  — any 8-128 character hex string you invent, e.g.
//                   `openssl rand -hex 16`. The matching key file is served
//                   automatically at /{key}.txt once the variable is set.
import { logger } from "./logger";

export const SITE_URL = "https://www.isvisarequired.com";

/** Bing accepts at most 500 URLs in one SubmitUrlBatch call. */
const BING_BATCH_MAX = 500;
/** Most a single run will try, across chunks. */
const INDEXNOW_BATCH_MAX = 1000;
/** Bing rejects larger batches from this key with 403 — 100 is what it accepts. */
const INDEXNOW_CHUNK = 100;
/** Bing's own IndexNow endpoint, already proven against this site's key. */
const INDEXNOW_ENDPOINT = "https://www.bing.com/indexnow";
const TIMEOUT_MS = 20_000;

export function bingConfigured(): boolean {
  return Boolean(process.env.BING_API_KEY);
}

// An IndexNow key is not a secret. The protocol works by asking you to serve the
// key back from a public file on your own host, which is what proves you control
// the host; the key itself is meant to be readable by anyone. So we ship a
// default rather than leaving the whole mechanism switched off until someone
// sets an environment variable. INDEXNOW_KEY overrides it, for rotation.
//
// This is the site's existing key, already known to Bing and already served as a
// static file from artifacts/visa-checker/public. Do not mint a new one: a fresh
// key starts from zero trust and a smaller quota.
const DEFAULT_INDEXNOW_KEY = "0f8264930bf723c4519dfd306237a820";

export function indexNowKey(): string | null {
  const key = (process.env.INDEXNOW_KEY ?? "").trim() || DEFAULT_INDEXNOW_KEY;
  return /^[A-Za-z0-9-]{8,128}$/.test(key) ? key : null;
}

async function postJson(url: string, body: unknown): Promise<{ status: number; text: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return { status: res.status, text: (await res.text()).slice(0, 500) };
  } finally {
    clearTimeout(timer);
  }
}

export interface BingQuota {
  daily: number;
  monthly: number;
}

/**
 * Today's remaining allowance, straight from Bing. Returns null when the API
 * key is missing or the call fails — the caller then submits nothing rather
 * than guessing a number and burning the allowance on errors.
 */
export async function getBingQuota(): Promise<BingQuota | null> {
  const key = process.env.BING_API_KEY;
  if (!key) return null;
  const url =
    `https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota` +
    `?apikey=${encodeURIComponent(key)}&siteUrl=${encodeURIComponent(SITE_URL)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Bing quota lookup failed");
      return null;
    }
    const json = (await res.json()) as { d?: { DailyQuota?: number; MonthlyQuota?: number } };
    const daily = Number(json.d?.DailyQuota ?? 0);
    const monthly = Number(json.d?.MonthlyQuota ?? 0);
    if (!Number.isFinite(daily) || !Number.isFinite(monthly)) return null;
    return { daily: Math.max(0, daily), monthly: Math.max(0, monthly) };
  } catch (err) {
    logger.warn({ err }, "Bing quota lookup errored");
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export interface SubmitResult {
  attempted: number;
  accepted: number;
  status: number | null;
  error?: string;
}

/** Submit up to BING_BATCH_MAX URLs. The caller enforces the daily allowance. */
export async function submitToBing(urls: string[]): Promise<SubmitResult> {
  const key = process.env.BING_API_KEY;
  if (!key) return { attempted: 0, accepted: 0, status: null, error: "BING_API_KEY not set" };
  const batch = urls.slice(0, BING_BATCH_MAX);
  if (!batch.length) return { attempted: 0, accepted: 0, status: null };
  try {
    const { status, text } = await postJson(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${encodeURIComponent(key)}`,
      { siteUrl: SITE_URL, urlList: batch },
    );
    // A successful SubmitUrlbatch returns {"d":null}; anything else is a failure
    // we should surface rather than count as accepted.
    const ok = status >= 200 && status < 300;
    return { attempted: batch.length, accepted: ok ? batch.length : 0, status, ...(ok ? {} : { error: text }) };
  } catch (err) {
    return { attempted: batch.length, accepted: 0, status: null, error: String(err) };
  }
}

/**
 * Ping IndexNow (Bing, Yandex, Naver, Seznam) in chunks of 100.
 *
 * The chunk size is not arbitrary: submitting this site's key in larger batches
 * is rejected with 403, which scripts/indexnow-submit.mjs found the hard way.
 * Bing publishes no daily figure either, so rather than guess one we keep going
 * until five chunks in a row fail — the shape a spent quota takes — and report
 * only what was actually accepted. The caller records exactly that many URLs as
 * submitted, so a refused chunk is simply retried tomorrow.
 */
export async function submitToIndexNow(urls: string[]): Promise<SubmitResult> {
  const key = indexNowKey();
  if (!key) return { attempted: 0, accepted: 0, status: null, error: "no IndexNow key" };
  const batch = urls.slice(0, INDEXNOW_BATCH_MAX);
  if (!batch.length) return { attempted: 0, accepted: 0, status: null };

  let accepted = 0;
  let lastStatus: number | null = null;
  let lastError: string | undefined;
  let failStreak = 0;

  for (let i = 0; i < batch.length; i += INDEXNOW_CHUNK) {
    const chunk = batch.slice(i, i + INDEXNOW_CHUNK);
    try {
      const { status, text } = await postJson(INDEXNOW_ENDPOINT, {
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: chunk,
      });
      lastStatus = status;
      // 200 = accepted; 202 = accepted, key file not read yet.
      if (status === 200 || status === 202) {
        accepted += chunk.length;
        failStreak = 0;
      } else {
        lastError = text;
        failStreak++;
      }
    } catch (err) {
      lastError = String(err);
      failStreak++;
    }
    if (failStreak >= 5) break;
    // Ease off between chunks; the whole run has to fit in one function call.
    if (i + INDEXNOW_CHUNK < batch.length) await new Promise((r) => setTimeout(r, 200));
  }

  return {
    attempted: batch.length,
    accepted,
    status: lastStatus,
    ...(accepted < batch.length && lastError ? { error: lastError } : {}),
  };
}
