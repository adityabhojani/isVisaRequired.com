// Programmatic-SEO page rendering for every passport→destination pair.
//
// These are fully server-rendered HTML documents (not the SPA shell) so they are
// directly indexable: unique <title>/meta, canonical, FAQPage + BreadcrumbList
// JSON-LD, a visible "last updated" date, and rich pair-specific content. Each
// page is CDN-cached (see Cache-Control in the route), so serving ~38k pages
// on-demand is cheap.

import { countries, type CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { getVisaDetail, getCountryTouristInfo } from "../data/countryDetails";
import { officialLinks } from "../data/officialLinks";
import { getEntryRules } from "../data/entryRequirements";
import { demonym, demonymPlural } from "../data/demonyms";
import { getPairNote } from "../data/pairNotes";

// Canonical host (matches existing sitemap/robots). Keep in sync with robots.txt.
export const SITE_ORIGIN = "https://www.isvisarequired.com";

// Date the visa dataset was last reviewed. Bump when data is refreshed.
export const DATA_LAST_UPDATED = "2026-08-31";

// ── slug helpers ─────────────────────────────────────────────────────────────
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const byCode = new Map<string, CountryData>();
const bySlug = new Map<string, CountryData>();
for (const c of countries) {
  byCode.set(c.code, c);
  bySlug.set(slugify(c.name), c);
}

export function countryFromSlug(slug: string): CountryData | undefined {
  return bySlug.get(slug.toLowerCase());
}

export function pairPath(from: CountryData, to: CountryData): string {
  return `/visa-requirements/${slugify(from.name)}/${slugify(to.name)}`;
}

export function allCountries(): CountryData[] {
  return countries;
}

// ── small html utilities ─────────────────────────────────────────────────────
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Trim to a length without slicing a word in half — a meta description cut to
// "Fees, documents," reads as broken in the SERP.
function clampToWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:\s]+$/, "") + "…";
}

const REQUIREMENT_LABEL: Record<string, string> = {
  visa_free: "Visa-free",
  visa_on_arrival: "Visa on arrival",
  e_visa: "eVisa (apply online)",
  visa_required: "Visa required",
  no_admission: "Entry not permitted",
};

const REQUIREMENT_COLOR: Record<string, string> = {
  visa_free: "#10b981",
  visa_on_arrival: "#f59e0b",
  e_visa: "#0DB5E8",
  visa_required: "#ef4444",
  no_admission: "#6b7280",
};

// `from` is the demonym ("Nepali"), not the country name — searchers phrase these
// queries as "moroccan passport" / "as an icelandic person", and "Nepal passport
// holders" reads as broken English.
function answerSentence(req: string, from: string, to: string, maxStay?: string): string {
  const stay = maxStay && !maxStay.startsWith("Varies") ? ` for up to ${maxStay}` : "";
  switch (req) {
    case "visa_free":
      return `No — ${from} passport holders do not need a visa for short tourist stays in ${to}. You can enter visa-free${stay}.`;
    case "visa_on_arrival":
      return `${from} passport holders do not need a visa in advance for ${to} — a visa is issued on arrival at the border${stay}.`;
    case "e_visa":
      return `${from} passport holders need an eVisa for ${to}. It is applied for online before you travel${stay} — no embassy visit required.`;
    case "visa_required":
      return `Yes — ${from} passport holders need a visa to enter ${to}. It must be arranged in advance at an embassy or consulate of ${to} before you travel.`;
    case "no_admission":
      return `${from} passport holders are currently not permitted to enter ${to}. Check with your foreign ministry before making plans.`;
    default:
      return `Visa requirements for ${from} passport holders travelling to ${to}.`;
  }
}

// Counts how many of the 195 destinations this passport reaches without arranging
// a visa first. Real, per-passport context computed from data we already load —
// one of the few things that genuinely differentiates one pair page from the next.
const strengthCache = new Map<string, { open: number; total: number }>();
function passportStrength(code: string): { open: number; total: number } {
  const hit = strengthCache.get(code);
  if (hit) return hit;
  let open = 0;
  let total = 0;
  for (const c of countries) {
    if (c.code === code) continue;
    total++;
    const r = getDefaultEntry(code, c.code).requirement;
    if (r === "visa_free" || r === "visa_on_arrival") open++;
  }
  const out = { open, total };
  strengthCache.set(code, out);
  return out;
}

