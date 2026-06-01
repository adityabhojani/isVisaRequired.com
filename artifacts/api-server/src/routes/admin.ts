import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { db, isDatabaseConfigured } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";
import { requireAdmin, isAdminUser } from "../middleware/requireAdmin";
import { writeLimiter } from "../middleware/rateLimiter";

const router: IRouter = Router();

// ─── Schema bootstrap ────────────────────────────────────────────────────────
// Only when a database is configured. Without DATABASE_URL the admin/blog/
// settings features are inactive and the core visa checker still runs.

if (isDatabaseConfigured()) {
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL UNIQUE,
      excerpt     TEXT,
      content     TEXT NOT NULL DEFAULT '',
      cover_url   TEXT,
      tags        TEXT[] DEFAULT '{}',
      author      TEXT NOT NULL DEFAULT 'Admin',
      published   BOOLEAN NOT NULL DEFAULT false,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `).catch((err: unknown) => logger.error({ err }, "Failed to create blog_posts table"));

  // Create table and seed defaults (single promise chain — no duplicate CREATE)
  db.execute(sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key         TEXT PRIMARY KEY,
      value       TEXT NOT NULL,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `).then(() =>
    db.execute(sql`
      INSERT INTO site_settings (key, value) VALUES
        ('announcement_enabled', 'false'),
        ('announcement_text', ''),
        ('announcement_type', 'info'),
        ('hero_title', 'Do you need a visa?'),
        ('hero_subtitle', 'Check visa requirements for 199 countries instantly — no account needed.'),
        ('seo_meta_description', 'Free visa requirement checker covering 199 countries. Instantly check if you need a visa, e-visa, or can enter visa-free.')
      ON CONFLICT (key) DO NOTHING
    `)
  ).catch((err: unknown) => logger.error({ err }, "Failed to initialise site_settings"));
}

// ─── Auth check endpoint ──────────────────────────────────────────────────────

router.get("/admin/check", (req: Request, res: Response): void => {
  // When Clerk auth is disabled, nobody is an admin (getAuth would throw).
  if (!process.env.CLERK_SECRET_KEY) { res.json({ isAdmin: false }); return; }
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) { res.json({ isAdmin: false }); return; }
  res.json({ isAdmin: isAdminUser(userId) });
});

// ─── Admin stats ─────────────────────────────────────────────────────────────

