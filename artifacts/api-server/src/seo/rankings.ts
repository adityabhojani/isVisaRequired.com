// Server-rendered passport ranking ("visa restrictions index").
//
// Search Console shows "visa restrictions index" earning impressions with no
// clicks — the only thing the site had was a client-rendered tier list, so Google
// was ranking an empty shell. This page computes the ranking from the same data
// the pair pages use and shows the whole table in indexable HTML.
//
// Methodology note, which matters because it is the one thing that makes a
// ranking either trustworthy or arbitrary: passports are ranked by the number of
// destinations reachable WITHOUT arranging anything in advance — visa-free plus
// visa on arrival. eVisas are counted and displayed, but not in the ranking
// figure, because an eVisa is an application you must complete before you fly.
// This is deliberately the same definition the pair pages use in their
// "reaches N of 194" line, so the two never contradict each other.
import { countries, type CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { SITE_ORIGIN, DATA_LAST_UPDATED, slugify } from "./render";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export interface PassportRanking {
  country: CountryData;
  rank: number;
  visaFree: number;
  visaOnArrival: number;
  eVisa: number;
  visaRequired: number;
  noAdmission: number;
  /** visaFree + visaOnArrival — the figure the table is ranked on. */
  openAccess: number;
  total: number;
}

// O(n²) over 195×195, computed once on first request and reused.
let _rankings: PassportRanking[] | null = null;

export function getPassportRankings(): PassportRanking[] {
  if (_rankings) return _rankings;

  const rows = countries.map((country) => {
    let visaFree = 0, visaOnArrival = 0, eVisa = 0, visaRequired = 0, noAdmission = 0, total = 0;
    for (const dest of countries) {
      if (dest.code === country.code) continue;
      total++;
      switch (getDefaultEntry(country.code, dest.code).requirement) {
        case "visa_free": visaFree++; break;
        case "visa_on_arrival": visaOnArrival++; break;
        case "e_visa": eVisa++; break;
        case "no_admission": noAdmission++; break;
        default: visaRequired++;
      }
    }
    return { country, visaFree, visaOnArrival, eVisa, visaRequired, noAdmission, total, openAccess: visaFree + visaOnArrival, rank: 0 };
  });

  // Sort by open access, then alphabetically so the order is fully deterministic
  // rather than depending on the input order for ties.
  rows.sort((a, b) => b.openAccess - a.openAccess || a.country.name.localeCompare(b.country.name));

  // Standard competition ranking: equal scores share a rank, and the next distinct
  // score skips ahead. Two passports on 190 are both 1st, and the next is 3rd.
  let lastScore = -1;
  let lastRank = 0;
  rows.forEach((r, i) => {
    if (r.openAccess !== lastScore) {
      lastRank = i + 1;
      lastScore = r.openAccess;
    }
    r.rank = lastRank;
  });

  _rankings = rows;
  return rows;
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
table{border-collapse:collapse;width:100%;font-size:14px;min-width:620px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line)}
th{font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);background:#f8fafc}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
tbody tr:nth-child(even){background:#fbfdff}
td a{text-decoration:none;font-weight:600}
.rank{font-weight:800;color:var(--muted);width:52px}
.bar{display:inline-block;height:6px;border-radius:3px;background:var(--accent);vertical-align:middle}
.faq{border-top:1px solid var(--line);padding:12px 0}.faq:first-of-type{border-top:0}
.faq h3{margin:0 0 4px;font-size:16px}.faq p{margin:0;color:#334155}
.cta{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;margin-top:6px}
footer.site{color:var(--muted);font-size:13px;padding:28px 0;text-align:center}`;

const HEADER = `<header class="site"><div class="wrap"><a class="logo" href="/">isvisarequired<span>.com</span></a><a href="/" style="font-size:14px;text-decoration:none">Visa checker →</a></div></header>`;
const FOOTER = `<footer class="site"><div class="wrap">© isvisarequired.com — rankings are computed from our own dataset and are general guidance; always confirm with official government sources. Last reviewed ${esc(DATA_LAST_UPDATED)}. · <a href="/methodology" style="color:inherit">How we source our data</a></div></footer>`;

export function renderPassportIndex(): string {
  const canonical = `${SITE_ORIGIN}/passport-index`;
  const rows = getPassportRankings();
  const year = new Date(DATA_LAST_UPDATED).getFullYear();
  const top = rows[0];
  const bottom = rows[rows.length - 1];
  const maxOpen = top.openAccess;
  const median = rows[Math.floor(rows.length / 2)];
  // Everyone sharing the top rank, so a tie is reported as a tie.
  const joint = rows.filter((r) => r.rank === 1);

  const title = `Passport Index ${year}: all ${rows.length} passports ranked`;
  const desc = `Every passport ranked by visa-free and visa-on-arrival access. ${joint.length > 1 ? `${joint.length} passports tie at the top with ${maxOpen}` : `${top.country.name} leads with ${maxOpen}`} of ${top.total} destinations. Updated ${DATA_LAST_UPDATED}.`;

  const tableRows = rows
    .map((r) => {
      const pct = Math.round((r.openAccess / r.total) * 100);
      return `<tr>
      <td class="rank">${r.rank}</td>
      <td><a href="/visa-requirements/${slugify(r.country.name)}">${esc(r.country.flag)} ${esc(r.country.name)}</a></td>
      <td class="num"><strong>${r.openAccess}</strong> <span class="bar" style="width:${Math.max(2, Math.round(pct * 0.5))}px" aria-hidden="true"></span></td>
      <td class="num">${r.visaFree}</td>
      <td class="num">${r.visaOnArrival}</td>
      <td class="num">${r.eVisa}</td>
      <td class="num">${r.visaRequired}</td>
    </tr>`;
    })
    .join("");

  const faqs = [
    {
      q: "What is the visa restrictions index?",
      a: `"Visa restrictions index" is the older name for what is now usually called a passport index or passport power ranking: a league table of passports ordered by how many countries their holders can enter without arranging a visa first. This page ranks all ${rows.length} passports we cover on that basis, using our own dataset.`,
    },
    {
      q: "Which passport is the strongest?",
      a: joint.length > 1
        ? `${joint.length} passports share first place, each reaching ${maxOpen} of ${top.total} destinations visa-free or with a visa on arrival: ${joint.slice(0, 8).map((r) => r.country.name).join(", ")}${joint.length > 8 ? " and others" : ""}.`
        : `${top.country.name}, reaching ${maxOpen} of ${top.total} destinations visa-free or with a visa on arrival.`,
    },
    {
      q: "Which passport has the most restrictions?",
      a: `${bottom.country.name} ranks last in our table, with ${bottom.openAccess} of ${bottom.total} destinations reachable without arranging a visa in advance. A low ranking reflects other governments' visa policies, not the country itself.`,
    },
    {
      q: "How is this ranking calculated?",
      a: `For every one of the ${rows.length} passports we check all ${top.total} other destinations and count those where the requirement is visa-free or visa on arrival. eVisas are counted in their own column but excluded from the ranking figure, because an eVisa is an application you have to complete before you travel. Passports on the same score share a rank.`,
    },
    {
      q: "Why does this differ from the Henley or Arton passport index?",
      a: `Different indexes count different things — some fold eVisas or electronic travel authorisations into the headline number, some cover a different set of territories, and all of them are refreshed on their own schedule. This table is computed from our own dataset, covers ${rows.length} passports and ${top.total} destinations, and states its method above so you can see exactly what the number means.`,
    },
    {
      q: "Does a strong passport mean I never need a visa?",
      a: "No. Rankings describe short tourist stays only. Working, studying, or staying beyond the visa-free limit needs a permit whatever your passport, and any country can refuse entry at the border. Check the specific pair before you book.",
    },
  ];
  const faqHtml = faqs.map((f) => `<div class="faq"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("");

  // Dataset is the honest type here: this page's primary purpose is to present a
  // ranked dataset. `creator` is included — its absence is what Search Console
  // flagged on the other Dataset pages. No `identifier`: there is no DOI to cite.
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Passport Index ${year} — ${rows.length} passports ranked by visa-free access`,
    description: `Ranking of ${rows.length} passports by the number of destinations reachable visa-free or with a visa on arrival, out of ${top.total} destinations.`,
    url: canonical,
    creator: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
    publisher: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    inLanguage: "en",
    spatialCoverage: "Worldwide",
    dateModified: DATA_LAST_UPDATED,
    variableMeasured: ["Visa-free destinations", "Visa on arrival destinations", "eVisa destinations", "Visa required destinations", "Passport rank"],
    measurementTechnique: "Count of destination requirements per passport, derived from an open base dataset plus source-verified corrections",
    sameAs: `${SITE_ORIGIN}/methodology`,
  };
  const itemListJsonLd = {
    "@context": "https://schema.org", "@type": "ItemList",
    name: title,
    numberOfItems: rows.length,
    // Every row the page actually renders — declaring 195 items and then listing a
    // truncated 50 would misdescribe the page.
    itemListElement: rows.map((r, i) => ({
      "@type": "ListItem", position: i + 1,
      name: `${r.country.name} — ${r.openAccess} destinations`,
      url: `${SITE_ORIGIN}/visa-requirements/${slugify(r.country.name)}`,
    })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Passport index", item: canonical },
    ],
  };

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:site_name" content="Is Visa Required?"><meta property="og:image" content="https://www.isvisarequired.com/opengraph.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="https://www.isvisarequired.com/opengraph.jpg">
<link rel="icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(datasetJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(itemListJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
<style>${STYLE}</style></head>
<body>${HEADER}<main class="wrap">
<nav class="crumbs"><a href="/">Home</a> › Passport index</nav>
<h1>Passport index ${year}: all ${rows.length} passports ranked</h1>
<div class="updated">Last reviewed: ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">Every passport we cover, ranked by how many of the other ${top.total} destinations its holders can enter <strong>without arranging a visa first</strong> — visa-free or with a visa on arrival. This is the measure historically published as the "visa restrictions index".</p>

<div class="grid">
  <div class="stat"><div class="k">Passports ranked</div><div class="v">${rows.length}</div></div>
  <div class="stat"><div class="k">Top score</div><div class="v">${maxOpen} of ${top.total}</div></div>
  <div class="stat"><div class="k">Median passport</div><div class="v">${median.openAccess} of ${median.total}</div></div>
  <div class="stat"><div class="k">Lowest score</div><div class="v">${bottom.openAccess} of ${bottom.total}</div></div>
</div>

<section class="card">
  <h2>How we rank passports</h2>
  <p>For each passport we check every other destination in our dataset and count the ones where the requirement is <strong>visa-free</strong> or <strong>visa on arrival</strong>. That combined figure is what the table is ordered on, because it answers the practical question: how many places can you fly to without filing paperwork first?</p>
  <p><strong>eVisas are shown but not counted in the ranking.</strong> An eVisa is quicker than a consular appointment, but it is still an application you must be approved for before you board, so folding it into a "visa-free access" number overstates how freely you can travel. You can see each passport's eVisa count in its own column.</p>
  <p>Passports on the same score share a rank, and the next distinct score skips ahead accordingly. Full sourcing is on our <a href="/methodology">methodology page</a>.</p>
</section>

<section class="card">
  <h2>Full ranking</h2>
  <div class="tablewrap"><table>
    <thead><tr>
      <th>#</th><th>Passport</th><th class="num">No visa needed</th>
      <th class="num">Visa-free</th><th class="num">On arrival</th><th class="num">eVisa</th><th class="num">Visa required</th>
    </tr></thead>
    <tbody>${tableRows}</tbody>
  </table></div>
  <p style="color:#64748b;font-size:13px;margin-top:10px">"No visa needed" is visa-free plus visa on arrival, out of ${top.total} destinations. Select any passport to see its requirement for every destination.</p>
</section>

<section class="card"><h2>Frequently asked questions</h2>${faqHtml}</section>

<section class="card">
  <h2>Check a specific trip</h2>
  <p>A ranking is a summary. What matters for your trip is the single pair — your passport and where you are going.</p>
  <a class="cta" href="/">Open the visa checker →</a>
</section>
</main>${FOOTER}</body></html>`;
}
