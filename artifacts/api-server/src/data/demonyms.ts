// Nationality adjectives (demonyms) per ISO country code.
//
// Real search queries use the demonym, not the country noun — Search Console
// shows "moroccan passport", "as an icelandic person", "nepal visa for indians",
// "lebanese passport". Rendering "Do Nepal citizens need a visa..." both reads
// as broken English and misses the phrasing people actually type, so pair pages
// use these forms in the title, H1, answer sentence and FAQ.
//
// `adj` slots into "Do ${adj} citizens need a visa for X?" and "${adj} passport
// holders". `plural` is the noun for the people themselves ("visa for ${plural}").
// Kept in a standalone module rather than on CountryData because GET /countries
// serves that array verbatim and this is presentation data, not API data.

export interface Demonym {
  /** Attributive form: "${adj} citizens", "${adj} passport holders". */
  adj: string;
  /** Plural noun for the people: "visa requirements for ${plural}". */
  plural: string;
}

const DEMONYMS: Record<string, Demonym> = {
  AD: { adj: "Andorran", plural: "Andorrans" }, // Andorra
  AE: { adj: "Emirati", plural: "Emiratis" }, // UAE
  AF: { adj: "Afghan", plural: "Afghans" }, // Afghanistan
  AG: { adj: "Antiguan", plural: "Antiguans and Barbudans" }, // Antigua and Barbuda
  AL: { adj: "Albanian", plural: "Albanians" }, // Albania
  AM: { adj: "Armenian", plural: "Armenians" }, // Armenia
  AO: { adj: "Angolan", plural: "Angolans" }, // Angola
  AR: { adj: "Argentinian", plural: "Argentinians" }, // Argentina
  AT: { adj: "Austrian", plural: "Austrians" }, // Austria
  AU: { adj: "Australian", plural: "Australians" }, // Australia
  AZ: { adj: "Azerbaijani", plural: "Azerbaijanis" }, // Azerbaijan
  BA: { adj: "Bosnian", plural: "Bosnians" }, // Bosnia and Herzegovina
  BB: { adj: "Barbadian", plural: "Barbadians" }, // Barbados
  BD: { adj: "Bangladeshi", plural: "Bangladeshis" }, // Bangladesh
  BE: { adj: "Belgian", plural: "Belgians" }, // Belgium
  BF: { adj: "Burkinabe", plural: "Burkinabes" }, // Burkina Faso
  BG: { adj: "Bulgarian", plural: "Bulgarians" }, // Bulgaria
  BH: { adj: "Bahraini", plural: "Bahrainis" }, // Bahrain
  BI: { adj: "Burundian", plural: "Burundians" }, // Burundi
  BJ: { adj: "Beninese", plural: "Beninese citizens" }, // Benin
  BN: { adj: "Bruneian", plural: "Bruneians" }, // Brunei
  BO: { adj: "Bolivian", plural: "Bolivians" }, // Bolivia
  BR: { adj: "Brazilian", plural: "Brazilians" }, // Brazil
  BS: { adj: "Bahamian", plural: "Bahamians" }, // Bahamas
  BT: { adj: "Bhutanese", plural: "Bhutanese citizens" }, // Bhutan
  BW: { adj: "Botswanan", plural: "Botswanans" }, // Botswana
  BY: { adj: "Belarusian", plural: "Belarusians" }, // Belarus
  BZ: { adj: "Belizean", plural: "Belizeans" }, // Belize
  CA: { adj: "Canadian", plural: "Canadians" }, // Canada
  CD: { adj: "Congolese", plural: "Congolese citizens" }, // DR Congo
  CF: { adj: "Central African", plural: "Central Africans" }, // Central African Republic
  CG: { adj: "Congolese", plural: "Congolese citizens" }, // Republic of the Congo
  CH: { adj: "Swiss", plural: "Swiss citizens" }, // Switzerland
  CI: { adj: "Ivorian", plural: "Ivorians" }, // Ivory Coast
  CL: { adj: "Chilean", plural: "Chileans" }, // Chile
  CM: { adj: "Cameroonian", plural: "Cameroonians" }, // Cameroon
  CN: { adj: "Chinese", plural: "Chinese citizens" }, // China
  CO: { adj: "Colombian", plural: "Colombians" }, // Colombia
  CR: { adj: "Costa Rican", plural: "Costa Ricans" }, // Costa Rica
  CU: { adj: "Cuban", plural: "Cubans" }, // Cuba
  CV: { adj: "Cabo Verdean", plural: "Cabo Verdeans" }, // Cabo Verde
  CY: { adj: "Cypriot", plural: "Cypriots" }, // Cyprus
  CZ: { adj: "Czech", plural: "Czechs" }, // Czech Republic
  DE: { adj: "German", plural: "Germans" }, // Germany
  DJ: { adj: "Djiboutian", plural: "Djiboutians" }, // Djibouti
  DK: { adj: "Danish", plural: "Danes" }, // Denmark
  DM: { adj: "Dominican", plural: "Dominicans" }, // Dominica
  DO: { adj: "Dominican", plural: "Dominicans" }, // Dominican Republic
  DZ: { adj: "Algerian", plural: "Algerians" }, // Algeria
  EC: { adj: "Ecuadorian", plural: "Ecuadorians" }, // Ecuador
  EE: { adj: "Estonian", plural: "Estonians" }, // Estonia
  EG: { adj: "Egyptian", plural: "Egyptians" }, // Egypt
  ER: { adj: "Eritrean", plural: "Eritreans" }, // Eritrea
  ES: { adj: "Spanish", plural: "Spaniards" }, // Spain
  ET: { adj: "Ethiopian", plural: "Ethiopians" }, // Ethiopia
  FI: { adj: "Finnish", plural: "Finns" }, // Finland
  FJ: { adj: "Fijian", plural: "Fijians" }, // Fiji
  FM: { adj: "Micronesian", plural: "Micronesians" }, // Micronesia
  FR: { adj: "French", plural: "French citizens" }, // France
  GA: { adj: "Gabonese", plural: "Gabonese citizens" }, // Gabon
  GB: { adj: "British", plural: "Britons" }, // United Kingdom
  GD: { adj: "Grenadian", plural: "Grenadians" }, // Grenada
  GE: { adj: "Georgian", plural: "Georgians" }, // Georgia
  GH: { adj: "Ghanaian", plural: "Ghanaians" }, // Ghana
  GM: { adj: "Gambian", plural: "Gambians" }, // Gambia
  GN: { adj: "Guinean", plural: "Guineans" }, // Guinea
  GQ: { adj: "Equatorial Guinean", plural: "Equatorial Guineans" }, // Equatorial Guinea
  GR: { adj: "Greek", plural: "Greeks" }, // Greece
  GT: { adj: "Guatemalan", plural: "Guatemalans" }, // Guatemala
  GW: { adj: "Bissau-Guinean", plural: "Bissau-Guineans" }, // Guinea-Bissau
  GY: { adj: "Guyanese", plural: "Guyanese citizens" }, // Guyana
  HN: { adj: "Honduran", plural: "Hondurans" }, // Honduras
  HR: { adj: "Croatian", plural: "Croatians" }, // Croatia
  HT: { adj: "Haitian", plural: "Haitians" }, // Haiti
  HU: { adj: "Hungarian", plural: "Hungarians" }, // Hungary
  ID: { adj: "Indonesian", plural: "Indonesians" }, // Indonesia
  IE: { adj: "Irish", plural: "Irish citizens" }, // Ireland
  IL: { adj: "Israeli", plural: "Israelis" }, // Israel
  IN: { adj: "Indian", plural: "Indians" }, // India
  IQ: { adj: "Iraqi", plural: "Iraqis" }, // Iraq
  IR: { adj: "Iranian", plural: "Iranians" }, // Iran
  IS: { adj: "Icelandic", plural: "Icelanders" }, // Iceland
  IT: { adj: "Italian", plural: "Italians" }, // Italy
  JM: { adj: "Jamaican", plural: "Jamaicans" }, // Jamaica
  JO: { adj: "Jordanian", plural: "Jordanians" }, // Jordan
  JP: { adj: "Japanese", plural: "Japanese citizens" }, // Japan
  KE: { adj: "Kenyan", plural: "Kenyans" }, // Kenya
  KG: { adj: "Kyrgyz", plural: "Kyrgyz citizens" }, // Kyrgyzstan
  KH: { adj: "Cambodian", plural: "Cambodians" }, // Cambodia
  KI: { adj: "I-Kiribati", plural: "I-Kiribati citizens" }, // Kiribati
  KM: { adj: "Comorian", plural: "Comorians" }, // Comoros
  KN: { adj: "Kittitian", plural: "Kittitians and Nevisians" }, // Saint Kitts and Nevis
  KP: { adj: "North Korean", plural: "North Koreans" }, // North Korea
  KR: { adj: "South Korean", plural: "South Koreans" }, // South Korea
  KW: { adj: "Kuwaiti", plural: "Kuwaitis" }, // Kuwait
  KZ: { adj: "Kazakh", plural: "Kazakhs" }, // Kazakhstan
  LA: { adj: "Laotian", plural: "Laotians" }, // Laos
  LB: { adj: "Lebanese", plural: "Lebanese citizens" }, // Lebanon
  LC: { adj: "Saint Lucian", plural: "Saint Lucians" }, // Saint Lucia
  LI: { adj: "Liechtensteiner", plural: "Liechtensteiners" }, // Liechtenstein
  LK: { adj: "Sri Lankan", plural: "Sri Lankans" }, // Sri Lanka
  LR: { adj: "Liberian", plural: "Liberians" }, // Liberia
  LS: { adj: "Basotho", plural: "Basotho citizens" }, // Lesotho
  LT: { adj: "Lithuanian", plural: "Lithuanians" }, // Lithuania
  LU: { adj: "Luxembourgish", plural: "Luxembourgers" }, // Luxembourg
  LV: { adj: "Latvian", plural: "Latvians" }, // Latvia
  LY: { adj: "Libyan", plural: "Libyans" }, // Libya
  MA: { adj: "Moroccan", plural: "Moroccans" }, // Morocco
  MC: { adj: "Monegasque", plural: "Monegasques" }, // Monaco
  MD: { adj: "Moldovan", plural: "Moldovans" }, // Moldova
  ME: { adj: "Montenegrin", plural: "Montenegrins" }, // Montenegro
  MG: { adj: "Malagasy", plural: "Malagasy citizens" }, // Madagascar
  MH: { adj: "Marshallese", plural: "Marshallese citizens" }, // Marshall Islands
  MK: { adj: "Macedonian", plural: "Macedonians" }, // North Macedonia
  ML: { adj: "Malian", plural: "Malians" }, // Mali
  MM: { adj: "Burmese", plural: "Burmese citizens" }, // Myanmar
  MN: { adj: "Mongolian", plural: "Mongolians" }, // Mongolia
  MR: { adj: "Mauritanian", plural: "Mauritanians" }, // Mauritania
  MT: { adj: "Maltese", plural: "Maltese citizens" }, // Malta
  MU: { adj: "Mauritian", plural: "Mauritians" }, // Mauritius
  MV: { adj: "Maldivian", plural: "Maldivians" }, // Maldives
  MW: { adj: "Malawian", plural: "Malawians" }, // Malawi
  MX: { adj: "Mexican", plural: "Mexicans" }, // Mexico
  MY: { adj: "Malaysian", plural: "Malaysians" }, // Malaysia
  MZ: { adj: "Mozambican", plural: "Mozambicans" }, // Mozambique
  NA: { adj: "Namibian", plural: "Namibians" }, // Namibia
  NE: { adj: "Nigerien", plural: "Nigeriens" }, // Niger
  NG: { adj: "Nigerian", plural: "Nigerians" }, // Nigeria
  NI: { adj: "Nicaraguan", plural: "Nicaraguans" }, // Nicaragua
  NL: { adj: "Dutch", plural: "Dutch people" }, // Netherlands
  NO: { adj: "Norwegian", plural: "Norwegians" }, // Norway
  NP: { adj: "Nepali", plural: "Nepalis" }, // Nepal
  NR: { adj: "Nauruan", plural: "Nauruans" }, // Nauru
  NZ: { adj: "New Zealand", plural: "New Zealanders" }, // New Zealand
  OM: { adj: "Omani", plural: "Omanis" }, // Oman
  PA: { adj: "Panamanian", plural: "Panamanians" }, // Panama
  PE: { adj: "Peruvian", plural: "Peruvians" }, // Peru
  PG: { adj: "Papua New Guinean", plural: "Papua New Guineans" }, // Papua New Guinea
  PH: { adj: "Filipino", plural: "Filipinos" }, // Philippines
  PK: { adj: "Pakistani", plural: "Pakistanis" }, // Pakistan
  PL: { adj: "Polish", plural: "Poles" }, // Poland
  PS: { adj: "Palestinian", plural: "Palestinians" }, // Palestine
  PT: { adj: "Portuguese", plural: "Portuguese citizens" }, // Portugal
  PW: { adj: "Palauan", plural: "Palauans" }, // Palau
  PY: { adj: "Paraguayan", plural: "Paraguayans" }, // Paraguay
  QA: { adj: "Qatari", plural: "Qataris" }, // Qatar
  RO: { adj: "Romanian", plural: "Romanians" }, // Romania
  RS: { adj: "Serbian", plural: "Serbians" }, // Serbia
  RU: { adj: "Russian", plural: "Russians" }, // Russia
  RW: { adj: "Rwandan", plural: "Rwandans" }, // Rwanda
  SA: { adj: "Saudi", plural: "Saudis" }, // Saudi Arabia
  SB: { adj: "Solomon Islander", plural: "Solomon Islanders" }, // Solomon Islands
  SC: { adj: "Seychellois", plural: "Seychellois citizens" }, // Seychelles
  SD: { adj: "Sudanese", plural: "Sudanese citizens" }, // Sudan
  SE: { adj: "Swedish", plural: "Swedes" }, // Sweden
  SG: { adj: "Singaporean", plural: "Singaporeans" }, // Singapore
  SI: { adj: "Slovenian", plural: "Slovenians" }, // Slovenia
  SK: { adj: "Slovak", plural: "Slovaks" }, // Slovakia
  SL: { adj: "Sierra Leonean", plural: "Sierra Leoneans" }, // Sierra Leone
  SM: { adj: "Sammarinese", plural: "Sammarinese citizens" }, // San Marino
  SN: { adj: "Senegalese", plural: "Senegalese citizens" }, // Senegal
  SO: { adj: "Somali", plural: "Somalis" }, // Somalia
  SR: { adj: "Surinamese", plural: "Surinamese citizens" }, // Suriname
  SS: { adj: "South Sudanese", plural: "South Sudanese citizens" }, // South Sudan
  ST: { adj: "Sao Tomean", plural: "Sao Tomeans" }, // Sao Tome and Principe
  SV: { adj: "Salvadoran", plural: "Salvadorans" }, // El Salvador
  SY: { adj: "Syrian", plural: "Syrians" }, // Syria
  SZ: { adj: "Swazi", plural: "Swazis" }, // Eswatini
  TD: { adj: "Chadian", plural: "Chadians" }, // Chad
  TG: { adj: "Togolese", plural: "Togolese citizens" }, // Togo
  TH: { adj: "Thai", plural: "Thais" }, // Thailand
  TJ: { adj: "Tajik", plural: "Tajiks" }, // Tajikistan
  TL: { adj: "Timorese", plural: "Timorese citizens" }, // Timor-Leste
  TM: { adj: "Turkmen", plural: "Turkmen citizens" }, // Turkmenistan
  TN: { adj: "Tunisian", plural: "Tunisians" }, // Tunisia
  TO: { adj: "Tongan", plural: "Tongans" }, // Tonga
  TR: { adj: "Turkish", plural: "Turks" }, // Turkey
  TT: { adj: "Trinidadian", plural: "Trinidadians" }, // Trinidad and Tobago
  TV: { adj: "Tuvaluan", plural: "Tuvaluans" }, // Tuvalu
  TW: { adj: "Taiwanese", plural: "Taiwanese citizens" }, // Taiwan
  TZ: { adj: "Tanzanian", plural: "Tanzanians" }, // Tanzania
  UA: { adj: "Ukrainian", plural: "Ukrainians" }, // Ukraine
  UG: { adj: "Ugandan", plural: "Ugandans" }, // Uganda
  US: { adj: "US", plural: "Americans" }, // United States
  UY: { adj: "Uruguayan", plural: "Uruguayans" }, // Uruguay
  UZ: { adj: "Uzbek", plural: "Uzbeks" }, // Uzbekistan
  VC: { adj: "Vincentian", plural: "Vincentians" }, // Saint Vincent and the Grenadines
  VE: { adj: "Venezuelan", plural: "Venezuelans" }, // Venezuela
  VN: { adj: "Vietnamese", plural: "Vietnamese citizens" }, // Vietnam
  VU: { adj: "Ni-Vanuatu", plural: "Ni-Vanuatu citizens" }, // Vanuatu
  WS: { adj: "Samoan", plural: "Samoans" }, // Samoa
  YE: { adj: "Yemeni", plural: "Yemenis" }, // Yemen
  ZA: { adj: "South African", plural: "South Africans" }, // South Africa
  ZM: { adj: "Zambian", plural: "Zambians" }, // Zambia
  ZW: { adj: "Zimbabwean", plural: "Zimbabweans" }, // Zimbabwe
};

/** Attributive demonym ("Nepali"), falling back to the country name. */
export function demonym(code: string, fallbackName: string): string {
  return DEMONYMS[code.toUpperCase()]?.adj ?? fallbackName;
}

/** Plural noun for the people ("Nepalis"), falling back to "${name} citizens". */
export function demonymPlural(code: string, fallbackName: string): string {
  return DEMONYMS[code.toUpperCase()]?.plural ?? `${fallbackName} citizens`;
}
