import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { VisaEntry, VisaRequirement } from "./visaData.js";
import { VISA_OVERRIDES } from "./visa-overrides.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_NAME_TO_CODE: Record<string, string> = {
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Andorra: "AD",
  Angola: "AO",
  "Antigua and Barbuda": "AG",
  Argentina: "AR",
  Armenia: "AM",
  Australia: "AU",
  Austria: "AT",
  Azerbaijan: "AZ",
  Bahamas: "BS",
  Bahrain: "BH",
  Bangladesh: "BD",
  Barbados: "BB",
  Belarus: "BY",
  Belgium: "BE",
  Belize: "BZ",
  Benin: "BJ",
  Bhutan: "BT",
  Bolivia: "BO",
  "Bosnia and Herzegovina": "BA",
  Botswana: "BW",
  Brazil: "BR",
  Brunei: "BN",
  Bulgaria: "BG",
  "Burkina Faso": "BF",
  Burundi: "BI",
  Cambodia: "KH",
  Cameroon: "CM",
  Canada: "CA",
  "Cape Verde": "CV",
  "Central African Republic": "CF",
  Chad: "TD",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Comoros: "KM",
  Congo: "CG",
  "DR Congo": "CD",
  "Costa Rica": "CR",
  "Ivory Coast": "CI",
  Croatia: "HR",
  Cuba: "CU",
  Cyprus: "CY",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Djibouti: "DJ",
  Dominica: "DM",
  "Dominican Republic": "DO",
  Ecuador: "EC",
  Egypt: "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  Eritrea: "ER",
  Estonia: "EE",
  Swaziland: "SZ",
  Ethiopia: "ET",
  Fiji: "FJ",
  Finland: "FI",
  France: "FR",
  Gabon: "GA",
  Gambia: "GM",
  Georgia: "GE",
  Germany: "DE",
  Ghana: "GH",
  Greece: "GR",
  Grenada: "GD",
  Guatemala: "GT",
  Guinea: "GN",
  "Guinea-Bissau": "GW",
  Guyana: "GY",
  Haiti: "HT",
  Honduras: "HN",
  "Hong Kong": "HK",
  Hungary: "HU",
  Iceland: "IS",
  India: "IN",
  Indonesia: "ID",
  Iran: "IR",
  Iraq: "IQ",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  Jamaica: "JM",
  Japan: "JP",
  Jordan: "JO",
  Kazakhstan: "KZ",
  Kenya: "KE",
  Kiribati: "KI",
  Kosovo: "XK",
  Kuwait: "KW",
  Kyrgyzstan: "KG",
  Laos: "LA",
  Latvia: "LV",
  Lebanon: "LB",
  Lesotho: "LS",
  Liberia: "LR",
  Libya: "LY",
  Liechtenstein: "LI",
  Lithuania: "LT",
  Luxembourg: "LU",
  Macao: "MO",
  Madagascar: "MG",
  Malawi: "MW",
  Malaysia: "MY",
  Maldives: "MV",
  Mali: "ML",
  Malta: "MT",
  "Marshall Islands": "MH",
  Mauritania: "MR",
  Mauritius: "MU",
  Mexico: "MX",
  Micronesia: "FM",
  Moldova: "MD",
  Monaco: "MC",
  Mongolia: "MN",
  Montenegro: "ME",
  Morocco: "MA",
  Mozambique: "MZ",
  Myanmar: "MM",
  Namibia: "NA",
  Nauru: "NR",
  Nepal: "NP",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Nicaragua: "NI",
  Niger: "NE",
  Nigeria: "NG",
  "North Korea": "KP",
  "North Macedonia": "MK",
  Norway: "NO",
  Oman: "OM",
  Pakistan: "PK",
  Palau: "PW",
  Palestine: "PS",
  Panama: "PA",
  "Papua New Guinea": "PG",
  Paraguay: "PY",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  Qatar: "QA",
  Romania: "RO",
  Russia: "RU",
  Rwanda: "RW",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  Samoa: "WS",
  "San Marino": "SM",
  "Sao Tome and Principe": "ST",
  "Saudi Arabia": "SA",
  Senegal: "SN",
  Serbia: "RS",
  Seychelles: "SC",
  "Sierra Leone": "SL",
  Singapore: "SG",
  Slovakia: "SK",
  Slovenia: "SI",
  "Solomon Islands": "SB",
  Somalia: "SO",
  "South Africa": "ZA",
  "South Korea": "KR",
  "South Sudan": "SS",
  Spain: "ES",
  "Sri Lanka": "LK",
  Sudan: "SD",
  Suriname: "SR",
  Sweden: "SE",
  Switzerland: "CH",
  Syria: "SY",
  Taiwan: "TW",
  Tajikistan: "TJ",
  Tanzania: "TZ",
  Thailand: "TH",
  "Timor-Leste": "TL",
  Togo: "TG",
  Tonga: "TO",
  "Trinidad and Tobago": "TT",
  Tunisia: "TN",
  Turkey: "TR",
  Turkmenistan: "TM",
  Tuvalu: "TV",
  Uganda: "UG",
  Ukraine: "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  Uruguay: "UY",
  Uzbekistan: "UZ",
  Vanuatu: "VU",
  Vatican: "VA",
  Venezuela: "VE",
  Vietnam: "VN",
  Yemen: "YE",
  Zambia: "ZM",
  Zimbabwe: "ZW",
};

