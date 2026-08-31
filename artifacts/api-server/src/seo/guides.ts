// Renders the cornerstone editorial guides (/guides, /guides/{slug}).
import { countries } from "../data/countries";
import type { CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { GUIDES, type Guide, type PassportRoundup, type Article } from "../data/guidesData";
import { slugify, pairPath } from "./render";
import { page, esc, SITE_ORIGIN, DATA_LAST_UPDATED, REQ_COLOR } from "./hubLayout";

const YEAR = "2026";

function articleJsonLd(headline: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished: DATA_LAST_UPDATED,
    dateModified: DATA_LAST_UPDATED,
    inLanguage: "en",
    author: { "@type": "Organization", name: "isvisarequired.com" },
    publisher: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
    isPartOf: { "@type": "WebSite", name: "isvisarequired.com", url: SITE_ORIGIN },
  };
}
function breadcrumbJsonLd(name: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_ORIGIN}/guides` },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  };
}
function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

const SCHENGEN = ["AT","BE","BG","HR","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE","CH"];

// Tips computed from THIS passport's actual data. Previously every guide shared
// one hardcoded list, which (a) duplicated a whole section across 11 pages and
// (b) told nationalities who need a full Schengen visa that they'd need an
// ETIAS — advice that only applies to visa-exempt travellers.
function passportTips(
  from: CountryData,
  groups: Record<string, { c: CountryData; maxStay?: string }[]>,
  adjective: string,
): string[] {
  const vf = groups.visa_free, voa = groups.visa_on_arrival, ev = groups.e_visa;
  const tips: string[] = [];

  // Where this passport is strongest — genuinely varies per nationality.
  const byRegion = new Map<string, number>();
  for (const { c } of [...vf, ...voa]) byRegion.set(c.region, (byRegion.get(c.region) ?? 0) + 1);
  const strongest = [...byRegion].sort((a, b) => b[1] - a[1])[0];
  if (strongest && strongest[1] > 1) {
    tips.push(`Your easiest travel is in ${strongest[0]}: ${strongest[1]} destinations there admit ${adjective} passport holders visa-free or on arrival — usually the cheapest and least paperwork-heavy trips to plan.`);
  }

  // Europe: accurate for BOTH cases instead of assuming visa-exemption.
  const schengenFree = SCHENGEN.filter((code) => vf.some((x) => x.c.code === code)).length;
  if (schengenFree > 0) {
    tips.push(`You can enter ${schengenFree} Schengen countries visa-free, but from late 2026 visa-exempt travellers must hold an approved ETIAS authorisation before departure. It is not a visa, yet airlines will refuse boarding without it.`);
  } else {
    tips.push(`Europe's Schengen Area requires a full visa for ${adjective} passport holders — ETIAS does not apply to you. Apply at the consulate of your main destination (or first entry point), and start 4–6 weeks ahead, as appointment slots are the usual bottleneck.`);
  }

  if (ev.length) {
    tips.push(`${ev.length} destinations issue ${adjective} travellers an eVisa or online authorisation. These cannot be obtained at the airport — apply before you book non-refundable travel, and use only the official government portal, never a paid "visa service" lookalike.`);
  }
  if (voa.length) {
    tips.push(`For the ${voa.length} visa-on-arrival destinations, carry the exact fee in clean US dollars plus a printed return ticket and hotel booking — arrival counters frequently decline cards and ask for onward proof.`);
  }

  // Genuinely universal, but kept short so the data-specific tips lead.
  tips.push(`Visa-free never means unlimited: each country sets its own maximum stay, and overstaying risks fines, deportation or an entry ban. Check the permitted stay in the tables above for your exact destination.`);
  tips.push(`Keep at least six months' passport validity beyond your travel dates with two blank pages, and re-confirm the rule on the destination's official immigration site before booking — visa policy changes often.`);
  return tips;
}

