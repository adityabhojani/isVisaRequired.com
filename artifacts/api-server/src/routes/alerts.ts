import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, isDatabaseConfigured } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";
import { writeLimiter } from "../middleware/rateLimiter";
import { requireAdmin } from "../middleware/requireAdmin";
import { verifyUnsubToken, verifyConfirmToken, alertConfirmUrl } from "../lib/alertToken";
import { sendEmail, isEmailConfigured } from "../lib/email";
import { countries } from "../data/countries";

const SITE_ORIGIN = "https://www.isvisarequired.com";
const countryName = (code: string): string => countries.find((c) => c.code === code)?.name ?? code;

function confirmEmailHtml(id: number, passport: string, destination: string): string {
  const url = alertConfirmUrl(id, SITE_ORIGIN);
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <h2 style="color:#0A2FA1">Confirm your visa alert</h2>
    <p>You (or someone using your email) asked to be notified when the visa requirement for
    <strong>${countryName(passport)}</strong> passport holders travelling to <strong>${countryName(destination)}</strong> changes.</p>
    <p><a href="${url}" style="display:inline-block;background:#0A2FA1;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Confirm this alert →</a></p>
    <p style="color:#64748b;font-size:13px;margin-top:24px">If you didn't request this, simply ignore this email — no alerts will be sent unless you confirm.</p>
  </div>`;
}

const router: IRouter = Router();

// Schema migration for visa_alerts. On serverless a fire-and-forget startup
// DDL races the first request (a handler referencing a new column 500s until
// the ALTER lands), so handlers AWAIT this memoized promise instead. A failed
// attempt clears the memo so the next request retries.
let _schemaReady: Promise<void> | null = null;
export function ensureAlertsSchema(): Promise<void> {
  if (!isDatabaseConfigured()) return Promise.resolve();
  if (!_schemaReady) {
    _schemaReady = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS visa_alerts (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          email TEXT NOT NULL,
          passport_code TEXT NOT NULL,
          destination_code TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          is_active BOOLEAN DEFAULT TRUE,
          UNIQUE(email, passport_code, destination_code)
        )
      `);
      // Snapshot of the last-known requirement, used to detect changes (cron).
      await db.execute(sql`ALTER TABLE visa_alerts ADD COLUMN IF NOT EXISTS last_requirement TEXT`);
      // Double-opt-in: new alerts need email confirmation before the cron
      // emails them. Pre-existing rows (NULL) are grandfathered as confirmed;
      // new inserts always set the column explicitly.
      await db.execute(sql`ALTER TABLE visa_alerts ADD COLUMN IF NOT EXISTS confirmed BOOLEAN`);
      await db.execute(sql`UPDATE visa_alerts SET confirmed = TRUE WHERE confirmed IS NULL`);
    })().catch((err: unknown) => {
      _schemaReady = null;
      logger.error({ err }, "Failed to create/upgrade visa_alerts table");
      throw err;
    });
  }
  return _schemaReady;
}
// Warm up eagerly (failures surface via the log; handlers re-await).
void ensureAlertsSchema().catch(() => {});

// One-click unsubscribe from an alert email (signed token, no login required).
router.get("/alerts/unsubscribe", async (req, res): Promise<void> => {
  const id = Number(req.query["id"]);
  const token = String(req.query["token"] ?? "");
  if (!id || isNaN(id) || !token || !verifyUnsubToken(id, token)) {
    res.status(400).type("html").send("<p>Invalid or expired unsubscribe link.</p>");
    return;
  }
  try {
    await db.execute(sql`UPDATE visa_alerts SET is_active = FALSE WHERE id = ${id}`);
    res.type("html").send(
      "<div style=\"font-family:Arial,sans-serif;text-align:center;padding:48px\"><h2>You're unsubscribed</h2><p>You won't get further emails for this visa alert.</p><p><a href=\"https://www.isvisarequired.com\">Back to isvisarequired.com</a></p></div>",
    );
  } catch (err) {
    req.log.error({ err }, "Unsubscribe failed");
    res.status(500).type("html").send("<p>Something went wrong. Please try again later.</p>");
  }
});

