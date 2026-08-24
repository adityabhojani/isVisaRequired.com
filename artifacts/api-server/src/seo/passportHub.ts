// Rich, server-rendered PASSPORT HUB: /visa-requirements/{passport-slug}
// "{Country} Passport Visa Requirements" — categorises every destination into
// visa-free / visa on arrival / eVisa / visa required, with counts, tables that
// link to the per-pair pages, an FAQ and structured data. Real data only.
import type { CountryData } from "../data/countries";
import { countries } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { slugify, pairPath } from "./render";
import { page, esc, SITE_ORIGIN, DATA_LAST_UPDATED, REQ_LABEL, REQ_COLOR } from "./hubLayout";
import { GUIDES } from "../data/guidesData";

const YEAR = "2026";
const CATS: { key: string; heading: string; blurb: (n: string) => string }[] = [
  { key: "visa_free", heading: "Visa-free destinations", blurb: (n) => `Countries ${n} passport holders can enter with no visa — just a valid passport.` },
  { key: "visa_on_arrival", heading: "Visa on arrival", blurb: (n) => `Countries where ${n} travellers get a visa at the border, no embassy visit needed.` },
  { key: "e_visa", heading: "eVisa / online authorisation", blurb: (n) => `Countries that require ${n} citizens to apply online before travel (eVisa or ETA).` },
  { key: "visa_required", heading: "Visa required in advance", blurb: (n) => `Countries where ${n} passport holders must obtain a visa before departure.` },
  { key: "no_admission", heading: "Entry not currently permitted", blurb: (n) => `Countries that do not currently admit ${n} passport holders.` },
];

const destHub = (c: CountryData) => `/countries/${slugify(c.name)}`;

