// Transit-visa guides for the world's major transit hubs.
//
// IMPORTANT — accuracy policy: these describe the well-established, stable
// transit *schemes* for each hub (airside vs landside, named programmes) and
// always point to the official source for nationality-specific detail. We do NOT
// assert per-nationality rulings here. Each entry carries a `reviewed` date.

export interface TransitGuide {
  slug: string;
  name: string;
  /** One-line summary used in meta description + hub list. */
  summary: string;
  /** Does staying airside (not passing immigration) generally need a visa? */
  airside: string;
  /** Leaving the airport during a layover. */
  landside: string;
  /** Notable schemes / bullet facts (stable, well-established). */
  schemes: string[];
  officialName: string;
  officialUrl: string;
  reviewed: string; // ISO date
}

const REVIEWED = "2026-06-01";

export const TRANSIT_GUIDES: TransitGuide[] = [
  {
    slug: "united-states",
    name: "United States",
    summary: "The US has no international transit zone — every traveler clears immigration, so a transit (C-1) visa or ESTA/visa is required.",
    airside: "Not available. The United States has no sterile international transit area: every passenger connecting through a US airport must clear US immigration and customs, even to change planes.",
    landside: "Same as airside — you have already entered the inspection process, so you need the same authorization as a visitor.",
    schemes: [
      "Because there is no airside transit, you need either an ESTA (if you're from a Visa Waiver Program country), a B-1/B-2 visitor visa, or a dedicated C-1 transit visa.",
      "A C-1 transit visa is for travelers passing through the US to another country.",
      "Allow extra connection time — you must collect and re-check baggage and pass security again.",
    ],
    officialName: "U.S. Department of State — Transit (C) visas",
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas/other-visa-categories/transit-crew-visa.html",
    reviewed: REVIEWED,
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    summary: "Some nationalities need a Direct Airside Transit Visa (DATV) even without passing immigration; leaving the airport may need a Visitor in Transit visa.",
    airside: "Depends on nationality. Many travelers can transit airside without a visa, but nationals of a specific list of countries need a Direct Airside Transit Visa (DATV) even if they never pass through UK immigration.",
    landside: "To pass through UK border control during a layover (e.g. to change airports or stay overnight landside) you generally need a Visitor in Transit visa, unless you're visa-exempt or hold certain qualifying documents.",
    schemes: [
      "Direct Airside Transit Visa (DATV): for transiting without going through immigration — required for certain nationalities.",
      "Visitor in Transit visa: for passing through the UK border within 48 hours en route to another country.",
      "Holders of certain US, Canadian, EEA, Australian and other documents may qualify for transit exemptions — check the official tool.",
      "The UK ETA does not cover all transit cases — verify before you book.",
    ],
    officialName: "UK Government — Transit visas",
    officialUrl: "https://www.gov.uk/transit-visa",
    reviewed: REVIEWED,
  },
  {
    slug: "schengen-area",
    name: "Schengen Area",
    summary: "Most can transit airside visa-free, but nationals of a specific list need an Airport Transit Visa (ATV). Leaving the airport needs a Schengen visa unless exempt.",
    airside: "Usually visa-free, with an exception: nationals of a specific list of countries require an Airport Transit Visa (ATV) to pass through the international zone of a Schengen airport, even without entering the Schengen Area.",
    landside: "To leave the airport during a layover you must formally enter the Schengen Area, which requires a Schengen visa (or visa-free entry / ETIAS once live) according to your nationality.",
    schemes: [
      "Airport Transit Visa (ATV / type A): required for a fixed list of nationalities; individual Schengen states may add more countries to their own list.",
      "Holders of valid visas/residence permits from certain countries (e.g. US, Canada, Ireland, Japan) are often exempt from the ATV — confirm on the official source.",
      "Connecting between two non-Schengen flights at the same airport without leaving the international zone is what the ATV covers.",
      "ETIAS (the EU travel authorization) is separate from transit rules — check both.",
    ],
    officialName: "European Commission — Airport transit visa",
    officialUrl: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en",
    reviewed: REVIEWED,
  },
  {
    slug: "china",
    name: "China (mainland)",
    summary: "China offers 24-hour visa-free transit nationwide, and 72/144-hour visa-free transit in many cities for ~54 nationalities with an onward ticket.",
    airside: "If you stay in the international transit area and don't clear immigration, you generally don't need a visa. To leave the secure area you use one of the transit schemes below.",
    landside: "China runs generous visa-free transit programmes that let eligible travelers leave the airport during a layover.",
    schemes: [
      "24-hour visa-free transit: available nationwide to most nationalities, with an onward ticket to a third country/region.",
      "72-hour and 144-hour visa-free transit: available at many major cities and provinces for citizens of around 54 countries, travelling between two different countries/regions.",
      "You must arrive and depart from eligible ports and have a confirmed onward ticket within the time window.",
      "Hong Kong and Macao have separate entry rules from mainland China.",
    ],
    officialName: "China National Immigration Administration",
    officialUrl: "https://en.nia.gov.cn/",
    reviewed: REVIEWED,
  },
  {
    slug: "united-arab-emirates",
    name: "United Arab Emirates (Dubai / Abu Dhabi)",
    summary: "Airside transit is visa-free; to leave the airport, many nationalities are visa-free or can get a 48-hour/96-hour transit visa (often airline-sponsored).",
    airside: "Connecting airside through Dubai or Abu Dhabi without entering the UAE generally does not require a visa.",
    landside: "To leave the airport you must enter the UAE — many nationalities get visa-free entry or visa on arrival; others can apply for a 48-hour or 96-hour transit visa, usually sponsored by the airline.",
    schemes: [
      "48-hour transit visa: typically free; 96-hour transit visa: low fee — usually arranged through the airline (e.g. Emirates, Etihad).",
      "Many nationalities already qualify for visa-free entry or visa on arrival, removing the need for a transit visa.",
      "A confirmed onward ticket is required.",
    ],
    officialName: "UAE Government — visa & transit information",
    officialUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id/visa-on-arrival",
    reviewed: REVIEWED,
  },
  {
    slug: "qatar",
    name: "Qatar (Doha)",
    summary: "Airside transit is visa-free; a free transit visa (up to 96 hours) is available, and many nationalities get visa-free entry to leave the airport.",
    airside: "Connecting airside through Hamad International Airport without entering Qatar does not require a visa.",
    landside: "To leave the airport during a layover, many nationalities get visa-free entry; others can apply for a free transit visa valid up to 96 hours.",
    schemes: [
      "Transit visa: free, valid up to 96 hours, can be arranged via Qatar Airways / Discover Qatar.",
      "Visa-free entry is available to a wide list of nationalities.",
      "A confirmed onward ticket is required.",
    ],
    officialName: "Qatar — Hamad International / Discover Qatar",
    officialUrl: "https://www.visitqatar.com/intl-en/plan-trip/visas",
    reviewed: REVIEWED,
  },
  {
    slug: "turkey",
    name: "Türkiye (Istanbul)",
    summary: "Airside transit is visa-free; to leave the airport you need entry permission (e-Visa or visa-free) according to your nationality.",
    airside: "Connecting airside through Istanbul without passing immigration generally does not require a transit visa.",
    landside: "To leave the airport you must enter Türkiye — depending on nationality this is visa-free, an e-Visa, or a sticker visa.",
    schemes: [
      "Türkiye e-Visa: available online for many nationalities if you want to leave the airport during a long layover.",
      "TourIstanbul: Turkish Airlines offers free guided city tours for eligible long-layover passengers.",
      "A confirmed onward ticket is required.",
    ],
    officialName: "Republic of Türkiye — e-Visa",
    officialUrl: "https://www.evisa.gov.tr/en/",
    reviewed: REVIEWED,
  },
  {
    slug: "singapore",
    name: "Singapore",
    summary: "Airside transit is visa-free; some nationalities qualify for a Visa Free Transit Facility to leave the airport for up to 96 hours.",
    airside: "Connecting airside through Changi Airport without clearing immigration generally does not require a visa.",
    landside: "To leave the airport, many nationalities enter visa-free; some visa-required nationalities qualify for the Visa Free Transit Facility (VFTF) for up to 96 hours under specific conditions.",
    schemes: [
      "Visa Free Transit Facility (VFTF): up to 96 hours for eligible nationalities meeting route and document conditions.",
      "Many nationalities already enter Singapore visa-free.",
      "An onward ticket and onward travel documents are required.",
    ],
    officialName: "Singapore Immigration & Checkpoints Authority (ICA)",
    officialUrl: "https://www.ica.gov.sg/enter-transit-depart/transiting",
    reviewed: REVIEWED,
  },
  {
    slug: "canada",
    name: "Canada",
    summary: "Most travelers need an eTA or visa to transit Canadian airports; specific nationalities/flights qualify for the Transit Without Visa programme.",
    airside: "Canada generally requires an eTA (for visa-exempt air travelers) or a transit/visitor visa even to connect through a Canadian airport, because there is no separate sterile transit zone for most cases.",
    landside: "Leaving the airport requires the same authorization as a visitor (eTA or visa).",
    schemes: [
      "eTA: required for visa-exempt foreign nationals flying through or to Canada.",
      "Transit Without Visa (TWOV) and the China/Philippines Transit Programme: allow certain nationals on specific airlines/routes (mainly via Vancouver, Toronto) to transit without a Canadian visa.",
      "US-bound or US-origin connections may have specific rules — check the official source.",
    ],
    officialName: "Government of Canada — Transit through Canada",
    officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/transit.html",
    reviewed: REVIEWED,
  },
  {
    slug: "australia",
    name: "Australia",
    summary: "Australia requires a Transit visa (subclass 771) or other valid visa for most travelers; some passport holders qualify for transit without a visa.",
    airside: "Most travelers need a visa to transit, but eligible passport holders meeting strict conditions can transit without a visa for up to 8 hours without leaving the transit lounge.",
    landside: "To clear immigration you need a Transit visa (subclass 771) or another valid Australian visa.",
    schemes: [
      "Transit visa (subclass 771): free, for passing through Australia within 72 hours.",
      "Transit Without a Visa (TWOV): for eligible passport holders, within 8 hours, staying airside, with onward bookings.",
      "Confirmed onward travel within the time limit is required.",
    ],
    officialName: "Australian Department of Home Affairs — Transit visa",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/transit-771",
    reviewed: REVIEWED,
  },
  {
    slug: "japan",
    name: "Japan",
    summary: "Airside transit is visa-free; to leave the airport you need entry permission (visa-free or visa) by nationality. A short-stay transit landing permit may apply.",
    airside: "Connecting airside through a Japanese airport without entering Japan generally does not require a transit visa.",
    landside: "To leave the airport you must enter Japan — many nationalities are visa-free for short stays; others need a visa.",
    schemes: [
      "Shore pass / transit landing permit: short permits that may be granted to transit passengers at the immigration officer's discretion.",
      "Many nationalities enjoy visa-free short-stay entry if they wish to leave the airport.",
      "An onward ticket is required.",
    ],
    officialName: "Japan Ministry of Foreign Affairs — Visa",
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    reviewed: REVIEWED,
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    summary: "Airside transit is visa-free for most; many nationalities also enjoy visa-free entry to leave the airport for short layovers.",
    airside: "Connecting airside through Hong Kong International Airport generally does not require a visa.",
    landside: "Many nationalities can enter Hong Kong visa-free for short stays; some require a visa or entry permit.",
    schemes: [
      "Hong Kong has its own immigration system, separate from mainland China.",
      "Visa-free access for short visits applies to a wide range of nationalities.",
      "An onward ticket may be requested.",
    ],
    officialName: "Hong Kong Immigration Department",
    officialUrl: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html",
    reviewed: REVIEWED,
  },
];

export function getTransitGuide(slug: string): TransitGuide | undefined {
  return TRANSIT_GUIDES.find((g) => g.slug === slug.toLowerCase());
}
