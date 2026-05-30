import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { apiLimiter } from "./middleware/rateLimiter";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";

const app: Express = express();

// Clerk (authentication) is optional. The core visa checker runs without it;
// login-based features (My Travels, admin) require CLERK_SECRET_KEY to be set.
const clerkEnabled = Boolean(process.env.CLERK_SECRET_KEY);
if (!clerkEnabled) {
  logger.warn(
    "CLERK_SECRET_KEY not set — authentication is disabled. Login-based features (My Travels, admin) are inactive.",
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

// Clerk proxy — must be before body parsers (streams raw bytes)
if (clerkEnabled) {
  app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
}

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

// CORS — allow credentials for Clerk session cookies
app.use(cors({ credentials: true, origin: true }));

// Body parsing with sane size limits
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Clerk auth middleware — resolves session from cookie
if (clerkEnabled) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
}

// Rate limiting on all /api routes
app.use("/api", apiLimiter);

// Routes
app.use("/api", router);

// 404 for unknown routes
app.use(notFoundHandler);

// Global error handler (must be last, 4-arg signature)
app.use(globalErrorHandler);

export default app;