export function renderPassportHub(from: CountryData): string {
  const groups: Record<string, { c: CountryData; maxStay?: string }[]> = {
    visa_free: [], visa_on_arrival: [], e_visa: [], visa_required: [], no_admission: [],
  };
  for (const c of countries) {
    if (c.code === from.code) continue;
    const entry = getDefaultEntry(from.code, c.code);
    (groups[entry.requirement] ??= []).push({ c, maxStay: entry.maxStay });
  }
  for (const k of Object.keys(groups)) groups[k].sort((a, b) => a.c.name.localeCompare(b.c.name));

  const n = (k: string) => groups[k]?.length ?? 0;
  const vf = n("visa_free"), voa = n("visa_on_arrival"), ev = n("e_visa"), vr = n("visa_required"), na = n("no_admission");
  const noVisaNeeded = vf + voa; // enter with no prior application
  const mobility = vf + voa + ev; // reachable without an embassy visa
  const total = vf + voa + ev + vr + na;

  const canonical = `${SITE_ORIGIN}/visa-requirements/${slugify(from.name)}`;
  const title = `${from.name} Passport Visa Requirements (${YEAR}) — Visa-Free, VoA & eVisa`;
  const description = `${from.name} passport holders can travel visa-free to ${vf} countries, get visa on arrival in ${voa} and an eVisa for ${ev}; ${vr} require a visa in advance. Full country-by-country list with fees, stay limits and official links.`;

  const statCards = [
    { n: vf, k: "Visa-free" },
    { n: voa, k: "Visa on arrival" },
    { n: ev, k: "eVisa / ETA" },
    { n: vr, k: "Visa required" },
    { n: mobility, k: "Total without an embassy visa" },
  ].map((s) => `<div class="stat"><div class="n">${s.n}</div><div class="k">${esc(s.k)}</div></div>`).join("");

  const sections = CATS.filter((cat) => n(cat.key) > 0).map((cat) => {
    const rows = groups[cat.key].map(({ c, maxStay }) =>
      `<tr><td><a href="${pairPath(from, c)}">${esc(c.flag)} ${esc(c.name)}</a></td><td>${esc(maxStay || "—")}</td><td><a href="${destHub(c)}" style="color:#64748b;font-weight:500">${esc(c.name)} entry rules →</a></td></tr>`,
    ).join("");
    return `<h2 id="${cat.key}">${esc(cat.heading)} <span style="color:${REQ_COLOR[cat.key]}">(${n(cat.key)})</span></h2>
<p style="color:#334155;margin:0 0 8px">${esc(cat.blurb(from.name))}</p>
<div class="card" style="padding:0;overflow-x:auto"><table><thead><tr><th>Destination</th><th>Max stay</th><th>More</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join("");

  // FAQ — genuine, answerable from the data on the page
  const topFree = groups["visa_free"].slice(0, 12).map((g) => g.c.name).join(", ");
  const faqs = [
    { q: `How many countries can ${from.name} passport holders visit visa-free?`, a: `${from.name} passport holders can enter ${vf} countries and territories visa-free, and a further ${voa} offer a visa on arrival — ${noVisaNeeded} destinations in total with no advance visa needed. Including eVisa/ETA destinations, ${mobility} countries are reachable without visiting an embassy.` },
    { q: `Which countries can ${from.name} citizens visit without a visa?`, a: vf ? `Visa-free destinations for ${from.name} citizens include ${esc(topFree)}${vf > 12 ? ", and more — see the full list above." : "."}` : `There are currently no fully visa-free destinations for ${from.name} passport holders; check the visa on arrival and eVisa lists above.` },
    { q: `How many countries require a visa for ${from.name} passport holders?`, a: `${vr} countries require ${from.name} passport holders to obtain a visa before travelling${na ? `, and ${na} do not currently permit entry` : ""}. The full list is above, each linking to the requirements, costs and official application link.` },
    { q: `Is this ${from.name} visa information official?`, a: `No. isvisarequired.com provides general guidance compiled from public government and IATA sources, last reviewed ${DATA_LAST_UPDATED}. Visa rules change often — always confirm with the destination's official immigration authority or embassy before you book or travel.` },
  ];
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${f.a}</p></div>`).join("");

  const related = countries
    .filter((c) => c.code !== from.code && ["US", "GB", "IN", "CN", "CA", "AU", "DE", "AE", "SG", "BR", "NG", "PH"].includes(c.code))
    .map((c) => `<a href="/visa-requirements/${slugify(c.name)}">${esc(c.flag)} ${esc(c.name)} passport</a>`)
    .join("");

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Passport visa requirements", item: `${SITE_ORIGIN}/visa-requirements` },
        { "@type": "ListItem", position: 3, name: `${from.name} passport`, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") } })),
    },
  ];

  // If we have a written guide for this passport, surface it prominently.
  const guide = GUIDES.find((g) => g.kind === "passport-roundup" && g.code === from.code);
  const guideCta = guide
    ? `<div class="card" style="border-color:#bfdbfe;background:#eff6ff"><strong>Read the full guide:</strong> <a href="/guides/${guide.slug}">Visa-free countries for ${esc(from.name)} passport holders (${YEAR})</a> — with practical tips, stay limits and how each category works.</div>`
    : "";

  const body = `
<nav class="crumbs"><a href="/">Home</a> › <a href="/visa-requirements">Passports</a> › ${esc(from.name)}</nav>
<h1>${esc(from.flag)} ${esc(from.name)} passport visa requirements</h1>
<div class="updated">Covering ${total} destinations · Last reviewed ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">Where can ${esc(from.name)} passport holders travel in ${YEAR}? This page lists the visa requirement for every country — ${vf} visa-free, ${voa} visa on arrival, ${ev} eVisa and ${vr} requiring a visa in advance. Select any destination for full details: visa type, permitted stay, fees, required documents and the official application link.</p>
<div class="stats">${statCards}</div>
<p><a class="cta" href="/?passport=${from.code}">Check a specific destination in the visa tool →</a></p>
${guideCta}
${sections}
<h2>Frequently asked questions</h2>
${faqHtml}
<h2>Other passports</h2>
<div class="cols">${related}</div>
<div class="note" style="margin-top:20px">This is general guidance, not an official government source. Visa policies can change at any time — always verify with the destination country's embassy or official immigration website before booking travel.</div>`;

  return page({ title, description, canonical, jsonLd, body });
}
