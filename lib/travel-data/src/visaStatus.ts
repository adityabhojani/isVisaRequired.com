// The visa-status vocabulary: one record per outcome, used by BOTH renderers.
//
// Until this file existed the same five statuses were declared with colours in
// fifteen places — nine SPA pages, the world map, the server pair-page renderer,
// the server hub layout and the mobile app — and they disagreed. The server
// painted visa_required RED and no_admission GREY; the app painted
// visa_required ORANGE and no_admission RED. A reader who saw a red "Visa
// required" on a search-landing page and clicked through to the checker saw the
// identical fact in orange, with red now meaning "you cannot go". Inside the
// app, visa_on_arrival (amber-700) and visa_required (orange-700) simulated to
// the SAME colour for a deuteranope — "turn up at the border" and "apply at an
// embassy six weeks out" were indistinguishable to about one man in twelve.
//
// Rules this module enforces:
//
//  1. COLOUR IS NEVER ALONE. Icon + word carry the meaning; colour is the third
//     channel. The map adds an SVG pattern because a choropleth has no room for
//     a word. Lightness does fall as effort rises, but adjacent steps are close,
//     so nothing may rely on lightness either.
//  2. EACH COLOUR MEANS ONE THING. eVisa is violet, not blue: blue sat ΔE 21 from
//     the navy used for buttons and links, so an eVisa verdict and the button
//     beneath it read as the same kind of thing. Violet sits ΔE 45 away.
//  3. GREY MEANS "NO DATA" AND NOTHING ELSE. no_admission is deep maroon.
//  4. HEX, NEVER TAILWIND CLASS NAMES. This package reaches the app as a
//     node_modules symlink and Tailwind v4 does not scan node_modules — class
//     strings written here compile in dev and are silently dropped from the
//     production bundle. The app registers utilities for these values in its
//     own index.css instead.
//
// Measured (WCAG 2.1 sRGB contrast; Machado 2009 CVD simulation, ΔE76):
//   ink on tint (badge)       7.25  6.84  9.40  7.87  10.48   all ≥ 4.5
//   white on solid            4.87  5.36  7.10  7.65  10.82   all ≥ 4.5
//   solid on page #F7F9FC     4.61  5.08  6.74  7.26  10.26   all ≥ 3.0
//   worst pair between solids: normal 30.2, deuteranopia 17.3, protanopia 22.2
//   (the palette it replaces: 13.8 / 0.0 / 2.4).

export type VisaRequirement =
  | "visa_free"
  | "visa_on_arrival"
  | "e_visa"
  | "visa_required"
  | "no_admission";

/**
 * What the page SAYS, which is finer than what the data stores. The dataset
 * folds electronic travel authorisations (UK ETA, US ESTA, NZeTA, Canada eTA,
 * Australia ETA) into e_visa, so United States → United Kingdom was headlined
 * "Yes — eVisa". The requirement enum stays five values — changing it would
 * ripple through the API contract, the app and the mobile app — and the
 * distinction is drawn at presentation time by `verdictKind()`.
 */
export type VerdictKind = VisaRequirement | "eta";

/** Display order: least effort first. Also the map legend order. */
export const VISA_STATUS_ORDER: readonly VisaRequirement[] = [
  "visa_free",
  "visa_on_arrival",
  "e_visa",
  "visa_required",
  "no_admission",
] as const;

export interface VisaStatus {
  /** Badge label, sentence case: "Visa on arrival". */
  label: string;
  /** Compact label for chips and dense lists: "On arrival". */
  short: string;
  /** The answer, as the largest text on a pair page. */
  verdictWord: string;
  /** Appended to a pair page <title>: "Yes — eVisa". One vocabulary, SERP included. */
  titleAnswer: string;
  /**
   * One line on what to do. Shown only when it doesn't contradict a known fact
   * (see VerdictCard). Must be TRUE FOR EVERY PAIR of this kind — it is printed
   * on thousands of pages, so no durations, fees or speeds.
   */
  hint: string;
  /** Solid fill: map countries, legend swatches. Takes white text. */
  solid: string;
  /** Text colour on `tint`: the badge and verdict word. */
  ink: string;
  /** Pale surface behind `ink`. */
  tint: string;
  /** Hairline for a tinted surface. */
  line: string;
  /**
   * Inner SVG markup for a 24×24 viewBox, stroke-based. From lucide-icons
   * (ISC licence, © Lucide Contributors). Rendered by both sides through
   * `statusIconSvg()` so the geometry is identical by construction.
   */
  icon: string;
  /** id of the SVG <pattern> the map uses so status survives colour-blindness. */
  patternId: string;
}

const ICON = {
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  badgeCheck: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  octagonX: '<path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
};

const VIOLET = { solid: "#6D28D9", ink: "#4C1D95", tint: "#F1EBFC", line: "#D9C8F5" };

