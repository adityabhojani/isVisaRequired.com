// Server-rendered digital-nomad-visa pages.
//
// The site already held a researched 36-country dataset, but it was only ever
// rendered client-side, so Search Console shows "visa requirements for digital
// nomads" earning impressions and no clicks — Google was ranking a React shell.
// These pages put the same data in indexable HTML: one comparison hub plus a
// page per country, each with its own income threshold, fee and official link.
import { digitalNomadVisas, type DigitalNomadVisa } from "../data/digitalNomadVisas";
import { SITE_ORIGIN, DATA_LAST_UPDATED, slugify } from "./render";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const STYLE = `:root{--navy:#0A2FA1;--accent:#0DB5E8;--bg:#F7F9FC;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{color:var(--navy)}.wrap{max-width:960px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{font-weight:800;color:var(--navy);text-decoration:none;font-size:18px}.logo span{color:var(--accent)}
nav.crumbs{font-size:13px;color:var(--muted);padding:14px 0}nav.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:30px;line-height:1.2;margin:6px 0 4px}h2{font-size:21px;margin:0 0 10px}
.updated{color:var(--muted);font-size:13px;margin-bottom:14px}.lead{font-size:18px;color:#334155}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:16px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:18px 0}
.stat{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.stat .k{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}.stat .v{font-size:16px;font-weight:700;margin-top:2px}
.tablewrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
table{border-collapse:collapse;width:100%;font-size:14px;min-width:640px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);background:#f8fafc;position:sticky;top:0}
tbody tr:nth-child(even){background:#fbfdff}
td a{text-decoration:none;font-weight:600}
.pill{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:#ecfdf5;color:#065f46}
.pill.no{background:#f1f5f9;color:#475569}
.faq{border-top:1px solid var(--line);padding:12px 0}.faq:first-of-type{border-top:0}
.faq h3{margin:0 0 4px;font-size:16px}.faq p{margin:0;color:#334155}
.cols{column-width:210px;column-gap:22px}.cols a{display:block;padding:5px 0;text-decoration:none;font-size:15px}
.cta{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-top:6px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}`;

const HEADER = `<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>`;
const FOOTER = `<footer class="site"><div class="wrap">© isvisarequired.com — income thresholds, fees and eligibility change often; always confirm on the official immigration site before applying. Last reviewed ${esc(DATA_LAST_UPDATED)}. · <a href="/methodology" style="color:inherit">How we source our data</a></div></footer>`;

// A country can run more than one qualifying programme — Costa Rica has both a
// Rentista visa and a dedicated digital nomad visa — so pages are grouped by
// country rather than by visa. Keying on the visa would give two entries the same
// slug and leave the second unreachable.
export interface NomadCountry {
  country: string;
  code: string;
  flag: string;
  region: string;
  visas: DigitalNomadVisa[];
}

const NOMAD_COUNTRIES: NomadCountry[] = (() => {
  const byCountry = new Map<string, NomadCountry>();
  for (const v of digitalNomadVisas) {
    const existing = byCountry.get(v.country);
    if (existing) existing.visas.push(v);
    else byCountry.set(v.country, { country: v.country, code: v.code, flag: v.flag, region: v.region, visas: [v] });
  }
  return [...byCountry.values()];
})();

export function nomadSlug(c: { country: string }): string {
  return slugify(c.country);
}

export function allNomadCountries(): NomadCountry[] {
  return NOMAD_COUNTRIES;
}

export function nomadFromSlug(slug: string): NomadCountry | undefined {
  const s = slug.toLowerCase();
  return NOMAD_COUNTRIES.find((c) => nomadSlug(c) === s);
}

// Monthly income thresholds are written as "€3,680" / "$2,000" / "£X". Parse a
// rough comparable number so the hub can sort cheapest-first and name the lowest
// bar honestly, rather than listing them alphabetically.
function monthlyIncomeValue(v: DigitalNomadVisa): number {
  if (!v.minMonthlyIncome) return -1;
  const digits = v.minMonthlyIncome.replace(/[^0-9.]/g, "");
  const n = parseFloat(digits);
  if (isNaN(n)) return -1;
  // Rough FX so a euro threshold sorts against a dollar one. Indicative only —
  // the page always shows the original currency, never a converted figure.
  const rate = v.minMonthlyIncome.includes("€") ? 1.08 : v.minMonthlyIncome.includes("£") ? 1.27 : 1;
  return n * rate;
}

