// Moved to @workspace/travel-data so the server-rendered /digital-nomad page and
// this React page share one copy of the data. Re-exported here so existing
// "@/data/digitalNomadVisas" imports keep working.
export type { DigitalNomadVisa } from "@workspace/travel-data";
export { digitalNomadVisas, NOMAD_REGIONS } from "@workspace/travel-data";
