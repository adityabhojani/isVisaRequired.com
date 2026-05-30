// Serverless entry point (e.g. Vercel functions).
//
// Unlike `index.ts`, this does NOT call `app.listen()` — the platform owns the
// HTTP server and invokes the Express app as a request handler. In production
// pino logs synchronously to stdout (no worker threads), which is required for
// short-lived serverless invocations.
import app from "./app";

export default app;
