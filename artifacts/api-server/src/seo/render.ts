// Programmatic-SEO page rendering for every passport→destination pair.
//
// These are fully server-rendered HTML documents (not the SPA shell) so they are
// directly indexable: unique <title>/meta, canonical, FAQPage + BreadcrumbList
// JSON-LD, and rich pair-specific content. Each
// page is CDN-cached (see Cache-Control in the route), so serving ~38k pages
// on-demand is cheap.

import { guideLinksForPair } from "./guideLinks";
import { exemptionsFor, DOCUMENT_LABEL } from "../data/conditionalExemptions";
import { FONT_LINKS, BASE_STYLE, renderHeader, renderFooter, renderKeepGoing } from "./shell";
import { countries, type CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { getVisaDetail, getCountryTouristInfo } from "../data/countryDetails";
import { officialLinks } from "../data/officialLinks";
import { getEntryRules, hasSpecificRules } from "../data/entryRequirements";
import { verdictKind, verdictStatus, statusIconSvg, isKnownFact, unknownFactsSentence, needsApplication, type VerdictKind } from "@workspace/travel-data";

// Canonical host (matches existing sitemap/robots). Keep in sync with robots.txt.
export const SITE_ORIGIN = "https://www.isvisarequired.com";

// Date the visa dataset was last reviewed. Bump when data is refreshed.
//
// Machine-readable only: it feeds sitemap <lastmod>, JSON-LD dateModified and
// the year in page titles. It is deliberately NOT printed on any page. A
// hand-bumped site-wide date that nobody remembers to bump makes the whole site
// look abandoned the week after it was set. Where freshness genuinely matters —
// an individually verified rule — the page names the source and the date that
// rule was checked instead (see entry.verifiedSource below).
export const DATA_LAST_UPDATED = "2026-09-12";

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

function answerSentence(kind: VerdictKind, from: string, to: string): string {
  switch (kind) {
    case "visa_free":
      return `No — ${from} passport holders do not need a visa for short tourist stays in ${to}. You can enter visa-free.`;
    case "visa_on_arrival":
      return `${from} passport holders do not need a visa in advance for ${to} — a visa is issued on arrival at the border.`;
    case "eta":
      return `${from} passport holders need an electronic travel authorisation for ${to} — an online approval you apply for and must hold before you board.`;
    case "e_visa":
      return `${from} passport holders need an eVisa for ${to}. It is applied for online before you travel — no embassy visit required.`;
    case "visa_required":
      return `Yes — ${from} passport holders need a visa to enter ${to}. It must be arranged in advance, usually at an embassy or consulate.`;
    case "no_admission":
      return `${from} passport holders are currently not permitted to enter ${to}. Check with your foreign ministry before making plans.`;
    default:
      return `Visa requirements for ${from} passport holders travelling to ${to}.`;
  }
}

interface FaqItem {
  q: string;
  a: string;
}

// ── page renderer ────────────────────────────────────────────────────────────
//
// The page is built around ONE answer. Until 2026-09 the verdict was a 13px
// white-on-colour pill (2.15–3.76:1 contrast, four of five statuses failing
// WCAG AA) while four 17px bold stat cards sat beneath it — and on 20,038 of
// 39,402 pairs three of those four said "Varies". The largest type on the page
// was spent saying "we don't know". Now the answer is the largest thing on the
// page, known facts are chips, unknown ones are one quiet honest sentence, and
// the same field is never shown as both.
//
// Where the words and colours come from: lib/travel-data/src/visaStatus.ts,
// shared with the React app, so the two can no longer disagree.


/** Hostname for the official-link button, so the reader sees where they're going. */
function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

export function renderPairPage(from: CountryData, to: CountryData): string {
  const entry = getDefaultEntry(from.code, to.code);
  const requirement = entry.requirement;
  const kind: VerdictKind = verdictKind(requirement, entry.notes, entry.maxStay);
  const status = verdictStatus(kind);
  const detail = getVisaDetail(from.code, to.code, requirement);
  const tourist = getCountryTouristInfo(to.code);
  const links = officialLinks[to.code] ?? null;
  const blocked = requirement === "no_admission";

  // ── facts: known vs unknown ────────────────────────────────────────────────
  // getVisaDetail() is keyed on destination + requirement and never reads the
  // passport, so everything below except entry.maxStay and a handful of fee
  // overrides is a per-visa-type template. Only genuine values become chips.
  const stayValue = entry.maxStay || detail.maxStay;
  const stayKnown = isKnownFact(stayValue);
  const feeKnown = detail.feeUSD != null;
  const feeText = detail.feeUSD === 0 ? (requirement === "visa_free" ? "No visa fee" : "No fee") : feeKnown ? `Fee ≈ US$${detail.feeUSD}` : null;

  const chips: string[] = [];
  if (!blocked && stayKnown) chips.push(`Stay up to ${stayValue}`);
  if (!blocked && feeText) chips.push(feeText);

  // The hint is a promise that must be true of every pair of this kind. The
  // visa-free hint is about the stay, so it is shown only when the stay is NOT
  // known — never "stay is set at the border" beside "Stay up to 90 days".
  const showHint = kind !== "visa_free" || !stayKnown;

  const unknown: string[] = [];
  if (!blocked && kind !== "visa_free" && !stayKnown) unknown.push("permitted stay");
  if (!blocked && !feeKnown) unknown.push("fee");
  if (!blocked && needsApplication(kind)) unknown.push("processing time");
  const unknownNote = blocked ? "" : unknownFactsSentence(unknown, kind);

  // Notes such as "ETA required (AUD 20)" or "NZeTA required" name the scheme;
  // the loader's generic "Electronic Travel Authorization required" adds nothing
  // the verdict doesn't already say.
  const note = entry.notes && entry.notes !== "Electronic Travel Authorization required" ? entry.notes : "";

  const answer = answerSentence(kind, from.name, to.name);
  const [keepGuide, keepGuide2] = guideLinksForPair(requirement, `${from.code}${to.code}`);

  const officialHost = links?.visaPortal ? hostOf(links.visaPortal) : "";
  // "Official visa information", never "Apply": only some visaPortal URLs are
  // application forms — Japan's is a MOFA information page — and the button
  // must not promise a form the link doesn't lead to.
  const officialButton = !blocked && links?.visaPortal
    ? `<a class="cta official" href="${esc(links.visaPortal)}" rel="nofollow noopener" target="_blank" aria-label="Official visa information for ${esc(to.name)}, on ${esc(officialHost)} (opens in a new tab)">Official visa information ↗<small>${esc(to.name)} · ${esc(officialHost)}</small></a>`
    : "";

  const provenance = entry.verifiedSource
    ? `<span class="verified">${statusIconSvg("visa_free", 14)} Individually verified against ${esc(entry.verifiedSource)}${entry.verifiedOn ? ` on ${esc(entry.verifiedOn)}` : ""}.</span>`
    : `Source: the open Passport Index dataset, with corrections checked against official government sites.`;

  const verdictCard = `
<section class="verdict" aria-labelledby="verdict-word" style="--v-ink:${status.ink};--v-tint:${status.tint};--v-line:${status.line};--v-solid:${status.solid}">
  <p class="route">${esc(from.flag)} ${esc(from.name)} passport <span aria-hidden="true">→</span> ${esc(to.flag)} ${esc(to.name)}</p>
  <p class="vword" id="verdict-word"><span class="vicon">${statusIconSvg(kind, 24)}</span><span>${esc(status.verdictWord)}</span></p>
  ${showHint ? `<p class="vhint">${esc(status.hint)}</p>` : ""}
  ${note ? `<p class="vnote">${esc(note)}</p>` : ""}
  ${chips.length ? `<ul class="vfacts">${chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
  <p class="vanswer">${esc(answer)}</p>
  ${unknownNote ? `<p class="vunknown">${esc(unknownNote)}</p>` : ""}
  ${officialButton ? `<div class="vactions">${officialButton}</div>` : ""}
  <p class="vsource">${provenance} <a href="/methodology">How we source this</a> · <a href="/contact">Report an error</a></p>
</section>`;

  // Conditional exemptions. Presented as an ADDITIONAL sourced path, never as a
  // silent rewrite of the headline verdict: we cannot see the reader's other
  // documents, and telling someone they are exempt when they are not is the one
  // error that gets them denied boarding.
  const exemptions = requirement === "visa_free" || blocked ? [] : exemptionsFor(from.code, to.code);
  const exemptionBlock = exemptions.map((e) => `
<section class="card exemption">
  <h2>You may not need this visa</h2>
  <p>${esc(to.name)} waives its visa requirement for travellers who already hold a second document. If you hold ${e.documents.map((d) => `<strong>${esc(DOCUMENT_LABEL[d])}</strong>`).join(", or ")}, this rule may apply to you.</p>
  <p><strong>What it grants:</strong> ${esc(e.grants)}<br><strong>Covers:</strong> ${esc(e.purposes)}</p>
  <p style="margin-bottom:6px"><strong>You must also satisfy:</strong></p>
  <ul>${e.conditions.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
  <p class="small">Verified against <a href="${esc(e.source)}" target="_blank" rel="noopener noreferrer">${esc(e.sourceName)}</a> on ${esc(e.verifiedOn)}. Rules change without notice and border officers decide admission — confirm on that official page before you book. See also our guide to <a href="/residence-permit-visa-benefits">travelling on a residence permit or second visa</a>.</p>
</section>`).join("");

  const canonical = `${SITE_ORIGIN}${pairPath(from, to)}`;
  // Answer-in-title: for question queries, the SERP result that already
  // answers wins the click. The suffix comes from the shared vocabulary, so the
  // title, the badge and the app can't name one outcome four different ways.
  const title = `Do ${from.name} citizens need a visa for ${to.name}? ${status.titleAnswer} (${new Date(DATA_LAST_UPDATED).getFullYear()})`;
  const knownForMeta = chips.length ? ` ${chips.join(". ")}.` : "";
  const metaDesc = `${answer}${knownForMeta} Official links, documents and entry requirements.`;

  // ── FAQ (visible and JSON-LD built from the same array) ────────────────────
  const rules = getEntryRules(to.code);
  const specificRules = hasSpecificRules(to.code);
  const processing = detail.processingDays || "";
  const faqs: FaqItem[] = [
    { q: `Do ${from.name} citizens need a visa to visit ${to.name}?`, a: answer },
  ];
  if (!blocked) {
    faqs.push(
      { q: `How long can ${from.name} passport holders stay in ${to.name}?`,
        a: stayKnown ? `Up to ${stayValue}.` : `Our data doesn't record the permitted stay for this route. Check ${to.name}'s official visa information before you travel.` },
      { q: `How much does a ${to.name} visa cost for ${from.name} citizens?`,
        a: feeKnown ? `${feeText}. Fees change — confirm on the official page before applying.` : `Our data doesn't record the fee for this route. Fees change often — check ${to.name}'s official visa information before you apply.` },
    );
    if (kind !== "visa_free" && isKnownFact(processing)) {
      faqs.push({ q: `How long does it take to get a ${to.name} visa?`, a: `Processing time: ${processing}.` });
    }
    faqs.push({ q: `How long must my passport be valid to enter ${to.name}?`,
      a: specificRules ? rules.passportValidity : `We don't hold ${to.name}'s own passport-validity rule. Many countries ask for six months beyond your stay; some ask for less. Check before you travel.` });
  }
  faqs.push({ q: `Does ${to.name} give visas to ${from.name} citizens?`, a: (
    kind === "visa_free" ? `${to.name} does not require a visa from ${from.name} citizens for short stays${stayKnown ? ` (up to ${stayValue})` : ""}.` :
    kind === "visa_on_arrival" ? `Yes — ${to.name} issues ${from.name} citizens a visa on arrival at the border or airport, so no embassy application is needed beforehand.` :
    kind === "eta" ? `${to.name} requires ${from.name} citizens to hold an electronic travel authorisation, applied for online and approved before you board.` :
    kind === "e_visa" ? `Yes — ${to.name} issues eVisas to ${from.name} citizens. Apply online before travelling; approval is delivered electronically.` :
    kind === "visa_required" ? `Yes — ${to.name} issues visas to ${from.name} citizens, usually through its embassies and consulates. Apply in advance before travelling.` :
    `${to.name} does not currently admit ${from.name} citizens — check with your foreign ministry before making plans.`
  ) });
  if (links?.visaPortal && !blocked) {
    faqs.push({ q: `Where can ${from.name} citizens find official ${to.name} visa information?`, a: `On ${to.name}'s official site: ${links.visaPortal}` });
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
      { "@type": "ListItem", position: 2, name: `${from.name} passport`, item: `${SITE_ORIGIN}/visa-requirements/${slugify(from.name)}` },
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
    isPartOf: { "@type": "WebSite", name: "isvisarequired.com", url: SITE_ORIGIN },
  };

  // Related internal links (crawlable graph): same destination / other passports,
  // and same passport / other destinations. Deterministic per-pair rotation —
  // with fixed slices all ~38k pages linked the SAME 24 alphabetically-first
  // pages; a pair-seeded window spreads the link graph evenly while staying
  // stable between renders.
  const others = countries.filter((c) => c.code !== from.code && c.code !== to.code);
  const seed =
    (from.code.charCodeAt(0) * 31 + from.code.charCodeAt(1) * 17 + to.code.charCodeAt(0) * 7 + to.code.charCodeAt(1)) %
    others.length;
  const rotated = [...others.slice(seed), ...others.slice(0, seed)];
  const otherPassports = rotated.slice(0, 12);
  const otherDestinations = rotated.slice(12, 24);

  // Each related link carries its own verdict, so the list is a map rather than
  // a column of blue text — and a reason to click. Ordered least-effort first.
  const chipFor = (a: CountryData, b: CountryData): { k: VerdictKind; html: string } => {
    const e = getDefaultEntry(a.code, b.code);
    const k = verdictKind(e.requirement, e.notes, e.maxStay);
    return { k, html: `<span class="chip s-${k === "eta" ? "e_visa" : k}">${esc(verdictStatus(k).short)}</span>` };
  };
  const ORDER: VerdictKind[] = ["visa_free", "visa_on_arrival", "eta", "e_visa", "visa_required", "no_admission"];
  const byEffort = <T extends { k: VerdictKind }>(xs: T[]) => [...xs].sort((x, y) => ORDER.indexOf(x.k) - ORDER.indexOf(y.k));
  const relatedPassports = byEffort(otherPassports.map((c) => ({ ...chipFor(c, to), c })))
    .map(({ c, html }) => `<a href="${pairPath(c, to)}"><span>${esc(c.flag)} ${esc(c.name)}</span>${html}</a>`)
    .join("");
  const relatedDestinations = byEffort(otherDestinations.map((c) => ({ ...chipFor(from, c), c })))
    .map(({ c, html }) => `<a href="${pairPath(from, c)}"><span>${esc(c.flag)} ${esc(c.name)}</span>${html}</a>`)
    .join("");

  // ── how to apply: honest about being a per-visa-type template ──────────────
  const docsList = detail.documents.map((d) => `<li>${esc(d)}</li>`).join("");
  const processList = detail.process.map((p) => `<li>${esc(p)}</li>`).join("");
  const kindNoun = kind === "eta" ? "a travel authorisation" : kind === "e_visa" ? "an eVisa" : kind === "visa_on_arrival" ? "a visa on arrival" : kind === "visa_required" ? "a visa" : "entry";
  const applyBlock = !blocked && (docsList || processList)
    ? `<section class="card apply">
  <h2>${kind === "visa_free" ? `Entering ${esc(to.name)}` : `Getting ${kindNoun} for ${esc(to.name)}`}</h2>
  <p class="small">What this usually involves for ${kindNoun === "entry" ? "visa-free entry" : kindNoun} — not a checklist researched for ${esc(from.name)} passport holders specifically. The official page has the exact list.</p>
  ${docsList ? `<details${kind === "visa_free" ? "" : " open"}><summary>What you'll typically need <span>${detail.documents.length} items</span></summary><ul>${docsList}</ul></details>` : ""}
  ${processList ? `<details><summary>Steps <span>${detail.process.length} steps</span></summary><ol>${processList}</ol></details>` : ""}
</section>`
    : "";

  const officialBlock = links && !blocked
    ? `<section class="card"><h2>Official sources</h2>
        <p>Always confirm with ${esc(to.name)}'s own government before you travel:</p>
        <ul class="links">
          <li><a href="${esc(links.visaPortal)}" rel="nofollow noopener" target="_blank">${esc(to.name)} official visa information ↗</a> <span class="host">${esc(hostOf(links.visaPortal))}</span></li>
          <li><a href="${esc(links.embassyFinder)}" rel="nofollow noopener" target="_blank">${esc(to.name)} embassies &amp; consulates ↗</a> <span class="host">${esc(hostOf(links.embassyFinder))}</span></li>
        </ul></section>`
    : "";

  // ── entry requirements beyond the visa ─────────────────────────────────────
  // 145 of 196 destinations fall back to a generic template. For those we no
  // longer print confident "Required"/"Recommended" labels under the
  // destination's name — only the one line that turns most people away at the
  // airline desk, labelled as general guidance.
  const level = (lvl: string): string => {
    const label = lvl === "required" ? "Required" : lvl === "recommended" ? "Recommended" : lvl === "none" ? "Not required" : lvl;
    return `<span class="lvl lvl-${esc(lvl)}">${esc(label)}</span>`;
  };
  const reqRow = (label: string, lvl: string, rowNote?: string): string =>
    `<li><strong>${esc(label)}</strong> ${level(lvl)}${rowNote ? `<span class="small">${esc(rowNote)}</span>` : ""}</li>`;
  const vaxList = rules.vaccinations
    .map((v) => `<li><strong>${esc(v.name)}</strong> ${level(v.level)}${v.detail ? `<span class="small">${esc(v.detail)}</span>` : ""}</li>`)
    .join("");
  const notesList = (rules.notes ?? []).map((n) => `<li>${esc(n)}</li>`).join("");
  const entryBlock = blocked
    ? ""
    : specificRules
      ? `<section class="card"><h2>Before you board for ${esc(to.name)}</h2>
      <p>Beyond the visa itself, these are what travellers most often get turned away for:</p>
      <ul class="checks">
        <li><strong>Passport validity</strong><span class="small">${esc(rules.passportValidity)}</span></li>
        ${reqRow("Onward or return ticket", rules.returnTicket, rules.returnTicketNote)}
        ${reqRow("Proof of funds", rules.proofOfFunds, rules.proofOfFundsNote)}
        ${reqRow("Travel insurance", rules.travelInsurance, rules.travelInsuranceNote)}
        ${vaxList}
      </ul>
      ${notesList ? `<ul class="notes">${notesList}</ul>` : ""}
      <p class="small">Requirements can vary by nationality and change without notice — confirm with the official sources before you travel.</p>
    </section>`
      : `<section class="card"><h2>Before you board</h2>
      <p><strong>Check your passport's expiry date.</strong> We don't hold ${esc(to.name)}'s own validity rule. Many countries ask for six months beyond your stay, some for three, some only for the length of your trip — and airlines refuse boarding on it. See <a href="/guides/six-month-passport-rule">the six-month passport rule</a>, then confirm with the official sources.</p>
    </section>`;

  const touristBlock = tourist
    ? `<section class="card about"><h2>About ${esc(to.name)}</h2>
        <p class="lead">${esc(tourist.tagline)}</p>
        <dl class="facts">
          <div><dt>Capital</dt><dd>${esc(tourist.capital)}</dd></div>
          <div><dt>Currency</dt><dd>${esc(tourist.currency)}</dd></div>
          <div><dt>Language</dt><dd>${esc(tourist.language)}</dd></div>
          <div><dt>Time zone</dt><dd>${esc(tourist.timezone)}</dd></div>
          <div><dt>Best time to visit</dt><dd>${esc(tourist.bestTimeToVisit)}</dd></div>
        </dl></section>`
    : "";

  const faqHtml = faqs
    .map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join("");

  const keepGoing = renderKeepGoing([
    { href: `/countries/${slugify(to.name)}`, label: `Who else can enter ${esc(to.name)}?`, sub: "Every nationality, one page" },
    { href: `/visa-requirements/${slugify(from.name)}`, label: `Everywhere a ${esc(from.name)} passport can go`, sub: "Visa-free, on arrival, eVisa" },
    { href: keepGuide.href, label: keepGuide.label, sub: keepGuide.sub },
    { href: keepGuide2.href, label: keepGuide2.label, sub: keepGuide2.sub },
  ]);

  // Order by what the reader has to do next. If there's a form to fill, the
  // form comes before the invitation to browse; if there's nothing to do,
  // exploring comes first.
  const effortful = kind === "e_visa" || kind === "eta" || kind === "visa_required";
  const body = blocked
    ? [keepGoing, touristBlock]
    : effortful
      ? [exemptionBlock, applyBlock, entryBlock, officialBlock, keepGoing, touristBlock]
      : [exemptionBlock, entryBlock, keepGoing, applyBlock, touristBlock, officialBlock];

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
<meta property="og:site_name" content="isvisarequired.com">
<meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#083191">
<link rel="icon" href="/favicon.svg"><script defer src="/_vercel/insights/script.js"></script>
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(webpageJsonLd)}</script>
${FONT_LINKS}<style>${BASE_STYLE}${PAIR_STYLE}</style>
</head>
<body>
${renderHeader()}
<div class="hero"><div class="wrap">
<nav class="crumbs"><a href="/">Home</a> › <a href="/visa-requirements/${slugify(from.name)}">${esc(from.name)} passport</a> › ${esc(from.name)} → ${esc(to.name)}</nav>
<h1 class="q">Do ${esc(from.name)} citizens need a visa for ${esc(to.name)}?</h1>
</div></div>
<main class="wrap">
${verdictCard}
${body.filter(Boolean).join("\n")}
<section class="card faqs"><h2>Common questions</h2>${faqHtml}</section>
<section class="card related">
  <h2>Other passports going to ${esc(to.name)}</h2>
  <div class="rel">${relatedPassports}</div>
  <h2>${esc(from.name)} passport to other destinations</h2>
  <div class="rel">${relatedDestinations}</div>
  <p class="small">Full lists: <a href="/visa-requirements/${slugify(from.name)}">${esc(from.flag)} every destination for a ${esc(from.name)} passport</a> · <a href="/countries/${slugify(to.name)}">${esc(to.flag)} every nationality going to ${esc(to.name)}</a></p>
</section>
</main>
${renderFooter()}
</body>
</html>`;
}

// Layout for the pair page. No literal colours: every value is a shared token
// (var(--…)) or arrives through the --v-* properties set from the shared
// status record on the verdict card.
const PAIR_STYLE = `
*{box-sizing:border-box}body{margin:0;line-height:1.6}
.hero{padding-bottom:56px}
.hero h1.q{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-weight:600;font-size:var(--type-h1);line-height:1.2;letter-spacing:-.015em;max-width:30ch}
.hero+main{margin-top:-40px}
.verdict{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--sh-xl);padding:22px 24px 18px;margin:0 0 20px}
.verdict .route{margin:0;font-size:var(--type-label);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.verdict .vword{display:flex;align-items:center;gap:14px;margin:12px 0 0;font-size:var(--type-verdict);line-height:1.1;font-weight:700;letter-spacing:-.02em;color:var(--v-ink)}
.verdict .vicon{flex:none;display:grid;place-items:center;width:52px;height:52px;border-radius:14px;background:var(--v-tint);border:1px solid var(--v-line);color:var(--v-ink)}
.verdict .vhint{margin:10px 0 0;font-size:var(--type-lead);line-height:1.45;color:var(--ink)}
.verdict .vnote{margin:6px 0 0;font-size:var(--type-meta);font-weight:600;color:var(--v-ink)}
.verdict .vfacts{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:14px 0 0}
.verdict .vfacts li{font-size:var(--type-meta);font-weight:600;padding:6px 12px;border-radius:999px;background:var(--v-tint);color:var(--v-ink);border:1px solid var(--v-line);font-variant-numeric:tabular-nums}
.verdict .vanswer{margin:16px 0 0;padding-top:16px;border-top:1px solid var(--line);font-size:var(--type-body);line-height:1.6}
.verdict .vunknown{margin:8px 0 0;font-size:var(--type-meta);color:var(--muted)}
.verdict .vactions{margin-top:16px}
.cta.official{flex-wrap:wrap;row-gap:0}
.cta.official small{flex-basis:100%;font-weight:500;font-size:12px;opacity:.8}
.verdict .vsource{margin:16px 0 0;font-size:13px;line-height:1.5;color:var(--muted)}
.verdict .vsource a{color:var(--muted);text-decoration:underline;text-underline-offset:2px;white-space:nowrap}
.verdict .vsource a:hover{color:var(--ink)}
.verdict .verified{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--status-visa-free-ink)}
.small{font-size:var(--type-meta);color:var(--muted)}
.card .small{display:block;margin-top:2px}
.exemption{border-left:3px solid var(--navy)}
details{border-top:1px solid var(--line)}
details:first-of-type{border-top:0}
summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 0;font-weight:600;font-size:var(--type-h3)}
summary::-webkit-details-marker{display:none}
summary::after{content:"";flex:none;width:9px;height:9px;border-right:2px solid var(--muted);border-bottom:2px solid var(--muted);transform:rotate(45deg) translateY(-3px);transition:transform .15s}
details[open]>summary::after{transform:rotate(-135deg) translateY(-2px)}
summary span{margin-left:auto;white-space:nowrap;font-weight:500;font-size:var(--type-meta);color:var(--muted)}
summary:focus-visible{outline:2px solid var(--navy);outline-offset:2px;border-radius:6px}
details>ul,details>ol,details>p{margin:0 0 16px}
.faq summary{font-size:var(--type-body)}
.checks,.links{list-style:none;padding:0;margin:0}
.checks li{padding:10px 0;border-top:1px solid var(--line)}
.checks li:first-child{border-top:0}
.lvl{display:inline-block;margin-left:6px;font-size:var(--type-meta);font-weight:600;padding:1px 10px;border-radius:999px;border:1px solid var(--line);background:var(--secondary);color:var(--ink)}
.lvl-required{background:var(--ink);border-color:var(--ink);color:var(--surface)}
.lvl-none{color:var(--muted)}
.links li{padding:6px 0}
.host{font-size:var(--type-meta);color:var(--muted)}
.about .lead{font-size:var(--type-lead);margin-top:0}
.about dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px 20px;margin:0}
.about dt{font-size:var(--type-label);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.about dd{margin:2px 0 0;font-size:var(--type-body)}
.related h2{font-size:var(--type-h3);margin:22px 0 8px}
.related h2:first-child{margin-top:0}
.rel{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:0 20px}
.rel a{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:44px;padding:6px 0;border-bottom:1px solid var(--line);text-decoration:none;color:var(--ink);font-size:var(--type-meta)}
.rel a:hover span:first-child{text-decoration:underline;text-underline-offset:2px}
.chip{flex:none;font-size:var(--type-meta);font-weight:600;padding:1px 9px;border-radius:999px;white-space:nowrap}
.s-visa_free{color:var(--status-visa-free-ink);background:var(--status-visa-free-tint)}
.s-visa_on_arrival{color:var(--status-visa-on-arrival-ink);background:var(--status-visa-on-arrival-tint)}
.s-e_visa{color:var(--status-e-visa-ink);background:var(--status-e-visa-tint)}
.s-visa_required{color:var(--status-visa-required-ink);background:var(--status-visa-required-tint)}
.s-no_admission{color:var(--status-no-admission-ink);background:var(--status-no-admission-tint)}
@media(max-width:560px){.verdict{padding:18px 18px 16px}.verdict .vicon{width:44px;height:44px;border-radius:12px}.verdict .vword{gap:12px}.cta.official{display:flex;justify-content:center;text-align:center}}
`;

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
