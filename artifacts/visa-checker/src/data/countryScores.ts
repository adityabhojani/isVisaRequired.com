/**
 * Country enrichment scores for destination pages.
 * Safety Index: 0–100 (higher = safer). Source: Numbeo 2025 / Global Peace Index.
 * Cost of Living Index: 0–200 (lower = cheaper). Relative to NYC = 100.
 * Internet Speed Index: Mbps average download. Source: Speedtest Global Index 2025.
 * Climate: brief descriptor.
 */
export interface CountryScore {
  safetyIndex: number;       // 0–100 higher = safer
  costOfLivingIndex: number; // 0–200 lower = cheaper (NYC ~100)
  internetSpeedMbps: number; // avg download Mbps
  climate: string;
  nomadScore: number;        // 0–100 composite score for digital nomads
  livabilityScore?: number;  // 0–100 overall livability
  healthcareScore?: number;  // 0–100 healthcare quality
  bestTimeToVisit?: string;  // e.g. "Apr–Oct"
  weatherSummary?: string;   // 1-line description
}

export const countryScores: Record<string, CountryScore> = {
  AD: { safetyIndex: 84, costOfLivingIndex: 62, internetSpeedMbps: 110, climate: "Mountain / Mediterranean", nomadScore: 73 },
  AE: { safetyIndex: 84, costOfLivingIndex: 78, internetSpeedMbps: 100, climate: "Desert / Hot", nomadScore: 88 },
  AF: { safetyIndex: 10, costOfLivingIndex: 15, internetSpeedMbps: 8, climate: "Continental / Arid", nomadScore: 5 },
  AG: { safetyIndex: 54, costOfLivingIndex: 72, internetSpeedMbps: 40, climate: "Tropical Caribbean", nomadScore: 65 },
  AL: { safetyIndex: 58, costOfLivingIndex: 28, internetSpeedMbps: 55, climate: "Mediterranean", nomadScore: 62 },
  AM: { safetyIndex: 62, costOfLivingIndex: 32, internetSpeedMbps: 45, climate: "Continental / Highland", nomadScore: 68 },
  AO: { safetyIndex: 35, costOfLivingIndex: 60, internetSpeedMbps: 15, climate: "Tropical Savanna", nomadScore: 25 },
  AR: { safetyIndex: 44, costOfLivingIndex: 28, internetSpeedMbps: 55, climate: "Varied / Temperate", nomadScore: 72 },
  AT: { safetyIndex: 81, costOfLivingIndex: 72, internetSpeedMbps: 95, climate: "Alpine / Continental", nomadScore: 78 },
  AU: { safetyIndex: 72, costOfLivingIndex: 80, internetSpeedMbps: 85, climate: "Varied (desert to tropical)", nomadScore: 80 },
  AZ: { safetyIndex: 58, costOfLivingIndex: 33, internetSpeedMbps: 35, climate: "Semi-Arid / Continental", nomadScore: 58 },
  BA: { safetyIndex: 60, costOfLivingIndex: 30, internetSpeedMbps: 50, climate: "Continental / Mediterranean", nomadScore: 63 },
  BB: { safetyIndex: 52, costOfLivingIndex: 80, internetSpeedMbps: 42, climate: "Tropical Caribbean", nomadScore: 74 },
  BD: { safetyIndex: 42, costOfLivingIndex: 20, internetSpeedMbps: 20, climate: "Tropical Monsoon", nomadScore: 32 },
  BE: { safetyIndex: 72, costOfLivingIndex: 80, internetSpeedMbps: 115, climate: "Temperate Maritime", nomadScore: 76 },
  BF: { safetyIndex: 20, costOfLivingIndex: 22, internetSpeedMbps: 8, climate: "Hot Semi-Arid", nomadScore: 18 },
  BG: { safetyIndex: 61, costOfLivingIndex: 33, internetSpeedMbps: 160, climate: "Continental / Mediterranean", nomadScore: 73 },
  BH: { safetyIndex: 72, costOfLivingIndex: 60, internetSpeedMbps: 75, climate: "Hot Desert", nomadScore: 70 },
  BI: { safetyIndex: 28, costOfLivingIndex: 20, internetSpeedMbps: 5, climate: "Tropical Highland", nomadScore: 15 },
  BJ: { safetyIndex: 38, costOfLivingIndex: 25, internetSpeedMbps: 10, climate: "Tropical Savanna", nomadScore: 25 },
  BM: { safetyIndex: 62, costOfLivingIndex: 140, internetSpeedMbps: 60, climate: "Subtropical", nomadScore: 68 },
  BN: { safetyIndex: 68, costOfLivingIndex: 50, internetSpeedMbps: 38, climate: "Tropical Rainforest", nomadScore: 58 },
  BO: { safetyIndex: 40, costOfLivingIndex: 22, internetSpeedMbps: 18, climate: "Varied (highland to tropical)", nomadScore: 42 },
  BR: { safetyIndex: 36, costOfLivingIndex: 35, internetSpeedMbps: 50, climate: "Tropical / Subtropical", nomadScore: 68 },
  BS: { safetyIndex: 42, costOfLivingIndex: 85, internetSpeedMbps: 30, climate: "Tropical Caribbean", nomadScore: 60 },
  BT: { safetyIndex: 72, costOfLivingIndex: 28, internetSpeedMbps: 22, climate: "Mountain / Subtropical", nomadScore: 55 },
  BW: { safetyIndex: 50, costOfLivingIndex: 38, internetSpeedMbps: 20, climate: "Savanna / Semi-Arid", nomadScore: 48 },
  BY: { safetyIndex: 55, costOfLivingIndex: 25, internetSpeedMbps: 52, climate: "Continental", nomadScore: 38 },
  BZ: { safetyIndex: 38, costOfLivingIndex: 55, internetSpeedMbps: 22, climate: "Tropical", nomadScore: 58 },
  CA: { safetyIndex: 74, costOfLivingIndex: 72, internetSpeedMbps: 135, climate: "Continental / Arctic", nomadScore: 82 },
  CD: { safetyIndex: 18, costOfLivingIndex: 25, internetSpeedMbps: 5, climate: "Tropical Rainforest", nomadScore: 10 },
  CF: { safetyIndex: 12, costOfLivingIndex: 28, internetSpeedMbps: 3, climate: "Tropical Savanna", nomadScore: 5 },
  CG: { safetyIndex: 30, costOfLivingIndex: 55, internetSpeedMbps: 6, climate: "Tropical Equatorial", nomadScore: 18 },
  CH: { safetyIndex: 82, costOfLivingIndex: 120, internetSpeedMbps: 100, climate: "Alpine / Continental", nomadScore: 78 },
  CI: { safetyIndex: 36, costOfLivingIndex: 32, internetSpeedMbps: 12, climate: "Tropical", nomadScore: 35 },
  CL: { safetyIndex: 52, costOfLivingIndex: 42, internetSpeedMbps: 85, climate: "Varied (desert to arctic)", nomadScore: 70 },
  CM: { safetyIndex: 32, costOfLivingIndex: 30, internetSpeedMbps: 10, climate: "Varied Tropical", nomadScore: 25 },
  CN: { safetyIndex: 66, costOfLivingIndex: 42, internetSpeedMbps: 145, climate: "Varied (tropical to arctic)", nomadScore: 55 },
  CO: { safetyIndex: 35, costOfLivingIndex: 28, internetSpeedMbps: 48, climate: "Varied (tropical to highland)", nomadScore: 72 },
  CR: { safetyIndex: 54, costOfLivingIndex: 48, internetSpeedMbps: 55, climate: "Tropical", nomadScore: 78 },
  CU: { safetyIndex: 62, costOfLivingIndex: 18, internetSpeedMbps: 5, climate: "Tropical Caribbean", nomadScore: 22 },
  CV: { safetyIndex: 60, costOfLivingIndex: 42, internetSpeedMbps: 18, climate: "Desert / Tropical", nomadScore: 60 },
  CY: { safetyIndex: 74, costOfLivingIndex: 62, internetSpeedMbps: 82, climate: "Mediterranean", nomadScore: 76 },
  CZ: { safetyIndex: 72, costOfLivingIndex: 40, internetSpeedMbps: 105, climate: "Continental", nomadScore: 82 },
  DE: { safetyIndex: 74, costOfLivingIndex: 80, internetSpeedMbps: 100, climate: "Temperate / Continental", nomadScore: 82 },
  DJ: { safetyIndex: 38, costOfLivingIndex: 58, internetSpeedMbps: 8, climate: "Hot Desert", nomadScore: 20 },
  DK: { safetyIndex: 82, costOfLivingIndex: 108, internetSpeedMbps: 160, climate: "Temperate Maritime", nomadScore: 80 },
  DO: { safetyIndex: 40, costOfLivingIndex: 42, internetSpeedMbps: 25, climate: "Tropical Caribbean", nomadScore: 60 },
  DZ: { safetyIndex: 52, costOfLivingIndex: 28, internetSpeedMbps: 15, climate: "Desert / Mediterranean", nomadScore: 30 },
  EC: { safetyIndex: 40, costOfLivingIndex: 30, internetSpeedMbps: 35, climate: "Tropical / Highland", nomadScore: 62 },
  EE: { safetyIndex: 72, costOfLivingIndex: 45, internetSpeedMbps: 120, climate: "Temperate Continental", nomadScore: 82 },
  EG: { safetyIndex: 52, costOfLivingIndex: 22, internetSpeedMbps: 20, climate: "Desert", nomadScore: 45 },
  ER: { safetyIndex: 25, costOfLivingIndex: 18, internetSpeedMbps: 3, climate: "Hot Arid", nomadScore: 10 },
  ES: { safetyIndex: 70, costOfLivingIndex: 60, internetSpeedMbps: 130, climate: "Mediterranean / Continental", nomadScore: 86 },
  ET: { safetyIndex: 30, costOfLivingIndex: 18, internetSpeedMbps: 5, climate: "Tropical Highland", nomadScore: 18 },
  FI: { safetyIndex: 82, costOfLivingIndex: 90, internetSpeedMbps: 150, climate: "Subarctic / Continental", nomadScore: 78 },
  FJ: { safetyIndex: 52, costOfLivingIndex: 55, internetSpeedMbps: 22, climate: "Tropical Pacific", nomadScore: 62 },
  FR: { safetyIndex: 68, costOfLivingIndex: 88, internetSpeedMbps: 155, climate: "Temperate / Mediterranean", nomadScore: 78 },
  GA: { safetyIndex: 38, costOfLivingIndex: 60, internetSpeedMbps: 10, climate: "Tropical Equatorial", nomadScore: 25 },
  GB: { safetyIndex: 70, costOfLivingIndex: 88, internetSpeedMbps: 120, climate: "Temperate Maritime", nomadScore: 78 },
  GE: { safetyIndex: 68, costOfLivingIndex: 30, internetSpeedMbps: 45, climate: "Continental / Mediterranean", nomadScore: 78 },
  GH: { safetyIndex: 50, costOfLivingIndex: 30, internetSpeedMbps: 18, climate: "Tropical Savanna", nomadScore: 48 },
  GM: { safetyIndex: 48, costOfLivingIndex: 22, internetSpeedMbps: 10, climate: "Tropical Savanna", nomadScore: 35 },
  GN: { safetyIndex: 30, costOfLivingIndex: 20, internetSpeedMbps: 8, climate: "Tropical Monsoon", nomadScore: 18 },
  GQ: { safetyIndex: 35, costOfLivingIndex: 70, internetSpeedMbps: 5, climate: "Tropical", nomadScore: 15 },
  GR: { safetyIndex: 68, costOfLivingIndex: 52, internetSpeedMbps: 65, climate: "Mediterranean", nomadScore: 80 },
  GT: { safetyIndex: 32, costOfLivingIndex: 30, internetSpeedMbps: 20, climate: "Tropical", nomadScore: 42 },
  GW: { safetyIndex: 30, costOfLivingIndex: 20, internetSpeedMbps: 5, climate: "Tropical Savanna", nomadScore: 15 },
  GY: { safetyIndex: 32, costOfLivingIndex: 38, internetSpeedMbps: 12, climate: "Tropical Rainforest", nomadScore: 28 },
  HN: { safetyIndex: 28, costOfLivingIndex: 28, internetSpeedMbps: 18, climate: "Tropical", nomadScore: 35 },
  HR: { safetyIndex: 72, costOfLivingIndex: 52, internetSpeedMbps: 85, climate: "Mediterranean / Continental", nomadScore: 80 },
  HT: { safetyIndex: 15, costOfLivingIndex: 30, internetSpeedMbps: 5, climate: "Tropical Caribbean", nomadScore: 8 },
  HU: { safetyIndex: 67, costOfLivingIndex: 42, internetSpeedMbps: 98, climate: "Continental", nomadScore: 74 },
  ID: { safetyIndex: 52, costOfLivingIndex: 25, internetSpeedMbps: 25, climate: "Tropical Rainforest", nomadScore: 75 },
  IE: { safetyIndex: 82, costOfLivingIndex: 90, internetSpeedMbps: 110, climate: "Temperate Maritime", nomadScore: 76 },
  IL: { safetyIndex: 45, costOfLivingIndex: 95, internetSpeedMbps: 92, climate: "Mediterranean / Desert", nomadScore: 65 },
  IN: { safetyIndex: 46, costOfLivingIndex: 20, internetSpeedMbps: 30, climate: "Tropical / Subtropical", nomadScore: 58 },
  IQ: { safetyIndex: 20, costOfLivingIndex: 28, internetSpeedMbps: 8, climate: "Desert", nomadScore: 10 },
  IR: { safetyIndex: 35, costOfLivingIndex: 18, internetSpeedMbps: 12, climate: "Desert / Semi-Arid", nomadScore: 15 },
  IS: { safetyIndex: 85, costOfLivingIndex: 112, internetSpeedMbps: 130, climate: "Subarctic / Oceanic", nomadScore: 72 },
  IT: { safetyIndex: 68, costOfLivingIndex: 72, internetSpeedMbps: 90, climate: "Mediterranean / Alpine", nomadScore: 78 },
  JM: { safetyIndex: 28, costOfLivingIndex: 55, internetSpeedMbps: 28, climate: "Tropical Caribbean", nomadScore: 50 },
  JO: { safetyIndex: 60, costOfLivingIndex: 45, internetSpeedMbps: 32, climate: "Mediterranean / Desert", nomadScore: 58 },
  JP: { safetyIndex: 80, costOfLivingIndex: 80, internetSpeedMbps: 165, climate: "Temperate / Subtropical", nomadScore: 82 },
  KE: { safetyIndex: 38, costOfLivingIndex: 30, internetSpeedMbps: 18, climate: "Tropical Savanna", nomadScore: 52 },
  KG: { safetyIndex: 50, costOfLivingIndex: 18, internetSpeedMbps: 22, climate: "Continental / Highland", nomadScore: 45 },
  KH: { safetyIndex: 50, costOfLivingIndex: 22, internetSpeedMbps: 20, climate: "Tropical Monsoon", nomadScore: 58 },
  KI: { safetyIndex: 68, costOfLivingIndex: 45, internetSpeedMbps: 8, climate: "Tropical Pacific", nomadScore: 38 },
  KM: { safetyIndex: 52, costOfLivingIndex: 45, internetSpeedMbps: 5, climate: "Tropical", nomadScore: 30 },
  KN: { safetyIndex: 55, costOfLivingIndex: 72, internetSpeedMbps: 28, climate: "Tropical Caribbean", nomadScore: 60 },
  KP: { safetyIndex: 12, costOfLivingIndex: 10, internetSpeedMbps: 2, climate: "Continental", nomadScore: 2 },
  KR: { safetyIndex: 76, costOfLivingIndex: 72, internetSpeedMbps: 200, climate: "Temperate Continental", nomadScore: 82 },
  KW: { safetyIndex: 68, costOfLivingIndex: 62, internetSpeedMbps: 65, climate: "Hot Desert", nomadScore: 62 },
  KY: { safetyIndex: 60, costOfLivingIndex: 130, internetSpeedMbps: 50, climate: "Tropical Caribbean", nomadScore: 72 },
  KZ: { safetyIndex: 55, costOfLivingIndex: 28, internetSpeedMbps: 28, climate: "Continental / Arid", nomadScore: 45 },
  LA: { safetyIndex: 55, costOfLivingIndex: 18, internetSpeedMbps: 12, climate: "Tropical Monsoon", nomadScore: 50 },
  LB: { safetyIndex: 30, costOfLivingIndex: 30, internetSpeedMbps: 15, climate: "Mediterranean", nomadScore: 28 },
  LC: { safetyIndex: 48, costOfLivingIndex: 65, internetSpeedMbps: 30, climate: "Tropical Caribbean", nomadScore: 60 },
  LK: { safetyIndex: 58, costOfLivingIndex: 22, internetSpeedMbps: 18, climate: "Tropical", nomadScore: 58 },
  LR: { safetyIndex: 35, costOfLivingIndex: 25, internetSpeedMbps: 5, climate: "Tropical", nomadScore: 18 },
  LS: { safetyIndex: 40, costOfLivingIndex: 25, internetSpeedMbps: 8, climate: "Highland / Savanna", nomadScore: 30 },
  LT: { safetyIndex: 66, costOfLivingIndex: 42, internetSpeedMbps: 115, climate: "Continental", nomadScore: 75 },
  LU: { safetyIndex: 80, costOfLivingIndex: 100, internetSpeedMbps: 115, climate: "Temperate Maritime", nomadScore: 75 },
  LV: { safetyIndex: 64, costOfLivingIndex: 42, internetSpeedMbps: 115, climate: "Continental", nomadScore: 74 },
  LY: { safetyIndex: 20, costOfLivingIndex: 28, internetSpeedMbps: 8, climate: "Hot Desert", nomadScore: 10 },
  MA: { safetyIndex: 56, costOfLivingIndex: 28, internetSpeedMbps: 30, climate: "Mediterranean / Desert", nomadScore: 65 },
  MD: { safetyIndex: 58, costOfLivingIndex: 22, internetSpeedMbps: 68, climate: "Continental", nomadScore: 60 },
  ME: { safetyIndex: 62, costOfLivingIndex: 40, internetSpeedMbps: 42, climate: "Mediterranean / Continental", nomadScore: 68 },
  MG: { safetyIndex: 40, costOfLivingIndex: 18, internetSpeedMbps: 5, climate: "Tropical", nomadScore: 28 },
  MK: { safetyIndex: 58, costOfLivingIndex: 28, internetSpeedMbps: 52, climate: "Continental / Mediterranean", nomadScore: 62 },
  ML: { safetyIndex: 22, costOfLivingIndex: 22, internetSpeedMbps: 5, climate: "Hot Desert / Savanna", nomadScore: 12 },
  MM: { safetyIndex: 20, costOfLivingIndex: 18, internetSpeedMbps: 10, climate: "Tropical Monsoon", nomadScore: 15 },
  MN: { safetyIndex: 58, costOfLivingIndex: 22, internetSpeedMbps: 20, climate: "Continental / Highland", nomadScore: 42 },
  MR: { safetyIndex: 38, costOfLivingIndex: 22, internetSpeedMbps: 5, climate: "Hot Desert", nomadScore: 18 },
  MT: { safetyIndex: 74, costOfLivingIndex: 62, internetSpeedMbps: 90, climate: "Mediterranean", nomadScore: 76 },
  MU: { safetyIndex: 60, costOfLivingIndex: 48, internetSpeedMbps: 28, climate: "Tropical", nomadScore: 70 },
  MV: { safetyIndex: 68, costOfLivingIndex: 75, internetSpeedMbps: 20, climate: "Tropical", nomadScore: 62 },
  MW: { safetyIndex: 45, costOfLivingIndex: 20, internetSpeedMbps: 5, climate: "Tropical Savanna", nomadScore: 25 },
  MX: { safetyIndex: 32, costOfLivingIndex: 30, internetSpeedMbps: 48, climate: "Tropical / Desert / Temperate", nomadScore: 75 },
  MY: { safetyIndex: 60, costOfLivingIndex: 28, internetSpeedMbps: 38, climate: "Tropical Rainforest", nomadScore: 82 },
  MZ: { safetyIndex: 35, costOfLivingIndex: 28, internetSpeedMbps: 8, climate: "Tropical Savanna", nomadScore: 22 },
  NA: { safetyIndex: 42, costOfLivingIndex: 38, internetSpeedMbps: 12, climate: "Semi-Arid / Desert", nomadScore: 40 },
  NE: { safetyIndex: 28, costOfLivingIndex: 18, internetSpeedMbps: 5, climate: "Hot Desert", nomadScore: 12 },
  NG: { safetyIndex: 30, costOfLivingIndex: 22, internetSpeedMbps: 12, climate: "Tropical Savanna", nomadScore: 25 },
  NI: { safetyIndex: 35, costOfLivingIndex: 22, internetSpeedMbps: 15, climate: "Tropical", nomadScore: 35 },
  NL: { safetyIndex: 72, costOfLivingIndex: 88, internetSpeedMbps: 175, climate: "Temperate Maritime", nomadScore: 80 },
  NO: { safetyIndex: 82, costOfLivingIndex: 112, internetSpeedMbps: 130, climate: "Subarctic / Oceanic", nomadScore: 76 },
  NP: { safetyIndex: 52, costOfLivingIndex: 18, internetSpeedMbps: 15, climate: "Varied (tropical to alpine)", nomadScore: 52 },
  NR: { safetyIndex: 60, costOfLivingIndex: 65, internetSpeedMbps: 5, climate: "Tropical Pacific", nomadScore: 28 },
  NZ: { safetyIndex: 82, costOfLivingIndex: 75, internetSpeedMbps: 115, climate: "Temperate Maritime", nomadScore: 78 },
  OM: { safetyIndex: 72, costOfLivingIndex: 58, internetSpeedMbps: 55, climate: "Hot Desert", nomadScore: 65 },
  PA: { safetyIndex: 46, costOfLivingIndex: 48, internetSpeedMbps: 30, climate: "Tropical", nomadScore: 68 },
  PE: { safetyIndex: 35, costOfLivingIndex: 28, internetSpeedMbps: 30, climate: "Varied (coastal to highland)", nomadScore: 62 },
  PG: { safetyIndex: 22, costOfLivingIndex: 55, internetSpeedMbps: 5, climate: "Tropical Rainforest", nomadScore: 15 },
  PH: { safetyIndex: 45, costOfLivingIndex: 22, internetSpeedMbps: 35, climate: "Tropical", nomadScore: 68 },
  PK: { safetyIndex: 28, costOfLivingIndex: 15, internetSpeedMbps: 12, climate: "Arid / Semi-Arid", nomadScore: 20 },
  PL: { safetyIndex: 66, costOfLivingIndex: 40, internetSpeedMbps: 120, climate: "Continental", nomadScore: 76 },
  PT: { safetyIndex: 78, costOfLivingIndex: 52, internetSpeedMbps: 120, climate: "Mediterranean / Atlantic", nomadScore: 90 },
  PW: { safetyIndex: 68, costOfLivingIndex: 65, internetSpeedMbps: 15, climate: "Tropical Pacific", nomadScore: 45 },
  PY: { safetyIndex: 40, costOfLivingIndex: 22, internetSpeedMbps: 18, climate: "Subtropical", nomadScore: 42 },
  QA: { safetyIndex: 84, costOfLivingIndex: 68, internetSpeedMbps: 128, climate: "Hot Desert", nomadScore: 72 },
  RO: { safetyIndex: 62, costOfLivingIndex: 32, internetSpeedMbps: 175, climate: "Continental", nomadScore: 78 },
  RS: { safetyIndex: 62, costOfLivingIndex: 32, internetSpeedMbps: 65, climate: "Continental", nomadScore: 72 },
  RU: { safetyIndex: 28, costOfLivingIndex: 28, internetSpeedMbps: 50, climate: "Continental / Subarctic", nomadScore: 15 },
  RW: { safetyIndex: 58, costOfLivingIndex: 32, internetSpeedMbps: 25, climate: "Tropical Highland", nomadScore: 48 },
  SA: { safetyIndex: 70, costOfLivingIndex: 55, internetSpeedMbps: 68, climate: "Hot Desert", nomadScore: 58 },
  SB: { safetyIndex: 60, costOfLivingIndex: 50, internetSpeedMbps: 8, climate: "Tropical Pacific", nomadScore: 35 },
  SC: { safetyIndex: 60, costOfLivingIndex: 80, internetSpeedMbps: 22, climate: "Tropical", nomadScore: 65 },
  SD: { safetyIndex: 18, costOfLivingIndex: 18, internetSpeedMbps: 3, climate: "Hot Desert", nomadScore: 8 },
  SE: { safetyIndex: 74, costOfLivingIndex: 88, internetSpeedMbps: 170, climate: "Subarctic / Continental", nomadScore: 78 },
  SG: { safetyIndex: 84, costOfLivingIndex: 90, internetSpeedMbps: 210, climate: "Tropical Equatorial", nomadScore: 90 },
  SI: { safetyIndex: 76, costOfLivingIndex: 60, internetSpeedMbps: 100, climate: "Continental / Mediterranean", nomadScore: 78 },
  SK: { safetyIndex: 68, costOfLivingIndex: 42, internetSpeedMbps: 100, climate: "Continental", nomadScore: 74 },
  SL: { safetyIndex: 38, costOfLivingIndex: 22, internetSpeedMbps: 5, climate: "Tropical", nomadScore: 18 },
  SM: { safetyIndex: 80, costOfLivingIndex: 62, internetSpeedMbps: 80, climate: "Mediterranean", nomadScore: 70 },
  SN: { safetyIndex: 48, costOfLivingIndex: 28, internetSpeedMbps: 15, climate: "Tropical Savanna", nomadScore: 45 },
  SO: { safetyIndex: 8, costOfLivingIndex: 15, internetSpeedMbps: 2, climate: "Hot Arid", nomadScore: 5 },
  SR: { safetyIndex: 50, costOfLivingIndex: 35, internetSpeedMbps: 10, climate: "Tropical Rainforest", nomadScore: 30 },
  SS: { safetyIndex: 8, costOfLivingIndex: 20, internetSpeedMbps: 2, climate: "Tropical Savanna", nomadScore: 5 },
  ST: { safetyIndex: 62, costOfLivingIndex: 42, internetSpeedMbps: 8, climate: "Tropical", nomadScore: 42 },
  SV: { safetyIndex: 30, costOfLivingIndex: 32, internetSpeedMbps: 20, climate: "Tropical", nomadScore: 38 },
  SZ: { safetyIndex: 42, costOfLivingIndex: 30, internetSpeedMbps: 15, climate: "Subtropical Highland", nomadScore: 32 },
  TD: { safetyIndex: 15, costOfLivingIndex: 20, internetSpeedMbps: 2, climate: "Hot Desert", nomadScore: 8 },
  TG: { safetyIndex: 40, costOfLivingIndex: 22, internetSpeedMbps: 8, climate: "Tropical Savanna", nomadScore: 28 },
  TH: { safetyIndex: 56, costOfLivingIndex: 25, internetSpeedMbps: 55, climate: "Tropical Monsoon", nomadScore: 88 },
  TJ: { safetyIndex: 42, costOfLivingIndex: 15, internetSpeedMbps: 8, climate: "Continental / Arid", nomadScore: 28 },
  TL: { safetyIndex: 48, costOfLivingIndex: 35, internetSpeedMbps: 8, climate: "Tropical", nomadScore: 32 },
  TM: { safetyIndex: 45, costOfLivingIndex: 20, internetSpeedMbps: 5, climate: "Desert / Continental", nomadScore: 18 },
  TN: { safetyIndex: 52, costOfLivingIndex: 25, internetSpeedMbps: 20, climate: "Mediterranean / Desert", nomadScore: 55 },
  TO: { safetyIndex: 65, costOfLivingIndex: 48, internetSpeedMbps: 10, climate: "Tropical Pacific", nomadScore: 42 },
  TR: { safetyIndex: 48, costOfLivingIndex: 25, internetSpeedMbps: 32, climate: "Mediterranean / Continental", nomadScore: 70 },
  TT: { safetyIndex: 35, costOfLivingIndex: 55, internetSpeedMbps: 32, climate: "Tropical Caribbean", nomadScore: 52 },
  TV: { safetyIndex: 68, costOfLivingIndex: 52, internetSpeedMbps: 5, climate: "Tropical Pacific", nomadScore: 28 },
  TZ: { safetyIndex: 48, costOfLivingIndex: 22, internetSpeedMbps: 12, climate: "Tropical Savanna", nomadScore: 48 },
  UA: { safetyIndex: 22, costOfLivingIndex: 20, internetSpeedMbps: 55, climate: "Continental", nomadScore: 12 },
  UG: { safetyIndex: 38, costOfLivingIndex: 22, internetSpeedMbps: 10, climate: "Tropical Highland", nomadScore: 35 },
  US: { safetyIndex: 62, costOfLivingIndex: 100, internetSpeedMbps: 165, climate: "Varied (tropical to arctic)", nomadScore: 80 },
  UY: { safetyIndex: 58, costOfLivingIndex: 48, internetSpeedMbps: 55, climate: "Temperate", nomadScore: 70 },
  UZ: { safetyIndex: 52, costOfLivingIndex: 18, internetSpeedMbps: 15, climate: "Continental / Desert", nomadScore: 45 },
  VA: { safetyIndex: 82, costOfLivingIndex: 65, internetSpeedMbps: 80, climate: "Mediterranean", nomadScore: 55 },
  VC: { safetyIndex: 48, costOfLivingIndex: 60, internetSpeedMbps: 25, climate: "Tropical Caribbean", nomadScore: 55 },
  VE: { safetyIndex: 12, costOfLivingIndex: 15, internetSpeedMbps: 8, climate: "Tropical", nomadScore: 10 },
  VN: { safetyIndex: 62, costOfLivingIndex: 18, internetSpeedMbps: 32, climate: "Tropical Monsoon", nomadScore: 82 },
  VU: { safetyIndex: 60, costOfLivingIndex: 52, internetSpeedMbps: 8, climate: "Tropical Pacific", nomadScore: 40 },
  WS: { safetyIndex: 65, costOfLivingIndex: 55, internetSpeedMbps: 8, climate: "Tropical Pacific", nomadScore: 38 },
  XK: { safetyIndex: 55, costOfLivingIndex: 22, internetSpeedMbps: 40, climate: "Continental", nomadScore: 58 },
  YE: { safetyIndex: 8, costOfLivingIndex: 15, internetSpeedMbps: 2, climate: "Desert / Tropical", nomadScore: 5 },
  ZA: { safetyIndex: 28, costOfLivingIndex: 32, internetSpeedMbps: 28, climate: "Varied (subtropical to alpine)", nomadScore: 55 },
  ZM: { safetyIndex: 45, costOfLivingIndex: 28, internetSpeedMbps: 8, climate: "Tropical Savanna", nomadScore: 32 },
  ZW: { safetyIndex: 35, costOfLivingIndex: 30, internetSpeedMbps: 10, climate: "Tropical Savanna", nomadScore: 28 },
};

