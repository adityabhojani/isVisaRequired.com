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
    applies: "Visa-exempt non-EU nationals (not yet launched — expected Q4 2026)",
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
      url: "https://evisa.imigrasi.go.id",
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
      applies: "Citizens of all countries (90-day single or multiple entry)",
      fee: "USD 25 (single) / USD 50 (multiple entry)",
      url: "https://evisa.gov.vn",
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
      fee: "~SAR 535 total (SAR 300 visa + mandatory medical insurance + VAT)",
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

  // ── Lebanon ────────────────────────────────────────────────────────────────
  // The Israeli-stamp rule is the single thing that strands travellers here, and
  // it is absolute — it voids an otherwise valid visa. Sourced from Lebanon's
  // General Security, the Lebanese embassies in London and Ottawa, and Sweden's
  // embassy in Beirut.
  LB: {
    passportValidity: "Valid for at least 3 months beyond your intended stay, with 2 blank pages — some Lebanese missions ask for longer, so check before you book",
    returnTicket: "required",
    returnTicketNote: "A non-refundable return or onward ticket is a stated condition of the free visa on arrival",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Entry is refused to anyone whose passport carries an Israeli stamp, visa or seal — and an Israeli seal renders an already-issued Lebanese visa invalid",
      "The free visa on arrival is for 1 month, extendable by a further 2 months at a General Security office",
      "You must be able to give a Lebanese address and a contact telephone number on arrival",
      "A paid visa on arrival (around USD 17, single entry, 3 months) is available where the free one does not apply",
    ],
  },

  // ── Nepal ──────────────────────────────────────────────────────────────────
  NP: {
    passportValidity: "Valid for at least 6 months, with a blank page for the visa",
    returnTicket: "recommended",
    proofOfFunds: "recommended",
    travelInsurance: "recommended",
    travelInsuranceNote: "Trekking above 4,000 m and helicopter rescue are usually excluded unless you buy specific cover",
    vaccinations: [
      { name: "Hepatitis A", level: "recommended" },
      { name: "Typhoid", level: "recommended" },
      { name: "Yellow fever", level: "recommended", detail: "Certificate required only if arriving from a country with risk of yellow fever transmission" },
      { name: "Routine vaccines", level: "recommended" },
    ],
    notes: [
      "Indian nationals need no visa at all, and may use an Indian passport or an original Election Commission voter ID instead",
      "Visa on arrival is available at Tribhuvan International Airport and at land border posts for most other nationalities",
      "Tourist visas are capped at 150 days in a calendar year",
      "Trekking in most regions needs a TIMS card and a national park or conservation area permit, bought separately from the visa",
    ],
  },

  // ── Argentina ──────────────────────────────────────────────────────────────
  // Sourced from Dirección Nacional de Migraciones (migraciones.gob.ar), the
  // Cancillería visa pages, ARCA customs, CDC and UK FCDO. Deliberately does NOT
  // repeat the lazy "6 months passport validity" default — Argentina only asks
  // for validity covering the stay (the 6-month rule applies to consular visa
  // applicants, which is noted on the pages that need it).
  AR: {
    passportValidity: "Valid for the duration of your stay (Argentina has no 6-month rule) — but 6 months' validity plus a blank page if you need a consular visa",
    returnTicket: "recommended",
    returnTicketNote: "Not on the official entry-document list, but officers may ask to see onward travel",
    proofOfFunds: "recommended",
    proofOfFundsNote: "No published minimum — Migraciones sets no figure; any amount quoted elsewhere is invented",
    travelInsurance: "recommended",
    travelInsuranceNote: "Not checked at the border, but since Resolución 1066/2026 (11 Aug 2026) public hospitals charge non-residents for non-emergency care",
    vaccinations: [
      { name: "Yellow fever", level: "recommended", detail: "No certificate required to enter Argentina. CDC recommends the vaccine for travel to Corrientes and Misiones provinces — Misiones includes Iguazú Falls" },
      { name: "Hepatitis A", level: "recommended", detail: "CDC recommends it for unvaccinated travellers aged 1 and over" },
      { name: "Typhoid", level: "recommended", detail: "Consider it for rural areas, longer stays, or if visiting friends and relatives" },
      { name: "Routine vaccines", level: "recommended", detail: "No vaccine is an entry condition for Argentina — keep MMR, tetanus and polio up to date" },
    ],
    preAuth: {
      name: "AVE (Autorización de Viaje Electrónica)",
      applies: "Nationals of ~70 visa-required countries who hold a valid US visa (B2, J, B1, O, P, E or H-1B) or a valid US ESTA — an alternative to the consular visa, not a general ETA",
      url: "https://www.migraciones.gob.ar/ave/",
    },
    notes: [
      "Argentina no longer stamps passports on entry — keep boarding passes as proof of your entry date",
      "Tourist entry is 90 days, extendable once by a further 90 days (prórroga de permanencia); file it in the 10 days before your stay expires",
      "The old 'reciprocity fee' is abolished for every nationality — any site charging one is fraudulent",
      "Cash: under USD 10,000 needs no declaration; USD 10,000 or more must be declared to customs",
      "Duty-free baggage: USD 500 arriving by air or sea (plus USD 500 in the arrivals free shop); USD 300 by land",
      "Foreign tourists get an automatic 21% VAT refund on accommodation paid with a foreign card or foreign bank transfer",
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
      "A valid US visa exempts you from needing a Mexican visa — whatever your nationality. A valid Canadian, Japanese, UK or Schengen visa, or permanent residence in any of those, does the same",
      "Mexico sets no minimum passport validity — it only has to be valid for your stay",
      "Most nationalities receive up to 180 days on arrival",
      "FMM (tourist card) may need to be completed — keep your copy",
      "Cruise passengers going ashore and re-boarding the same ship get a 21-day collective permit and need no visa",
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
