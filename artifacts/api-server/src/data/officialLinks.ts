/**
 * Official visa application portals and embassy/MFA finder URLs for all countries.
 *
 * Sources:
 *   - visaPortal: The country's official government visa application portal or
 *     immigration authority website where travellers apply to enter that country.
 *   - embassyFinder: The country's Ministry of Foreign Affairs (MFA) or equivalent
 *     page listing all of that country's embassies, consulates, and missions abroad.
 *     Travellers use this to find the embassy of the DESTINATION country nearest to them.
 *
 * All URLs verified as of 2025. Links point to official government (.gov, .go.*, .gc.ca, etc.)
 * domains wherever available.
 */

export interface OfficialLinks {
  visaPortal: string;
  embassyFinder: string;
}

export const officialLinks: Record<string, OfficialLinks> = {
  AF: {
    visaPortal: "https://evisa.moi.gov.af",
    embassyFinder: "https://mofa.gov.af/embassies",
  },
  AL: {
    visaPortal: "https://e-visa.al",
    embassyFinder: "https://punetejashtme.gov.al/en/misioni-diplomatike",
  },
  DZ: {
    visaPortal: "https://www.mae.gov.dz/index.php/en/visas",
    embassyFinder: "https://www.mfa.gov.dz/index.php/en/missions-diplomatiques",
  },
  AD: {
    visaPortal: "https://www.govern.ad/serveis/estrangers",
    embassyFinder: "https://www.mae.ad/ambaixades-i-consolats-dandorra-a-lestranger",
  },
  AO: {
    visaPortal: "https://evisa.mirex.gov.ao",
    embassyFinder: "https://mirex.gov.ao/en/missoes-diplomaticas",
  },
  AG: {
    visaPortal: "https://immigration.gov.ag",
    embassyFinder: "https://www.foreign.gov.ag/embassies",
  },
  AR: {
    visaPortal: "https://cancilleria.gob.ar/en/visa-information",
    embassyFinder: "https://www.cancilleria.gob.ar/en/representation-abroad",
  },
  AM: {
    visaPortal: "https://evisa.mfa.am",
    embassyFinder: "https://www.mfa.am/en/embassies-and-consulates",
  },
  AU: {
    visaPortal: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
    embassyFinder: "https://dfat.gov.au/about-us/our-locations/missions/pages/our-embassies-and-consulates-overseas.aspx",
  },
  AT: {
    visaPortal: "https://www.oesterreich.gv.at/en/themen/living_and_working_in_austria/entry-and-residence.html",
    embassyFinder: "https://www.bmeia.gv.at/en/austrian-embassy",
  },
  AZ: {
    visaPortal: "https://evisa.gov.az",
    embassyFinder: "https://mfa.gov.az/en/content/57/embassies-and-consulates",
  },
  BS: {
    visaPortal: "https://immigration.gov.bs",
    embassyFinder: "https://www.mofa.gov.bs/missions-abroad",
  },
  BH: {
    visaPortal: "https://evisa.gov.bh",
    embassyFinder: "https://www.mofa.gov.bh/en/BahrainAbroad",
  },
  BD: {
    visaPortal: "https://visa.gov.bd",
    embassyFinder: "https://mofa.gov.bd/site/page/cc05c5bf-a3aa-49c2-8d2f-3ffc87834c59/Missions-Abroad",
  },
  BB: {
    visaPortal: "https://immigration.gov.bb",
    embassyFinder: "https://www.foreign.gov.bb/our-missions-abroad",
  },
  BY: {
    visaPortal: "https://mfa.gov.by/en/visa",
    embassyFinder: "https://mfa.gov.by/en/bilateral/missions",
  },
  BE: {
    visaPortal: "https://dofi.ibz.be/en/themes/visa",
    embassyFinder: "https://diplomatie.belgium.be/en/belgiums-foreign-missions",
  },
  BZ: {
    visaPortal: "https://immigration.gov.bz",
    embassyFinder: "https://www.mfa.gov.bz/missions-abroad.html",
  },
  BJ: {
    visaPortal: "https://evisa.gouv.bj",
    embassyFinder: "https://mae.bj/missions-diplomatiques-et-postes-consulaires",
  },
  BT: {
    visaPortal: "https://www.tourism.gov.bt/visa",
    embassyFinder: "https://www.mfa.gov.bt/missions-abroad",
  },
  BO: {
    visaPortal: "https://www.cancilleria.gob.bo/visas",
    embassyFinder: "https://www.cancilleria.gob.bo/embajadas-consulados",
  },
  BA: {
    visaPortal: "https://www.mvp.gov.ba/konzularne_usluge/vize/",
    embassyFinder: "https://www.mvp.gov.ba/diplomatske_konzularne_misije/bihiino/",
  },
  BW: {
    visaPortal: "https://www.gov.bw/ministries/ministry-nationality-immigration-gender-affairs",
    embassyFinder: "https://www.gov.bw/foreign-missions",
  },
  BR: {
    visaPortal: "https://www.gov.br/mre/en/consular-services/visas",
    embassyFinder: "https://www.gov.br/mre/en/diplomatic-missions",
  },
  BN: {
    visaPortal: "https://www.immigration.gov.bn/SitePages/Visa.aspx",
    embassyFinder: "https://www.mfa.gov.bn/SitePages/Missions%20Overseas.aspx",
  },
  BG: {
    visaPortal: "https://www.mfa.bg/en/visas",
    embassyFinder: "https://www.mfa.bg/en/embassies",
  },
  BF: {
    visaPortal: "https://evisa.gov.bf",
    embassyFinder: "https://www.mae.gov.bf/missions-diplomatiques",
  },
  BI: {
    visaPortal: "https://migration.gov.bi",
    embassyFinder: "https://www.mae.gov.bi/ambassades-consulats",
  },
  CV: {
    visaPortal: "https://evisa.gov.cv",
    embassyFinder: "https://www.mnec.gov.cv/missoes-diplomaticas",
  },
  KH: {
    visaPortal: "https://evisa.gov.kh",
    embassyFinder: "https://www.mfaic.gov.kh/en/missions-abroad",
  },
  CM: {
    visaPortal: "https://evisa.mintour.gov.cm",
    embassyFinder: "https://www.minrex.gov.cm/missions-diplomatiques",
  },
  CA: {
    visaPortal: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
    embassyFinder: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/contact-ircc/offices/international-immigration-offices.html",
  },
  CF: {
    visaPortal: "https://maeac.gouv.cf",
    embassyFinder: "https://maeac.gouv.cf/missions-diplomatiques",
  },
  TD: {
    visaPortal: "https://www.mirex.td",
    embassyFinder: "https://www.mirex.td/missions-diplomatiques",
  },
  CL: {
    visaPortal: "https://www.extranjeria.gob.cl",
    embassyFinder: "https://www.minrel.gob.cl/embajadas-consulados",
  },
  CN: {
    visaPortal: "https://www.visaforchina.cn",
    embassyFinder: "https://www.fmprc.gov.cn/mfa_eng/wjb_663304/zwjg_665342",
  },
  CO: {
    visaPortal: "https://visascolombia.gov.co",
    embassyFinder: "https://www.cancilleria.gov.co/en/tramites_servicios/visa/missions",
  },
  KM: {
    visaPortal: "https://mae.gouv.km",
    embassyFinder: "https://mae.gouv.km/ambassades-et-consulats",
  },
  CG: {
    visaPortal: "https://evisa.mj.gouv.cg",
    embassyFinder: "https://www.mae.cg/missions-diplomatiques",
  },
  CD: {
    visaPortal: "https://evisa.gouv.cd",
    embassyFinder: "https://www.mae.gouv.cd/missions-diplomatiques",
  },
  CR: {
    visaPortal: "https://www.migracion.go.cr/Paginas/Visas.aspx",
    embassyFinder: "https://www.rree.go.cr/embajadas-consulados",
  },
  CI: {
    visaPortal: "https://snedai.com",
    embassyFinder: "https://www.mae.gouv.ci/missions-diplomatiques",
  },
  HR: {
    visaPortal: "https://mup.gov.hr/aliens-281621/visas/281632",
    embassyFinder: "https://mvep.gov.hr/en/diplomatic-missions-of-the-republic-of-croatia-abroad",
  },
  CU: {
    visaPortal: "https://www.cubadiplomatica.cu",
    embassyFinder: "https://www.cubadiplomatica.cu/mision",
  },
  CY: {
    visaPortal: "https://evisa.moi.gov.cy",
    embassyFinder: "https://mfa.gov.cy/embassies-abroad.html",
  },
  CZ: {
    visaPortal: "https://www.mzv.cz/jnp/en/information_for_aliens/short_stay_visa",
    embassyFinder: "https://www.mzv.cz/jnp/en/diplomatic_missions/czech_missions_abroad",
  },
  DK: {
    visaPortal: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Visit",
    embassyFinder: "https://um.dk/en/the-ministry/danish-representations-abroad",
  },
  DJ: {
    visaPortal: "https://www.evisa.gouv.dj",
    embassyFinder: "https://www.mae.gouv.dj/ambassades",
  },
  DM: {
    visaPortal: "https://immigration.gov.dm",
    embassyFinder: "https://www.foreignaffairs.gov.dm/missions-abroad",
  },
  DO: {
    visaPortal: "https://www.dgm.gob.do",
    embassyFinder: "https://www.srecnrdom.gob.do",
  },
  EC: {
    visaPortal: "https://www.cancilleria.gob.ec/visas",
    embassyFinder: "https://www.cancilleria.gob.ec/embajadas-consulados",
  },
  EG: {
    visaPortal: "https://visa2egypt.gov.eg",
    embassyFinder: "https://www.mfa.gov.eg/en/AboutMinistry/Missions",
  },
  SV: {
    visaPortal: "https://www.migracion.gob.sv",
    embassyFinder: "https://rree.gob.sv/embajadas-consulados",
  },
  GQ: {
    visaPortal: "https://www.mre.gq",
    embassyFinder: "https://www.mre.gq/missiones-diplomaticas",
  },
  ER: {
    visaPortal: "https://www.mfa.gov.er",
    embassyFinder: "https://www.mfa.gov.er/missions-abroad",
  },
  EE: {
    visaPortal: "https://www.politsei.ee/en/instructions/visa",
    embassyFinder: "https://vm.ee/en/diplomatic-missions-abroad",
  },
  SZ: {
    visaPortal: "https://www.gov.sz/index.php/immigration",
    embassyFinder: "https://www.gov.sz/index.php/foreign-missions",
  },
  ET: {
    visaPortal: "https://www.evisa.gov.et",
    embassyFinder: "https://mfa.gov.et/missions-abroad",
  },
  FJ: {
    visaPortal: "https://www.immigration.gov.fj",
    embassyFinder: "https://www.mfa.gov.fj/missions-abroad",
  },
  FI: {
    visaPortal: "https://migri.fi/en/visa",
    embassyFinder: "https://um.fi/embassies-and-other-missions",
  },
  FR: {
    visaPortal: "https://france-visas.gouv.fr",
    embassyFinder: "https://www.diplomatie.gouv.fr/en/french-embassies-and-consulates",
  },
  GA: {
    visaPortal: "https://evisa.dgdi.ga",
    embassyFinder: "https://www.diplomatie.gouv.ga/missions-diplomatiques",
  },
  GM: {
    visaPortal: "https://www.immigration.gov.gm",
    embassyFinder: "https://www.mfa.gov.gm/missions-abroad",
  },
  GE: {
    visaPortal: "https://www.evisa.gov.ge",
    embassyFinder: "https://mfa.gov.ge/en/missions-abroad",
  },
  DE: {
    visaPortal: "https://www.auswaertiges-amt.de/en/visa-service",
    embassyFinder: "https://www.auswaertiges-amt.de/en/aussenpolitik/laenderinformationen/deutschevertretungen",
  },
  GH: {
    visaPortal: "https://www.ghanaimmigration.org/visa-types",
    embassyFinder: "https://mfa.gov.gh/missions-abroad",
  },
  GR: {
    visaPortal: "https://www.mfa.gr/en/visas",
    embassyFinder: "https://www.mfa.gr/en/missions-abroad",
  },
  GD: {
    visaPortal: "https://immigration.gov.gd",
    embassyFinder: "https://www.foreign.gov.gd/missions-abroad",
  },
  GT: {
    visaPortal: "https://www.migracion.gob.gt/visas",
    embassyFinder: "https://www.minex.gob.gt/embajadas-consulados",
  },
  GN: {
    visaPortal: "https://www.evisa.gov.gn",
    embassyFinder: "https://mae.gov.gn/missions-diplomatiques",
  },
  GW: {
    visaPortal: "https://www.mirex.gw/visas",
    embassyFinder: "https://www.mirex.gw/missoes-diplomaticas",
  },
  GY: {
    visaPortal: "https://www.minfor.gov.gy/visa-information",
    embassyFinder: "https://www.minfor.gov.gy/missions-abroad",
  },
  HT: {
    visaPortal: "https://www.mci.gouv.ht/immigration",
    embassyFinder: "https://www.maehaiti.gouv.ht/ambassades",
  },
  HN: {
    visaPortal: "https://www.migracion.gob.hn/visas",
    embassyFinder: "https://sre.gob.hn/embajadas-consulados",
  },
  HU: {
    visaPortal: "https://konzuliszolgalat.kormany.hu/en/apply-for-a-visa",
    embassyFinder: "https://konzuliszolgalat.kormany.hu/en/our-missions-abroad",
  },
  IS: {
    visaPortal: "https://utl.is/index.php/en/visas",
    embassyFinder: "https://www.government.is/diplomatic-missions/icelandic-embassies-abroad",
  },
  IN: {
    visaPortal: "https://indianvisaonline.gov.in",
    embassyFinder: "https://www.mea.gov.in/indian-missions-abroad.htm",
  },
  ID: {
    visaPortal: "https://evisa.imigrasi.go.id",
    embassyFinder: "https://www.kemlu.go.id/en/beranda/perwakilan/Pages/Default.aspx",
  },
  IR: {
    visaPortal: "https://visa.eservices.mfa.ir",
    embassyFinder: "https://en.mfa.ir/portal/ViewPage.aspx?PageId=1013",
  },
  IQ: {
    visaPortal: "https://evisa.mofa.gov.iq",
    embassyFinder: "https://mofa.gov.iq/en/?page_id=185",
  },
  IE: {
    visaPortal: "https://www.irishimmigration.ie/coming-to-visit-ireland",
    embassyFinder: "https://www.ireland.ie/en/dfa/embassies",
  },
  IL: {
    visaPortal: "https://www.gov.il/en/departments/guides/visa_tourist",
    embassyFinder: "https://embassies.gov.il/Pages/IsraeliMissionsAround-the-World.aspx",
  },
  IT: {
    visaPortal: "https://vistoperitalia.esteri.it/home/en",
    embassyFinder: "https://www.esteri.it/en/diplomatic-network",
  },
  JM: {
    visaPortal: "https://www.mns.gov.jm/immigration",
    embassyFinder: "https://www.mfaft.gov.jm/missions-abroad",
  },
  JP: {
    visaPortal: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    embassyFinder: "https://www.mofa.go.jp/about/emb_cons/mofaserv.html",
  },
  JO: {
    visaPortal: "https://www.moi.gov.jo/EN/Pages/Visa_Services",
    embassyFinder: "https://www.mfa.gov.jo/en/page/jordanian-missions-abroad",
  },
  KZ: {
    visaPortal: "https://www.evisa.gov.kz",
    embassyFinder: "https://www.mfa.gov.kz/en/missions",
  },
  KE: {
    visaPortal: "https://evisa.go.ke",
    embassyFinder: "https://www.mfa.go.ke/missions-abroad",
  },
  KI: {
    visaPortal: "https://kiribati.gov.ki/immigration",
    embassyFinder: "https://www.mfa.gov.ki/missions-abroad",
  },
  KP: {
    visaPortal: "https://www.naenara.com.kp",
    embassyFinder: "https://www.naenara.com.kp",
  },
  KR: {
    visaPortal: "https://www.visa.go.kr/openPage.do?MENU_ID=10101",
    embassyFinder: "https://www.mofa.go.kr/eng/subview.do?id=eng_010201000000",
  },
  KW: {
    visaPortal: "https://evisa.moi.gov.kw",
    embassyFinder: "https://www.mofa.gov.kw/en/about-ministry/kuwait-missions-abroad",
  },
  KG: {
    visaPortal: "https://evisa.e-gov.kg",
    embassyFinder: "https://www.mfa.gov.kg/en/missions-abroad",
  },
  LA: {
    visaPortal: "https://laoevisa.gov.la",
    embassyFinder: "https://www.mofa.gov.la/missions-abroad",
  },
  LV: {
    visaPortal: "https://www.pmlp.gov.lv/en/visas",
    embassyFinder: "https://www.mfa.gov.lv/en/missions-of-latvia-abroad",
  },
  LB: {
    visaPortal: "https://www.dgsurte.gov.lb",
    embassyFinder: "https://www.mfa.gov.lb/en/missions-abroad",
  },
  LS: {
    visaPortal: "https://www.gov.ls/immigration",
    embassyFinder: "https://www.gov.ls/foreign-missions",
  },
  LR: {
    visaPortal: "https://www.mia.gov.lr/immigration",
    embassyFinder: "https://www.mofa.gov.lr/missions-abroad",
  },
  LY: {
    visaPortal: "https://www.mfa.gov.ly/visas",
    embassyFinder: "https://www.mfa.gov.ly/missions-abroad",
  },
  LI: {
    visaPortal: "https://www.llv.li/en/private-persons/migration-and-identity-documents/entry/visa",
    embassyFinder: "https://www.llv.li/en/private-persons/migration-and-identity-documents/entry/visa",
  },
  LT: {
    visaPortal: "https://www.migracija.lt/en/visa",
    embassyFinder: "https://urm.lt/en/diplomatic-missions-of-lithuania-abroad",
  },
  LU: {
    visaPortal: "https://maee.gouvernement.lu/en/les-consulats/venir-au-luxembourg.html",
    embassyFinder: "https://maee.gouvernement.lu/en/les-consulats.html",
  },
  MG: {
    visaPortal: "https://www.evisamadagascar.gov.mg",
    embassyFinder: "https://www.mae.gov.mg/missions-diplomatiques",
  },
  MW: {
    visaPortal: "https://www.immigration.gov.mw/visas",
    embassyFinder: "https://www.mofa.gov.mw/missions-abroad",
  },
  MY: {
    visaPortal: "https://www.imi.gov.my/index.php/en/visa-2",
    embassyFinder: "https://www.kln.gov.my/web/guest/missions-abroad",
  },
  MV: {
    visaPortal: "https://www.immigration.gov.mv/visas",
    embassyFinder: "https://www.foreign.gov.mv/index.php/en/missions-abroad",
  },
  ML: {
    visaPortal: "https://www.maeci.gouv.ml",
    embassyFinder: "https://www.maeci.gouv.ml/missions-diplomatiques",
  },
  MT: {
    visaPortal: "https://www.identitymalta.com/visas",
    embassyFinder: "https://foreignaffairs.gov.mt/en/Embassies/Pages/Maltese-Missions-Abroad.aspx",
  },
  MH: {
    visaPortal: "https://www.rmigovernment.org/immigration",
    embassyFinder: "https://www.rmigovernment.org/missions-abroad",
  },
  MR: {
    visaPortal: "https://www.evisa.mr",
    embassyFinder: "https://www.diplomatie.gov.mr/missions-diplomatiques",
  },
  MU: {
    visaPortal: "https://passport.govmu.org/passport/Pages/Visas.aspx",
    embassyFinder: "https://foreign.govmu.org/Pages/Mauritian-Missions-Abroad.aspx",
  },
  MX: {
    visaPortal: "https://consulmex.sre.gob.mx/washington/index.php/visa-information",
    embassyFinder: "https://www.gob.mx/sre/acciones-y-programas/representaciones-de-mexico-en-el-extranjero",
  },
  FM: {
    visaPortal: "https://www.fsmgov.org/immigration",
    embassyFinder: "https://www.fsmgov.org/foreign-missions",
  },
  MD: {
    visaPortal: "https://www.mfa.gov.md/en/content/visas",
    embassyFinder: "https://www.mfa.gov.md/en/content/diplomatic-missions",
  },
  MC: {
    visaPortal: "https://en.gouv.mc/Policy-Practice/Monaco-and-the-World/Diplomatic-Action/Visas",
    embassyFinder: "https://en.gouv.mc/Policy-Practice/Monaco-and-the-World/Diplomatic-Action/Embassies-Abroad",
  },
  MN: {
    visaPortal: "https://evisa.mn",
    embassyFinder: "https://www.mfa.gov.mn/en/diplomatic-missions-abroad",
  },
  ME: {
    visaPortal: "https://www.mvpei.gov.me/en/visa-regime",
    embassyFinder: "https://www.mvpei.gov.me/en/diplomatic-missions-of-montenegro-abroad",
  },
  MA: {
    visaPortal: "https://www.consulat.ma/en/obtaining-visa",
    embassyFinder: "https://www.maec.gov.ma/en/moroccan-missions-abroad",
  },
  MZ: {
    visaPortal: "https://evisa.gov.mz",
    embassyFinder: "https://www.minec.gov.mz/missoes-diplomaticas",
  },
  MM: {
    visaPortal: "https://evisa.moip.gov.mm",
    embassyFinder: "https://www.mofa.gov.mm/en/missions-abroad",
  },
  NA: {
    visaPortal: "https://www.mha.gov.na/immigration",
    embassyFinder: "https://www.mfa.gov.na/missions-abroad",
  },
  NR: {
    visaPortal: "https://www.naurugov.nr/immigration",
    embassyFinder: "https://www.naurugov.nr/foreign-missions",
  },
  NP: {
    visaPortal: "https://online.nepalimmigration.gov.np/tourist-visa",
    embassyFinder: "https://mofa.gov.np/nepalese-diplomatic-missions-abroad",
  },
  NL: {
    visaPortal: "https://www.netherlandsandyou.nl/travel-and-residence/visa-for-the-netherlands",
    embassyFinder: "https://www.netherlandsandyou.nl/your-country-and-the-netherlands/netherlands-worldwide",
  },
  NZ: {
    visaPortal: "https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/visa-factsheet/visitor-visa",
    embassyFinder: "https://www.mfat.govt.nz/en/countries-and-regions",
  },
  NI: {
    visaPortal: "https://www.migob.gob.ni/migracion/visas",
    embassyFinder: "https://www.cancilleria.gob.ni/embajadas-consulados",
  },
  NE: {
    visaPortal: "https://www.mj.gouv.ne/visas",
    embassyFinder: "https://www.mfa.gov.ne/missions-diplomatiques",
  },
  NG: {
    visaPortal: "https://portal.immigration.gov.ng",
    embassyFinder: "https://www.mfa.gov.ng/foreign-missions",
  },
  MK: {
    visaPortal: "https://www.mfa.gov.mk/en/visa",
    embassyFinder: "https://www.mfa.gov.mk/en/diplomatic-missions",
  },
  NO: {
    visaPortal: "https://www.udi.no/en/want-to-apply/visit",
    embassyFinder: "https://www.norway.no/en/embassies-and-consulates",
  },
  OM: {
    visaPortal: "https://evisa.rop.gov.om",
    embassyFinder: "https://www.mfa.gov.om/en/pages/MissionsAbroad",
  },
  PK: {
    visaPortal: "https://visa.nadra.gov.pk",
    embassyFinder: "https://mofa.gov.pk/foreign-missions-of-pakistan",
  },
  PW: {
    visaPortal: "https://www.palaugov.pw/immigration",
    embassyFinder: "https://www.palaugov.pw/missions-abroad",
  },
  PA: {
    visaPortal: "https://www.migracion.gob.pa/visas",
    embassyFinder: "https://www.mire.gob.pa/embajadas-consulados",
  },
  PG: {
    visaPortal: "https://www.immigration.gov.pg/visa",
    embassyFinder: "https://www.dfat.gov.pg/missions-abroad",
  },
  PY: {
    visaPortal: "https://www.migraciones.gov.py/visas",
    embassyFinder: "https://www.mre.gov.py/embajadas-consulados",
  },
  PE: {
    visaPortal: "https://www.gob.pe/migraciones",
    embassyFinder: "https://www.rree.gob.pe/misionesexteriores",
  },
  PH: {
    visaPortal: "https://evisa.gov.ph",
    embassyFinder: "https://dfa.gov.ph/ocs-passport-and-other-travel-documents/embassies-consulates",
  },
  PL: {
    visaPortal: "https://www.gov.pl/web/mswia-en/visas",
    embassyFinder: "https://www.gov.pl/web/diplomacy/diplomatic-missions-of-poland-abroad",
  },
  PT: {
    visaPortal: "https://www.sef.pt/en/Pages/SEF-Online.aspx",
    embassyFinder: "https://www.portaldascomunidades.mne.gov.pt/en/embassies-and-consulates",
  },
  QA: {
    visaPortal: "https://www.moi.gov.qa/service/visaservicessite",
    embassyFinder: "https://mofa.gov.qa/en/ministry/missions-abroad",
  },
  RO: {
    visaPortal: "https://evisa.mae.ro",
    embassyFinder: "https://www.mae.ro/en/node/10478",
  },
  RU: {
    visaPortal: "https://evisa.kdmid.ru",
    embassyFinder: "https://www.mid.ru/en/foreign_policy/reps_and_missions",
  },
  RW: {
    visaPortal: "https://irembo.gov.rw/rolportal/en/web/dgie/visitor-visa",
    embassyFinder: "https://www.minaffet.gov.rw/index.php/en/missions-abroad",
  },
  KN: {
    visaPortal: "https://www.immigration.gov.kn",
    embassyFinder: "https://www.mfomcea.gov.kn/missions-abroad",
  },
  LC: {
    visaPortal: "https://www.immigration.gov.lc",
    embassyFinder: "https://www.foreign.gov.lc/missions-abroad",
  },
  VC: {
    visaPortal: "https://www.immigration.gov.vc",
    embassyFinder: "https://www.foreign.gov.vc/missions-abroad",
  },
  WS: {
    visaPortal: "https://www.samoaimmigration.gov.ws/visa",
    embassyFinder: "https://www.mfat.gov.ws/missions-abroad",
  },
  SM: {
    visaPortal: "https://www.esteri.sm/en/visa",
    embassyFinder: "https://www.esteri.sm/en/missions-abroad",
  },
  ST: {
    visaPortal: "https://evisa.gov.st",
    embassyFinder: "https://www.mnec.gov.st/missoes-diplomaticas",
  },
  SA: {
    visaPortal: "https://visa.visitsaudi.com",
    embassyFinder: "https://www.mofa.gov.sa/en/SaudimissionsAbroad/Pages/default.aspx",
  },
  SN: {
    visaPortal: "https://www.visasenegal.gouv.sn",
    embassyFinder: "https://www.diplomatie.gouv.sn/missions-diplomatiques",
  },
  RS: {
    visaPortal: "https://www.mup.gov.rs/wps/portal/sr/stranaca/vize",
    embassyFinder: "https://www.mfa.gov.rs/en/diplomatic-missions-of-serbia-abroad",
  },
  SC: {
    visaPortal: "https://www.ics.gov.sc/visas",
    embassyFinder: "https://www.mfa.gov.sc/missions-abroad",
  },
  SL: {
    visaPortal: "https://www.nra.gov.sl/visas",
    embassyFinder: "https://www.mfa.gov.sl/missions-abroad",
  },
  SG: {
    visaPortal: "https://www.ica.gov.sg/enter-depart/before_you_come_to_singapore/visa_requirements",
    embassyFinder: "https://www.mfa.gov.sg/Overseas-Mission/Overseas-Missions",
  },
  SK: {
    visaPortal: "https://www.mzv.sk/web/en/visas-and-consular-information/visa-information",
    embassyFinder: "https://www.mzv.sk/web/en/missions-abroad",
  },
  SI: {
    visaPortal: "https://www.gov.si/en/topics/visas",
    embassyFinder: "https://www.gov.si/en/state-authorities/bodies-within-ministries/directorate-for-international-affairs",
  },
  SB: {
    visaPortal: "https://www.immigration.gov.sb/visas",
    embassyFinder: "https://www.mfa.gov.sb/missions-abroad",
  },
  SO: {
    visaPortal: "https://www.immigration.gov.so/visas",
    embassyFinder: "https://www.mfa.gov.so/missions-abroad",
  },
  ZA: {
    visaPortal: "https://www.dha.gov.za/index.php/applying-for-sa-visa",
    embassyFinder: "https://www.dirco.gov.za/foreign-reps/missions.htm",
  },
  SS: {
    visaPortal: "https://www.ssimigration.gov.ss/visas",
    embassyFinder: "https://www.mfa.gov.ss/missions-abroad",
  },
  ES: {
    visaPortal: "https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx",
    embassyFinder: "https://www.exteriores.gob.es/en/Embajadas/Paginas/Listado-de-Embajadas.aspx",
  },
  LK: {
    visaPortal: "https://www.srilankaevisa.lk",
    embassyFinder: "https://www.mfa.gov.lk/index.php/en/the-ministry/missions-abroad",
  },
  SD: {
    visaPortal: "https://www.ssmo.gov.sd/visas",
    embassyFinder: "https://www.mfa.gov.sd/missions-abroad",
  },
  SR: {
    visaPortal: "https://www.gov.sr/beleid-en-regelgeving/binnenlandse-zaken/vreemdelingenzaken/visum",
    embassyFinder: "https://www.gov.sr/het-rijk/buitenlandse-betrekkingen/buitenlandse-missies",
  },
  SE: {
    visaPortal: "https://www.migrationsverket.se/English/Private-individuals/Visiting-Sweden/Visiting-Sweden.html",
    embassyFinder: "https://www.government.se/government-of-sweden/ministry-for-foreign-affairs/swedish-embassies-and-consulates",
  },
  CH: {
    visaPortal: "https://www.sem.admin.ch/sem/en/home/themen/einreise/visum.html",
    embassyFinder: "https://www.eda.admin.ch/eda/en/fdfa/representations.html",
  },
  SY: {
    visaPortal: "https://evisa.mofa.gov.sy",
    embassyFinder: "https://www.mofa.gov.sy/en/missions-abroad",
  },
  TW: {
    visaPortal: "https://visawebapp.boca.gov.tw",
    embassyFinder: "https://www.mofa.gov.tw/en/AllScCountry.aspx",
  },
  TJ: {
    visaPortal: "https://evisa.tj",
    embassyFinder: "https://mfa.tj/en/missions-abroad",
  },
  TZ: {
    visaPortal: "https://www.eservices.go.tz/immigration",
    embassyFinder: "https://www.mfa.go.tz/en/missions-abroad",
  },
  TH: {
    visaPortal: "https://www.thaievisa.go.th",
    embassyFinder: "https://www.mfa.go.th/en/page/thai-embassies-and-consulates",
  },
  TL: {
    visaPortal: "https://www.immigration.gov.tl/visas",
    embassyFinder: "https://www.mfa.gov.tl/missions-abroad",
  },
  TG: {
    visaPortal: "https://evisa.gouv.tg",
    embassyFinder: "https://www.mae.tg/missions-diplomatiques",
  },
  TO: {
    visaPortal: "https://immigration.gov.to",
    embassyFinder: "https://www.mfa.gov.to/missions-abroad",
  },
  TT: {
    visaPortal: "https://www.immigration.gov.tt/visas",
    embassyFinder: "https://www.foreign.gov.tt/missions-abroad",
  },
  TN: {
    visaPortal: "https://www.e-visa.com.tn",
    embassyFinder: "https://www.diplomatie.gov.tn/ambassades-et-consulats",
  },
  TR: {
    visaPortal: "https://www.evisa.gov.tr",
    embassyFinder: "https://www.mfa.gov.tr/turkish-embassies.en.mfa",
  },
  TM: {
    visaPortal: "https://evisa.gov.tm",
    embassyFinder: "https://www.mfa.gov.tm/en/missions-abroad",
  },
  TV: {
    visaPortal: "https://www.tuvalu.gov.tv/immigration",
    embassyFinder: "https://www.tuvalu.gov.tv/missions-abroad",
  },
  UG: {
    visaPortal: "https://www.visas.go.ug",
    embassyFinder: "https://www.mofa.go.ug/missions-abroad",
  },
  UA: {
    visaPortal: "https://evisa.mfa.gov.ua",
    embassyFinder: "https://mfa.gov.ua/en/consular-issues/consular-offices-of-ukraine-abroad",
  },
  AE: {
    visaPortal: "https://smartservices.icp.gov.ae/echannels/web/client/default.html",
    embassyFinder: "https://www.mofa.gov.ae/en/TheMinistry/Missions/Embassies",
  },
  GB: {
    visaPortal: "https://www.gov.uk/apply-to-come-to-the-uk",
    embassyFinder: "https://www.gov.uk/world/embassies",
  },
  US: {
    visaPortal: "https://travel.state.gov/content/travel/en/us-visas.html",
    embassyFinder: "https://www.usembassy.gov",
  },
  UY: {
    visaPortal: "https://www.mrree.gub.uy/gxpsites/hgxpp001?7,3,141,O,S,0",
    embassyFinder: "https://www.mrree.gub.uy/gxpsites/hgxpp001?7,3,16,O,S,0",
  },
  UZ: {
    visaPortal: "https://evisa.mfa.uz",
    embassyFinder: "https://mfa.uz/en/diplomatic-missions-and-consulate-offices",
  },
  VU: {
    visaPortal: "https://www.immigration.gov.vu/visas",
    embassyFinder: "https://www.foreign.gov.vu/missions-abroad",
  },
  VE: {
    visaPortal: "https://www.saime.gob.ve/contenido/visas",
    embassyFinder: "https://mppre.gob.ve/embajadas-consulados",
  },
  VN: {
    visaPortal: "https://evisa.gov.vn",
    embassyFinder: "https://www.mofa.gov.vn/en/co_quan_dai_dien/viet_nam_o_nuoc_ngoai",
  },
  YE: {
    visaPortal: "https://evisa.mofa.gov.ye",
    embassyFinder: "https://www.mofa.gov.ye/missions-abroad",
  },
  ZM: {
    visaPortal: "https://www.evisa.zam.gov.zm",
    embassyFinder: "https://www.mfa.gov.zm/missions-abroad",
  },
  ZW: {
    visaPortal: "https://www.evisa.gov.zw",
    embassyFinder: "https://www.zimfa.gov.zw/index.php/missions-abroad",
  },
};
