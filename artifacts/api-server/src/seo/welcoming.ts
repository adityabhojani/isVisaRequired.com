// The Most Welcoming Countries Index — the destination side of the Passport
// Power Report. Every country is ranked by how many of the other nationalities
// it admits without paperwork before travel (visa-free or visa on arrival): the
// same "openness" figure the report already publishes, so the two pages can
// never disagree. As with the report, no number is hand-written; everything is
// computed from the live dataset, and tied countries share a rank.
import { slugify } from "./render";
import { page, esc, SITE_ORIGIN, DATA_LAST_UPDATED } from "./hubLayout";
import { computeReport, competitionRanks, REPORT_PATH, WELCOMING_PATH, type Row } from "./report";

const YEAR = "2026";

let _ranks: number[] | null = null;
function opennessRanks(): number[] {
  if (!_ranks) _ranks = competitionRanks(computeReport().byOpenness, (r) => r.open);
  return _ranks;
}

/** Where one destination sits in the index, for the country hubs. */
export function opennessRankOf(code: string): { rank: number; of: number; open: number } | null {
  const rows = computeReport().byOpenness;
  const i = rows.findIndex((r) => r.c.code === code);
  return i < 0 ? null : { rank: opennessRanks()[i], of: rows.length, open: rows[i].open };
}

export function renderWelcomingCsv(): string {
  const rows = computeReport().byOpenness;
  const ranks = opennessRanks();
  const lines = ["rank,code,name,region,admits_visa_free,admits_on_arrival,requires_evisa_or_eta,requires_visa,no_admission,openness_score"];
  rows.forEach((r, i) => {
    lines.push(`${ranks[i]},${r.c.code},"${r.c.name}",${r.c.region},${r.inVf},${r.inVoa},${r.inEv},${r.inVr},${r.inNa},${r.open}`);
  });
  return lines.join("\n") + "\n";
}

const countryLink = (r: Row) => `<a href="/countries/${slugify(r.c.name)}">${esc(r.c.flag)} ${esc(r.c.name)}</a>`;

