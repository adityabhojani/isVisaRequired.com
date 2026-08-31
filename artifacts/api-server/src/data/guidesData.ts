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