export function getCountryScore(code: string): CountryScore | undefined {
  return countryScores[code.toUpperCase()];
}

export function getSafetyLabel(index: number): { label: string; color: string; bg: string; border: string } {
  if (index >= 75) return { label: "Very Safe", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (index >= 60) return { label: "Safe", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" };
  if (index >= 45) return { label: "Moderate", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
  if (index >= 30) return { label: "Caution", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" };
  return { label: "High Risk", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
}

export function getCostLabel(index: number): { label: string; color: string } {
  if (index <= 30) return { label: "Very Affordable", color: "text-emerald-700" };
  if (index <= 50) return { label: "Affordable", color: "text-green-700" };
  if (index <= 70) return { label: "Moderate", color: "text-amber-700" };
  if (index <= 90) return { label: "Expensive", color: "text-orange-700" };
  return { label: "Very Expensive", color: "text-red-700" };
}

export function getInternetLabel(mbps: number): { label: string; color: string } {
  if (mbps >= 100) return { label: "Lightning Fast", color: "text-emerald-700" };
  if (mbps >= 50) return { label: "Fast", color: "text-green-700" };
  if (mbps >= 20) return { label: "Adequate", color: "text-amber-700" };
  if (mbps >= 8) return { label: "Slow", color: "text-orange-700" };
  return { label: "Very Slow", color: "text-red-700" };
}

export function getLivabilityLabel(score: number): { label: string; color: string; bg: string; border: string } {
  if (score >= 80) return { label: "Excellent", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (score >= 65) return { label: "Good", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" };
  if (score >= 50) return { label: "Fair", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
  if (score >= 35) return { label: "Below Average", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" };
  return { label: "Poor", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
}

export function getHealthcareLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "World-class", color: "text-emerald-700" };
  if (score >= 65) return { label: "High quality", color: "text-green-700" };
  if (score >= 50) return { label: "Adequate", color: "text-amber-700" };
  if (score >= 35) return { label: "Limited", color: "text-orange-700" };
  return { label: "Basic only", color: "text-red-700" };
}

/**
 * Extended enrichment data for popular destinations.
 * livabilityScore: composite of healthcare, infra, safety, cost, environment (0–100)
 * healthcareScore: 0–100 quality of healthcare system
 * bestTimeToVisit: e.g. "Apr–Jun, Sep–Oct"
 * weatherSummary: one-line description
 */
export const extendedCountryData: Record<string, { livabilityScore: number; healthcareScore: number; bestTimeToVisit: string; weatherSummary: string }> = {
  // Europe
  PT: { livabilityScore: 80, healthcareScore: 78, bestTimeToVisit: "Apr–Jun, Sep–Oct", weatherSummary: "Warm summers, mild winters. Over 300 sunny days/year." },
  ES: { livabilityScore: 82, healthcareScore: 80, bestTimeToVisit: "Apr–Jun, Sep–Oct", weatherSummary: "Hot dry summers on coasts, cooler inland. Mild winters." },
  IT: { livabilityScore: 82, healthcareScore: 79, bestTimeToVisit: "Apr–Jun, Sep–Oct", weatherSummary: "Mediterranean coast: hot summers. North: cold winters with snow." },
  FR: { livabilityScore: 84, healthcareScore: 88, bestTimeToVisit: "Apr–Sep", weatherSummary: "Temperate north; hot dry summers in south. Paris is rainy Oct–Mar." },
  DE: { livabilityScore: 86, healthcareScore: 87, bestTimeToVisit: "May–Sep", weatherSummary: "Mild summers, cold winters. Shoulder months ideal for fewer crowds." },
  GR: { livabilityScore: 74, healthcareScore: 70, bestTimeToVisit: "May–Oct", weatherSummary: "Hot dry summers, mild winters. Peak crowds Jul–Aug." },
  HR: { livabilityScore: 75, healthcareScore: 73, bestTimeToVisit: "Jun–Sep", weatherSummary: "Hot dry Adriatic coast summers. Mild springs and autumns." },
  NL: { livabilityScore: 86, healthcareScore: 88, bestTimeToVisit: "Apr–Sep", weatherSummary: "Mild and rainy. Spring tulip season Apr–May is spectacular." },
  BE: { livabilityScore: 82, healthcareScore: 84, bestTimeToVisit: "Jun–Aug", weatherSummary: "Temperate maritime. Mild summers, grey winters." },
  AT: { livabilityScore: 86, healthcareScore: 85, bestTimeToVisit: "Jun–Sep, Dec–Mar", weatherSummary: "Alpine: cold snowy winters, warm summers. Year-round appeal." },
  CH: { livabilityScore: 88, healthcareScore: 90, bestTimeToVisit: "Jun–Sep, Dec–Feb", weatherSummary: "Alpine climate: excellent skiing winters, mild summers." },
  SE: { livabilityScore: 87, healthcareScore: 86, bestTimeToVisit: "Jun–Aug", weatherSummary: "Cold dark winters; beautiful bright summers with midnight sun." },
  NO: { livabilityScore: 88, healthcareScore: 88, bestTimeToVisit: "Jun–Aug", weatherSummary: "Arctic/subarctic. Summer is ideal; winter for northern lights." },
  DK: { livabilityScore: 86, healthcareScore: 85, bestTimeToVisit: "Jun–Aug", weatherSummary: "Cool maritime. Short warm summers, cold grey winters." },
  FI: { livabilityScore: 86, healthcareScore: 87, bestTimeToVisit: "Jun–Aug", weatherSummary: "Subarctic. Magical summer with midnight sun; harsh winter." },
  EE: { livabilityScore: 78, healthcareScore: 76, bestTimeToVisit: "Jun–Aug", weatherSummary: "Cool summers, freezing winters. Short but vibrant summer season." },
  LV: { livabilityScore: 74, healthcareScore: 74, bestTimeToVisit: "Jun–Aug", weatherSummary: "Maritime continental. Short warm summer, long cold winter." },
  LT: { livabilityScore: 74, healthcareScore: 74, bestTimeToVisit: "Jun–Aug", weatherSummary: "Continental. Warm summers, very cold winters." },
  PL: { livabilityScore: 76, healthcareScore: 76, bestTimeToVisit: "May–Sep", weatherSummary: "Continental: warm summers, cold snowy winters." },
  CZ: { livabilityScore: 78, healthcareScore: 78, bestTimeToVisit: "May–Sep", weatherSummary: "Continental: warm summers, cold winters. Prague lovely spring–fall." },
  HU: { livabilityScore: 74, healthcareScore: 72, bestTimeToVisit: "Apr–Oct", weatherSummary: "Continental: hot summers, cold winters." },
  RO: { livabilityScore: 68, healthcareScore: 65, bestTimeToVisit: "Jun–Sep", weatherSummary: "Continental: hot summers, cold winters. Transylvania ideal spring." },
  BG: { livabilityScore: 66, healthcareScore: 64, bestTimeToVisit: "Jun–Sep", weatherSummary: "Continental Black Sea coast: hot summers, cold inland winters." },
  IE: { livabilityScore: 82, healthcareScore: 80, bestTimeToVisit: "Jun–Aug", weatherSummary: "Mild wet maritime. Best in summer. Green year-round." },
  GB: { livabilityScore: 83, healthcareScore: 82, bestTimeToVisit: "Jun–Sep", weatherSummary: "Mild maritime. Expect rain year-round. Best summers Jun–Aug." },
  IS: { livabilityScore: 84, healthcareScore: 88, bestTimeToVisit: "Jun–Aug, Nov–Feb (aurora)", weatherSummary: "Subpolar: mild coastal. Midnight sun in summer; northern lights in winter." },
  MT: { livabilityScore: 76, healthcareScore: 74, bestTimeToVisit: "Apr–Jun, Sep–Oct", weatherSummary: "Mediterranean: hot dry summers, warm mild winters." },
  CY: { livabilityScore: 78, healthcareScore: 72, bestTimeToVisit: "Apr–Jun, Sep–Oct", weatherSummary: "Hot Mediterranean summers; mild pleasant winters." },
  SI: { livabilityScore: 80, healthcareScore: 78, bestTimeToVisit: "Jun–Sep", weatherSummary: "Alpine: warm summers, cold snowy winters. Beautiful year-round." },
  // Asia
  JP: { livabilityScore: 86, healthcareScore: 90, bestTimeToVisit: "Mar–May, Sep–Nov", weatherSummary: "Temperate: Cherry blossoms Mar–Apr; autumn foliage Sep–Nov." },
  KR: { livabilityScore: 82, healthcareScore: 85, bestTimeToVisit: "Mar–May, Sep–Nov", weatherSummary: "Continental: cold winters, hot humid summers, beautiful spring/fall." },
  SG: { livabilityScore: 88, healthcareScore: 90, bestTimeToVisit: "Feb–Apr", weatherSummary: "Tropical equatorial: hot and humid year-round, drier Feb–Apr." },
  TH: { livabilityScore: 72, healthcareScore: 74, bestTimeToVisit: "Nov–Mar", weatherSummary: "Tropical monsoon: dry season Nov–Mar is best. Rainy Jun–Oct." },
  MY: { livabilityScore: 74, healthcareScore: 74, bestTimeToVisit: "Dec–Feb (west), Jun–Aug (east)", weatherSummary: "Hot humid year-round. Different coasts have opposite monsoon seasons." },
  ID: { livabilityScore: 62, healthcareScore: 60, bestTimeToVisit: "May–Sep", weatherSummary: "Tropical: dry season May–Sep is ideal. Rainy Nov–Mar." },
  VN: { livabilityScore: 66, healthcareScore: 58, bestTimeToVisit: "Feb–Apr (south), May–Aug (north)", weatherSummary: "Tropical monsoon: varies greatly by region and season." },
  IN: { livabilityScore: 56, healthcareScore: 62, bestTimeToVisit: "Oct–Mar", weatherSummary: "Varies hugely by region. Avoid monsoon Jul–Sep and peak summer." },
  CN: { livabilityScore: 68, healthcareScore: 72, bestTimeToVisit: "Apr–May, Sep–Oct", weatherSummary: "Huge variation by region. Spring/fall ideal for most cities." },
  AE: { livabilityScore: 80, healthcareScore: 82, bestTimeToVisit: "Nov–Apr", weatherSummary: "Desert: extremely hot May–Sep. Perfect mild winters Nov–Apr." },
  QA: { livabilityScore: 78, healthcareScore: 80, bestTimeToVisit: "Oct–Apr", weatherSummary: "Desert: scorching summers. Pleasant cool winters Oct–Apr." },
  SA: { livabilityScore: 68, healthcareScore: 75, bestTimeToVisit: "Oct–Mar", weatherSummary: "Hot desert: extreme summers. Comfortable winters in Riyadh." },
  JO: { livabilityScore: 65, healthcareScore: 68, bestTimeToVisit: "Mar–May, Sep–Nov", weatherSummary: "Semi-arid: mild spring/fall ideal. Hot summers, cold Jordan Valley winters." },
  TR: { livabilityScore: 68, healthcareScore: 68, bestTimeToVisit: "Apr–Jun, Sep–Oct", weatherSummary: "Mediterranean coast: hot dry summers. Istanbul: mild spring/fall." },
  GE: { livabilityScore: 70, healthcareScore: 65, bestTimeToVisit: "May–Sep", weatherSummary: "Continental: warm dry summers in east, subtropical in west." },
  AM: { livabilityScore: 66, healthcareScore: 62, bestTimeToVisit: "Jun–Sep", weatherSummary: "Continental highland: warm summers, very cold winters." },
  // Americas
  US: { livabilityScore: 82, healthcareScore: 72, bestTimeToVisit: "Spring / Fall (varies by state)", weatherSummary: "Enormous variation. NYC/DC best spring & fall. FL best in winter." },
  CA: { livabilityScore: 84, healthcareScore: 85, bestTimeToVisit: "Jun–Sep", weatherSummary: "Varies hugely. Vancouver mild; Toronto/Montreal hot summers, harsh winters." },
  MX: { livabilityScore: 65, healthcareScore: 65, bestTimeToVisit: "Nov–Apr", weatherSummary: "Tropical coasts: dry winter season ideal. Interior: mild year-round." },
  BR: { livabilityScore: 62, healthcareScore: 63, bestTimeToVisit: "Mar–May, Sep–Nov", weatherSummary: "Vast variation: Amazon tropical; Rio/São Paulo subtropical; south temperate." },
  AR: { livabilityScore: 64, healthcareScore: 70, bestTimeToVisit: "Sep–Nov, Mar–May", weatherSummary: "Temperate southern hemisphere: spring (Sep–Nov) and fall (Mar–May) are best." },
  CO: { livabilityScore: 62, healthcareScore: 65, bestTimeToVisit: "Dec–Mar, Jul–Aug", weatherSummary: "Tropical highland: dry seasons Dec–Mar and Jul–Aug. Medellín eternal spring." },
  PE: { livabilityScore: 60, healthcareScore: 62, bestTimeToVisit: "May–Sep (coast/highlands)", weatherSummary: "Arid coast vs tropical Amazon. Highlands/Machu Picchu best May–Oct." },
  CL: { livabilityScore: 70, healthcareScore: 72, bestTimeToVisit: "Oct–Mar", weatherSummary: "Southern hemisphere summer Oct–Mar. Atacama desert accessible year-round." },
  CR: { livabilityScore: 70, healthcareScore: 68, bestTimeToVisit: "Dec–Apr", weatherSummary: "Tropical: dry season Dec–Apr best. Green season May–Nov lush but rainy." },
  PA: { livabilityScore: 65, healthcareScore: 65, bestTimeToVisit: "Jan–Apr", weatherSummary: "Tropical: dry season Jan–Apr. Rainy rest of year." },
  UY: { livabilityScore: 72, healthcareScore: 72, bestTimeToVisit: "Nov–Mar", weatherSummary: "Temperate: warm southern summers Nov–Mar. Mild winters." },
  // Africa
  ZA: { livabilityScore: 58, healthcareScore: 62, bestTimeToVisit: "Oct–Apr (Cape Town)", weatherSummary: "Cape Town: Mediterranean (dry hot summer Oct–Apr). Varied by region." },
  MA: { livabilityScore: 62, healthcareScore: 62, bestTimeToVisit: "Mar–May, Sep–Nov", weatherSummary: "Mediterranean north; desert south. Pleasant spring and autumn." },
  TN: { livabilityScore: 62, healthcareScore: 60, bestTimeToVisit: "Apr–Jun, Sep–Oct", weatherSummary: "Mediterranean coast: warm springs/autumns. Scorching summer interior." },
  EG: { livabilityScore: 54, healthcareScore: 58, bestTimeToVisit: "Oct–Apr", weatherSummary: "Hot desert: cool pleasant Oct–Apr. Avoid intense Jun–Aug heat." },
  KE: { livabilityScore: 55, healthcareScore: 55, bestTimeToVisit: "Jan–Feb, Jul–Sep", weatherSummary: "Tropical highland: two dry seasons. Safaris best Jan–Feb and Jul–Sep." },
  TZ: { livabilityScore: 50, healthcareScore: 48, bestTimeToVisit: "Jun–Oct, Jan–Mar", weatherSummary: "Tropical: dry seasons Jun–Oct (Serengeti) and Jan–Mar. Zanzibar Jul–Aug." },
  ET: { livabilityScore: 38, healthcareScore: 42, bestTimeToVisit: "Oct–May", weatherSummary: "Tropical highland: rainy Jun–Sep. Best Oct–May (mostly dry)." },
  MU: { livabilityScore: 70, healthcareScore: 68, bestTimeToVisit: "May–Nov", weatherSummary: "Tropical: winter May–Nov cooler and drier. Cyclone risk Jan–Mar." },
  // Oceania
  AU: { livabilityScore: 85, healthcareScore: 84, bestTimeToVisit: "Sep–Nov, Mar–May", weatherSummary: "Southern hemisphere: spring (Sep–Nov) and fall (Mar–May) ideal. Varies by region." },
  NZ: { livabilityScore: 85, healthcareScore: 84, bestTimeToVisit: "Oct–Apr", weatherSummary: "Southern hemisphere: summer Dec–Feb warmest. Spring/fall scenic and mild." },
};

/** Merge extended data into a full CountryScore object */
export function getEnrichedScore(code: string): (CountryScore & { livabilityScore?: number; healthcareScore?: number; bestTimeToVisit?: string; weatherSummary?: string }) | undefined {
  const base = countryScores[code.toUpperCase()];
  if (!base) return undefined;
  const ext = extendedCountryData[code.toUpperCase()];
  return ext ? { ...base, ...ext } : base;
}
