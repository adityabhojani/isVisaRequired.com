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
    title: "Can you work remotely on a tourist visa? The real test",
    slug: "can-you-work-remotely-on-a-tourist-visa",
    excerpt:
      "Three governments say in writing that a visitor may work remotely for a foreign employer. No other government we checked publishes a position. The rules that exist are written about who pays you, not about where your laptop is open.",
    metaDescription:
      "New Zealand, the UK and Canada allow remote work on a visitor entry in writing. The US and most of Europe say nothing. What the rules actually say.",
    author: "isvisarequired.com",
    tags: ["digital nomad", "remote work", "tourist visa", "visitor visa", "tax residency"],
    created_at: "2026-09-15",
    updated_at: "2026-09-15",
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
        a: "USCIS's B-1 page takes no position on remote work for a foreign employer, and we could not load the State Department's detailed guidance at 9 FAM 402.2 to establish its position. The State Department's visa regulation, 22 CFR 41.31(b)(1), excludes \"local employment or labor for hire\" from B-1 business activity, but it does not define \"local\" or say whether that phrase reaches work for a foreign employer. Treat that as unread rather than as permission.",
      },
      {
        q: "What happens if you get caught working on a tourist visa?",
        a: "We found no government publishing a penalty schedule for remote work specifically. What happens instead is refusal under the general entry rules: UK rule V 4.4 tests what you intend, and Schengen Article 6(1)(c) requires you to justify the purpose and conditions of your stay. Working for local clients is a separate matter and is squarely prohibited.",
      },
      {
        q: "Do I need a digital nomad visa or can I just use a tourist visa?",
        a: "If your destination is New Zealand, the UK or Canada and your stay fits the visitor period, the government has already answered in writing. A nomad visa buys a longer stay in some countries and an explicit tax position in others, though Japan's runs six months with no extension, which is no longer than Canada's ordinary visitor stay.",
      },
      {
        q: "What is the 183-day rule for tax residency?",
        a: "It is not one rule. The US applies a weighted three-year formula. The UK can treat you as resident well below 183 days, and guarantees non-residence only under 16 days, or 46 if you have not been resident for the three previous tax years, or 91 if you work full-time abroad with no more than 30 of those days worked. New Zealand counts more than 183 days in any 12-month period, with part-days counted as whole days, unless you qualify as a non-resident visitor: for arrivals on or after 1 April 2026, a visitor who is not working for a New Zealand employer or selling to people or businesses in New Zealand can stay up to 275 days in any 18-month period before becoming resident under the day count.",
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

The question people actually ask — "is it illegal to open my laptop?" — has no published answer in most of the countries we checked, because their visitor rules do not mention remote work at all. The UK's permission is conditional. New Zealand's is dated to a policy change in January 2025, so anything written before then describes a different rule. And tax is a separate body of law with its own thresholds, one of which bites at 16 days.

## The rules that answer the question name a local counterparty

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

Article 6(1) of the [Schengen Borders Code, Regulation (EU) 2016/399](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0399), sets out the entry conditions a border guard applies to a third-country national: a valid travel document, a valid visa if required, justification of "the purpose and conditions of the intended stay" plus "sufficient means of subsistence", no SIS alert, no threat to public policy, internal security, public health or international relations, and, under point (f) added for the Entry/Exit System, biometric data where required. Employment appears in none of subparagraphs (a) to (e).

The condition that actually bites is 6(1)(c), a purpose and affordability test. Member States then regulate employment in national law, and that is where the silence continues: Germany is the case we checked hardest and found nothing addressing remote work for a foreign employer on a short stay, in either direction. Treat it as unanswered. The constraint that ends most European stays is the [90 days in any 180](/schengen), not anything about work.

Australia is blunter. Condition 8101 in Schedule 8 of the [Migration Regulations 1994](https://www.legislation.gov.au/F1996B03551/latest/text), the provision usually cited, reads in full: "The holder must not engage in work in Australia." It is imposed on Tourist stream visitor visas (subclass 600); the Electronic Travel Authority (subclass 601) and eVisitor (subclass 651) instead carry condition 8115, "The holder must not work in Australia other than by engaging in a business visitor activity." Regulation 1.03 defines work as "an activity that, in Australia, normally attracts remuneration", and neither condition mentions an overseas employer. We found no published Australian carve-out for remote work for an overseas employer either.

## What happens if you get caught working on a tourist visa?

UK rule V 4.4 is an intention test: a visitor "must not intend to" work in the UK. The Home Office's [visit caseworker guidance](https://www.gov.uk/government/publications/visit-guidance/visit-caseworker-guidance-accessible--2) tells officers to weigh "the proposed length of their stay and whether a stay of such a length would be financially viable without remote working on an ongoing basis", and to check that the "primary purpose for coming to the UK is to undertake another permitted activity, rather than specifically to work remotely from the UK". It also warns the arrangement must not amount to a secondment to a UK company or to the UK branch of the overseas employer.

That is an affordability and purpose test. A fortnight's holiday with some email is not what it is aimed at. Eight months in the UK on a stay that only balances because you keep billing is.

None of the seven governments whose visitor rules we read for this article — the UK, New Zealand, Canada, the US, Germany, Australia and South Africa — publishes a penalty schedule for remote work on a visitor entry. Most have no rule about it to breach. What exists instead is refusal under the general entry conditions or the intention rules, which is blunter: it happens at the desk, with no appeal you would recognise as one. If it does happen, [a refusal follows you into later applications](/guides/visa-refused-what-happens-next).

## How long can you stay before you owe tax?

Immigration New Zealand puts both bodies of law on one page. Having said yes to remote work, it adds that "You may have to pay tax if you are visiting New Zealand and working remotely for an overseas business or client"; that if your income is taxed in another country or territory you "may not need to pay tax in New Zealand" when you are here for less than 92 days in a 12-month period; and that if you are a tax resident in one of the countries and territories New Zealand has a tax treaty with, you "may be able to stay in New Zealand for up to 183 days before you need to pay tax". Then it tells you to "Contact Inland Revenue to discuss your situation and to check if you will need to pay tax in New Zealand."

[Inland Revenue's own test](https://www.ird.govt.nz/international-tax/individuals/tax-residency-status-for-individuals) makes you resident if "you've been in New Zealand for more than 183 days in any 12-month period (unless you're a non-resident visitor)", with "Parts of days (such as the day you arrive and leave) count as whole days" and no requirement that they be consecutive. That exception is the one that matters here: you are a non-resident visitor if you visit for up to 275 days in any 18-month period and, among other conditions, are not working for or paid by a New Zealand resident, do not sell goods or services to people or businesses in New Zealand, and are required to pay tax in the country where you are tax resident. Inland Revenue's IR292 guide applies this to arrivals on or after 1 April 2026. A permanent place of abode in New Zealand also makes you resident, with no day count at all. Ceasing residence requires both no permanent place of abode and being "away from New Zealand for more than 325 days in any 12-month period".

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
| [Spain](https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Consular/Visado-de-teletrabajo.aspx) | Employees "will only be able to work for companies located outside the national territory"; the self-employed may also work for a company located in Spain where that work does "not exceed 20 % of the total of his professional activity"; 1 year | "200% of the minimum wage (SMI) per month"; the consular page publishes no euro figure, and the SMI itself is set at €1,221 a month for 2026 by [Royal Decree 126/2026](https://www.boe.es/buscar/act.php?id=BOE-A-2026-3815), re-fixed by decree each year |
| [Indonesia (E33G)](https://www.imigrasi.go.id/wna/daftar-visa-indonesia/E33G) | Residence to carry out duties for a company abroad (our translation of the Indonesian-language page); selling goods or services is prohibited except where the holder's work duties require it; 1 year | US$60,000 a year from a company established outside Indonesia, verified by bank records |
| [Estonia](https://www.politsei.ee/en/instructions/visa-and-extending-period-of-stay/long-term-visa) | The applicant "continues working for an employer registered in a foreign country"; up to 365 days in 12 consecutive months | Proof of legal income over the preceding six months; the page publishes no figure |
| [South Africa](https://www.dha.gov.za/images/notices/8october24/Remote_Work_Visa_-_requirements_-_9_Oct_2024.pdf) | A visitor's visa under section 11(1)(b)(iv) for a "prescribed activity of remote work", over 3 months to 3 years, requiring a signed contract with a foreign-based employer | Gross salary of no less than the equivalent of R650,796 a year, shown by three months of bank statements |

Spain has quantified how much of your work may touch the local market before the permission stops applying. You can only legislate that number if what you are regulating is the counterparty.

The South African figure is settled, whatever you read elsewhere. The Department of Home Affairs notice, effective 9 October 2024, sets a gross salary of no less than the equivalent of R650,796 per annum, and South Africa's High Commission in Ottawa gives the same figure for the nomad visa; the Minister's media statement of the same date uses that R650,796 figure as the General Work Visa threshold outside the Trusted Employer Scheme. The R1 million figure still in circulation comes from then-Minister Aaron Motsoaledi's 9 April 2024 briefing on the draft regulations, before the requirement was finalised. We could not load the Government Gazette itself, but every official source we could load gives R650,796. Note (c) of the notice separately bars the holder from taking up employment in South Africa, and provides that "no person holding a remote work visa may apply for a change of status to his or her visa while in the Republic, unless under exceptional circumstances as prescribed for visitors visas."

We track [32 open nomad programmes across 31 countries](/digital-nomad), each checked against the issuing government's page, with Costa Rica running two. Five more are recorded as ended, which is the argument for reading the instrument itself: [these programmes close](/blog/digital-nomad-visas-that-have-closed).

## What to ask before you book

Where is the entity that pays you registered? Move that registration into the country you are visiting and every rule above flips to no.

Will anyone in the destination pay you, hire you or buy from you? That is what converts permitted remote work into prohibited local work. Spain sets the line at 20% of a self-employed teleworker's professional activity and allows employed teleworkers no Spanish work at all; the UK sets it at any UK source, with seven listed exceptions.

How long, and counted how? Immigration and tax authorities in the same country count days differently, and part-days count as whole days in New Zealand.

Does the government publish anything at all? If it does, read the instrument. If it does not, you are relying on silence, which is not permission, and you should say that to yourself out loud before you commit to six months.

## Common questions

### Can I work on a tourist visa?

If "work" means paid work for a local employer or local clients, none of the countries here permit it. If it means logging into your foreign employer's systems, New Zealand, the UK and Canada say yes in writing, and no other government we checked publishes a position either way.

### Which countries allow you to work remotely on a tourist visa?

New Zealand, for visitor visas applied for on or after 27 January 2025, with no limit on the amount of work. The UK, under Appendix Visitor PA 4(h), provided remote work is not the primary purpose of the visit. Canada, on visitor status for up to six months with no work permit.

### Can digital nomads legally work in the US?

USCIS's B-1 page takes no position on remote work for a foreign employer, and we could not load the State Department's detailed guidance at 9 FAM 402.2 to establish its position. The State Department's visa regulation, 22 CFR 41.31(b)(1), excludes "local employment or labor for hire" from B-1 business activity, but it does not define "local" or say whether that phrase reaches work for a foreign employer. Treat that as unread rather than as permission.

### What happens if you get caught working on a tourist visa?

We found no government publishing a penalty schedule for remote work specifically. What happens instead is refusal under the general entry rules: UK rule V 4.4 tests what you intend, and Schengen Article 6(1)(c) requires you to justify the purpose and conditions of your stay. Working for local clients is a separate matter and is squarely prohibited.

### Do I need a digital nomad visa or can I just use a tourist visa?

If your destination is New Zealand, the UK or Canada and your stay fits the visitor period, the government has already answered in writing. A nomad visa buys a longer stay in some countries and an explicit tax position in others, though Japan's runs six months with no extension, which is no longer than Canada's ordinary visitor stay.

### What is the 183-day rule for tax residency?

It is not one rule. The US applies a weighted three-year formula. The UK can treat you as resident well below 183 days, and guarantees non-residence only under 16 days, or 46 if you have not been resident for the three previous tax years, or 91 if you work full-time abroad with no more than 30 of those days worked. New Zealand counts more than 183 days in any 12-month period, with part-days counted as whole days, unless you qualify as a non-resident visitor: for arrivals on or after 1 April 2026, a visitor who is not working for a New Zealand employer or selling to people or businesses in New Zealand can stay up to 275 days in any 18-month period before becoming resident under the day count.

### How long can I stay in a country before I have to pay tax there?

There is no universal number, and the immigration limit and the tax limit are set by different authorities. South Africa's remote work visa notice shows the split cleanly: with a double-taxation agreement in force you register with SARS after 183 aggregate days in 12 months, and without one you register regardless.

### Can you hire workers on tourist, student or digital nomad visas?

The prohibitions quoted here are aimed at exactly this. UK rule V 4.4 bars a visitor from "doing work for an organisation or business in the UK", and the Croatian and Spanish nomad definitions exclude local clients beyond a fixed share. If someone is doing work for your local entity, their permission is the thing that fails.`,
  },
  {
    title: "What happens if you overstay your visa, by country",
    slug: "what-happens-if-you-overstay-a-visa",
    excerpt:
      "The fine is rarely the punishment. Four legal systems that borrowed nothing from each other — Thai, Japanese, American and EU — size the re-entry ban by how you left, not only by how long you stayed. Figures taken only from government sources we loaded and read.",
    metaDescription:
      "Overstay penalties by country, from primary law: the fine is capped and small, the re-entry ban is the real cost, and how you leave changes its length.",
    author: "isvisarequired.com",
    tags: ["visa overstay", "entry bans", "immigration law", "schengen", "united states visas", "japan", "thailand"],
    created_at: "2026-09-16",
    updated_at: "2026-09-16",
    faq: [
      {
        q: "What happens if I overstay my visa by one day?",
        a: "In the US, no bar: the 3-year bar needs more than 180 days. But if you were admitted to a date certain, your nonimmigrant visa is void from the moment your authorised stay ended under INA 222(g), and you will normally need a new visa issued in your country of nationality. In the Netherlands the published one-year ban band starts at an overstay of more than three days, and the IND does not say what applies at or below three. Elsewhere it is a fine and an officer's discretion.",
      },
      {
        q: "Is there a grace period for overstaying a visa?",
        a: "Not for a short visitor stay in any country we checked. The UAE publishes one for residence permits: its official portal says residents are \"granted longer flexible grace periods that reach up to 6 months (according to resident category)\" after the permit expires or is cancelled. That is a different thing from a visitor margin. The Dutch three-day line is the only published visitor threshold we found, and it does one narrow thing, marking where the one-year ban band starts. The overstay is still recorded and the fine still falls due. Everything else is officer discretion, plus the named legal remedies (satisfactory departure, force majeure extension, rebuttal with evidence).",
      },
      {
        q: "How many days can you overstay before you are banned?",
        a: "There is no universal number, and the EU deliberately refuses to set one: Article 11(2) of the Return Directive requires the ban length to be assessed on the individual case. The published thresholds that do exist are national: the Dutch one-year band starting above 3 days, over 90 days in Thailand's surrender column, and over 180 days for the US 3-year bar.",
      },
      {
        q: "What is the 3-year bar and the 10-year bar?",
        a: "Under 8 U.S.C. 1182(a)(9)(B), more than 180 days but less than a year of unlawful presence plus a voluntary departure before proceedings gives a 3-year bar; a year or more gives a 10-year bar with no voluntary-departure element. Both are measured on a single stay, per USCIS. The clock runs from your departure; the bar itself only bites at your next application for admission.",
      },
      {
        q: "Does an overstay cancel my visa automatically?",
        a: "In the United States, yes, for an admission to a date certain. INA 222(g) voids a nonimmigrant visa \"beginning after the conclusion of\" the authorised period of stay, and readmission normally requires a new visa issued in your country of nationality. We found no other country that voids the visa by statute the way INA 222(g) does. Everywhere else we checked, cancellation is an officer's decision on the individual file.",
      },
      {
        q: "Does an overstay in one Schengen country affect all of them?",
        a: "An entry ban does. Article 24(1) of Regulation (EU) 2018/1861 requires the issuing state to enter an alert for refusal of entry in the Schengen Information System, which every Schengen border post can see. A ban from one member state is enforced across all 29 Schengen states. Ireland sits outside Schengen and does not receive the refusal-of-entry alert.",
      },
      {
        q: "Can you be deported for overstaying a visa?",
        a: "Yes, and several countries make it a criminal offence too: up to three years or ¥3 million in Japan under Article 70(1)(v), up to a year in Germany where no departure period was granted or it has expired, jail and caning in Singapore above 90 days. The ordinary outcome for a cooperative short overstayer is a fine and a departure, not a prosecution.",
      },
      {
        q: "How much is the fine for overstaying a visa?",
        a: "In the US, there appears to be no fine at all for the overstay itself. Published figures elsewhere include 500 baht per day in Thailand (capped at 20,000 baht), AED 50 per day in the UAE, €501–€10,000 in Spain and up to RM10,000 in Malaysia, compoundable at RM3,000. Any \"Schengen-wide\" fine figure you see quoted is not traceable to any EU instrument.",
      },
      {
        q: "Can I still get a visa in the future after an overstay?",
        a: "Usually, once the ban expires. The US bars run 3 or 10 years from departure, EU bans are capped at five years in principle, and the Netherlands can lift a one-year ban once half of it has passed, on request, if you left the EU voluntarily and independently within the set departure period and meet five further conditions. What a past overstay does is make the next application harder to win, which is the same territory as a refusal on your record.",
      },
      {
        q: "Do I have to declare a past overstay on a visa application?",
        a: "We could not find a government page stating a universal declaration duty. The duty is created by the question on the form in front of you, not by the overstay, and a false answer is its own ground of refusal, separate from and worse than the thing you were hiding. Assume the record exists regardless: the EES automatically flags entry records with no matching exit, and entry bans are held as SIS alerts.",
      },
    ],
    content: `You pay a fine, you fly home, and nothing else happens that day. It gets serious later, and somewhere else. The real penalty is a re-entry ban, and in four legal systems that borrowed nothing from each other — Thai, Japanese, American and EU — the length of that ban turns on how you left, not only on how long you stayed.

That second half is the part nobody writes down. Thailand runs two separate ban schedules depending on whether you surrendered or were arrested. Japan gives one year to someone who comes forward and leaves under a departure order, and five to someone who is deported. Spanish law says that, in circumstances set by regulation, the ban shall not be imposed if you leave while the sanction proceedings are still running, and shall be revoked if you leave inside the voluntary compliance window of the expulsion order. Identical conduct, different exit, five times the ban.

## The fine is capped. The ban is not.

Thailand puts the arithmetic on a government page. The overstay fine is **500 baht per day** and stops growing at 20,000 baht once you pass 40 days, per the [Royal Thai Embassy in Washington D.C.](https://washingtondc.thaiembassy.org/en/page/advice-on-thailand-visa-overstay-regulations) Stay 40 days over and you pay the full 20,000 baht, roughly US$600 at September 2026 exchange rates, which is our arithmetic and not the embassy's. Stay four years over and you pay exactly the same 20,000 baht, plus a five-year ban if you surrender or a ten-year ban if you are arrested. The money is not the sanction.

The UAE charges AED 50 per day on the federal immigration authority's own [service fee schedule](https://icp.gov.ae/en/services-details/?serviceid=68e73faf5ae59b00117389f1). Spain treats irregular presence as an administrative offence under Article 53(1)(a) of [Ley Orgánica 4/2000](https://www.boe.es/buscar/act.php?id=BOE-A-2000-544), fined €501 to €10,000 under Article 55(1)(b), a range set by the officer rather than a per-day meter.

No US fine attaches to the overstay itself. We read INA 212(a)(9)(B), INA 222(g) and 8 CFR part 217 in full and found no fining provision; the pages carrying "a $2,000 fine for each violation" cite no provision for it. What the INA does fine is failure to depart under an order: up to **$998 for each day** in violation under 8 U.S.C. 1324d, where someone under a final removal order wilfully refuses to leave, and $1,992 to $9,970 under 8 U.S.C. 1229c(d) for blowing a voluntary departure deadline. Both figures are the inflation-adjusted amounts in [8 CFR 280.53](https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-8?part=280&section=280.53), published 2 January 2025. Neither reaches the traveller who overstays and flies home.

The endlessly copied "Schengen fine of €500–1,000" is worse. There is no EU-wide overstay fine schedule, because penalties are set nationally, and the figure does not appear in any EU act, Commission page or member state fee list we could find. It reads as an invented number that aggregators now cite to each other. Our [sourcing rules](/methodology) are why it is not in the table below.

## How you leave decides the ban

[Article 11(1) of the EU Return Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32008L0115) states the rule more plainly than any guidance page: a return decision **shall** carry an entry ban if no period for voluntary departure was granted, or if the obligation to return was not complied with. "In other cases return decisions may be accompanied by an entry ban." Shall against may. Article 7(1) sets that voluntary departure window at seven to thirty days, and Article 11(2) caps bans at five years in principle while requiring the length to be fixed "with due regard to all relevant circumstances of the individual case". No EU-wide days-to-years tariff exists, whatever the calculator sites publish.

Spain wrote the mechanism into statute. Article 58(2) of Ley Orgánica 4/2000 directs the authority, in circumstances set by regulation, not to impose an entry ban where the person left national territory while sanction proceedings for irregular stay or unauthorised work under Article 53.1(a) or (b) were running, and to revoke a ban imposed on those grounds where the person leaves inside the voluntary compliance period of the expulsion order. The same article allows up to ten years, rather than the ordinary five, where the person is a serious threat to public order, public security, national security or public health.

In Germany the trigger is a list of events, and every item on it is an official act against you. Section 11(1) of the [Residence Act](https://www.gesetze-im-internet.de/aufenthg_2004/__11.html) applies a ban to foreigners who have been expelled, removed or deported, who are subject to a deportation order under section 58a, or who have been refused entry for attempting to enter on forged or falsified documents. The ban covers the federal territory and every other EU and Schengen state, except one where the person is separately allowed to enter and stay. Section 95(1) makes unlawful residence punishable by up to a year's imprisonment only where three conditions are all met: you are enforceably required to leave, no departure period was granted or it has expired, and deportation has not been suspended.

The IND publishes real numbers. Its [entry ban page](https://ind.nl/en/entry-ban) sets a one-year ban for an overstay "of over 3 and up to 90 days" and two years as the usual period. It will lift the one-year ban halfway through, but only on request, and only where you left the EU voluntarily and on your own initiative within the set period, have stayed outside the EU without interruption for at least half the ban, and meet four further conditions on criminal record, prosecution and public order.

In Japan the one-year and five-year outcomes sit side by side, in the same item of the same Act. Under Article 5(1)(ix) of the [Immigration Control and Refugee Recognition Act](https://laws.e-gov.go.jp/law/326CO0000000319), a person deported from Japan is generally barred for five years, a repeat deportee for ten, and a person who leaves under a departure order for one. Overstaying is separately a crime: Article 70(1)(v) punishes remaining beyond the permitted period of stay with up to **3 years' imprisonment or a fine not exceeding ¥3 million**, or both. Since 10 June 2024, Article 24-3 of the Japanese original has made a departure order available to two groups: someone who appeared voluntarily at an immigration office, intending to leave Japan promptly, before any violation investigation began; or someone who, after an investigation began but before being notified that they are subject to deportation, told an immigration inspector or immigration control officer that they intend to leave promptly. In both cases the person must also fall outside the listed deportation grounds in Article 24, have no conviction carrying imprisonment for the listed Penal Code and other offences, never have been deported or left under a departure order before, and be expected with certainty to leave Japan promptly. Saying you will leave is necessary and nowhere near sufficient, and when you say it matters: someone who only declared it after an investigation began is barred for five years rather than one if they want to come back for a short stay. The official English translation predates the 2023 amendment that made these changes, which is why most English-language summaries still describe the old rule. The Japanese original governs.

## The US 3-year and 10-year bars

Both sit in [8 U.S.C. 1182(a)(9)(B)](https://www.govinfo.gov/content/pkg/USCODE-2023-title8/html/USCODE-2023-title8-chap12-subchapII-partII-sec1182.htm). The 3-year bar requires more than 180 days but less than one year of unlawful presence, a voluntary departure "prior to the commencement of proceedings", and it bites at your next application for admission, and not a day earlier. The 10-year bar requires one year or more and carries no voluntary-departure element at all.

[USCIS](https://www.uscis.gov/laws-and-policy/other-resources/unlawful-presence-and-inadmissibility) states both are measured on unlawful presence accrued "during a single stay", so two separate 100-day overstays do not add up to a 3-year bar. The permanent bar under 212(a)(9)(C) is a different provision entirely: it needs either an aggregate of more than one year of unlawful presence or a prior removal order, and in both cases a re-entry or attempted re-entry "without being admitted". Overstaying and flying home cannot trigger it.

For the 3-year bar only, clause (iv) tolls the count for up to 120 days while a timely, non-frivolous extension or change-of-status application is pending, provided you were lawfully admitted or paroled and have not worked without authorisation. It does not toll the one-year period behind the 10-year bar.

## Overstaying by a day, or by three

Grace periods are rare and narrow, but they are not unknown. The UAE publishes one: its [official portal](https://u.ae/en/information-and-services/visa-and-emirates-id/Visa-information/general-provisions-for-the-residence-visa) states that residents "are granted longer flexible grace periods that reach up to 6 months (according to resident category) to stay in the country after the residence permit is cancelled or expired". That is a residence provision. For short visitor stays we found no published grace period in the countries we checked. The closest thing to a published visitor threshold is the Dutch one-year band, which starts at an overstay of more than three days; the IND does not say what applies at or below three, and the threshold governs the ban rather than whether the overstay is recorded.

A one-day US overstay does one thing at once, if you were admitted to a date certain: it kills the visa. Under [8 U.S.C. 1202(g)](https://www.govinfo.gov/content/pkg/USCODE-2023-title8/html/USCODE-2023-title8-chap12-subchapII-partIII-sec1202.htm) the nonimmigrant visa is "void beginning after the conclusion of such period of stay", and you can then normally only be readmitted on a new visa issued "in a consular office located in the country of the alien's nationality". No bar. But the multiple-entry sticker is dead and you have lost the option of reapplying from a convenient third country.

The date that matters is the one on the I-94, not the one on the visa. USCIS recommends applying to extend "at least 45 days before your authorized stay expires" and points you to [the lower right-hand corner of the Form I-94](https://www.uscis.gov/visit-the-united-states/extend-your-stay). We wrote a separate guide on [why visa validity and permitted duration of stay are two different numbers](/guides/visa-validity-vs-duration-of-stay): the visa expiry is the date people read, and the I-94 date is the one that counts.

## When the flight is cancelled and you overstay by six hours

Three legal instruments cover this situation, although none of them mentions cancelled flights by name.

On the US Visa Waiver Programme, [8 CFR 217.3(a)](https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-8?part=217&section=217.3) lets the district director grant **satisfactory departure** of up to 30 days where an emergency prevents departure. It is discretionary, it covers admissions under part 217, and the favourable treatment is conditional: only "if departure is accomplished during that period" are you regarded as "having satisfactorily accomplished the visit without overstaying the allotted time".

In the Schengen area, [Article 33(1) of the Visa Code](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32009R0810) says a visa "shall be extended" free of charge where the holder proves force majeure prevented them leaving. Article 33(2) offers a discretionary extension for serious personal reasons at €30.

Force majeure is read narrowly, and one immigration service says so out loud. The IND's [extension page](https://ind.nl/en/short-stay/extend-schengen-visa-or-visa-exempt-term) states that if the airline cancelled your flight but you could still travel home with another airline or from another airport, you cannot extend. A delay is not force majeure if a rebooking existed.

Where no record of your movement exists, Article 12 of the [Schengen Borders Code](https://eur-lex.europa.eu/eli/reg/2016/399/2024-07-11) puts the burden on you. The article was rewritten for the Entry/Exit System: Article 12(1) now turns on there being no EES individual file, or an entry/exit record carrying no exit date after the authorised stay expired, rather than on a missing passport stamp. Authorities "may presume" you overstayed, and Article 12(3) lets you rebut that with "credible evidence, such as transport tickets". Keep the boarding pass and the cancellation email.

## Schengen: the system now counts for you

The EU [Entry/Exit System](https://home-affairs.ec.europa.eu/policies/schengen/smart-borders/entry-exit-system_en) began operating on 12 October 2025 and replaced passport stamping entirely on 10 April 2026. Article 12 of [Regulation (EU) 2017/2226](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R2226) requires the EES to "automatically identify which entry/exit records do not have exit data immediately following the date of expiry of an authorised stay". The overstayer list generates itself. Every article suggesting a short overstay might slip past a tired officer is describing a system that has been switched off. Our [guide to the Entry/Exit System](/guides/eu-entry-exit-system-ees) covers what it records.

The limit being measured is 90 days in any 180-day period, assessed against the 180 days preceding each day of stay under Article 6(1) of the Borders Code. If you are anywhere near it, count it on the [90/180-day calculator](/schengen) rather than in your head.

One country's ban is 29 countries' ban. Article 24(1) of [Regulation (EU) 2018/1861](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32018R1861) says member states "shall enter an alert for refusal of entry and stay" where an entry ban has been issued under the Return Directive. Overstay in Portugal, get banned, and Norwegian border police see the alert. Germany's Section 11(1) says it from the other end, extending the ban across the EU and Schengen states. Breaching it is punished three times as hard as the original offence, at up to three years' imprisonment under Section 95(2).

## How likely is any of this?

DHS publishes the figures for the US. In [Fiscal Year 2024](https://www.dhs.gov/sites/default/files/2025-09/25_0912_cbp_entry-exit-overstay-report-fiscal-year-2024.pdf), of 46,657,108 expected departures by air and sea, the total overstay rate was 1.15%, or 538,548 events. Only 55,594 of those were out-of-country overstays: people who overstayed and then left. That is the audience for this page, roughly one traveller in a thousand.

Most of the rest resolve. By 6 February 2025 the FY2024 suspected in-country overstay count had fallen from 482,954 to 427,204, and DHS had confirmed the departure or status adjustment of more than **99.08%** of FY2024 nonimmigrants scheduled to depart by air and sea. The report does not say how many of those departures followed enforcement. Suspected in-country overstay rates differ sharply by group: 0.43% for Visa Waiver Programme countries, 2.22% for non-VWP countries excluding Canada and Mexico, and 2.45% for students and exchange visitors, against 1.04% overall. The equivalent total overstay rates are 0.49%, 2.33% and 3.23%, against 1.15% overall. We could not find a government dataset isolating arrests of visa overstayers, so we are not giving you an arrest figure.

## Penalties by country

| Where | Fine or criminal penalty | Re-entry ban |
| --- | --- | --- |
| United States | No fine found in INA 212(a)(9)(B), INA 222(g) or 8 CFR part 217. Separate penalties apply to failure to depart under an order | 3 years after more than 180 days and under a year, where you left voluntarily before proceedings; 10 years after a year or more |
| EU / Schengen framework | Set nationally; no EU-wide schedule exists | Mandatory only where no voluntary departure period was granted or it was ignored; 5 years in principle |
| Germany | Up to 1 year's imprisonment or a fine, and only where no departure period was granted or it has expired | Mandatory after expulsion, removal, deportation, a section 58a order or refusal of entry on forged documents; can also be ordered under section 11(6) if you miss a departure deadline set for you (normally no more than 1 year the first time); 5 years maximum outside the section 11(5) to (5b) cases; breaching it carries up to 3 years |
| Netherlands | No fine published | 1 year for an overstay of over 3 and up to 90 days; 2 years is the usual period |
| Spain | €501–€10,000, administrative | Not imposed if you leave while proceedings run, or revoked if you leave within the voluntary compliance period, in circumstances set by regulation; otherwise up to 5 years, or up to 10 for a serious threat to public order, public security, national security or public health |
| UAE | AED 50 per day | No figure published |
| Thailand | 500 baht per day, capped at 20,000 baht from 40 days | Surrender: 1 year (over 90 days) up to 10 years (over 5 years). Arrested: 5 years (under a year), 10 years (over a year) |
| Singapore | Up to S$4,000 or 6 months' jail for 90 days or less; over 90 days, jail plus at least 3 strokes of the cane | Not stated in section 15(3) |
| Japan | Up to 3 years' imprisonment or ¥3 million under Article 70(1)(v) | Departure order 1 year, or 5 years for a short-stay return if you only declared your intent to leave after an investigation began; deported 5 years (1 year for a non-short-stay return if allowed to self-depart under Article 52(5)); repeat deportee 10 years |
| Malaysia | Up to RM10,000 or 5 years under section 15(4); compoundable at RM3,000 | No figure published |

Four caveats, because the cells above are not all equally solid. Thailand's two-column schedule comes from the [Royal Thai Consulate-General in Ho Chi Minh City](https://hochiminh.thaiembassy.org/en/publicservice/64058-thailand-overstay-measures) summarising Ministry of Interior Order 1/2558, enforced from 20 March 2016; we could not load immigration.go.th to confirm it at source. Malaysia's RM3,000 figure is the compound for section 15(4) on the Immigration Department's [frequently committed offences page](https://www.imi.gov.my/index.php/en/main-services/entry-requirement-into-malaysia-en/frequently-committed-offences/); the department's separate [compound action page](https://www.imi.gov.my/index.php/en/enforcement/compound-action/) sets the schedule under the Immigration (Compounding of Offences) Regulations 2003 with two ceilings, RM3,000 and RM15,000, and does map them to sections, section 15(4) falling in the RM3,000 group. The UAE rate conflicts: ICP's live fee schedule says AED 50 per day, secondary sites quote AED 100 from Dubai GDRFA material we could not locate anywhere on gdrfad.gov.ae, and GDRFA's own [legal awareness page](https://gdrfad.gov.ae/en/node/74) confirms a daily fine exists while publishing no rate. Singapore's caning provision is [section 15(3) of the Immigration Act 1959](https://sso.agc.gov.sg/Act/IA1959?ProvIds=pr15-); section 325(1) of the Criminal Procedure Code exempts women and men over 50, who face up to S$6,000 instead.

## Common questions

### What happens if I overstay my visa by one day?

In the US, no bar: the 3-year bar needs more than 180 days. But if you were admitted to a date certain, your nonimmigrant visa is void from the moment your authorised stay ended under INA 222(g), and you will normally need a new visa issued in your country of nationality. In the Netherlands the published one-year ban band starts at an overstay of more than three days, and the IND does not say what applies at or below three. Elsewhere it is a fine and an officer's discretion.

### Is there a grace period for overstaying a visa?

Not for a short visitor stay in any country we checked. The UAE publishes one for residence permits: its official portal says residents are "granted longer flexible grace periods that reach up to 6 months (according to resident category)" after the permit expires or is cancelled. That is a different thing from a visitor margin. The Dutch three-day line is the only published visitor threshold we found, and it does one narrow thing, marking where the one-year ban band starts. The overstay is still recorded and the fine still falls due. Everything else is officer discretion, plus the named legal remedies (satisfactory departure, force majeure extension, rebuttal with evidence).

### How many days can you overstay before you are banned?

There is no universal number, and the EU deliberately refuses to set one: Article 11(2) of the Return Directive requires the ban length to be assessed on the individual case. The published thresholds that do exist are national: the Dutch one-year band starting above 3 days, over 90 days in Thailand's surrender column, and over 180 days for the US 3-year bar.

### What is the 3-year bar and the 10-year bar?

Under 8 U.S.C. 1182(a)(9)(B), more than 180 days but less than a year of unlawful presence plus a voluntary departure before proceedings gives a 3-year bar; a year or more gives a 10-year bar with no voluntary-departure element. Both are measured on a single stay, per USCIS. The clock runs from your departure; the bar itself only bites at your next application for admission.

### Does an overstay cancel my visa automatically?

In the United States, yes, for an admission to a date certain. INA 222(g) voids a nonimmigrant visa "beginning after the conclusion of" the authorised period of stay, and readmission normally requires a new visa issued in your country of nationality. We found no other country that voids the visa by statute the way INA 222(g) does. Everywhere else we checked, cancellation is an officer's decision on the individual file.

### Does an overstay in one Schengen country affect all of them?

An entry ban does. Article 24(1) of Regulation (EU) 2018/1861 requires the issuing state to enter an alert for refusal of entry in the Schengen Information System, which every Schengen border post can see. A ban from one member state is enforced across all 29 Schengen states. Ireland sits outside Schengen and does not receive the refusal-of-entry alert.

### Can you be deported for overstaying a visa?

Yes, and several countries make it a criminal offence too: up to three years or ¥3 million in Japan under Article 70(1)(v), up to a year in Germany where no departure period was granted or it has expired, jail and caning in Singapore above 90 days. The ordinary outcome for a cooperative short overstayer is a fine and a departure, not a prosecution.

### How much is the fine for overstaying a visa?

In the US, there appears to be no fine at all for the overstay itself. Published figures elsewhere include 500 baht per day in Thailand (capped at 20,000 baht), AED 50 per day in the UAE, €501–€10,000 in Spain and up to RM10,000 in Malaysia, compoundable at RM3,000. Any "Schengen-wide" fine figure you see quoted is not traceable to any EU instrument.

### Can I still get a visa in the future after an overstay?

Usually, once the ban expires. The US bars run 3 or 10 years from departure, EU bans are capped at five years in principle, and the Netherlands can lift a one-year ban once half of it has passed, on request, if you left the EU voluntarily and independently within the set departure period and meet five further conditions. What a past overstay does is make the next application harder to win, which is the same territory as [a refusal on your record](/guides/visa-refused-what-happens-next).

### Do I have to declare a past overstay on a visa application?

We could not find a government page stating a universal declaration duty. The duty is created by the question on the form in front of you, not by the overstay, and a false answer is its own ground of refusal, separate from and worse than the thing you were hiding. Assume the record exists regardless: the EES automatically flags entry records with no matching exit, and entry bans are held as SIS alerts.`,
  },
  {
    title: "How long does a visa take? Two clocks, not one",
    slug: "how-long-does-a-visa-take",
    excerpt:
      "A Schengen visa must be decided in 15 calendar days. A UK visit visa is published at 3 weeks. Both clocks only start once your application is lodged and your biometrics are in, and one US embassy publishes 398 days just to reach that appointment.",
    metaDescription:
      "Visa processing times start only once your biometrics are in. The months go on the appointment queue before that. What the law guarantees, country by country.",
    author: "isvisarequired.com",
    tags: ["visa processing times", "schengen visa", "uk visa", "us visa", "administrative processing", "visa appointments", "travel authorisation"],
    created_at: "2026-09-16",
    updated_at: "2026-09-16",
    faq: [
      {
        q: "How long does it take to get a visa appointment?",
        a: "Anywhere from days to nearly two years, depending on the post. The US Embassy in Bogota publishes 398 days for a B1/B2 interview and 634 for applicants who are not resident in Colombia or Venezuela, while Bratislava publishes 16. Schengen is the exception that legislated the wait: Article 9(2) of the Visa Code says the appointment \"shall, as a rule, take place within a period of two weeks\".",
      },
      {
        q: "How long after the visa interview will I get my visa?",
        a: "For Schengen, 15 calendar days from lodging, extendable to 45. For the US, there is no deadline in law at all, and no government source we could load publishes a routine post-interview issuance time.",
      },
      {
        q: "How long does a visa take after biometrics?",
        a: "That is precisely when the published clock starts. UKVI says it begins processing once you attend your appointment to give fingerprints and a photograph, so its published 3 weeks (or 12 for family routes) runs from that day. Schengen is the same in substance, because Article 19 makes biometrics part of what an admissible application requires. Repeat Schengen applicants may be exempt from giving them again under Article 13(3) if their prints are less than 59 months old in the Visa Information System.",
      },
      {
        q: "How long does administrative processing take?",
        a: "No official source states a limit. The US Embassy in Panama says \"there is no estimate how long it may take\" and that cases can run beyond a year, after which they may be administratively closed unless you ask for them to remain open. The widely repeated \"60 days\" figure is not something we could confirm on any government page.",
      },
      {
        q: "What is 221(g)?",
        a: "Section 221(g) of the Immigration and Nationality Act, codified at 8 U.S.C. § 1201(g), is the provision under which a consular officer refuses a visa where the applicant appears ineligible or the application is incomplete. A 221(g) letter means your application is currently refused; it may be overcome if administrative processing completes in your favour. The statute sets no time limit.",
      },
      {
        q: "How long does an ETA take?",
        a: "The UK ETA costs £20 and is usually decided by email within a day, though it can take up to 3 working days. Australia's ETA is usually granted immediately, and the NZeTA averages 24 hours. These schemes are fast because they are automated and involve no interview or biometrics appointment.",
      },
    ],
    content: `A Schengen visa must be decided within 15 calendar days of lodging. A UK visit visa is published at 3 weeks. So how long does a visa take? Those numbers are honest and nearly useless, because both clocks only start once your application is lodged and your biometrics are in, which for most applicants means an in-person appointment, and the US Embassy in Bogota publishes 398 days just to reach a visa interview appointment.

The published figure measures adjudication. It does not measure the queue in front of adjudication, and at the worst US posts that queue is the bigger number by an order of magnitude. Both systems say so: the UK outright, in a heading on its own guidance page, and the EU through Article 23(1) of the Visa Code, which runs the 15 days only from an application admissible under Article 19.

## When does the processing clock actually start?

UK Visas and Immigration puts a heading on it. Its guidance on [visa processing times for applications outside the UK](https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk) contains the section "When your application processing time starts", and the answer is that UKVI begins processing once you either verify your identity using the UK Immigration: ID Check app, or "attend your appointment at a visa application centre (VAC) to provide your fingerprints and a photograph (biometric information)". Finding a slot and getting to the centre both sit outside the published 3 weeks entirely.

Schengen reaches the same place through its statute rather than its guidance. Article 23(1) of the [EU Visa Code, Regulation (EC) No 810/2009](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02009R0810-20240628) says applications "shall be decided on within 15 calendar days of the date of the lodging of an application which is admissible in accordance with Article 19". Article 19 defines admissibility to require that "the biometric data of the applicant have been collected" and "the visa fee has been collected". Both happen at the appointment. So the 15 days cannot, as a matter of construction, cover the wait to get one.

One exception worth knowing if you are a repeat applicant: Article 13(3) provides that fingerprints entered in the Visa Information System for the first time less than 59 months before a new application "shall be copied to the subsequent application", so you may not need to give them again.

## How long does a Schengen visa take to process?

Fifteen calendar days, extendable to 45. Article 23(2) allows the extension "in individual cases, notably when further scrutiny of the application is needed". On its face "notably" introduces an example rather than closing the list, but the Commission's own Visa Code Handbook I restates the rule as allowing the extension "in individual cases, where further scrutiny of the application is necessary", so expect it to be used for that. Article 23(2a), inserted by [Regulation (EU) 2019/1155](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019R1155), adds a rule that most summaries omit: "Applications shall be decided on without delay in justified individual cases of urgency."

If you find a page quoting **60 days** for a Schengen visa, it is citing repealed law. The old Article 23(3) was deleted by the 2019 reform, and the consolidated text now shows only a deletion marker where it stood.

The European Commission's own [guidance on applying for a Schengen visa](https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy/applying-schengen-visa_en) restates the rule as "15 days", extendable "to up to 45 days". It drops the word *calendar* and recasts a legal deadline as a "normal processing time".

## The rule nobody quotes: Schengen also regulated the appointment

Article 9(2) of the Visa Code: "Applicants may be required to obtain an appointment for the lodging of an application. The appointment shall, as a rule, take place within a period of two weeks from the date when the appointment was requested."

Two weeks, in law, for the thing everyone else leaves unmeasured. It is weak law: "as a rule" carries a great deal of weight, no remedy is stated, and we could find no Member State publishing a compliance rate against it. But the EU is the one system that put a number on the queue itself. Article 9(3) goes further: in justified cases of urgency the consulate "may allow applicants to lodge their applications either without appointment, or an appointment shall be given immediately". That is a stated route rather than a matter of goodwill, though the consulate decides what counts as a justified urgency, and, like Article 9(2), the provision carries no remedy; the Commission's handbook says that in such cases "an appointment should be given immediately or direct access to the consulate for submitting the application should be allowed".

Article 9(1) sets both edges of the window: no more than six months before travel, and as a rule no later than 15 calendar days before it.

## How long does it take to get a US visa appointment?

It depends almost entirely on which building you are queuing at. Two official embassy pages, both live when we checked them on 15 September 2026:

| Category | Bratislava | Bogota |
|---|---|---|
| Visitor (B1/B2), interview required | 16 days | 398 days |
| Students and exchange visitors (F, M, J) | 16 days | 20 days |
| Petition-based workers (H, L, O, P) | 16 days | 24 days |
| Non-residents of Colombia or Venezuela | not published | 634 days |
| Interview waiver | 7 days | 4 days |

Same visa, same adjudication, a wait that differs by a factor of 25. [Bratislava's figures](https://sk.usembassy.gov/visa-appointment-wait-time/) were last updated on 8 September 2026 and apply to residents and citizens of Slovakia. [Bogota's](https://co.usembassy.gov/visas/bogota-nonimmigrant-visa-wait-times/) carry no visible date and the page's embedded modification stamp reads 14 April 2025, so treat them as roughly seventeen months old. The US Embassy in Canada separately tells applicants who are [not resident in Canada](https://ca.usembassy.gov/consular-services/) to "anticipate a wait time of approximately 600 calendar days for an appointment", on a page stamped June 2025.

The non-resident figures are not an accident of demand. [8 U.S.C. § 1202(h)](https://www.govinfo.gov/content/pkg/USCODE-2023-title8/html/USCODE-2023-title8-chap12-subchapII-partIII-sec1202.htm) requires an in-person interview of every applicant aged 14 to 79 unless the requirement is waived, with the waiver authority sitting in the same subsection, and requires one regardless of age where the applicant is applying in a country where they are neither a national nor a resident, or was previously refused a visa, unless that refusal was overcome or a waiver of ineligibility obtained. Congress built the queue into the statute.

It then got longer. A [State Department notice effective 1 October 2025](https://cr.usembassy.gov/interview-waiver-update-september-18-2025/) narrowed interview waivers sharply: all applicants, "including applicants under the age of 14 and over the age of 79", now generally need an interview, with the exceptions reduced mainly to diplomatic categories and B1/B2 or H-2A renewals within 12 months of expiry. Every applicant who would previously have skipped the interview now joins the queue Bogota measures in hundreds of days. Embassy sites mirror these notices and go stale: Manila still carried the superseded July version on 15 September 2026.

The State Department's central wait-times tool at travel.state.gov is the canonical source for these numbers, but it refused automated access on 15 September 2026, so every US figure here comes from an individual embassy's own page. That is also [how we source everything else](/methodology).

## How long does a UK visa take?

Three weeks for most visit, study and work routes. Twelve weeks for family routes — partner or spouse, parent, child, and adult coming to be cared for by a relative — and 12 weeks again for British National (Overseas), which gov.uk lists separately under other visas and permits. The uniformity is the tell: this is a service target, not a measurement.

Two details that eat the margin. UKVI says its weeks "are based on the UK working week (Monday to Friday) and include public holidays in the UK" but "do not include public holidays in other countries"; the page never says which way a holiday moves your date, and its own change log describes the wording as a clarification that "processing times do not include bank holidays", so leave slack for holidays.  And applying from inside the UK is a different scheme altogether: UKVI's [customer service standards for visitors and transit](https://www.gov.uk/government/publications/visitors-and-transit-customer-service-standards/visitors-and-transit-customer-service-standards) give a Standard Visitor application 8 weeks in-country against 3 weeks out.

Unlike Canada, New Zealand and Australia, the Home Office attaches no percentage to these standards. No "90% within". We read the standards document looking for one; there isn't a figure in it.

## "Processing time" is not one kind of number

Six systems, six different things behind the same phrase:

| System | What the published number is |
|---|---|
| Schengen | A legal deadline: 15 calendar days, extendable to 45 |
| UK | A flat service target; the hit rate is published separately, in quarterly Home Office transparency data |
| Canada | The time taken to process **80%** of past applications of that type |
| New Zealand | Two figures: the median (50%) and the 80th percentile, in working days |
| Australia | Recently decided applications, with an express no-guarantee disclaimer |
| India (e-Visa) | Nothing. The portal publishes no decision time at all |

[IRCC](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html) is explicit that its clock "starts the day we receive your complete application", that for a visitor visa applied for from outside Canada its number "tells you how long it took us to process most complete applications in the past" and does not include "the time you need to give your biometrics", so, like the UK's, it leaves the biometrics step off the clock (IRCC's forward-looking forecasts, which do count biometrics, cover other programs such as permanent residence). Canada also publishes its own hidden months, in a line most applicants never reach: add 3 to 4 months for mailing if you are applying from outside Canada and the US.

[Immigration New Zealand](https://www.immigration.govt.nz/process-to-apply/waiting-for-a-visa/processing-a-visa-application/how-long-it-takes-to-process-an-application/visitor-visa-and-nzeta-wait-times/) publishes the most honest methodology of any system here, and its figures show why a single number lies: a Visitor Visa averages 1 week, while the Partner of a New Zealander variant averages 6. [Australia](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times) states that its guide "does not guarantee that applications will be decided within the timeframe". And the [Indian e-Visa portal](https://indianvisaonline.gov.in/evisa/tvoa.html) tells you to apply a minimum of 4 days in advance and no more than 120, then never says how long a decision takes. The fee is non-refundable whether you are granted or rejected.

## Why is my visa taking so long?

If you are waiting on a US case, the honest answer is that no deadline exists. [8 U.S.C. § 1201(g)](https://www.govinfo.gov/content/pkg/USCODE-2023-title8/html/USCODE-2023-title8-chap12-subchapII-partIII-sec1201.htm), the provision behind every "administrative processing" letter, is a refusal rule. Read the whole section and there is no decision deadline anywhere in it.

The embassies say so plainly. The US Embassy in Panama's page on [administrative processing](https://pa.usembassy.gov/visas/administrative-processing/) states: "Administrative processing can take time; there is no estimate how long it may take." It adds that in rare cases it runs beyond a year, and that a case may be administratively closed after a year unless you ask for it to stay open. The [US Embassy in Ankara](https://tr.usembassy.gov/what-is-the-administrative-processing-system/) asks applicants to wait at least 180 days from the date of interview or submission of supplemental documents, whichever is later, before enquiring about status, except in cases of emergency travel, which it defines as serious illnesses, injuries or deaths in the immediate family. That 180 days is not a deadline; it is the point at which the government will take your question.

You will see "most cases resolve within 60 days" repeated across commercial pages, attributed to travel.state.gov. We could not load that page, and the embassy page we did load declines to give any estimate at all. Do not plan around the 60.

## Can you pay for a faster visa?

The UK sells speed openly, and the price list shows exactly what is and is not for sale. Its [priority services](https://www.gov.uk/faster-decision-visa-settlement) cost £500 for a decision "within 5 working days" and £1,000 for one "by the end of the next working day". The clock starts "the day of your appointment, if you prove your identity in person". Priority on a Family visa from outside the UK buys 30 working days rather than 5, on the route that already carries the 12-week standard. And "if the decision takes longer, you will not usually get your money back".

Money compresses the adjudication. It does not touch the queue in front of it.

The US has no equivalent at the decision stage. An [expedited appointment](https://do.usembassy.gov/expedited-nonimmigrant-visa-appointments/) can only be requested after you have paid the non-refundable MRV fee and booked a regular slot that "may be more than a year in the future"; expedited appointments "are not guaranteed and will only be granted at the Consular Section's discretion"; and if refused, "the decision cannot be appealed". Qualifying grounds are narrow and set post by post; Santo Domingo's include urgent medical care for the applicant or their minor child, the death, grave illness or life-threatening accident of an immediate relative in the US, urgent business travel, an unexpected visit of significant cultural, political, journalistic, sporting or economic importance, and, for Dominican residents seeking a B1/B2 visa, an ESTA denial.

What genuinely collapses a US wait is qualifying for an interview waiver, which is why Bogota shows 4 days against 398. Even then it is conditional: the [US Mission in Spain](https://es.usembassy.gov/visas/interview-waiver/) says waiver processing takes about three weeks and that "we may still require you to attend an interview".

What does not work: reapplying (Panama, on a case in administrative processing: "submitting a new visa application will not expedite your case") or calling (IRCC: "Calling us won't help your application get processed faster").

## The fast systems are fast by design

The [UK ETA](https://www.gov.uk/eta/apply) costs £20 and you will "usually get a decision by email within a day", though it "can take up to 3 working days". The reason is structural, and the Home Office's own [caseworker guidance](https://www.gov.uk/government/publications/electronic-travel-authorisation-caseworker-guidance/electronic-travel-authorisation-caseworker-guidance-accessible) states it: the process "is designed to be automated insofar as possible", and "there is no right to administrative review or appeal against a decision made on an ETA application". Australia's [subclass 601 ETA](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601) tells applicants the result comes "immediately" in most cases. The NZeTA averages 24 hours.

No interview, no biometrics appointment, no human in the default path. There is no queue to hide, so the published figure means what it says. Our guide to the difference between [visas on arrival, eVisas and travel authorisations](/guides/visa-on-arrival-vs-evisa-vs-eta) sets out which is which, and the [UK ETA page](/travel-authorization/uk-eta) covers who needs one.

## Plan backwards from the appointment

Check first whether you need a visa at all: [the checker](/) covers 195 passports against every destination and will tell you in one screen whether the trip needs anything. If you do need one, look up the appointment wait at the specific post you will use, add the published processing time to it, and treat the sum as your minimum. Schengen caps your lead time at six months, so for a bad post the planning window is genuinely tight. Our [guide to how early to apply](/guides/how-early-to-apply-for-a-visa) works through the arithmetic route by route.

The US Embassy in Bratislava gives the only planning rule that survives all of this: no flights until the visa is in the passport.

## Common questions

### How long does it take to get a visa appointment?

Anywhere from days to nearly two years, depending on the post. The US Embassy in Bogota publishes 398 days for a B1/B2 interview and 634 for applicants who are not resident in Colombia or Venezuela, while Bratislava publishes 16. Schengen is the exception that legislated the wait: Article 9(2) of the Visa Code says the appointment "shall, as a rule, take place within a period of two weeks".

### How long after the visa interview will I get my visa?

For Schengen, 15 calendar days from lodging, extendable to 45. For the US, there is no deadline in law at all, and no government source we could load publishes a routine post-interview issuance time.

### How long does a visa take after biometrics?

That is precisely when the published clock starts. UKVI says it begins processing once you attend your appointment to give fingerprints and a photograph, so its published 3 weeks (or 12 for family routes) runs from that day. Schengen is the same in substance, because Article 19 makes biometrics part of what an admissible application requires. Repeat Schengen applicants may be exempt from giving them again under Article 13(3) if their prints are less than 59 months old in the Visa Information System.

### How long does administrative processing take?

No official source states a limit. The US Embassy in Panama says "there is no estimate how long it may take" and that cases can run beyond a year, after which they may be administratively closed unless you ask for them to remain open. The widely repeated "60 days" figure is not something we could confirm on any government page.

### What is 221(g)?

Section 221(g) of the Immigration and Nationality Act, codified at 8 U.S.C. § 1201(g), is the provision under which a consular officer refuses a visa where the applicant appears ineligible or the application is incomplete. A 221(g) letter means your application is currently refused; it may be overcome if administrative processing completes in your favour. The statute sets no time limit.

### How long does an ETA take?

The UK ETA costs £20 and is usually decided by email within a day, though it can take up to 3 working days. Australia's ETA is usually granted immediately, and the NZeTA averages 24 hours. These schemes are fast because they are automated and involve no interview or biometrics appointment.`,
  },
  {
    title: "How much does a visa cost? The full bill, not the fee",
    slug: "what-a-visa-actually-costs",
    excerpt:
      "A Schengen visa is €90 by law and €116 before you have bought anything optional. A US visitor visa is US$185, or US$935 if you want a faster interview. Here is what the fee schedules leave out.",
    metaDescription:
      "The headline fee is rarely the whole bill. Schengen, US, UK and eVisa routes priced from government fee to final total, with the lines each page leaves out.",
    author: "isvisarequired.com",
    tags: ["visa fees", "visa costs", "schengen visa", "us visas", "uk visas"],
    created_at: "2026-09-16",
    updated_at: "2026-09-16",
    faq: [
      {
        q: "How much can a visa cost?",
        a: "The largest published government fees in the schedules we read are the UK's £3,635 for a Route to Settlement application by an other dependant relative and £3,226 for indefinite leave to remain (indefinite leave applications do not pay the immigration health surcharge), and Thailand's 50,000 baht LTR issuance fee. For a visitor visa, the highest single-government fee we found is the UK's £1,128 for a ten-year visit visa; the highest US figure is US$935: the US$185 application fee plus the US$750 expedited-appointment fee.",
      },
      {
        q: "How much is a Schengen visa?",
        a: "€90 for an adult, set by Article 16(1) of the Visa Code, €45 for a child aged six to eleven, and nothing for under-sixes, students travelling to study, researchers travelling for scientific research and a few other categories. Add up to €45 for the outsourced application centre, which is charged even when the visa fee is waived.",
      },
      {
        q: "How much does a 10-year Schengen visa cost?",
        a: "The same €90. The Visa Code prices the application, not the validity: Article 16 provides only for the reduced and waived categories and the €135/€180 readmission provision, with no tier for multi-entry or long-validity visas.",
      },
      {
        q: "What is the total cost of applying for a Schengen visa from the UK?",
        a: "The government half is €90, charged in sterling at the consulate's own conversion rate. EU law caps the application centre's service fee at €45, and courier, SMS and photograph charges sit outside that cap and are published per centre rather than nationally.",
      },
      {
        q: "Do I get a refund if my visa is refused?",
        a: "No. The Visa Code refunds the fee in two situations only — wrong consulate, or an application ruled inadmissible and never examined — and refusal is neither. The State Department's answer opens with one word: \"No.\" The UK is the partial exception: the immigration health surcharge, though not the application fee, is refunded in full on refusal.",
      },
      {
        q: "Do I need to pay the visa fee again after refusal?",
        a: "For a US visa, yes: you file a new application and pay the fee again, with one exception. A 221(g) refusal for missing documents can be re-assessed on the original fee if you supply what is missing within one year of the refusal; after that year, or after a 214(b) refusal, you reapply and pay again.",
      },
      {
        q: "Why does a US visa cost more than US$185?",
        a: "Two other federal charges can land on the same trip. A State Department temporary final rule in force from 1 July to 31 December 2026 charges US$750 for an expedited B1/B2 interview appointment at selected posts, and F and M students pay a US$350 I-901 SEVIS fee to Immigration and Customs Enforcement, which is separate from the visa fee and paid to a different department.",
      },
      {
        q: "Do tourists have to pay US$250 to enter the US?",
        a: "Congress enacted a US$250 Visa Integrity Fee in July 2025 that cannot be waived or reduced, but USCIS deferred implementation pending cross-agency coordination and nothing has been published since. No State Department or embassy page tells an applicant how or when to pay it.",
      },
      {
        q: "How much is the visa service fee?",
        a: "Between €22 and €32.10 on the routes we checked, capped by EU law at €45, or in principle €80 (exceptionally €120) where the Member State has no consulate in your country and is not represented there by another Member State. It is separate from the visa fee, paid to a private contractor, and in at least one published case marked non-refundable.",
      },
    ],
    content: `Between nothing and well over US$1,000 per application (the UK charges £1,128 for a ten-year visit visa), and the government's headline fee is rarely the whole bill. A Schengen visa is €90 by law; lodged for Norway through VFS Global in the United States, it is €116 before you buy anything optional. A US visitor visa is US$185, or US$935 with the State Department's new fee for a faster interview. No single government page adds it up.

The split is not a conspiracy; it is four agencies billing separately. The issuing government publishes its fee. The company that takes your fingerprints publishes its charges on a different website. A fee for a faster appointment sits in a third schedule, and the student registration fee belongs to a fourth agency in another department. Every one of those pages is accurate. None of them adds up.

## What a Schengen visa costs once you include the counter

Article 16(1) of the [EU Visa Code, Regulation (EC) No 810/2009](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02009R0810-20240611) is one sentence: "Applicants shall pay a visa fee of EUR 90." It became €90 on 11 June 2024 under [Commission Delegated Regulation (EU) 2024/1415](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1415), up from €80. Article 16(9) obliges the Commission to reassess the figure every three years against Eurostat inflation and Member State civil-service salaries, so a further rise is a matter of timing.

Children aged six to under twelve pay €45. Under-sixes pay nothing, and so do school pupils, students, postgraduates, accompanying teachers, researchers travelling for research, and non-profit representatives aged 25 or under (Article 16(4)).

Then the second bill starts. Article 17(1) lets an external service provider charge you, and Article 17(4) caps that charge at half the Article 16(1) fee — €45 — "irrespective of the possible reductions in or exemptions from the visa fee". A student whose government fee is legally zero still pays the contractor. Where the competent Member State has no consulate collecting applications in your country and is not represented there by another Member State, the service fee should in principle not exceed €80 (Article 17(4a)), and in exceptional circumstances €120 (Article 17(4b)), which the Member State must notify to the Commission at least three months before it takes effect, specifying the detailed costs behind it.

The cap binds the service fee and nothing else. That is where the money now sits. For a Norwegian visa applied for in the United States, [VFS Global's published service charge](https://visa.vfsglobal.com/usa/en/nor/news/vfs-service-charges) is €26, marked non-refundable. Its [additional services menu for the same route](https://visa.vfsglobal.com/usa/en/nor/additional-services) prices courier at €52 within the city, €63 outside it, four photographs at €17.50 and SMS updates at €7. Courier alone is 58% of the government fee again. VFS states on the page that these extras "have no bearing on expediting your visa process or favourable decision-making", which is both true and the whole point: they are legal, disclosed, and aggregated nowhere.

In India the menu is longer. For [a Hungarian visa lodged in India](https://visa.vfsglobal.com/ind/en/hun/additional-services) the same provider sells Form Filling Assistance at INR 2,000, a Premium Lounge at INR 2,928, and "Prime time Collection" — Saturday and extended-hours passport pickup — at INR 554, though the description of that service on the same page quotes INR 585.

The service fee itself is not one number either. VFS charges [€22 in India and €32.10 in Nepal](https://visa.vfsglobal.com/ind/en/fra/fees) for the identical French visa, against €26 for Norway from the USA and one unchanging €90 underneath. Article 17(5) says a Member State "may maintain" the option of lodging directly at its consulate. May, not must: the common advice to skip the outsourcer assumes a choice EU law does not require any Member State to offer.

Nor does €90 land on your card as €90. Article 16(7) requires the fee to be charged in euro or local currency at the European Central Bank reference rate, and permits rounding up. The [Consulate General of Italy in Los Angeles](https://conslosangeles.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/handling-fees-for-visa-applications/) charged US$104.90 for a short-stay visa in the quarter to 30 September 2026, US$52.50 for a minor aged 6 to 12, and re-sets the rate quarterly.

Article 13 makes fingerprinting compulsory in person for a first application, but fingerprints recorded in the VIS less than 59 months earlier are copied across. A repeat applicant inside that window need not attend at all, which removes the courier, the lounge and the photographs from the bill.

Article 16(2a) provides for a **€135 or €180** fee for nationals of countries the Council finds uncooperative on readmission, and expressly does not apply to children under twelve. The power has been used: [Council Implementing Decision (EU) 2022/2459](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022D2459) of 8 December 2022 set the fee for Gambian nationals at €120, the pre-2024 equivalent, and it was repealed by Implementing Decision (EU) 2024/1231 of 12 April 2024, which took effect on 18 April 2024. No decision naming any third country is in force today.

| Route | Government fee | Second bill | Published extras | Our total |
|---|---|---|---|---|
| Norway short-stay, applied for in the USA | €90 | €26 VFS service fee | courier €52, photos €17.50, SMS €7 | €116 bare, €192.50 with all three |
| US B1/B2 visitor, expedited interview | US$185 MRV | US$750 expedite fee | — | US$935 |
| US F-1 student | US$185 MRV | US$350 SEVIS (charged by ICE) | — | US$535 |
| Canadian visitor visa, one adult | CAD 100 | CAD 85 biometrics | — | CAD 185 |

The totals in that last column are our arithmetic. No government publishes them.

## How much does it cost to get a US visa?

The [State Department's fee table](https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html) sets the application fee at US$185 for non-petition categories, which covers B visitor, C-1 transit, F student, J exchange and M vocational visas; US$205 for petition-based categories including H, L, O, P, Q and R; US$315 for E treaty trader and investor. Those amounts were set by a [final rule of 28 March 2023](https://www.federalregister.gov/documents/full_text/text/2023/03/28/2023-06290.txt), and a [temporary final rule published on 9 June 2026](https://www.federalregister.gov/documents/full_text/text/2026/06/09/2026-11513.txt) confirms the headline figure "was last updated in May 2023 and is currently set at $185 for B1/B2 applicants".

That same temporary final rule created a second State Department charge: **US$750** for an expedited B1/B2 interview appointment at selected posts, payable on top of the US$185, in force from 1 July to 31 December 2026 as a pilot ahead of the 2028 Olympics. A US tourist visa now has a published fast-lane price of US$935, before any contractor charges anything for lodging it.

The MRV fee is non-refundable, and it is non-transferable. The [US Embassy in London](https://uk.usembassy.gov/visa-faqs-information-for-non-immigrant-visa-or-esta-applicants/) spells the second half out: move your application to another embassy and "you will be required to pay a new MRV fee and complete a new Form DS-160".

Students pay a third agency. The [I-901 SEVIS fee](https://www.ice.gov/sevis/i901) is US$350 for F and M applicants and US$220 for J, collected by Immigration and Customs Enforcement and, in its own words, separate from visa fees. An F-1 applicant therefore pays US$535 to two departments before a consular officer has opened the file.

[Public Law 119-21, section 100007](https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm) created a Visa Integrity Fee of not less than US$250, indexed to inflation from FY2026, which "shall not be waived or reduced". Subsection (b) allows, but does not require, the Secretary of Homeland Security to reimburse the fee after the visa expires to a holder who complied with all its conditions and either did not seek an extension and left no later than five days after the authorised stay ended, or was granted an extension or adjustment to permanent residence. A [USCIS notice of 22 July 2025](https://www.federalregister.gov/documents/2025/07/22/2025-13738/uscis-immigration-fees-required-by-hr-1-reconciliation-bill) deferred the fee, saying it "requires cross-agency coordination before implementing". No implementing publication has appeared since, and the November 2025 inflation notice sets FY2026 amounts for the parole, ESTA and EVUS fees from the same statute, leaves the I-94 fee unchanged, and says nothing about this one. A fee widely reported as costing travellers US$250 has no published mechanism for paying it, and a statutory refund route with no published procedure either.

ESTA, meanwhile, nearly doubled. The [FY2026 CBP notice](https://www.federalregister.gov/documents/2025/11/19/2025-20304/certain-dhs-immigration-fees-required-by-hr-1-fiscal-year-2026-adjustments-for-inflation) sets it at **US$40.27**, made of three stacked statutory charges (US$17 + US$10.27 + US$13) rather than one price, against US$21 before July 2025. Our [ESTA guide](/travel-authorization/esta) covers who needs one.

## How much does a visa cost in Canada?

[IRCC's fee list](https://ircc.canada.ca/english/information/fees/fees.asp) prices a visitor visa at CAD 100 per person, or CAD 500 for a family of five or more. Biometrics are a separate line: CAD 85 per individual, CAD 170 per family. A single adult who must give biometrics therefore pays CAD 185, which is 85% more than the headline. An eTA is CAD 7.

Canada is unusually explicit about what it will not refund: the CAD 600 right of permanent residence fee, charged when your application is approved, "is the only fee that we can refund after we start processing your application."

## Do you get a refund if your visa is refused?

Almost nothing comes back, and the instruments say so.

Under the Visa Code the fee "shall not be refundable except in the cases referred to in Articles 18(2) and 19(3)". Those two cases are: you applied to a consulate that was not competent, or your application was inadmissible and never examined. A refused application has by definition been examined, so it falls outside both. The Code caps the service fee but says nothing about refunding it — VFS labels its own €26 "(Non-refundable)", and that is a contract term on one route, not a rule of EU law.

The State Department's [visa denials page](https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/visa-denials.html) answers the question directly: "No. The fee that you paid is a non-refundable application processing fee." Reapply and you file a new application and pay again, with one carve-out: a 221(g) refusal for incomplete documentation can be resumed without a new fee. A 214(b) refusal cannot. What happens next is covered in our guide to [a refused visa application](/guides/visa-refused-what-happens-next).

Gov.uk's [Standard Visitor guidance](https://www.gov.uk/standard-visitor/apply-standard-visitor-visa) states you get no refund "if you get a shorter visa or if your application is refused". Pay £1,128 for a ten-year visitor visa, be granted two years, and you keep neither the difference nor any right to argue about it.

ESTA is the exception: CBP publishes exactly what refusal costs. **US$10.27** of your US$40.27 is a cost-recovery fee charged whether you are authorised or denied.

## What the fee costs the government charging it

The UK Home Office publishes its own unit costs beside its prices, in a spreadsheet linked from a [transparency data page](https://www.gov.uk/government/publications/visa-fees-transparency-data). We downloaded the current table and parsed it. Fees and estimated unit costs below are from the edition published on 10 September 2026 and dated 8 October 2026.

| Route | Fee | Home Office estimated unit cost |
|---|---|---|
| Electronic travel authorisation (ETA) | £20 | £10 |
| Visit visa, up to 6 months | £135 | £116 |
| Visit visa, up to 10 years | £1,128 | £116 |
| Route to Settlement | £2,064 | £482 |
| Visitor extension | £1,172 | £287 |

The April 2026 edition put the visit visa unit cost at £159, which made the short visit visa a loss; the September revision cuts it to £116, so the department now covers its cost there and makes its margin on the [ETA](/travel-authorization/uk-eta), priced at double its estimated cost, and on settlement. Note the last column against the third row: a ten-year visitor visa costs the department the same £116 to produce as a six-month one and is priced eight times higher.

For longer UK routes the visa fee is not even the largest number. The [immigration health surcharge](https://www.gov.uk/healthcare-immigration-application/how-much-pay) is £1,035 per year, or £776 for students and their dependants, Youth Mobility Scheme holders and under-18s, paid up front for the full length of the visa. Three years at the standard rate is £3,105 in surcharge against a £2,064 application fee. Unlike the application fee, the surcharge is [refunded in full](https://www.gov.uk/healthcare-immigration-application/refunds) if the application is refused, or withdrawn before a decision — normally within six weeks. The UK refunds the larger sum and keeps the smaller one.

## Where the official price is zero and the market price is not

Sri Lanka's tourist ETA became [free of charge](https://www.eta.gov.lk/slvisa/visainfo/fees.jsp?locale=en_US) for nationals of 40 countries on 25 May 2026, including the US, UK, China, India and most of Western Europe, for 30 days. Everyone else pays US$20 from South Asia or US$50 elsewhere, US$25 or US$60 on arrival, and transit visas are free.

India publishes a [per-country e-Tourist fee schedule](https://indianvisaonline.gov.in/evisa/images/Etourist_fee_final.pdf) with an unusual seasonal split: US$10 for 30 days from April to June, US$25 for the same visa from July to March, US$40 for one year and US$200 for five, for most nationalities. UK nationals and those of Gibraltar, Guernsey, the Isle of Man and Jersey pay US$484 for the five-year visa. Twenty-two nationalities pay nothing at all, from Argentina and Uruguay to Indonesia, Jamaica, Mauritius and most of the Pacific; Malaysia, the Philippines, Thailand, Russia and South Africa pay nothing for the 30-day visa. The Bureau of Immigration's [official portal](https://indianvisaonline.gov.in/evisa/tvoa.html) also says plainly that "no facilitation is required by any intermediary / travel agents" and that the government makes no provision for charging emergency or express fees. That is the issuing government's own description of the reseller market. We have not priced a reseller checkout, so we quote no multiple.

When we [checked all 37 digital nomad visa programmes against the issuing governments' own pages](/blog/what-we-found-checking-every-digital-nomad-visa), 218 field values changed, fees among them. Thailand's long-term resident visa was widely listed at US$200. The [Thai Board of Investment](https://ltr.boi.go.th/page/faq.html) charges nothing to apply and **50,000 baht**, about US$1,500 at September 2026 exchange rates, on issuance, paid at the Immigration Bureau office at TIESC in Bangkok; applicants who choose to have the e-visa issued abroad are told to follow Royal Thai Consular protocol, and no figure is published for that route. Wrong by roughly a factor of seven, and attached to the wrong event.

None of this applies if your passport is exempt: our [visa checker](/) covers 195 passports, and the difference between an eVisa, a visa on arrival and a travel authorisation is in [a separate guide](/guides/visa-on-arrival-vs-evisa-vs-eta).

## Common questions

### How much can a visa cost?

The largest published government fees in the schedules we read are the UK's £3,635 for a Route to Settlement application by an other dependant relative and £3,226 for indefinite leave to remain (indefinite leave applications do not pay the immigration health surcharge), and Thailand's 50,000 baht LTR issuance fee. For a visitor visa, the highest single-government fee we found is the UK's £1,128 for a ten-year visit visa; the highest US figure is US$935: the US$185 application fee plus the US$750 expedited-appointment fee.

### How much is a Schengen visa?

€90 for an adult, set by Article 16(1) of the Visa Code, €45 for a child aged six to eleven, and nothing for under-sixes, students travelling to study, researchers travelling for scientific research and a few other categories. Add up to €45 for the outsourced application centre, which is charged even when the visa fee is waived.

### How much does a 10-year Schengen visa cost?

The same €90. The Visa Code prices the application, not the validity: Article 16 provides only for the reduced and waived categories and the €135/€180 readmission provision, with no tier for multi-entry or long-validity visas.

### What is the total cost of applying for a Schengen visa from the UK?

The government half is €90, charged in sterling at the consulate's own conversion rate. EU law caps the application centre's service fee at €45, and courier, SMS and photograph charges sit outside that cap and are published per centre rather than nationally.

### Do I get a refund if my visa is refused?

No. The Visa Code refunds the fee in two situations only — wrong consulate, or an application ruled inadmissible and never examined — and refusal is neither. The State Department's answer opens with one word: "No." The UK is the partial exception: the immigration health surcharge, though not the application fee, is refunded in full on refusal.

### Do I need to pay the visa fee again after refusal?

For a US visa, yes: you file a new application and pay the fee again, with one exception. A 221(g) refusal for missing documents can be re-assessed on the original fee if you supply what is missing within one year of the refusal; after that year, or after a 214(b) refusal, you reapply and pay again.

### Why does a US visa cost more than US$185?

Two other federal charges can land on the same trip. A State Department temporary final rule in force from 1 July to 31 December 2026 charges US$750 for an expedited B1/B2 interview appointment at selected posts, and F and M students pay a US$350 I-901 SEVIS fee to Immigration and Customs Enforcement, which is separate from the visa fee and paid to a different department.

### Do tourists have to pay US$250 to enter the US?

Congress enacted a US$250 Visa Integrity Fee in July 2025 that cannot be waived or reduced, but USCIS deferred implementation pending cross-agency coordination and nothing has been published since. No State Department or embassy page tells an applicant how or when to pay it.

### How much is the visa service fee?

Between €22 and €32.10 on the routes we checked, capped by EU law at €45, or in principle €80 (exceptionally €120) where the Member State has no consulate in your country and is not represented there by another Member State. It is separate from the visa fee, paid to a private contractor, and in at least one published case marked non-refundable.`,
  },
  {
    title: "The best second passport for visa-free travel depends on yours",
    slug: "which-second-passport-adds-the-most-countries",
    excerpt:
      "Every ranking page treats passport strength as an absolute number. It is not. We computed the marginal gain of a second passport against the one you already hold, out of 194 destinations, counting only visa-free and visa-on-arrival entry, and the answer inverts depending on where you start.",
    metaDescription:
      "A German passport gains 14 destinations from Benin and 2 from Ireland. We computed the marginal gain of every second passport, and why overlap beats strength.",
    author: "isvisarequired.com",
    tags: ["second passport", "dual citizenship", "visa-free travel", "passport ranking", "ECOWAS", "UAE passport"],
    created_at: "2026-09-16",
    updated_at: "2026-09-16",
    faq: [
      {
        q: "What is the best second passport for visa-free travel?",
        a: "The United Arab Emirates, on our count: 156 of 194 destinations, and it produced the largest gain for every first passport we tested. It opens Russia, India and Pakistan, which the strong Western passports do not, and China, which a US passport does not.",
      },
      {
        q: "Which second passport adds the most countries to my current passport?",
        a: "That depends on the one you hold, and the answer often inverts the published rankings. A German passport gains 14 destinations from Benin, Burkina Faso or Senegal, 13 from Tunisia, and only 2 from Ireland.",
      },
      {
        q: "How do you calculate combined visa-free access with two passports?",
        a: "Take the union of the two, not the sum: across all 194 destinations, count the ones the second passport reaches and the first does not. That difference is the marginal gain.",
      },
      {
        q: "Does a second EU passport add anything if I already have one?",
        a: "Barely. Directive 2004/38/EC bars member states from imposing an entry visa on Union citizens, so two EU passports overlap completely inside the Union, and German plus Irish adds two destinations, both outside it.",
      },
      {
        q: "Do Irish citizens need a UK ETA?",
        a: "No. British and Irish citizens are exempt, including dual citizens, under the Common Travel Area. Other EU, EEA and Swiss nationals visiting without a visa have needed one since 2 April 2025, unless they hold status under the EU Settlement Scheme. It now costs £20 and lasts two years or until the passport expires, whichever is sooner; it was £10 when the scheme opened to European travellers in March 2025, and went up to £16 before the rise to £20.",
      },
      {
        q: "Is an ETA the same as a visa?",
        a: "No, and the UK government says so: \"An ETA is not a visa, it is a digital permission to travel.\" It is still an application approved before you travel, which is why our count excludes it.",
      },
      {
        q: "Do you need a visa to travel within ECOWAS?",
        a: "Not between member states: Protocol A/P.1/5/79 gives a Community citizen visa-free entry to any other member state for up to 90 days, on a valid travel document and health certificate. A state may still refuse an inadmissible person.",
      },
      {
        q: "Do US citizens need a visa for China?",
        a: "Yes. China's unilateral waiver now covers 50 countries and the United States is not among them; the UK and Canada were added from 17 February 2026.",
      },
      {
        q: "Do US citizens need a visa for Brazil?",
        a: "Since 10 April 2025, yes: an electronic visa at US$80.90, reimposed on Australian, Canadian and US nationals. Because it must be obtained before travel, Brazil does not count as accessible on a US passport in our data.",
      },
    ],
    content: `There is no single best second passport for visa-free travel. The answer depends on the passport you already hold: a German passport gains 14 destinations from a Beninese passport and exactly 2 from an Irish one, while a Pakistani passport gains 131 from an Emirati one. Overlap decides this, not strength.

One document wins in every pairing. The United Arab Emirates came top for every first passport we tested, because it is the only passport that is both near-universal and able to reach places a Western passport cannot.

## How we counted, and why our numbers are lower than everyone else's

A destination counts if you can arrive with no advance application: visa-free entry, or a visa issued on arrival. Out of 194. Our dataset holds 195 countries, and each passport is scored against the other 194, which is where the denominator comes from. eVisas and electronic travel authorisations are excluded, because both need approval before you board. That is the whole counting rule; our [methodology page](/methodology) covers where the underlying data comes from and how it is checked.

That exclusion is why our figures run 20 to 30 below the citizenship-by-investment sites. The UAE government's own [fact sheet](https://u.ae/en/about-the-uae/fact-sheet) says an Emirati passport reaches 179 countries, "134 destinations offer visa-free travel and 45 offered eVisa or visa on arrival at the airport". We count **156**. That page then claims first place globally and credits Arton Capital's private index for it: even the one government publishing a headline number is quoting a commercial index rather than measuring anything, which is why the indexes disagree.

The UK's own framing supports the exclusion. The Home Office says "An ETA is not a visa, it is a digital permission to travel", in [the release](https://www.gov.uk/government/news/uk-to-extend-electronic-travel-to-european-visitors) extending the scheme to Europeans from 2 April 2025. It still costs **£20**, lasts two years or until the passport expires if that is sooner, and 24.8 million were issued between the scheme's launch in October 2023 and the end of 2025, per the [ETA factsheet](https://homeofficemedia.blog.gov.uk/electronic-travel-authorisation-eta-factsheet-april-2026/). Europe's [ETIAS](https://eur-lex.europa.eu/eli/reg/2018/1240/oj/eng) works the same way, at [€20](https://eur-lex.europa.eu/eli/reg_del/2025/1411/oj/eng) for three years, and we exclude it too. Our guide to [visa on arrival versus eVisa versus ETA](/guides/visa-on-arrival-vs-evisa-vs-eta) sets out the difference.

One case shows what the rule does to a count. Since 10 April 2025 Brazil requires an electronic visa of Australian, Canadian and US nationals at **US$80.90**, per the [Brazilian foreign ministry](https://www.gov.br/mre/pt-br/consulado-miami/information-about-visas-in-english/electronic-visitor-visa-e-visa), so Brazil does not count as accessible on a US passport. On a British one it does.

## If your passport is weak, overlap does not matter

Take the strongest document you can get. A Pakistani passport reaches 25 destinations; add an Emirati one and you reach 156, a gain of **131**. Nigeria (42) gains 123 from the UAE and 121 from South Korea. India (50) gains 108 from the UAE and 102 from Ireland.

There is barely any overlap to lose at that end, so raw strength wins. The complications are legal. India does not permit dual citizenship: [section 9 of the Citizenship Act 1955](https://www.mha.gov.in/sites/default/files/2025-01/CitizenshipAct1955_02012025_0.pdf) ends Indian citizenship on voluntary acquisition of another country's citizenship (Article 9 of the Constitution already denied citizenship under its founding provisions to anyone who had voluntarily acquired a foreign one), and the Ministry of External Affairs is blunt that ["OCI is not to be misconstrued as dual citizenship"](https://www.mea.gov.in/overseas-citizenship-of-india-scheme.htm). So treat those rows as arithmetic. For an adult there is no lawful route to holding both; section 4(1A) lets a child who is Indian by descent keep a second citizenship only until six months after reaching full age.

## If your passport is already strong, a second strong passport is close to worthless

Germany reaches 149 destinations. Ireland reaches 150. Hold both and you reach 151.

The gain is **2**, and both lie outside the Union: the United Kingdom and Uganda. Inside Europe the overlap is total as a matter of law, since Directive 2004/38/EC states that "No entry visa or equivalent formality may be imposed on Union citizens" ([Article 5(1)](https://eur-lex.europa.eu/eli/dir/2004/38/oj/eng)).

Irish citizens are the one European nationality exempt from the UK's ETA: "British and Irish citizens do not need an ETA, including dual citizens," per the [ETA factsheet](https://homeofficemedia.blog.gov.uk/electronic-travel-authorisation-eta-factsheet-april-2026/). Every other EU, EEA and Swiss national [needs one](https://www.gov.uk/guidance/visiting-the-uk-as-an-eu-eea-or-swiss-citizen). That exemption predates the scheme by decades: under the [Common Travel Area](https://www.gov.uk/government/publications/common-travel-area-guidance/common-travel-area-guidance), an Irish citizen needs no permission at all to enter the UK.

Uganda counts because Ireland appears on the Ugandan immigration directorate's [visa-exempt list](https://immigration.go.ug/faqs/visa-exempt) of 37 countries and Germany does not. The Foreign Ministry backs it up: the Ugandan embassy in Bujumbura's [visa-exempt list](https://bujumbura.mofa.go.ug/basic-page/visa-exempt-countries), dated 28 February 2025, also names Ireland and not Germany, though the two lists do not match name for name.

American plus British adds **5**: Belarus, Brazil, China, Venezuela and Vietnam. Belarus grants 30 days to [38 European states](https://mfa.gov.by/en/visa/freemove/europe/) including the UK, not the US; Vietnam's 45-day exemption [covers Britain, Germany, Japan and South Korea](https://vnembassy-jp.org/en/vietnam-extends-visa-exemption-policy), not the US; China added the UK and Canada [from 17 February 2026](https://gb.china-embassy.gov.cn/eng/visa/notice/202602/t20260216_11860580.htm). Venezuela we cannot source at all. The access is in our data; the instrument behind it is not.

## The inversion: Benin beats Ireland seven to one

For that same German passport:

| Second passport | Its own access | Destinations it adds |
|---|---|---|
| Ireland | 150 | 2 |
| United Arab Emirates | 156 | 15 |
| Benin | 57 | 14 |
| Burkina Faso | 53 | 14 |
| Senegal | 53 | 14 |
| Tunisia | 62 | 13 |

A Beninese passport opens 57 destinations on its own, just over a third of what an Irish one opens, and adds seven times as much: Central African Republic, Chad, Cuba, Ghana, Guinea, Guinea-Bissau, Ivory Coast, Kenya, Liberia, Mali, Niger, Nigeria, Republic of the Congo, Togo.

Seven of those 14 rest on one legal instrument, and two more on a separate declaration by the states that left it. Under [Article 3(2) of ECOWAS Protocol A/P.1/5/79](https://ecowas.int/wp-content/uploads/2024/08/PROTOCOL-RELATING-TO-FREE-MOVEMENT-OF-PERSONS.pdf), a Community citizen visiting another member state for up to ninety days "shall enter the territory of that Member State through the official entry point free of visa requirements": that covers Ghana, Guinea, Guinea-Bissau, Ivory Coast, Liberia, Nigeria and Togo. Article 3(1) still demands a valid travel document and health certificate, and Article 4 keeps each state's right to refuse an inadmissible person. Free movement, not an open border. Mali and Niger left ECOWAS on 29 January 2025 and are no longer bound by the Protocol; a Beninese traveller enters them under the Sahel states' own declaration of 14 December 2024, published in Niger's state daily [Le Sahel](https://www.lesahel.org/declaration-du-college-des-chefs-detat-de-la-confederation-des-etats-du-sahel-aes-sur-la-libre-circulation-le-droit-de-residence-et-detablissement-des-ressortissants-de-la-cedeao/), which declares their confederation "un espace sans visa" for ECOWAS nationals, subject to national law. Kenya comes from a separate instrument, below. The remaining four, Central African Republic, Chad, Cuba and Republic of the Congo, we carry on our own data and have not traced to a published instrument.

Kenya splits the two groups cleanly. [Legal Notice No. 93 of 30 May 2025](https://documents.kenyahighcom.org.uk/L.%20%20N.-%2093%20kenyan%20citizenship%20and%20immigration%20act%20.pdf) exempts nationals of **28 named African countries**, Benin, Burkina Faso, Senegal, Tunisia and Nigeria among them, from the eTA requirement for stays up to 60 days. Germans, Britons and Americans must apply. The Schedule names exempt categories positively, so Somalia and Libya are absent rather than excluded.

The asymmetry is written into law at both ends. Regulation (EU) 2018/1806 sets out which third countries enter Schengen without a visa: [Annex II](https://eur-lex.europa.eu/eli/reg/2018/1806/oj/eng) includes the UAE and Brazil, while Tunisia and Benin sit in Annex I. A Beninese passport holder must apply to visit Germany. A German passport holder must apply to visit Kenya. Strength is directional. The full matrix is in our [reciprocity data](/reciprocity).

Two gaps. Burkina Faso, Mali and Niger [left ECOWAS on 29 January 2025](https://www.ecowas.int/burkina-faso-mali-and-nigers-withdrawal-from-ecowas-is-now-a-reality/), and ECOWAS said their citizens keep movement and residence rights "until further notice", which makes that row the least stable in the table. And Benin's visa-free entry for Africans is on a government page after all: a September 2020 notice on [gouv.bj](https://www.gouv.bj/article/851/diplomatie---liste-pays-dont-ressortissants-sont-exemptes-visa-entree-benin-sans-exigence-reciprocite/) says nationals of all 53 African countries may enter for 90 days, but it governs who can enter Benin, not what a Beninese passport opens, so it does not change this table.

## Why the UAE tops every combination

The Emirati passport is the only one in our data both near-universal at 156 and able to reach destinations most strong Western passports cannot: Russia, Iran, India, Pakistan, Sudan, Syria, Yemen. For a US passport holder it adds China as well. Germany gains 15 from it, Japan 16, the UK 17, the United States 19, Brazil 22.

China shows the mechanism. Its unilateral waiver covers the 50 countries named on the National Immigration Administration's [list of unilateral visa-exemption countries](https://en.nia.gov.cn/n147418/n147463/c183390/content.html), 35 in Europe, 7 in Asia, 6 in the Americas and 2 in Oceania, for stays of up to 30 days. China's diplomatic missions give the same total: the [embassy in Sweden's FAQ](https://se.china-embassy.gov.cn/lstz/202511/t20251110_11750027.htm), updated 25 May 2026, names the same 50 countries. Germany, Ireland, Japan, South Korea and Brazil are on it, and the UK and Canada joined from 17 February 2026. The United States is absent. The UAE gets in through a different door: a bilateral mutual visa exemption in force since 16 January 2018, in the same administration's [table of mutual exemptions](https://en.nia.gov.cn/n147418/n147463/c181470/content.html). Access is granted as policy, country by country.

India needs a caveat. It grants visa on arrival to exactly three nationalities, Japan, South Korea and the UAE, and the Emirati entitlement applies "only for such UAE nationals who had earlier obtained e-Visa or regular/paper visa for India", per the [Bureau of Immigration](https://indianvisaonline.gov.in/visa/visa-on-arrival.html). Rs 2,000, 60 days, six airports. So an Emirati passport gets you into India on arrival on the second visit, not the first. For Russia, Iran, Pakistan, Sudan, Syria and Yemen the access is in our data but we have not traced it to a published instrument.

## What this measures, and what it does not

Travel access. Nothing else. A passport that adds 14 destinations tells you nothing about the right to live or work anywhere, and nothing about the tax, military-service or renunciation consequences that usually decide whether a second nationality is sensible at all.

US citizens are taxed by the IRS on [worldwide income](https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-resident-aliens-abroad) wherever they live. US law also requires a US citizen, with limited exceptions, to use a US passport to enter or leave the United States ([22 CFR 53.1](https://www.govinfo.gov/content/pkg/CFR-2024-title22-vol1/xml/CFR-2024-title22-vol1-sec53-1.xml)), so a second passport is inert at a US border in both directions: you leave and re-enter on the US one, and the other only starts working once you are outside. Germany stopped requiring its own citizens to obtain a retention permit before acquiring a foreign nationality when the [Gesetz zur Modernisierung des Staatsangehörigkeitsrechts (StARModG)](https://www.auswaertiges-amt.de/de/staatsangehoerigkeitsrecht/2088844) came into force on 27 June 2024, repealing the section 25 StAG loss rule; whether the second country tolerates it is a separate question under its own law.

None of this is legal advice, and we do not rank citizenship-by-investment programmes. Our guide on [which passport to use at which border](/guides/which-passport-to-use-dual-citizenship) covers the practical side, and [our dual citizenship tool](/dual-citizenship) computes the marginal gain for up to three passports against this dataset.

## Common questions

### What is the best second passport for visa-free travel?

The United Arab Emirates, on our count: 156 of 194 destinations, and it produced the largest gain for every first passport we tested. It opens Russia, India and Pakistan, which the strong Western passports do not, and China, which a US passport does not.

### Which second passport adds the most countries to my current passport?

That depends on the one you hold, and the answer often inverts the published rankings. A German passport gains 14 destinations from Benin, Burkina Faso or Senegal, 13 from Tunisia, and only 2 from Ireland.

### How do you calculate combined visa-free access with two passports?

Take the union of the two, not the sum: across all 194 destinations, count the ones the second passport reaches and the first does not. That difference is the marginal gain.

### Does a second EU passport add anything if I already have one?

Barely. Directive 2004/38/EC bars member states from imposing an entry visa on Union citizens, so two EU passports overlap completely inside the Union, and German plus Irish adds two destinations, both outside it.

### Do Irish citizens need a UK ETA?

No. British and Irish citizens are exempt, including dual citizens, under the Common Travel Area. Other EU, EEA and Swiss nationals visiting without a visa have needed one since 2 April 2025, unless they hold status under the EU Settlement Scheme. It now costs £20 and lasts two years or until the passport expires, whichever is sooner; it was £10 when the scheme opened to European travellers in March 2025, and went up to £16 before the rise to £20.

### Is an ETA the same as a visa?

No, and the UK government says so: "An ETA is not a visa, it is a digital permission to travel." It is still an application approved before you travel, which is why our count excludes it.

### Do you need a visa to travel within ECOWAS?

Not between member states: Protocol A/P.1/5/79 gives a Community citizen visa-free entry to any other member state for up to 90 days, on a valid travel document and health certificate. A state may still refuse an inadmissible person.

### Do US citizens need a visa for China?

Yes. China's unilateral waiver now covers 50 countries and the United States is not among them; the UK and Canada were added from 17 February 2026.

### Do US citizens need a visa for Brazil?

Since 10 April 2025, yes: an electronic visa at US$80.90, reimposed on Australian, Canadian and US nationals. Because it must be obtained before travel, Brazil does not count as accessible on a US passport in our data.`,
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
