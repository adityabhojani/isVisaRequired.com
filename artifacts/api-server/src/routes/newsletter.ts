import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "../lib/logger";
import { writeLimiter } from "../middleware/rateLimiter";
import { requireAdmin } from "../middleware/requireAdmin";

const router: IRouter = Router();

// Create table if it doesn't exist on startup
db.execute(sql`
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    passport_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`).catch((err: unknown) => {
  logger.error({ err }, "Failed to create newsletter_subscribers table");
});

const subscribeSchema = z.object({
  email: z.string().email().max(254),
  passportCode: z.string().min(2).max(2).toUpperCase().optional(),
});

// Apply strict rate limit to subscribe endpoint — 10 per minute per IP
router.post("/newsletter/subscribe", writeLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  const { email, passportCode } = parsed.data;

  try {
    await db.execute(sql`
      INSERT INTO newsletter_subscribers (email, passport_code)
      VALUES (${email}, ${passportCode ?? null})
      ON CONFLICT (email) DO NOTHING
    `);
    req.log.info({ email: email.replace(/(.{2}).*@/, "$1***@"), passportCode }, "Newsletter subscriber added");
    res.json({ success: true, message: "You're subscribed! We'll notify you of major visa policy changes." });
  } catch (err) {
    req.log.error({ err }, "Failed to insert newsletter subscriber");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.get("/newsletter/count", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.execute(sql`SELECT COUNT(*) as count FROM newsletter_subscribers`);
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({ count: Number((result.rows[0] as { count: string }).count) });
  } catch {
    res.json({ count: 0 });
  }
});

// ─── Admin: list all subscribers ─────────────────────────────────────────────
router.get("/admin/newsletter/subscribers", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.execute(sql`
      SELECT id, email, passport_code, created_at
      FROM newsletter_subscribers
      ORDER BY created_at DESC
    `);
    const totalResult = await db.execute(sql`SELECT COUNT(*) as count FROM newsletter_subscribers`);
    res.json({
      subscribers: result.rows,
      total: Number((totalResult.rows[0] as { count: string }).count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch newsletter subscribers");
    res.status(500).json({ error: "Failed to load subscribers." });
  }
});

export default router;
