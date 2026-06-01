// "Report a correction" / contact channel. Public submit endpoint stores to the
// DB; admins read them. No email service needed (E-E-A-T accountability signal +
// completes the methodology page's "spotted something wrong?" promise).
import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db, isDatabaseConfigured } from "@workspace/db";
import { sql } from "drizzle-orm";
import { writeLimiter } from "../middleware/rateLimiter";
import { requireAdmin } from "../middleware/requireAdmin";

const router: IRouter = Router();

if (isDatabaseConfigured()) {
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS corrections (
      id          SERIAL PRIMARY KEY,
      context     TEXT,
      message     TEXT NOT NULL,
      email       TEXT,
      resolved    BOOLEAN NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `).catch(() => { /* table create is best-effort on cold start */ });
}

const submitSchema = z.object({
  message: z.string().trim().min(5).max(2000),
  context: z.string().trim().max(300).optional().default(""),
  email: z.string().email().max(254).optional().or(z.literal("")),
});

router.post("/corrections", writeLimiter, async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConfigured()) {
    res.status(503).json({ error: "Submissions aren't available right now." });
    return;
  }
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please enter a message of at least 5 characters." });
    return;
  }
  const { message, context, email } = parsed.data;
  try {
    await db.execute(sql`
      INSERT INTO corrections (context, message, email)
      VALUES (${context || null}, ${message}, ${email || null})
    `);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save correction");
    res.status(500).json({ error: "Couldn't submit — please try again." });
  }
});

router.get("/admin/corrections", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.execute(sql`
      SELECT id, context, message, email, resolved, created_at
      FROM corrections ORDER BY created_at DESC LIMIT 500
    `);
    res.setHeader("Cache-Control", "no-store");
    res.json({ corrections: result.rows, total: result.rows.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to load." });
  }
});

router.post("/admin/corrections/:id/resolve", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID." }); return; }
  try {
    await db.execute(sql`UPDATE corrections SET resolved = TRUE WHERE id = ${id}`);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed." });
  }
});

export default router;
