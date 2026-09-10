// The single definition of the passport power tiers.
//
// There used to be three copies of these thresholds — the interactive tier list
// in the web client, the server-rendered /tier-list that Google actually
// indexes, and the mobile app — and they had already drifted apart: the same
// United States passport read "A" on one surface and "B" on another.
//
// Bands are calibrated against the real score range. A passport is scored
// against every OTHER country, so 194 is the arithmetic ceiling, but the actual
// spread across the 195 passports is 71–180. The old bands (S at 185+, E below
// 60) could therefore never match anything, and the tier list rendered two
// permanently empty tiers.
export const MAX_ACCESSIBLE = 194;

export interface PassportTier {
  label: string;
  /** Lowest mobility score in this band. */
  min: number;
  title: string;
  note: string;
}

export const PASSPORT_TIERS: PassportTier[] = [
  { label: "S", min: 178, title: "World Elite", note: "Near-universal access" },
  { label: "A", min: 165, title: "Highly Powerful", note: "Excellent global mobility" },
  { label: "B", min: 130, title: "Strong", note: "Strong global access" },
  { label: "C", min: 105, title: "Average", note: "Moderate travel freedom" },
  { label: "D", min: 85, title: "Below Average", note: "Limited access" },
  { label: "E", min: 0, title: "Restricted", note: "Significant travel restrictions" },
];

/** Highest score this band accepts — one below the band above it. */
export function tierUpperBound(index: number): number {
  return index === 0 ? MAX_ACCESSIBLE : PASSPORT_TIERS[index - 1].min - 1;
}

export function tierFor(mobilityScore: number): PassportTier {
  return (
    PASSPORT_TIERS.find((t) => mobilityScore >= t.min) ??
    PASSPORT_TIERS[PASSPORT_TIERS.length - 1]
  );
}
