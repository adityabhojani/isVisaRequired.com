// Signed, no-login unsubscribe tokens for visa-alert emails.
import crypto from "crypto";

function secret(): string {
  // Prefer an explicit secret. Otherwise derive one from DATABASE_URL (which
  // contains the DB password and is always set when alerts exist — alerts live
  // in the DB). The old hardcoded fallback lived in a public repo, so anyone
  // could forge unsubscribe tokens for sequential alert ids.
  const explicit = process.env.CRON_SECRET || process.env.ALERT_SECRET;
  if (explicit) return explicit;
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) return crypto.createHash("sha256").update(`ivr-alert:${dbUrl}`).digest("hex");
  return "isvisarequired-alert-fallback"; // dev-only: no DB → no alerts → tokens are moot
}

export function alertUnsubToken(id: number): string {
  return crypto.createHmac("sha256", secret()).update(`unsub:${id}`).digest("hex").slice(0, 32);
}

export function verifyUnsubToken(id: number, token: string): boolean {
  const expected = alertUnsubToken(id);
  // constant-time compare
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function alertUnsubUrl(id: number, origin: string): string {
  return `${origin}/api/alerts/unsubscribe?id=${id}&token=${alertUnsubToken(id)}`;
}

// ── confirmation (double-opt-in) tokens ──────────────────────────────────────
// Distinct message prefix so confirm and unsubscribe tokens are never
// interchangeable.
export function alertConfirmToken(id: number): string {
  return crypto.createHmac("sha256", secret()).update(`confirm:${id}`).digest("hex").slice(0, 32);
}

export function verifyConfirmToken(id: number, token: string): boolean {
  const expected = alertConfirmToken(id);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function alertConfirmUrl(id: number, origin: string): string {
  return `${origin}/api/alerts/confirm?id=${id}&token=${alertConfirmToken(id)}`;
}
