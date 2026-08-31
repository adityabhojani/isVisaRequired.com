export type RequirementLevel = "required" | "recommended" | "none";

export interface VaccinationRule {
  name: string;
  level: "required" | "recommended";
  detail?: string;
}

export interface PreAuthRule {
  name: string;
  applies: string;
  fee?: string;
  url?: string;
}

export interface EntryRules {
  passportValidity: string;
  returnTicket: RequirementLevel;
  returnTicketNote?: string;
  proofOfFunds: RequirementLevel;
  proofOfFundsNote?: string;
  travelInsurance: RequirementLevel;
  travelInsuranceNote?: string;
  vaccinations: VaccinationRule[];
  preAuth?: PreAuthRule;
  notes?: string[];
}

const DEFAULT: EntryRules = {
  passportValidity: "Valid for at least 6 months beyond your planned stay",
  returnTicket: "recommended",
  proofOfFunds: "recommended",
  travelInsurance: "recommended",
  vaccinations: [
    { name: "Routine vaccines", level: "recommended", detail: "Ensure tetanus, MMR, and COVID-19 boosters are current" },
  ],
};

const SCHENGEN: EntryRules = {
  passportValidity: "Valid for at least 3 months beyond your Schengen stay",
  returnTicket: "required",
  returnTicketNote: "Proof of onward/return travel required at border",
  proofOfFunds: "required",
  proofOfFundsNote: "Approx. €100 per day of stay (varies by country)",
  travelInsurance: "required",
  travelInsuranceNote: "Min. €30,000 medical coverage for the entire Schengen area",
  vaccinations: [
    { name: "Routine vaccines", level: "recommended", detail: "Tetanus, MMR up to date" },
  ],
  preAuth: {
    name: "ETIAS",
    applies: "Visa-exempt non-EU nationals (launching 2025)",
    fee: "€7",
    url: "https://travel-europe.europa.eu/etias_en",
  },
  notes: [
    "Maximum 90 days in any 180-day period across all Schengen countries combined",
    "Keep hotel bookings and travel itinerary ready for inspection",
  ],
};

