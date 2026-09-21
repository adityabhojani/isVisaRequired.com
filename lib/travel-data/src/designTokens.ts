// Design tokens shared by the server-rendered pages and the React app.
//
// Three `:root{}` blocks used to compete for the same variable names —
// index.css in the app, BASE_STYLE in seo/shell.ts, and a third copy inside
// seo/render.ts and seo/hubLayout.ts that hard-coded a sky-blue --accent the
// app's own token set does not contain. This string is the only source now.
//
// How each side consumes it:
//   server  — appended to BASE_STYLE in seo/shell.ts, so it is present on every
//             SSR page. Renderers reference var(--…) and hold NO literal colours.
//   app     — `pnpm run tokens` writes APP_TOKENS_CSS (a subset that never
//             redefines a shadcn variable) to artifacts/visa-checker/src/
//             tokens.generated.css, which index.css @imports and registers as
//             Tailwind utilities. The deploy build re-runs the generator in
//             --check mode and fails if the checked-in file is stale.
//
// Names that already existed in shell.ts (--navy, --bg, --ink, --muted, --line,
// --sh-*) are kept verbatim: dozens of SSR selectors reference them and there is
// no reason to break that. New names are additive.
import { statusCssVars } from "./visaStatus";

/** Brand and neutrals. HSL kept where the app already used HSL so nothing shifts. */
export const BRAND = {
  navy: "hsl(222 89% 30%)",
  navyPress: "hsl(222 89% 25%)",
  heroField: "hsl(222 89% 27%)",
  heroDeep: "hsl(222 47% 15%)",
  bg: "hsl(210 40% 98%)",
  surface: "#FFFFFF",
  ink: "hsl(222 47% 11%)",
  /** 4.51:1 on --bg — the floor. Do not lighten it. */
  inkMuted: "hsl(215 16% 47%)",
  /** Raised from 91% → 86% lightness: the old hairline measured 1.19:1 and was invisible. */
  line: "hsl(214 32% 86%)",
  secondary: "hsl(210 40% 94%)",
} as const;

/**
 * Type scale. Two enforceable rules ride on it:
 *   1. No fact is ever set below --type-meta (14px). Verdicts, stays, fees,
 *      dates and status words never go smaller.
 *   2. --type-label (12px) is for eyebrows and credits only — never a fact.
 * Playfair Display is permitted in exactly two places: the wordmark, and
 * --type-display on a navy field. It never sets a verdict.
 */
export const TYPE = {
  display: "clamp(2rem, 1.4rem + 2.6vw, 3rem)",
  verdict: "clamp(1.75rem, 1.2rem + 2.4vw, 2.5rem)",
  h1: "clamp(1.5rem, 1.2rem + 1.4vw, 2rem)",
  h2: "1.25rem",
  h3: "1.0625rem",
  lead: "1.125rem",
  body: "1rem",
  meta: "0.875rem",
  label: "0.75rem",
} as const;

/** Four radii, no others. */
export const RADIUS = { chip: "8px", card: "12px", hero: "20px", pill: "999px" } as const;

/**
 * The elevation scale is the navy-tinted one the app already had (rgb 15 23 41
 * is --ink's hue). The rule on top: --sh-xl on at most ONE element per page.
 */
export const SHADOW = {
  xs: "0 1px 3px 0 rgb(15 23 41/.06)",
  sm: "0 2px 4px -1px rgb(15 23 41/.06),0 1px 2px -1px rgb(15 23 41/.05)",
  md: "0 8px 16px -4px rgb(15 23 41/.08),0 2px 6px -2px rgb(15 23 41/.05)",
  xl: "0 28px 48px -12px rgb(15 23 41/.16),0 10px 18px -8px rgb(15 23 41/.08)",
} as const;

/** One list of font faces, so the SSR <link> and the app can never load different weights. */
export const FONT_FAMILIES = "Inter:wght@400;500;600;700&family=Playfair+Display:wght@600";
export const FONT_HREF = `https://fonts.googleapis.com/css2?family=${FONT_FAMILIES}&display=swap`;

/**
 * The complete `:root{…}` block, for the SERVER-rendered pages, which have no
 * other stylesheet. Uses the short names (--muted, --line, --navy…) that the
 * SSR selectors already reference.
 */
export const TOKENS_CSS: string =
  `:root{` +
  `--navy:${BRAND.navy};--navy-2:${BRAND.navyPress};--field:${BRAND.heroField};--field-deep:${BRAND.heroDeep};` +
  `--bg:${BRAND.bg};--surface:${BRAND.surface};--ink:${BRAND.ink};--muted:${BRAND.inkMuted};--line:${BRAND.line};--secondary:${BRAND.secondary};` +
  `--type-display:${TYPE.display};--type-verdict:${TYPE.verdict};--type-h1:${TYPE.h1};--type-h2:${TYPE.h2};--type-h3:${TYPE.h3};` +
  `--type-lead:${TYPE.lead};--type-body:${TYPE.body};--type-meta:${TYPE.meta};--type-label:${TYPE.label};` +
  `--r-chip:${RADIUS.chip};--r-card:${RADIUS.card};--r-hero:${RADIUS.hero};--r-pill:${RADIUS.pill};` +
  `--sh-xs:${SHADOW.xs};--sh-sm:${SHADOW.sm};--sh-md:${SHADOW.md};--sh-xl:${SHADOW.xl};` +
  statusCssVars() +
  `}`;

/**
 * The subset the React app imports. It must NOT redefine anything the app's
 * component library (shadcn) already owns: there, --muted and --secondary are
 * bare HSL triples read as hsl(var(--muted)), while TOKENS_CSS sets them to
 * full colours. Both landing in one bundle "works" only while the app's own
 * :root happens to come later in the file — move an @import and every muted
 * surface in the app would compute to an invalid colour. So the app gets only
 * names that exist nowhere else: status colours, the type scale and radii.
 */
export const APP_TOKENS_CSS: string =
  `:root{` +
  `--type-display:${TYPE.display};--type-verdict:${TYPE.verdict};--type-h1:${TYPE.h1};--type-h2:${TYPE.h2};--type-h3:${TYPE.h3};` +
  `--type-lead:${TYPE.lead};--type-body:${TYPE.body};--type-meta:${TYPE.meta};--type-label:${TYPE.label};` +
  `--r-chip:${RADIUS.chip};--r-card:${RADIUS.card};--r-hero:${RADIUS.hero};--r-pill:${RADIUS.pill};` +
  statusCssVars() +
  `}`;
