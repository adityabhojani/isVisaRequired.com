// The app's view of the visa-status vocabulary. Every page and component that
// shows a status imports from HERE — never declares its own colour map.
//
// The words and colours come from lib/travel-data/src/visaStatus.ts, which the
// server-rendered pages read too; this file only adds the two things that must
// live inside the app:
//
//  - Tailwind class strings. The shared package can't hold these: it reaches
//    the app through node_modules, which Tailwind v4 does not scan, so classes
//    written there would be silently missing from the production CSS. The
//    `status-*` utilities are registered in src/index.css from the generated
//    tokens, and written out literally below so the scanner emits them.
//  - Lucide icon components, matching the icon paths the server inlines.
//
// Every consumer shows icon + word + colour, so meaning never rests on hue.
import {
  CheckCircle2, Clock, Shield, BadgeCheck, AlertCircle, OctagonX, type LucideIcon,
} from "lucide-react";
import type { VisaRequirement } from "@workspace/api-client-react";
import {
  VISA_STATUS, VISA_STATUS_ORDER, ETA_STATUS, NO_DATA_FILL,
  verdictKind, type VerdictKind, type VisaStatus,
} from "@workspace/travel-data";

export { verdictKind, NO_DATA_FILL };
export type { VerdictKind };

export const requirementOrder: VisaRequirement[] = [...VISA_STATUS_ORDER];

export interface RequirementStyle {
  /** "Visa on arrival" */
  label: string;
  /** "On arrival" — chips and dense lists */
  short: string;
  /** The answer as a headline: "No visa needed", "eVisa needed" */
  verdictWord: string;
  /** One line on what to do — true for every pair of this kind */
  hint: string;
  /** Tailwind: text in the status ink */
  color: string;
  /** Tailwind: status tint surface */
  bg: string;
  /** Tailwind: status hairline border */
  border: string;
  /** Tailwind: a `before:` rail in the solid colour */
  rail: string;
  /** Tailwind: a solid swatch or dot */
  dot: string;
  /** Hex, for SVG fills, inline styles and charts */
  solid: string;
  ink: string;
  tint: string;
  line: string;
  icon: LucideIcon;
}

type StatusClasses = Pick<RequirementStyle, "color" | "bg" | "border" | "rail" | "dot">;

// Literal class strings, one line per status, so the Tailwind scanner sees them.
const CLASSES: Record<VisaRequirement, StatusClasses> = {
  visa_free:       { color: "text-status-visa-free-ink",       bg: "bg-status-visa-free-tint",       border: "border-status-visa-free-line",       rail: "before:bg-status-visa-free-solid",       dot: "bg-status-visa-free-solid" },
  visa_on_arrival: { color: "text-status-visa-on-arrival-ink", bg: "bg-status-visa-on-arrival-tint", border: "border-status-visa-on-arrival-line", rail: "before:bg-status-visa-on-arrival-solid", dot: "bg-status-visa-on-arrival-solid" },
  e_visa:          { color: "text-status-e-visa-ink",          bg: "bg-status-e-visa-tint",          border: "border-status-e-visa-line",          rail: "before:bg-status-e-visa-solid",          dot: "bg-status-e-visa-solid" },
  visa_required:   { color: "text-status-visa-required-ink",   bg: "bg-status-visa-required-tint",   border: "border-status-visa-required-line",   rail: "before:bg-status-visa-required-solid",   dot: "bg-status-visa-required-solid" },
  no_admission:    { color: "text-status-no-admission-ink",    bg: "bg-status-no-admission-tint",    border: "border-status-no-admission-line",    rail: "before:bg-status-no-admission-solid",    dot: "bg-status-no-admission-solid" },
};

const ICONS: Record<VisaRequirement, LucideIcon> = {
  visa_free: CheckCircle2,
  visa_on_arrival: Clock,
  e_visa: Shield,
  visa_required: AlertCircle,
  no_admission: OctagonX,
};

const build = (s: VisaStatus, classes: StatusClasses, icon: LucideIcon): RequirementStyle => ({
  label: s.label, short: s.short, verdictWord: s.verdictWord, hint: s.hint,
  solid: s.solid, ink: s.ink, tint: s.tint, line: s.line,
  ...classes,
  icon,
});

export const reqConfig: Record<VisaRequirement, RequirementStyle> = {
  visa_free:       build(VISA_STATUS.visa_free,       CLASSES.visa_free,       ICONS.visa_free),
  visa_on_arrival: build(VISA_STATUS.visa_on_arrival, CLASSES.visa_on_arrival, ICONS.visa_on_arrival),
  e_visa:          build(VISA_STATUS.e_visa,          CLASSES.e_visa,          ICONS.e_visa),
  visa_required:   build(VISA_STATUS.visa_required,   CLASSES.visa_required,   ICONS.visa_required),
  no_admission:    build(VISA_STATUS.no_admission,    CLASSES.no_admission,    ICONS.no_admission),
};

/**
 * Electronic travel authorisation (UK ETA, US ESTA, NZeTA, Canada eTA,
 * Australia ETA). Stored in the data as e_visa; shown with its own word and
 * icon so "minutes online" isn't headlined as "eVisa". Same colours as eVisa,
 * because maps and counts still bucket it there.
 */
export const etaConfig: RequirementStyle = build(ETA_STATUS, CLASSES.e_visa, BadgeCheck);

/** The style to SHOW for a result, given its stored requirement and notes. */
export function styleForResult(
  requirement: VisaRequirement,
  notes?: string | null,
  maxStay?: string | null,
): RequirementStyle {
  return verdictKind(requirement, notes, maxStay) === "eta" ? etaConfig : reqConfig[requirement];
}
