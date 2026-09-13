// Scheduled job (Vercel Cron → GET /api/cron/check-alerts): for every active
// visa alert, recompute the current requirement and email the subscriber when it
// has changed since last check. First time an alert is seen, we just record a
// baseline (no email). Requires CRON_SECRET, which Vercel Cron sends as a Bearer
// token; with it unset the job refuses to run.
import crypto from "crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";
import { db, isDatabaseConfigured } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getDefaultEntry } from "../data/visaData";
import { countries } from "../data/countries";
import { sendEmail, isEmailConfigured } from "../lib/email";
import { alertUnsubUrl } from "../lib/alertToken";
import { isAdminUser } from "../middleware/requireAdmin";
import { ensureAlertsSchema } from "./alerts";
import { logger } from "../lib/logger";
import { coreUrls, staticBlogUrls, pairUrls } from "../seo/urlList";
import {
  bingConfigured, getBingQuota, indexNowKey, submitToBing, submitToIndexNow,
} from "../lib/urlSubmission";

const router: IRouter = Router();

// Fail CLOSED. The old check skipped authentication entirely whenever
// CRON_SECRET was unset, so anyone could run this job: a scan of the alerts
// table with writes, and emails once Resend is configured.
type CronAuth = "ok" | "unauthorized" | "not_configured";

// Hash both sides so timingSafeEqual always gets equal-length input and the
// comparison leaks neither the secret's length nor a matching prefix.
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a, "utf8").digest();
  const hb = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Generate the secret as hex (`openssl rand -hex 32`). A value with exactly two
// dots looks like a JWT, and Clerk's middleware on /api would try to read Vercel's
// Bearer header as a session token before this route ever runs.
function cronAuth(req: Request): CronAuth {
  const secret = process.env.CRON_SECRET;
  if (!secret) return "not_configured";
  return safeEqual(req.headers.authorization ?? "", `Bearer ${secret}`) ? "ok" : "unauthorized";
}

const SITE_ORIGIN = "https://www.isvisarequired.com";
const LABELS: Record<string, string> = {
  visa_free: "visa-free",
  visa_on_arrival: "visa on arrival",
  e_visa: "eVisa required",
  visa_required: "visa required",
  no_admission: "entry not permitted",
};
const nameOf = (code: string): string => countries.find((c) => c.code === code)?.name ?? code;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

interface AlertRow {
  id: number;
  email: string;
  passport_code: string;
  destination_code: string;
  last_requirement: string | null;
}

