// The verified-changes log.
//
// Competitors publish visa "news"; this publishes provenance. Every line is a
// correction this site applied on top of the base dataset, showing what the data
// said before, what it says now, when it was verified and against which source.
// Nothing here is written by hand: the entries come from the override layer, and
// the before/after values are the ones the checker actually serves.
import { countryMap } from "../data/countries";
import { getVerifiedChanges } from "../data/passportIndexLoader";
import { slugify } from "./render";
import { page, esc, SITE_ORIGIN, DATA_LAST_UPDATED } from "./hubLayout";

export const CHANGES_PATH = "/visa-changes";

// How each requirement reads inside a sentence.
const NOW: Record<string, string> = {
  visa_free: "enter visa-free",
  visa_on_arrival: "get a visa on arrival",
  e_visa: "need an eVisa or travel authorisation",
  visa_required: "need a visa arranged in advance",
  no_admission: "are not admitted",
};
const BEFORE: Record<string, string> = {
  visa_free: "entered visa-free",
  visa_on_arrival: "got a visa on arrival",
  e_visa: "needed an eVisa or travel authorisation",
  visa_required: "needed a visa in advance",
  no_admission: "were not admitted",
};

interface Group {
  verifiedOn: string;
  destination: string;
  source: string;
  after: string;
  maxStay?: string;
  passports: string[];
  befores: Map<string, number>;
}

function groups(): Group[] {
  const byKey = new Map<string, Group>();
  for (const c of getVerifiedChanges()) {
    // Only report cells the correction actually changed.
    const beforeReq = c.before?.requirement ?? "unknown";
    if (c.before && c.before.requirement === c.after.requirement && (c.before.maxStay ?? "") === (c.after.maxStay ?? "")) continue;
    const key = `${c.verifiedOn}|${c.destination}|${c.source}|${c.after.requirement}|${c.after.maxStay ?? ""}`;
    const g = byKey.get(key) ?? {
      verifiedOn: c.verifiedOn,
      destination: c.destination,
      source: c.source,
      after: c.after.requirement,
      maxStay: c.after.maxStay,
      passports: [],
      befores: new Map<string, number>(),
    };
    g.passports.push(c.passport);
    g.befores.set(beforeReq, (g.befores.get(beforeReq) ?? 0) + 1);
    byKey.set(key, g);
  }
  return [...byKey.values()].sort(
    (a, b) =>
      b.verifiedOn.localeCompare(a.verifiedOn) ||
      b.passports.length - a.passports.length ||
      (countryMap.get(a.destination)?.name ?? "").localeCompare(countryMap.get(b.destination)?.name ?? ""),
  );
}

const destName = (code: string) => countryMap.get(code)?.name ?? code;

function headline(g: Group): string {
  const to = destName(g.destination);
  const n = g.passports.length;
  const now = `${NOW[g.after] ?? g.after}${g.after === "visa_free" && g.maxStay ? ` for ${g.maxStay}` : ""}`;
  if (n === 1) {
    const from = destName(g.passports[0]);
    return `${from} passport holders now ${now} for ${to}`;
  }
  return `${n} nationalities now ${now} for ${to}`;
}

function previously(g: Group): string {
  const parts = [...g.befores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([req, count]) =>
      req === "unknown"
        ? `${count} had no rule recorded`
        : `${count} ${BEFORE[req] ?? req}`,
    );
  return parts.join(", ");
}

