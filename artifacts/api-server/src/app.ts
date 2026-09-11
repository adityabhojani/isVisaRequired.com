import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import router from "./routes";
import seoRouter from "./routes/seo";
import { shellFallback } from "./seo/shellFallback";
import { logger } from "./lib/logger";
import { apiLimiter } from "./middleware/rateLimiter";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";

const app: Express = express();

// Clerk (authentication) is optional. The core visa checker runs without it;
// login-based features (My Travels, admin) need a secret key AND a publishable
// key from the same instance. Mounting with only the secret made every /api
// request — public ones included — fail with "Publishable key is missing".
//
// The configured key is used verbatim. The Replit template's
// publishableKeyFromHost() passed pk_test keys through but IGNORED pk_live ones,
// deriving a key for clerk.<request host> instead — clerk.www.isvisarequired.com,
// which doesn't exist — so moving to a production instance would have broken
// sign-in.
const clerkPublishableKey =
  process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkEnabled = Boolean(process.env.CLERK_SECRET_KEY && clerkPublishableKey);
if (!clerkEnabled) {
  logger.warn(
    process.env.CLERK_SECRET_KEY
      ? "CLERK_SECRET_KEY is set but no publishable key is — authentication is disabled. Set CLERK_PUBLISHABLE_KEY."
      : "CLERK_SECRET_KEY not set — authentication is disabled. Login-based features (My Travels, admin) are inactive.",
  );
}

// Trust the reverse proxy (Replit/nginx) so rate-limiter can read X-Forwarded-For correctly
app.set("trust proxy", 1);

// Security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
);

// Gzip/brotli compression
app.use(compression());

// Structured request logging
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// CORS — allow credentials for Clerk session cookies, but only for our own
// origins (reflecting every origin with credentials lets any website make
// credentialed requests to the API). Same-origin requests send no Origin
// header and are unaffected.
const CORS_ALLOWED = new Set([
  "https://www.isvisarequired.com",
  "https://isvisarequired.com",
]);
app.use(
  cors({
    credentials: true,
    origin: (origin, cb) => {
      if (
        !origin ||
        CORS_ALLOWED.has(origin) ||
        origin.endsWith(".vercel.app") || // preview deployments
        origin.startsWith("http://localhost") // local dev
      ) {
        cb(null, true);
        return;
      }
      cb(null, false);
    },
  }),
);

// Body parsing with sane size limits
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Clerk auth middleware — resolves the session from the cookie. Runs on /api and
// the signed-in pages, never on the public pages crawlers index. Mounted
// globally, a development instance answered any cookie-less "Accept: text/html"
// request with a 307 to its own domain for a handshake — exactly what Googlebot
// and Bingbot send — so crawlers were bounced through clerk.accounts.dev
// instead of getting the page.
//
// The signed-in pages keep it because that same handshake refreshes an expired
// session cookie on a hard page load, before the page makes its first API call;
// without it My Travels loads empty and /admin says access denied. Those pages
// are noindex (seo/shellFallback.ts), so crawlers never meet it there.
const CLERK_PATHS = ["/api", "/my-travels", "/admin"];
if (clerkEnabled) {
  const productionInstance = Boolean(clerkPublishableKey?.startsWith("pk_live_"));
  app.use(
    CLERK_PATHS,
    clerkMiddleware({
      publishableKey: clerkPublishableKey,
      // A production session token records the origin that requested it (azp);
      // reject tokens minted anywhere else. Development keys stay on previews
      // and localhost, whose origins these wouldn't match, so only enforce it
      // for a production instance.
      authorizedParties: productionInstance
        ? ["https://www.isvisarequired.com", "https://isvisarequired.com"]
        : undefined,
    }),
  );
}

// Rate limiting on all /api routes
app.use("/api", apiLimiter);

// Programmatic-SEO pages + sitemaps (server-rendered HTML/XML at the root path,
// routed here from vercel.json). Mounted before the API router; paths don't collide.
app.use(seoRouter);

// Routes
app.use("/api", router);

// HTML fallback: known client route -> 200 shell, anything else -> 404 + noindex.
// Must sit after the API router so /api/* still gets the JSON 404 below.
app.use(shellFallback);

// 404 for unknown routes
app.use(notFoundHandler);

// Global error handler (must be last, 4-arg signature)
app.use(globalErrorHandler);

export default app;
