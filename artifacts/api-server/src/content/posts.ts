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

/** A photo with everything needed to credit it properly. */
export interface PostImage {
  /** Absolute https URL. Wikimedia Commons thumbnails are served from upload.wikimedia.org. */
  src: string;
  width: number;
  height: number;
  /** Describes what the photo shows, for screen readers and image search. */
  alt: string;
  /** Short editorial caption, shown above the credit. Optional. */
  caption?: string;
  credit: {
    author: string;
    authorUrl?: string;
    /** e.g. "CC BY-SA 4.0" — exactly as the licence is named at the source. */
    license: string;
    licenseUrl: string;
    /** The photo's own page, e.g. its Wikimedia Commons file page. */
    sourceUrl: string;
  };
}

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
  /**
   * The lead photo: shown above the article, on the blog card, and as the
   * social-sharing image. Freely licensed photos only, always credited.
   *
   * Photos inside the article go in `content` as
   *   ![alt](https://…/foo.jpg#1280x854)
   * followed by an italic caption-and-credit line. The "#WxH" fragment is the
   * photo's real pixel size and both renderers turn it into width/height so
   * the page does not reflow as photos load; without it the text jumps. Get
   * those numbers from the image itself, not from the Commons API — asking the
   * API for a 1600px thumbnail returns a URL that actually serves the 1280 or
   * 1920 bucket while still reporting 1600, which is wrong for every file.
   */
  cover?: PostImage;
}

