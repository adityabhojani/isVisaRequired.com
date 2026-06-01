// Manual, source-verified corrections layered on top of the base Passport Index
// dataset (passport-index.csv).
//
// WHY THIS FILE EXISTS
// The base CSV is a pristine mirror of the open-source ilyankou/passport-index
// dataset, which is now archived at its January 2025 snapshot. Real visa rules
// keep changing, so we keep verified corrections here. The base CSV can be
// re-pulled at any time (scripts/refresh-visa-data.mjs) WITHOUT losing these
// corrections — overrides are applied on top of the CSV at load time and always
// win. When the upstream snapshot eventually catches up to one of these, simply
// delete that override.
//
// HOW TO EDIT (safe for non-developers)
// Add one line per correction. `value` uses the SAME words as the dataset:
//   "visa free" | "visa on arrival" | "e-visa" | "eta" | "visa required" |
//   "no admission" | a number (= number of visa-free days, e.g. "30").
// It is parsed by the same parseValue() in passportIndexLoader.ts, so the result
// matches the base data exactly. `passport`/`destination` are ISO 3166-1 alpha-2
// country codes (e.g. GB = United Kingdom, CN = China). Always fill in `source`
// and `verifiedOn` so the next person knows where the fact came from.

export interface VisaOverride {
  /** ISO 3166-1 alpha-2 code of the passport (traveller's nationality). */
  passport: string;
  /** ISO 3166-1 alpha-2 code of the destination country. */
  destination: string;
  /** Same vocabulary as the CSV. See file header. */
  value: string;
  /** Where this was verified (official site / reputable tracker). */
  source: string;
  /** YYYY-MM-DD this was last verified against the source. */
  verifiedOn: string;
  /** Optional human note (not shown to users). */
  note?: string;
}

// --- UK Electronic Travel Authorisation (ETA) ---------------------------------
// European visitors (EU/EEA + Switzerland + the European microstates) now need a
// UK ETA. Rolled out through 2025; enforced (boarding denied without it) from
// 25 Feb 2026. The base dataset (Jan 2025 snapshot) still shows these as
// visa-free. Ireland is excluded (Common Travel Area) and stays visa-free.
const UK_ETA_EUROPE = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI",
  "ES", "SE", "IS", "LI", "NO", "CH", "AD", "MC", "SM",
];

// --- China unilateral 30-day visa-free scheme ---------------------------------
// China expanded its unilateral visa-free list well beyond the Jan-2025 snapshot.
// All of these are on China's current list (valid through 31 Dec 2026).
const CHINA_VISA_FREE_30 = [
  "GB", "CA", "BR", // added Feb 2026 (GB/CA) and Jun 2025 (BR)
  "AR", "CL", "PE", "UY", // South America
  "SA", "OM", "KW", "BH", // Gulf states
  "SE", // Sweden, effective Nov 2025
];

export const VISA_OVERRIDES: VisaOverride[] = [
  ...UK_ETA_EUROPE.map((passport): VisaOverride => ({
    passport,
    destination: "GB",
    value: "eta",
    source: "GOV.UK — Electronic Travel Authorisation (gov.uk/eta)",
    verifiedOn: "2026-05-31",
  })),

  ...CHINA_VISA_FREE_30.map((passport): VisaOverride => ({
    passport,
    destination: "CN",
    value: "30",
    source: "China National Immigration Administration / China Briefing",
    verifiedOn: "2026-05-31",
  })),

  // --- Brazil reinstated e-visa for US, Canada, Australia ---------------------
  // In force since 10 Apr 2025. Base dataset still shows visa-free (90 days).
  ...["US", "CA", "AU"].map((passport): VisaOverride => ({
    passport,
    destination: "BR",
    value: "e-visa",
    source: "Brazil VFSeVisa portal / Fragomen advisory",
    verifiedOn: "2026-05-31",
  })),
];
