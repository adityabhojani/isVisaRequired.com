// Fallback for paths that no server-rendered route matched.
//
// Previously vercel.json's final rewrite served the static SPA shell with HTTP
// 200 for ANY unmatched path. That made every typo, truncated link and
// machine-generated URL a crawlable 200 whose HTML declared `index,follow` and
// canonicalised to the homepage — an unbounded soft-404 surface on a site with
// 37,830 real pages competing for crawl budget.
//
// Now the catch-all routes here instead:
//   - a known client-side route  -> 200, shell (React renders it)
//   - anything else              -> 404, shell + noindex
// Either way the user still gets the working app; only the status code and the
// robots directive differ, which is exactly what crawlers need to tell apart.
import type { Request, Response, NextFunction } from "express";
import { loadShell, SITE } from "./appShell";

// Client-side routes with no server-rendered handler (see visa-checker App.tsx).
// Routes that ARE server-rendered never reach this middleware.
const EXACT = new Set([
  "/app", "/contact", "/my-travels", "/widget", "/passports", "/admin",
  "/sign-in", "/sign-up",
]);
const PREFIX = ["/admin/", "/sign-in/", "/sign-up/", "/destination/", "/passport/"];

// Routes that work but should never be indexed: account, auth and embed surfaces.
const PRIVATE = ["/my-travels", "/admin", "/sign-in", "/sign-up", "/widget"];

export function isKnownClientRoute(p: string): boolean {
  if (EXACT.has(p)) return true;
  return PREFIX.some((pre) => p.startsWith(pre) && p.length > pre.length);
}

function isPrivate(p: string): boolean {
  return PRIVATE.some((pre) => p === pre || p.startsWith(`${pre}/`));
}

function withRobots(html: string, directive: string): string {
  if (/<meta\s+name="robots"[^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="${directive}" />`);
  }
  return html.replace("</head>", `<meta name="robots" content="${directive}" /></head>`);
}

const NOT_FOUND_BODY = `<section style="max-width:860px;margin:0 auto;padding:24px 20px;font-family:Inter,system-ui,sans-serif">
  <h1>Page not found</h1>
  <p>That page doesn't exist. It may have moved, or the link may be incomplete.</p>
  <p><a href="/">Check a visa requirement</a> · <a href="/visa-requirements">Browse by passport</a> ·
     <a href="/countries">Browse by destination</a> · <a href="/guides">Guides</a></p>
</section>`;

export function shellFallback(req: Request, res: Response, next: NextFunction): void {
  if (req.method !== "GET" && req.method !== "HEAD") { next(); return; }
  if (req.path.startsWith("/api/")) { next(); return; }
  // Only serve HTML to clients that asked for it; anything else gets the JSON 404.
  if (!req.accepts("html")) { next(); return; }

  const shell = loadShell();
  if (!shell) { next(); return; }

  if (isKnownClientRoute(req.path)) {
    const html = isPrivate(req.path) ? withRobots(shell, "noindex, nofollow") : shell;
    res.status(200).setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
    res.type("html").send(html);
    return;
  }

  const html = withRobots(shell, "noindex, follow")
    .replace(/<title>[\s\S]*?<\/title>/i, "<title>Page not found | Is Visa Required?</title>")
    .replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${SITE}${req.path}" />`)
    .replace(/<div id="root">\s*<\/div>/i, `<div id="root">${NOT_FOUND_BODY}</div>`);
  res.status(404).setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
  res.type("html").send(html);
}
