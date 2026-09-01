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
};

export function getPairNote(passport: string, destination: string): PairNote | undefined {
  return PAIR_NOTES[`${passport.toUpperCase()}-${destination.toUpperCase()}`];
}