function changeEmailHtml(a: AlertRow, oldReq: string, newReq: string): string {
  const from = nameOf(a.passport_code);
  const to = nameOf(a.destination_code);
  const pairUrl = `${SITE_ORIGIN}/visa-requirements/${slug(from)}/${slug(to)}`;
  const unsub = alertUnsubUrl(a.id, SITE_ORIGIN);
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <h2 style="color:#0A2FA1">Visa requirement update</h2>
    <p>The visa requirement for <strong>${from}</strong> passport holders travelling to <strong>${to}</strong> has changed:</p>
    <p style="font-size:16px">Was: <strong>${LABELS[oldReq] ?? oldReq}</strong><br>Now: <strong style="color:#0A2FA1">${LABELS[newReq] ?? newReq}</strong></p>
    <p><a href="${pairUrl}" style="display:inline-block;background:#0A2FA1;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px">See full details →</a></p>
    <p style="color:#64748b;font-size:12px;margin-top:28px">You're receiving this because you set a visa alert on isvisarequired.com. Always confirm with official sources before travel.<br>
    <a href="${unsub}" style="color:#64748b">Unsubscribe from this alert</a></p>
  </div>`;
}

router.get("/cron/check-alerts", async (req: Request, res: Response): Promise<void> => {
  const cron = cronAuth(req);

  // Admin-only test send: /api/cron/check-alerts?test=you@email.com sends one
  // sample alert email so you can confirm the Resend pipeline works.
  const testTo = typeof req.query["test"] === "string" ? (req.query["test"] as string) : null;
  if (testTo) {
    // getAuth() throws when Clerk isn't mounted, so only ask when it is.
    const userId = process.env.CLERK_SECRET_KEY ? getAuth(req)?.userId : null;
    const okAdmin = Boolean(userId && isAdminUser(userId));
    const okSecret = cron === "ok";
    if (!okAdmin && !okSecret) {
      res.status(401).json({ error: "Sign in as admin to send a test email." });
      return;
    }
    if (!isEmailConfigured()) {
      res.status(503).json({ error: "Set RESEND_API_KEY in Vercel first, then redeploy." });
      return;
    }
    const sample: AlertRow = { id: 0, email: testTo, passport_code: "IN", destination_code: "GB", last_requirement: "visa_required" };
    const ok = await sendEmail({
      to: testTo,
      subject: "Test — this is what a visa alert looks like",
      html: changeEmailHtml(sample, "visa_required", "e_visa"),
    });
    res.json({ ok, sentTo: testTo, note: ok ? "Sent — check your inbox/spam." : "Send failed — check RESEND_API_KEY and sender domain." });
    return;
  }

  if (cron === "not_configured") {
    // 503, not 401, so a missing secret can be told apart from a wrong one from
    // outside — without running anything.
    logger.error("CRON_SECRET is not set on this deployment; refusing to run the alert check.");
    res.status(503).json({ error: "Cron is not configured on this deployment." });
    return;
  }
  if (cron !== "ok") {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  if (!isDatabaseConfigured()) {
    res.json({ ok: true, skipped: "no database configured" });
    return;
  }

  let checked = 0, baselined = 0, changed = 0, emailed = 0;
  try {
    await ensureAlertsSchema();
    const result = await db.execute(sql`
      SELECT id, email, passport_code, destination_code, last_requirement
      FROM visa_alerts WHERE is_active = TRUE AND (confirmed IS NULL OR confirmed = TRUE) LIMIT 2000
    `);
    const rows = result.rows as unknown as AlertRow[];
    for (const a of rows) {
      checked++;
      const current = getDefaultEntry(a.passport_code, a.destination_code).requirement;
      if (!a.last_requirement) {
        await db.execute(sql`UPDATE visa_alerts SET last_requirement = ${current} WHERE id = ${a.id}`);
        baselined++;
        continue;
      }
      if (a.last_requirement !== current) {
        changed++;
        let sent = false;
        if (isEmailConfigured()) {
          sent = await sendEmail({
            to: a.email,
            subject: `Visa update: ${nameOf(a.passport_code)} → ${nameOf(a.destination_code)}`,
            html: changeEmailHtml(a, a.last_requirement, current),
          });
          if (sent) emailed++;
        }
        // Only mark the change as seen once the subscriber has actually been
        // notified. If the send failed (or email isn't configured yet), leave
        // last_requirement so the next run retries instead of silently
        // swallowing the notification.
        if (sent) {
          await db.execute(sql`UPDATE visa_alerts SET last_requirement = ${current} WHERE id = ${a.id}`);
        }
      }
    }
    logger.info({ checked, baselined, changed, emailed }, "Visa alert check complete");
    res.json({ ok: true, checked, baselined, changed, emailed, emailConfigured: isEmailConfigured() });
  } catch (err) {
    logger.error({ err }, "Alert check failed");
    res.status(500).json({ error: "Alert check failed." });
  }
});

// ─── Daily URL submission to Bing / IndexNow ─────────────────────────────────
// Bing shows most of a large site as never crawled for months. This walks the
// whole inventory — landing pages and hubs first, then all ~38,000 pair pages —
// submitting exactly as many URLs a day as Bing says we are allowed, and never
// the same URL twice until everything else has had a turn.
//
// Both back ends are optional: with neither key set the job reports what it
// would have done and changes nothing.

const SUBMISSION_TABLE_READY = { done: false };

async function ensureSubmissionSchema(): Promise<void> {
  if (SUBMISSION_TABLE_READY.done) return;
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS url_submissions (
      url TEXT PRIMARY KEY,
      last_submitted TIMESTAMPTZ NOT NULL DEFAULT now(),
      submit_count INTEGER NOT NULL DEFAULT 1
    )
  `);
  SUBMISSION_TABLE_READY.done = true;
}

/** Landing pages and hubs first, then blog posts, then every pair page. */
function submissionInventory(): string[] {
  return [...coreUrls(), ...staticBlogUrls(), ...pairUrls()];
}

/**
 * Bing's own answer for today, capped at what one SubmitUrlbatch call takes.
 * Null means we could not ask, and the caller then submits nothing to Bing.
 */
async function bingBudget(): Promise<{ budget: number; daily: number | null; monthly: number | null }> {
  if (!bingConfigured()) return { budget: 0, daily: null, monthly: null };
  const quota = await getBingQuota();
  if (!quota) return { budget: 0, daily: null, monthly: null };
  return { budget: Math.min(quota.daily, 500), daily: quota.daily, monthly: quota.monthly };
}

