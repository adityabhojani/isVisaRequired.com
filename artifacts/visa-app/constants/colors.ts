// Colours for the phone app.
//
// The visa-status colours are not chosen here. They come from lib/travel-data,
// the one record the website's server pages and its React app both draw from,
// so "visa on arrival" is the same teal on a phone as on the site. Until
// 2026-09-22 this file kept its own copy, and the site's redesign left the app
// amber where the site had gone teal — one status, two colours, depending on
// the device in hand. The deploy guard now scans this app too.
//
// Light mode uses each status's `ink` — the text colour the site's badges use,
// which is what the app's badge draws with. Dark mode lifts the status hue
// towards white until it reads on the dark card: every result is at least
// 5.7:1 on #111827 (the site's colours are meant for light surfaces and fall to
// 1.6–3.9:1 there). The hue is kept, so a reader who learned the light palette
// isn't relearning it.
import { VISA_STATUS } from "@workspace/travel-data";

/** Same hue and saturation as `hex`, lightness set to `l` percent. */
function withLightness(hex: string, l: number): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0;
  const lum = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = lum > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  s = Math.min(s, 0.7);
  const L = l / 100;
  const a = s * Math.min(L, 1 - L);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return L - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return "#" + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}

const S = VISA_STATUS;

const colors = {
  light: {
    text: "#0F1929",
    tint: "#0A2FA1",

    background: "#F7F9FC",
    foreground: "#0F1929",

    card: "#FFFFFF",
    cardForeground: "#0F1929",

    primary: "#0A2FA1",
    primaryForeground: "#FFFFFF",

    secondary: "#E8EEF5",
    secondaryForeground: "#0F1929",

    muted: "#EEF2F7",
    mutedForeground: "#6B7A8F",

    accent: "#0DB5E8",
    accentForeground: "#FFFFFF",

    destructive: "#F03E3E",
    destructiveForeground: "#FFFFFF",

    border: "#DDE5EF",
    input: "#DDE5EF",

    visaFree: S.visa_free.ink,
    visaOnArrival: S.visa_on_arrival.ink,
    eVisa: S.e_visa.ink,
    visaRequired: S.visa_required.ink,
    noAdmission: S.no_admission.ink,
  },

  dark: {
    text: "#F0F4F8",
    tint: "#0DB5E8",

    background: "#0A0F1E",
    foreground: "#F0F4F8",

    card: "#111827",
    cardForeground: "#F0F4F8",

    primary: "#3B5FD4",
    primaryForeground: "#FFFFFF",

    secondary: "#1E2A3B",
    secondaryForeground: "#F0F4F8",

    muted: "#1A2235",
    mutedForeground: "#8094AD",

    accent: "#0DB5E8",
    accentForeground: "#FFFFFF",

    destructive: "#F03E3E",
    destructiveForeground: "#FFFFFF",

    border: "#1E2D42",
    input: "#1E2D42",

    visaFree: withLightness(S.visa_free.solid, 70),
    visaOnArrival: withLightness(S.visa_on_arrival.solid, 70),
    eVisa: withLightness(S.e_visa.solid, 70),
    visaRequired: withLightness(S.visa_required.solid, 70),
    noAdmission: withLightness(S.no_admission.solid, 70),
  },

  radius: 12,
};

export default colors;
