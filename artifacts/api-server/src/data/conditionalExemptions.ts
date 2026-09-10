// Conditional visa exemptions: rules where holding a SECOND document — a visa
// or residence permit issued by another country — changes what you need.
//
// WHY THIS FILE IS SMALL, AND SHOULD STAY HONEST
// A large share of travellers from visa-requiring countries do not travel on a
// blank passport; they hold a US, Schengen or UK visa that unlocks dozens of
// destinations. The checker previously ignored that entirely, which meant it
// told an Indian passport holder with a US visa that Mexico needs a visa. That
// is wrong in a way that costs a trip.
//
// But the failure mode in the other direction is far worse: telling someone
// they are exempt when they are not gets them denied boarding. So every rule
// here MUST be verified against the issuing government's own page, carry that
// URL, and carry the date it was checked. Rules that could not be verified at
// an official source are deliberately absent — an incomplete honest dataset
// beats a complete guessed one.
//
// The UI must never silently rewrite the headline verdict. It presents the
// rule as an additional, sourced path and tells the reader to confirm it.
//
// NOT YET INCLUDED (searched, no official source reachable): Georgia's
// visa/residence-permit exemption. Widely reported by travel sites; the
// Georgian consular portal could not be read. Do not add it from a blog.

export type SecondaryDocument =
  | "us_visa" | "uk_visa" | "schengen_visa" | "canada_visa"
  | "japan_visa" | "australia_visa" | "singapore_visa";

export interface ConditionalExemption {
  /** ISO2 of the destination whose visa requirement is waived. */
  destination: string;
  /** ISO2 passports this applies to. Empty array = any nationality. */
  appliesTo: string[];
  /** Any ONE of these documents satisfies the rule. */
  documents: SecondaryDocument[];
  /** Plain-English summary of what the rule grants. */
  grants: string;
  /** Purposes the rule covers. */
  purposes: string;
  /** Conditions the traveller must also satisfy. */
  conditions: string[];
  /** The issuing government's own page. */
  source: string;
  sourceName: string;
  verifiedOn: string;
}

export const DOCUMENT_LABEL: Record<SecondaryDocument, string> = {
  us_visa: "a valid US visa",
  uk_visa: "a valid UK visa",
  schengen_visa: "a valid Schengen visa",
  canada_visa: "a valid Canadian visa",
  japan_visa: "a valid Japanese visa",
  australia_visa: "a valid Australian visa",
  singapore_visa: "a valid Singapore visa",
};

export const CONDITIONAL_EXEMPTIONS: ConditionalExemption[] = [
  {
    destination: "MX",
    appliesTo: [], // any nationality
    documents: ["us_visa", "uk_visa", "schengen_visa", "canada_visa", "japan_visa"],
    grants: "Entry without a Mexican visa for up to 180 days",
    purposes: "Tourism, business, or transit to another destination",
    conditions: [
      "The other country's visa must be valid",
      "You must carry a valid passport",
      "You must complete the Multiple Migratory Form (FMM)",
      "Officials may ask for documents proving the purpose of your trip",
    ],
    source: "https://consulmex.sre.gob.mx/toronto/index.php/en/servicesforeigners/doclegalization/52-conservices/225-visitors-who-do-not-require-a-visa-with-a-stay-up-to-180-days",
    sourceName: "Consulate General of Mexico (Secretaría de Relaciones Exteriores)",
    verifiedOn: "2026-09-09",
  },
  {
    destination: "PH",
    appliesTo: ["IN"],
    documents: ["us_visa", "japan_visa", "australia_visa", "canada_visa", "schengen_visa", "singapore_visa", "uk_visa"],
    grants: "Visa-free entry for 30 days, non-extendible",
    purposes: "Tourism",
    conditions: [
      "A valid visa or permanent residence permit from one of those countries (the AJACSSUK list)",
      "Passport valid at least six months beyond your intended stay",
      "A return or onward ticket to your next destination",
      "No derogatory record with the Bureau of Immigration",
    ],
    source: "https://evisa.gov.ph/page/policy?l1=Non-Immigrant+Visas&l2=Free+to+enter+the+Philippines+without+Visa",
    sourceName: "Philippine official e-Visa portal",
    verifiedOn: "2026-09-09",
  },
  {
    destination: "PH",
    appliesTo: ["CN"],
    documents: ["australia_visa", "japan_visa", "canada_visa", "schengen_visa", "us_visa"],
    grants: "Visa-free entry for 7 days, extendible to 21 days in total",
    purposes: "Tourism",
    conditions: [
      "A valid or unexpired visa from one of those countries",
      "Passport valid at least six months beyond your intended stay",
      "A return or onward ticket to your next destination",
    ],
    source: "https://evisa.gov.ph/page/policy?l1=Non-Immigrant+Visas&l2=Free+to+enter+the+Philippines+without+Visa",
    sourceName: "Philippine official e-Visa portal",
    verifiedOn: "2026-09-09",
  },
];

/** Rules that could change the answer for this passport → destination pair. */
export function exemptionsFor(passport: string, destination: string): ConditionalExemption[] {
  return CONDITIONAL_EXEMPTIONS.filter(
    (e) => e.destination === destination && (e.appliesTo.length === 0 || e.appliesTo.includes(passport)),
  );
}

/** Every rule for a destination, for the destination hub page. */
export function exemptionsForDestination(destination: string): ConditionalExemption[] {
  return CONDITIONAL_EXEMPTIONS.filter((e) => e.destination === destination);
}