function renderRoundup(g: PassportRoundup): string {
  const from = countries.find((c) => c.code === g.code);
  if (!from) return renderNotFound();

  const groups: Record<string, { c: CountryData; maxStay?: string }[]> = { visa_free: [], visa_on_arrival: [], e_visa: [] };
  for (const c of countries) {
    if (c.code === from.code) continue;
    const entry = getDefaultEntry(from.code, c.code);
    if (groups[entry.requirement]) groups[entry.requirement].push({ c, maxStay: entry.maxStay });
  }
  for (const k of Object.keys(groups)) groups[k].sort((a, b) => a.c.name.localeCompare(b.c.name));
  const vf = groups.visa_free.length, voa = groups.visa_on_arrival.length, ev = groups.e_visa.length;
  const noVisa = vf + voa;

  const url = `${SITE_ORIGIN}/guides/${g.slug}`;
  const title = `Visa-Free Countries for ${g.nationality} (${YEAR}) — Full List`;
  const description = `Where can ${g.nationality} travel without a visa in ${YEAR}? ${vf} visa-free countries, ${voa} visa on arrival and ${ev} eVisa destinations — with maximum stays and official details for each.`;
  const h1 = `Visa-free countries for ${g.nationality} (${YEAR})`;

  const table = (rows: { c: CountryData; maxStay?: string }[]) =>
    `<div class="card" style="padding:0;overflow-x:auto"><table><thead><tr><th>Destination</th><th>Max stay</th><th>Details</th></tr></thead><tbody>${rows
      .map(({ c, maxStay }) => `<tr><td>${esc(c.flag)} ${esc(c.name)}</td><td>${esc(maxStay || "—")}</td><td><a href="${pairPath(from, c)}">${esc(g.adjective)} → ${esc(c.name)} requirements →</a></td></tr>`)
      .join("")}</tbody></table></div>`;

  const tipsHtml = `<ul style="padding-left:20px;color:#334155">${passportTips(from, groups, g.adjective).map((t) => `<li style="margin:6px 0">${esc(t)}</li>`).join("")}</ul>`;

  const faqs = [
    { q: `How many countries can ${g.nationality} visit visa-free?`, a: `${g.adjective} passport holders can enter ${vf} countries and territories visa-free and a further ${voa} on a visa on arrival — ${noVisa} destinations in total with no visa arranged in advance. Another ${ev} are reachable with an online eVisa.` },
    { q: `What is the difference between visa-free and visa on arrival for ${g.adjective} travellers?`, a: `Visa-free means you are admitted on your passport alone. Visa on arrival means a visa is issued to you at the airport or border, usually for a fee — you still get it on the day, but you should carry the fee, a return ticket and a hotel booking.` },
    { q: `Do ${g.nationality} need proof of funds for visa-free travel?`, a: `Often, yes. Even where no visa is required, border officers may ask ${g.adjective} travellers for evidence of onward travel and sufficient funds. Carry a printed itinerary and recent bank statements to be safe.` },
    { q: `Is this list official?`, a: `No. isvisarequired.com compiles this from public government and IATA sources, last reviewed ${DATA_LAST_UPDATED}. Rules change often — always confirm with the destination's official immigration authority before booking.` },
  ];
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");

  const body = `
<nav class="crumbs"><a href="/">Home</a> › <a href="/guides">Guides</a> › Visa-free for ${esc(g.adjective)}</nav>
<h1>${esc(h1)}</h1>
<div class="updated">Last reviewed ${esc(DATA_LAST_UPDATED)} · ${vf} visa-free · ${voa} visa on arrival · ${ev} eVisa</div>
<p class="lead">${esc(g.intro)}</p>
<div class="stats">
  <div class="stat"><div class="n" style="color:${REQ_COLOR.visa_free}">${vf}</div><div class="k">Visa-free</div></div>
  <div class="stat"><div class="n" style="color:${REQ_COLOR.visa_on_arrival}">${voa}</div><div class="k">Visa on arrival</div></div>
  <div class="stat"><div class="n" style="color:${REQ_COLOR.e_visa}">${ev}</div><div class="k">eVisa online</div></div>
  <div class="stat"><div class="n">${noVisa}</div><div class="k">No advance visa</div></div>
</div>
<p><a class="cta" href="/visa-requirements/${slugify(from.name)}">See the full ${esc(g.adjective)} passport hub (all destinations) →</a></p>

<h2>What "visa-free" means for ${esc(g.adjective)} passport holders</h2>
<p style="color:#334155">Three categories let you travel with little or no paperwork. <strong>Visa-free</strong> means you are admitted on your passport alone. <strong>Visa on arrival</strong> means the visa is issued at the border, usually for a fee. An <strong>eVisa</strong> is applied for online before you fly. The tables below separate all three so you know exactly what to prepare.</p>

<h2>Visa-free destinations (${vf})</h2>
<p style="color:#334155">No visa needed — enter on a valid ${esc(g.adjective)} passport, within the maximum stay shown.</p>
${vf ? table(groups.visa_free) : "<p>No fully visa-free destinations are currently listed for this passport.</p>"}

<h2>Visa on arrival (${voa})</h2>
<p style="color:#334155">A visa is issued at the airport or border — carry the fee, a return ticket and accommodation details.</p>
${voa ? table(groups.visa_on_arrival) : "<p>No visa-on-arrival destinations are currently listed.</p>"}

<h2>eVisa / online authorisation (${ev})</h2>
<p style="color:#334155">Apply and pay online before you travel; you cannot get these at the airport.</p>
${ev ? table(groups.e_visa) : "<p>No eVisa destinations are currently listed.</p>"}

<h2>Practical tips before you travel</h2>
${tipsHtml}

<h2>How this list is compiled</h2>
<p style="color:#334155">Requirements are compiled from publicly available government and IATA Timatic-style sources and reviewed periodically (last reviewed ${esc(DATA_LAST_UPDATED)}). We show what is generally applicable to ordinary tourist passports; diplomatic, official and refugee travel documents can differ. Because visa policy changes frequently, treat this as a starting point and confirm with the destination's official immigration authority before booking. See our <a href="/methodology">data methodology</a> for details.</p>

<h2>Frequently asked questions</h2>
${faqHtml}

<div class="note" style="margin-top:20px">General guidance only — not an official government source. Always verify current requirements with the destination's embassy or official immigration website before you travel.</div>`;

  return page({
    title, description, canonical: url,
    jsonLd: [articleJsonLd(h1, description, url), breadcrumbJsonLd(`Visa-free countries for ${g.nationality}`, url), faqJsonLd(faqs)],
    body,
  });
}

