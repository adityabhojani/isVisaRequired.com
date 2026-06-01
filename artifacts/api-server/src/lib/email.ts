// Minimal Resend email sender (via REST — no extra dependency).
// Configure with RESEND_API_KEY; optionally ALERT_FROM_EMAIL (must be a verified
// Resend sender/domain). Falls back to Resend's shared onboarding sender, which
// only delivers to the account owner — fine for testing, verify a domain for prod.
import { logger } from "./logger";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("sendEmail called but RESEND_API_KEY is not set");
    return false;
  }
  const from = process.env.ALERT_FROM_EMAIL || "isvisarequired.com <onboarding@resend.dev>";
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, html: opts.html }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      logger.error({ status: res.status, detail }, "Resend send failed");
      return false;
    }
    return true;
  } catch (err) {
    logger.error({ err }, "Resend request error");
    return false;
  }
}
