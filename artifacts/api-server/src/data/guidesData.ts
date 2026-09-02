// Editorial cornerstone guides. Two kinds:
//  - "passport-roundup": data-driven visa-free/VoA/eVisa roundup for one
//     passport (the renderer injects the live country lists), wrapped in
//     hand-written editorial context so it is materially different from the
//     reference-table passport hub.
//  - "article": fully hand-written explainer.
// No visa facts are invented here — the country lists come from the visa
// dataset at render time; the prose is general guidance with clear sourcing.

export interface PassportRoundup {
  kind: "passport-roundup";
  slug: string;
  code: string; // passport ISO-2
  nationality: string; // "Indian citizens"
  adjective: string; // "Indian"
  intro: string; // editorial lead paragraph (plain text)
  // NB: practical tips are no longer stored here — seo/guides.ts derives them
  // per passport from live visa data (passportTips), so each guide's advice is
  // unique and correct for that nationality.
}

export interface Article {
  kind: "article";
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { h2: string; html: string }[];
  faqs: { q: string; a: string }[];
}

export type Guide = PassportRoundup | Article;

export const GUIDES: Guide[] = [
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-indian-citizens",
    code: "IN",
    nationality: "Indian citizens",
    adjective: "Indian",
    intro:
      "For Indian passport holders, knowing exactly where you can travel without a prior embassy visa saves time, money and uncertainty. This guide breaks down every destination an Indian citizen can enter visa-free, on a visa on arrival, or with a quick online eVisa — with the current maximum stay for each, and a direct link to the full requirements.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-nigerian-citizens",
    code: "NG",
    nationality: "Nigerian citizens",
    adjective: "Nigerian",
    intro:
      "Nigerian passport holders face some of the world's more demanding visa requirements, which makes it especially valuable to know precisely where you can go with little or no paperwork. Below is every destination open to Nigerian citizens visa-free, on arrival, or via a straightforward eVisa, each with its permitted stay and full details.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-pakistani-citizens",
    code: "PK",
    nationality: "Pakistani citizens",
    adjective: "Pakistani",
    intro:
      "This guide lists every country a Pakistani passport holder can visit without arranging a visa in advance — whether that means visa-free entry, a visa on arrival, or an online eVisa. Each destination shows the maximum stay and links through to fees, documents and official sources.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-filipino-citizens",
    code: "PH",
    nationality: "Filipino citizens",
    adjective: "Filipino",
    intro:
      "Filipino passport holders enjoy visa-free or visa-on-arrival access to a large number of countries across Asia, the Americas and beyond. This guide sets out every one of them, plus the destinations reachable with a simple eVisa, along with how long you can stay in each.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-bangladeshi-citizens",
    code: "BD",
    nationality: "Bangladeshi citizens",
    adjective: "Bangladeshi",
    intro:
      "Bangladeshi passport holders need a visa for most of the world, which makes the destinations that waive it — or grant one at the border — genuinely worth knowing. This guide lists every country a Bangladeshi citizen can enter visa-free or on a visa on arrival, plus the growing set reachable with an online eVisa, each with its permitted stay.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-kenyan-citizens",
    code: "KE",
    nationality: "Kenyan citizens",
    adjective: "Kenyan",
    intro:
      "Kenyan passport holders benefit from strong access across Africa and the Caribbean, including broad visa-free travel within the East African Community and beyond. This guide sets out every destination open to Kenyan citizens without a prior embassy visa — visa-free, visa on arrival, or a simple eVisa — with the maximum stay for each.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-vietnamese-citizens",
    code: "VN",
    nationality: "Vietnamese citizens",
    adjective: "Vietnamese",
    intro:
      "Vietnamese passport holders can travel across much of Southeast Asia without a visa thanks to ASEAN agreements, and a growing list of countries further afield offer entry on arrival or with a simple online eVisa. This guide lists every destination open to Vietnamese citizens without an embassy visit, with the permitted stay for each.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-indonesian-citizens",
    code: "ID",
    nationality: "Indonesian citizens",
    adjective: "Indonesian",
    intro:
      "Indonesian passport holders enjoy some of the widest visa-free access in Southeast Asia — the whole ASEAN region plus a long list of destinations across Asia, Africa and the Americas. Below is every country Indonesian citizens can enter visa-free, on a visa on arrival, or with an online eVisa, each with its maximum stay.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-egyptian-citizens",
    code: "EG",
    nationality: "Egyptian citizens",
    adjective: "Egyptian",
    intro:
      "Egyptian passport holders can reach a meaningful set of destinations across Africa, Asia and the Middle East without arranging a visa in advance. This guide breaks down every country open to Egyptian citizens visa-free, on arrival, or via eVisa — with the permitted stay and a link to the full requirements for each.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-sri-lankan-citizens",
    code: "LK",
    nationality: "Sri Lankan citizens",
    adjective: "Sri Lankan",
    intro:
      "Sri Lankan passport holders need a visa for much of the world, which makes the exceptions worth knowing precisely. This guide lists every destination a Sri Lankan citizen can enter visa-free or with a visa granted at the border, plus the growing number of countries reachable with an online eVisa.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-nepali-citizens",
    code: "NP",
    nationality: "Nepali citizens",
    adjective: "Nepali",
    intro:
      "Nepali passport holders have open-border access to India and visa-free or on-arrival entry to a modest but useful set of destinations across Asia, Africa and beyond. This guide lists all of them — visa-free, visa on arrival and eVisa — with the maximum stay for each and links to full requirements.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-chinese-citizens",
    code: "CN",
    nationality: "Chinese citizens",
    adjective: "Chinese",
    intro:
      "The Chinese passport has moved faster than almost any other in recent years, as Beijing signed a wave of mutual visa-exemption agreements and more countries opened eVisa channels. That makes an up-to-date list genuinely useful: what was visa-required a couple of years ago may not be today. Below is every destination open to Chinese citizens without an embassy appointment — visa-free, on arrival, or through an online application — with the permitted stay for each.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-turkish-citizens",
    code: "TR",
    nationality: "Turkish citizens",
    adjective: "Turkish",
    intro:
      "Turkish passport holders sit at a genuine crossroads: strong access across Africa, the Balkans, Central Asia and much of Southeast Asia, but a visa requirement for the European Union next door. This guide separates the two realities — everywhere you can simply board a plane, everywhere a visa is issued at the border, and everywhere an online application is enough — so you can plan around the paperwork rather than into it.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-brazilian-citizens",
    code: "BR",
    nationality: "Brazilian citizens",
    adjective: "Brazilian",
    intro:
      "Brazil holds one of the strongest passports outside Europe and North America: visa-free travel across the whole of Europe, nearly all of South America, and a long list of destinations in Asia and Africa. The catch is that a strong passport makes it easy to assume everywhere is open — and it isn't. This guide lists exactly where Brazilian citizens walk through, where a visa is issued on arrival, and where an online application is required first.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-mexican-citizens",
    code: "MX",
    nationality: "Mexican citizens",
    adjective: "Mexican",
    intro:
      "Mexican passport holders travel visa-free across Europe and most of Latin America, which surprises people who assume the opposite from the paperwork required for the United States and Canada. Those two neighbours are the exception, not the rule. Here is the full picture: every destination open without a prior visa, every one that issues a visa at the border, and every one that expects an online application before you fly.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-south-african-citizens",
    code: "ZA",
    nationality: "South African citizens",
    adjective: "South African",
    intro:
      "The South African passport is among the strongest on the continent, with broad access across southern Africa and a useful spread of destinations in Asia, the Caribbean and South America. Europe and North America still require visas, so knowing precisely where you can travel on the passport alone is worth real time and money. This guide sets out every one of those destinations, with the permitted stay and full requirements for each.",
  },
  {
    kind: "passport-roundup",
    slug: "visa-free-countries-for-ghanaian-citizens",
    code: "GH",
    nationality: "Ghanaian citizens",
    adjective: "Ghanaian",
    intro:
      "For Ghanaian passport holders, ECOWAS free movement makes West Africa straightforward, and a growing number of countries further afield now accept an online application instead of an embassy visit. Those eVisa routes are where most of the recent progress has been. This guide lists every destination reachable without a prior embassy visa — visa-free, visa on arrival, or eVisa — so you can see the realistic options at a glance.",
  },
  {
    kind: "article",
    slug: "six-month-passport-rule",
    title: "The Six-Month Passport Rule, Explained (2026)",
    description: "Most countries want your passport valid six months beyond your trip — but the rule isn't universal, and Europe's is different. What the rule means, who enforces it, and how to check yours.",
    h1: "The six-month passport rule, explained",
    intro:
      "Many countries will refuse entry — and many airlines will refuse boarding — if your passport expires within six months of your arrival date. It catches people out because the passport is still valid, so nothing looks wrong until you are at the check-in desk. Here is what the rule actually says, where it does not apply, and how to work out where you stand.",
    sections: [
      {
        h2: "What the rule actually requires",
        html: `<p>The common version of the rule is that your passport must remain valid for <strong>at least six months beyond the date you enter</strong> the country — not beyond the date you leave. A passport that expires four months after your holiday can therefore be refused even though it is technically in date for the whole trip.</p>
<p>The reasoning is administrative rather than suspicious: countries want a buffer in case you have to stay longer than planned, so you are never inside their borders holding an expired document.</p>`,
      },
      {
        h2: "Who actually enforces it",
        html: `<p>Two separate parties check, and either can stop you:</p>
<ul>
<li><strong>The airline, at check-in.</strong> Airlines are fined by destination countries for carrying inadmissible passengers, so they enforce document rules strictly and sometimes conservatively. Most refusals happen here, before you ever reach immigration.</li>
<li><strong>The border officer, on arrival.</strong> The final decision on entry is always theirs.</li>
</ul>
<p>This is why "the embassy told me it was fine" does not help at the airport — the airline applies its own reading of the rule, and you will not be at the border to argue.</p>`,
      },
      {
        h2: "Europe is the big exception",
        html: `<p>The Schengen Area does not use the six-month rule. To enter, your passport must be:</p>
<ul>
<li><strong>Valid for at least three months beyond your intended departure</strong> from the Schengen Area — not six, and measured from when you leave rather than when you arrive;</li>
<li><strong>Issued within the previous ten years</strong> — a genuine trap for anyone whose passport was issued with extra months carried over from an old one, because it can be in date yet still older than ten years and be rejected;</li>
<li>Carrying <strong>at least two blank pages</strong>.</li>
</ul>
<p>These three conditions come from EU visa law (Regulation 810/2009) and are applied at both airline check-in and the border. If you are heading to Europe, check the <em>issue</em> date as carefully as the expiry date.</p>`,
      },
      {
        h2: "Where the rule is shorter or does not apply",
        html: `<p>Requirements genuinely vary, and a handful of countries ask only that your passport be valid for the duration of your stay. Because the exceptions are specific and change, the practical approach is to check your exact destination rather than rely on a general rule — the entry-requirements section of each of our <a href="/countries">destination guides</a> lists the passport-validity rule we hold for that country, alongside proof-of-funds and insurance expectations.</p>
<p>Treat six months as the safe default you plan around, and treat anything shorter as a bonus you have verified, not assumed.</p>`,
      },
      {
        h2: "How to check where you stand",
        html: `<ol>
<li>Find your passport's <strong>expiry date</strong> and, for Europe, its <strong>issue date</strong>.</li>
<li>Count forward six months from your planned <strong>arrival</strong> date. If your passport expires before that, treat it as a problem.</li>
<li>Check the destination's own rule on your <a href="/countries">destination guide</a> and confirm it on the country's official immigration site.</li>
<li>If you are close to the line, renew before booking anything non-refundable. Renewal is far cheaper than a missed flight.</li>
</ol>
<p>Also worth checking at the same time: whether you need a visa at all. Our <a href="/">free visa checker</a> gives you the requirement for your exact passport and destination in one step.</p>`,
      },
    ],
    faqs: [
      { q: "Is the six-month passport rule counted from arrival or departure?", a: "For most countries that apply it, the six months are counted from your date of arrival, not the date you leave. The Schengen Area is different: it requires three months of validity beyond your intended departure from the Schengen Area." },
      { q: "Can an airline refuse to board me even if the country would let me in?", a: "Yes. Airlines are fined for carrying passengers who are refused entry, so they enforce document rules themselves and sometimes more strictly than the border. Most passport-validity refusals happen at check-in." },
      { q: "My passport is valid but was issued more than ten years ago. Is that a problem?", a: "For the Schengen Area, yes. Your passport must have been issued within the previous ten years as well as being valid three months beyond departure. This affects passports that had extra months carried over from a previous document." },
      { q: "Do I need blank pages as well as validity?", a: "Often, yes. The Schengen Area requires at least two blank pages, and many other countries expect one or two for stamps or visas. A passport that is full can be refused even when the expiry date is fine." },
      { q: "What should I do if my passport is close to the limit?", a: "Renew before booking non-refundable travel. If you have already booked, check the destination's official immigration website and your airline's document policy, and allow time for renewal — processing can take weeks." },
    ],
  },
  {
    kind: "article",
    slug: "visa-validity-vs-duration-of-stay",
    title: "Visa Validity vs Duration of Stay — The Difference That Causes Overstays",
    description: "A visa valid for a year does not let you stay a year. The difference between visa validity and permitted duration of stay, explained with examples — and how to read your visa correctly.",
    h1: "Visa validity vs duration of stay",
    intro:
      "This is the single most misunderstood thing on a visa, and misunderstanding it is one of the most common ways ordinary travellers end up overstaying. A visa that is 'valid for one year' almost never means you may stay for one year. The two dates do completely different jobs.",
    sections: [
      {
        h2: "The two things your visa is telling you",
        html: `<p>Nearly every visa carries two separate limits, and you have to satisfy both:</p>
<ul>
<li><strong>Validity</strong> — the window during which you may <em>arrive</em>. A visa valid from 1 March to 28 February is telling you when you can turn up at the border. It says nothing about how long you may remain.</li>
<li><strong>Duration of stay</strong> — how many days you may <em>remain</em> per visit once admitted. This is the number that matters for booking a return flight.</li>
</ul>
<p>So a one-year visa with a 30-day duration of stay means: you may enter at any point during that year, and each time you do, you may stay up to 30 days.</p>`,
      },
      {
        h2: "A worked example",
        html: `<p>Take a visa issued on 1 March 2026, valid twelve months, with a 30-day duration of stay:</p>
<ul>
<li>You arrive on 15 January 2027 — allowed, because that is inside the validity window.</li>
<li>You may then stay until roughly 13 February 2027 — 30 days — <strong>even though the visa expires on 28 February</strong>.</li>
<li>You may <strong>not</strong> stay until 28 February just because that is the expiry date printed on the visa. That misreading is exactly what produces an overstay.</li>
</ul>
<p>Note also that the permitted stay usually runs from the date you were <em>admitted</em>, which is stamped in your passport — not from the date the visa was issued.</p>`,
      },
      {
        h2: "Where the real number is written",
        html: `<p>The duration of stay may appear on the visa itself, or it may be decided by the border officer and written into your entry stamp or arrival record. When the two differ, <strong>the officer's decision governs</strong>. Photograph your entry stamp when you arrive: it is the document that determines your legal departure date, and it is easy to misremember weeks later.</p>
<p>Visa-free entry works the same way. There is no visa document at all, but there is still a maximum permitted stay — and it varies enormously by nationality and destination. You can see the permitted stay for your exact combination on any of our <a href="/visa-requirements">passport guides</a>.</p>`,
      },
      {
        h2: "Rolling limits: the other trap",
        html: `<p>Some regions cap your total time rather than each individual visit. The best-known is the Schengen Area's 90/180 rule: no more than 90 days inside any rolling 180-day period, across all Schengen countries combined. Several other countries apply similar annual caps.</p>
<p>Under a rolling rule, leaving and re-entering does not reset the clock — which is precisely why frequent travellers get caught. If Europe is in your plans, our <a href="/schengen">Schengen 90/180 calculator</a> works out your used and remaining days from your actual trip dates.</p>`,
      },
      {
        h2: "Why overstaying matters more than people expect",
        html: `<p>An overstay is not usually a fine-and-forget matter. Depending on the country it can mean a financial penalty on departure, a formal removal record, or a re-entry ban lasting years — and it is the kind of thing that surfaces later in unrelated visa applications, because many countries ask whether you have ever overstayed or been refused entry.</p>
<p>Check your permitted stay before you book a return flight, not after.</p>`,
      },
    ],
    faqs: [
      { q: "My visa is valid for a year. Can I stay for a year?", a: "Almost certainly not. Validity is the window in which you may arrive; duration of stay is how long you may remain per visit. A one-year visa with a 30-day stay allows entry at any point in the year, but only 30 days per visit." },
      { q: "Does the permitted stay run from the visa issue date or from arrival?", a: "From admission. Your permitted stay normally starts on the date you were admitted, which is recorded in your entry stamp or arrival record — not the date the visa was issued." },
      { q: "What if my visa and my entry stamp show different periods?", a: "The border officer's decision, recorded in your stamp or arrival record, governs how long you may remain. Photograph your stamp on arrival so you can check the exact date later." },
      { q: "Does leaving and coming back reset my allowance?", a: "Not where a rolling limit applies. The Schengen Area allows 90 days in any rolling 180-day period across all member countries combined, so a short exit does not reset the count. Other countries operate similar annual caps." },
      { q: "What happens if I overstay by a few days?", a: "It varies by country and is rarely trivial: possible fines on departure, a removal record, or a re-entry ban. Overstays can also affect future visa applications elsewhere, since many application forms ask about previous overstays or refusals." },
    ],
  },
  {
    kind: "article",
    slug: "proof-of-onward-travel",
    title: "Proof of Onward Travel — What Actually Counts (2026)",
    description: "Airlines and border officers routinely ask for proof you will leave. What qualifies as onward travel, what gets rejected, and the legitimate options if you don't have a return ticket yet.",
    h1: "Proof of onward travel: what actually counts",
    intro:
      "Being asked to show that you intend to leave is one of the most common reasons travellers are stopped at check-in — including travellers who need no visa at all. The requirement is real, it is enforced by airlines more often than by borders, and what satisfies it is narrower than most people assume.",
    sections: [
      {
        h2: "Why you are being asked",
        html: `<p>Countries hold airlines responsible for passengers who are refused entry: the airline must fly them back, and usually pays a fine. So airlines check, at check-in, whether you look admissible — and the simplest test is whether you have a ticket out.</p>
<p>This applies even where no visa is needed. Visa-free entry means you do not need a visa; it does not mean you will not be asked to prove your intentions.</p>`,
      },
      {
        h2: "What normally counts",
        html: `<ul>
<li><strong>A confirmed return flight</strong> to your home country, within the permitted stay.</li>
<li><strong>A confirmed onward flight</strong> to a third country, again within the permitted stay. It does not have to be home.</li>
<li><strong>A confirmed bus, train or ferry booking</strong> leaving the country, where land or sea exit is realistic. This is commonly accepted overland in regions like Southeast Asia and Europe, though airline staff vary in how readily they accept it.</li>
<li><strong>A residence permit or visa for another country</strong>, which shows where you are entitled to go next.</li>
</ul>
<p>The common thread is that the booking is <strong>confirmed, in your name, and dated inside your permitted stay</strong>.</p>`,
      },
      {
        h2: "What usually does not count",
        html: `<ul>
<li><strong>An unpaid reservation or a hold.</strong> If it is not ticketed, it can often be seen through.</li>
<li><strong>A one-way ticket plus an explanation.</strong> Intentions are not evidence.</li>
<li><strong>A booking dated after your permitted stay ends</strong> — that proves you plan to overstay, which is worse than having nothing.</li>
<li><strong>Screenshots that do not show a booking reference</strong>, passenger name and date.</li>
</ul>
<p>A specific warning: services that sell temporary or "rentable" tickets exist, and using one to satisfy an immigration requirement means presenting a document you know will be cancelled. That is a misrepresentation to a border authority, and the consequences if it is discovered — refusal, a removal record, questions on future applications — are far worse than the cost of a real ticket.</p>`,
      },
      {
        h2: "If you genuinely do not have onward travel yet",
        html: `<p>Legitimate options, roughly in order of reliability:</p>
<ol>
<li><strong>Buy a real, cheap, flexible onward ticket.</strong> A refundable or changeable fare on a budget route is the cleanest answer and is often inexpensive.</li>
<li><strong>Book a land or sea crossing</strong> if you are travelling overland anyway — usually cheap and genuine.</li>
<li><strong>Carry supporting evidence</strong>: a return ticket for a later leg, proof of residence or employment at home, or a visa for your next destination. This will not always substitute for a ticket, but it helps.</li>
<li><strong>Check the destination's actual rule first.</strong> Requirements differ — our <a href="/countries">destination guides</a> show whether a return or onward ticket is expected for each country, alongside proof-of-funds expectations.</li>
</ol>`,
      },
      {
        h2: "Related things you may be asked for",
        html: `<p>Onward travel is rarely the only question. Border officers commonly also ask for accommodation details and evidence you can support yourself. Both are listed per country in our <a href="/countries">entry-requirement guides</a>, and if you are still working out whether you need a visa in the first place, the <a href="/">visa checker</a> answers that for your exact passport and destination.</p>`,
      },
    ],
    faqs: [
      { q: "Do I need proof of onward travel even for visa-free entry?", a: "Often, yes. Visa-free means you do not need a visa; you may still be asked to show a ticket out. Airlines check at boarding because they are fined for carrying passengers who are refused entry." },
      { q: "Does a bus or train ticket count as onward travel?", a: "Frequently yes, where leaving overland is realistic — for example within Europe or Southeast Asia. It must be a confirmed booking in your name, dated within your permitted stay. Acceptance varies between airlines." },
      { q: "Can I show a ticket dated after my permitted stay ends?", a: "No — that actively works against you, because it shows an intention to stay longer than allowed. Your onward booking should fall inside the permitted stay for your nationality and destination." },
      { q: "Are 'rented' or temporary onward tickets a good idea?", a: "No. Presenting a booking you know will be cancelled is a misrepresentation to a border authority. If it is discovered, the outcome — refusal of entry, a removal record, and disclosure obligations on future visa applications — is far costlier than buying a genuine cheap ticket." },
      { q: "Who actually checks — the airline or immigration?", a: "Both can, but in practice the airline checks first, at check-in, because it carries the financial penalty for inadmissible passengers. Most refusals happen there rather than at the border." },
    ],
  },
  {
    kind: "article",
    slug: "single-entry-vs-multiple-entry-visas",
    title: "Single-Entry vs Multiple-Entry Visas — What the Difference Means",
    description: "A single-entry visa is used up the moment you leave — including for a day trip next door. How entries work, why side trips catch people out, and what to check before you travel.",
    h1: "Single-entry vs multiple-entry visas",
    intro:
      "The number of entries on your visa decides how many separate times you may cross into the country. It is easy to overlook, and the classic way to discover it is a day trip to a neighbouring country that quietly consumes your only entry, leaving you unable to get back in.",
    sections: [
      {
        h2: "What each type allows",
        html: `<ul>
<li><strong>Single entry.</strong> You may enter once. The moment you leave the country, the visa is spent — even if it is still within its validity window and even if you were only away for an afternoon.</li>
<li><strong>Double entry.</strong> Two separate entries, on the same principle.</li>
<li><strong>Multiple entry.</strong> Unlimited entries during the validity window, each capped by the permitted duration of stay.</li>
</ul>
<p>On the visa itself this is usually shown as "Entries: 1", "01", "MULT" or similar.</p>`,
      },
      {
        h2: "The side-trip trap",
        html: `<p>The common scenario: you hold a single-entry visa, take a short trip to a neighbouring country mid-holiday, and are then refused re-entry — because your one entry was used when you first arrived and consumed when you left. Your visa may still show months of validity; it makes no difference.</p>
<p>The same logic applies to a cruise stop, a border-town excursion, or a cheap flight to a nearby city. If your plans involve leaving and returning, you need multiple entry.</p>`,
      },
      {
        h2: "Where region-wide areas differ",
        html: `<p>Some regions treat several countries as a single space for entry purposes. A Schengen visa is the clearest example: moving between Schengen countries is not normally treated as leaving and re-entering, so internal travel does not consume entries. Leaving the Schengen Area entirely does.</p>
<p>Do not generalise this. Most of the world does not work that way, and neighbouring countries usually count as separate entries.</p>`,
      },
      {
        h2: "What to check before you go",
        html: `<ol>
<li><strong>The entries field</strong> on your visa — one, two, or multiple.</li>
<li><strong>Whether your itinerary leaves and returns</strong>, including short hops and cruises.</li>
<li><strong>The duration of stay</strong>, which is a separate limit that applies to <em>each</em> entry — see our guide to <a href="/guides/visa-validity-vs-duration-of-stay">visa validity versus duration of stay</a>.</li>
<li><strong>Whether you need a visa for the side trip too</strong>. You can check any pairing with our <a href="/">visa checker</a>.</li>
</ol>
<p>If your visa is single entry and your plans change, apply for a new visa before leaving rather than hoping to be re-admitted at the border.</p>`,
      },
    ],
    faqs: [
      { q: "Does a day trip really use up a single-entry visa?", a: "Yes. A single-entry visa is consumed when you leave the country, however briefly you were away. Returning requires a new visa unless you hold multiple entry." },
      { q: "Does travelling between Schengen countries use an entry?", a: "No. The Schengen Area is generally treated as a single space for entry purposes, so moving between member countries does not normally count as leaving and re-entering. Leaving the Schengen Area entirely does." },
      { q: "Is multiple entry the same as being allowed to stay longer?", a: "No. Entries and duration of stay are separate limits. A multiple-entry visa may still restrict each visit to, say, 30 days, and some countries also cap your total days per year." },
      { q: "Where do I find the number of entries on my visa?", a: "Look for a field labelled entries, number of entries, or similar — commonly shown as 1, 2 or MULT. If it is unclear, check with the issuing embassy before travelling rather than at the border." },
    ],
  },
  {
    kind: "article",
    slug: "can-i-leave-the-airport-during-a-layover",
    title: "Can I Leave the Airport During a Layover? (2026)",
    description: "Whether you can leave the airport on a layover depends on the country, not your ticket. How transit rules work, which countries make it easy, and where you need a visa just to connect.",
    h1: "Can I leave the airport during a layover?",
    intro:
      "Sometimes yes, sometimes no, and occasionally you need permission just to stay inside the terminal. It depends on the country you are connecting through, your nationality, and whether that country operates an international transit area at all — not on how long your layover is or which airline you booked.",
    sections: [
      {
        h2: "The two questions that decide it",
        html: `<p>Every layover comes down to two separate questions, and people usually only think about the second:</p>
<ol>
<li><strong>Can you stay airside without clearing immigration?</strong> In most countries, yes — there is an international transit area and you never formally enter. But a few countries have no such area at all, so every passenger is legally admitted.</li>
<li><strong>Can you leave the airport?</strong> That means entering the country properly, so it needs whatever entry permission your nationality requires — visa-free entry, a visa on arrival, an eVisa, or a full visa.</li>
</ol>`,
      },
      {
        h2: "The countries that surprise people",
        html: `<p>Two cases catch travellers out repeatedly:</p>
<ul>
<li><strong>The United States has no international transit zone.</strong> Everyone clears immigration, even on a two-hour connection you never intend to leave. That means an ESTA or a visa is required simply to change planes, and you collect and re-check your bags. Full detail in our <a href="/transit-visa/united-states">US transit guide</a>.</li>
<li><strong>Some nationalities need a visa purely to sit airside in Europe.</strong> The Schengen Airport Transit Visa applies to a specific list of nationalities and is required even without leaving the transit area — see the <a href="/transit-visa/schengen-area">Schengen transit guide</a> for who is on it.</li>
</ul>`,
      },
      {
        h2: "Where a layover is worth leaving the airport",
        html: `<p>Several major hubs actively encourage stopovers, and a few will even show you the city:</p>
<ul>
<li><a href="/transit-visa/china">China</a> — a 240-hour (10-day) visa-free transit scheme for around 55 nationalities, which replaced the older 72/144-hour rules.</li>
<li><a href="/transit-visa/qatar">Qatar</a> — a free transit visa of up to 96 hours, though it is tied to flying Qatar Airways on both legs.</li>
<li><a href="/transit-visa/turkey">Türkiye</a> — Turkish Airlines runs free guided Istanbul tours for passengers with a 6–24 hour layover.</li>
<li><a href="/transit-visa/united-arab-emirates">UAE</a> — 48-hour transit visas are issued free of government charge; the 96-hour version is not free.</li>
<li><a href="/transit-visa/singapore">Singapore</a> — a Visa Free Transit Facility of up to 96 hours, but with narrower eligibility than most people assume.</li>
</ul>`,
      },
      {
        h2: "How to work out your own case",
        html: `<ol>
<li><strong>Identify the country you connect through</strong> — not your destination. The transit country's rules are what matter.</li>
<li><strong>Read that country's transit guide</strong> in our <a href="/transit-visa">transit visa section</a>, which covers all twelve major connecting hubs.</li>
<li><strong>Check whether you need entry permission</strong> for that country with our <a href="/">visa checker</a>, treating the transit country as your destination.</li>
<li><strong>Leave enough time.</strong> If you must clear immigration, collect bags and re-check them, a connection that looks generous on paper can be tight.</li>
</ol>`,
      },
    ],
    faqs: [
      { q: "Do I need a visa if I never leave the airport?", a: "Usually not, but there are important exceptions. The United States has no international transit zone, so everyone clears immigration and needs an ESTA or visa even for a short connection. Some nationalities also need an Airport Transit Visa to remain airside in the Schengen Area." },
      { q: "Does a long layover automatically let me leave the airport?", a: "No. Leaving means formally entering the country, so it depends on your nationality's entry requirements for that country, not on the length of your layover." },
      { q: "Which countries make it easiest to leave during a layover?", a: "China's 240-hour visa-free transit, Qatar's free 96-hour transit visa, the UAE's free 48-hour transit visa and Singapore's Visa Free Transit Facility are among the most generous, though each has its own eligibility conditions." },
      { q: "Do I need to collect my bags during a layover?", a: "It depends on the airport and whether your bags were checked through. Where you must clear immigration — the United States being the clearest example — you normally collect and re-check them, which takes significant time." },
    ],
  },
  {
    kind: "article",
    slug: "visa-on-arrival-vs-evisa-vs-eta",
    title: "Visa on Arrival vs eVisa vs ETA — What's the Difference? (2026)",
    description:
      "Confused by visa on arrival, eVisa and ETA/ETIAS? A clear, practical explainer of how each travel authorisation works, when you apply, what it costs and how they differ — with examples.",
    h1: "Visa on arrival vs eVisa vs ETA: what's the difference?",
    intro:
      "\"Visa-free\", \"visa on arrival\", \"eVisa\" and \"ETA\" get used interchangeably, but they are not the same thing — and mixing them up can mean being turned away at check-in. Here is exactly what each one means, when you apply, and how to tell which applies to your trip.",
    sections: [
      {
        h2: "Visa-free entry",
        html: "<p>With genuine visa-free access, you need <strong>no advance authorisation at all</strong> — you arrive with a valid passport and are admitted (subject to normal border checks). This is the simplest category, but it still comes with a maximum permitted stay and the usual expectations: a passport valid for the required period, and sometimes proof of onward travel or funds.</p>",
      },
      {
        h2: "Visa on arrival (VoA)",
        html: "<p>A visa on arrival is issued <strong>when you land</strong>, at a dedicated counter in the airport or at a land border. You typically fill in a form and pay a fee in cash (often USD) or by card. Because it is granted at the border, there is a small risk of queues or refusal, and some VoA schemes require a prior online registration even though the visa itself is issued on arrival. Always carry a printed hotel booking, return ticket and the exact fee.</p>",
      },
      {
        h2: "eVisa (electronic visa)",
        html: "<p>An eVisa is a real visa that you <strong>apply and pay for online before you travel</strong>. You upload your details (and often a photo and passport scan), pay, and receive an approval by email — usually within a few days, though some take longer. You must apply in good time: unlike a visa on arrival, you cannot get an eVisa at the airport. Print or save the approval; airlines check it at boarding.</p>",
      },
      {
        h2: "ETA / ETIAS (travel authorisation)",
        html: "<p>An ETA (Electronic Travel Authorisation) — and Europe's forthcoming <strong>ETIAS</strong> — is <em>not</em> a visa. It is a lighter-weight, mostly automated pre-screening for travellers who are otherwise visa-free. You apply online, pay a small fee, and approval is usually quick. Examples include the US ESTA, Canada's eTA, the UK ETA and, from late 2026, ETIAS for the Schengen Area. You still need one before boarding, even though your nationality is \"visa-free\".</p>",
      },
      {
        h2: "How to tell which one applies to you",
        html: "<p>The category depends on the combination of <strong>your passport and your destination</strong> — there is no single global rule. Check your exact pairing on the destination's official immigration site, or use our free checker for an instant answer, then confirm the details before booking.</p>",
      },
    ],
    faqs: [
      { q: "Is an ETA the same as a visa?", a: "No. An ETA (or ETIAS) is a travel authorisation for people who are already visa-exempt — a quick, mostly automated online pre-clearance. A visa (including an eVisa) is a formal permission that involves more documentation and, usually, a higher fee." },
      { q: "Can I get an eVisa at the airport?", a: "No. An eVisa must be applied for and approved online before you travel. If you need a visa on the spot, that is a visa on arrival — a different scheme that not every country offers." },
      { q: "Which is faster, a visa on arrival or an eVisa?", a: "A visa on arrival is issued the moment you land but can involve queues and cash payment; an eVisa is arranged in advance so entry is smoother, but you must apply early enough to receive approval before departure." },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