function parseValue(raw: string): VisaEntry {
  const v = raw.trim();

  if (v === "-1") {
    return { requirement: "no_admission" };
  }

  if (v === "no admission") {
    return { requirement: "no_admission" };
  }

  if (v === "visa required" || v === "covid ban") {
    return { requirement: "visa_required" };
  }

  if (v === "visa on arrival") {
    return { requirement: "visa_on_arrival" };
  }

  if (v === "e-visa") {
    return { requirement: "e_visa" };
  }

  if (v === "eta") {
    return { requirement: "e_visa", notes: "Electronic Travel Authorization required" };
  }

  if (v === "visa free") {
    return { requirement: "visa_free" };
  }

  const days = parseInt(v, 10);
  if (!isNaN(days) && days > 0) {
    return { requirement: "visa_free", maxStay: `${days} days` };
  }

  return { requirement: "visa_required" };
}

type VisaLookup = Map<string, Map<string, VisaEntry>>;

let _lookup: VisaLookup | null = null;

export function getPassportIndexLookup(): VisaLookup {
  if (_lookup) return _lookup;

  // The CSV sits next to this module in dev/Replit (build.mjs copies it into
  // dist/). In a bundled serverless deploy (Vercel) __dirname points at the
  // bundle, so probe a few candidate locations before giving up.
  const candidates = [
    path.join(__dirname, "passport-index.csv"),
    path.join(process.cwd(), "artifacts/api-server/src/data/passport-index.csv"),
    path.join(process.cwd(), "passport-index.csv"),
  ];
  const csvPath = candidates.find((p) => fs.existsSync(p));
  if (!csvPath) {
    throw new Error(
      `passport-index.csv not found. Looked in: ${candidates.join(", ")}`,
    );
  }
  const raw = fs.readFileSync(csvPath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);

  const header = lines[0].split(",");
  const destNames = header.slice(1);

  _lookup = new Map();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const passportName = cols[0].trim();
    const passportCode = CSV_NAME_TO_CODE[passportName];
    if (!passportCode) continue;

    const destMap = new Map<string, VisaEntry>();

    for (let j = 1; j < cols.length; j++) {
      const destName = destNames[j - 1]?.trim();
      if (!destName) continue;
      const destCode = CSV_NAME_TO_CODE[destName];
      if (!destCode) continue;
      destMap.set(destCode, parseValue(cols[j]));
    }

    _lookup.set(passportCode, destMap);
  }

  // Layer source-verified manual corrections (visa-overrides.ts) on top of the
  // base dataset. Overrides always win and survive a base-CSV refresh.
  // Guard the override layer: parseValue() maps any UNKNOWN string to
  // "visa required", so a typo'd value (e.g. "visa-free") would silently turn
  // a visa-free rule into visa-required. Also catch duplicate (passport,
  // destination) pairs, where the later entry silently wins.
  const OVERRIDE_VOCAB = new Set(["visa free", "visa on arrival", "e-visa", "eta", "visa required", "no admission"]);
  const seenOverride = new Set<string>();
  for (const o of VISA_OVERRIDES) {
    const key = `${o.passport}>${o.destination}`;
    if (seenOverride.has(key)) {
      console.warn(`[visa-overrides] DUPLICATE override for ${key} — the later entry wins; remove one.`);
    }
    seenOverride.add(key);
    const v = o.value.toLowerCase().trim();
    if (!OVERRIDE_VOCAB.has(v) && !/^\d+$/.test(v)) {
      console.warn(`[visa-overrides] INVALID value "${o.value}" for ${key} — parseValue will treat it as "visa required". Use: ${[...OVERRIDE_VOCAB].join(" | ")} | <days>.`);
    }
  }
  for (const o of VISA_OVERRIDES) {
    let destMap = _lookup.get(o.passport);
    if (!destMap) {
      destMap = new Map<string, VisaEntry>();
      _lookup.set(o.passport, destMap);
    }
    // Keep the provenance so pages can show "verified against <source> on <date>"
    // for manually corrected cells, instead of only the dataset-wide date.
    destMap.set(o.destination, { ...parseValue(o.value), verifiedSource: o.source, verifiedOn: o.verifiedOn });
  }

  return _lookup;
}

export function getVisaEntryFromIndex(
  passportCode: string,
  destinationCode: string
): VisaEntry | null {
  const lookup = getPassportIndexLookup();
  const destMap = lookup.get(passportCode);
  if (!destMap) return null;
  return destMap.get(destinationCode) ?? null;
}

export function getRequirementType(entry: VisaEntry): VisaRequirement {
  return entry.requirement;
}