export const STATIC_POSTS: StaticPost[] = [
  {
    title: "Travel authorisations are replacing visa-free entry",
    slug: "travel-authorisations-replacing-visa-free-entry",
    excerpt:
      "Countries that used to let you simply turn up increasingly want an online authorisation before you board. It was the biggest pattern in the 793 corrections we made across 18 countries.",
    metaDescription:
      "Visa free increasingly means apply online first: the UK, Seychelles, Ghana and others want an authorisation before you board, and most sites haven't noticed.",
    author: "isvisarequired.com",
    tags: ["visa policy", "ETA", "travel authorisation", "visa-free travel"],
    created_at: "2026-09-13",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/%C4%B0stanbul_Havaliman%C4%B1_Airport_2019_16.jpg/1920px-%C4%B0stanbul_Havaliman%C4%B1_Airport_2019_16.jpg",
      width: 1920,
      height: 1280,
      alt: "Travellers at check-in desks in the wide, marble-floored international departures hall of Istanbul Airport.",
      caption: "The decision about whether you fly is increasingly made here, at the check-in desk — not at the border.",
      credit: {
        author: "Arne Müseler",
        authorUrl: "https://commons.wikimedia.org/wiki/User:Arne_mueseler",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:%C4%B0stanbul_Havaliman%C4%B1_Airport_2019_16.jpg",
      },
    },
    content: `Say you're flying to London on one of the European passports that used to need nothing but the passport itself. A comparison site says "visa free", so you don't think about it again. Then at check-in the airline asks for your UK Electronic Travel Authorisation, and without it you aren't getting on the plane.

That label is going stale well beyond the UK. Through 2025 and 2026 a growing number of countries kept the words "visa free" while adding a mandatory online form you have to complete before you travel. Most visa datasets missed it, ours included. When we re-checked our data country by country against each government's own pages, we ended up making 793 corrections across 18 countries, all listed with sources in our [verified changes log](/visa-changes). This was the biggest single pattern in them.

## Countries that now want a form before you fly

In the UK, 33 European nationalities that could previously arrive with just a passport now need an [Electronic Travel Authorisation](https://www.gov.uk/eta). It was rolled out through 2025 and enforced from 25 February 2026. Ireland is unaffected under the Common Travel Area. If you hold one of those passports and fly to Britain regularly you have probably absorbed the change already; the people getting caught are the ones who checked once, years ago, and reasonably assumed the answer would keep. Our [UK ETA page](/travel-authorization/uk-eta) sets out who needs one.

Anyone flying to Seychelles needs a [Travel Authorisation](https://www.ics.gov.sc/permits/visitors-permit) issued before departure. Every nationality, no exceptions, which in our dataset means all 194 of them. It is also the clearest case of why the old label misled people: Seychelles has never issued tourist visas at all, so "visa free" was true in the narrow sense and useless in the practical one.

West Africa is where the shift is easiest to underestimate. Ghana's e-Visa portal, live since 25 May 2026, gives two answers and no third. ECOWAS and AES nationals enter visa free; the other 180 nationalities need an ETA or e-Visa online first. We put every nationality through the portal individually rather than rely on someone's summary of it. Guinea-Bissau has landed in the same place, with prior authorisation now required for the 180 nationalities outside ECOWAS, according to British, French and Canadian government travel advice.

Cabo Verde asks for a visa rather than a form. Under a rule published in its official bulletin on 23 January 2026, nationals of 91 countries must hold one before arrival, even for transit. 89 of those countries are in our dataset.

Namibia is the shortest line in the log and the easiest to skim past: visa-free entry ended there for 33 nationalities on 1 April 2025.

Sri Lanka and Kenya sound friendlier and work the same way. Sri Lanka's ETA became free from 25 May 2026, and Kenya's eTA carries tiered exemptions. Cheap or free, you still have to file it before check-in, and both are easy to miss precisely because nobody thinks of them as visa countries.


![A smooth granite boulder on a La Digue beach at sunset, surf blurred around it under a pink sky.](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/198_Granite_rock_in_La_Digue_Island_at_sunset_Photo_by_Giles_Laurent.jpg/1280px-198_Granite_rock_in_La_Digue_Island_at_sunset_Photo_by_Giles_Laurent.jpg#1280x854)

*Seychelles has never issued tourist visas — and every visitor now needs a Travel Authorisation before departure. Photo: [Giles Laurent](https://commons.wikimedia.org/wiki/User:Giles_Laurent) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:198_Granite_rock_in_La_Digue_Island_at_sunset_Photo_by_Giles_Laurent.jpg).*

## Countries going the other way

The trend doesn't run in one direction only. China extended its unilateral visa-exemption scheme to a dozen more nationalities and pushed the expiry out to 31 December 2027. Saudi Arabia broadened its visitor e-Visa, Oman published a wider exemption list, and a presidential decree of 3 November 2025 opened Uzbekistan up further from 1 January 2026.

Good news is still news, and it can still expire. China's scheme carries an end date, which is a useful reminder that an exemption is a policy rather than a right. It can be widened, narrowed or left to lapse, and the version you read about somewhere is the version that applied on the day that page was written.

## Why the "visa free" label goes stale

The asymmetry behind all of this is simple. A country that opens up wants you to know, so the expansion arrives with a press release, a tourism-board push and a round of coverage. A country that adds an authorisation requirement has no such interest. The announcement goes out through immigration channels, often in the local language, sometimes as a numbered item in an official bulletin, and rarely in a form that reaches the sites travellers actually use. Errors in the generous direction therefore get corrected fast, because someone complains. Errors in the restrictive direction sit quietly for years, because the only people who find them are already at the airport.

Our own data had exactly that problem before we started fixing it. A visa matrix gets built once from whatever sources were good at the time, and then it needs maintaining, and maintenance is the part nobody enjoys. There is no clever shortcut either. The only reliable method is to open the government's own page for a given pair of countries, read what it says, and record when you read it. Doing that across the dataset is what produced the 793 corrections, and it is why the log keeps the old rule alongside the new one and names the source for each, rather than silently overwriting the answer we used to give. Our [methodology](/methodology) page describes how the checking works.

What that means for you is mostly a matter of how much weight to put on any given answer. A "visa free" claim with no date and no named source isn't wrong so much as unverifiable, and the restrictive direction is exactly where such claims fail. Where two sites disagree, prefer the one that tells you which official page it read. Where neither does, the destination's own immigration site is the only thing that settles it, and it is what the airline's system is following anyway.

## What an authorisation means for your trip

A travel authorisation isn't a visa, though that distinction matters less than it sounds, because the airline enforces it rather than the border. Without it you are turned away at [check-in](/guides/why-airlines-deny-boarding), where there is nobody to argue your case with. So don't leave the application to the night before: most systems answer in minutes, but some take up to three working days, and a mismatch on your passport details restarts that clock.

Two other things catch people out. The authorisation is tied to the passport you applied with, so if you renew, assume it died with the old book, whatever validity was left on it. Duration of stay is a different number again: "visa free for 90 days" tells you how long you may stay once you have been admitted, not how long your permission to travel lasts, and our guide to [visa validity vs duration of stay](/guides/visa-validity-vs-duration-of-stay) explains why the two numbers drift apart.


![The departures waiting area of Heathrow Terminal 2 seen from above, under its curved white roof.](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Heathrow_Airport_Terminal_2%2C_London%2C_England_-_Diliff.jpg/1280px-Heathrow_Airport_Terminal_2%2C_London%2C_England_-_Diliff.jpg#1280x657)

*From 25 February 2026, thirty-three European nationalities need a UK ETA before an airline will let them board. Photo: [Diliff](https://commons.wikimedia.org/wiki/User:Diliff) / [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Heathrow_Airport_Terminal_2,_London,_England_-_Diliff.jpg).*

## Before you book

Check each traveller separately. These rules attach to nationality, so a couple holding two different passports can get two different answers for the same flight, and a child on their own passport is a separate case again. Transit deserves the same care: Cabo Verde's requirement covers people merely passing through, which is a reminder that a layover is not automatically outside a country's rules.

The pair is what matters, your passport and your destination, so run it through the [visa checker](/) before you book rather than after. If the answer has moved since our base dataset was frozen, the [changes log](/visa-changes) says who moved it.

## Common questions

### Is a travel authorisation the same thing as a visa?

Legally no, but the practical effect is close enough: no authorisation, no boarding pass. The difference that matters is who checks it, because that happens at the airline desk rather than at the border.

### How far ahead should I apply?

As soon as the trip is booked. Most systems come back within minutes, but some take up to three working days, and any mismatch with your passport details starts the wait over.

### I've just renewed my passport. Do I have to reapply?

Assume you do. Most authorisations are tied to the passport used in the application and lapse with it, even when they still had months left to run.`,
    faq: [
      {
        q: "Is a travel authorisation the same thing as a visa?",
        a: "Legally no, but the practical effect is close enough: no authorisation, no boarding pass. The difference that matters is who checks it, because that happens at the airline desk rather than at the border.",
      },
      {
        q: "How far ahead should I apply?",
        a: "As soon as the trip is booked. Most systems come back within minutes, but some take up to three working days, and any mismatch with your passport details starts the wait over.",
      },
      {
        q: "I've just renewed my passport. Do I have to reapply?",
        a: "Assume you do. Most authorisations are tied to the passport used in the application and lapse with it, even when they still had months left to run.",
      },
    ],
  },
  {
    title: "Five digital nomad visas that have closed",
    slug: "digital-nomad-visas-that-have-closed",
    excerpt:
      "Iceland's remote-work visa still turns up on shortlists with €7,000 a month attached to it. It was repealed in May, and it's one of five closed programmes still listed as available.",
    metaDescription:
      "Iceland repealed its remote-work visa in May 2026 and Bermuda closed its certificate in February 2025. Five digital nomad visas that no longer exist.",
    author: "isvisarequired.com",
    tags: ["digital nomad", "visa policy", "remote work"],
    created_at: "2026-09-13",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Jokulsarlon_lake%2C_Iceland.jpg/1920px-Jokulsarlon_lake%2C_Iceland.jpg",
      width: 1920,
      height: 1269,
      alt: "Icebergs drifting on Jökulsárlón glacier lagoon in Iceland, with snow-capped mountains lit pink at sunset",
      caption: "Jökulsárlón at sunset. Iceland's remote-work route was repealed in May 2026, and nothing has yet replaced it.",
      credit: {
        author: "Kenneth Muir",
        authorUrl: "https://www.flickr.com/people/krmuir/",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Jokulsarlon_lake,_Iceland.jpg",
      },
    },
    content: `Iceland's remote-work visa still turns up on shortlists with €7,000 a month attached to it. The visa was repealed in May.

When we checked all 37 programmes in our [digital nomad visa directory](/digital-nomad) against each government's own page, five had closed: Iceland, Bermuda, the Cayman Islands, Antigua & Barbuda and Anguilla. Every one is still listed as available somewhere, and until recently that included our directory, with income thresholds and fees beside them. That's worse than not listing them at all, because a closed programme with a number next to it looks researched.

## Iceland repealed its visa in May 2026

Iceland's long-term visa for remote workers was repealed on 13 May 2026, when the new Visa Act (No. 37/2026) came into force. The legal provision it rested on was struck out.

The replacement isn't like-for-like. Stays longer than 90 days now go through a short-term residence permit, and the requirements for that permit haven't been published, so there's no income threshold, fee or maximum stay to plan around. Anyone quoting you €7,000 a month is quoting a rule that's gone, and nobody can currently tell you what replaced it.

The official source is the [Directorate of Immigration](https://island.is/en/o/directorate-of-immigration). It has published nothing on the replacement yet. The old utl.is address forwards there and has no remote-work page.

## Bermuda closed its certificate in February 2025

The Work From Bermuda Certificate concluded on 28 February 2025. Its application page carries the closure notice, which is more than most closed programmes manage.

The route that followed, Permission to Reside on an Annual Basis, is a different thing with different conditions. Don't read it as the old certificate renamed.

## The Cayman Islands let the programme vanish

The Cayman Islands did not announce anything. The Global Citizen Concierge Programme simply stopped being there. Its website, eworkcayman.com, isn't showing an error page — the domain itself is gone. The programme appears in no current WORC immigration form and no 2026 fee schedule, and long stays now go through the ordinary immigration framework.

It's also the one you're most likely to still see listed at US$100,000 a year, since there's no closure notice anywhere for other sites to pick up.

## Antigua & Barbuda said so plainly

Antigua & Barbuda's Nomad Digital Residence has ended, and unusually, the government's own portal says so outright.


![Backlit view over English Harbour, Antigua, from Shirley Heights, with yachts anchored in a green bay](https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Antigua_Shirley%27s_Heights_English_Harbour.jpg/1280px-Antigua_Shirley%27s_Heights_English_Harbour.jpg#1280x720)

*English Harbour from Shirley Heights. Antigua & Barbuda's Nomad Digital Residence has ended. Photo: [Dr. Thomas Liptak](https://commons.wikimedia.org/wiki/User:Dr._Thomas_Liptak) / [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Antigua_Shirley%27s_Heights_English_Harbour.jpg).*

## Anguilla just went quiet

Work from Anguilla is murkier. We found no live official page for it anywhere on gov.ai, and no notice announcing a closure either. We mark it ended rather than dormant because it has disappeared from the government's own site so completely, but that's a conclusion drawn from absence, and the directory page says so.

## Why closed visas stay listed

Launches get press releases. Closures get a quietly deleted page. Comparison sites, ours included, are built to pick up announcements, so a programme that stops existing without saying so can sit in a directory for years.

Worse, a dead official link isn't treated as a warning. Most listings check that a URL exists, not that it still describes the programme. Cayman's link hadn't merely broken. Its domain had been given up, and the listing survived anyway.

## What we do differently now

Our directory now records a status and a check date for every programme, and closed ones move to their own section rather than being deleted, so a search for "Iceland digital nomad visa" lands you on the repeal instead of a stale income figure. Before you plan around an income figure anywhere, open the government page it came from. That's the check we run before a number goes back into the directory.

If one of these five was your plan, read [what else we found wrong when checking every digital nomad visa](/blog/what-we-found-checking-every-digital-nomad-visa) — the closures weren't the only problem.`,
  },
  {
    title: "What we found checking every digital nomad visa",
    slug: "what-we-found-checking-every-digital-nomad-visa",
    excerpt:
      "Our directory quoted income figures no government had ever published. What a field-by-field re-check turned up, and how to spot a threshold that has gone stale.",
    metaDescription:
      "We re-checked 37 digital nomad visas against each issuing government's own page. 218 values changed, and Japan's income threshold was out by a factor of ten.",
    author: "isvisarequired.com",
    tags: ["digital nomad", "data quality", "visa policy"],
    created_at: "2026-09-13",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Minato_City%2C_Tokyo%2C_Japan.jpg/1920px-Minato_City%2C_Tokyo%2C_Japan.jpg",
      width: 1920,
      height: 1080,
      alt: "Dense Tokyo skyline at golden hour, the red-and-white Tokyo Tower rising at centre among Minato high-rises.",
      caption: "Tokyo at golden hour. Japan's real income floor is ten times the figure most nomad-visa sites print.",
      credit: {
        author: "David Kernan",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Minato_City,_Tokyo,_Japan.jpg",
      },
    },
    content: `Say you're pricing up a year of remote work in Japan. Until recently our own directory told you the income requirement was ¥1,000,000 a year. That sounds doable on a normal salary. Japan's Immigration Services Agency actually requires ¥10,000,000, which puts the visa out of reach for most people who would consider it.

That wrong figure was ours. Our digital nomad directory carried income thresholds, government fees and durations for 37 countries with no source attached to any of them, and the numbers were roughly the ones you'll find on every other nomad visa site. That isn't a coincidence and it isn't a defence.

So we read every field off the page published by the government that issues the visa, then handed each finding to a second reviewer whose only job was to disprove it. 218 values changed. Five programmes turned out not to exist at all, which is [its own article](/blog/digital-nomad-visas-that-have-closed).

## What was wrong

Japan was the largest single error, out by a factor of ten. Thailand's was the oddest. We showed a US$200 government fee, where the Long-Term Resident visa costs 50,000 baht a person, roughly US$1,400. The fee was the least of it. A work permit is not granted to the Work-from-Thailand Professionals category, and the well-publicised 17% flat tax applies only to Highly-skilled Professionals, not to remote workers. If the tax rate was your reason for choosing Thailand, read that sentence again.

We published a monthly threshold Belize has never stated. The Belize Tourism Board gives one figure and it is annual: US$75,000 for an individual, US$100,000 for couples and families — US$6,250 a month for a single applicant. Anyone who budgeted off our figure was planning for a different visa.

Malaysia was wrong twice over, wrong currency and wrong tier for most applicants. We listed RM 24,000 a year, about US$5,400. MDEC's official FAQ requires US$24,000 a year for tech professions and US$60,000 for everything else, so anyone outside tech was looking at five times what we published. That is the difference between a visa you can plan around and one you can't.

The UAE was the rare case where we'd set the bar too high, at US$5,000 a month against an official US$3,500. Being wrong in a reader's favour is still being wrong, and it may have talked someone out of a visa they qualified for.

Almost every error above pointed the same way, making a visa look easier to get than it is. That is the direction numbers drift when they are copied between sites rather than read off a government page, and it is why two sites agreeing tells you nothing at all.


![Bangkok's high-rise skyline behind the grass islands and still water channels of Benjakitti Forest Park.](https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Benjakitti_Forest_Park_%28I%29.jpg/1280px-Benjakitti_Forest_Park_%28I%29.jpg#1280x853)

*Bangkok. Thailand's Long-Term Resident visa costs 50,000 baht a head, not the US$200 we had on file. Photo: [Supanut Arunoprayote](https://commons.wikimedia.org/wiki/User:Supanut_Arunoprayote) / [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Benjakitti_Forest_Park_(I).jpg).*

## The records that pointed at the wrong visa

Portugal's remote-work residence visa is the D9, not the D8 we had on file. The D8 covers family accompanying a residence-visa applicant. Ask a consulate for it and you are asking for something else, which is a slow and avoidable way to get nowhere.

Worse, our Philippines record wasn't a nomad visa at all. It described the SRRV, a retirement visa run by a different agency. The Philippines does now have a real nomad visa, created by Executive Order No. 86 and signed in April 2025. It lasts a year, renews, and needs health insurance. The catch is reciprocity: you qualify only if your own country offers Filipinos a nomad visa in return. No official source confirms the Department of Foreign Affairs has begun issuing them, so treat the programme as announced rather than operating.

## Numbers no government ever published

The next category was harder to spot, because the arithmetic looks sound. A government states a monthly threshold, a comparison site multiplies it by twelve, and the annual figure that falls out starts circulating as an official requirement. Nobody invented anything. Nobody checked either.

Malta publishes €42,000 a year and no monthly figure. Hungary publishes €3,000 net a month and no annual one. The UAE gives a monthly figure and stops there. Costa Rica's rentista law sets US$2,500 a month, in dollars, while our record carried an annual figure in euros that matched nothing at all. Spain's consular sheets state a percentage rather than an amount.

Our reviewer rejected every derived number, which was right even though it cost us tidy-looking rows. The directory now shows whichever figure the government actually states and leaves the other blank. A blank is honest. A number produced by multiplication is not, and it is exactly the sort of thing that gets repeated until it looks like a fact. If the government you're applying to states a monthly figure, work from the monthly figure, and be suspicious of any site that shows you both.

## Income requirements that aren't fixed numbers

A good many of these thresholds are formulas rather than sums, tied to a national wage or income measure that moves:

- Spain: 200% of the minimum wage (SMI), re-set by royal decree each year. €2,442 a month in 2026.
- Portugal: four times the guaranteed minimum monthly wage, which is €920 in 2026 and moves every January.
- Croatia: 2.5 average monthly net Croatian salaries, recalculated annually. €3,622.50 today.
- Colombia: three times the legal monthly minimum wage, COP 5,252,715 in 2026.
- Ecuador: three Salarios Básicos Unificados a month, and the 2026 SBU is US$482.
- Romania: three times the Romanian average gross monthly salary, for each of the six months before you apply.
- Mexico: expressed in UMA, not in pesos and certainly not in dollars.
- South Korea: tiered against the previous year's GNI per capita, with the tier depending on your age, whether you'll live inside the Seoul metropolitan area, and whether family come with you.

Romania's version is worth reading twice, because it is the one that catches people out. The test is not what you earn now but what you earned in each of the six months before you apply, so a pay rise in the wrong quarter doesn't save you and a gap between contracts can sink an application that looks comfortable on paper.

A single fixed figure for any of these is a snapshot with no expiry date printed on it. The directory now names the formula alongside this year's value, so you can tell when a number has gone stale and roughly which way it will move.


![Aerial view of turquoise shallows and reef around Caye Caulker, a low palm-covered island split by a channel.](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Caye_Caulker_Belize_aerial_%2820688990128%29.jpg/1280px-Caye_Caulker_Belize_aerial_%2820688990128%29.jpg#1280x719)

*Caye Caulker, Belize. The Tourism Board publishes an annual income figure only: US$75,000. Photo: [dronepicr](https://www.flickr.com/people/132646954@N02) / [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Caye_Caulker_Belize_aerial_(20688990128).jpg).*

## What the directory shows now

Every programme in the [digital nomad directory](/digital-nomad) now carries the government page its figures were read from and the date they were read, behind a "Verified" badge you can click through. Where a figure couldn't be verified the field is blank rather than a tilde and a guess. Spain's consular fee is one of those, set by reciprocity and quoted in local currency, and Costa Rica's fee page sits behind bot protection, so that one is blank as well.

Where two official sources disagree, the directory says so instead of picking the more convenient one. Cape Verde's immigration authority lists a 5,000 CVE fee, while Turismo de Cabo Verde lists €20 a person plus a €34 airport fee. Both are official, they don't agree, and we're not going to guess on your behalf.

None of this makes the data permanent. Governments change these rules without announcing them, which is the whole lesson of the five programmes that had quietly closed. You can now see where every number came from and how old it is.

Drawing up a shortlist? Open the Verified link for every country you're serious about and read the requirement on the government's own page before you pay a fee or give notice on your flat. For anything pegged to a minimum wage or average salary, check the badge date against this year's figure. And if the plan is to skip the visa and work on a tourist stamp, [read this first](/blog/can-you-work-remotely-on-a-tourist-visa).

## Common questions

### A site shows both a monthly and an annual income figure. Which one counts?

Only the figure the issuing government publishes. Where a government states a monthly threshold and a site also shows an annual one, that annual number has usually come out of a calculator rather than an official page, and nothing will back it up when a consulate asks.

### Can I apply for the Philippines digital nomad visa now?

It exists on paper, created by Executive Order No. 86 in April 2025, and it requires your own country to offer Filipinos the same thing. No official source confirms the Department of Foreign Affairs has started issuing it, so treat it as announced rather than available and plan around your other options.

### Why does an income requirement change from one year to the next?

Several countries peg the threshold to a national wage measure instead of a fixed sum, and those measures are reset annually. Spain's is a percentage of the minimum wage and Portugal's a multiple of the guaranteed minimum monthly wage, so both shift in the new year whatever the comparison tables still say.

### Does Thailand's 17% flat tax apply to remote workers?

No. It belongs to the Highly-skilled Professionals category of the Long-Term Resident visa, not to Work-from-Thailand Professionals. That second category also doesn't come with a work permit, which is the part most write-ups leave out.`,
    faq: [
      {
        q: "A site shows both a monthly and an annual income figure. Which one counts?",
        a: "Only the figure the issuing government publishes. Where a government states a monthly threshold and a site also shows an annual one, that annual number has usually come out of a calculator rather than an official page, and nothing will back it up when a consulate asks.",
      },
      {
        q: "Can I apply for the Philippines digital nomad visa now?",
        a: "It exists on paper, created by Executive Order No. 86 in April 2025, and it requires your own country to offer Filipinos the same thing. No official source confirms the Department of Foreign Affairs has started issuing it, so treat it as announced rather than available and plan around your other options.",
      },
      {
        q: "Why does an income requirement change from one year to the next?",
        a: "Several countries peg the threshold to a national wage measure instead of a fixed sum, and those measures are reset annually. Spain's is a percentage of the minimum wage and Portugal's a multiple of the guaranteed minimum monthly wage, so both shift in the new year whatever the comparison tables still say.",
      },
      {
        q: "Does Thailand's 17% flat tax apply to remote workers?",
        a: "No. It belongs to the Highly-skilled Professionals category of the Long-Term Resident visa, not to Work-from-Thailand Professionals. That second category also doesn't come with a work permit, which is the part most write-ups leave out.",
      },
    ],
  },
  {
    title: "Can you work remotely on a tourist visa? Where it's allowed",
    slug: "can-you-work-remotely-on-a-tourist-visa",
    excerpt:
      "New Zealand, the UK and Canada say in writing that visitors may work remotely for an employer abroad. Elsewhere the visitor rules mostly say nothing, and what matters is who pays you, not where you sit.",
    metaDescription:
      "New Zealand, the UK and Canada let visitors work remotely for an employer abroad. What the US, Europe and Australia say, and when tax becomes the issue.",
    author: "isvisarequired.com",
    tags: ["digital nomad", "remote work", "tourist visa", "visitor visa", "tax residency"],
    created_at: "2026-09-15",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Milford_Sound_in_Fiordland_National_Park_08.jpg/1920px-Milford_Sound_in_Fiordland_National_Park_08.jpg",
      width: 1920,
      height: 1053,
      alt: "Mitre Peak and the blue water of Milford Sound framed by beech forest under a clear summer sky.",
      caption: "Fiordland, New Zealand — the one visitor rule that says yes to remote work in so many words.",
      credit: {
        author: "Krzysztof Golik",
        authorUrl: "https://www.wikidata.org/wiki/Q51955005",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Milford_Sound_in_Fiordland_National_Park_08.jpg",
      },
    },
    content: `Say your employer is happy for you to spend a month working from somewhere with better weather, and you plan to arrive as an ordinary visitor, doing the same job for the same salary. The question is whether answering email from a rented flat breaks the terms of your entry.

In three countries the government has answered in writing, and the answer is yes. New Zealand, the United Kingdom and Canada all allow visitors to work remotely for an employer abroad. Elsewhere the visitor rules mostly don't mention remote work at all, which is not a ban but is not permission either. And where rules do exist, they turn on who pays you, not on where your laptop happens to be open.

## Where remote work on a visitor visa is allowed

New Zealand's permission has no ceiling on the amount of work. [Immigration New Zealand's guidance](https://www.immigration.govt.nz/visit/checking-or-changing-the-conditions-of-your-visitor-visa-or-nzeta/working-remotely-in-new-zealand-on-a-visitor-visa) says all visitor visas applied for on or after 27 January 2025 allow you to work remotely, with no limit on how much of it you do. The work has to be for a company, employer or client that isn't in New Zealand. Before that date the answer was different, which is why advice based on 2024 research still gets New Zealand wrong.

The UK's permission comes with a condition attached. Paragraph PA 4(h) of the [visitor rules on permitted activities](https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-permitted-activities) lets a visitor "undertake activities relating to their employment overseas remotely from within the UK, providing this is not the primary purpose of their visit". It arrived in the January 2024 rewrite of the visitor route, and the most recent statement of changes to the rules, dated 3 September 2026, says nothing about remote working. So work fitted around a holiday can be fine. A trip whose real point is to work from the UK is not.

Canada says it most plainly, though on a web page rather than in regulation. [IRCC's Tech Talent page](https://www.canada.ca/en/immigration-refugees-citizenship/campaigns/tech-talent.html) says digital nomads working remotely for an employer outside Canada can live and work there for up to six months at a time, with no work permit and nothing more than visitor status. An IRCC committee note gives the reasoning: these workers aren't entering the Canadian labour market.

That reasoning runs through all three permissions. The UK's list of what counts as working covers taking UK employment, doing work for an organisation or business in the UK, running a business, selling to the public and similar — every item is about the UK end of the deal, and none of them about where the visitor physically sits. UK visitors also can't be paid from a UK source for what they do in the UK, apart from seven listed exceptions. New Zealand likewise excludes work for a New Zealand employer, or with a New Zealand business or person in exchange for goods or services.

Move your employer or your clients into the country you're visiting and each of these permissions falls away.

## Where nobody has written the rule down

Start with the US, where the rules we could read don't answer the question. The visa regulation for business visitors excludes "local employment or labor for hire" from B-1 activity, but it doesn't define "local" or say whether the phrase reaches work for an employer abroad. [USCIS's B-1 page](https://www.uscis.gov/working-in-the-united-states/temporary-visitors-for-business/b-1-temporary-business-visitor) lists things like consulting with business associates, attending conventions and negotiating a contract, and remote work for a foreign employer sits on neither the permitted side nor the prohibited one. The State Department publishes more detailed B-1 guidance, and that is not a document we will paraphrase at second hand ([how we source](/methodology)). Treat it as unread, not as a yes.

Europe's entry rules don't mention work either. A Schengen border guard checks your travel document, your visa, your money and whether you can explain why you've come. Work is not on the list. Employment is left to each country's national law, and Germany publishes nothing about remote work for a foreign employer on a short stay, in either direction. In practice the rule that ends most European trips is the [90 days in any 180](/schengen), not anything to do with work.

Australia's tourist visa says only that the holder must not engage in work in Australia. That is the whole condition, and it doesn't say whose work. Electronic Travel Authority and eVisitor holders get a slightly different version, barring work other than business visitor activity. Work is defined as an activity that, in Australia, normally attracts remuneration. We found nothing in the Australian rules that carves out work for an overseas employer.

## What happens if a border officer thinks you're working

None of the governments whose visitor rules we read for this article publishes a penalty schedule for remote work on a visitor entry, and most have no rule about it to break. The risk is refusal under the general entry rules. That happens at the desk, with no appeal you would recognise as one, and [a refusal follows you into later applications](/guides/visa-refused-what-happens-next).

The UK shows how the test runs. Visitors must not intend to work in the UK, and the Home Office's [visit caseworker guidance](https://www.gov.uk/government/publications/visit-guidance/visit-caseworker-guidance-accessible--2) tells officers to weigh how long you plan to stay and "whether a stay of such a length would be financially viable without remote working on an ongoing basis". Officers also check that your main reason for coming is something other than working remotely, and that the arrangement isn't really a secondment to a UK company or to your employer's UK branch.

A fortnight's holiday with some email is not what that test is aimed at. A long stay that only adds up because you keep billing is. Schengen's purpose-of-stay condition is an affordability test too, so have a simple, honest answer ready about why you're there and how you're paying for it.


![Lit office towers of the City of London at dusk with a full moon rising beside a curved glass skyscraper.](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Super_moon_over_City_of_London_from_Tate_Modern_2018-01-31_4.jpg/1280px-Super_moon_over_City_of_London_from_Tate_Modern_2018-01-31_4.jpg#1280x720)

*The UK rule bars work for a business in the UK — not work done from the UK for a business abroad. Photo: [© User:Colin](https://commons.wikimedia.org/wiki/User:Colin) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Super_moon_over_City_of_London_from_Tate_Modern_2018-01-31_4.jpg).*

## How long you can stay before you owe tax

Immigration and tax are separate bodies of law with their own day counts, and the tax line can arrive well before the visa runs out.

New Zealand puts both on one page. The same guidance that allows remote work warns that you may have to pay tax. If your income is taxed in another country or territory, you may not need to pay New Zealand tax when you're there for less than 92 days in a 12-month period, and if you're tax resident in a country New Zealand has a tax treaty with, you may be able to stay up to 183 days before New Zealand tax is due. The page tells you to contact Inland Revenue about your own situation.

[Inland Revenue's residence test](https://www.ird.govt.nz/international-tax/individuals/tax-residency-status-for-individuals) makes you resident after more than 183 days in any 12-month period, with part-days counted as whole days, unless you're a non-resident visitor. For arrivals on or after 1 April 2026, that status allows up to 275 days in any 18-month period if, among other conditions, you aren't working for or paid by a New Zealand resident and don't sell goods or services to people or businesses in New Zealand.

The UK is the one to watch. [Its residence rules](https://www.gov.uk/tax-foreign-income/residence) make 183 days automatic residence, but automatic non-residence needs fewer than 16 days in the UK. The limit is 46 if you weren't resident in the three previous tax years, or fewer than 91 days if you work full-time abroad, averaging at least 35 hours a week, with no more than 30 of those UK days spent working. So the UK number to carry around is sixteen, not 183.

The US substantial presence test is a weighted formula over three years: at least 31 days this year, and 183 in total once you add every day this year, a third of last year's days and a sixth of the year before that. Spend 120 days a year there for three years running and you reach 180, just under.

Where two countries both claim you, the treaty tie-breaker decides. That's a question to put to a revenue authority in writing, not to a border officer.

## Do you need a digital nomad visa instead?

If you're going to New Zealand, the UK or Canada and the trip fits the visitor period, the government has already answered the question for you. A nomad visa mostly buys certainty. In some countries it also buys a longer stay or a clear tax position, but not always more time: Japan's digital nomad status runs six months with no extension and asks for annual income of at least ¥10 million, which gets you no longer than Canada's ordinary visitor stay.

The nomad schemes are drafted around the same counterparty test as the visitor rules. Croatia's permit is for people working for a company not registered in Croatia, with no Croatian clients, for up to 18 months. Spain's [teleworking visa](https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Consular/Visado-de-teletrabajo.aspx) lets employees work only for companies outside Spain, while the self-employed may take on work for a Spanish company up to 20% of their total professional activity. You can only put a percentage on something if what you're regulating is the client.

Before you book, find out where the company that pays you is registered and whether anyone at your destination will pay you, hire you or buy from you. If the money comes from abroad and nobody local is buying, look for a published position. If there isn't one, you're relying on silence. For a longer stay, our [digital nomad visa tracker](/digital-nomad) lists the open programmes, each checked against the issuing government's own page.

## Common questions

### Can I work on a tourist visa if my clients are local?

No. None of the countries covered here lets a visitor do paid work for a local employer or local clients, including the three that allow remote work. The permission only covers work for an employer or client outside the country.

### Can digital nomads legally work in the US?

The two US sources you can open don't settle it. USCIS's list of business visitor activities doesn't mention remote work for a foreign employer, and the visa regulation excludes "local employment or labor for hire" without defining "local". The State Department's detailed B-1 guidance is the document that would probably answer it, and we haven't read it, so treat the question as unanswered rather than as permission.

### Is there a 183-day rule for tax?

Not a single one, and immigration and tax limits are set by different authorities. South Africa's remote work visa notice shows the split: if you're tax resident in a country with a double-taxation agreement in force with South Africa, you register with SARS once you've been there more than 183 days in total in any 12-month period, and if you're not, you register regardless.

### Can a business hire someone who is visiting on a tourist or nomad visa?

These rules are aimed at exactly that. UK visitors must not do work for an organisation or business in the UK, and Croatia's and Spain's nomad schemes exclude or cap local clients. If someone is working for your local entity, it's their permission that fails.`,
    faq: [
      {
        q: "Can I work on a tourist visa if my clients are local?",
        a: "No. None of the countries covered here lets a visitor do paid work for a local employer or local clients, including the three that allow remote work. The permission only covers work for an employer or client outside the country.",
      },
      {
        q: "Can digital nomads legally work in the US?",
        a: "The two US sources you can open don't settle it. USCIS's list of business visitor activities doesn't mention remote work for a foreign employer, and the visa regulation excludes \"local employment or labor for hire\" without defining \"local\". The State Department's detailed B-1 guidance is the document that would probably answer it, and we haven't read it, so treat the question as unanswered rather than as permission.",
      },
      {
        q: "Is there a 183-day rule for tax?",
        a: "Not a single one, and immigration and tax limits are set by different authorities. South Africa's remote work visa notice shows the split: if you're tax resident in a country with a double-taxation agreement in force with South Africa, you register with SARS once you've been there more than 183 days in total in any 12-month period, and if you're not, you register regardless.",
      },
      {
        q: "Can a business hire someone who is visiting on a tourist or nomad visa?",
        a: "These rules are aimed at exactly that. UK visitors must not do work for an organisation or business in the UK, and Croatia's and Spain's nomad schemes exclude or cap local clients. If someone is working for your local entity, it's their permission that fails.",
      },
    ],
  },
  {
    title: "What happens if you overstay a visa: fines and bans",
    slug: "what-happens-if-you-overstay-a-visa",
    excerpt:
      "Overstay in Thailand by four years and the fine is no bigger than at 40 days. The ban is where it counts, and whether you surrender or get caught can be the difference between five years and ten.",
    metaDescription:
      "Overstay penalties by country: the fine is usually small and capped, but the re-entry ban can run from one year to ten depending on how you leave.",
    author: "isvisarequired.com",
    tags: ["visa overstay", "entry bans", "schengen", "united states visas", "japan", "thailand"],
    created_at: "2026-09-16",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/DSC-0053-passport-control-skopje-airport-july-2017.jpg/1920px-DSC-0053-passport-control-skopje-airport-july-2017.jpg",
      width: 1920,
      height: 1272,
      alt: "Empty airport passport control booths under a sign reading Passport Control All Departures, queue barriers in front.",
      caption: "Exit passport control: the desk where an overstay finally surfaces, and where how you leave starts to matter.",
      credit: {
        author: "Rakoon",
        authorUrl: "https://commons.wikimedia.org/wiki/User:Rakoon",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:DSC-0053-passport-control-skopje-airport-july-2017.jpg",
      },
    },
    content: `Say you misread the date on your entry record and leave a week late, or a cancelled flight keeps you in the country past the end of your permitted stay. At the airport, the day itself is usually undramatic. You pay a fine if the country charges one, and you get on the plane.

The real cost lands later, at the border you want to come back through. Overstay four years in Thailand and the fine is the same 20,000 baht as at 40 days — but you're barred for five years if you walked into immigration yourself, and ten if they found you.

## Overstay fines and bans by country

Thailand shows why the fine is the small part. The overstay fine is 500 baht a day and stops rising at 20,000 baht once you pass 40 days, according to the [Royal Thai Embassy in Washington D.C.](https://washingtondc.thaiembassy.org/en/page/advice-on-thailand-visa-overstay-regulations) That's roughly US$600 at September 2026 rates, on our arithmetic rather than the embassy's.

The US doesn't fine the overstay itself at all.

The pages quoting "a $2,000 fine for each violation" cite no provision for it. American fines are aimed at people who ignore an order to leave — up to US$998 a day for wilfully refusing to depart under a final removal order. They don't reach someone who overstays and simply flies home.

Be sceptical, too, of the "Schengen fine of €500–1,000" copied from site to site. We could not find it in any EU act, Commission page or national fee list. There's no EU-wide fine schedule in any case, because each country sets its own penalties. So it isn't in the table.

| Country | Fine or criminal penalty | Re-entry ban |
| --- | --- | --- |
| United States | No fine for the overstay itself | 3 years after more than 180 days and under a year, if you left voluntarily before proceedings; 10 years after a year or more |
| EU rules | Set by each country | Required if no voluntary departure period was granted or it was ignored; 5 years maximum in principle |
| Germany | Up to 1 year in prison or a fine, and only where you are enforceably required to leave, no departure period was granted or it has expired, and deportation is not suspended | Mandatory after expulsion, removal or deportation, among other cases; breaching it carries up to 3 years |
| Netherlands | No fine published | 1 year for an overstay of over 3 and up to 90 days; 2 years is the usual period |
| Spain | €501 to €10,000, as an administrative penalty | Up to 5 years, or up to 10 for a serious threat to public order, public or national security, or public health |
| UAE | AED 50 per day | No figure published |
| Thailand | 500 baht per day, capped at 20,000 baht from 40 days | If you surrender, 1 year (over 90 days) up to 10 years (over 5 years); if arrested, 5 years (under a year) or 10 years (over a year) |
| Singapore | Up to S$4,000 or 6 months in jail for 90 days or less; over 90 days, jail plus at least 3 strokes of the cane, though women and men over 50 face up to S$6,000 instead | Not stated |
| Japan | Up to 3 years in prison, a fine of up to ¥3 million, or both | 1 year under a departure order; generally 5 years if deported; 10 years for a repeat deportee |

Two rows deserve a note. The Thai surrender and arrest schedule comes from a consulate summary of Ministry of Interior Order 1/2558, and we could not confirm it on immigration.go.th. AED 50 is the federal ICP rate, and Dubai figures of AED 100 circulate, but we could not source them.


![Symmetrical vaulted glass-and-steel airport concourse in Bangkok, seen from the top of an escalator.](https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Suvarnabhumi_Airport_Terminal_C_interior_%28I%29.jpg/1280px-Suvarnabhumi_Airport_Terminal_C_interior_%28I%29.jpg#1280x861)

*Bangkok's Suvarnabhumi concourse, where the overstay fine runs at 500 baht a day and stops dead at 20,000. Photo: [Supanut Arunoprayote](https://commons.wikimedia.org/wiki/User:Supanut_Arunoprayote) / [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Suvarnabhumi_Airport_Terminal_C_interior_(I).jpg).*

## Why the way you leave matters

Under the [Return Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32008L0115), a ban is compulsory only if you were never given a window to leave voluntarily, or ignored the one you got. Otherwise it's optional. Bans are capped at five years in principle and the length is decided on the circumstances of each case, so no EU-wide table converts days overstayed into years banned, whatever the calculator sites publish.

Spain writes the incentive into statute. In circumstances set by regulation, no ban is imposed if you leave while proceedings over your irregular stay are still running, and a ban already imposed is revoked if you leave within the voluntary compliance period of the expulsion order.

The IND, unusually, publishes actual numbers. Its [entry ban page](https://ind.nl/en/entry-ban) sets a one-year ban for an overstay of more than three and up to 90 days, and two years as its usual period. It will lift a one-year ban halfway through if you ask, but only if you left the EU voluntarily and on your own initiative within the set period, among other conditions.

In Japan the one-year and five-year outcomes sit in the same article. Under the [Immigration Control and Refugee Recognition Act](https://laws.e-gov.go.jp/law/326CO0000000319), leaving under a departure order means a one-year bar, being deported generally means five, and a repeat deportee gets ten. Overstaying is also a crime there.

Since 10 June 2024 there have been two routes to a departure order. You can go to an immigration office voluntarily, intending to leave promptly, before any investigation into you begins. Or, once an investigation has started but before you're told you're subject to deportation, you can tell an immigration officer that you intend to leave promptly. Further conditions apply either way, including never having been deported or left under a departure order before.

So if you've overstayed in Japan, go to an immigration office before anyone comes looking for you. Declare it only after an investigation has begun and the bar on returning for a short stay is five years rather than one. Most English-language summaries still describe the old rule, because the official English translation predates the 2023 amendment that changed it.

## Overstaying in the US

Your visa dies first. If you were admitted until a specific date, it's void the moment that stay ends, even one day over. To return you'll normally need a new visa issued in your country of nationality, so a multiple-entry visa is gone, and so is the option of applying from a more convenient third country.

The date that counts is on your I-94 record, not the expiry printed on the visa. USCIS points you to [the lower right-hand corner of Form I-94](https://www.uscis.gov/visit-the-united-states/extend-your-stay) and recommends applying to extend at least 45 days before your authorised stay ends. Our guide to [visa validity versus length of stay](/guides/visa-validity-vs-duration-of-stay) explains why those two dates so often differ.

The bars themselves need longer overstays. Three years needs more than 180 days but less than a year of unlawful presence, followed by a voluntary departure before proceedings begin. Ten years needs a year or more, with no condition about how you left. Both run from the day you leave, and neither bites until you next apply for admission.

[USCIS](https://www.uscis.gov/laws-and-policy/other-resources/unlawful-presence-and-inadmissibility) measures both on a single stay, so two separate 100-day overstays don't add up to a 3-year bar.

## Overstaying in the Schengen area

The EU's [Entry/Exit System](https://home-affairs.ec.europa.eu/policies/schengen/smart-borders/entry-exit-system_en) began operating on 12 October 2025 and replaced passport stamping entirely on 10 April 2026. It automatically identifies entry records with no exit after an authorised stay has expired, so the overstayer list writes itself. Our [guide to the Entry/Exit System](/guides/eu-entry-exit-system-ees) covers what it records.

Any advice suggesting a short overstay might slip past a tired border officer is describing a system that's been switched off.

The limit being measured is 90 days in any 180-day period, counted against the 180 days before each day of your stay. If you're anywhere close, work it out on the [90/180-day calculator](/schengen) rather than in your head.

A ban from one Schengen country is a ban from all 29. The country that issues it must enter an alert in the Schengen Information System, which every Schengen border post can see. Overstay in Portugal, get banned, and Norwegian border police will see the alert. Ireland sits outside Schengen and doesn't receive it.


![Rows of empty airline check-in counters lit warm under a curved roof in an airport departure lobby at dusk.](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Departure_Lobby_of_Haneda_Airport_International_Terminal_longitudinal_view_dllu.jpg/1280px-Departure_Lobby_of_Haneda_Airport_International_Terminal_longitudinal_view_dllu.jpg#1280x843)

*Haneda's international departure lobby. Leaving under a departure order costs one year; being deported costs five. Photo: [Daniel L. Lu (user:dllu)](https://commons.wikimedia.org/wiki/User:Dllu) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Departure_Lobby_of_Haneda_Airport_International_Terminal_longitudinal_view_dllu.jpg).*

## If a cancelled flight makes you overstay

No rule mentions cancelled flights by name, but a few cover the situation.

Travellers on the US Visa Waiver Programme can be granted "satisfactory departure" of up to 30 days when an emergency prevents them leaving. It's discretionary, and it only protects you if you actually leave within that period.

In the Schengen area, [Article 33 of the EU Visa Code](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32009R0810) says a visa shall be extended free of charge if you prove force majeure kept you from leaving. A separate extension for serious personal reasons is discretionary and costs €30.

Force majeure is read narrowly. The IND's [extension page](https://ind.nl/en/short-stay/extend-schengen-visa-or-visa-exempt-term) says that if your airline cancelled the flight but you could still have got home with another airline or from another airport, you can't extend.

If the records point to an overstay, the burden is on you. Where the Entry/Exit System has no file on you, or shows no exit after your stay expired, authorities may presume you overstayed. You can rebut that with credible evidence such as transport tickets, so keep the boarding pass and the cancellation email.

If you're still planning, check the rules for your passport on [the visa checker](/) and leave yourself a margin at the end of the trip instead of flying out on the last permitted day. If you've already overstayed, keep everything that shows when you left and why.

## Common questions

### What happens if I overstay my visa by one day?

It won't trigger a US re-entry bar, but if you were admitted until a set date it voids your US visa, and you'll normally need a new one issued in your country of nationality. In the Netherlands the one-year ban band starts above three days, and the IND doesn't say what applies at or below three. Elsewhere, expect a fine and an officer's discretion.

### Is there a grace period for overstaying a visa?

Not for short visitor stays in any country we checked. The UAE gives residents grace periods of up to six months, depending on their category, after a residence permit expires or is cancelled, but that isn't a margin for visitors. Even the Dutch three-day line only marks where the one-year ban band begins, and the overstay is still recorded.

### Can I get a visa again after an overstay?

Usually, once any ban has run out. US bars last three or ten years from departure, and EU bans are capped at five years in principle. A past overstay does make the next application harder to win, in much the same way as [a refusal on your record](/guides/visa-refused-what-happens-next).

### Do I have to declare a past overstay?

If the form asks, yes. The duty comes from the question in front of you rather than from the overstay, and a false answer is a separate ground for refusal that's worse than the thing you were hiding. Assume the record exists anyway, since the Entry/Exit System flags missing exits automatically and entry bans are held as alerts in the Schengen Information System.`,
    faq: [
      {
        q: "What happens if I overstay my visa by one day?",
        a: "It won't trigger a US re-entry bar, but if you were admitted until a set date it voids your US visa, and you'll normally need a new one issued in your country of nationality. In the Netherlands the one-year ban band starts above three days, and the IND doesn't say what applies at or below three. Elsewhere, expect a fine and an officer's discretion.",
      },
      {
        q: "Is there a grace period for overstaying a visa?",
        a: "Not for short visitor stays in any country we checked. The UAE gives residents grace periods of up to six months, depending on their category, after a residence permit expires or is cancelled, but that isn't a margin for visitors. Even the Dutch three-day line only marks where the one-year ban band begins, and the overstay is still recorded.",
      },
      {
        q: "Can I get a visa again after an overstay?",
        a: "Usually, once any ban has run out. US bars last three or ten years from departure, and EU bans are capped at five years in principle. A past overstay does make the next application harder to win, in much the same way as [a refusal on your record](/guides/visa-refused-what-happens-next).",
      },
      {
        q: "Do I have to declare a past overstay?",
        a: "If the form asks, yes. The duty comes from the question in front of you rather than from the overstay, and a false answer is a separate ground for refusal that's worse than the thing you were hiding. Assume the record exists anyway, since the Entry/Exit System flags missing exits automatically and entry bans are held as alerts in the Schengen Information System.",
      },
    ],
  },
  {
    title: "How long does a visa take? Start with the appointment",
    slug: "how-long-does-a-visa-take",
    excerpt:
      "A Schengen visa must be decided in 15 calendar days and a UK visit visa is published at 3 weeks, but neither clock starts until your application is lodged and your biometrics are in. At one US embassy, the wait for that appointment is 398 days.",
    metaDescription:
      "Visa processing times only start after your appointment and biometrics. What Schengen, UK and US rules actually promise, and how to plan for the real wait.",
    author: "isvisarequired.com",
    tags: ["visa processing times", "schengen visa", "uk visa", "us visa", "administrative processing", "visa appointments"],
    created_at: "2026-09-16",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/St_Pancras_July_2015-1.jpg/1920px-St_Pancras_July_2015-1.jpg",
      width: 1920,
      height: 1243,
      alt: "Two large antique station clocks, one black-faced and one white, side by side on blue ironwork at St Pancras.",
      caption: "Two clocks, not one: the published decision time and the queue for an appointment run on separate schedules.",
      credit: {
        author: "Alvesgaspar",
        authorUrl: "https://commons.wikimedia.org/wiki/User:Alvesgaspar",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:St_Pancras_July_2015-1.jpg",
      },
    },
    content: `Say you've been invited to a wedding in the United States next spring, and you apply for a visitor visa through the US Embassy in Bogotá. Before anyone looks at your application you need an interview slot, and the embassy's page lists the wait for one at 398 days. The wedding will be over before you're through the door.

So how long does a visa take? If yours needs an in-person appointment, it's two waits added together. One is getting in the door. The other is the decision itself, and that's the only half anyone publishes: 15 calendar days for a Schengen visa, 3 weeks for a UK visit visa. Those figures are accurate. They just start later than most people assume.

## When the processing clock starts

UK Visas and Immigration puts a heading on it. Its [guidance on processing times](https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk) says processing starts once you've either verified your identity with the UK Immigration: ID Check app or attended a visa application centre for fingerprints and a photograph. Finding a slot and getting to the centre come first, and neither counts.

Schengen gets there through its statute rather than its guidance. The 15 days run from the lodging of an admissible application, and an application isn't admissible until your biometrics and the visa fee have been collected. Both happen at the appointment.

Other countries use the phrase "processing time" for different things, which makes comparisons slippery. Canada publishes the time it took to process 80% of past applications of that type. For a visitor visa from outside Canada, IRCC says its figure covers most complete applications and leaves out the time you need to give your biometrics. New Zealand publishes both a median and an 80th percentile in working days, which is more honest and no easier to plan with. Australia doesn't pretend at all. Its guide, it says, doesn't guarantee a decision within the timeframe.


![High-rise towers of Bogotá's Santa Fe district under bright cumulus cloud, seen across low city rooftops.](https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bogot%C3%A1%2C_Santa_Fe%2C_2023-06_CN-02.jpg/1280px-Bogot%C3%A1%2C_Santa_Fe%2C_2023-06_CN-02.jpg#1280x730)

*Bogotá, where the US embassy publishes 398 days just to reach a B1/B2 interview, and 634 for non-residents. Photo: [© Steffen Schmitz (Carschten)](https://commons.wikimedia.org/wiki/User:Carschten) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bogot%C3%A1,_Santa_Fe,_2023-06_CN-02.jpg).*

## How long a Schengen visa takes

The [EU Visa Code](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02009R0810-20240628) gives consulates 15 calendar days to decide. In individual cases it can be extended to 45 — the law gives further scrutiny as the example, not the only ground. Justified urgent cases are supposed to be decided without delay.

If a website tells you a Schengen visa can take 60 days, it's quoting law that no longer exists. That provision was deleted in a 2019 reform.

The more useful rule is about the appointment, and it rarely gets a mention. Article 9(2) of the Visa Code says the appointment "shall, as a rule, take place within a period of two weeks from the date when the appointment was requested". "As a rule" carries a lot of weight there, and the law names no remedy if a consulate misses it. Even so, this is the only system covered here that puts a number on the queue itself, and if you're offered a slot far beyond two weeks, it's a sentence worth quoting politely.

Urgency has its own route. In justified urgent cases the consulate may let you lodge your application without an appointment, or give you one immediately. The consulate decides what counts as urgent, so be ready to explain why yours is.

The window has two edges: no more than six months before you travel, and as a rule no later than 15 calendar days before.

## How long a UK visa takes

The Home Office publishes 3 weeks for most visit, study and work visas applied for from outside the UK. Family routes — partner or spouse, parent, child, and adult coming to be cared for by a relative — are 12 weeks, and so is British National (Overseas). The tidiness of those numbers tells you what they are. They're service targets rather than measurements, and how often they're met is published separately, in the Home Office's quarterly transparency data.

The weeks are UK working weeks, Monday to Friday, and they include UK public holidays but not public holidays in other countries. The guidance doesn't say which way a holiday moves your date, so leave slack around them. Applying from inside the UK is a different scheme again, and a slower one. A Standard Visitor application made in-country has an 8-week standard, against 3 weeks from outside.

The UK sells speed openly. [Priority services](https://www.gov.uk/faster-decision-visa-settlement) cost £500 for a decision within 5 working days and £1,000 for one by the end of the next working day, counted from the day of your appointment if you prove your identity in person. On a Family visa from outside the UK, priority buys 30 working days rather than 5. If the decision runs late, you won't usually get your money back. The fee shortens the decision but does nothing about the appointment in front of it, so priority is only worth buying once you have a slot.

## The US: it depends which embassy

Which building you queue at decides almost everything. Two official embassy pages, as they stood on 15 September 2026:

| Category | Bratislava | Bogotá |
|---|---|---|
| Visitor (B1/B2), interview required | 16 days | 398 days |
| Students and exchange visitors (F, M, J) | 16 days | 20 days |
| Non-residents of Colombia or Venezuela | not published | 634 days |
| Interview waiver | 7 days | 4 days |

Same visa, a wait 25 times longer. [Bratislava's figures](https://sk.usembassy.gov/visa-appointment-wait-time/) were updated on 8 September 2026 and apply to residents and citizens of Slovakia. [Bogotá's](https://co.usembassy.gov/visas/bogota-nonimmigrant-visa-wait-times/) carry no visible date, and the page's own modification stamp reads 14 April 2025, so treat them as roughly seventeen months old.

US law requires an in-person interview for applicants aged 14 to 79 unless it's waived, and for applicants of any age who are applying in a country where they're neither a national nor a resident, or who were previously refused a visa (unless that refusal was overcome or a waiver of ineligibility obtained). The non-resident figures therefore aren't an accident of demand — Congress built that queue into the statute.

A [State Department notice effective 1 October 2025](https://cr.usembassy.gov/interview-waiver-update-september-18-2025/) narrowed interview waivers sharply. All applicants, including those under 14 and over 79, now generally need an interview, and the exceptions are mainly diplomatic categories and B1/B2 or H-2A renewals within 12 months of expiry. Anyone who would once have skipped the interview now joins the queue Bogotá measures in hundreds of days. Embassy websites copy these notices and don't always keep up, and Manila's still showed the superseded July version months later.

If you do qualify for a waiver, it's the thing that genuinely collapses a US wait, which is why Bogotá shows 4 days against 398. Even that isn't guaranteed. The US Mission in Spain says waiver processing takes about three weeks and that "we may still require you to attend an interview".

You can ask for an expedited appointment, but the US Embassy in Santo Domingo, for one, only takes requests after you've paid the non-refundable MRV fee and booked a regular slot, which it warns may be more than a year in the future. Expedited appointments are at the consular section's discretion, the qualifying grounds are narrow and set post by post, and a refusal can't be appealed.

## Why is my US visa taking so long?

If your case has gone into administrative processing, the unwelcome answer is that no deadline exists. The US law behind administrative processing letters is a refusal rule, and nothing in it sets a time limit for a decision.

The US Embassy in Panama doesn't pretend otherwise. Its page on [administrative processing](https://pa.usembassy.gov/visas/administrative-processing/) says "there is no estimate how long it may take". In rare cases it runs beyond a year, and after a year a case may be administratively closed unless you ask for it to stay open. If you're getting close to that mark and still want the visa, ask.

The [US Embassy in Ankara](https://tr.usembassy.gov/what-is-the-administrative-processing-system/) asks applicants to wait at least 180 days from the interview, or from when they submitted supplemental documents if that's later, before enquiring about status. Emergency travel is the exception, which it defines as serious illnesses, injuries or deaths in the immediate family. That 180 days is when the embassy will take your question, not when you'll get an answer.

You'll see "most cases resolve within 60 days" repeated on commercial visa sites. Panama's embassy won't give any estimate at all, so don't book anything around that number.


![Empty historic post office lobby in one-point symmetry: three walls of numbered metal PO box doors above a grey marble wainscot, a Greek-key mosaic tile floor, and a coffered mahogany ceiling with milk-glass skylight panels](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/PO_boxes_at_the_historic_Chico_Post_Office_%282024%29-L1005460.jpg/1920px-PO_boxes_at_the_historic_Chico_Post_Office_%282024%29-L1005460.jpg#1920x1371)

*A visa file spends most of its life like this: numbered, closed, and indistinguishable from thousands of others, which is why published processing times are averages rather than promises. Photo: [© Frank Schulenburg](https://commons.wikimedia.org/wiki/User:Frank_Schulenburg) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:PO_boxes_at_the_historic_Chico_Post_Office_(2024)-L1005460.jpg).*

## How to plan around the wait

Start by checking whether you need a visa at all. [The checker](/) covers 195 passports and answers that in one screen. If you do need one, look up the appointment wait at the specific embassy or consulate you'll use, add the published processing time, and treat the total as your minimum. For US visas the State Department's wait-times tool at travel.state.gov is the main source, but check the date on whatever page you're reading.

For Schengen, the six-month limit on how early you can apply means the window at a slow post is genuinely tight. Our [guide to how early to apply](/guides/how-early-to-apply-for-a-visa) works through the sums route by route. If you're visiting the UK without needing a visa, the [UK ETA page](/travel-authorization/uk-eta) explains the much faster authorisation you may need instead.

The US Embassy in Bratislava offers the one planning rule that survives all of this: no flights until the visa is in the passport.

## Common questions

### How long does a visa take after biometrics?

That's when the published clock starts. For the UK, the 3 weeks (or 12 for family routes) run from your biometrics appointment, and for Schengen the 15 calendar days run from lodging an application whose biometrics have been collected. If you've applied for a Schengen visa before, fingerprints first entered in the Visa Information System less than 59 months earlier are copied across, so you may not need to give them again.

### What does a 221(g) letter mean?

Section 221(g) of the US Immigration and Nationality Act lets a consular officer refuse a visa where the applicant appears ineligible or the application is incomplete. A 221(g) letter means your application is refused for now, though that may be overcome if administrative processing ends in your favour. The law sets no time limit on it.

### How long does an ETA take?

The UK ETA costs £20 and you'll usually get a decision by email within a day, though it can take up to 3 working days. Australia's ETA is granted immediately in most cases, and the NZeTA averages 24 hours. They're quick because they're automated, with no interview or biometrics appointment.

### Will reapplying or calling speed up my visa?

Not according to the governments that address it. The US Embassy in Panama says submitting a new application won't expedite a case that's in administrative processing, and Canada's immigration department says calling won't get an application processed faster.`,
    faq: [
      {
        q: "How long does a visa take after biometrics?",
        a: "That's when the published clock starts. For the UK, the 3 weeks (or 12 for family routes) run from your biometrics appointment, and for Schengen the 15 calendar days run from lodging an application whose biometrics have been collected. If you've applied for a Schengen visa before, fingerprints first entered in the Visa Information System less than 59 months earlier are copied across, so you may not need to give them again.",
      },
      {
        q: "What does a 221(g) letter mean?",
        a: "Section 221(g) of the US Immigration and Nationality Act lets a consular officer refuse a visa where the applicant appears ineligible or the application is incomplete. A 221(g) letter means your application is refused for now, though that may be overcome if administrative processing ends in your favour. The law sets no time limit on it.",
      },
      {
        q: "How long does an ETA take?",
        a: "The UK ETA costs £20 and you'll usually get a decision by email within a day, though it can take up to 3 working days. Australia's ETA is granted immediately in most cases, and the NZeTA averages 24 hours. They're quick because they're automated, with no interview or biometrics appointment.",
      },
      {
        q: "Will reapplying or calling speed up my visa?",
        a: "Not according to the governments that address it. The US Embassy in Panama says submitting a new application won't expedite a case that's in administrative processing, and Canada's immigration department says calling won't get an application processed faster.",
      },
    ],
  },
  {
    title: "How much does a visa actually cost? The full bill",
    slug: "what-a-visa-actually-costs",
    excerpt:
      "A Schengen visa is €90 by law, or €116 once a US application centre adds its fee. A US visitor visa is US$185, or US$935 if you pay for a faster interview.",
    metaDescription:
      "A Schengen visa is €90 and a US visitor visa US$185, but service centres, fast-track fees and surcharges add more. The real bill, and what gets refunded.",
    author: "isvisarequired.com",
    tags: ["visa fees", "visa costs", "schengen visa", "us visas", "uk visas"],
    created_at: "2026-09-16",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Passports_on_table.jpg/1920px-Passports_on_table.jpg",
      width: 1920,
      height: 1280,
      alt: "Two navy United States passports lying overlapped on a pale weathered wooden tabletop, seen from above.",
      caption: "The passport is the cheap part. The visa inside it is where the fee schedules start.",
      credit: {
        author: "Kristin Hardwick",
        authorUrl: "https://stocksnap.io/author/kristinhardwick",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Passports_on_table.jpg",
      },
    },
    content: `Say you live in the United States and you're applying for a Schengen visa to spend a week in Norway. The visa fee is €90, set by EU law. Then the application centre adds its own charge, and offers you courier delivery, photographs and text-message updates on top of that.

Visas run from nothing to well over US$1,000 an application. The UK charges £1,128 for a ten-year visit visa. The headline fee is rarely what leaves your account, though. The issuing government publishes its price, the company that takes your fingerprints lists its charges on a different website, fast-track fees sit in another schedule, and US student visas come with a fee owed to a separate agency. Every one of those pages is accurate, and none of them adds it up for you.

Four common applications, with the second charge added. The totals are our arithmetic, not a government's.

| Application | Government fee | Second charge | Total |
|---|---|---|---|
| Norway short-stay visa, applied for in the US | €90 | €26 service fee | €116, or €192.50 with courier in the city, photos and SMS |
| US B1/B2 visitor visa with an expedited interview | US$185 | US$750 expedite fee | US$935 |
| US F-1 student visa | US$185 | US$350 SEVIS fee | US$535 |
| Canadian visitor visa, one adult | CAD 100 | CAD 85 biometrics | CAD 185 |

## What a Schengen visa really costs

Under [EU visa rules](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02009R0810-20240611) the fee is €90 for an adult. It went up from €80 on 11 June 2024, and the European Commission has to reassess it every three years, so don't treat €90 as permanent. Children aged six to under twelve pay €45 and under-sixes pay nothing. School pupils and students travelling to study, researchers travelling for research and a few other groups are exempt.

The second bill comes from the application centre. EU law caps its service fee at €45, half the visa fee, and the cap applies even when your visa fee has been waived, so a student who owes the consulate nothing still pays the contractor. In principle the cap rises to €80, or exceptionally €120, where the country you're applying to has no consulate collecting applications in yours and no other Schengen country represents it there.

The same contractor charges what it likes by country: €26 for a Norwegian visa lodged in the US, [€22 in India and €32.10 in Nepal](https://visa.vfsglobal.com/ind/en/fra/fees) for the identical French visa.

The cap binds the service fee and nothing else, which is where the rest of your money goes. On the Norway route from the US, the [optional extras](https://visa.vfsglobal.com/usa/en/nor/additional-services) include courier delivery at €52 within the city or €63 outside it, four photographs at €17.50 and SMS updates at €7. VFS says on that page that none of them has any bearing on how fast or how favourably your visa is decided, so buy them only if you'd use them anyway. Courier alone is more than half the government fee again.

You'll often be told to skip the outsourcer and apply at the consulate. EU rules say a country may keep that option open, not that it must, so check it exists before you plan around it.

Nor does €90 always reach your card as €90. Consulates charge in euro or local currency at the European Central Bank reference rate and are allowed to round up. The Italian consulate in Los Angeles charged US$104.90 for a short-stay visa in the quarter to 30 September 2026, and resets the figure every quarter.

Repeat applicants get one real saving. Fingerprints must be given in person on a first application, but if yours went into the EU's visa database less than 59 months earlier they're copied across. Inside that window you need not attend at all, and the courier and photographs drop off the bill along with the appointment.


![Euro banknotes fanned out on a white surface, with one note folded into a small paper boat sitting on top.](https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/One_stands_out_002_2025_01_01.jpg/1280px-One_stands_out_002_2025_01_01.jpg#1280x676)

*€90 is the fee the Visa Code sets. The application centre bills separately, and its cap is €45. Photo: [Friedrich Haag](https://commons.wikimedia.org/wiki/User:F._Riedelio) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:One_stands_out_002_2025_01_01.jpg).*

## How much a US visa costs

The [State Department's fee table](https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html) sets the application fee at US$185 for visitor (B), transit (C-1), student (F and M) and exchange (J) visas. Petition-based categories, including H, L, O, P, Q and R, pay US$205, and E treaty trader and investor visas US$315.

Since July 2026 you can also buy your way up the queue. From 1 July to 31 December 2026, selected posts charge US$750 for an expedited B1/B2 interview appointment, on top of the US$185, as a pilot ahead of the 2028 Olympics. That gives a US tourist visa a published price of US$935 if you want to be seen sooner. Worth it if your post is quoting months and the flights are booked. Not worth it if you're merely a fortnight late. The wait is the thing to price first; we set out the realistic lead times in [how early to apply for a visa](/guides/how-early-to-apply-for-a-visa).

The fee is non-refundable, and it doesn't follow you: the US Embassy in London warns that if you move your application to another embassy, you'll pay a new fee and complete a new DS-160 form. Decide where you'll interview before you pay.

Students owe a second agency. The I-901 SEVIS fee is US$350 for F and M applicants and US$220 for J applicants, collected by Immigration and Customs Enforcement separately from the visa fee, so an F-1 student is US$535 down before a consular officer has opened the file.

If your passport lets you skip the visa, ESTA now costs US$40.27, made up of three separate statutory charges, against US$21 before July 2025. And the US$250 visa integrity fee you may have read about has no published way to pay it yet, on which more below.

## UK visa fees and the health surcharge

A UK visit visa costs £135 for up to six months and £1,128 for up to ten years. An [ETA](/travel-authorization/uk-eta) costs £20.

The Home Office publishes its own estimated cost of handling each application alongside its prices, in its [visa fees transparency data](https://www.gov.uk/government/publications/visa-fees-transparency-data). In the edition published in September 2026, a six-month visit visa and a ten-year one each cost the department £116. The ten-year visa costs you more than eight times as much for the same work. The Home Office puts the ETA's own unit cost at £10 and sells it for £20.

That makes the ten-year visa a bet on your own travel plans, and one with a catch: if you pay for ten years and are granted a shorter visa, you don't get the difference back.

On longer UK routes the visa fee isn't even the biggest number. The [immigration health surcharge](https://www.gov.uk/healthcare-immigration-application/how-much-pay) is £1,035 a year, or £776 for students and their dependants, Youth Mobility Scheme holders and under-18s, and it's paid up front for the full length of the visa. Three years at the standard rate comes to £3,105, against a £2,064 application fee for the Route to Settlement.

## Visa fees in Canada and India

Canada splits its prices into separate lines. [IRCC's fee list](https://ircc.canada.ca/english/information/fees/fees.asp) charges CAD 100 per person for a visitor visa, or CAD 500 for a family of five or more, then CAD 85 per person (CAD 170 per family) for biometrics. A single adult who has to give biometrics pays CAD 185, which is 85% more than the headline. An eTA is CAD 7.

India's e-Tourist visa has a seasonal price for most nationalities. The 30-day visa is US$10 from April to June and US$25 from July to March. A one-year visa is US$40 and a five-year visa US$200. UK nationals, along with those of Gibraltar, Guernsey, the Isle of Man and Jersey, pay US$484 for five years. Twenty-two nationalities pay nothing, and several more, including Malaysia, Thailand and South Africa, pay nothing for the 30-day visa.

India's own portal is also unusually blunt about what you shouldn't be paying for. The [official e-visa portal](https://indianvisaonline.gov.in/evisa/tvoa.html) says no intermediary or travel agent is needed, and the government makes no provision for an emergency or express fee at all, so any such line is the seller's own.

## Will you get a refund if your visa is refused?

Almost certainly not.

Under EU rules the Schengen fee comes back in two situations only: you applied to the wrong consulate, or your application was inadmissible and never examined. A refused application has been examined, so it fits neither. The rules say nothing about refunding the service fee, and VFS marks its €26 on the Norway route as non-refundable.

The State Department's [page on visa denials](https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/visa-denials.html) answers the refund question with a flat no. If you reapply, you normally pay again, with one exception covered in the questions below. ESTA at least tells you the price of a no: US$10.27 of the US$40.27 is a cost-recovery charge you pay even if you're denied.

A UK visitor visa fee isn't refunded if you're refused. The health surcharge is the exception, refunded in full if your application is refused or withdrawn before a decision, normally within six weeks. On a refused Route to Settlement application with three years of surcharge paid up front, the UK returns the £3,105 and keeps the £2,064 fee.

A refusal costs you the whole fee, which is the argument for spending an extra week on your documents rather than US$750 on a faster appointment. If it's already happened, our guide to [what happens after a visa refusal](/guides/visa-refused-what-happens-next) sets out your options.


![Dublin's Georgian Custom House, its green copper dome and columned Portland stone facade lit by low winter sun above the River Liffey.](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dublin_Custom_House_in_2025.jpg/1920px-Dublin_Custom_House_in_2025.jpg#1920x1080)

*Dublin's Custom House, built in 1791 to tax goods moving through the port and still in government hands. Visa fees are set the same way: by a department, in a published schedule, and revised on its own timetable. Photo: [Christian David](https://commons.wikimedia.org/wiki/User:Espandero) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dublin_Custom_House_in_2025.jpg).*

## How to work out your own total

Start by checking whether your passport needs a visa at all — our [visa checker](/) covers 195 passports — then take the government fee from the issuing government's own page and add only the application-centre lines you'll use.

What not to trust is a third-party listing for the government fee. When we [checked 37 digital nomad visa programmes against official sources](/blog/what-we-found-checking-every-digital-nomad-visa), 218 field values changed, fees among them. Thailand's long-term resident visa was widely listed at US$200, when the Thai Board of Investment charges nothing to apply and 50,000 baht (about US$1,500 at September 2026 exchange rates) once the visa is issued.

If a figure you find online looks tidy, check it against the issuing government's page before you budget on it.

## Common questions

### Does a 10-year Schengen visa cost more?

No, it's the same €90. EU rules price the application rather than the validity, and there's no higher tier for multi-entry or long-validity visas.

### Do tourists have to pay US$250 to enter the US?

Congress enacted a Visa Integrity Fee of at least US$250 in July 2025 that can't be waived or reduced. USCIS then deferred it pending cross-agency coordination, nothing has been published since, and no State Department or embassy page tells applicants how or when to pay it.

### Do I have to pay again if my US visa is refused?

Usually, yes. A 221(g) refusal for missing documents can be reassessed on the original fee if you supply what's missing within one year of the refusal. After that year, or after a 214(b) refusal, you file a new application and pay again.

### What's the most expensive visa?

Of the fee schedules we read, the steepest are the UK's £3,635 for a Route to Settlement application in the "other dependant relative" category, £3,226 for indefinite leave to remain (which doesn't attract the health surcharge), and Thailand's 50,000 baht long-term resident visa issuance fee. For a visitor visa, the highest is the UK's £1,128 ten-year visa, and the dearest US figure is US$935 with an expedited appointment.`,
    faq: [
      {
        q: "Does a 10-year Schengen visa cost more?",
        a: "No, it's the same €90. EU rules price the application rather than the validity, and there's no higher tier for multi-entry or long-validity visas.",
      },
      {
        q: "Do tourists have to pay US$250 to enter the US?",
        a: "Congress enacted a Visa Integrity Fee of at least US$250 in July 2025 that can't be waived or reduced. USCIS then deferred it pending cross-agency coordination, nothing has been published since, and no State Department or embassy page tells applicants how or when to pay it.",
      },
      {
        q: "Do I have to pay again if my US visa is refused?",
        a: "Usually, yes. A 221(g) refusal for missing documents can be reassessed on the original fee if you supply what's missing within one year of the refusal. After that year, or after a 214(b) refusal, you file a new application and pay again.",
      },
      {
        q: "What's the most expensive visa?",
        a: "Of the fee schedules we read, the steepest are the UK's £3,635 for a Route to Settlement application in the \"other dependant relative\" category, £3,226 for indefinite leave to remain (which doesn't attract the health surcharge), and Thailand's 50,000 baht long-term resident visa issuance fee. For a visitor visa, the highest is the UK's £1,128 ten-year visa, and the dearest US figure is US$935 with an expedited appointment.",
      },
    ],
  },
  {
    title: "The best second passport for visa-free travel depends on yours",
    slug: "which-second-passport-adds-the-most-countries",
    excerpt:
      "Passport rankings treat strength as a fixed number, but what a second passport adds depends on the one you already hold. A German passport gains two destinations from an Irish one and 14 from a Beninese one.",
    metaDescription:
      "A German passport gains 14 destinations from a Beninese one and just 2 from an Irish one. Why overlap, not strength, decides the best second passport.",
    author: "isvisarequired.com",
    tags: ["second passport", "dual citizenship", "visa-free travel", "passport ranking", "ECOWAS", "UAE passport"],
    created_at: "2026-09-16",
    updated_at: "2026-09-17",
    cover: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/006_Dune_45_in_Sossusvlei_at_sunrise_Photo_by_Giles_Laurent.jpg/1920px-006_Dune_45_in_Sossusvlei_at_sunrise_Photo_by_Giles_Laurent.jpg",
      width: 1920,
      height: 1280,
      alt: "Red-orange sand dune in the Namib desert at sunrise, its crest dividing sunlit sand from deep shadow, with camel thorn trees on the gravel plain at its base",
      caption: "Dune 45 at sunrise, Sossusvlei. What a second passport is worth depends less on its ranking than on which specific places it adds to the map you actually travel.",
      credit: {
        author: "Giles Laurent",
        authorUrl: "https://commons.wikimedia.org/wiki/User:Giles_Laurent",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:006_Dune_45_in_Sossusvlei_at_sunrise_Photo_by_Giles_Laurent.jpg",
      },
    },
    content: `Say you hold a German passport and the chance of a second one comes up. Ireland looks like the obvious choice: on our count its passport reaches 150 destinations without an advance application, one more than yours. Benin's reaches 57, so it looks like no choice at all.

Do the sums and the Irish passport adds two destinations you can't already reach. The Beninese one adds 14.

There is no single best second passport for visa-free travel. What a second passport is worth depends on the one you already hold, and overlap matters more than strength. One document does come out on top whatever you start with: the United Arab Emirates gave the biggest gain for every first passport we tested.

## How we count visa-free access

A destination counts only if you can turn up without applying for anything first, either visa-free or with a visa issued on arrival. Our dataset covers 195 countries, so each passport is scored against the other 194. eVisas and electronic travel authorisations don't count, because both need approval before you board. The [methodology page](/methodology) explains where the underlying data comes from and how it's checked.

That rule is why our numbers look low. They run 20 to 30 below the figures you'll see on citizenship-by-investment sites. The UAE government's [fact sheet](https://u.ae/en/about-the-uae/fact-sheet) says an Emirati passport reaches 179 countries, 45 of them by eVisa or visa on arrival. We count 156. The same page credits a private commercial index for its claim to first place, so even a government's headline figure turns out to be borrowed rather than measured.

Leaving out travel authorisations isn't pedantry. The Home Office itself says "An ETA is not a visa, it is a digital permission to travel", in [the announcement](https://www.gov.uk/government/news/uk-to-extend-electronic-travel-to-european-visitors) extending it to European visitors from 2 April 2025. You still have to apply for one before you travel, and it costs £20. Europe's [ETIAS](/travel-authorization/etias) works the same way, at €20 for three years, and we exclude it too.

Since 10 April 2025 Brazil has required Australian, Canadian and US nationals to buy an [electronic visa](https://www.gov.br/mre/pt-br/consulado-miami/information-about-visas-in-english/electronic-visitor-visa-e-visa) costing US$80.90, so Brazil counts on a British passport and not on an American one.


![Two golden limestone sea stacks standing in turquoise surf below eroded coastal cliffs, under a tall cumulus sky on the Southern Ocean coast.](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Princetown_%28AU%29%2C_Port_Campbell_National_Park%2C_Twelve_Apostles_--_2019_--_0969.jpg/1920px-Princetown_%28AU%29%2C_Port_Campbell_National_Park%2C_Twelve_Apostles_--_2019_--_0969.jpg#1920x1280)

*The Twelve Apostles, on Australia's Southern Ocean coast — a reminder that a high ranking is not the same as an open border. In our data Australia lets exactly one nationality arrive without arranging entry first: New Zealanders. Photo: [Dietmar Rabich](https://commons.wikimedia.org/wiki/User:XRay) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Princetown_(AU),_Port_Campbell_National_Park,_Twelve_Apostles_--_2019_--_0969.jpg).*

## If your passport is weak, pick the strongest second one

At the bottom of the table there's so little overlap left to lose that raw strength wins. A Pakistani passport reaches 25 destinations; an Emirati one reaches 156, so the gain is 131 and overlap never enters into it.

A Nigerian passport (42 destinations) gains 123 from the UAE and 121 from South Korea. An Indian one (50) gains 108 from the UAE and 102 from Ireland.

India doesn't allow dual citizenship, though, so treat those two figures as arithmetic rather than advice. Under [section 9 of the Citizenship Act 1955](https://www.mha.gov.in/sites/default/files/2025-01/CitizenshipAct1955_02012025_0.pdf), Indian citizenship ends when you voluntarily acquire another, and the Ministry of External Affairs is firm that OCI status is not dual citizenship either. For an adult there is no lawful way to hold both. The narrow exception is a child who is Indian by descent, who may keep a second citizenship only until six months after reaching full age.

## Two strong passports barely add anything

Germany reaches 149 destinations. Ireland reaches 150. Hold both and you reach 151.

The two extra destinations are the United Kingdom and Uganda, and neither is in the EU. Inside the Union the overlap is total by law, because [EU free movement rules](https://eur-lex.europa.eu/eli/dir/2004/38/oj/eng) forbid member states from imposing an entry visa or any equivalent formality on Union citizens.

The UK is on the list because Irish citizens, dual citizens included, are the one European nationality exempt from the [UK's ETA](/travel-authorization/uk-eta), while every other EU, EEA and Swiss national needs one. An Irish citizen has needed no permission at all to enter the UK since long before anyone thought of an ETA — that is the Common Travel Area, and it is decades older than the scheme. Uganda is there for a duller reason: Ireland appears on the Ugandan immigration directorate's visa-exempt list of 37 countries, and Germany doesn't.

Across the Atlantic, a US passport holder who adds a British one gains five destinations: Belarus, Brazil, China, Vietnam and Venezuela, though Venezuela sits in our data without a published instrument behind it. Belarus gives 30 days to 38 European states, the UK among them. Vietnam's 45-day exemption covers Britain, Germany, Japan and South Korea but not the US, and China's visa waiver now covers the UK and Canada.

So if travel is the only reason you want a second passport and you already hold a strong one, the arithmetic is unkind. There may be good reasons to want Irish citizenship on top of German. Getting through more borders isn't one of them.

## Why a West African passport can beat an Irish one

Ireland's two is the floor. Set five other candidates against that same German passport and what each one opens on its own turns out to say very little about what it adds.

| Second passport | Its own access | Destinations it adds |
|---|---|---|
| United Arab Emirates | 156 | 15 |
| Benin | 57 | 14 |
| Burkina Faso | 53 | 14 |
| Senegal | 53 | 14 |
| Tunisia | 62 | 13 |

Benin's passport opens just over a third as many destinations as Ireland's, yet adds seven times as many. Seven are ECOWAS neighbours (Ghana, Guinea, Guinea-Bissau, Ivory Coast, Liberia, Nigeria and Togo), plus Mali and Niger, plus Kenya, plus four more we carry from our own data without a published instrument: Central African Republic, Chad, Cuba and Republic of the Congo.

Those first seven come from one legal instrument. Under the [ECOWAS Protocol A/P.1/5/79](https://ecowas.int/wp-content/uploads/2024/08/PROTOCOL-RELATING-TO-FREE-MOVEMENT-OF-PERSONS.pdf), a citizen of one member state can visit another for up to 90 days without a visa. That's free movement rather than an open border: you still need a valid travel document and a health certificate, and each state keeps the right to refuse someone it considers inadmissible.

Mali and Niger left ECOWAS on 29 January 2025 and are no longer bound by the Protocol. A Beninese traveller still gets in, under the Sahel states' own declaration of 14 December 2024, which makes their confederation a visa-free space for ECOWAS nationals, subject to national law.

A traveller from any of 28 named African countries, Benin, Burkina Faso, Senegal, Tunisia and Nigeria among them, is exempt from Kenya's eTA for stays of up to 60 days. That comes from [Legal Notice No. 93 of 30 May 2025](https://documents.kenyahighcom.org.uk/L.%20%20N.-%2093%20kenyan%20citizenship%20and%20immigration%20act%20.pdf). Germans, Britons and Americans have to apply.

A Beninese or Tunisian traveller must apply to visit Germany; an Emirati or Brazilian one simply turns up. EU visa rules put them on opposite lists. So the Beninese passport holder applies to visit Germany and the German passport holder applies to visit Kenya, which is what people miss when they talk about strength as a single number. It has a direction, and our [reciprocity data](/reciprocity) shows it pair by pair.

Burkina Faso left ECOWAS on the same day as Mali and Niger, and ECOWAS said citizens of all three would keep their movement and residence rights "until further notice". That makes its row the least stable of the five.

## Why the UAE passport tops every combination

The Emirati passport is the only one in our data that is both near-universal, at 156 destinations, and able to reach places most strong Western passports can't: Russia, Iran, India, Pakistan, Sudan, Syria and Yemen — and, for an American, China too. Only the Indian and Chinese entries trace to a published rule; the rest we carry from our own data. A German passport gains 15 destinations from it, a Japanese one 16, a British one 17, an American one 19 and a Brazilian one 22.

China's unilateral waiver covers the 50 countries on the National Immigration Administration's [visa-exemption list](https://en.nia.gov.cn/n147418/n147463/c183390/content.html), for stays of up to 30 days. Germany, Ireland, Japan, South Korea and Brazil are on it, and the UK and Canada joined from 17 February 2026. The United States isn't. The UAE gets in through a different door altogether, a mutual visa exemption with China that has been in force since 16 January 2018.

India grants visa on arrival to only three nationalities, Japan, South Korea and the UAE, and the Emirati version has a catch. According to India's [Bureau of Immigration](https://indianvisaonline.gov.in/visa/visa-on-arrival.html) it applies only to people who have previously held an e-Visa or a regular paper visa for India. It costs Rs 2,000 and is available at six airports. In practice, an Emirati passport gets you into India on arrival on your second visit, not your first.


![White multi-tiered keep of Himeji Castle rising above stone ramparts and a tiled plaster wall, the wall's stone base mirrored in the moat below, with autumn maples on both sides](https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Himeji_Castle%2C_November_2016_-02.jpg/1920px-Himeji_Castle%2C_November_2016_-02.jpg#1920x997)

*Himeji Castle, completed in 1609. A headline country count hides the thing that matters: whether the destinations a pairing adds are places you would ever go. Photo: [Martin Falbisoner](https://commons.wikimedia.org/wiki/User:Martin_Falbisoner) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Himeji_Castle,_November_2016_-02.jpg).*

## What a second passport doesn't change

All of this measures travel access and nothing more. It tells you nothing about the right to live or work anywhere, or about the tax, military-service and renunciation consequences that usually decide whether a second nationality makes sense.

US citizens are taxed on their [worldwide income](https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-resident-aliens-abroad) wherever they live, and US law requires them, with limited exceptions, to use a US passport to leave and enter the United States. A second passport does nothing for you at a US border; it only starts working once you're outside.

Germany runs the other way. It stopped requiring its citizens to get a retention permit before taking a foreign nationality when its reformed nationality law came into force on 27 June 2024. Whether the other country accepts dual nationality is a matter for its own law.

None of this is legal advice, and we don't rank citizenship-by-investment programmes. If you're weighing up a particular pair, run it through our [dual citizenship tool](/dual-citizenship), which works out the marginal gain for up to three passports against the same data. Once you hold two, the guide to [which passport to use at which border](/guides/which-passport-to-use-dual-citizenship) covers the practical side.

## Common questions

### What is the best second passport for visa-free travel?

On our count, the United Arab Emirates. It reaches 156 of 194 destinations and gave the largest gain for every first passport we tested, mainly because it opens places such as Russia, India and Pakistan that the strong Western passports don't.

### How do you work out combined visa-free access with two passports?

Take the union of the two lists, not the sum. Across all 194 destinations, count the ones the second passport reaches and the first doesn't, and that difference is the marginal gain. It's why two strong passports usually add so little to each other.

### Is a second EU passport worth having for travel if I already hold one?

Barely. No member state can require an entry visa from an EU citizen, so two EU passports cover exactly the same ground inside the Union. An Irish passport adds only the UK and Uganda to a German one.

### Do Irish citizens need a UK ETA?

No, and that includes Irish dual citizens. Other EU, EEA and Swiss nationals visiting without a visa have needed one since 2 April 2025, unless they hold status under the EU Settlement Scheme. It costs £20 and lasts two years, or until the passport expires if that's sooner.`,
    faq: [
      {
        q: "What is the best second passport for visa-free travel?",
        a: "On our count, the United Arab Emirates. It reaches 156 of 194 destinations and gave the largest gain for every first passport we tested, mainly because it opens places such as Russia, India and Pakistan that the strong Western passports don't.",
      },
      {
        q: "How do you work out combined visa-free access with two passports?",
        a: "Take the union of the two lists, not the sum. Across all 194 destinations, count the ones the second passport reaches and the first doesn't, and that difference is the marginal gain. It's why two strong passports usually add so little to each other.",
      },
      {
        q: "Is a second EU passport worth having for travel if I already hold one?",
        a: "Barely. No member state can require an entry visa from an EU citizen, so two EU passports cover exactly the same ground inside the Union. An Irish passport adds only the UK and Uganda to a German one.",
      },
      {
        q: "Do Irish citizens need a UK ETA?",
        a: "No, and that includes Irish dual citizens. Other EU, EEA and Swiss nationals visiting without a visa have needed one since 2 April 2025, unless they hold status under the EU Settlement Scheme. It costs £20 and lasts two years, or until the passport expires if that's sooner.",
      },
    ],
  },
]
const BY_SLUG = new Map(STATIC_POSTS.map((p) => [p.slug, p]));

export function staticPostBySlug(slug: string): StaticPost | undefined {
  return BY_SLUG.get(slug);
}

/** Newest first, matching the ORDER BY created_at DESC the database queries use. */
export function staticPostsNewestFirst(): StaticPost[] {
  return [...STATIC_POSTS].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/**
 * A repo post in the same shape as a blog_posts database row, plus the photo
 * fields database rows don't have. Used by the public API and the server-
 * rendered page so both describe a post identically.
 */
export function staticPostAsRow(p: StaticPost) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    metaDescription: p.metaDescription ?? null,
    content: p.content,
    author: p.author,
    tags: p.tags,
    created_at: p.created_at,
    updated_at: p.updated_at,
    faq: p.faq ?? null,
    cover_url: p.cover?.src ?? null,
    cover_alt: p.cover?.alt ?? null,
    cover_width: p.cover?.width ?? null,
    cover_height: p.cover?.height ?? null,
    cover_caption: p.cover?.caption ?? null,
    cover_credit: p.cover?.credit ?? null,
  };
}
