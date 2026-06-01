import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, isDatabaseConfigured } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";
import { writeLimiter } from "../middleware/rateLimiter";
import { requireAdmin } from "../middleware/requireAdmin";
import { verifyUnsubToken } from "../lib/alertToken";

const router: IRouter = Router();

// Create table on startup only when a database is configured. Without
// DATABASE_URL the visa-alerts feature is simply inactive.
if (isDatabaseConfigured()) {
  db.execute(sql`
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
  `)
    .then(() =>
      // Snapshot of the last-known requirement, used to detect changes (cron).
      db.execute(sql`ALTER TABLE visa_alerts ADD COLUMN IF NOT EXISTS last_requirement TEXT`),
    )
    .catch((err: unknown) => {
      logger.error({ err }, "Failed to create/upgrade visa_alerts table");
    });
}

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
    await db.execute(sql`
      INSERT INTO visa_alerts (user_id, email, passport_code, destination_code)
      VALUES (${userId}, ${email}, ${passport_code}, ${destination_code})
      ON CONFLICT (email, passport_code, destination_code) DO UPDATE SET is_active = TRUE
    `);
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
    const result = await db.execute(sql`
      SELECT id, passport_code, destination_code, created_at
      FROM visa_alerts
      WHERE user_id = ${userId} AND is_active = TRUE
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
