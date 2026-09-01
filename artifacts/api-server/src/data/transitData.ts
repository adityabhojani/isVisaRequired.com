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
      "There is no such thing as a quick airside connection here: an ESTA or visa is required even for a two-hour stop where you never intend to leave the terminal, because you still legally enter the United States.",
      "Expect to be asked for proof of onward travel at the border — it is one of the standard conditions officers check.",
      "Allow extra connection time — you must collect and re-check baggage and pass security again.",
    ],
    officialName: "U.S. Department of State — Transit (C) visas",
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas/other-visa-categories/transit-crew-visa.html",
    reviewed: "2026-09-01",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    summary: "Whether you need a UK ETA on a layover depends on if you cross the border: airside transit is currently exempt, but Gatwick has no airside transit route, and some nationalities need a Direct Airside Transit Visa regardless.",
    airside: "If you connect without passing through UK border control, you are currently exempt from needing an ETA — but the Home Office calls this exemption temporary and keeps it under review, so re-check close to travel. Separately, nationals on the Direct Airside Transit Visa (DATV) list need a DATV even though they never formally enter the UK.",
    landside: "If your connection takes you through UK border control — changing airports, collecting and re-checking bags, or staying overnight landside — you need an ETA (if you are ETA-eligible) or a Visitor in Transit visa, depending on your nationality.",
    schemes: [
      "Airside transit (no border control): currently ETA-exempt. Treat this as provisional — the exemption is temporary and under review.",
      "Gatwick is the trap: it has no international airside transit facility, so every connecting passenger passes UK border control regardless of ticket or baggage — which means ETA-eligible nationalities DO need an ETA to connect there. Heathrow and Manchester do offer airside transit.",
      "Direct Airside Transit Visa (DATV): required for certain nationalities even when transiting airside and never entering the UK.",
      "Visitor in Transit visa: for passing through the UK border within 48 hours en route to another country, where an ETA is not sufficient for your nationality.",
      "Holders of certain US, Canadian, EEA, Australian and other documents may qualify for transit exemptions — check the official tool.",
      "Confirm your exact routing with the airline: whether you stay airside is a property of the airport and your itinerary, not just your ticket.",
    ],
    officialName: "UK Government — Transit visas",
    officialUrl: "https://www.gov.uk/transit-visa",
    // Re-verified separately (ETA airside-transit exemption + the Gatwick
    // exception), so this is newer than the shared REVIEWED constant.
    reviewed: "2026-08-31",
  },
  {
    slug: "schengen-area",
    name: "Schengen Area",
    summary: "Most can transit airside visa-free, but nationals of a specific list need an Airport Transit Visa (ATV). Leaving the airport needs a Schengen visa unless exempt.",
    airside: "Usually visa-free, with an exception: nationals of a specific list of countries require an Airport Transit Visa (ATV) to pass through the international zone of a Schengen airport, even without entering the Schengen Area.",
    landside: "To leave the airport during a layover you must formally enter the Schengen Area, which requires a Schengen visa (or visa-free entry / ETIAS once live) according to your nationality.",
    schemes: [
      "Airport Transit Visa (ATV / type A): required for a fixed EU-wide list — Afghanistan, Bangladesh, DR Congo, Eritrea, Ethiopia, Ghana, Iran, Iraq, Nigeria, Pakistan, Somalia and Sri Lanka (Burundi joins from 1 August 2026). Individual Schengen states may add further nationalities to their own lists, so check the country you connect in.",
      "Holders of valid visas/residence permits from certain countries (e.g. US, Canada, Ireland, Japan) are often exempt from the ATV — confirm on the official source.",
      "Connecting between two non-Schengen flights at the same airport without leaving the international zone is what the ATV covers.",
      "ETIAS (the EU travel authorization) is separate from transit rules — check both.",
    ],
    officialName: "European Commission — Airport transit visa",
    officialUrl: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en",
    reviewed: "2026-09-01",
  },
  {
    slug: "china",
    name: "China (mainland)",
    summary: "China offers 24-hour visa-free transit nationwide, plus a 240-hour (10-day) visa-free transit for around 55 nationalities at 60+ ports — the scheme that replaced the old 72/144-hour rules.",
    airside: "If you stay in the international transit area and don't clear immigration, you generally don't need a visa. To leave the secure area you use one of the transit schemes below.",
    landside: "China runs generous visa-free transit programmes that let eligible travelers leave the airport during a layover.",
    schemes: [
      "24-hour visa-free transit: available nationwide to most nationalities, with an onward ticket to a third country/region.",
      "240-hour (10-day) visa-free transit: this REPLACED the older 72-hour and 144-hour schemes. It is open to citizens of roughly 55 countries at 60+ ports of entry, and now lets you move around some two dozen provinces rather than staying in one city.",
      "It is genuinely a transit scheme, not a tourist entry: you must be travelling between two different countries or regions, and hold a confirmed onward ticket to that third country within the time window.",
      "You must also arrive and depart through ports that are approved for the scheme — check the current port list before booking, as it has been expanded several times.",
      "Hong Kong and Macao have separate entry rules from mainland China.",
    ],
    officialName: "China National Immigration Administration",
    officialUrl: "https://en.nia.gov.cn/",
    // Re-verified separately: the 72/144-hour scheme this guide used to describe
    // was superseded by the 240-hour policy, so this entry is newer than the
    // shared REVIEWED date used by the guides that were not re-checked.
    reviewed: "2026-08-31",
  },
  {
    slug: "united-arab-emirates",
    name: "United Arab Emirates (Dubai / Abu Dhabi)",
    summary: "Airside transit is visa-free; to leave the airport, many nationalities are visa-free or can get a 48-hour/96-hour transit visa (often airline-sponsored).",
    airside: "Connecting airside through Dubai or Abu Dhabi without entering the UAE generally does not require a visa.",
    landside: "To leave the airport you must enter the UAE — many nationalities get visa-free entry or visa on arrival; others can apply for a 48-hour or 96-hour transit visa, usually sponsored by the airline.",
    schemes: [
      "48-hour transit visa: issued free of government charge (AED 0). The 96-hour version is NOT free — expect roughly AED 220–550 depending on how it is issued, so check the price before assuming a longer layover costs nothing.",
      "Both are applied for through a UAE-based airline (Emirates, Etihad, flydubai), which submits it to the federal authority — you cannot apply directly as an individual. Allow 24–72 hours for processing.",
      "Many nationalities already qualify for visa-free entry or visa on arrival, removing the need for a transit visa.",
      "A confirmed onward ticket is required.",
    ],
    officialName: "UAE Government — visa & transit information",
    officialUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id/visa-on-arrival",
    reviewed: "2026-08-31",
  },
  {
    slug: "qatar",
    name: "Qatar (Doha)",
    summary: "Airside transit is visa-free; a free transit visa (up to 96 hours) is available, and many nationalities get visa-free entry to leave the airport.",
    airside: "Connecting airside through Hamad International Airport without entering Qatar does not require a visa.",
    landside: "To leave the airport during a layover, many nationalities get visa-free entry; others can apply for a free transit visa valid up to 96 hours.",
    schemes: [
      "Transit visa: free of charge and valid up to 96 hours — but it is tied to the airline: both your inbound and onward flights normally have to be on Qatar Airways.",
      "Apply online in advance (Hayya portal / Discover Qatar), typically 7–90 days before arrival, or at the transit desk on arrival at Hamad International. Layover length conditions apply — commonly more than 5 hours when applying ahead, or 8+ hours at the airport.",
      "The visa itself is free; a Discover Qatar stopover or tour package is a separate paid product and carries its own processing fee.",
      "Visa-free entry is available to a wide list of nationalities.",
      "A confirmed onward ticket is required.",
    ],
    officialName: "Qatar — Hamad International / Discover Qatar",
    officialUrl: "https://www.visitqatar.com/intl-en/plan-trip/visas",
    reviewed: "2026-08-31",
  },
  {
    slug: "turkey",
    name: "Türkiye (Istanbul)",
    summary: "Airside transit is visa-free; to leave the airport you need entry permission (e-Visa or visa-free) according to your nationality.",
    airside: "Connecting airside through Istanbul without passing immigration generally does not require a transit visa.",
    landside: "To leave the airport you must enter Türkiye — depending on nationality this is visa-free, an e-Visa, or a sticker visa.",
    schemes: [
      "Türkiye e-Visa: available online for many nationalities if you want to leave the airport during a long layover.",
      "Touristanbul: Turkish Airlines runs free guided Istanbul tours (transport, and usually a meal, included) for passengers with a 6–24 hour layover on a Turkish Airlines international-to-international connection booked on one reservation.",
      "You do not book Touristanbul online — eligible passengers register in person at the Touristanbul desks at Istanbul Airport. You still need permission to enter Türkiye (e-Visa or visa-free) to join the tour.",
      "A confirmed onward ticket is required.",
    ],
    officialName: "Republic of Türkiye — e-Visa",
    officialUrl: "https://www.evisa.gov.tr/en/",
    reviewed: "2026-09-01",
  },
  {
    slug: "singapore",
    name: "Singapore",
    summary: "Airside transit is visa-free; some nationalities qualify for a Visa Free Transit Facility to leave the airport for up to 96 hours.",
    airside: "Connecting airside through Changi Airport without clearing immigration generally does not require a visa.",
    landside: "To leave the airport, many nationalities enter visa-free; some visa-required nationalities qualify for the Visa Free Transit Facility (VFTF) for up to 96 hours under specific conditions.",
    schemes: [
      "Visa Free Transit Facility (VFTF): up to 96 hours, but it is narrower than it sounds. It is aimed at nationals of the CIS states (Armenia, Azerbaijan, Belarus, Kazakhstan, Kyrgyzstan, Moldova, Russia, Tajikistan, Uzbekistan), Georgia, India, Turkmenistan, Ukraine, and certain PRC passport holders.",
      "The condition most people miss: you must already hold a valid visa or long-term pass for Australia, Canada, Germany, Japan, New Zealand, Switzerland, the UK or the USA, valid for at least one month from your entry into Singapore. Without one of those, the facility does not apply.",
      "You may arrive by any mode of transport but must depart by air or sea within 96 hours, and extensions are not permitted. Final approval is always made by the ICA officer at the checkpoint.",
      "Many nationalities already enter Singapore visa-free.",
      "An onward ticket and onward travel documents are required.",
    ],
    officialName: "Singapore Immigration & Checkpoints Authority (ICA)",
    officialUrl: "https://www.ica.gov.sg/enter-transit-depart/transiting",
    reviewed: "2026-08-31",
  },
  {
    slug: "canada",
    name: "Canada",
    summary: "Most travelers need an eTA or visa to transit Canadian airports; specific nationalities/flights qualify for the Transit Without Visa programme.",
    airside: "Canada generally requires an eTA (for visa-exempt air travelers) or a transit/visitor visa even to connect through a Canadian airport, because there is no separate sterile transit zone for most cases.",
    landside: "Leaving the airport requires the same authorization as a visitor (eTA or visa).",
    schemes: [
      "eTA: required for visa-exempt foreign nationals flying through or to Canada.",
      "Transit Without Visa (TWOV) / China Transit Programme: lets certain nationals skip the Canadian transit visa on US-connected itineraries — but the gate most people miss is that you must hold a valid US VISA. A US ESTA is not accepted.",
      "It only works on approved airlines and at four airports: Toronto Pearson (Terminal 1 only), Vancouver, Calgary and Winnipeg — and the transit must be completed within 48 hours.",
      "Your airline verifies eligibility before it lets you board the first flight, so confirm with the airline rather than assuming you qualify at check-in.",
    ],
    officialName: "Government of Canada — Transit through Canada",
    officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/transit.html",
    reviewed: "2026-09-01",
  },
  {
    slug: "australia",
    name: "Australia",
    summary: "Australia requires a Transit visa (subclass 771) or other valid visa for most travelers; some passport holders qualify for transit without a visa.",
    airside: "Most travelers need a visa to transit, but eligible passport holders meeting strict conditions can transit without a visa for up to 8 hours without leaving the transit lounge.",
    landside: "To clear immigration you need a Transit visa (subclass 771) or another valid Australian visa.",
    schemes: [
      "Transit visa (subclass 771): free of charge, covers up to 72 hours, and — the practical difference — it lets you leave the airport during the layover.",
      "Transit Without a Visa (TWOV): for eligible passport holders with a layover under 8 hours who arrive and depart by air and stay airside. You cannot leave the transit area on TWOV; if you want to, you need the 771.",
      "Confirmed onward travel within the time limit is required.",
    ],
    officialName: "Australian Department of Home Affairs — Transit visa",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/transit-771",
    reviewed: "2026-09-01",
  },
  {
    slug: "japan",
    name: "Japan",
    summary: "Airside transit is visa-free; to leave the airport you need entry permission (visa-free or visa) by nationality. A short-stay transit landing permit may apply.",
    airside: "Connecting airside through a Japanese airport without entering Japan generally does not require a transit visa.",
    landside: "To leave the airport you must enter Japan — many nationalities are visa-free for short stays; others need a visa.",
    schemes: [
      "Shore pass / transit landing permit: lets some transit passengers leave the airport for up to 72 hours, provided they hold an onward international ticket departing within that window and the documents for their final destination.",
      "You cannot apply for it in advance — it is assessed and granted at the airport, at the immigration officer's discretion, so never build a layover plan that depends on getting one.",
      "Many nationalities enjoy visa-free short-stay entry if they wish to leave the airport.",
      "An onward ticket is required.",
    ],
    officialName: "Japan Ministry of Foreign Affairs — Visa",
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    reviewed: "2026-09-01",
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    summary: "Airside transit is visa-free for most; many nationalities also enjoy visa-free entry to leave the airport for short layovers.",
    airside: "Connecting airside through Hong Kong International Airport generally does not require a visa.",
    landside: "Many nationalities can enter Hong Kong visa-free for short stays; some require a visa or entry permit.",
    schemes: [
      "Hong Kong has its own immigration system, separate from mainland China.",
      "Visa-free access for short visits applies to a wide range of nationalities, and the allowances are generous — commonly 90 days for US, EU, Australian, Canadian, Japanese and South Korean visitors, and up to 180 days on a UK passport.",
      "The trap: entering Hong Kong does NOT let you cross into mainland China. A day trip to Shenzhen needs a Chinese visa or a mainland scheme such as the 240-hour transit — and for China's purposes Hong Kong counts as a separate region.",
      "An onward ticket may be requested.",
    ],
    officialName: "Hong Kong Immigration Department",
    officialUrl: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html",
    reviewed: "2026-09-01",
  },
];

export function getTransitGuide(slug: string): TransitGuide | undefined {
  return TRANSIT_GUIDES.find((g) => g.slug === slug.toLowerCase());
}
