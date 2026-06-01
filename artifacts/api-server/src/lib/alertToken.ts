// Signed, no-login unsubscribe tokens for visa-alert emails.
import crypto from "crypto";

function secret(): string {
  return process.env.CRON_SECRET || process.env.ALERT_SECRET || "isvisarequired-alert-fallback";
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