function listNames(rs: Row[]): string {
  const n = rs.map((r) => `<strong>${esc(r.c.name)}</strong>`);
  return n.length <= 1 ? (n[0] ?? "") : `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}

export function renderWelcomingIndex(): string {
  const d = computeReport();
  const rows = d.byOpenness; // sorted by openness, most welcoming first
  const ranks = opennessRanks();
  const others = rows.length - 1;
  const canonical = `${SITE_ORIGIN}${WELCOMING_PATH}`;

  const topScore = rows[0].open;
  const bottomScore = rows[rows.length - 1].open;
  const top = rows.filter((r) => r.open === topScore);
  const bottom = rows.filter((r) => r.open === bottomScore);
  const mid = Math.floor(rows.length / 2);
  const median = rows.length % 2 ? rows[mid].open : Math.round((rows[mid - 1].open + rows[mid].open) / 2);
  const half = Math.ceil(others / 2);
  const atLeastHalf = rows.filter((r) => r.open >= half).length;
  const underTwenty = rows.filter((r) => r.open < 20).length;
  const evisaLeader = [...rows].sort((a, b) => b.inEv - a.inEv || a.c.name.localeCompare(b.c.name))[0];

  const byRegion = new Map<string, Row[]>();
  for (const r of rows) byRegion.set(r.c.region, [...(byRegion.get(r.c.region) ?? []), r]);
  const regions = [...byRegion]
    .map(([name, rs]) => ({
      name,
      count: rs.length,
      avg: Math.round(rs.reduce((s, r) => s + r.open, 0) / rs.length),
      leaders: rs.filter((r) => r.open === rs[0].open), // rs keeps the descending order
    }))
    .sort((a, b) => b.avg - a.avg || a.name.localeCompare(b.name));
  const bestRegion = regions[0];
  const worstRegion = regions[regions.length - 1];

  const title = `Most Welcoming Countries ${YEAR}: Easiest Countries to Enter`;
  const description = `All ${rows.length} countries ranked by how many nationalities they admit visa-free or on arrival, computed from ${d.totalPairs.toLocaleString()} visa rules. Regional breakdown, eVisa counts and free CSV data (CC BY 4.0).`;

  const tied = (rs: Row[]) => (rs.length === 1 ? esc(rs[0].c.name) : `${rs.length} countries tied`);
  const bottomFinding = bottomScore === 0
    ? `${listNames(bottom)} ${bottom.length === 1 ? "admits" : "admit"} no nationality at all without a visa arranged in advance.`
    : `At the other end, ${listNames(bottom)} ${bottom.length === 1 ? "admits" : "each admit"} just <strong>${bottomScore}</strong>.`;

  const regionRows = regions
    .map((rg) => `<tr><td>${esc(rg.name)}</td><td>${rg.count}</td><td><strong>${rg.avg}</strong></td><td>${rg.leaders.map(countryLink).join(", ")} (${rg.leaders[0].open})</td></tr>`)
    .join("");
  const fullTable = rows
    .map((r, i) => `<tr><td>${ranks[i]}</td><td>${countryLink(r)}</td><td>${r.inVf}</td><td>${r.inVoa}</td><td>${r.inEv}</td><td>${r.inVr}</td><td><strong>${r.open}</strong></td></tr>`)
    .join("");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Most Welcoming Countries Index ${YEAR}`,
      description,
      url: canonical,
      datePublished: DATA_LAST_UPDATED,
      dateModified: DATA_LAST_UPDATED,
      author: { "@type": "Organization", name: "isvisarequired.com" },
      publisher: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Most Welcoming Countries Dataset ${YEAR}`,
      description: `For each of ${rows.length} countries: how many of the other ${others} nationalities it admits visa-free, on arrival, with an eVisa or ETA, or only with a visa.`,
      url: canonical,
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
      distribution: [{ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${canonical}.csv` }],
      dateModified: DATA_LAST_UPDATED,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: `Most Welcoming Countries Index ${YEAR}`, item: canonical },
      ],
    },
  ];

  const body = `
<nav class="crumbs"><a href="/">Home</a> › Most Welcoming Countries Index ${YEAR}</nav>
<h1>Most Welcoming Countries Index ${YEAR}</h1>
<div class="updated">Computed from ${d.totalPairs.toLocaleString()} passport–destination rules · Data last reviewed ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">Which countries let the most of the world in? This index ranks all ${rows.length} countries in our dataset by <strong>openness</strong>: how many of the other ${others} nationalities they admit visa-free or with a visa on arrival — that is, without a visa arranged in advance. It is the other side of the <a href="${REPORT_PATH}">Passport Power Report</a>, which ranks passports by where they can go.</p>

<div class="stats">
  <div class="stat"><div class="n">${topScore}</div><div class="k">Most welcoming — ${tied(top)}</div></div>
  <div class="stat"><div class="n">${median}</div><div class="k">Median country</div></div>
  <div class="stat"><div class="n">${atLeastHalf}</div><div class="k">Countries admitting half the world or more</div></div>
  <div class="stat"><div class="n">${bottomScore}</div><div class="k">Least welcoming — ${tied(bottom)}</div></div>
</div>

<h2>Key findings</h2>
<ul>
  <li style="margin:6px 0">${listNames(top)} ${top.length === 1 ? "admits" : "each admit"} <strong>${topScore}</strong> of the other ${others} nationalities visa-free or on arrival — the most of any country.</li>
  <li style="margin:6px 0"><strong>${atLeastHalf}</strong> of ${rows.length} countries admit at least half of all nationalities (${half} or more) without an advance visa, while <strong>${underTwenty}</strong> admit fewer than 20.</li>
  <li style="margin:6px 0">${bottomFinding}</li>
  <li style="margin:6px 0">${esc(bestRegion.name)} is the most welcoming region on average (${bestRegion.avg} nationalities per country); ${esc(worstRegion.name)} is the least (${worstRegion.avg}).</li>
  ${evisaLeader && evisaLeader.inEv > 0 ? `<li style="margin:6px 0">Openness is not the whole picture: <strong>${esc(evisaLeader.c.name)}</strong> asks the most nationalities to apply online before travelling — ${evisaLeader.inEv} need an eVisa or electronic travel authorisation.</li>` : ""}
</ul>

<h2>By region</h2>
<div class="card" style="padding:0;overflow-x:auto"><table style="font-variant-numeric:tabular-nums"><thead><tr><th>Region</th><th>Countries</th><th>Avg. openness</th><th>Most welcoming</th></tr></thead><tbody>${regionRows}</tbody></table></div>

<h2>Full ranking — all ${rows.length} countries</h2>
<p style="color:#334155">Openness is the number of nationalities admitted visa-free or on arrival, out of ${others}. Countries with the same score share a rank. Select a country to see who needs a visa, nationality by nationality.</p>
<div class="card" style="padding:0;overflow-x:auto"><table style="font-variant-numeric:tabular-nums"><thead><tr><th>#</th><th>Country</th><th>Visa-free</th><th>On arrival</th><th>eVisa / ETA</th><th>Visa required</th><th>Openness</th></tr></thead><tbody>${fullTable}</tbody></table></div>
<p style="color:#64748b;font-size:13px">Where a row adds up to less than ${others}, our dataset records no ordinary tourist admission for the remaining nationalities; the CSV lists them separately. <a href="${WELCOMING_PATH}.csv">Download the full data (CSV)</a>.</p>

<h2>Methodology</h2>
<p style="color:#334155">Computed from isvisarequired.com's visa-requirement dataset: an open base dataset plus our layer of individually verified corrections, each pinned to a primary source and date. For every country we count how the other ${others} nationalities are treated when an ordinary tourist-passport holder arrives: visa-free, visa on arrival, eVisa or electronic travel authorisation, visa required, or no admission. The openness score counts only visa-free and on-arrival entry, because an eVisa or ETA still means applying before you travel. It measures entry policy by nationality alone, so exemptions that depend on holding another country's visa or residence permit are not counted (see <a href="/residence-permit-visa-benefits">second-document rules</a>). Territories and special administrative regions are excluded. Figures reflect the dataset as of ${esc(DATA_LAST_UPDATED)}. See <a href="/methodology">how we source our data</a>.</p>

<h2>Cite or reuse this index</h2>
<p style="color:#334155">This index and its CSV are free to reuse under <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener">CC BY 4.0</a>. Cite "isvisarequired.com Most Welcoming Countries Index ${YEAR}" and link to <a href="${WELCOMING_PATH}">this page</a>. For the passport side of the picture, see the <a href="${REPORT_PATH}">Global Passport Power Report ${YEAR}</a>.</p>

<div class="note" style="margin-top:20px">This is an analytical ranking, not travel advice. Visa rules change — for a specific trip, check <a href="/">your exact passport and destination</a> and confirm with official sources.</div>`;

  return page({ title, description, canonical, jsonLd, body });
}
