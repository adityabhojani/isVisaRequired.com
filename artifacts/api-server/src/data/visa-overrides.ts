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

// --- US Presidential Proclamation 10998 – travel ban effective Jan 1 2026 ----
// Full suspension (Sections 2 & 4): ALL immigrant and nonimmigrant entry suspended —
// nationals cannot obtain any US visa or enter as nonimmigrants (including tourists).
// Source: travel.state.gov/content/travel/en/News/visas-news/
//         suspension-of-visa-issuance-to-foreign-nationals-to-protect-the-security-of-the-united-states.html
const US_TRAVEL_BAN_FULL = [
  "AF", // Afghanistan
  "BF", // Burkina Faso
  "MM", // Burma / Myanmar
  "TD", // Chad
  "CG", // Republic of the Congo
  "GQ", // Equatorial Guinea
  "ER", // Eritrea
  "HT", // Haiti
  "IR", // Iran
  "LA", // Laos
  "LY", // Libya
  "ML", // Mali
  "NE", // Niger
  "SL", // Sierra Leone
  "SO", // Somalia
  "SS", // South Sudan
  "SD", // Sudan
  "SY", // Syria
  "YE", // Yemen
];

// Partial suspension (Section 3): immigrant + B-1/B-2 tourist + F/M/J visas
// suspended. Tourist entry is not possible; "no admission" is the correct
// answer for any traveller checking whether they can visit the US.
// Note: Turkmenistan has immigrant-only suspension and is intentionally excluded.
const US_TRAVEL_BAN_PARTIAL = [
  "AO", // Angola
  "AG", // Antigua and Barbuda
  "BJ", // Benin
  "BI", // Burundi
  "CI", // Côte d'Ivoire
  "CU", // Cuba
  "DM", // Dominica
  "GA", // Gabon
  "GM", // Gambia
  "MW", // Malawi
  "MR", // Mauritania
  "NG", // Nigeria
  "SN", // Senegal
  "TZ", // Tanzania
  "TG", // Togo
  "TO", // Tonga
  "VE", // Venezuela
  "ZM", // Zambia
  "ZW", // Zimbabwe
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

  // --- US travel ban – full suspension (Proclamation 10998, Jan 1 2026) -------
  // All nonimmigrant and immigrant entry suspended; tourist visas cannot be issued.
  ...US_TRAVEL_BAN_FULL.map((passport): VisaOverride => ({
    passport,
    destination: "US",
    value: "no admission",
    source: "U.S. Presidential Proclamation 10998 — travel.state.gov",
    verifiedOn: "2026-06-07",
    note: "Full suspension: all immigrant and nonimmigrant entry suspended.",
  })),

  // --- US travel ban – partial suspension (B-1/B-2 tourist visas suspended) ---
  // Entry as a tourist (B-1/B-2) is suspended; travellers cannot visit the US.
  ...US_TRAVEL_BAN_PARTIAL.map((passport): VisaOverride => ({
    passport,
    destination: "US",
    value: "no admission",
    source: "U.S. Presidential Proclamation 10998 — travel.state.gov",
    verifiedOn: "2026-06-07",
    note: "Partial suspension: B-1/B-2 tourist and F/M/J visas suspended.",
  })),

  // --- Russia → China 30-day visa-free (added after Jan-2025 CSV snapshot) ----
  // Russia joined China's unilateral visa-free scheme. The Jan-2025 base CSV
  // still shows "visa required"; this override corrects it.
  // The arrangement runs until ~14 Sep 2026 (shorter window than most countries).
  {
    passport: "RU",
    destination: "CN",
    value: "30",
    source: "China National Immigration Administration — en.nia.gov.cn",
    verifiedOn: "2026-06-07",
    note: "30-day visa-free under China's unilateral scheme; valid through ~14 Sep 2026.",
  },

  // --- Thailand reverts from 60 days to 30 days (Cabinet vote 19 May 2026) ----
  // The Jan-2025 CSV snapshot recorded the 60-day extension that Thailand
  // introduced in mid-2024. Thailand's Cabinet voted on 19 May 2026 to end the
  // extension; the standard 30-day visa-free period was reinstated from that date.
  // 92 passports in the CSV show "60" and must be corrected to "30".
  // Countries with separate bilateral agreements (AR, BR, CL at 90 days) are
  // unaffected and intentionally excluded.
  ...([
    "AD", "AE", "AL", "AT", "AU", "BE", "BG", "BH",
    "BN", "BT", "CA", "CH", "CN", "CO", "CU", "CY",
    "CZ", "DE", "DK", "DM", "DO", "EC", "EE", "ES",
    "FI", "FJ", "FR", "GB", "GE", "GR", "GT", "HK",
    "HR", "HU", "ID", "IE", "IL", "IN", "IS", "IT",
    "JM", "JO", "JP", "KH", "KR", "KW", "KZ", "LA",
    "LI", "LK", "LT", "LU", "LV", "MA", "MC", "MN",
    "MO", "MT", "MU", "MV", "MX", "MY", "NL", "NO",
    "NZ", "OM", "PA", "PE", "PG", "PH", "PL", "PT",
    "QA", "RO", "RU", "SA", "SE", "SG", "SI", "SK",
    "SM", "TO", "TR", "TT", "TW", "UA", "US", "UY",
    "UZ", "VN", "XK", "ZA",
  ] as string[]).map((passport): VisaOverride => ({
    passport,
    destination: "TH",
    value: "30",
    source: "Thai Cabinet Resolution 19 May 2026 / Tourism Authority of Thailand",
    verifiedOn: "2026-08-31",
    note: "Standard 30-day visa-free reinstated after 60-day extension ended.",
  })),

  // --- Indonesia adds Brazil and Turkey to visa-free (3 Jul 2025) -------------
  // Indonesia's Immigration Directorate extended visa-free access to Brazilian
  // and Turkish passport holders effective 3 July 2025. The Jan-2025 base CSV
  // still shows "visa on arrival" for both; this override upgrades them.
  ...([
    "BR", "TR",
  ] as string[]).map((passport): VisaOverride => ({
    passport,
    destination: "ID",
    value: "visa free",
    source: "Indonesia Immigration Directorate General — imigrasi.go.id",
    verifiedOn: "2026-08-31",
    note: "Visa-free access granted effective 3 Jul 2025; previously visa on arrival.",
  })),

  // --- Vietnam grants 45-day visa-free entry to 12 European countries ----------
  // Effective 15 Aug 2025 (valid through 14 Aug 2028), Vietnam added 12 EU/EEA
  // member states to its visa-exemption list at 45 days. The Jan-2025 CSV shows
  // "e-visa" for all of these; this overrides them to 45-day visa-free.
  ...([
    "BE", "BG", "HR", "CZ", "HU", "LU", "NL", "PL", "RO", "SK", "SI", "CH",
  ] as string[]).map((passport): VisaOverride => ({
    passport,
    destination: "VN",
    value: "45",
    source: "Vietnam Ministry of Culture / Vietnam Tourism official site — vietnam.travel",
    verifiedOn: "2026-08-31",
    note: "45-day visa-free; stimulus program effective 15 Aug 2025 – 14 Aug 2028.",
  })),

  // --- Vietnam reduces Indonesia visa-free stay from 30 to 14 days (15 Jul 2026)
  // Indonesia had 30-day visa-free access to Vietnam under a bilateral agreement.
  // Vietnam reduced this to 14 days for ordinary passport holders from 15 Jul 2026.
  // The Jan-2025 CSV correctly shows 30 days for the old arrangement.
  {
    passport: "ID",
    destination: "VN",
    value: "14",
    source: "Vietnam Immigration Department / Jakarta Globe report Jul 2026",
    verifiedOn: "2026-08-31",
    note: "Reduced from 30 to 14 days for ordinary passports effective 15 Jul 2026.",
  },
];