function yesNo(b: boolean): string {
  return b ? `<span class="pill">Yes</span>` : `<span class="pill no">No</span>`;
}

const REGION_ORDER = ["Europe", "Latin America", "Caribbean", "Asia", "Middle East", "Africa"];

// ── hub: /digital-nomad-visas ────────────────────────────────────────────────
export function renderNomadHub(): string {
  const canonical = `${SITE_ORIGIN}/digital-nomad-visas`;
  // Programmes and countries are different numbers — Costa Rica runs two — so keep
  // them distinct rather than calling 37 visas "37 countries".
  const total = digitalNomadVisas.length;
  const countryCount = NOMAD_COUNTRIES.length;
  const noIncome = digitalNomadVisas.filter((v) => !v.minMonthlyIncome);
  const withIncome = digitalNomadVisas
    .filter((v) => monthlyIncomeValue(v) > 0)
    .sort((a, b) => monthlyIncomeValue(a) - monthlyIncomeValue(b));
  const cheapest = withIncome[0];
  const taxCount = digitalNomadVisas.filter((v) => v.taxBenefits).length;
  const renewCount = digitalNomadVisas.filter((v) => v.renewable).length;

  const year = new Date(DATA_LAST_UPDATED).getFullYear();
  const title = `Digital Nomad Visas: ${countryCount} Countries Compared (${year})`;
  const desc = `Income, fees and duration for ${total} digital nomad visas in ${countryCount} countries. ${noIncome.length} need no minimum income; the lowest that does is ${cheapest.country}, ${cheapest.minMonthlyIncome}/month.`;

  // Sorted cheapest-first, then the no-income-requirement countries — that is the
  // order someone actually shopping for one wants to read.
  const ordered = [...withIncome, ...noIncome];
  const rows = ordered
    .map((v) => `<tr>
      <td><a href="/digital-nomad-visas/${nomadSlug(v)}">${esc(v.flag)} ${esc(v.country)}</a><br><span style="color:#64748b;font-size:12px">${esc(v.visaName)}</span></td>
      <td>${v.minMonthlyIncome ? esc(v.minMonthlyIncome) : `<span style="color:#065f46;font-weight:600">None stated</span>`}</td>
      <td>${v.govFee ? esc(v.govFee) : "—"}</td>
      <td>${esc(v.duration)}</td>
      <td>${yesNo(v.renewable)}</td>
      <td>${yesNo(v.taxBenefits)}</td>
    </tr>`)
    .join("");

  const byRegion = REGION_ORDER.filter((r) => digitalNomadVisas.some((v) => v.region === r))
    .map((r) => {
      const list = digitalNomadVisas
        .filter((v) => v.region === r)
        .map((v) => `<a href="/digital-nomad-visas/${nomadSlug(v)}">${esc(v.flag)} ${esc(v.country)}</a>`)
        .join("");
      return `<h3 style="font-size:15px;margin:14px 0 4px">${esc(r)}</h3><div class="cols">${list}</div>`;
    })
    .join("");

  const faqs = [
    {
      q: "What is a digital nomad visa?",
      a: "A digital nomad visa is a residence permit that lets you live in a country while working remotely for an employer or clients outside it. It is not a tourist visa and not a local work permit — you are explicitly barred from taking a job in the local market, and you normally have to prove a minimum income earned abroad.",
    },
    {
      q: `How many countries offer a digital nomad visa?`,
      a: `We track ${countryCount} countries running ${total} dedicated digital nomad or remote-work visa programmes: ${REGION_ORDER.filter((r) => digitalNomadVisas.some((v) => v.region === r)).map((r) => `${NOMAD_COUNTRIES.filter((c) => c.region === r).length} in ${r}`).join(", ")}.`,
    },
    {
      q: "Which digital nomad visa has the lowest income requirement?",
      a: `Of the visas that state a figure, ${cheapest.country} is the lowest at ${cheapest.minMonthlyIncome} per month for its ${cheapest.visaName}. ${noIncome.length} of the ${total} programmes state no minimum monthly income at all: ${noIncome.slice(0, 6).map((v) => v.country).join(", ")}${noIncome.length > 6 ? " and others" : ""}.`,
    },
    {
      q: "Do digital nomad visas let you avoid tax?",
      a: `Not automatically. ${taxCount} of the ${total} programmes we track offer a specific tax concession, but the rest tax you under normal residency rules once you cross the local threshold — often 183 days. Your home country may also keep taxing you. Take advice before assuming a nomad visa lowers your tax bill.`,
    },
    {
      q: "Can a digital nomad visa be renewed?",
      a: `${renewCount} of the ${total} programmes are renewable, and several count towards permanent residency. The rest are fixed-term and require you to leave and reapply.`,
    },
    {
      q: "Do I still need a tourist visa to enter the country?",
      a: "Usually you need the nomad visa approved before you travel, and it replaces the tourist entry. Check your passport's normal requirement for that destination too — the visa checker on this site covers all 195 destinations.",
    },
    {
      q: "Is health insurance required for a digital nomad visa?",
      a: `${digitalNomadVisas.filter((v) => v.insuranceRequired).length} of the ${total} programmes require private health insurance covering the whole stay. Several specify a minimum coverage amount, so read the official requirements before buying a policy.`,
    },
  ];
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");

  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const itemListJsonLd = {
    "@context": "https://schema.org", "@type": "ItemList",
    name: title,
    numberOfItems: total,
    itemListElement: ordered.map((v, i) => ({
      "@type": "ListItem", position: i + 1, name: `${v.country} — ${v.visaName}`,
      url: `${SITE_ORIGIN}/digital-nomad-visas/${nomadSlug(v)}`,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Digital nomad visas", item: canonical },
    ],
  };
  const webpageJsonLd = {
    "@context": "https://schema.org", "@type": "WebPage",
    name: title, description: desc, url: canonical, dateModified: DATA_LAST_UPDATED, inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Is Visa Required?", url: SITE_ORIGIN },
  };

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:site_name" content="Is Visa Required?"><meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="https://www.isvisarequired.com/opengraph.jpg">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(itemListJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(webpageJsonLd)}</script>
<style>${STYLE}</style></head>
<body>${HEADER}<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › Digital nomad visas</nav>
<h1>Digital nomad visas: all ${countryCount} countries compared</h1>
<div class="updated">Last reviewed: ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">${countryCount} countries now issue a visa that lets you live there while working remotely for clients or an employer somewhere else. They differ most on one thing — how much you must prove you earn. Here is every programme, sorted from the lowest income requirement upwards.</p>

<div class="grid">
  <div class="stat"><div class="k">Countries</div><div class="v">${countryCount}</div></div>
  <div class="stat"><div class="k">No income minimum</div><div class="v">${noIncome.length}</div></div>
  <div class="stat"><div class="k">Lowest stated</div><div class="v">${esc(cheapest.minMonthlyIncome ?? "")}/mo</div></div>
  <div class="stat"><div class="k">Renewable</div><div class="v">${renewCount} of ${total}</div></div>
</div>

<section class="card">
  <h2>Every digital nomad visa, cheapest income requirement first</h2>
  <div class="tablewrap"><table>
    <thead><tr><th>Country &amp; visa</th><th>Min. monthly income</th><th>Government fee</th><th>Duration</th><th>Renewable</th><th>Tax perk</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p style="color:#64748b;font-size:13px;margin-top:10px">Income figures are as published by each government, in the original currency. Sorting compares them at indicative exchange rates only — no converted figure is shown or implied.</p>
</section>

<section class="card"><h2>Browse by region</h2>${byRegion}</section>

<section class="card"><h2>Frequently asked questions</h2>${faqHtml}</section>

<section class="card">
  <h2>Check whether you can even enter first</h2>
  <p>A nomad visa is separate from your passport's ordinary entry requirement. Check what your passport needs for any of the ${total} destinations above.</p>
  <a class="cta" href="/">Open the visa checker →</a>
</section>
</main>${FOOTER}</body></html>`;
}

// ── per-country: /digital-nomad-visas/:slug ──────────────────────────────────
export function renderNomadCountry(c: NomadCountry): string {
  // The primary programme drives the headline facts; any others are listed after.
  const v = c.visas[0];
  const extra = c.visas.slice(1);
  const canonical = `${SITE_ORIGIN}/digital-nomad-visas/${nomadSlug(c)}`;
  const year = new Date(DATA_LAST_UPDATED).getFullYear();
  // Longest form that fits ~70 chars, so long country names don't get truncated
  // in the SERP.
  const title = [
    `${c.country} Digital Nomad Visa (${year}): income, fee & how to apply`,
    `${c.country} Digital Nomad Visa (${year}): income & fees`,
    `${c.country} Digital Nomad Visa (${year})`,
  ].find((t) => t.length <= 70) ?? `${c.country} Digital Nomad Visa`;
  const incomeShort = v.minMonthlyIncome ? `${v.minMonthlyIncome}/month` : "no stated income minimum";
  const desc = `${c.country}'s ${v.visaName}: ${incomeShort}, ${v.govFee ? `fee ${v.govFee}, ` : ""}valid ${v.duration}${v.renewable ? ", renewable" : ""}. Requirements and the official application link.`.slice(0, 158);

  const faqs = [
    {
      q: `What is the income requirement for the ${v.country} digital nomad visa?`,
      a: v.minMonthlyIncome
        ? `${v.country} requires proof of ${v.minMonthlyIncome} per month${v.minAnnualIncome ? ` (about ${v.minAnnualIncome} a year)` : ""} for its ${v.visaName}. The income must come from outside ${v.country}.`
        : `${v.country} does not publish a minimum monthly income for its ${v.visaName}. You will still normally need to show you can support yourself — check the official requirements for what evidence is accepted.`,
    },
    {
      q: `How much does the ${v.country} digital nomad visa cost?`,
      a: v.govFee
        ? `The government fee is ${v.govFee}. That excludes insurance, translations, document legalisation and any agent fees.`
        : `${v.country} does not publish a single headline fee for this visa — check the official portal for the current schedule of charges.`,
    },
    { q: `How long is the ${v.country} digital nomad visa valid?`, a: `${v.duration}. ${v.renewable ? "It can be renewed." : "It is not renewable — you would need to leave and reapply."}` },
    { q: `Does the ${v.country} digital nomad visa offer a tax break?`, a: v.taxBenefits ? `Yes — ${v.country} offers a specific tax concession to holders of this visa. Confirm how it interacts with tax in your home country before relying on it.` : `No specific tax concession comes with this visa. Once you pass ${v.country}'s residency threshold you are generally taxed under normal rules, and your home country may keep taxing you too.` },
    { q: `Do I need health insurance for the ${v.country} digital nomad visa?`, a: v.insuranceRequired ? `Yes — private health insurance covering your stay in ${v.country} is required.` : `${v.country} does not list health insurance as a mandatory condition of this visa, but travelling without cover is a poor idea and some consulates ask for it anyway.` },
    { q: `Can I work for a local ${v.country} employer on this visa?`, a: v.businessRequired ? `No. This visa is for income earned outside ${v.country} — you must show an employment contract, client contracts or a business registered abroad. Taking a local job needs a different permit.` : `This visa is intended for remote income earned outside ${v.country}. Local employment normally requires a separate work permit.` },
  ];
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");

  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Digital nomad visas", item: `${SITE_ORIGIN}/digital-nomad-visas` },
      { "@type": "ListItem", position: 3, name: `${v.country} digital nomad visa`, item: canonical },
    ],
  };
  const webpageJsonLd = {
    "@context": "https://schema.org", "@type": "WebPage",
    name: title, description: desc, url: canonical, dateModified: DATA_LAST_UPDATED, inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Is Visa Required?", url: SITE_ORIGIN },
  };

  const sameRegion = NOMAD_COUNTRIES
    .filter((x) => x.region === c.region && x.country !== c.country)
    .map((x) => `<a href="/digital-nomad-visas/${nomadSlug(x)}">${esc(x.flag)} ${esc(x.country)}</a>`)
    .join("");

  // A country running more than one qualifying route (Costa Rica's Rentista visa
  // alongside its digital nomad visa) gets each alternative spelled out.
  const extraBlock = extra.length
    ? `<section class="card"><h2>Other routes ${esc(c.country)} offers</h2>
        ${extra.map((x) => `<div class="faq"><h3>${esc(x.visaName)}</h3><p>${x.minMonthlyIncome ? `Requires ${esc(x.minMonthlyIncome)} per month. ` : "No stated monthly income minimum. "}${x.govFee ? `Fee ${esc(x.govFee)}. ` : ""}Valid ${esc(x.duration)}${x.renewable ? ", renewable" : ", not renewable"}.${x.notes ? ` ${esc(x.notes)}` : ""}</p></div>`).join("")}
      </section>`
    : "";

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:site_name" content="Is Visa Required?"><meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="https://www.isvisarequired.com/opengraph.jpg">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(webpageJsonLd)}</script>
<style>${STYLE}</style></head>
<body>${HEADER}<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › <a href="/digital-nomad-visas">Digital nomad visas</a> › ${esc(v.country)}</nav>
<h1>${esc(v.flag)} ${esc(v.country)} digital nomad visa</h1>
<div class="updated">Last reviewed: ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">${esc(v.country)} issues the <strong>${esc(v.visaName)}</strong> for people working remotely for employers or clients outside the country. ${v.minMonthlyIncome ? `You must prove income of ${esc(v.minMonthlyIncome)} a month.` : `It states no minimum monthly income.`}</p>

<div class="grid">
  <div class="stat"><div class="k">Min. monthly income</div><div class="v">${v.minMonthlyIncome ? esc(v.minMonthlyIncome) : "None stated"}</div></div>
  <div class="stat"><div class="k">Government fee</div><div class="v">${v.govFee ? esc(v.govFee) : "Not published"}</div></div>
  <div class="stat"><div class="k">Duration</div><div class="v">${esc(v.duration)}</div></div>
  <div class="stat"><div class="k">Renewable</div><div class="v">${v.renewable ? "Yes" : "No"}</div></div>
</div>

<section class="card"><h2>What you need to qualify</h2>
<ul>
  <li><strong>Remote income from outside ${esc(v.country)}</strong>${v.minMonthlyIncome ? ` of at least ${esc(v.minMonthlyIncome)} per month${v.minAnnualIncome ? ` (roughly ${esc(v.minAnnualIncome)} annually)` : ""}` : " — no figure is published, but you must still show you can support yourself"}.</li>
  <li><strong>Proof of that income:</strong> ${v.businessRequired ? "an employment contract, client contracts or a business registered outside the country, plus bank statements" : "bank statements and evidence of ongoing remote work"}.</li>
  <li><strong>Health insurance:</strong> ${v.insuranceRequired ? `required for the whole period of stay` : `not listed as mandatory, though it is strongly advised`}.</li>
  <li><strong>Valid passport</strong> covering the full length of the permit, plus the usual clean criminal record check.</li>
</ul>
${v.notes ? `<p style="margin-top:10px">${esc(v.notes)}</p>` : ""}
</section>

<section class="card"><h2>Tax and residency</h2>
<p>${v.taxBenefits
  ? `${esc(v.country)} attaches a specific tax concession to this visa. That does not make you tax-free: your home country may continue to tax you, and concessions usually carry conditions on where your income arises.`
  : `This visa carries no special tax concession. Once you pass ${esc(v.country)}'s residency threshold — commonly 183 days in a year — you can become liable for local tax on top of whatever your home country charges.`}</p>
<p style="color:#64748b;font-size:13px">This is general information, not tax advice. Cross-border tax turns on your own circumstances and any treaty between the two countries.</p>
</section>

${extraBlock}
<section class="card"><h2>Official source</h2>
<p><a href="${esc(v.officialUrl)}" rel="nofollow noopener" target="_blank">${esc(v.country)} official immigration portal ↗</a></p>
<p style="color:#64748b;font-size:13px">Apply only through the official portal. Income thresholds and fees are changed frequently and without notice — confirm them there before you commit to anything.</p></section>

<section class="card"><h2>Frequently asked questions</h2>${faqHtml}</section>

<section class="card">
  <h2>Can you enter ${esc(v.country)} in the first place?</h2>
  <p>The nomad visa is separate from your passport's ordinary entry requirement. Check what your passport needs for ${esc(v.country)}.</p>
  <a class="cta" href="/">Open the visa checker →</a>
</section>

${sameRegion ? `<section class="card"><h2>Other digital nomad visas in ${esc(v.region)}</h2><div class="cols">${sameRegion}</div>
<p style="margin-top:10px"><a href="/digital-nomad-visas">Compare all ${digitalNomadVisas.length} digital nomad visas →</a></p></section>` : ""}
</main>${FOOTER}</body></html>`;
}