function renderArticle(g: Article): string {
  const url = `${SITE_ORIGIN}/guides/${g.slug}`;
  const sections = g.sections.map((s) => `<h2>${esc(s.h2)}</h2>${s.html}`).join("\n");
  const faqHtml = g.faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");
  const body = `
<nav class="crumbs"><a href="/">Home</a> › <a href="/guides">Guides</a> › ${esc(g.h1)}</nav>
<h1>${esc(g.h1)}</h1>
<div class="updated">Last reviewed ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">${esc(g.intro)}</p>
<p><a class="cta" href="/">Check your visa requirement instantly →</a></p>
${sections}
<h2>Frequently asked questions</h2>
${faqHtml}
<div class="note" style="margin-top:20px">General guidance only — not an official government source. Requirements depend on your exact passport and destination; always confirm with official sources before travel.</div>`;
  return page({
    title: g.title, description: g.description, canonical: url,
    jsonLd: [articleJsonLd(g.h1, g.description, url), breadcrumbJsonLd(g.h1, url), faqJsonLd(g.faqs)],
    body,
  });
}

export function renderGuide(g: Guide): string {
  return g.kind === "passport-roundup" ? renderRoundup(g) : renderArticle(g);
}

export function renderGuidesHub(): string {
  const url = `${SITE_ORIGIN}/guides`;
  const cards = GUIDES.map((g) => {
    const t = g.kind === "passport-roundup" ? `Visa-free countries for ${g.nationality}` : g.h1;
    const d = g.kind === "passport-roundup" ? g.intro : g.intro;
    return `<a class="card" href="/guides/${g.slug}" style="display:block;text-decoration:none"><strong style="color:var(--navy);font-size:17px">${esc(t)}</strong><p style="color:#334155;margin:6px 0 0;font-size:14px">${esc(d.slice(0, 150))}${d.length > 150 ? "…" : ""}</p></a>`;
  }).join("");
  const body = `
<nav class="crumbs"><a href="/">Home</a> › Guides</nav>
<h1>Visa &amp; travel guides</h1>
<p class="lead">Practical, sourced guides to visa-free travel, visa types and entry requirements — with links to the exact requirements for your passport.</p>
${cards}`;
  return page({
    title: "Visa & Travel Guides — isvisarequired.com",
    description: "Practical, sourced guides to visa-free countries, visa on arrival, eVisas and travel authorisations for major passports.",
    canonical: url,
    jsonLd: [breadcrumbJsonLd("Guides", url)],
    body,
  });
}

function renderNotFound(): string {
  return page({
    title: "Guide not found — isvisarequired.com",
    description: "This guide could not be found.",
    canonical: `${SITE_ORIGIN}/guides`,
    jsonLd: [],
    body: `<h1>Guide not found</h1><p>Try the <a href="/guides">guides index</a> or the <a href="/">visa checker</a>.</p>`,
  });
}