router.get("/admin/stats", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const [postsResult, publishedResult, settingsResult, usersResult] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM blog_posts`),
      db.execute(sql`SELECT COUNT(*) as count FROM blog_posts WHERE published = true`),
      db.execute(sql`SELECT COUNT(*) as count FROM site_settings`),
      db.execute(sql`SELECT COUNT(DISTINCT user_id) as count FROM user_visited_countries`).catch(() => ({ rows: [{ count: 0 }] })),
    ]);

    res.json({
      totalPosts: Number((postsResult.rows[0] as { count: string }).count),
      publishedPosts: Number((publishedResult.rows[0] as { count: string }).count),
      settingsCount: Number((settingsResult.rows[0] as { count: string }).count),
      registeredUsers: Number((usersResult.rows[0] as { count: string }).count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch admin stats");
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

// ─── Blog Posts ───────────────────────────────────────────────────────────────

router.get("/admin/posts", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.execute(sql`
      SELECT id, title, slug, excerpt, cover_url, tags, author, published, created_at, updated_at
      FROM blog_posts ORDER BY created_at DESC
    `);
    res.json({ posts: result.rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch blog posts");
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

router.get("/admin/posts/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID." }); return; }
  try {
    const result = await db.execute(sql`SELECT * FROM blog_posts WHERE id = ${id}`);
    if (result.rows.length === 0) { res.status(404).json({ error: "Post not found." }); return; }
    res.json({ post: result.rows[0] });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch blog post");
    res.status(500).json({ error: "Failed to fetch post." });
  }
});

// Serialise a JS string[] into a Postgres array literal (e.g. {"a","b"}).
// Needed because drizzle's raw `sql` template spreads a bare JS array into a
// SQL tuple ($1,$2) instead of a text[] — and an empty array into invalid `()`.
// We bind the literal as a single param and cast it with ::text[] at the call site.
function pgTextArray(values: string[]): string {
  return `{${values.map((v) => `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",")}}`;
}

const postSchema = z.object({
  title:     z.string().min(1).max(300),
  slug:      z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  excerpt:   z.string().max(500).optional().default(""),
  content:   z.string().min(1),
  cover_url: z.string().url().optional().or(z.literal("")),
  tags:      z.array(z.string()).optional().default([]),
  author:    z.string().min(1).max(100).optional().default("Admin"),
  published: z.boolean().optional().default(false),
});

router.post("/admin/posts", writeLimiter, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }); return; }
  const { title, slug, excerpt, content, cover_url, tags, author, published } = parsed.data;
  try {
    const result = await db.execute(sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_url, tags, author, published)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${cover_url ?? null}, ${pgTextArray(tags as string[])}::text[], ${author}, ${published})
      RETURNING id
    `);
    req.log.info({ slug }, "Blog post created");
    res.status(201).json({ id: (result.rows[0] as { id: number }).id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) { res.status(409).json({ error: "A post with this slug already exists." }); return; }
    req.log.error({ err }, "Failed to create blog post");
    res.status(500).json({ error: "Failed to create post." });
  }
});

router.put("/admin/posts/:id", writeLimiter, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID." }); return; }
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }); return; }
  const { title, slug, excerpt, content, cover_url, tags, author, published } = parsed.data;
  try {
    const result = await db.execute(sql`
      UPDATE blog_posts
      SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content},
          cover_url = ${cover_url ?? null}, tags = ${pgTextArray(tags as string[])}::text[], author = ${author},
          published = ${published}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `);
    if (result.rows.length === 0) { res.status(404).json({ error: "Post not found." }); return; }
    req.log.info({ id, slug }, "Blog post updated");
    res.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) { res.status(409).json({ error: "A post with this slug already exists." }); return; }
    req.log.error({ err }, "Failed to update blog post");
    res.status(500).json({ error: "Failed to update post." });
  }
});

router.delete("/admin/posts/:id", writeLimiter, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID." }); return; }
  try {
    await db.execute(sql`DELETE FROM blog_posts WHERE id = ${id}`);
    req.log.info({ id }, "Blog post deleted");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    res.status(500).json({ error: "Failed to delete post." });
  }
});

// ─── Site Settings ────────────────────────────────────────────────────────────

router.get("/admin/settings", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.execute(sql`SELECT key, value, updated_at FROM site_settings ORDER BY key`);
    const settings: Record<string, string> = {};
    for (const row of result.rows as { key: string; value: string }[]) {
      settings[row.key] = row.value;
    }
    res.json({ settings });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch settings");
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

router.put("/admin/settings", writeLimiter, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const schema = z.record(z.string(), z.string());
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid settings data." }); return; }

  try {
    for (const [key, value] of Object.entries(parsed.data)) {
      await db.execute(sql`
        INSERT INTO site_settings (key, value) VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
      `);
    }
    req.log.info({ keys: Object.keys(parsed.data) }, "Site settings updated");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    res.status(500).json({ error: "Failed to save settings." });
  }
});

// ─── Public Blog endpoints ────────────────────────────────────────────────────

router.get("/blog/posts", async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConfigured()) { res.json({ posts: [] }); return; }
  try {
    const result = await db.execute(sql`
      SELECT id, title, slug, excerpt, cover_url, tags, author, created_at, updated_at
      FROM blog_posts WHERE published = true ORDER BY created_at DESC
    `);
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ posts: result.rows });
  } catch (err) {
    logger.error({ err }, "Failed to fetch public blog posts");
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

router.get("/blog/posts/:slug", async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug ?? "").toLowerCase().trim();
  if (!slug) { res.status(400).json({ error: "Invalid slug." }); return; }
  try {
    const result = await db.execute(sql`
      SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true
    `);
    if (result.rows.length === 0) { res.status(404).json({ error: "Post not found." }); return; }
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=600");
    res.json({ post: result.rows[0] });
  } catch (err) {
    logger.error({ err, slug }, "Failed to fetch blog post by slug");
    res.status(500).json({ error: "Failed to fetch post." });
  }
});

// ─── Media upload (images / videos) ───────────────────────────────────────────
// Uses Vercel Blob CLIENT uploads: the browser uploads the file DIRECTLY to Blob
// storage, so we bypass the 4.5 MB serverless request-body limit (large photos
// and videos work). This endpoint only (a) issues a short-lived upload token for
// authenticated admins, and (b) receives Blob's completion webhook.
const UPLOAD_CONTENT_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml",
  "video/mp4", "video/webm", "video/quicktime", "video/ogg",
];

router.post("/admin/upload", async (req: Request, res: Response): Promise<void> => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(503).json({ error: "File storage isn't set up yet. Enable Vercel Blob storage for this project." });
    return;
  }
  // Reconstruct a Web-Request-like object (handleUpload reads request.headers).
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === "string") headers.set(k, v);
    else if (Array.isArray(v)) headers.set(k, v.join(", "));
  }
  const webRequest = { headers, url: req.url, method: req.method } as unknown as Request;

  try {
    const result = await handleUpload({
      body: req.body as HandleUploadBody,
      request: webRequest,
      // Runs only for the browser's token request (not the completion webhook),
      // so this is where we enforce admin auth.
      onBeforeGenerateToken: async () => {
        const auth = getAuth(req);
        if (!auth?.userId || !isAdminUser(auth.userId)) {
          throw new Error("Admin authentication required.");
        }
        return {
          allowedContentTypes: UPLOAD_CONTENT_TYPES,
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        logger.info({ url: blob.url }, "Media uploaded to Blob");
      },
    });
    res.json(result);
  } catch (err) {
    logger.error({ err }, "Blob client upload failed");
    res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed." });
  }
});

// ─── Public site settings (non-sensitive only) ────────────────────────────────

router.get("/site/settings", async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConfigured()) { res.json({ settings: {} }); return; }
  try {
    const result = await db.execute(sql`
      SELECT key, value FROM site_settings
      WHERE key IN ('announcement_enabled', 'announcement_text', 'announcement_type', 'hero_title', 'hero_subtitle')
    `);
    const settings: Record<string, string> = {};
    for (const row of result.rows as { key: string; value: string }[]) {
      settings[row.key] = row.value;
    }
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ settings });
  } catch (err) {
    logger.error({ err }, "Failed to fetch public site settings");
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

export default router;