const RULES: Record<string, EntryRules> = {
  // ── United States ──────────────────────────────────────────────────────────
  US: {
    passportValidity: "Valid for duration of stay (some nationalities need 6 months)",
    returnTicket: "required",
    returnTicketNote: "Onward/return ticket required; no stated intention to immigrate",
    proofOfFunds: "required",
    proofOfFundsNote: "Officers may ask for bank statements or cash proof at border",
    travelInsurance: "recommended",
    travelInsuranceNote: "US healthcare is very expensive — insurance strongly advised",
    vaccinations: [
      { name: "COVID-19", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "ESTA",
      applies: "Nationals of Visa Waiver Program countries",
      fee: "USD 21",
      url: "https://esta.cbp.dhs.gov",
    },
    notes: [
      "ESTA must be approved before boarding — apply at least 72 hours in advance",
      "Visa Waiver Program allows up to 90 days; cannot be extended",
      "Declare all food, plant material, and goods over USD 800 on arrival",
    ],
  },

  // ── United Kingdom ─────────────────────────────────────────────────────────
  GB: {
    passportValidity: "Valid for duration of stay",
    returnTicket: "recommended",
    returnTicketNote: "Border officers may ask for evidence of return travel",
    proofOfFunds: "required",
    proofOfFundsNote: "Must demonstrate ability to support yourself without working illegally",
    travelInsurance: "recommended",
    travelInsuranceNote: "NHS may charge overseas visitors; insurance recommended",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "ETA",
      applies: "Visa-exempt nationals (US, Canada, Australia, Gulf states, and more)",
      fee: "GBP 10",
      url: "https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta",
    },
    notes: [
      "ETA is linked to your passport — apply before departure",
      "Standard visitor visa allows up to 6 months; no paid work",
      "UK is not part of the Schengen Area — separate entry rules apply",
    ],
  },

  // ── Canada ─────────────────────────────────────────────────────────────────
  CA: {
    passportValidity: "Valid for duration of stay",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    proofOfFundsNote: "Officers may ask for proof of funds at border",
    travelInsurance: "recommended",
    travelInsuranceNote: "Provincial healthcare does not cover visitors",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "eTA",
      applies: "Visa-exempt foreign nationals flying into Canada",
      fee: "CAD 7",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",
    },
    notes: [
      "eTA is NOT required if you need a visa or are a US citizen",
      "Maximum stay up to 6 months as visitor",
      "ArriveCAN app not currently required but recommended",
    ],
  },

  // ── Australia ──────────────────────────────────────────────────────────────
  AU: {
    passportValidity: "Valid for duration of stay",
    returnTicket: "required",
    returnTicketNote: "Proof of outbound travel required",
    proofOfFunds: "required",
    proofOfFundsNote: "AUD 5,000 or sufficient funds for your stay",
    travelInsurance: "recommended",
    travelInsuranceNote: "Australia has reciprocal healthcare with some countries; insurance still advised",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
      { name: "Yellow fever", level: "required", detail: "Required if arriving from a yellow fever endemic country" },
    ],
    preAuth: {
      name: "ETA or eVisitor",
      applies: "Passport holders from eligible countries",
      fee: "Free (eVisitor) or AUD 20 (ETA via app)",
      url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601",
    },
    notes: [
      "Most visitors need an ETA, eVisitor, or tourist visa before arrival",
      "Strict biosecurity — declare all food, plants, animal products on arrival",
      "Some countries require a full tourist visa instead of ETA",
    ],
  },

  // ── New Zealand ────────────────────────────────────────────────────────────
  NZ: {
    passportValidity: "Valid for 3 months beyond intended departure",
    returnTicket: "required",
    proofOfFunds: "required",
    proofOfFundsNote: "NZD 1,000 per month of stay (or return ticket)",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
      { name: "Yellow fever", level: "required", detail: "Required if arriving from endemic countries" },
    ],
    preAuth: {
      name: "NZeTA",
      applies: "Visa-waiver country nationals (including US, UK, EU, Canada, Australia)",
      fee: "NZD 23 (app) or NZD 17 (online)",
      url: "https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/nzeta",
    },
    notes: [
      "NZeTA also covers an International Visitor Conservation and Tourism Levy (IVL) of NZD 35",
      "Maximum stay 3–9 months depending on nationality",
      "Very strict biosecurity — declare all food, soil, outdoor equipment",
    ],
  },

  // ── Japan ──────────────────────────────────────────────────────────────────
  JP: {
    passportValidity: "Valid for duration of stay",
    returnTicket: "required",
    returnTicketNote: "Officers frequently verify outbound travel",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Most nationalities receive 90-day visa-free entry (some 15-day or 30-day)",
      "Cannot work on a tourist visa — violations result in deportation and ban",
      "Carry your passport at all times; it serves as ID",
      "IC chip passport may be required for some nationalities",
    ],
  },

  // ── South Korea ────────────────────────────────────────────────────────────
  KR: {
    passportValidity: "Valid for duration of stay",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "K-ETA (electronic travel authorization) required for some nationalities — check before travel",
      "Most visa-free nationalities may stay 30–90 days",
    ],
  },

  // ── Singapore ──────────────────────────────────────────────────────────────
  SG: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "required",
    returnTicketNote: "Confirmed onward/return ticket required",
    proofOfFunds: "required",
    proofOfFundsNote: "SGD 500+ recommended; bank statements may be checked",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Yellow fever", level: "required", detail: "Required if arriving within 6 days from endemic countries" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Stay typically 30 days (visa-free), extendable in some cases",
      "Singapore has strict laws — no chewing gum, no littering, no jaywalking",
      "Carrying drugs can result in the death penalty",
    ],
  },

  // ── Thailand ───────────────────────────────────────────────────────────────
  TH: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "required",
    returnTicketNote: "Return/onward ticket is strictly checked at airlines and border",
    proofOfFunds: "required",
    proofOfFundsNote: "THB 20,000 per person / THB 40,000 per family in cash or equivalent",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Visa-exempt stays are 30 days for most nationalities (60-day extension ended May 2026)",
      "Respect royal family and temples — dress modestly at sacred sites",
    ],
  },

  // ── Indonesia ──────────────────────────────────────────────────────────────
  ID: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "required",
    proofOfFunds: "recommended",
    proofOfFundsNote: "Approx. USD 2,000 equivalent",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Malaria prophylaxis", level: "recommended", detail: "For Kalimantan, Papua, Maluku, and NTT regions" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "Visa on Arrival / eVOA",
      applies: "Most nationalities (some eligible for free visa-free entry)",
      fee: "IDR 500,000 (approx. USD 31)",
      url: "https://evoa.imigrasi.go.id",
    },
    notes: [
      "eVOA can be purchased in advance online for faster processing",
      "Bali-specific rules: carry photocopies of passport at all times",
      "Strict drug laws — death penalty for trafficking",
    ],
  },

  // ── Vietnam ────────────────────────────────────────────────────────────────
  VN: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "E-Visa",
      applies: "Citizens of most countries (90-day single entry)",
      fee: "USD 25",
      url: "https://evisa.xuatnhapcanh.gov.vn",
    },
    notes: [
      "E-Visa grants 90 days single entry — multiple entry also available",
      "Visa exemption (45 days) available for 13+ nationalities without pre-registration",
      "Register at your accommodation within 24 hours of arrival",
    ],
  },

  // ── India ──────────────────────────────────────────────────────────────────
  IN: {
    passportValidity: "Valid for at least 6 months with 2 blank pages",
    returnTicket: "required",
    proofOfFunds: "required",
    proofOfFundsNote: "Bank statements or traveler's cheques may be requested",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Yellow fever", level: "required", detail: "Certificate required if arriving from endemic countries" },
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Malaria prophylaxis", level: "recommended", detail: "Rural areas and northeast India" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "e-Visa",
      applies: "Nationals of 170+ countries",
      fee: "USD 10–100 depending on nationality and duration",
      url: "https://indianvisaonline.gov.in/evisa",
    },
    notes: [
      "Apply for e-Visa at least 4 days before travel",
      "Tourist e-Visa valid for 30, 90, or 365 days depending on nationality",
      "Keep a few passport photos handy — hotels may require them",
    ],
  },

  // ── UAE ────────────────────────────────────────────────────────────────────
  AE: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "required",
    proofOfFunds: "required",
    proofOfFundsNote: "Hotel booking or host details often required",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Many nationalities receive free visa on arrival (30 days, extendable)",
      "Respect Islamic customs — dress modestly, no public displays of affection",
      "Alcohol only in licensed premises; strict public intoxication laws",
      "Prescription medications must be declared and may require prior approval",
    ],
  },

  // ── Saudi Arabia ───────────────────────────────────────────────────────────
  SA: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "required",
    proofOfFunds: "required",
    travelInsurance: "required",
    travelInsuranceNote: "Medical insurance is mandatory for tourist visa",
    vaccinations: [
      { name: "Meningococcal (ACWY)", level: "required", detail: "Required for Hajj and Umrah pilgrims" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "Tourist e-Visa",
      applies: "Nationals of 60+ countries",
      fee: "SAR 100 + VAT (~SAR 115)",
      url: "https://visa.visitsaudi.com",
    },
    notes: [
      "Women can now travel independently; no longer require male guardian for most activities",
      "Dress modestly in public — abaya not mandatory but respectful clothing required",
      "No alcohol; prohibited items include pork, and certain medications",
      "Non-Muslims cannot enter Mecca or Medina's restricted zones",
    ],
  },

  // ── Brazil ─────────────────────────────────────────────────────────────────
  BR: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    proofOfFundsNote: "USD 100 equivalent per day or USD 2,000 total",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Yellow fever", level: "recommended", detail: "Required for Amazon region; certificate needed if entering from endemic country" },
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Many nationalities receive 90-day visa-free entry",
      "Yellow fever vaccination certificate required if arriving from endemic countries",
      "Be vigilant about petty theft in major cities like Rio and São Paulo",
    ],
  },

  // ── Mexico ─────────────────────────────────────────────────────────────────
  MX: {
    passportValidity: "Valid for duration of stay",
    returnTicket: "required",
    returnTicketNote: "Onward ticket required; tourists issued a Forma Migratoria Múltiple (FMM)",
    proofOfFunds: "required",
    proofOfFundsNote: "USD 300 equivalent or credit card",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Most nationalities receive 180 days on arrival",
      "FMM (tourist card) may need to be completed — keep your copy",
      "US customs requires declaration of goods over USD 800 on return",
    ],
  },

  // ── South Africa ───────────────────────────────────────────────────────────
  ZA: {
    passportValidity: "Valid for at least 30 days beyond visa validity with 2 blank pages",
    returnTicket: "required",
    proofOfFunds: "required",
    proofOfFundsNote: "ZAR 5,000 per day or equivalent in travelers cheques",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Yellow fever", level: "required", detail: "Vaccination certificate required if arriving from endemic countries" },
      { name: "Malaria prophylaxis", level: "recommended", detail: "Limpopo, Mpumalanga (Kruger), and KwaZulu-Natal coast" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Children under 18 traveling with one parent need an unabridged birth certificate",
      "Most nationalities get 30–90 days visa-free",
      "Be vigilant about safety; car hijacking and mugging risks in cities",
    ],
  },

  // ── Kenya ──────────────────────────────────────────────────────────────────
  KE: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Yellow fever", level: "required", detail: "Required for all travelers; certificate checked on arrival" },
      { name: "Malaria prophylaxis", level: "required", detail: "Malaria is prevalent throughout Kenya" },
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "Electronic Travel Authorisation (ETA)",
      applies: "All foreign nationals",
      fee: "USD 30",
      url: "https://www.etakenya.go.ke",
    },
    notes: [
      "ETA required for all visitors since January 2024; replaces visa on arrival",
      "Keep yellow fever certificate — it is checked at the airport",
      "Travel insurance with medical evacuation recommended",
    ],
  },

  // ── Egypt ──────────────────────────────────────────────────────────────────
  EG: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    preAuth: {
      name: "e-Visa",
      applies: "Nationals of most countries",
      fee: "USD 25",
      url: "https://visa2egypt.gov.eg",
    },
    notes: [
      "Visa on arrival available for some nationalities at main airports",
      "Dress conservatively outside of resort areas",
      "Scuba diving certification needed for Red Sea dives",
    ],
  },

  // ── Morocco ────────────────────────────────────────────────────────────────
  MA: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Many nationalities receive 90-day visa-free access",
      "Dress modestly, especially outside major cities and in religious areas",
      "Ramadan: eating, drinking, smoking in public during daylight is frowned upon",
    ],
  },

  // ── China ──────────────────────────────────────────────────────────────────
  CN: {
    passportValidity: "Valid for at least 6 months with 2 blank pages",
    returnTicket: "required",
    proofOfFunds: "required",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "144-hour or 72-hour visa-free transit available at major airports for many nationalities",
      "15-day visa-free access introduced for several countries including France, Germany, US (check current status)",
      "VPN services are restricted; download tools before arrival",
      "Many Western apps (Google, WhatsApp, Instagram) are blocked",
      "Register at accommodation within 24 hours of arrival",
    ],
  },

  // ── Russia ─────────────────────────────────────────────────────────────────
  RU: {
    passportValidity: "Valid for at least 6 months",
    returnTicket: "required",
    proofOfFunds: "required",
    travelInsurance: "required",
    travelInsuranceNote: "Medical insurance required to obtain visa",
    vaccinations: [
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Most Western countries currently advise against travel to Russia",
      "Registration with local authorities required within 7 working days",
      "Tourist visa required for most nationalities; e-Visa available for some",
      "Travel insurance with coverage for Russia required for visa application",
    ],
  },

  // ── France ─────────────────────────────────────────────────────────────────
  FR: { ...SCHENGEN },
  // ── Germany ────────────────────────────────────────────────────────────────
  DE: { ...SCHENGEN },
  // ── Spain ──────────────────────────────────────────────────────────────────
  ES: { ...SCHENGEN },
  // ── Italy ──────────────────────────────────────────────────────────────────
  IT: { ...SCHENGEN },
  // ── Netherlands ────────────────────────────────────────────────────────────
  NL: { ...SCHENGEN },
  // ── Belgium ────────────────────────────────────────────────────────────────
  BE: { ...SCHENGEN },
  // ── Portugal ───────────────────────────────────────────────────────────────
  PT: { ...SCHENGEN },
  // ── Switzerland ────────────────────────────────────────────────────────────
  CH: { ...SCHENGEN },
  // ── Austria ────────────────────────────────────────────────────────────────
  AT: { ...SCHENGEN },
  // ── Sweden ─────────────────────────────────────────────────────────────────
  SE: { ...SCHENGEN },
  // ── Norway ─────────────────────────────────────────────────────────────────
  NO: { ...SCHENGEN },
  // ── Denmark ────────────────────────────────────────────────────────────────
  DK: { ...SCHENGEN },
  // ── Finland ────────────────────────────────────────────────────────────────
  FI: { ...SCHENGEN },
  // ── Greece ─────────────────────────────────────────────────────────────────
  GR: { ...SCHENGEN },
  // ── Poland ─────────────────────────────────────────────────────────────────
  PL: { ...SCHENGEN },
  // ── Czech Republic ─────────────────────────────────────────────────────────
  CZ: { ...SCHENGEN },
  // ── Hungary ────────────────────────────────────────────────────────────────
  HU: { ...SCHENGEN },
  // ── Croatia ────────────────────────────────────────────────────────────────
  HR: { ...SCHENGEN },
  // ── Slovakia ───────────────────────────────────────────────────────────────
  SK: { ...SCHENGEN },
  // ── Slovenia ───────────────────────────────────────────────────────────────
  SI: { ...SCHENGEN },
  // ── Estonia ────────────────────────────────────────────────────────────────
  EE: { ...SCHENGEN },
  // ── Latvia ─────────────────────────────────────────────────────────────────
  LV: { ...SCHENGEN },
  // ── Lithuania ──────────────────────────────────────────────────────────────
  LT: { ...SCHENGEN },
  // ── Luxembourg ─────────────────────────────────────────────────────────────
  LU: { ...SCHENGEN },
  // ── Malta ──────────────────────────────────────────────────────────────────
  MT: { ...SCHENGEN },
  // ── Iceland ────────────────────────────────────────────────────────────────
  IS: { ...SCHENGEN },
  // ── Liechtenstein ──────────────────────────────────────────────────────────
  LI: { ...SCHENGEN },
  // ── Romania ────────────────────────────────────────────────────────────────
  RO: { ...SCHENGEN },
  // ── Bulgaria ───────────────────────────────────────────────────────────────
  BG: { ...SCHENGEN },
};

export function getEntryRules(countryCode: string): EntryRules {
  return RULES[countryCode.toUpperCase()] ?? DEFAULT;
}

export function hasSpecificRules(countryCode: string): boolean {
  return countryCode.toUpperCase() in RULES;
}