// One-click confirmation from the double-opt-in email (signed token, no login).
router.get("/alerts/confirm", async (req, res): Promise<void> => {
  const id = Number(req.query["id"]);
  const token = String(req.query["token"] ?? "");
  if (!id || isNaN(id) || !token || !verifyConfirmToken(id, token)) {
    res.status(400).type("html").send("<p>Invalid or expired confirmation link.</p>");
    return;
  }
  try {
    await ensureAlertsSchema();
    await db.execute(sql`UPDATE visa_alerts SET confirmed = TRUE, is_active = TRUE WHERE id = ${id}`);
    res.type("html").send(
      "<div style=\"font-family:Arial,sans-serif;text-align:center;padding:48px\"><h2>✓ Alert confirmed</h2><p>We'll email you if this visa requirement changes. You can unsubscribe from any alert email.</p><p><a href=\"https://www.isvisarequired.com\">Back to isvisarequired.com</a></p></div>",
    );
  } catch (err) {
    req.log.error({ err }, "Alert confirmation failed");
    res.status(500).type("html").send("<p>Something went wrong. Please try again later.</p>");
  }
});

router.post("/alerts", writeLimiter, async (req, res): Promise<void> => {
  const auth = getAuth(req);
  const userId = auth?.userId ?? null;

  const schema = z.object({
    email: z.string().email(),
    passport_code: z.string().min(2).max(3).toUpperCase(),
    destination_code: z.string().min(2).max(3).toUpperCase(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input." });
    return;
  }

  const { email, passport_code, destination_code } = parsed.data;

  try {
    await ensureAlertsSchema();
    // Double-opt-in: while email sending is configured, a new alert stays
    // unconfirmed until the address owner clicks the emailed link — otherwise
    // anyone could sign someone else's inbox up for alerts. Without email
    // configured nothing is ever sent, so alerts activate immediately (and
    // will be grandfathered as confirmed).
    const emailGate = isEmailConfigured();
    const result = await db.execute(sql`
      INSERT INTO visa_alerts (user_id, email, passport_code, destination_code, confirmed)
      VALUES (${userId}, ${email}, ${passport_code}, ${destination_code}, ${!emailGate})
      ON CONFLICT (email, passport_code, destination_code) DO UPDATE SET is_active = TRUE
      RETURNING id, confirmed
    `);
    const row = result.rows[0] as unknown as { id: number; confirmed: boolean | null };
    if (emailGate && row && !row.confirmed) {
      const sent = await sendEmail({
        to: email,
        subject: `Confirm your visa alert: ${countryName(passport_code)} → ${countryName(destination_code)}`,
        html: confirmEmailHtml(row.id, passport_code, destination_code),
      });
      if (!sent) {
        res.status(502).json({ error: "Couldn't send the confirmation email. Please try again shortly." });
        return;
      }
      res.json({ success: true, needsConfirmation: true });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to create visa alert");
    res.status(500).json({ error: "Failed to save alert." });
  }
});

router.get("/alerts", async (req, res): Promise<void> => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Sign in to view your alerts." });
    return;
  }

  try {
    await ensureAlertsSchema();
    const result = await db.execute(sql`
      SELECT id, passport_code, destination_code, created_at
      FROM visa_alerts
      WHERE user_id = ${userId} AND is_active = TRUE AND (confirmed IS NULL OR confirmed = TRUE)
      ORDER BY created_at DESC
    `);
    res.setHeader("Cache-Control", "no-store");
    res.json({ alerts: result.rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch alerts");
    res.status(500).json({ error: "Failed to load alerts." });
  }
});

router.delete("/alerts/:id", writeLimiter, async (req, res): Promise<void> => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid alert ID." });
    return;
  }

  try {
    await db.execute(sql`
      UPDATE visa_alerts SET is_active = FALSE
      WHERE id = ${id} AND user_id = ${userId}
    `);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete alert");
    res.status(500).json({ error: "Failed to delete alert." });
  }
});

router.get("/admin/alerts", requireAdmin, async (req, res): Promise<void> => {

  try {
    const result = await db.execute(sql`
      SELECT id, email, passport_code, destination_code, created_at, is_active
      FROM visa_alerts
      ORDER BY created_at DESC
      LIMIT 500
    `);
    const total = await db.execute(sql`SELECT COUNT(*) as count FROM visa_alerts WHERE is_active = TRUE`);
    res.json({
      alerts: result.rows,
      total: Number((total.rows[0] as { count: string }).count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch all alerts");
    res.status(500).json({ error: "Failed to load." });
  }
});

export default router;
