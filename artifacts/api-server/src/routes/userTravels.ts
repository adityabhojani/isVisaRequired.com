import { Router, type IRouter } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";
import { writeLimiter } from "../middleware/rateLimiter";

const router: IRouter = Router();

// Create table on startup
db.execute(sql`
  CREATE TABLE IF NOT EXISTS user_visited_countries (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    country_code TEXT NOT NULL,
    visited_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, country_code)
  )
`).catch((err: unknown) => {
  logger.error({ err }, "Failed to create user_visited_countries table");
});

function requireAuth(req: Parameters<typeof getAuth>[0], res: { status: (n: number) => { json: (d: unknown) => void } }, next: () => void) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Sign in to save your travel data." });
    return;
  }
  (req as unknown as Record<string, unknown>)["userId"] = userId;
  next();
}

router.get("/user/visited-countries", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as unknown as Record<string, string>)["userId"];
  try {
    const result = await db.execute(sql`
      SELECT country_code, visited_at FROM user_visited_countries
      WHERE user_id = ${userId}
      ORDER BY visited_at ASC
    `);
    res.setHeader("Cache-Control", "no-store");
    res.json({ visited: result.rows.map((r) => (r as { country_code: string }).country_code) });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch visited countries");
    res.status(500).json({ error: "Failed to load your travel data." });
  }
});

router.post("/user/visited-countries", writeLimiter, requireAuth, async (req, res): Promise<void> => {
  const userId = (req as unknown as Record<string, string>)["userId"];
  const schema = z.object({ code: z.string().min(2).max(2).toUpperCase() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid country code." }); return; }

  try {
    await db.execute(sql`
      INSERT INTO user_visited_countries (user_id, country_code)
      VALUES (${userId}, ${parsed.data.code})
      ON CONFLICT (user_id, country_code) DO NOTHING
    `);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to add visited country");
    res.status(500).json({ error: "Failed to save." });
  }
});

router.delete("/user/visited-countries/:code", writeLimiter, requireAuth, async (req, res): Promise<void> => {
  const userId = (req as unknown as Record<string, string>)["userId"];
  const code = (String(req.params.code ?? "")).toUpperCase();
  if (!code || code.length !== 2) { res.status(400).json({ error: "Invalid country code." }); return; }

  try {
    await db.execute(sql`
      DELETE FROM user_visited_countries WHERE user_id = ${userId} AND country_code = ${code}
    `);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to remove visited country");
    res.status(500).json({ error: "Failed to save." });
  }
});

export default router;
