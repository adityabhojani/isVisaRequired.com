// The Global Passport Power Report — a citable, linkable research page
// computed 100% from the site's own visa dataset (base snapshot + verified
// overrides). Designed for journalists/bloggers to reference: full ranking,
// regional analysis, destination openness, reciprocity asymmetries, clear
// methodology, permissive citation terms. No numbers are hand-written; all are
// derived at load time so they always match the live checker.
import { countries, type CountryData } from "../data/countries";
import { getDefaultEntry } from "../data/visaData";
import { slugify } from "./render";
import { page, esc, SITE_ORIGIN, DATA_LAST_UPDATED } from "./hubLayout";

const YEAR = "2026";
export const REPORT_PATH = `/reports/passport-power-${YEAR}`;

interface Row {
  c: CountryData;
  vf: number;
  voa: number;
  ev: number;
  vr: number;
  na: number;
  mobility: number; // vf + voa + ev — reachable without an embassy visa
  open: number; // destination-side: how many nationalities this country admits visa-free or VoA
}

interface ReportData {
  rows: Row[]; // sorted by mobility desc
  byOpenness: Row[]; // sorted by open desc
  regions: { name: string; avg: number; count: number }[];
  asymmetric: { a: CountryData; b: CountryData }[]; // A enters B visa-free, B needs a visa for A
  totalPairs: number;
  totalAsymmetric: number;
}

let _data: ReportData | null = null;
export function computeReport(): ReportData {
  if (_data) return _data;
  const rows: Row[] = countries.map((c) => ({ c, vf: 0, voa: 0, ev: 0, vr: 0, na: 0, mobility: 0, open: 0 }));
  const idx = new Map(rows.map((r) => [r.c.code, r]));
  const vfMatrix = new Map<string, boolean>(); // "A>B" → A enters B visa-free
  let totalPairs = 0;

  for (const from of rows) {
    for (const to of rows) {
      if (from.c.code === to.c.code) continue;
      totalPairs++;
      const req = getDefaultEntry(from.c.code, to.c.code).requirement;
      if (req === "visa_free") { from.vf++; vfMatrix.set(`${from.c.code}>${to.c.code}`, true); }
      else if (req === "visa_on_arrival") from.voa++;
      else if (req === "e_visa") from.ev++;
      else if (req === "visa_required") from.vr++;
      else from.na++;
      if (req === "visa_free" || req === "visa_on_arrival") {
        const dest = idx.get(to.c.code);
        if (dest) dest.open++;
      }
    }
    from.mobility = from.vf + from.voa + from.ev;
  }

  // Reciprocity asymmetries: A→B visa-free but B→A full visa required.
  const asymmetric: { a: CountryData; b: CountryData }[] = [];
  for (const a of rows) {
    for (const b of rows) {
      if (a.c.code >= b.c.code) continue; // each unordered pair once, a<b
      const ab = vfMatrix.get(`${a.c.code}>${b.c.code}`) ?? false;
      const ba = vfMatrix.get(`${b.c.code}>${a.c.code}`) ?? false;
      if (ab !== ba) {
        // orient so `a` is the passport with free entry
        if (ab) asymmetric.push({ a: a.c, b: b.c });
        else asymmetric.push({ a: b.c, b: a.c });
      }
    }
  }

  const regionAgg = new Map<string, { sum: number; count: number }>();
  for (const r of rows) {
    const agg = regionAgg.get(r.c.region) ?? { sum: 0, count: 0 };
    agg.sum += r.mobility;
    agg.count++;
    regionAgg.set(r.c.region, agg);
  }
  const regions = [...regionAgg]
    .map(([name, { sum, count }]) => ({ name, avg: Math.round(sum / count), count }))
    .sort((x, y) => y.avg - x.avg);

  _data = {
    rows: [...rows].sort((x, y) => y.mobility - x.mobility || x.c.name.localeCompare(y.c.name)),
    byOpenness: [...rows].sort((x, y) => y.open - x.open || x.c.name.localeCompare(y.c.name)),
    regions,
    asymmetric,
    totalPairs,
    totalAsymmetric: asymmetric.length,
  };
  return _data;
}

export function renderReportCsv(): string {
  const d = computeReport();
  const lines = ["rank,code,name,region,visa_free,visa_on_arrival,evisa_or_eta,visa_required,no_admission,mobility_score,admits_without_advance_visa"];
  d.rows.forEach((r, i) => {
    lines.push(`${i + 1},${r.c.code},"${r.c.name}",${r.c.region},${r.vf},${r.voa},${r.ev},${r.vr},${r.na},${r.mobility},${r.open}`);
  });
  return lines.join("\n") + "\n";
}