// A few destinations this passport CAN reach without a prior visa, preferring the
// passport's own region so the suggestions are plausible trips rather than trivia.
function easierDestinations(code: string, exclude: string, region: string, limit: number): CountryData[] {
  const open = countries.filter((c) => {
    if (c.code === code || c.code === exclude) return false;
    const r = getDefaultEntry(code, c.code).requirement;
    return r === "visa_free" || r === "visa_on_arrival";
  });
  const sameRegion = open.filter((c) => c.region === region);
  const rest = open.filter((c) => c.region !== region);
  return [...sameRegion, ...rest].slice(0, limit);
}

interface FaqItem {
  q: string;
  a: string;
}

// ── page renderer ────────────────────────────────────────────────────────────
export function renderPairPage(from: CountryData, to: CountryData): string {
  const entry = getDefaultEntry(from.code, to.code);
  const requirement = entry.requirement;
  const detail = getVisaDetail(from.code, to.code, requirement);
  const tourist = getCountryTouristInfo(to.code);
  const links = officialLinks[to.code] ?? null;

  const reqLabel = REQUIREMENT_LABEL[requirement] ?? "Check requirements";
  const reqColor = REQUIREMENT_COLOR[requirement] ?? "#0A2FA1";
  const maxStay = entry.maxStay || detail.maxStay || "Varies — check on entry";
  const fee =
    detail.feeUSD === 0
      ? "Free"
      : detail.feeUSD != null
        ? `≈ US$${detail.feeUSD}`
        : "Varies — check official portal";
  const processing = detail.processingDays || "Varies";
  const fromAdj = demonym(from.code, from.name);
  const fromPlural = demonymPlural(from.code, from.name);
  const answer = answerSentence(requirement, fromAdj, to.name, entry.maxStay);

  const canonical = `${SITE_ORIGIN}${pairPath(from, to)}`;
  const year = new Date(DATA_LAST_UPDATED).getFullYear();

  const shortReq: Record<string, string> = {
    visa_free: "No visa needed",
    visa_on_arrival: "Visa on arrival",
    e_visa: "eVisa required (apply online)",
    visa_required: "Visa required",
    no_admission: "Entry not permitted",
  };
  // Answer-first titles. The old template asked the question the searcher had
  // just typed and answered nothing, so there was no reason to click; the verdict
  // ("Visa required", "Visa-free 90 days") is the thing worth showing in the SERP.
  // The H1 below keeps the question form so the page still matches the long-tail
  // phrasing. Titles are built longest-first and fall back until one fits ~70 chars.
  const stayShort = entry.maxStay && !entry.maxStay.startsWith("Varies") ? entry.maxStay : "";
  const verdict =
    requirement === "visa_free" && stayShort
      ? `Visa-free ${stayShort}`
      : (shortReq[requirement] ?? reqLabel);
  const titleCandidates = [
    `${fromAdj} citizens travelling to ${to.name}: ${verdict} (${year})`,
    `${fromAdj} passport to ${to.name}: ${verdict} (${year})`,
    `${fromAdj} to ${to.name}: ${verdict} (${year})`,
    `${from.name} → ${to.name}: ${verdict}`,
  ];
  const title = titleCandidates.find((t) => t.length <= 70) ?? titleCandidates[titleCandidates.length - 1];

  // Lead with the verdict rather than withholding it. The old description ended
  // "Costs, documents & official links" without ever saying whether a visa was
  // needed, so the snippet gave nobody a reason to click.
  const metaVerdict: Record<string, string> = {
    visa_free: `No visa needed — ${fromAdj} passport holders can enter ${to.name} visa-free`,
    visa_on_arrival: `No advance visa — ${fromAdj} passport holders get a visa on arrival in ${to.name}`,
    e_visa: `${fromAdj} passport holders need an eVisa for ${to.name}, applied for online`,
    visa_required: `Yes — ${fromAdj} passport holders need a visa for ${to.name}, arranged in advance`,
    no_admission: `${fromAdj} passport holders cannot currently enter ${to.name}`,
  };
  const metaFactsRaw = [
    stayShort ? `stay up to ${stayShort}` : "",
    detail.feeUSD != null ? (detail.feeUSD === 0 ? "no fee" : `fee ≈US$${detail.feeUSD}`) : "",
  ].filter(Boolean).join(", ");
  const metaFacts = metaFactsRaw ? metaFactsRaw.charAt(0).toUpperCase() + metaFactsRaw.slice(1) : "";
  const metaDesc = clampToWord(
    `${metaVerdict[requirement] ?? reqLabel}.${metaFacts ? ` ${metaFacts}.` : ""} Documents, costs and official links — reviewed ${DATA_LAST_UPDATED}.`.replace(/\s+/g, " "),
    155,
  );

  // FAQ (kept identical between visible content and JSON-LD). Entries whose answer
  // is a non-answer ("Varies…") are dropped rather than shipped — they added
  // duplicate body text on every page while telling the reader nothing.
  const rules = getEntryRules(to.code);
  const strength = passportStrength(from.code);
  const candidateFaqs: Array<FaqItem | null> = [
    { q: `Do ${fromAdj} citizens need a visa to visit ${to.name}?`, a: answer },
    maxStay.startsWith("Varies")
      ? null
      : { q: `How long can ${fromAdj} passport holders stay in ${to.name}?`, a: `Maximum stay: ${maxStay}.` },
    detail.feeUSD != null
      ? { q: `How much does a visa for ${to.name} cost for ${fromAdj} citizens?`, a: `Typical fee: ${fee}. Fees can change — confirm on the official portal before applying.` }
      : null,
    processing.startsWith("Varies")
      ? null
      : { q: `How long does it take to get a visa for ${to.name}?`, a: `Processing time: ${processing}.` },
    detail.documents.length
      ? { q: `What documents do ${fromAdj} citizens need for ${to.name}?`, a: detail.documents.join("; ") + "." }
      : null,
    { q: `How long must my passport be valid to enter ${to.name}?`, a: rules.passportValidity },
    rules.preAuth
      ? { q: `Do ${fromAdj} travellers need ${rules.preAuth.name} for ${to.name}?`, a: `${rules.preAuth.name} applies to: ${rules.preAuth.applies}.${rules.preAuth.fee ? ` Fee: ${rules.preAuth.fee}.` : ""}${rules.preAuth.url ? ` Apply at ${rules.preAuth.url}` : ""}` }
      : null,
    {
      q: `How strong is the ${from.name} passport?`,
      a: `A ${from.name} passport reaches ${strength.open} of ${strength.total} other countries without arranging a visa in advance — either visa-free or with a visa on arrival. ${to.name} ${requirement === "visa_free" || requirement === "visa_on_arrival" ? "is one of them" : "is not one of them"}.`,
    },
  ];
  const faqs: FaqItem[] = candidateFaqs.filter((f): f is FaqItem => f !== null);
  const pairNoteForFaq = getPairNote(from.code, to.code);
  if (pairNoteForFaq?.applyAt) {
    faqs.push({
      q: `Where is the nearest ${to.name} embassy for ${fromPlural}?`,
      a: `${pairNoteForFaq.applyAt.mission}.${pairNoteForFaq.applyAt.address ? ` Address: ${pairNoteForFaq.applyAt.address}.` : ""}${pairNoteForFaq.applyAt.email ? ` Visa enquiries: ${pairNoteForFaq.applyAt.email}.` : ""}`,
    });
  }
  if (links?.visaPortal) {
    faqs.push({ q: `Where do ${fromAdj} citizens apply for a visa for ${to.name}?`, a: `Apply via the official portal: ${links.visaPortal}` });
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Visa requirements", item: SITE_ORIGIN + "/visa-requirements" },
      { "@type": "ListItem", position: 3, name: `${from.name} to ${to.name}`, item: canonical },
    ],
  };

  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: metaDesc,
    url: canonical,
    dateModified: DATA_LAST_UPDATED,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Is Visa Required?", url: SITE_ORIGIN },
  };

  // Related internal links (crawlable graph).
  //
  // These used to be `others.slice(0, 12)` and `others.slice(12, 24)` — the same
  // alphabetical block (Afghanistan…Bahamas, Bahrain…Brazil) on essentially every
  // page, so ~900k internal links all pointed at the same ~4,900 URLs and the vast
  // majority of pair pages received no internal links at all. Selecting by region
  // instead keeps the renderer pure and deterministic while making the links both
  // relevant to the reader and evenly spread across the site.
  const others = countries.filter((c) => c.code !== from.code && c.code !== to.code);
  const near = (list: CountryData[], region: string): CountryData[] => [
    ...list.filter((c) => c.region === region),
    ...list.filter((c) => c.region !== region),
  ];
  // Passports from the destination's own region, then further afield.
  const otherPassports = near(others, to.region).slice(0, 12);
  // Destinations near the one being viewed — the natural "where else round here".
  const otherDestinations = near(others, to.region).slice(12, 24);
  // Destinations this passport can actually reach without a prior visa.
  const openDestinations = easierDestinations(from.code, to.code, from.region, 12);

  const docsList = detail.documents.map((d) => `<li>${esc(d)}</li>`).join("");
  const processList = detail.process.map((p) => `<li>${esc(p)}</li>`).join("");

  const officialBlock = links
    ? `<section class="card"><h2>Official sources</h2>
        <p>Always confirm with the destination's official government portal before you travel:</p>
        <ul>
          <li><a href="${esc(links.visaPortal)}" rel="nofollow noopener" target="_blank">${esc(to.name)} official visa portal ↗</a></li>
          <li><a href="${esc(links.embassyFinder)}" rel="nofollow noopener" target="_blank">${esc(to.name)} embassies &amp; consulates ↗</a></li>
        </ul></section>`
    : "";

  // "Things that strand travelers" — entry requirements beyond the visa itself.
  const levelBadge = (lvl: string): string => {
    const map: Record<string, [string, string]> = {
      required: ["#ef4444", "Required"],
      recommended: ["#f59e0b", "Recommended"],
      none: ["#10b981", "Not required"],
    };
    const [color, label] = map[lvl] ?? ["#64748b", lvl];
    return `<span style="display:inline-block;background:${color};color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">${label}</span>`;
  };
  const reqRow = (label: string, lvl: string, note?: string): string =>
    `<li style="padding:6px 0;border-top:1px solid var(--line)"><strong>${esc(label)}</strong> ${levelBadge(lvl)}${note ? `<br><span style="color:#475569;font-size:14px">${esc(note)}</span>` : ""}</li>`;
  const vaxList = rules.vaccinations
    .map((v) => `<li style="padding:6px 0;border-top:1px solid var(--line)"><strong>${esc(v.name)}</strong> ${levelBadge(v.level)}${v.detail ? `<br><span style="color:#475569;font-size:14px">${esc(v.detail)}</span>` : ""}</li>`)
    .join("");
  const notesList = (rules.notes ?? []).map((n) => `<li>${esc(n)}</li>`).join("");
  const entryBlock = `<section class="card"><h2>Entry requirements for ${esc(to.name)}</h2>
      <p>Beyond the visa itself, these are the things travelers most often get turned away for — have them ready:</p>
      <ul class="facts" style="list-style:none;padding:0;margin:0">
        <li style="padding:6px 0"><strong>Passport validity:</strong> ${esc(rules.passportValidity)}</li>
        ${reqRow("Onward / return ticket", rules.returnTicket, rules.returnTicketNote)}
        ${reqRow("Proof of funds", rules.proofOfFunds, rules.proofOfFundsNote)}
        ${reqRow("Travel insurance", rules.travelInsurance, rules.travelInsuranceNote)}
        ${vaxList}
      </ul>
      ${notesList ? `<ul style="margin-top:10px">${notesList}</ul>` : ""}
      <p style="color:#64748b;font-size:13px;margin-top:10px">Requirements can vary by nationality and change without notice — confirm with the official sources above before you travel.</p>
    </section>`;

  const touristBlock = tourist
    ? `<section class="card"><h2>About ${esc(to.name)}</h2>
        <p>${esc(tourist.tagline)}</p>
        <ul class="facts">
          <li><strong>Capital:</strong> ${esc(tourist.capital)}</li>
          <li><strong>Currency:</strong> ${esc(tourist.currency)}</li>
          <li><strong>Language:</strong> ${esc(tourist.language)}</li>
          <li><strong>Time zone:</strong> ${esc(tourist.timezone)}</li>
          <li><strong>Best time to visit:</strong> ${esc(tourist.bestTimeToVisit)}</li>
        </ul></section>`
    : "";

  const faqHtml = faqs
    .map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`)
    .join("");

  const relatedPassports = otherPassports
    .map((c) => `<a href="${pairPath(c, to)}">${esc(c.flag)} ${esc(c.name)} → ${esc(to.name)}</a>`)
    .join("");
  const relatedDestinations = otherDestinations
    .map((c) => `<a href="${pairPath(from, c)}">${esc(from.name)} → ${esc(c.flag)} ${esc(c.name)}</a>`)
    .join("");
  const openDestinationLinks = openDestinations
    .map((c) => `<a href="${pairPath(from, c)}">${esc(c.flag)} ${esc(c.name)}</a>`)
    .join("");

  // Electronic travel authorisation for this destination. `rules.preAuth` has been
  // populated for a dozen destinations (ESTA, ETIAS, UK ETA, Canada eTA, Argentina's
  // AVE) but was never rendered on the pair pages — it is often the single most
  // useful thing on the page, because it can be the difference between a consular
  // appointment and an online form.
  const preAuthBlock = rules.preAuth
    ? `<section class="card"><h2>${esc(rules.preAuth.name)} — the online alternative</h2>
        <p><strong>Who it covers:</strong> ${esc(rules.preAuth.applies)}</p>
        ${rules.preAuth.fee ? `<p><strong>Fee:</strong> ${esc(rules.preAuth.fee)}</p>` : ""}
        ${rules.preAuth.url ? `<p><a href="${esc(rules.preAuth.url)}" rel="nofollow noopener" target="_blank">Official ${esc(rules.preAuth.name)} portal ↗</a></p>` : ""}
        <p style="color:#64748b;font-size:13px">Check the official portal for whether your nationality and documents qualify before assuming you can skip the consular visa.</p>
      </section>`
    : "";

  // Pair-specific note carried on the visa entry itself. This was previously parsed
  // and then silently discarded — only `entry.requirement` was read.
  const entryNoteBlock = entry.notes
    ? `<div class="answer" style="border-left-color:var(--accent);margin-top:-6px"><p style="font-size:16px">${esc(entry.notes)}</p></div>`
    : "";

  // Researched, route-specific guidance — the only content on the page written for
  // this exact passport/destination combination rather than derived from one side
  // of it. Answers "where do I actually apply?" and "does the online authorisation
  // cover my nationality?", which the generic blocks cannot.
  const pairNote = getPairNote(from.code, to.code);
  const pairNoteBlock = pairNote
    ? `<section class="card" style="border-left:6px solid var(--accent)">
        <h2>${esc(pairNote.headline)}</h2>
        ${pairNote.detail.map((p) => `<p>${esc(p)}</p>`).join("")}
        ${pairNote.applyAt ? `<p style="margin-top:12px"><strong>Where ${esc(fromPlural)} apply:</strong> ${esc(pairNote.applyAt.mission)}${pairNote.applyAt.address ? `<br>${esc(pairNote.applyAt.address)}` : ""}${pairNote.applyAt.email ? `<br>Visa enquiries: ${esc(pairNote.applyAt.email)}` : ""}<br><a href="${esc(pairNote.applyAt.url)}" rel="nofollow noopener" target="_blank">Official mission website ↗</a></p>` : ""}
        <p style="color:#64748b;font-size:13px;margin-top:10px">This route was last checked against official government sources on ${esc(pairNote.reviewed)}.</p>
      </section>`
    : "";

  const strengthBlock = `<section class="card"><h2>Context: how far the ${esc(from.name)} passport goes</h2>
      <p>A ${esc(from.name)} passport reaches <strong>${strength.open} of ${strength.total}</strong> other countries without arranging a visa in advance — visa-free or visa on arrival. ${esc(to.name)} ${requirement === "visa_free" || requirement === "visa_on_arrival" ? "is one of them." : "is <strong>not</strong> one of them, so plan the paperwork before you book."}</p>
      ${openDestinationLinks ? `<p style="margin-top:10px"><strong>Destinations ${esc(fromPlural)} can enter without a prior visa:</strong></p><div class="related">${openDestinationLinks}</div>` : ""}
    </section>`;

  const attractions = tourist?.attractions?.slice(0, 5) ?? [];
  const attractionsBlock = attractions.length
    ? `<section class="card"><h2>What to see in ${esc(to.name)}</h2>
        <ul class="facts">${attractions.map((a) => `<li style="padding:6px 0;border-top:1px solid var(--line)"><strong>${esc(a.name)}</strong> — ${esc(a.description)}${a.visitDuration ? ` <span style="color:#64748b">(${esc(a.visitDuration)})</span>` : ""}</li>`).join("")}</ul>
      </section>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:site_name" content="Is Visa Required?">
<meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(metaDesc)}">
<meta name="twitter:image" content="https://www.isvisarequired.com/opengraph.jpg">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(webpageJsonLd)}</script>
<style>
:root{--navy:#0A2FA1;--accent:#0DB5E8;--bg:#F7F9FC;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{color:var(--navy)}
.wrap{max-width:860px;margin:0 auto;padding:0 20px}
header.site{background:#fff;border-bottom:1px solid var(--line)}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{font-weight:800;color:var(--navy);text-decoration:none;font-size:18px}
.logo span{color:var(--accent)}
nav.crumbs{font-size:13px;color:var(--muted);padding:14px 0}
nav.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:28px;line-height:1.25;margin:6px 0 4px}
.updated{color:var(--muted);font-size:13px;margin-bottom:18px}
.answer{background:#fff;border:1px solid var(--line);border-left:6px solid ${reqColor};border-radius:12px;padding:18px 20px;margin-bottom:18px}
.badge{display:inline-block;background:${reqColor};color:#fff;font-weight:700;font-size:13px;padding:4px 10px;border-radius:999px;margin-bottom:8px}
.answer p{margin:6px 0 0;font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:18px 0}
.stat{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.stat .k{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}
.stat .v{font-size:17px;font-weight:700;margin-top:2px}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:16px 0}
.card h2{margin:0 0 10px;font-size:20px}
.facts{list-style:none;padding:0;margin:0}
.facts li{padding:3px 0}
.faq{border-top:1px solid var(--line);padding:12px 0}
.faq:first-of-type{border-top:0}
.faq h3{margin:0 0 4px;font-size:16px}
.faq p{margin:0;color:#334155}
.related a{display:block;padding:6px 0;text-decoration:none;font-size:14px}
.cta{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-top:6px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}
</style>
</head>
<body>
<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>
<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › <a href="/visa-requirements">Visa requirements</a> › ${esc(from.name)} → ${esc(to.name)}</nav>
<h1>Do ${esc(fromAdj)} citizens need a visa for ${esc(to.name)}?</h1>
<div class="updated">Last updated: ${esc(DATA_LAST_UPDATED)}</div>

<div class="answer">
  <span class="badge">${esc(reqLabel)}</span>
  <p>${esc(answer)}</p>
</div>
${entryNoteBlock}

<div class="grid">
  <div class="stat"><div class="k">Visa type</div><div class="v">${esc(reqLabel)}</div></div>
  <div class="stat"><div class="k">Max stay</div><div class="v">${esc(maxStay)}</div></div>
  <div class="stat"><div class="k">Typical fee</div><div class="v">${esc(fee)}</div></div>
  <div class="stat"><div class="k">Processing</div><div class="v">${esc(processing)}</div></div>
</div>

${pairNoteBlock}
${detail.documents.length ? `<section class="card"><h2>Documents ${esc(fromAdj)} applicants typically need</h2><ul>${docsList}</ul>${detail.notes ? `<p style="color:#64748b;font-size:13px;margin-top:8px">${esc(detail.notes)}</p>` : ""}</section>` : ""}
${detail.process.length ? `<section class="card"><h2>How to apply / enter</h2><ol>${processList}</ol></section>` : ""}
${preAuthBlock}
${entryBlock}
${officialBlock}
${strengthBlock}
${touristBlock}
${attractionsBlock}

<section class="card"><h2>Frequently asked questions</h2>${faqHtml}</section>

<section class="card">
  <h2>Check your own trip</h2>
  <p>Requirements depend on your exact passport and itinerary. Use the free interactive checker for live results, multi-country trips and transit.</p>
  <a class="cta" href="/?from=${esc(from.code)}&to=${esc(to.code)}">Open the visa checker →</a>
</section>

<section class="card related">
  <h2>${esc(to.name)} visa rules for other passports</h2>
  ${relatedPassports}
  <h2 style="margin-top:14px">Travelling from ${esc(from.name)} elsewhere in ${esc(to.region)}</h2>
  ${relatedDestinations}
</section>
</main>
<footer class="site"><div class="wrap">© isvisarequired.com — General guidance only; always confirm with official government sources before booking travel. Data last reviewed ${esc(DATA_LAST_UPDATED)}. · <a href="/methodology" style="color:inherit">How we source our data</a></div></footer>
</body>
</html>`;
}

// ── 404 for unknown pair slugs ───────────────────────────────────────────────
export function renderPairNotFound(): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found — isvisarequired.com</title>
<meta name="robots" content="noindex,follow">
<style>body{font-family:Inter,system-ui,sans-serif;background:#F7F9FC;color:#0f172a;text-align:center;padding:80px 20px}a{color:#0A2FA1}</style></head>
<body><h1>We couldn't find that page</h1><p>That passport or destination wasn't recognised.</p>
<p><a href="/">Go to the visa checker →</a></p></body></html>`;
}
