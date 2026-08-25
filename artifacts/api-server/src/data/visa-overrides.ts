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

// Namibia ended visa-free entry for these 33 nationalities on 1 April 2025.
const NAMIBIA_VISA_NOW_REQUIRED = [
  "AM", "AU", "AT", "AZ", "BY", "BE", "CA", "DK", "FI", "FR", "DE", "IS", "IE",
  "IT", "JP", "KZ", "KG", "LI", "LU", "MD", "NL", "NZ", "NO", "PT", "ES", "SE",
  "CH", "TJ", "TM", "UA", "UZ", "GB", "US",
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

  // --- Thailand e-visa now open to Bangladeshi citizens ----------------------
  // Bangladeshis are NOT eligible for Thai visa on arrival, but the Thai e-visa
  // (thaievisa.go.th) is available to them — e-visa centres opened in Dhaka,
  // Sylhet and Chittagong from 26 Dec 2024. Base dataset says "visa required".
  {
    passport: "BD",
    destination: "TH",
    value: "e-visa",
    source: "Thai e-Visa portal (thaievisa.go.th) / Wikipedia: Visa requirements for Bangladeshi citizens",
    verifiedOn: "2026-08-24",
  },

  // --- Kenya eTA exemption for African nationals -----------------------------
  // Kenya's 2025 immigration regulations exempt citizens of almost every African
  // country from the eTA entirely (Somalia and Libya are the exceptions). Three
  // tiers by permitted stay: EAC partner states 180 days; a middle group 90
  // days; the rest 60 days. The base dataset (Jan 2025 snapshot) still shows
  // these as eTA/e-visa, which would wrongly tell African travellers to buy an
  // eTA they do not need.
  ...["BI", "CD", "RW", "SS", "TZ", "UG"].map((passport): VisaOverride => ({
    passport,
    destination: "KE",
    value: "180",
    source: "Kenya Immigration (eTA exemption, 2025 regulations) — EAC partner states",
    verifiedOn: "2026-08-24",
  })),
  ...["BW", "SZ", "ET", "GH", "LS", "MW", "MU", "MZ", "NA", "SC", "ZA", "ZM", "ZW", "GM", "SL"].map((passport): VisaOverride => ({
    passport,
    destination: "KE",
    value: "90",
    source: "Kenya Immigration (eTA exemption, 2025 regulations) — 90-day tier",
    verifiedOn: "2026-08-24",
  })),
  ...["DZ", "AO", "BJ", "BF", "CV", "CM", "CF", "TD", "CI", "DJ", "EG", "GQ", "GA", "GN", "GW", "LR", "MG", "ML", "MR", "MA", "NE", "NG", "ST", "SN", "SD", "TG", "TN", "KM", "ER", "CG"].map((passport): VisaOverride => ({
    passport,
    destination: "KE",
    value: "60",
    source: "Kenya Immigration (eTA exemption, 2025 regulations) — 60-day tier",
    verifiedOn: "2026-08-24",
  })),

  // Somalia and Libya are explicitly EXCLUDED from Kenya's African eTA
  // exemption on security grounds — they still need an eTA. The base dataset
  // wrongly shows Somalia as visa-free for Kenya, which would tell Somali
  // travellers they need nothing when they can be denied boarding without an
  // eTA. Libya is already correct in the base data; pinned here so a future
  // upstream refresh cannot silently reintroduce the error.
  ...["SO", "LY"].map((passport): VisaOverride => ({
    passport,
    destination: "KE",
    value: "eta",
    source: "Fragomen advisory / Wikipedia: Visa policy of Kenya — Somalia & Libya excluded from AU eTA exemption",
    verifiedOn: "2026-08-24",
  })),

  // --- Sri Lanka free ETA for Indian citizens --------------------------------
  // Sri Lanka's free 30-day tourist ETA scheme (40 nationalities incl. India)
  // took effect 25 May 2026. Visa on arrival still exists, but the ETA applied
  // for online beforehand is now the standard route, so we show it as an
  // electronic authorisation rather than plain visa on arrival.
  {
    passport: "IN",
    destination: "LK",
    value: "eta",
    source: "Sri Lanka Dept. of Immigration & Emigration (eta.gov.lk); free-ETA scheme effective 25 May 2026",
    verifiedOn: "2026-08-24",
  },

  // --- Namibia revoked visa-free entry for 33 nationalities ------------------
  // Effective 1 April 2025, Namibia ended visa exemption for 33 countries
  // (cabinet decision July 2024, citing lack of reciprocity). Affected
  // travellers now obtain a visa on arrival (N$1,600) or an e-Visa beforehand.
  // The Jan-2025 base snapshot still shows these as visa-free for 90 days —
  // the single largest stale cluster we have found.
  ...NAMIBIA_VISA_NOW_REQUIRED.map((passport): VisaOverride => ({
    passport,
    destination: "NA",
    value: "visa on arrival",
    source: "Embassy of Namibia (missionofnamibia.ch) 'New VISA Requirements 1 April 2025'; corroborated by BAL and ATTA immigration alerts",
    verifiedOn: "2026-08-24",
  })),

  // --- Qatar suspended visa on arrival for Pakistani nationals ---------------
  // Suspended with immediate effect on 31 March 2026; travellers must hold a
  // visa before departure or risk being refused at immigration.
  {
    passport: "PK",
    destination: "QA",
    value: "visa required",
    source: "EY immigration alert + Embassy of Pakistan in Doha advisory (31 Mar 2026)",
    verifiedOn: "2026-08-24",
  },

  // --- Uzbekistan visa-free for US citizens ----------------------------------
  // Presidential decree signed 3 Nov 2025; in force from 1 January 2026 for all
  // US citizens (previously only travellers aged 55+).
  {
    passport: "US",
    destination: "UZ",
    value: "30",
    source: "Uzbek presidential decree (3 Nov 2025), gov.uz; effective 1 Jan 2026",
    verifiedOn: "2026-08-24",
  },

  // --- China–Russia mutual visa exemption ------------------------------------
  // Trial from 15 Sep 2025, extended during Putin's May 2026 state visit and
  // now reciprocal through 31 December 2027.
  {
    passport: "RU",
    destination: "CN",
    value: "30",
    source: "State Council of the PRC (english.www.gov.cn); extended to 31 Dec 2027",
    verifiedOn: "2026-08-24",
  },

  // --- Saudi Arabia–Russia mutual visa exemption -----------------------------
  // In force 11 May 2026 — Saudi Arabia's first mutual exemption covering
  // ordinary passports. 90 days per visit; excludes work, study and Hajj.
  {
    passport: "RU",
    destination: "SA",
    value: "90",
    source: "Saudi Press Agency (spa.gov.sa/en/N2582764); effective 11 May 2026",
    verifiedOn: "2026-08-24",
  },

  // --- Oman added the Philippines to its visa-exemption list ------------------
  // Filipino tourists get 14 days visa-free (announced 2026), replacing the
  // previous eVisa requirement.
  {
    passport: "PH",
    destination: "OM",
    value: "14",
    source: "Oman Ministry of Foreign Affairs (fm.gov.om) visa-exemption announcement, 2026",
    verifiedOn: "2026-08-24",
  },

  // --- Malaysia visa-free stay length for Indian nationals --------------------
  // Requirement was already correct (visa-free); this adds the permitted stay.
  {
    passport: "IN",
    destination: "MY",
    value: "30",
    source: "EY Global immigration alert, 'Malaysia extends visa exemption period for India and China nationals' (3 Jan 2025)",
    verifiedOn: "2026-08-24",
  },

  // --- Batch 2: individually web-verified corrections (2026-08-25) -----------
  // South Korea has a separate BILATERAL 90-day treaty with Thailand, so the
  // pending rollback of Thailand's unilateral 60-day scheme does not apply.
  {
    passport: "KR",
    destination: "TH",
    value: "90",
    source: "Thai MFA visa-exemption table (image.mfa.go.th VOA.pdf); bilateral agreement, 90 days",
    verifiedOn: "2026-08-25",
  },

  // Brunei moved from the old 15-day ASEAN trial to China's full 30-day
  // unilateral visa-exemption list.
  {
    passport: "BN",
    destination: "CN",
    value: "30",
    source: "China NIA unilateral visa-exemption list (en.nia.gov.cn/n147418/n147463/c183390/content.html)",
    verifiedOn: "2026-08-25",
  },

  // Saudi visitor eVisa covers Azerbaijan, Georgia and Uzbekistan (Aug 2023
  // expansion). Uzbekistan's eVisa was suspended only for the 2025 Hajj season
  // (23 Apr–9 Jun 2025) and restored in June 2025.
  ...["AZ", "GE", "UZ"].map((passport): VisaOverride => ({
    passport,
    destination: "SA",
    value: "e-visa",
    source: "Saudi Tourism Authority / Deloitte 'KSA expands the visitor eVisa'; UZ restoration reported 19 Jun 2025 (kun.uz)",
    verifiedOn: "2026-08-25",
  })),

  // Qatar suspended visa on arrival for Lebanese nationals (1 Apr 2026);
  // a pre-approved Hayya visa is now required before departure.
  {
    passport: "LB",
    destination: "QA",
    value: "visa required",
    source: "Embassy of Lebanon in Doha advisory (1 Apr 2026); EY global immigration alert 2026-0813",
    verifiedOn: "2026-08-25",
  },

  // Georgia: Pakistani nationals are not eVisa-eligible; a visa from the
  // embassy is required (visa-free only with qualifying Gulf residence).
  {
    passport: "PK",
    destination: "GE",
    value: "visa required",
    source: "Envoy Global 'Georgia Updates Visa-Free Entry Rules'; Georgian embassy application guidance",
    verifiedOn: "2026-08-25",
  },

  // Oman's visa-exemption list (100+ nationalities, 14 days) includes Armenia.
  {
    passport: "AM",
    destination: "OM",
    value: "14",
    source: "Oman Ministry of Foreign Affairs entry-visa list (fm.gov.om)",
    verifiedOn: "2026-08-25",
  },
];