router.get("/cron/submit-urls", async (req: Request, res: Response): Promise<void> => {
  const cron = cronAuth(req);
  const userId = process.env.CLERK_SECRET_KEY ? getAuth(req)?.userId : null;
  const okAdmin = Boolean(userId && isAdminUser(userId));
  if (cron === "not_configured" && !okAdmin) {
    res.status(503).json({ error: "Cron is not configured on this deployment." });
    return;
  }
  if (cron !== "ok" && !okAdmin) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  // ?dry=1 shows what today's run would submit without submitting anything.
  const dryRun = req.query["dry"] === "1";
  const inventory = submissionInventory();
  const { budget, daily, monthly } = await bingBudget();
  const keySet = Boolean(indexNowKey());

  // IndexNow publishes no daily cap, so it carries the bulk of the work: 1,000
  // a day while the site is still being covered for the first time (about five
  // weeks for the whole inventory), then 200 a day to keep it fresh. Bing's own
  // API is used strictly within the allowance it reports.
  const FIRST_PASS_PER_DAY = 1000;
  const REFRESH_PER_DAY = 200;
  if (budget === 0 && !keySet) {
    res.json({
      ok: true, submitted: 0, inventory: inventory.length,
      note: "Neither BING_API_KEY nor INDEXNOW_KEY is set on this deployment.",
    });
    return;
  }

  let batch: string[];
  let cycled = false;
  let remaining: number | null = inventory.length;
  if (isDatabaseConfigured()) {
    try {
      await ensureSubmissionSchema();
      const done = await db.execute(sql`SELECT url FROM url_submissions`);
      const seen = new Set((done.rows as { url: string }[]).map((r) => r.url));
      const fresh = inventory.filter((u) => !seen.has(u));
      remaining = fresh.length;
      cycled = fresh.length === 0;
      const perRun = Math.max(budget, keySet ? (cycled ? REFRESH_PER_DAY : FIRST_PASS_PER_DAY) : 0);
      batch = fresh.slice(0, perRun);
      if (batch.length < perRun) {
        // Everything has had a turn: top the batch up with whatever was
        // submitted longest ago, so the whole site keeps being refreshed.
        const top = perRun - batch.length;
        const old = await db.execute(sql`
          SELECT url FROM url_submissions ORDER BY last_submitted ASC LIMIT ${top}
        `);
        const inBatch = new Set(batch);
        batch = [...batch, ...(old.rows as { url: string }[]).map((r) => r.url).filter((u) => !inBatch.has(u))];
      }
    } catch (err) {
      logger.error({ err }, "URL submission bookkeeping failed");
      res.status(500).json({ error: "Submission bookkeeping failed." });
      return;
    }
  } else {
    // No database, so nothing is remembered between runs: rotate through the
    // inventory by day so consecutive runs still cover new ground instead of
    // resubmitting the same first page for ever.
    remaining = null;
    const perRun = Math.max(budget, keySet ? FIRST_PASS_PER_DAY : 0);
    const day = Math.floor(Date.now() / 86_400_000);
    const start = (day * perRun) % Math.max(1, inventory.length);
    batch = inventory.slice(start, start + perRun);
    if (batch.length < perRun) batch = [...batch, ...inventory.slice(0, perRun - batch.length)];
  }

  if (dryRun) {
    res.json({
      ok: true, dryRun: true, wouldSubmit: batch.length, cycled,
      bing: { configured: bingConfigured(), dailyQuota: daily, monthlyQuota: monthly, budget },
      indexNow: { configured: keySet },
      inventory: inventory.length, neverSubmitted: remaining, sample: batch.slice(0, 10),
    });
    return;
  }

  const bing = budget > 0 ? await submitToBing(batch.slice(0, budget)) : { attempted: 0, accepted: 0, status: null };
  const indexNow = keySet ? await submitToIndexNow(batch) : { attempted: 0, accepted: 0, status: null };

  // Record only what at least one back end actually took, so a failed run is
  // retried tomorrow rather than being silently skipped.
  const recorded = Math.max(bing.accepted, indexNow.accepted);
  if (recorded > 0 && isDatabaseConfigured()) {
    try {
      // One statement per 500 URLs. A row per round trip would take longer than
      // the function is allowed to run.
      const todo = batch.slice(0, recorded);
      for (let i = 0; i < todo.length; i += 500) {
        const values = sql.join(todo.slice(i, i + 500).map((u) => sql`(${u})`), sql`, `);
        await db.execute(sql`
          INSERT INTO url_submissions (url) VALUES ${values}
          ON CONFLICT (url) DO UPDATE SET last_submitted = now(), submit_count = url_submissions.submit_count + 1
        `);
      }
    } catch (err) {
      logger.error({ err }, "Failed to record URL submissions");
    }
  }

  logger.info({ bing, indexNow, cycled }, "URL submission run complete");
  res.json({
    ok: true, submitted: recorded, cycled, inventory: inventory.length,
    neverSubmitted: remaining === null ? null : Math.max(0, remaining - recorded),
    bing: { ...bing, dailyQuota: daily, monthlyQuota: monthly },
    indexNow,
  });
});

export default router;
