// Verified, pair-specific guidance for individual passport→destination routes.
//
// Everything else on a pair page is derived: the requirement comes from the
// dataset, the entry rules and document checklist come from the destination. That
// leaves the questions a traveller actually asks — "there is no embassy in my
// country, so where do I apply?", "does the online authorisation cover *my*
// nationality?" — unanswered, because they depend on the specific combination.
//
// Entries here are researched against primary government sources and are the only
// content on the page written for one route. Keyed `${passport}-${destination}`.
// Keep this small and sourced; an unsourced note is worse than no note.

export interface PairNote {
  /** Short headline shown above the detail, e.g. "Nepal is on Argentina's AVE list". */
  headline: string;
  /** Paragraphs of pair-specific guidance. Plain text; escaped at render time. */
  detail: string[];
  /** Where a citizen of this country actually lodges the application. */
  applyAt?: {
    mission: string;
    address?: string;
    email?: string;
    url: string;
  };
  /** ISO date this route was last checked against official sources. */
  reviewed: string;
}

const PAIR_NOTES: Record<string, PairNote> = {
  // Nepal → Argentina. Sources: Dirección Nacional de Migraciones "Régimen de
  // Visas" nationality table and its AVE page (migraciones.gob.ar/ave/), the
  // Cancillería tourist-visa page, and the Argentine Embassy in New Delhi
  // (eindi.cancilleria.gob.ar), which holds consular jurisdiction over Nepal.
  "NP-AR": {
    headline: "Nepal is on Argentina's AVE list — but only if you hold a US visa",
    detail: [
      "Nepal appears as HABILITADO in the \"AVE Global Turista\" column of Argentina's official visa table, which means Nepali citizens may use the online Autorización de Viaje Electrónica instead of applying for a consular visa. The catch is that the AVE is not an open travel authorisation: you must already hold a valid US visa in category B2, J, B1, O, P, E or H-1B. Without one, the consular visa is your only route.",
      "Nepali citizens do not qualify for Argentina's newer waiver that lets travellers enter on a US visa alone with no AVE at all. That concession is limited to nationals of China, India and the Dominican Republic, and its extension to US green-card holders from January 2026 covers those same three nationalities. A general Argentine government page states that anyone with a valid US visa or green card may enter for 90 days without a visa — read literally that is wrong for Nepal, and the per-nationality table is the one that governs.",
      "There is no Schengen-visa route and no third-country-residence route to Argentina for Nepali passport holders.",
    ],
    applyAt: {
      mission: "Embassy of the Argentine Republic in India, New Delhi (holds consular jurisdiction over Nepal)",
      address: "F-3/3 Vasant Vihar, New Delhi 110057, India",
      email: "visas_eindi@mrecic.gov.ar",
      url: "https://eindi.cancilleria.gob.ar/en",
    },
    reviewed: "2026-09-01",
  },

  // Morocco → Mexico. Source: Mexico's Foreign Ministry consular network
  // (consulmex.sre.gob.mx), which states the US-visa exemption in identical terms
  // across posts: "todos los visitantes extranjeros, independientemente de su
  // nacionalidad ... están exentos de visa mexicana siempre y cuando cuenten con
  // visa vigente expedida por el gobierno de los Estados Unidos de América."
  "MA-MX": {
    headline: "A valid US visa lets Moroccans skip the Mexican visa entirely",
    detail: [
      "Mexico exempts any foreign national — whatever their nationality — from needing a Mexican visa if they hold a valid visa issued by the United States. The same exemption applies if you hold a valid Canadian, Japanese, UK or Schengen visa, or permanent residence in the US, Canada, Japan, the UK or any Schengen country. For Moroccan travellers this is usually far quicker than applying to a Mexican consulate.",
      "The exemption is for tourism, business or transit, and it still requires a passport valid for your stay. Mexico sets no minimum passport validity beyond that. A US visa in an old or expired passport is generally accepted as long as the visa itself is still valid, but carry both documents.",
      "Without one of those visas or residences, you need a Mexican visitor visa without permission to carry out paid activities, applied for by appointment at a Mexican consulate.",
    ],
    reviewed: "2026-09-01",
  },

  // Qatar → Czech Republic. Sources: the European Commission's 2022 proposal to
  // lift the Schengen visa requirement for Qatar and Kuwait, subsequent European
  // Parliament approval, and the Czech Embassy in Doha, which routes Schengen
  // applications through VFS Global.
  "QA-CZ": {
    headline: "Qatar's EU visa waiver is agreed but not yet in force",
    detail: [
      "The European Commission proposed lifting the Schengen visa requirement for Qatari nationals, and the European Parliament has approved it — but the agreement still has to be concluded and brought into force, so a Schengen visa is required today. Qatar is the only passport whose holders travel visa-free to both the United States and Canada while still needing a visa for the Schengen area.",
      "Because the Czech Republic is in the Schengen area, the visa you apply for is a uniform Schengen visa, valid across all Schengen states. Apply through the country you will spend most time in, or your first point of entry if the stay is evenly split.",
      "When the waiver does take effect, Qatari travellers will not become requirement-free: visa-exempt visitors need an ETIAS travel authorisation instead. Check the current status before you book.",
    ],
    applyAt: {
      mission: "Embassy of the Czech Republic in Doha — Schengen visa applications are submitted through the VFS Global visa centre in Doha, not at the embassy",
      url: "https://mzv.gov.cz/doha/en/visa_and_consular/visa/appointment_booking/index.html",
    },
    reviewed: "2026-09-01",
  },

  // India → Nepal. Sources: Article 7 of the 1950 India–Nepal Treaty of Peace and
  // Friendship, Nepal's Department of Immigration / Nepal Tourism Board ("Travelers
  // of Indian nationality do not need visa to enter Nepal"), and the Embassy of
  // India in Kathmandu's list of valid travel documents.
  "IN-NP": {
    headline: "No visa — but only a passport or original voter ID gets you on the plane",
    detail: [
      "Indian citizens need no visa for Nepal in any category — tourism, business, study, pilgrimage or work — under Article 7 of the 1950 Treaty of Peace and Friendship, which provides for free movement between the two countries. There is no entry fee and no stay limit of the kind other nationalities face.",
      "Documents are where people get caught. The Embassy of India in Kathmandu recognises only two documents for Indian nationals flying between India and Nepal: a valid Indian passport, or an original voter ID (EPIC) issued by the Election Commission of India. Aadhaar, PAN cards and driving licences are not accepted, and neither is the Embassy's own Certificate of Registration.",
      "Airlines apply extra rules for young travellers: children under 3 typically need an original birth certificate showing date of birth and parents' names, and under-18s travelling with a parent or guardian are usually accepted on an original school ID or school letter bearing a photo and the principal's stamp. An unaccompanied minor should carry a passport.",
      "Land crossings are more relaxed in practice than air travel, but carrying a passport avoids arguments at check-in and at the border.",
    ],
    reviewed: "2026-09-01",
  },
};

export function getPairNote(passport: string, destination: string): PairNote | undefined {
  return PAIR_NOTES[`${passport.toUpperCase()}-${destination.toUpperCase()}`];
}
