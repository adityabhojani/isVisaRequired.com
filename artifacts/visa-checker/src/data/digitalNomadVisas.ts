// Re-export of the canonical dataset, which lives in the API server because the
// server-rendered /digital-nomad-visas pages are the primary consumer — those are
// what Google indexes. This file keeps the `@/data/digitalNomadVisas` import path
// working for the interactive page so there is only ever one copy of the data.
export type { DigitalNomadVisa } from "../../../api-server/src/data/digitalNomadVisas";
export { digitalNomadVisas, NOMAD_REGIONS } from "../../../api-server/src/data/digitalNomadVisas";
