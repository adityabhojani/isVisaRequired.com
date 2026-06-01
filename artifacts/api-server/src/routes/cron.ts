// Scheduled job (Vercel Cron → GET /api/cron/check-alerts): for every active
// visa alert, recompute the current requirement and email the subscriber when it
// has changed since last check. First time an alert is seen, we just record a
// baseline (no email). Protected by CRON_SECRET when set.
import { Router, type IRouter, type Request, type Response } from "express";
import { db, isDatabaseConfigured } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getDefaultEntry } from "../data/visaData";
import { countries } from "../data/countries";
import { sendEmail, isEmailConfigured } from "../lib/email";
import { alertUnsubUrl } from "../lib/alertToken";
import { logger } from "../lib/logger";

const router: IRouter = Router();

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
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  if (!isDatabaseConfigured()) {
    res.json({ ok: true, skipped: "no database configured" });
    return;
  }

  let checked = 0, baselined = 0, changed = 0, emailed = 0;
  try {
    const result = await db.execute(sql`
      SELECT id, email, passport_code, destination_code, last_requirement
      FROM visa_alerts WHERE is_active = TRUE LIMIT 2000
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
        if (isEmailConfigured()) {
          const ok = await sendEmail({
            to: a.email,
            subject: `Visa update: ${nameOf(a.passport_code)} → ${nameOf(a.destination_code)}`,
            html: changeEmailHtml(a, a.last_requirement, current),
          });
          if (ok) emailed++;
        }
        await db.execute(sql`UPDATE visa_alerts SET last_requirement = ${current} WHERE id = ${a.id}`);
      }
    }
    logger.info({ checked, baselined, changed, emailed }, "Visa alert check complete");
    res.json({ ok: true, checked, baselined, changed, emailed, emailConfigured: isEmailConfigured() });
  } catch (err) {
    logger.error({ err }, "Alert check failed");
    res.status(500).json({ error: "Alert check failed." });
  }
});

export default router;
