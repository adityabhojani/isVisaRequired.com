// Electronic travel authorisation explainers (ETIAS, UK ETA, US ESTA, Canada
// eTA, Australia ETA). These are NOT visas — they're online pre-screening for
// visa-exempt travellers. Content is well-established and conservative; fees and
// launch dates change, so every page links the official source and shows a
// "reviewed" date. ETIAS is explicitly marked as not-yet-required.

export interface TravelAuth {
  slug: string;
  name: string;        // short label, e.g. "ETIAS (Europe)"
  scheme: string;      // full name
  status: "live" | "upcoming";
  statusNote: string;
  summary: string;
  whatItIs: string;
  whoNeeds: string;
  cost: string;
  validity: string;
  howToApply: string;
  officialName: string;
  officialUrl: string;
  reviewed: string;
}

const REVIEWED = "2026-06-01";

export const TRAVEL_AUTHS: TravelAuth[] = [
  {
    slug: "etias",
    name: "ETIAS (Europe)",
    scheme: "European Travel Information and Authorisation System",
    status: "upcoming",
    statusNote: "Not yet required. The EU expects ETIAS to start in 2026, followed by a transitional grace period. Until it launches you do NOT need it — but check the official source before travel, as dates have shifted before.",
    summary: "ETIAS is a coming travel authorisation (not a visa) for visa-exempt visitors to 30 European countries. It is not yet required.",
    whatItIs: "ETIAS is an online travel authorisation linked to your passport for short stays (up to 90 days in any 180) across 30 European countries, including the Schengen Area. It is not a visa — it's a pre-travel security check for people who can already enter Europe visa-free.",
    whoNeeds: "Nationals of visa-exempt countries (for example the US, UK, Canada, Australia, Japan and many others) who travel to Europe for short stays. Travellers who already need a Schengen visa do not use ETIAS.",
    cost: "Expected to be €7 per application, with applicants under 18 or over 70 exempt from the fee. Confirm on the official site.",
    validity: "Expected to be valid for 3 years, or until your passport expires — whichever comes first, for multiple short trips.",
    howToApply: "Online via the official EU ETIAS website or app, before you travel. Most applications are expected to be approved quickly, but allow time in case extra checks are needed.",
    officialName: "European Union — Official ETIAS website",
    officialUrl: "https://travel-europe.europa.eu/etias_en",
    reviewed: REVIEWED,
  },
  {
    slug: "uk-eta",
    name: "UK ETA",
    scheme: "UK Electronic Travel Authorisation",
    status: "live",
    statusNote: "Live and being rolled out by nationality. European visitors are included in the 2025–2026 roll-out — many travellers can be denied boarding without one, so check whether it already applies to you.",
    summary: "The UK ETA is an online authorisation required before travel for visitors who don't need a UK visa.",
    whatItIs: "An Electronic Travel Authorisation linked to your passport, required before you travel to the UK if you don't need a visa for short visits. It is not a visa and doesn't guarantee entry — the final decision is made at the border.",
    whoNeeds: "Visa-exempt visitors to the UK, being phased in by nationality. If you already need a UK visa, you apply for that instead.",
    cost: "A low fee per application (the UK has changed the amount — check the official site for the current price).",
    validity: "Typically valid for 2 years for multiple trips, or until your passport expires.",
    howToApply: "Through the official 'UK ETA' app or the GOV.UK website. Apply before you book travel where possible.",
    officialName: "UK Government — Electronic Travel Authorisation",
    officialUrl: "https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta",
    reviewed: REVIEWED,
  },
  {
    slug: "esta",
    name: "US ESTA",
    scheme: "Electronic System for Travel Authorization",
    status: "live",
    statusNote: "Live and long-established for Visa Waiver Program travellers.",
    summary: "ESTA is the US online authorisation for citizens of Visa Waiver Program countries flying to the United States.",
    whatItIs: "An online authorisation for short visits (up to 90 days) under the Visa Waiver Program. It is not a visa; it pre-screens travellers before they board. Approval doesn't guarantee entry — that's decided at the US border.",
    whoNeeds: "Citizens of Visa Waiver Program countries arriving by air or sea. Everyone else needs a US visa (and note: there's no visa-free airport transit in the US).",
    cost: "A fee per application (about US$21 at the last review — confirm the current amount on the official site).",
    validity: "Generally 2 years for multiple trips, or until your passport expires.",
    howToApply: "Only on the official US Customs and Border Protection ESTA website — beware of look-alike paid third-party sites.",
    officialName: "U.S. CBP — Official ESTA",
    officialUrl: "https://esta.cbp.dhs.gov/",
    reviewed: REVIEWED,
  },
  {
    slug: "canada-eta",
    name: "Canada eTA",
    scheme: "Electronic Travel Authorization (Canada)",
    status: "live",
    statusNote: "Live and long-established for visa-exempt air travellers.",
    summary: "Canada's eTA is an online authorisation required for visa-exempt foreign nationals flying to or through Canada.",
    whatItIs: "An Electronic Travel Authorization linked to your passport, required for visa-exempt foreign nationals arriving by air. It is not a visa. US citizens are exempt.",
    whoNeeds: "Visa-exempt foreign nationals flying to or transiting through Canada. Travellers who need a Canadian visa apply for that instead.",
    cost: "CAD 7 per application (confirm on the official site).",
    validity: "Up to 5 years, or until your passport expires.",
    howToApply: "Only on the official Government of Canada (IRCC) website — avoid third-party sites that charge extra.",
    officialName: "Government of Canada — eTA",
    officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",
    reviewed: REVIEWED,
  },
  {
    slug: "australia-eta",
    name: "Australia ETA",
    scheme: "Electronic Travel Authority (subclass 601)",
    status: "live",
    statusNote: "Live for eligible passport holders.",
    summary: "Australia's ETA is an online authority for eligible passport holders visiting for tourism or business.",
    whatItIs: "An Electronic Travel Authority (subclass 601) linked to your passport for short visits. Eligibility depends on which passport you hold.",
    whoNeeds: "Holders of eligible passports (a specific list). Other nationalities apply for a visitor visa instead.",
    cost: "The ETA is free, but there's a service charge (around AUD 20) when you apply through the app — confirm on the official site.",
    validity: "Usually 12 months, with multiple stays of up to 3 months each.",
    howToApply: "Through the official 'Australian ETA' app.",
    officialName: "Australian Department of Home Affairs — ETA (601)",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601",
    reviewed: REVIEWED,
  },
];

export function getTravelAuth(slug: string): TravelAuth | undefined {
  return TRAVEL_AUTHS.find((a) => a.slug === slug.toLowerCase());
}