export function renderVisaChanges(): string {
  const gs = groups();
  const countries = new Set(gs.map((g) => g.destination)).size;
  const cells = gs.reduce((s, g) => s + g.passports.length, 0);
  const dates = [...new Set(gs.map((g) => g.verifiedOn))].sort((a, b) => b.localeCompare(a));
  const canonical = `${SITE_ORIGIN}${CHANGES_PATH}`;

  const title = "Visa Rule Changes We've Verified";
  const description = `Every correction isvisarequired.com has made to its visa dataset: what the rule was, what it is now, the date it was checked and the official source. ${cells} corrections across ${countries} countries.`;

  const byDate = dates
    .map((date) => {
      const items = gs
        .filter((g) => g.verifiedOn === date)
        .map((g) => {
          const to = countryMap.get(g.destination);
          const dest = to ? `<a href="/countries/${slugify(to.name)}">${esc(to.flag)} ${esc(to.name)}</a>` : esc(g.destination);
          const who =
            g.passports.length === 1 && countryMap.get(g.passports[0]) && to
              ? ` <a href="/visa-requirements/${slugify(countryMap.get(g.passports[0])!.name)}/${slugify(to.name)}" style="color:#64748b">See the pair page →</a>`
              : "";
          return `<li style="margin:10px 0">
  <strong>${esc(headline(g))}</strong><br>
  <span style="color:#475569">Previously ${esc(previously(g))}. Destination: ${dest}.${who}</span><br>
  <span style="color:#64748b;font-size:13px">Verified against ${esc(g.source)}</span>
</li>`;
        })
        .join("");
      return `<h2 id="d-${date}">${esc(date)}</h2><ul style="padding-left:18px">${items}</ul>`;
    })
    .join("");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url: canonical,
      datePublished: dates[dates.length - 1] ?? DATA_LAST_UPDATED,
      dateModified: dates[0] ?? DATA_LAST_UPDATED,
      author: { "@type": "Organization", name: "isvisarequired.com" },
      publisher: { "@type": "Organization", name: "isvisarequired.com", url: SITE_ORIGIN },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: title, item: canonical },
      ],
    },
  ];

  const body = `
<nav class="crumbs"><a href="/">Home</a> › Visa rule changes</nav>
<h1>Visa rule changes we've verified</h1>
<div class="updated">${cells} corrections across ${countries} countries · Most recent ${esc(dates[0] ?? DATA_LAST_UPDATED)}</div>
<p class="lead">Our base dataset is a snapshot, and snapshots go stale. When a rule changes we check it against the country's own immigration authority, correct the cell, and record what it replaced. This is that trail — every correction, what the data said before, and the source it was checked against. <a href="${CHANGES_PATH}.xml">Subscribe by RSS</a>, or read <a href="/methodology">how we source our data</a>.</p>

<div class="stats">
  <div class="stat"><div class="n">${cells}</div><div class="k">Corrected rules</div></div>
  <div class="stat"><div class="n">${countries}</div><div class="k">Countries affected</div></div>
  <div class="stat"><div class="n">${dates.length}</div><div class="k">Verification rounds</div></div>
</div>

${byDate}

<div class="note" style="margin-top:20px">Corrections are applied to the checker the moment they are recorded, so the pages above already reflect them. Rules change without notice — always confirm with the official source before booking.</div>`;

  return page({ title, description, canonical, jsonLd, body });
}

export function renderVisaChangesRss(): string {
  const gs = groups().slice(0, 60);
  const items = gs
    .map((g) => {
      const to = countryMap.get(g.destination);
      const link = to ? `${SITE_ORIGIN}/countries/${slugify(to.name)}` : `${SITE_ORIGIN}${CHANGES_PATH}`;
      const pub = new Date(`${g.verifiedOn}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${esc(headline(g))}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(`${g.verifiedOn}-${g.destination}-${g.after}-${g.passports.length}`)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(`Previously ${previously(g)}. Verified against ${g.source}.`)}</description>
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>isvisarequired.com — verified visa rule changes</title>
    <link>${SITE_ORIGIN}${CHANGES_PATH}</link>
    <description>Corrections to our visa dataset: what changed, when it was verified, and against which official source.</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${(groups()[0]?.verifiedOn ?? DATA_LAST_UPDATED)}T00:00:00Z`).toUTCString()}</lastBuildDate>
${items}
</channel></rss>
`;
}
