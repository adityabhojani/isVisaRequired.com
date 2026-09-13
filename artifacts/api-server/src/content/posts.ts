// Editorial posts that ship with the repo.
//
// WHY THESE LIVE IN CODE
// The admin editor writes posts to the `blog_posts` table, which is the right
// place for anything the founder writes by hand. These ones are different: each
// is a write-up of our own dataset, so the post and the data it describes have
// to move together and be reviewable in the same diff. They are merged into the
// public blog list, the per-post page, the server-rendered shell and the blog
// sitemap, exactly like database posts.
//
// A database post ALWAYS wins on a slug collision, so the founder can override
// anything here from /admin/blog without touching code.
//
// HOW TO ADD ONE
// Append an entry below. `content` is markdown, rendered by miniMarkdown() in
// seo/blogSeo.ts — headings, bold, italics, links, lists and code fences only,
// no raw HTML and no tables. Keep `slug` lowercase and hyphenated; once a post
// is live the slug is a permanent URL, so don't rename it.

export interface StaticPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  /** ISO date. Becomes datePublished in the Article JSON-LD. */
  created_at: string;
  /** ISO date. Bump this when you materially revise a post. */
  updated_at: string;
}

export const STATIC_POSTS: StaticPost[] = [
  {
    title: "“Visa-free” is quietly turning into “apply online first”",
    slug: "travel-authorisations-replacing-visa-free-entry",
    excerpt:
      "Re-checking our dataset against government sources produced 793 corrections across 18 countries. The single biggest pattern: countries that used to let you just turn up now want an authorisation before you board.",
    author: "isvisarequired.com",
    tags: ["visa policy", "ETA", "travel authorisation"],
    created_at: "2026-09-13",
    updated_at: "2026-09-13",
    content: `Most visa datasets — ours included, before we started correcting it — record two useful states and one lie. The useful ones are *visa required* and *visa on arrival*. The lie is *visa free*, because in 2025 and 2026 a growing number of countries kept the words “visa free” while adding a mandatory online form you must complete before you travel.

We re-checked our data country by country against each government's own page. That produced **793 corrections across 18 countries**, all listed with sources on our [verified changes log](/visa-changes). Reading them together, one pattern dominates.

## Countries that added an online step

**United Kingdom.** 33 European nationalities that could previously arrive with just a passport now need an Electronic Travel Authorisation. It was rolled out through 2025 and enforced from 25 February 2026 — airlines deny boarding without it. Ireland is unaffected under the Common Travel Area. Source: [gov.uk/eta](https://www.gov.uk/eta).

**Seychelles.** Every visitor — all 194 nationalities in our dataset — must hold a Travel Authorisation obtained before departure. Seychelles has never issued tourist visas, which is exactly why the old “visa free” label was so misleading here. Source: Seychelles Immigration, [ics.gov.sc](https://www.ics.gov.sc/permits/visitors-permit).

**Ghana.** The Ghana Immigration Service e-Visa portal launched on 25 May 2026. Its own eligibility engine returns just two answers: ECOWAS and AES nationals enter visa-free, and all 180 other nationalities must get an ETA or e-Visa online first. We checked every nationality individually against the portal.

**Guinea-Bissau.** Prior authorisation is now required for the 180 nationalities outside ECOWAS, per UK FCDO, France Diplomatie and Global Affairs Canada travel advice.

**Cabo Verde.** Despacho n.º 244/GMAI/2026, published in the Boletim Oficial on 23 January 2026, requires nationals of 91 countries to hold a visa before arrival — including for transit. 89 of them are in our dataset.

**Namibia.** Visa-free entry ended for 33 nationalities on 1 April 2025.

**Sri Lanka and Kenya** both went the other way in tone but the same way in practice: Sri Lanka's ETA became free from 25 May 2026, and Kenya's eTA carries tiered exemptions — free or cheap, but still a form to file before you fly.

## And countries going the other way

The trend is not one-directional. China extended its unilateral visa-exemption scheme to a dozen more nationalities and pushed the expiry to 31 December 2027. Saudi Arabia broadened its visitor e-Visa, Oman published a wider exemption list, and Uzbekistan's presidential decree of 3 November 2025 opened up further from 1 January 2026.

The difference is that expansions get press releases and contractions do not. A country adding an ETA rarely announces it in a way that reaches the comparison sites — which is why stale "visa free" entries survive for years.

## What this means before you book

An ETA is not a visa, and that distinction matters less than it sounds. Practically:

- **The airline enforces it, not the border.** Without the authorisation you are refused at check-in, so there is no arguing your case on arrival.
- **Approval is usually fast but not instant.** Most systems answer in minutes; some take up to three working days, and a mismatch on your passport details restarts that clock.
- **It is tied to your passport.** Renew the passport and most authorisations die with it, even if they had months left.
- **"Visa free for 90 days" is a separate question from validity.** See [visa validity vs duration of stay](/guides/visa-validity-vs-duration-of-stay) for why those two numbers are not the same thing.

Check your own combination on the [visa checker](/) — every pair page shows the date we last verified that rule and the official source we read it from. Where a rule has changed since our base dataset was frozen, the [verified changes log](/visa-changes) records what it was, what it is now, and who says so.`,
  },
  {
    title: "Five digital nomad visas that no longer exist",
    slug: "digital-nomad-visas-that-have-closed",
    excerpt:
      "Iceland, Bermuda, the Cayman Islands, Antigua & Barbuda and Anguilla have all closed their remote-work routes. Every one of them is still listed as available somewhere — including, until this week, by us.",
    author: "isvisarequired.com",
    tags: ["digital nomad", "visa policy"],
    created_at: "2026-09-13",
    updated_at: "2026-09-13",
    content: `We went through all 37 programmes in our [digital nomad visa directory](/digital-nomad) and checked each one against the government's own page. Five of them are not programmes any more. They had been sitting in our directory with income thresholds and fees next to them, which is worse than not listing them at all: a closed programme with a number beside it looks researched.

Here is each one, what actually happened, and where the traffic went.

## Iceland — Long-Term Visa for remote workers

**Repealed on 13 May 2026**, when the new Visa Act (No. 37/2026) came into force. The provision of the Foreign Nationals Act that the long-term remote-work visa rested on was struck out.

There is a replacement, but not a like-for-like one. Stays longer than 90 days now go through a short-term residence permit, and the Directorate of Immigration has not yet published its requirements — no income threshold, no fee, no maximum length. Anyone quoting you €7,000 a month for Iceland is quoting a rule that no longer exists, and nobody can currently tell you what replaced it.

Official source: the [Directorate of Immigration](https://island.is/en/o/directorate-of-immigration). The old utl.is address now redirects there and hosts no remote-work page.

## Bermuda — Work From Bermuda Certificate

**Concluded on 28 February 2025.** The application page carries the closure notice itself, which is more than most closed programmes manage.

The successor route is Permission to Reside on an Annual Basis. It is a different thing with different conditions, not a rebranding.

## Cayman Islands — Global Citizen Concierge Programme

Closed, and closed thoroughly. The programme's own website, eworkcayman.com, no longer resolves in DNS at all — the domain is gone, not merely returning a 404. The programme appears in no current WORC immigration form and in no 2026 fee schedule. Long stays now go through the ordinary immigration framework.

This is the one most likely to still be listed elsewhere at US$100,000 a year, because there is no closure announcement anywhere to pick up. The evidence is entirely absence.

## Antigua & Barbuda — Nomad Digital Residence

Ended. Unusually, the programme's own government portal says so outright.

## Anguilla — Work from Anguilla

No live official page anywhere on gov.ai. A site-wide search returns a dozen results, none of them a programme page.

We want to be straight about this one: we found no official notice announcing the closure, only the complete absence of the programme from the government's own site. That is why we mark it ended rather than merely dormant — but it is an inference from absence, and we say so on the directory page too.

## Why closed programmes outlive their governments

Launches get press releases. Closures get a quietly deleted page. Comparison sites, ours included, are built to ingest announcements, so a programme that stops existing without saying so can sit in a directory for years.

The specific failure mode worth knowing about: **a dead official link is not treated as a signal.** Most listings check that a URL exists, not that it still describes the thing they are listing. Cayman's link had not just broken, its domain had been given up — and the listing survived.

We now record a status and a check date against every programme, and closed ones are pulled out of the directory into their own section instead of being deleted, so that searching for "Iceland digital nomad visa" lands you on the fact that it was repealed rather than on a stale income figure.

The [37 programmes we track](/digital-nomad) each show the government page their numbers came from and the date we last read it. If you are planning around one of these, read the [full write-up of what else was wrong](/blog/what-we-found-checking-every-digital-nomad-visa) — the closures were not the only problem.`,
  },
  {
    title: "What we found checking every digital nomad visa against its own government's page",
    slug: "what-we-found-checking-every-digital-nomad-visa",
    excerpt:
      "37 programmes, every field read off the issuing government's own page, every finding then re-checked by someone trying to disprove it. 218 values changed. Japan's income requirement was out by a factor of ten.",
    author: "isvisarequired.com",
    tags: ["digital nomad", "data quality", "visa policy"],
    created_at: "2026-09-13",
    updated_at: "2026-09-13",
    content: `Our digital nomad directory carried income thresholds, government fees and durations for 37 countries. None of them had a source attached. They were roughly the same numbers you find on every other nomad visa site, which is not a coincidence and not a defence.

So we checked all of them: every field, against the page published by the government that issues the visa. Each finding was then handed to a second reviewer whose only job was to try to disprove it. **218 field values changed.** Five programmes turned out not to exist at all — that is [its own article](/blog/digital-nomad-visas-that-have-closed).

Here is what was wrong, sorted by how badly.

## Errors of magnitude

**Japan: out by a factor of ten.** We listed ¥1,000,000 a year. The Immigration Services Agency requires **¥10,000,000**. At the lower figure the visa looks like an easy option for a junior remote worker; at the real one it is out of reach for most people who would consider it.

**Thailand: out by two orders of magnitude.** We listed a US$200 government fee. The Long-Term Resident visa costs **50,000 baht** per person, roughly US$1,400. Two other things were wrong in the same record and both matter more than the fee: a work permit is *not* granted to the Work-from-Thailand Professionals category, and the well-publicised 17% flat tax applies only to Highly-skilled Professionals, not to remote workers.

**Belize: out by an order of magnitude.** We listed US$2,500 a month. The Belize Tourism Board's own page states an annual figure and only an annual figure: **US$75,000** for an individual, US$100,000 for couples and families. That is US$6,250 a month.

**The Philippines: the wrong programme entirely.** Our record described the SRRV, a retirement visa run by a different agency. Since that record was written the Philippines created an actual Digital Nomad Visa by Executive Order No. 86, signed 24 April 2025 and issued by the Department of Foreign Affairs. One year, renewable, health insurance mandatory, open only to nationals of countries that offer nomad visas to Filipinos in return. One caveat we are publishing alongside it: we could not confirm from any official source that the DFA has actually started issuing them.

**Portugal: the wrong visa code.** We called it the D8. Portugal's remote-work residence visa is the **D9**; D8 is family accompaniment of a residence-visa applicant. If you turn up at a consulate asking for the D8 you are asking for something else.

**Malaysia: the wrong currency.** We listed RM 24,000 a year, about US$5,400. MDEC's official FAQ requires **US$24,000** a year for tech professions and **US$60,000** for everything else — a fivefold difference for most applicants.

**The UAE: too high, for once.** We listed US$5,000 a month. The official requirement is **US$3,500**.

## The numbers nobody's government ever said

A subtler category, and the one that taught us the most. Several of our figures were not wrong so much as invented by arithmetic: a government states a monthly threshold, a comparison site multiplies by twelve, and the result circulates as an official annual requirement.

Malta publishes €42,000 a year and no monthly figure. Hungary publishes €3,000 net a month and no annual figure. Costa Rica's rentista law sets US$2,500 a month, in dollars, and our record showed an annual figure in euros that matched nothing. The UAE publishes a monthly figure only. Spain's own consular sheets state a percentage, not an amount.

Our reviewer rejected every one of those derived numbers, and rightly. So the directory now shows whichever figure the government actually states and leaves the other one blank. It is less tidy. It is also the difference between reporting and guessing.

## Thresholds that move while you read them

The deeper problem with a fixed number in a comparison table is that a lot of these requirements are not fixed numbers at all:

- **Spain** — 200% of the minimum wage (SMI), re-set by royal decree each year. €2,442 a month in 2026.
- **Portugal** — four times the guaranteed minimum monthly wage, €920 in 2026. It moves every January.
- **Croatia** — 2.5 average monthly net Croatian salaries, recalculated annually. €3,622.50 today.
- **Colombia** — three times the legal monthly minimum wage. COP 5,252,715 in 2026.
- **Ecuador** — three Salarios Básicos Unificados a month; the 2026 SBU is US$482.
- **Romania** — three times the Romanian average gross monthly salary, for each of the six months before you apply.
- **South Korea** — tiered against the previous year's GNI per capita, and the tier depends on your age, whether you will live inside the Seoul metropolitan area, and whether family come with you.
- **Mexico** — expressed in UMA, not pesos and certainly not dollars.

A site that prints one euro figure for these is publishing a snapshot with no expiry date on it. We now name the formula as well as this year's value, so you can tell when the number has gone stale.

## What changed on the site

Every programme in the [directory](/digital-nomad) now carries the government page its figures were read from and the date we read it, shown as a "Verified" badge you can click through to. Where a checker could not verify something — Spain's consular fee is set by reciprocity and quoted in local currency, Costa Rica's fee page sits behind bot protection we did not try to defeat — the field is blank rather than filled with a tilde and a guess.

Where two official sources disagree, we say so instead of picking one: Cape Verde's immigration authority lists a 5,000 CVE fee while Turismo de Cabo Verde lists €20 a person plus a €34 airport fee.

None of this makes the data permanent. Governments change these rules without announcing them — that is the whole lesson of the five closed programmes. What it does is make the data checkable: you can see where every number came from and how old it is, and go and look for yourself.
`,
  },
];

const BY_SLUG = new Map(STATIC_POSTS.map((p) => [p.slug, p]));

export function staticPostBySlug(slug: string): StaticPost | undefined {
  return BY_SLUG.get(slug);
}

/** Newest first, matching the ORDER BY created_at DESC the database queries use. */
export function staticPostsNewestFirst(): StaticPost[] {
  return [...STATIC_POSTS].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