export function renderPassportPowerReport(): string {
  const d = computeReport();
  const canonical = `${SITE_ORIGIN}${REPORT_PATH}`;
  const top = d.rows[0];
  const bottomRows = d.rows.slice(-10);
  const top10avg = Math.round(d.rows.slice(0, 10).reduce((s, r) => s + r.mobility, 0) / 10);
  const bottom10avg = Math.round(bottomRows.reduce((s, r) => s + r.mobility, 0) / 10);
  const mostOpen = d.byOpenness[0];
  const leastOpen = d.byOpenness[d.byOpenness.length - 1];
  const asymPct = Math.round((d.totalAsymmetric / (d.totalPairs / 2)) * 100);

  const title = `Global Passport Power Report ${YEAR} — Rankings & Analysis`;
  const description = `Full ${YEAR} ranking of ${d.rows.length} passports by travel freedom, computed from ${d.totalPairs.toLocaleString()} passport–destination rules: mobility scores, regional gaps, destination openness and visa reciprocity. Free to cite with attribution; CSV download included.`;

  const hubLink = (c: CountryData) => `/visa-requirements/${slugify(c.name)}`;
  const rankRow = (r: Row, i: number) =>
    `<tr><td>${i + 1}</td><td><a href="${hubLink(r.c)}">${esc(r.c.flag)} ${esc(r.c.name)}</a></td><td>${r.vf}</td><td>${r.voa}</td><td>${r.ev}</td><td><strong>${r.mobility}</strong></td></tr>`;

  const fullTable = d.rows.map((r, i) => rankRow(r, i)).join("");
  const regionRows = d.regions.map((rg) => `<tr><td>${esc(rg.name)}</td><td>${rg.count}</td><td><strong>${rg.avg}</strong></td></tr>`).join("");
  const openRows = d.byOpenness.slice(0, 10).map((r, i) =>
    `<tr><td>${i + 1}</td><td><a href="/countries/${slugify(r.c.name)}">${esc(r.c.flag)} ${esc(r.c.name)}</a></td><td><strong>${r.open}</strong></td></tr>`).join("");
  const asymExamples = d.asymmetric
    .filter((p) => ["US", "GB", "DE", "JP", "AU", "CA", "AE", "TR", "BR", "CN"].includes(p.a.code))
    .slice(0, 8)
    .map((p) => `<li><strong>${esc(p.a.name)}</strong> citizens enter <strong>${esc(p.b.name)}</strong> visa-free, but ${esc(p.b.name)} citizens need a visa for ${esc(p.a.name)} — see <a href="/reciprocity?passportA=${p.a.code}&passportB=${p.b.code}">the reciprocity tool</a>.</li>`)
    .join("");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Global Passport Power Report ${YEAR}`,
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
      name: `Global Passport Power Dataset ${YEAR}`,
      description: `Per-passport counts of visa-free, visa-on-arrival, eVisa/ETA and visa-required destinations across ${d.rows.length} countries, plus destination openness.`,
      url: canonical,
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
      distribution: [{ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${SITE_ORIGIN}${REPORT_PATH}.csv` }],
      dateModified: DATA_LAST_UPDATED,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: `Passport Power Report ${YEAR}`, item: canonical },
      ],
    },
  ];

  const body = `
<nav class="crumbs"><a href="/">Home</a> › Passport Power Report ${YEAR}</nav>
<h1>Global Passport Power Report ${YEAR}</h1>
<div class="updated">Computed from ${d.totalPairs.toLocaleString()} passport–destination rules · Data last reviewed ${esc(DATA_LAST_UPDATED)}</div>
<p class="lead">How far does each passport take you? This report ranks all ${d.rows.length} passports in our dataset by <strong>mobility score</strong> — the number of destinations reachable without visiting an embassy (visa-free + visa on arrival + eVisa/ETA) — and looks at the other side of the desk: which destinations admit the most nationalities without an advance visa. Every figure is computed live from the same dataset that powers our <a href="/">visa checker</a>.</p>

<div class="stats">
  <div class="stat"><div class="n">${top.mobility}</div><div class="k">Top score — ${esc(top.c.name)}</div></div>
  <div class="stat"><div class="n">${top10avg}</div><div class="k">Top-10 average</div></div>
  <div class="stat"><div class="n">${bottom10avg}</div><div class="k">Bottom-10 average</div></div>
  <div class="stat"><div class="n">${asymPct}%</div><div class="k">Of country pairs are one-way visa-free</div></div>
</div>

<h2>Key findings</h2>
<ul style="color:#334155;padding-left:20px">
  <li style="margin:6px 0">The <strong>mobility gap</strong> is stark: the top-10 passports average <strong>${top10avg}</strong> accessible destinations; the bottom 10 average just <strong>${bottom10avg}</strong> — a ${(top10avg / Math.max(1, bottom10avg)).toFixed(1)}× difference determined entirely by birthplace.</li>
  <li style="margin:6px 0"><strong>${esc(d.regions[0].name)}</strong> passports have the highest average mobility (${d.regions[0].avg}); <strong>${esc(d.regions[d.regions.length - 1].name)}</strong> the lowest (${d.regions[d.regions.length - 1].avg}).</li>
  <li style="margin:6px 0">The most open destination is <strong>${esc(mostOpen.c.name)}</strong>, admitting <strong>${mostOpen.open}</strong> nationalities visa-free or on arrival; the most restrictive, <strong>${esc(leastOpen.c.name)}</strong>, admits ${leastOpen.open}.</li>
  <li style="margin:6px 0">Visa policy is strikingly unequal between partners: <strong>${d.totalAsymmetric.toLocaleString()}</strong> country pairs (${asymPct}% of all pairs) are "one-way doors" — one side enters visa-free while the other queues at an embassy.</li>
</ul>

<h2>Average mobility by region</h2>
<div class="card" style="padding:0;overflow-x:auto"><table><thead><tr><th>Region</th><th>Passports</th><th>Avg. mobility score</th></tr></thead><tbody>${regionRows}</tbody></table></div>

<h2>The most open destinations</h2>
<p style="color:#334155">Countries admitting the most nationalities without an advance visa (visa-free or on arrival):</p>
<div class="card" style="padding:0;overflow-x:auto"><table><thead><tr><th>#</th><th>Destination</th><th>Nationalities admitted</th></tr></thead><tbody>${openRows}</tbody></table></div>

<h2>One-way doors: reciprocity asymmetries</h2>
<p style="color:#334155">Visa-free access is often not mutual. Notable examples from the ${d.totalAsymmetric.toLocaleString()} asymmetric pairs:</p>
<ul style="color:#334155;padding-left:20px">${asymExamples}</ul>

<h2>Full ranking — all ${d.rows.length} passports</h2>
<p style="color:#334155">Mobility score = visa-free + visa on arrival + eVisa/ETA destinations. Click any passport for its full country-by-country breakdown.</p>
<div class="card" style="padding:0;overflow-x:auto;max-height:520px;overflow-y:auto"><table><thead><tr><th>#</th><th>Passport</th><th>Visa-free</th><th>VoA</th><th>eVisa</th><th>Mobility</th></tr></thead><tbody>${fullTable}</tbody></table></div>
<p><a class="cta" href="${REPORT_PATH}.csv">Download the full dataset (CSV) →</a></p>

<h2>Methodology</h2>
<p style="color:#334155">Scores are computed from isvisarequired.com's visa-requirement dataset: an open base dataset (derived from public government and IATA-style sources) plus our layer of individually verified corrections, each pinned to a primary source and date. "Mobility" counts destinations an ordinary tourist-passport holder can reach without an embassy visa: visa-free entry, visa on arrival, or an eVisa/electronic travel authorisation. Destination "openness" counts nationalities admitted visa-free or on arrival. The dataset covers ${d.rows.length} countries (${d.totalPairs.toLocaleString()} directed pairs); territories and special administrative regions are excluded, so totals differ slightly from indexes that count them. Figures reflect the dataset as of ${esc(DATA_LAST_UPDATED)}. See <a href="/methodology">how we source our data</a>.</p>

<h2>Cite or reuse this report</h2>
<p style="color:#334155">This report and the CSV are free to reuse under <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener">CC BY 4.0</a> — cite "isvisarequired.com Global Passport Power Report ${YEAR}" and link to <a href="${REPORT_PATH}">this page</a>. Journalists: we're happy to provide custom cuts of the data — <a href="/contact">get in touch</a>.</p>

<div class="note" style="margin-top:20px">This is an analytical ranking, not travel advice. Visa rules change constantly — for a specific trip, check <a href="/">your exact passport–destination pair</a> and confirm with official sources.</div>`;

  return page({ title, description, canonical, jsonLd, body });
}