export const VISA_STATUS: Record<VisaRequirement, VisaStatus> = {
  visa_free: {
    label: "Visa-free",
    short: "Visa-free",
    verdictWord: "No visa needed",
    titleAnswer: "No — Visa-Free",
    hint: "Your permitted stay is set at the border — check your entry stamp",
    solid: "#11824A", ink: "#0A5C34", tint: "#E7F6EE", line: "#B9E3CC",
    icon: ICON.check,
    patternId: "status-solid",
  },
  visa_on_arrival: {
    label: "Visa on arrival",
    short: "On arrival",
    verdictWord: "Visa on arrival",
    titleAnswer: "Visa on Arrival",
    hint: "Issued at the border when you land — nothing to apply for in advance",
    solid: "#0E7490", ink: "#0B5A70", tint: "#E2F4F9", line: "#AEDDE9",
    icon: ICON.clock,
    patternId: "status-dots",
  },
  e_visa: {
    label: "eVisa",
    short: "eVisa",
    verdictWord: "eVisa needed",
    titleAnswer: "Yes — eVisa",
    hint: "Apply online and get approval before you fly",
    ...VIOLET,
    icon: ICON.shield,
    patternId: "status-hatch",
  },
  visa_required: {
    label: "Visa required",
    short: "Visa needed",
    verdictWord: "Visa required",
    titleAnswer: "Yes — Visa Required",
    hint: "Arrange it before you travel — usually through an embassy or consulate",
    solid: "#8C3B07", ink: "#7A3406", tint: "#FAEDE2", line: "#EDCBAC",
    icon: ICON.alert,
    patternId: "status-crosshatch",
  },
  no_admission: {
    label: "Entry not permitted",
    short: "No entry",
    verdictWord: "Entry not permitted",
    titleAnswer: "Entry Not Permitted",
    hint: "Check with your own foreign ministry before making any plans",
    solid: "#7A1225", ink: "#6B0F20", tint: "#FBE9EC", line: "#EFC3CB",
    icon: ICON.octagonX,
    patternId: "status-dense",
  },
};

/**
 * Electronic travel authorisation — a presentation of e_visa (or of visa_free
 * with an ESTA requirement). Shares e_visa's colours because the map and every
 * count still bucket it as e_visa; the word and icon tell them apart.
 *
 * The hint is deliberately careful: it does NOT say "not a visa". Australia's
 * ETA is legally a visa (subclass 601) and Sri Lanka's ETA is its visit-visa
 * route. "An online approval you must hold before you board" is true of every
 * case this label covers, and airlines refuse boarding without it.
 */
export const ETA_STATUS: VisaStatus = {
  label: "Travel authorisation",
  short: "ETA",
  verdictWord: "Travel authorisation needed",
  titleAnswer: "Travel Authorisation Needed",
  hint: "An online approval you must hold before you board",
  ...VIOLET,
  icon: ICON.badgeCheck,
  patternId: "status-hatch",
};

// Present-tense authorisation mentions in the data: loader "Electronic Travel
// Authorization required", overrides "ETA required", "NZeTA required",
// "Electronic Travel Authority", and "90 days via ESTA" (which the data stores
// in maxStay, not notes). Case-sensitive on the acronyms on purpose. ETIAS is
// absent: it has not launched, and a future requirement must never headline.
const AUTH_MENTION = /\b(?:ETA|eTA|NZeTA|ESTA)\b|Electronic Travel Autho/;

/** Which verdict to SHOW for a stored entry. */
export function verdictKind(
  requirement: VisaRequirement,
  notes?: string | null,
  maxStay?: string | null,
): VerdictKind {
  if ((requirement === "e_visa" || requirement === "visa_free") &&
      AUTH_MENTION.test(`${notes ?? ""} ${maxStay ?? ""}`)) {
    return "eta";
  }
  return requirement;
}

/** The presentation record for a verdict kind. */
export function verdictStatus(kind: VerdictKind): VisaStatus {
  return kind === "eta" ? ETA_STATUS : VISA_STATUS[kind];
}

/** Grey + hatch, reserved for "no rule in the dataset". Never a status. */
export const NO_DATA_FILL = "#94A3B8";

/** Defensive lookup: unknown keys return null. */
export function visaStatus(req: string | null | undefined): VisaStatus | null {
  return req && req in VISA_STATUS ? VISA_STATUS[req as VisaRequirement] : null;
}

/** The status icon as an inline SVG string, identical on both sides. */
export function statusIconSvg(kind: VerdictKind, size = 20, extraAttrs = ""): string {
  const s = verdictStatus(kind);
  return (
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extraAttrs ? " " + extraAttrs : ""}>` +
    `${s.icon}</svg>`
  );
}

/** CSS custom properties for every status, as a `:root{}` fragment. */
export function statusCssVars(): string {
  return VISA_STATUS_ORDER.map((k) => {
    const s = VISA_STATUS[k];
    const n = k.replace(/_/g, "-");
    return `--status-${n}-solid:${s.solid};--status-${n}-ink:${s.ink};--status-${n}-tint:${s.tint};--status-${n}-line:${s.line};`;
  }).join("") + `--status-no-data:${NO_DATA_FILL};`;
}

// ── known vs unknown facts ───────────────────────────────────────────────────
// The per-pair "facts" (stay, fee, processing) are mostly per-visa-type
// templates, and many are "Varies — check…" placeholders. Both renderers apply
// the same rule: a genuine value is shown as a fact; a placeholder is never
// shown at fact weight, only named in one quiet sentence. It lives here so the
// pair pages and the app's result panel can't disagree about what is known.

/** True for a real value; false for empty or a "Varies…" placeholder. */
export function isKnownFact(v: string | null | undefined): v is string {
  return !!v && !/^\s*varies/i.test(v);
}

/**
 * One honest sentence naming what the data doesn't hold, or "" if nothing is
 * missing. `fields` in reading order, e.g. ["permitted stay", "fee"].
 */
export function unknownFactsSentence(fields: string[], kind: VerdictKind): string {
  if (!fields.length) return "";
  const list = fields.length === 1 ? fields[0] : `${fields.slice(0, -1).join(", ")} or ${fields[fields.length - 1]}`;
  const verb = kind === "visa_free" || kind === "visa_on_arrival" ? "travel" : "apply";
  return `Our data doesn't record the ${list} for this route — check the official page before you ${verb}.`;
}

/** Which verdicts involve an application, so processing time is worth naming. */
export function needsApplication(kind: VerdictKind): boolean {
  return kind === "e_visa" || kind === "eta" || kind === "visa_required";
}
