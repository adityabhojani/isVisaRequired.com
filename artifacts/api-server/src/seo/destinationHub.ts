// Rich, server-rendered DESTINATION HUB: /countries/{destination-slug}
// "{Country} Visa Requirements" — the mirror of the passport hub: which
// nationalities can enter {country} visa-free / on arrival / with an eVisa, plus
// the country's entry requirements (passport validity, funds, insurance,
// pre-authorisation). Real data only; links to the per-pair pages.
import type { CountryData } from "../data/countries";
import { countries } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { getEntryRules } from "../data/entryRequirements";
import { slugify, pairPath } from "./render";
import { page, esc, SITE_ORIGIN, DATA_LAST_UPDATED, REQ_COLOR } from "./hubLayout";

const YEAR = "2026";
const LEVEL_LABEL: Record<string, string> = { required: "Required", recommended: "Recommended", none: "Not required" };

export function renderDestinationHub(to: CountryData): string {
  const groups: Record<string, CountryData[]> = { visa_free: [], visa_on_arrival: [], e_visa: [], visa_required: [], no_admission: [] };
  for (const c of countries) {
    if (c.code === to.code) continue;
    const entry = getDefaultEntry(c.code, to.code);
    (groups[entry.requirement] ??= []).push(c);
  }
  for (const k of Object.keys(groups)) groups[k].sort((a, b) => a.name.localeCompare(b.name));

  const n = (k: string) => groups[k]?.length ?? 0;
  const vf = n("visa_free"), voa = n("visa_on_arrival"), ev = n("e_visa"), vr = n("visa_required");
  const rules = getEntryRules(to.code);

  const canonical = `${SITE_ORIGIN}/countries/${slugify(to.name)}`;
  const title = `${to.name} Visa Requirements (${YEAR}) — Who Needs a Visa?`;
  const description = `${to.name} visa requirements by nationality: ${vf} passports enter visa-free, ${voa} get a visa on arrival and ${ev} need an eVisa. Plus ${to.name} entry rules — passport validity, proof of funds and insurance — with official guidance.`;

  const statCards = [
    { n: vf, k: "Enter visa-free" },
    { n: voa, k: "Visa on arrival" },
    { n: ev, k: "eVisa / ETA" },
    { n: vr, k: "Need a visa" },
  ].map((s) => `<div class="stat"><div class="n">${s.n}</div><div class="k">${esc(s.k)}</div></div>`).join("");

  // Nationality lists (link each to the pair page from THAT passport to here)
  const listBlock = (key: string, heading: string, blurb: string) => {
    if (!n(key)) return "";
    const items = groups[key].map((c) => `<a href="${pairPath(c, to)}">${esc(c.flag)} ${esc(c.name)}</a>`).join("");
    return `<h2 id="${key}">${esc(heading)} <span style="color:${REQ_COLOR[key]}">(${n(key)})</span></h2>
<p style="color:#334155;margin:0 0 8px">${esc(blurb)}</p><div class="card cols">${items}</div>`;
  };

  const entryRow = (label: string, level: string, note?: string) =>
    `<tr><td>${esc(label)}</td><td><strong>${esc(LEVEL_LABEL[level] ?? level)}</strong>${note ? `<br><span style="color:#64748b;font-size:13px">${esc(note)}</span>` : ""}</td></tr>`;
  const vaxRows = (rules.vaccinations || []).map((v) =>
    `<tr><td>${esc(v.name)}</td><td><strong>${v.level === "required" ? "Required" : "Recommended"}</strong>${v.detail ? `<br><span style="color:#64748b;font-size:13px">${esc(v.detail)}</span>` : ""}</td></tr>`).join("");

  const preAuthHtml = rules.preAuth
    ? `<div class="note" style="background:#eff6ff;border-color:#bfdbfe;color:#1e3a8a">
        <strong>${esc(rules.preAuth.name)}:</strong> ${esc(rules.preAuth.applies)}${rules.preAuth.fee ? ` · Fee ${esc(rules.preAuth.fee)}` : ""}${rules.preAuth.url ? ` · <a href="${esc(rules.preAuth.url)}" rel="nofollow noopener" target="_blank">Official info</a>` : ""}</div>`
    : "";
  const notesHtml = (rules.notes && rules.notes.length)
    ? `<ul style="margin:8px 0 0;padding-left:20px;color:#334155">${rules.notes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`
    : "";

  const faqs = [
    { q: `Who needs a visa to visit ${to.name}?`, a: `${vr} nationalities must obtain a visa before travelling to ${to.name}, while ${vf} can enter visa-free, ${voa} receive a visa on arrival and ${ev} apply for an eVisa or travel authorisation online. Find your nationality in the lists above for exact details.` },
    { q: `How long must my passport be valid to enter ${to.name}?`, a: rules.passportValidity + "." },
    { q: `Do I need proof of funds or a return ticket for ${to.name}?`, a: `Return/onward ticket: ${(LEVEL_LABEL[rules.returnTicket] ?? rules.returnTicket).toLowerCase()}${rules.returnTicketNote ? ` (${rules.returnTicketNote})` : ""}. Proof of funds: ${(LEVEL_LABEL[rules.proofOfFunds] ?? rules.proofOfFunds).toLowerCase()}${rules.proofOfFundsNote ? ` (${rules.proofOfFundsNote})` : ""}.` },
    { q: `Is this ${to.name} visa information official?`, a: `No. isvisarequired.com offers general guidance compiled from public government and IATA sources, last reviewed ${DATA_LAST_UPDATED}. Always confirm current requirements with ${to.name}'s official immigration authority or nearest embassy before travel.` },
  ];
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");

  const related = countries
    .filter((c) => c.code !== to.code && ["US", "GB", "JP", "FR", "TH", "AE", "SG", "AU", "CA", "TR", "ID", "ES"].includes(c.code))
    .map((c) => `<a href="/countries/${slugify(c.name)}">${esc(c.flag)} ${esc(c.name)}</a>`).join("");

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Countries", item: `${SITE_ORIGIN}/countries` },
        { "@type": "ListItem", position: 3, name: to.name, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const body = `
<nav class="crumbs"><a href="/">Home</a> › <a href="/countries">Countries</a> › ${esc(to.name)}</nav>
<h1>${esc(to.flag)} ${esc(to.name)} visa requirements</h1>
<div class="updated">Requirements by nationality · Last reviewed ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">Do you need a visa for ${esc(to.name)}? It depends on your nationality. ${vf} passports can enter ${esc(to.name)} visa-free, ${voa} get a visa on arrival, ${ev} need an eVisa or travel authorisation, and ${vr} must apply for a visa in advance. Find your passport below, or review ${esc(to.name)}'s general entry requirements.</p>
<div class="stats">${statCards}</div>
<p><a class="cta" href="/?destinations=${to.code}">Check ${esc(to.name)} for your passport →</a></p>

<h2>${esc(to.name)} entry requirements (all travellers)</h2>
<div class="card" style="padding:0;overflow-x:auto"><table><tbody>
<tr><td>Passport validity</td><td><strong>${esc(rules.passportValidity)}</strong></td></tr>
${entryRow("Return / onward ticket", rules.returnTicket, rules.returnTicketNote)}
${entryRow("Proof of funds", rules.proofOfFunds, rules.proofOfFundsNote)}
${entryRow("Travel insurance", rules.travelInsurance, rules.travelInsuranceNote)}
${vaxRows}
</tbody></table></div>
${preAuthHtml}
${notesHtml}

${listBlock("visa_free", `Passports that enter ${to.name} visa-free`, `Citizens of these countries can enter ${to.name} without a visa for tourism or short stays.`)}
${listBlock("visa_on_arrival", `Visa on arrival for ${to.name}`, `These nationalities can obtain a visa at the ${to.name} border or airport.`)}
${listBlock("e_visa", `eVisa / travel authorisation for ${to.name}`, `These nationalities must apply online before travelling to ${to.name}.`)}
${listBlock("visa_required", `Nationalities that need a visa for ${to.name} in advance`, `Citizens of these countries must obtain a visa from a ${to.name} embassy or consulate before departure.`)}

<h2>Frequently asked questions</h2>
${faqHtml}
<h2>Other destinations</h2>
<div class="cols">${related}</div>
<div class="note" style="margin-top:20px">General guidance only — not an official government source. ${esc(to.name)}'s visa policy can change at any time; always confirm with its official immigration authority or embassy before booking travel.</div>`;

  return page({ title, description, canonical, jsonLd, body });
}
