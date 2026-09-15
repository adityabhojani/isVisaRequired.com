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
// seo/blogSeo.ts — headings, bold, italics, links, lists, GFM pipe tables and
// code fences. No raw HTML. Use "##" for a section: the page supplies the <h1>,
// so a post's own headings start at <h2>. Keep `slug` lowercase and hyphenated;
// once a post is live the slug is a permanent URL, so don't rename it.

export interface StaticPost {
  title: string;
  slug: string;
  /** Card blurb on /blog. Falls back to the meta description if that is absent. */
  excerpt: string;
  /**
   * The <meta name="description"> and og:description, 140-158 characters.
   * Written for the search result rather than for the card, so it says what the
   * reader gets. Falls back to `excerpt` when omitted.
   */
  metaDescription?: string;
  content: string;
  author: string;
  tags: string[];
  /** ISO date. Becomes datePublished in the Article JSON-LD. */
  created_at: string;
  /** ISO date. Bump this when you materially revise a post. */
  updated_at: string;
  /**
   * Questions the post answers, emitted as FAQPage structured data.
   *
   * These must MIRROR a visible FAQ section in `content`, not add to it. Google
   * treats structured data that isn't on the page as a manual-action offence,
   * and the rich result is not worth the risk. Write the section first, then
   * copy the questions and a one-or-two-sentence answer here.
   */
  faq?: { q: string; a: string }[];
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
  {
    title: "Can You Work Remotely on a Tourist Visa? The Real Test",
    slug: "can-you-work-remotely-on-a-tourist-visa",
    excerpt:
      "Three governments say in writing that a visitor may work remotely for a foreign employer. No other government we checked publishes a position. The rules that exist are written about who pays you, not about where your laptop is open.",
    metaDescription:
      "New Zealand, the UK and Canada allow remote work on a visitor entry in writing. The US and most of Europe say nothing. What the rules actually say.",
    author: "isvisarequired.com",
    tags: ["digital nomad", "remote work", "tourist visa", "visitor visa", "tax residency"],
    created_at: "2026-09-13",
    updated_at: "2026-09-13",
    faq: [
      {
        q: "Can I work on a tourist visa?",
        a: "If \"work\" means paid work for a local employer or local clients, none of the countries here permit it. If it means logging into your foreign employer's systems, New Zealand, the UK and Canada say yes in writing, and no other government we checked publishes a position either way.",
      },
      {
        q: "Which countries allow you to work remotely on a tourist visa?",
        a: "New Zealand, for visitor visas applied for on or after 27 January 2025, with no limit on the amount of work. The UK, under Appendix Visitor PA 4(h), provided remote work is not the primary purpose of the visit. Canada, on visitor status for up to six months with no work permit.",
      },
      {
        q: "Can digital nomads legally work in the US?",
        a: "USCIS's B-1 page takes no position on remote work for a foreign employer, and we could not load the State Department's detailed guidance at 9 FAM 402.2 to establish its position. The governing regulation, 22 CFR 41.31(b)(1), excludes \"local employment or labor for hire\" from B-1 business activity, a phrase aimed at the US labour market and not at a foreign salary. Treat that as unread rather than as permission.",
      },
      {
        q: "What happens if you get caught working on a tourist visa?",
        a: "We found no government publishing a penalty schedule for remote work specifically, because in most countries there is no rule about it to breach. What happens instead is refusal under the general entry rules: UK rule V 4.4 tests what you intend, and Schengen Article 6(1)(c) requires you to justify the purpose and conditions of your stay. Working for local clients is a separate matter and is squarely prohibited.",
      },
      {
        q: "Do I need a digital nomad visa or can I just use a tourist visa?",
        a: "If your destination is New Zealand, the UK or Canada and your stay fits the visitor period, the government has already answered in writing. A nomad visa buys a longer stay in some countries and an explicit tax position in others, though Japan's runs six months with no extension, which is no longer than Canada's ordinary visitor stay.",
      },
      {
        q: "What is the 183-day rule for tax residency?",
        a: "It is not one rule. The US applies a weighted three-year formula. The UK can treat you as resident well below 183 days, and guarantees non-residence only under 16 days, or 46 if you have not been resident for the three previous tax years, or 91 if you work full-time abroad with no more than 30 of those days worked. New Zealand counts 183 days in any rolling 12-month period, with part-days counted as whole days.",
      },
      {
        q: "How long can I stay in a country before I have to pay tax there?",
        a: "There is no universal number, and the immigration limit and the tax limit are set by different authorities. South Africa's remote work visa notice shows the split cleanly: with a double-taxation agreement in force you register with SARS after 183 aggregate days in 12 months, and without one you register regardless.",
      },
      {
        q: "Can you hire workers on tourist, student or digital nomad visas?",
        a: "The prohibitions quoted here are aimed at exactly this. UK rule V 4.4 bars a visitor from \"doing work for an organisation or business in the UK\", and the Croatian and Spanish nomad definitions exclude local clients beyond a fixed share. If someone is doing work for your local entity, their permission is the thing that fails.",
      },
    ],
    content: `Three governments say in writing that a visitor may work remotely for an employer abroad: New Zealand and the United Kingdom in their immigration rules, Canada on IRCC's pages though not in any regulation. No other government we checked publishes a position. Whether you can work remotely on a tourist visa turns on who pays you, not where your laptop is open.

The question people actually ask — "is it illegal to open my laptop?" — has no answer in most countries, because there is no rule about laptops to break. The UK's permission is conditional. New Zealand's is dated to a policy change in January 2025, so anything written before then describes a different rule. And tax is a separate body of law with its own thresholds, one of which bites at 16 days.

## Every prohibition names a local counterparty

The clearest drafting is British. Rule V 4.4 of [Appendix V: Visitor](https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-v-visitor) says a visitor must not intend to "work in the UK, which includes: (i) taking employment in the UK; and (ii) doing work for an organisation or business in the UK; and (iii) establishing or running a business as a self-employed person; and (iv) doing a work placement or internship; and (v) direct selling to the public; and (vi) providing goods and services". Every limb names a UK counterparty. None of the six mentions where the visitor is physically sitting.

V 4.6 completes it by prohibiting "payment from a UK source for any activities undertaken in the UK", subject to seven listed exceptions at (a) to (g): expenses; international drivers and seafarers; prize money; billing a UK client where the visitor's overseas employer is contracted to provide services to a UK company and the majority of the contract work is carried out overseas; multi-national companies that handle payment of employees' salaries from the UK for administrative reasons; permit-free festival performances; and permitted paid engagements.

New Zealand draws the same line and says so on the face of the page. Remote work must be for "a company, employer or client that is not in New Zealand", and Immigration New Zealand adds that it "does not include any work you do that is for a New Zealand employer" or "with a New Zealand business or person in New Zealand in exchange for goods or services".

Canada gives the reason outright. An [IRCC committee note](https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/committees/cimm-nov-07-2023/tech-talent-strategy-digital-nomads.html) on its Tech Talent Strategy says of digital nomads: "As they are not entering the Canadian labour market, they may enter as visitors and reside where they like for up to six months." South Africa's Minister of Home Affairs made the identical argument on another continent, describing remote workers as "highly paid individuals who are employed abroad and thus do not compete with local workers" in a [government media statement](https://www.gov.za/news/media-statements/minister-leon-schreiber-cutting-edge-visa-reform-combat-corruption-and-create).

## Which countries allow you to work remotely on a tourist visa?

| Country | What the government states | Where it is written |
|---|---|---|
| New Zealand | "All visitor visas applied for on or after 27 January 2025 allow you to work remotely in New Zealand", and "There is no limit to the amount of remote work you can do" | [Immigration New Zealand visitor visa guidance](https://www.immigration.govt.nz/visit/checking-or-changing-the-conditions-of-your-visitor-visa-or-nzeta/working-remotely-in-new-zealand-on-a-visitor-visa) |
| United Kingdom | A visitor may "undertake activities relating to their employment overseas remotely from within the UK, providing this is not the primary purpose of their visit" | [Appendix Visitor: Permitted Activities](https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-permitted-activities), PA 4(h) |
| Canada | "Digital nomads working remotely for an employer outside of Canada can live and work here for up to 6 months at a time. They don't need a work permit. All they need is visitor status." | [IRCC Tech Talent page](https://www.canada.ca/en/immigration-refugees-citizenship/campaigns/tech-talent.html) |

Before 27 January 2025 the answer for New Zealand was different, which is why pages recycling 2024 research get this country wrong.

The UK provision arrived in the January 2024 visitor route rewrite and is still live. The most recent statement of changes, [HC 584 of 3 September 2026](https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026/explanatory-memorandum-to-the-statement-of-changes-in-immigration-rules-hc-584-3-september-2026-accessible), touches Appendix V only to let visitors study at state-funded schools on Erasmus+ projects and to add eligibility requirements for those participants. It says nothing about remote working.

IRCC uses the words "live and work here" and permits it anyway.

## Can digital nomads legally work in the US?

The United States has no answer we could load, and that gap is the honest finding. The governing regulation, [22 CFR 41.31(b)(1)](https://www.govinfo.gov/content/pkg/CFR-2023-title22-vol1/xml/CFR-2023-title22-vol1-sec41-31.xml), says B-1 "business" covers "conventions, conferences, consultations and other legitimate activities of a commercial or professional nature" but excludes "local employment or labor for hire". The word carrying the weight is *local*.

[USCIS's B-1 page](https://www.uscis.gov/working-in-the-united-states/temporary-visitors-for-business/b-1-temporary-business-visitor) lists eligible activities as consulting with business associates, attending conventions, settling an estate, negotiating a contract, short-term training, transiting and deadheading. Remote work for a foreign employer appears on neither the permitted list nor a prohibited one.

We searched state.gov, travel.state.gov, fam.state.gov and uscis.gov and found no position we could open. The detailed State Department guidance at 9 FAM 402.2, which nearly every law-firm blog paraphrases, returned a TLS certificate error on every attempt and travel.state.gov returned HTTP 403, so we are not repeating anyone else's paraphrase of it ([how we source](/methodology)).

## Europe never mentions work at all

Article 6(1) of the [Schengen Borders Code, Regulation (EU) 2016/399](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0399), sets out the entry conditions a border guard applies to a third-country national: a valid travel document, a valid visa if required, justification of "the purpose and conditions of the intended stay" plus "sufficient means of subsistence", no SIS alert, and no threat to public policy, internal security, public health or international relations. Employment appears in none of subparagraphs (a) to (e).

The condition that actually bites is 6(1)(c), a purpose and affordability test. Member States then regulate employment in national law, and that is where the silence continues: Germany is the case we checked hardest and found nothing addressing remote work for a foreign employer on a short stay, in either direction. Treat it as unanswered. The constraint that ends most European stays is the [90 days in any 180](/schengen), not anything about work.

Australia we cannot quote. Condition 8101 of its Migration Regulations is the provision usually cited, and we could not open it: the legislation.gov.au page served us a table of contents only, and Home Affairs returned HTTP 403. We are not reproducing the clause text from a non-government source. We found no published Australian carve-out for remote work for an overseas employer either.

## What happens if you get caught working on a tourist visa?

UK rule V 4.4 is an intention test: a visitor "must not intend to" work in the UK. The Home Office's [visit caseworker guidance](https://www.gov.uk/government/publications/visit-guidance/visit-caseworker-guidance-accessible--2) tells officers to weigh "the proposed length of their stay and whether a stay of such a length would be financially viable without remote working on an ongoing basis", and to check that the "primary purpose for coming to the UK is to undertake another permitted activity, rather than specifically to work remotely from the UK". It also warns the arrangement must not amount to a secondment to a UK company or to the UK branch of the overseas employer.

That is an affordability and purpose test. A fortnight's holiday with some email is not what it is aimed at. Eight months in the UK on a stay that only balances because you keep billing is.

None of the seven governments whose visitor rules we read for this article — the UK, New Zealand, Canada, the US, Germany, Australia and South Africa — publishes a penalty schedule for remote work on a visitor entry. Most have no rule about it to breach. What exists instead is refusal under the general entry conditions or the intention rules, which is blunter: it happens at the desk, with no appeal you would recognise as one. If it does happen, [a refusal follows you into later applications](/guides/visa-refused-what-happens-next).

## How long can you stay before you owe tax?

Immigration New Zealand puts both bodies of law on one page. Having said yes to remote work, it adds that "You may have to pay tax if you are visiting New Zealand and working remotely for an overseas business or client"; that if your income is taxed in another country or territory you "may not need to pay tax in New Zealand" when you are here for less than 92 days in a 12-month period; and that if you are a tax resident in one of the countries and territories New Zealand has a tax treaty with, you "may be able to stay in New Zealand for up to 183 days before you need to pay tax". Then it tells you to "Contact Inland Revenue to discuss your situation."

[Inland Revenue's own test](https://www.ird.govt.nz/international-tax/individuals/tax-residency-status-for-individuals) makes you resident if "you've been in New Zealand for more than 183 days in any 12-month period", with "Parts of days (such as the day you arrive and leave) count as whole days" and no requirement that they be consecutive. A permanent place of abode in New Zealand also makes you resident, with no day count at all. Ceasing residence requires both no permanent place of abode and being "away from New Zealand for more than 325 days in any 12-month period".

The 183-day rule is not one rule:

- The [US substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) is a weighted three-year formula: 31 days in the current year, plus 183 days across three years counting all current-year days, one third of the first prior year and one sixth of the second. The IRS's own worked example: 120 days in each of 2023, 2024 and 2025 gives 120 + 40 + 20 = 180, just under.
- [The UK](https://www.gov.uk/tax-foreign-income/residence) treats 183 days as automatic residence, but automatic *non*-residence requires fewer than 16 days in the UK, or 46 if you have not been resident in the three previous tax years, or full-time work abroad averaging at least 35 hours a week with fewer than 91 UK days, no more than 30 of them worked. Sixteen is the number to remember: 183 is a ceiling, not a floor.
- South Africa's [remote work visa notice](https://www.dha.gov.za/images/notices/8october24/Remote_Work_Visa_-_requirements_-_9_Oct_2024.pdf), effective 9 October 2024, splits on treaties. If you are tax resident in a country with a double-taxation agreement in force with South Africa, you must register with SARS once present "for longer than an aggregate of 183 days during any 12-month period". If you are not, the notice requires registration outright.

Japan wires the two together at the eligibility stage. Its [digital nomad status](https://www.moj.go.jp/isa/applications/status/designatedactivities53_00001.html) is open only to nationals of countries "which are under the scope of the visa exemption arrangements (Temporary Visitor) and also subjected to Japan's Tax Conventions".

These are the published tests, not a view on your position. Where two countries both claim you, the treaty tie-breaker decides, and that is a question to put to a revenue authority in writing, not to a border officer.

## Digital nomad visa vs tourist visa: what you actually get

Certainty, mostly. Duration only sometimes: Japan's status runs "Six months (No extension will be granted.)", requires annual income of at least ¥10 million and medical travel insurance of ¥10 million or more, and so buys no longer than the six-month visitor stay Canada gives for free.

What these programmes share is a definition written around the employer. The test is where the paying entity sits:

| Programme | The test it applies | Money |
|---|---|---|
| [Croatia](https://mup.gov.hr/aliens-281621/temporary-stay-of-digital-nomads-286853/286853) | Works "for a company or his own company that is not registered in the Republic of Croatia" and has no Croatian clients; up to 18 months | "at least 2.5 average monthly net salaries" — €3,622.50 monthly, €43,470 for 12 months, €65,205 for 18 |
| [Spain](https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Consular/Visado-de-teletrabajo.aspx) | May "only be able to work for companies located outside the national territory", but Spanish clients are allowed where they do "not exceed 20 % of the total of his professional activity"; 1 year | "200% of the minimum wage (SMI) per month"; the consular page publishes no euro figure, and the SMI itself is set at €1,221 a month for 2026 by [Royal Decree 126/2026](https://www.boe.es/buscar/act.php?id=BOE-A-2026-3815), re-fixed by decree each year |
| [Indonesia (E33G)](https://www.imigrasi.go.id/wna/daftar-visa-indonesia/E33G) | Residence "to perform duties for a company abroad"; selling goods or services is prohibited except where the holder's work duties require it; 1 year | US$60,000 a year from a company established outside Indonesia, verified by bank records |
| [Estonia](https://www.politsei.ee/en/instructions/visa-and-extending-period-of-stay/long-term-visa) | "continuing working for an employer registered in a foreign country"; up to 365 days in 12 consecutive months | Proof of legal income over the preceding six months; the page publishes no figure |
| [South Africa](https://www.dha.gov.za/images/notices/8october24/Remote_Work_Visa_-_requirements_-_9_Oct_2024.pdf) | A visitor's visa under section 11(1)(b)(iv) for a "prescribed activity of remote work", over 3 months to 3 years, requiring a signed contract with a foreign-based employer | Published figures conflict, see below |

Spain has quantified how much of your work may touch the local market before the permission stops applying. You can only legislate that number if what you are regulating is the counterparty.

The South African figures do not agree with each other. The Department of Home Affairs notice states a gross salary of no less than R650,796 per annum, but the Minister's own media statement attributes that same figure to the General Work Visa as double the median formal-sector income, and secondary reporting puts the remote work threshold at R1 million, though none of the sources we found cites a gazette page. We could not load the underlying Government Gazette to settle which is current, so check the gazette before relying on either figure. Note (c) of the notice separately bars the holder from taking up employment in South Africa, and provides that "no person holding a remote work visa may apply for a change of status to his or her visa while in the Republic, unless under exceptional circumstances as prescribed for visitors visas."

We track [32 open nomad programmes across 31 countries](/digital-nomad), each checked against the issuing government's page, with Costa Rica running two. Five more are recorded as ended, which is the argument for reading the instrument itself: [these programmes close](/blog/digital-nomad-visas-that-have-closed).

## What to ask before you book

Where is the entity that pays you registered? Move that registration into the country you are visiting and every rule above flips to no.

Will anyone in the destination pay you, hire you or buy from you? That is what converts permitted remote work into prohibited local work. Spain sets the line at 20% of your activity, the UK at any UK source with seven listed exceptions.

How long, and counted how? Immigration and tax authorities in the same country count days differently, and part-days count as whole days in New Zealand.

Does the government publish anything at all? If it does, read the instrument. If it does not, you are relying on silence, which is not permission, and you should say that to yourself out loud before you commit to six months.

## Common questions

### Can I work on a tourist visa?

If "work" means paid work for a local employer or local clients, none of the countries here permit it. If it means logging into your foreign employer's systems, New Zealand, the UK and Canada say yes in writing, and no other government we checked publishes a position either way.

### Which countries allow you to work remotely on a tourist visa?

New Zealand, for visitor visas applied for on or after 27 January 2025, with no limit on the amount of work. The UK, under Appendix Visitor PA 4(h), provided remote work is not the primary purpose of the visit. Canada, on visitor status for up to six months with no work permit.

### Can digital nomads legally work in the US?

USCIS's B-1 page takes no position on remote work for a foreign employer, and we could not load the State Department's detailed guidance at 9 FAM 402.2 to establish its position. The governing regulation, 22 CFR 41.31(b)(1), excludes "local employment or labor for hire" from B-1 business activity, a phrase aimed at the US labour market and not at a foreign salary. Treat that as unread rather than as permission.

### What happens if you get caught working on a tourist visa?

We found no government publishing a penalty schedule for remote work specifically, because in most countries there is no rule about it to breach. What happens instead is refusal under the general entry rules: UK rule V 4.4 tests what you intend, and Schengen Article 6(1)(c) requires you to justify the purpose and conditions of your stay. Working for local clients is a separate matter and is squarely prohibited.

### Do I need a digital nomad visa or can I just use a tourist visa?

If your destination is New Zealand, the UK or Canada and your stay fits the visitor period, the government has already answered in writing. A nomad visa buys a longer stay in some countries and an explicit tax position in others, though Japan's runs six months with no extension, which is no longer than Canada's ordinary visitor stay.

### What is the 183-day rule for tax residency?

It is not one rule. The US applies a weighted three-year formula. The UK can treat you as resident well below 183 days, and guarantees non-residence only under 16 days, or 46 if you have not been resident for the three previous tax years, or 91 if you work full-time abroad with no more than 30 of those days worked. New Zealand counts 183 days in any rolling 12-month period, with part-days counted as whole days.

### How long can I stay in a country before I have to pay tax there?

There is no universal number, and the immigration limit and the tax limit are set by different authorities. South Africa's remote work visa notice shows the split cleanly: with a double-taxation agreement in force you register with SARS after 183 aggregate days in 12 months, and without one you register regardless.

### Can you hire workers on tourist, student or digital nomad visas?

The prohibitions quoted here are aimed at exactly this. UK rule V 4.4 bars a visitor from "doing work for an organisation or business in the UK", and the Croatian and Spanish nomad definitions exclude local clients beyond a fixed share. If someone is doing work for your local entity, their permission is the thing that fails.`,
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
