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
    slug: "do-children-need-their-own-visa",
    title: "Do Babies and Children Need Their Own Visa? (2026)",
    description: "Yes — including a lap infant who pays no fare. Travel authorisations attach to a passport, not to a family. What each scheme requires for children, and the passport-validity trap parents miss.",
    h1: "Do babies and children need their own visa?",
    intro:
      "The answer is structural and it applies to every nationality at once: a visa or travel authorisation attaches to a <em>travel document</em>, not to a family. If your child holds their own passport, your child needs their own authorisation — including the lap infant who paid no fare. What varies is only the paperwork, the fee and the biometrics.",
    sections: [
      {
        h2: "One traveller, one authorisation",
        html: `<p>Every major electronic scheme says this in its own words, and none of them makes an exception for age:</p>
<ul>
<li><strong>ESTA (United States)</strong> — CBP states that accompanied and unaccompanied children, regardless of age, are required to have their own ESTA approval, and adds that <em>"even non-ticketed infants are required to have an approved travel authorization"</em> if they do not hold a visa.</li>
<li><strong>UK ETA</strong> — GOV.UK is blunt: <em>"Each person travelling needs an ETA, including babies and children."</em></li>
<li><strong>Canada eTA</strong> — IRCC states that all eTA-required travellers, regardless of their age, need an eTA, and that to apply for your child you must submit a separate application form.</li>
<li><strong>Australia ETA (subclass 601)</strong> — the Department of Home Affairs states you cannot include family members in your application, and that each family member <em>"including those listed on your passport, must submit a separate application"</em>.</li>
<li><strong>ETIAS (Europe)</strong> — Article 17(1) of Regulation (EU) 2018/1240 requires each applicant to submit a completed application form, with a minor's form signed electronically by a person holding parental authority or guardianship.</li>
</ul>
<p>So the count is simple: passports in the family, authorisations needed.</p>`,
      },
      {
        h2: "But you can usually do the paperwork together",
        html: `<p>A common misreading of the above is that every application must be filed separately, one at a time. That is not right either, and it matters when you are filling in five forms at midnight.</p>
<p>ESTA allows a group submission — CBP states the system <em>"allows for one payment for a group of two or more applications submitted at the same time"</em>, and notes the people in the group are not required to travel together. ETIAS expressly permits someone else to file on the applicant's behalf: Article 15(4) of Regulation (EU) 2018/1240 allows applications to be submitted <em>"by the applicant or by a person or a commercial intermediary authorised by the applicant"</em>. GOV.UK simply says <em>"You can apply for other people."</em></p>
<p>Canada is the outlier in the other direction: IRCC states you can only apply and pay for one person at a time.</p>
<p>The distinction to hold on to is this: <strong>the paperwork can often be batched, but the outcome never is.</strong> No scheme issues one authorisation covering several people. Each traveller still receives their own, tied to their own passport.</p>`,
      },
      {
        h2: "If your child is listed on your passport",
        html: `<p>Older passports sometimes endorsed children on a parent's book. Where that is still the case, it does not help — it actively hurts.</p>
<p>CBP states that children listed on their parents' passports do not qualify for ESTA and must have their own unexpired passport. Australia, as above, requires a separate application from each family member <em>including those listed on your passport</em>.</p>
<p>Within the EU the practice has been legislated away: Regulation (EC) No 444/2009 amended the passport standards so that passports and travel documents <em>"shall be issued as individual documents"</em>, a principle its recital calls "one person-one passport" and records as also being recommended by ICAO. If your family travels on EU passports, each child already has their own book.</p>
<p>We have not verified that every country in the world has done the same, so we will not claim it. The practical rule stands regardless: if your child does not have their own passport, that is the first thing to fix.</p>`,
      },
      {
        h2: "The trap parents actually hit: shorter passports",
        html: `<p>This is the one that catches families at the airport, and it is a consequence of a rule nobody thinks to apply to a toddler.</p>
<p>Children's passports are issued for shorter terms. The period is set by the issuing country, not by any international standard:</p>
<ul>
<li><strong>United States</strong> — 22 CFR 51.4 provides that a passport issued to an applicant under 16 is valid for <strong>five years</strong>, against ten for applicants 16 or older.</li>
<li><strong>United Kingdom</strong> — GOV.UK: a child passport is valid for <strong>five years</strong>, with adult procedure from age 16.</li>
<li><strong>Canada</strong> — a child passport is valid for a maximum of <strong>five years</strong>, and stays valid to its expiry date even after the child turns 16.</li>
<li><strong>Australia</strong> — the Australian Passport Office issues passports valid up to <strong>five years</strong> for children aged 0 to 15, and up to ten years for those aged 16 or 17.</li>
</ul>
<p>Now combine that with entry rules. The Schengen Borders Code (Regulation (EU) 2016/399, Article 6) requires a travel document valid at least three months beyond intended departure and issued within the previous ten years — and there is <strong>no age exemption</strong> anywhere in that article, because the condition attaches to the document. Many other countries apply a six-month rule the same way.</p>
<p>A five-year book runs out of runway far sooner than yours. Check the child's expiry date first, not last — see <a href="/guides/six-month-passport-rule">the six-month passport rule</a> for how the arithmetic works.</p>`,
      },
      {
        h2: "Fees: two European schemes discount by age, the rest do not",
        html: `<p>Age concessions exist, but only in Europe, and only in two places.</p>
<p><strong>ETIAS</strong> waives its fee for applicants under 18 and over 70 at the time of application — Article 18(2) of Regulation (EU) 2018/1240. For a <strong>Schengen visa</strong>, Article 16 of the Visa Code waives the fee for children under six, and sets a reduced rate for children from six to under twelve.</p>
<p>ESTA, the UK ETA, the Canada eTA and the Australian ETA publish no age concession — a baby costs the same as an adult.</p>
<p>We deliberately publish no amounts here. Fees change, and several currently circulating figures are already out of date. Check the official portal for the current price before you pay.</p>`,
      },
      {
        h2: "Biometrics: four authorities, four different ages",
        html: `<p>There is no single children's biometric exemption, and assuming one will surprise you at an appointment:</p>
<ul>
<li><strong>EU Entry/Exit System</strong> — Regulation (EU) 2017/2226, Article 17(3): <em>"Children under the age of 12 shall be exempt from the requirement to give fingerprints."</em> Note this is a fingerprint exemption only; nothing exempts any age group from the facial image, so an infant is still photographed.</li>
<li><strong>Schengen visa</strong> — Visa Code Article 13(7) exempts children under 12 from giving fingerprints.</li>
<li><strong>United Kingdom</strong> — Home Office guidance states children under five are exempt from fingerprints but must still provide a digitised facial image.</li>
<li><strong>United States</strong> — the long-standing under-14 concession has been withdrawn. US Mission guidance states that since 2 September 2025, applicants under 14 and over 80 are not exempt and must attend in person.</li>
</ul>
<p>If you are planning around an appointment, check the specific authority's current rule rather than a number you remember.</p>`,
      },
      {
        h2: "A checklist before you book",
        html: `<ol>
<li><strong>Does each child hold their own passport?</strong> If not, that comes first.</li>
<li><strong>Check each child's expiry date</strong> against the destination's validity rule — the five-year book is the usual problem.</li>
<li><strong>Count authorisations by passport, not by adult.</strong> Infants included.</li>
<li><strong>Batch the paperwork where the scheme allows it</strong>, but expect a separate approval per child.</li>
<li><strong>Check whether the child must attend in person</strong> for biometrics before you assume it is a parent-only errand.</li>
</ol>
<p>Then run the family's actual pairing through the <a href="/">visa checker</a> — the per-destination requirement for a child is the same as the adult's, so one check covers everyone holding that nationality.</p>`,
      },
    ],
    faqs: [
      { q: "Do babies need their own visa or travel authorisation?", a: "Yes. CBP states that even non-ticketed infants require an approved travel authorisation if they do not hold a visa, and GOV.UK states each person travelling needs an ETA, including babies and children. Authorisations attach to a passport, not to a family." },
      { q: "Can I add my children to my own ESTA or ETA application?", a: "No scheme issues one authorisation covering several people. Some do let you batch the paperwork: CBP allows one payment for a group of applications submitted together, ETIAS allows a third party to submit on an applicant's behalf, and GOV.UK says you can apply for other people. Canada requires one application at a time." },
      { q: "My child is listed on my passport — is that enough?", a: "No, and it can disqualify them. CBP states children listed on a parent's passport do not qualify for ESTA and must have their own unexpired passport, and Australia requires a separate application from each family member including those listed on your passport." },
      { q: "How long is a child's passport valid?", a: "Shorter than an adult's, and it is set by the issuing country. Five years is typical for young children in the US (22 CFR 51.4), the UK, Canada and Australia — against ten years for adults. That shorter term is what usually trips families up against validity rules." },
      { q: "Do children pay a reduced visa fee?", a: "Only in two European schemes. ETIAS waives its fee for applicants under 18 under Article 18 of Regulation (EU) 2018/1240, and the Schengen Visa Code waives it for children under six with a reduced rate to age twelve. ESTA, the UK ETA, the Canada eTA and the Australian ETA publish no age concession." },
      { q: "Do children have to give fingerprints?", a: "It depends entirely on the authority. The EU Entry/Exit System and the Schengen visa exempt under-12s from fingerprints but not from a facial image; the UK exempts under-5s from fingerprints only; and the US withdrew its under-14 concession from 2 September 2025." },
    ],
  },
  {
    kind: "article",
    slug: "how-early-to-apply-for-a-visa",
    title: "How Early Should You Apply for a Visa — and Can You Apply Too Early?",
    description: "Yes, you can apply too early. There are two clocks: the earliest date a country lets you lodge, and a validity clock that for many e-visas starts at approval rather than arrival.",
    h1: "How early should you apply for a visa — and can you apply too early?",
    intro:
      "Almost everyone asks the first half of this question and almost nobody asks the second. You can indeed apply too early — because for a large number of schemes the validity clock starts when the authorisation is <em>granted</em>, not when you land. Get that wrong and an approval you were proud of expires before your trip.",
    sections: [
      {
        h2: "There are two clocks, not one",
        html: `<p><strong>Clock one — the lodgement window.</strong> How early the issuing state will accept an application at all. Some publish a hard limit; some publish none.</p>
<p><strong>Clock two — the validity window.</strong> When the thing you are granted starts and stops counting. For a traditional embassy visa this usually runs from a date printed on the visa. For many electronic authorisations, it runs from <em>approval</em>.</p>
<p>Applying early is free when only clock one exists. It is expensive when clock two starts at grant, because every week you gain in reassurance is a week you lose off the far end. See <a href="/guides/visa-validity-vs-duration-of-stay">visa validity vs duration of stay</a> for why these two are so often confused.</p>`,
      },
      {
        h2: "How early each system lets you lodge",
        html: `<ul>
<li><strong>Schengen</strong> — Article 9(1) of the Visa Code (Regulation (EC) No 810/2009, as amended) sets both ends: applications <em>"shall be lodged no more than six months ... before the start of the intended visit, and, as a rule, no later than 15 calendar days before"</em> it. Seafarers on duty may lodge up to nine months ahead, and a consulate may accept a later application in justified cases of urgency. If you have seen "three months" quoted, that is the superseded pre-2020 wording.</li>
<li><strong>United Kingdom (Standard Visitor)</strong> — GOV.UK: <em>"The earliest you can apply is 3 months before you travel."</em></li>
<li><strong>United States (B1/B2)</strong> — no maximum lead time is published. US Mission guidance is simply to apply as soon as you know you will travel. The binding constraint is the interview appointment calendar, which differs by post.</li>
<li><strong>India e-Visa</strong> — the Bureau of Immigration's portal states an application may be made a minimum of four days in advance and up to <strong>120 days</strong> ahead of the proposed date of travel.</li>
<li><strong>ESTA</strong> — CBP states applications may be submitted at any time prior to travel, and recommends applying as soon as you begin planning or before buying tickets.</li>
</ul>
<p>Note that "no published limit" is not the same as "no limit". It means no authority has committed to one, so do not build a plan around a number nobody published.</p>`,
      },
      {
        h2: "The clock that starts at grant",
        html: `<p>This is the half that costs people money, and the examples are unambiguous:</p>
<ul>
<li><strong>ESTA</strong> — the official site states authorisations are <em>"valid for two years from the date of authorization, or until your passport expires, whichever comes first"</em>. Approve it eighteen months before a trip and you have six months of cover left.</li>
<li><strong>India e-Tourist Visa (1-year and 5-year) and e-Business Visa</strong> — validity runs <em>"from the date of grant"</em>. The 30-day e-Tourist Visa behaves differently: it runs 30 days from first arrival, but your first arrival must fall between issue and expiry, so an issue-anchored outer window still applies. The e-Medical, e-Medical Attendant and e-Conference visas run from arrival. Never treat "the India e-Visa" as one thing.</li>
<li><strong>Canada eTA</strong> — valid up to five years or until the passport expires, whichever comes first.</li>
<li><strong>UK ETA</strong> — GOV.UK: <em>"An ETA lasts for 2 years or until your passport expires, whichever is sooner."</em></li>
</ul>
<p>All of these are also tied to the passport you applied with, which is a second way to lose them early — see <a href="/guides/new-passport-old-visa">what a passport renewal does to visas you already hold</a>.</p>`,
      },
      {
        h2: "ETIAS is not yet running",
        html: `<p>Because planners ask: the official EU site states that ETIAS <em>"is currently not in operation and no applications for travel authorisations are collected at this point"</em>, and that the EU will announce the start date several months before launch.</p>
<p>When it does launch, the published validity is three years or until the travel document used in the application expires, whichever comes first — so it will belong firmly in the clock-two group above. Until then, do not plan around an application window that does not exist, and treat any specific launch date you see elsewhere as unconfirmed.</p>`,
      },
      {
        h2: "Why we publish no processing times",
        html: `<p>You will find averages everywhere. They are close to useless, and the official sources show why: a single scheme's own published guidance can range from minutes to weeks depending on what the authority decides to ask you for, and authorities hedge their own numbers. Australia's Department of Home Affairs notes that its processing-time tool <em>"is a guide only and not specific to your application"</em>.</p>
<p>What actually determines your timing is three things, none of which is an average:</p>
<ol>
<li><strong>Whether the scheme has an earliest-lodgement date at all</strong> — that sets the front edge of your window.</li>
<li><strong>Whether an in-person appointment is required, and when the nearest post has one</strong> — this, not adjudication, is usually the long pole for embassy visas.</li>
<li><strong>Whether the authority comes back asking for more</strong> — a request for documents or an interview is what turns a same-day decision into a multi-week one.</li>
</ol>
<p>The single best piece of official advice on timing is Australia's, and it applies everywhere: <em>"We suggest you do not make travel arrangements until we grant your ETA."</em></p>`,
      },
      {
        h2: "Work backwards, in this order",
        html: `<ol>
<li><strong>Find out which kind of authorisation you need</strong> for your exact pairing with the <a href="/">visa checker</a>.</li>
<li><strong>Ask when its clock starts.</strong> If validity runs from grant, work back from your <em>return</em> date, not your departure date.</li>
<li><strong>Find the earliest lodgement date</strong> and treat it as the front edge — six months for Schengen, three for a UK Standard Visitor, 120 days for an India e-Visa.</li>
<li><strong>If an appointment is needed, book that first.</strong> It is the constraint you cannot influence.</li>
<li><strong>Do not book non-refundable travel until it is granted.</strong></li>
</ol>
<p>One last check worth doing at the same time: confirm your passport clears the destination's validity rule, since a renewal mid-process can invalidate an electronic authorisation you have just paid for.</p>`,
      },
    ],
    faqs: [
      { q: "Can you apply for a visa too early?", a: "Yes. Many electronic authorisations start counting from approval rather than arrival — ESTA is valid two years from the date of authorisation, and India's one-year and five-year e-Tourist visas run from the date of grant. Approving one far in advance burns the far end of the window." },
      { q: "How early can I apply for a Schengen visa?", a: "Article 9(1) of the Visa Code allows applications to be lodged no more than six months before the start of the intended visit, and as a rule no later than 15 calendar days before. Seafarers on duty may lodge up to nine months ahead. The widely quoted three-month figure is superseded pre-2020 wording." },
      { q: "How early can I apply for a UK Standard Visitor visa?", a: "GOV.UK states the earliest you can apply is three months before you travel. Note this is the Standard Visitor visa; the UK ETA is a separate scheme with no published earliest-apply limit." },
      { q: "Is there a limit on how early I can apply for a US visitor visa?", a: "No maximum lead time is published for a B1/B2 application. US Mission guidance is to apply as soon as you know you will travel. In practice the constraint is interview appointment availability, which varies by post." },
      { q: "How long does a visa take to process?", a: "There is no reliable general answer, and we publish no averages. Each authority publishes guidance only for its own scheme and hedges it — Australia notes its processing-time tool is a guide only and not specific to your application. Timing is driven by lodgement windows, appointment availability, and whether more documents are requested." },
      { q: "Can I apply for ETIAS yet?", a: "No. The official EU site states ETIAS is currently not in operation and no applications are being collected, and that the start date will be announced several months in advance." },
    ],
  },
  {
    kind: "article",
    slug: "visa-refused-what-happens-next",
    title: "Your Visa Was Refused. What Actually Happens Next",
    description: "No government sets a six-month waiting period before you can reapply. What a refusal actually is, how it differs from a ban, what each system lets you do, and what you must disclose later.",
    h1: "Your visa was refused. What actually happens next",
    intro:
      "The most repeated advice about visa refusals is that you must wait six months before trying again. No government sets that rule. Understanding what a refusal actually is — and what it is not — changes what you should do next, and it is usually not \"wait\".",
    sections: [
      {
        h2: "There is no mandatory waiting period",
        html: `<p>In the three systems people ask about most, the position is documented and consistent:</p>
<ul>
<li><strong>United States</strong> — the refusal notice text published by the US Mission to Türkiye states: <em>"Today's decision cannot be appealed. However, you may reapply at any time."</em> The US Embassy in Vietnam says the same, adding that new applications are adjudicated by a different consular officer.</li>
<li><strong>Schengen</strong> — Article 21(9) of the EU Visa Code provides that <em>"A previous visa refusal shall not lead to an automatic refusal of a new application. A new application shall be assessed on the basis of all available information."</em> The Visa Code sets no waiting period.</li>
<li><strong>United Kingdom</strong> — nothing on GOV.UK imposes a waiting period after a visitor visa refusal.</li>
</ul>
<p><strong>So where does "six months" come from?</strong> From advice, not law — and specifically from individual US consular posts. The US Embassy in Uzbekistan writes that you can reapply at any time provided your circumstances have changed, and then recommends waiting at least six months. Vietnam advises applicants with more than one recent refusal not to reapply unless circumstances have changed significantly.</p>
<p>Read those together and the real message appears: the same page that recommends waiting confirms your right to apply immediately. It is post-level guidance about your <em>odds</em>, not a rule about your <em>eligibility</em>.</p>`,
      },
      {
        h2: "A refusal is not a ban — keep three things apart",
        html: `<p>These get blurred constantly, and the differences are enormous:</p>
<ol>
<li><strong>A refusal</strong> closes one application. In the US, the ordinary nonimmigrant refusal is made under INA section 214(b); the US Embassy in Vietnam states such an application <em>"will not be reviewed or reconsidered; there is no appeal process. However, applicants are free to reapply at any time."</em></li>
<li><strong>An inadmissibility or misrepresentation finding</strong> is about the <em>person</em>, not the application. INA 212(a)(6)(C)(i) provides that anyone who <em>"by fraud or willfully misrepresenting a material fact"</em> seeks to procure a visa or admission is inadmissible. The US Embassy in Vietnam warns that an applicant caught concealing or misrepresenting facts may in certain cases be ruled permanently ineligible.</li>
<li><strong>An entry ban</strong> is a separate finding under a separate provision. It does not follow from an ordinary refusal.</li>
</ol>
<p>If you take one thing from this article: <strong>a refusal closes one application; it does not bar you from the country.</strong> We deliberately publish no ban durations — they arise under unrelated provisions with different triggers in every system, and none is triggered by a plain refusal.</p>`,
      },
      {
        h2: "What each system actually gives you",
        html: `<p><strong>Schengen — a written refusal and a real appeal right.</strong> Article 32(2) of the Visa Code requires the decision and its reasons to be notified using the standard form in Annex VI. Article 32(3) then provides that applicants <em>"shall have the right to appeal"</em>, conducted against the member state that took the final decision and under that state's national law.</p>
<p>The Annex VI form is headed "Standard form for notifying reasons for refusal, annulment or revocation of a visa", with the grounds as numbered tick-boxes. At its foot the consulate must fill in the competent appeal authority and the time limit. <strong>Read those boxes on your own form</strong> — the deadline, the fee and the procedure are set by national law and printed per applicant. There is no EU-wide deadline to quote, and the state that hears the appeal is the one that took the final decision, which is not always the one whose consulate you visited.</p>
<p><strong>United Kingdom — neither an appeal nor an administrative review.</strong> This is worth stating sharply, because getting it wrong costs money. Administrative review is only available on the routes listed at paragraph AR 1.1 of Appendix Administrative Review, and Appendix V: Visitor is not among them; AR 2.2 requires the decision to be on a listed route. Home Office guidance states that where no human rights claim has been made, the application is refused with no right of appeal and no right to seek administrative review. <strong>The remedy for a refused visitor is a fresh application.</strong></p>
<p><strong>United States — reapply, with something different.</strong> The Türkiye post sets out what that involves: a new application form and photo, the fee again, and a new interview.</p>`,
      },
      {
        h2: "Reapplying: the only question that matters",
        html: `<p>An identical file produces an identical outcome. A different officer looking at the same evidence usually reaches the same conclusion, which is why "just try again next month" is poor advice on its own.</p>
<p>The useful question is not <em>when</em> but <em>what has changed</em>. Concretely: has your employment, income, property, family situation or travel history changed in a way you can evidence? Has the trip itself changed — shorter, better documented, differently funded? Did the refusal identify a specific gap you can now close?</p>
<p>If nothing has changed, waiting six months changes nothing either. If something substantial has changed, there is no rule requiring you to wait for it to age.</p>`,
      },
      {
        h2: "What you have to disclose afterwards",
        html: `<p>Here the common wisdom is also wrong. There is no universal duty to declare every refusal to every country — the forms differ, and we verified three of them:</p>
<ul>
<li><strong>Canada asks about other countries.</strong> IRCC's Guide 5256 for the visitor visa asks the applicant to indicate whether they have ever been <em>"refused a visa or permit, denied entry or ordered to leave Canada or any other country or territory"</em>. This is the clearest case.</li>
<li><strong>The harmonised Schengen form does not ask at all.</strong> The application form in Annex I to the Visa Code runs to 29 numbered questions, none of which asks about a previous refusal. Individual member states run national portals that may ask more.</li>
<li><strong>ETIAS asks about removal, not refusal.</strong> Article 17(4) of Regulation (EU) 2018/1240 lists its additional questions exhaustively — certain criminal convictions, stays in war or conflict zones, and whether the applicant has been the subject of a decision requiring them to leave a member state. A refused visa is not on that list.</li>
</ul>
<p>The practical rule: <strong>answer the question actually printed on the form in front of you, exactly as worded, and answer it honestly.</strong> The risk of a wrong answer is not the refusal you are declaring — it is the misrepresentation finding in the section above, which is far more serious than the thing you were tempted to omit.</p>`,
      },
      {
        h2: "Will you get your fee back?",
        html: `<p>Generally no, but the wording differs by system in ways worth knowing. Australia's Home Affairs says it does <em>"not usually refund the visa application charge, even if your visa application is refused or withdrawn"</em> — note "usually", as it maintains an exceptions process. GOV.UK states flatly that you will not get a refund if your application is refused. On the Schengen form you sign a declaration acknowledging the fee is not refunded if the visa is refused.</p>
<p>We publish no fee amounts here; they change often. Check the issuing authority's own page for the current figure and its current refund policy before you apply again.</p>`,
      },
      {
        h2: "What to do this week",
        html: `<ol>
<li><strong>Read the refusal document itself</strong>, not a summary of it. If it is a Schengen Annex VI form, the tick-boxes tell you the ground and the foot of the form tells you your appeal route and deadline.</li>
<li><strong>Work out which of the three things happened</strong> — a refusal, an inadmissibility finding, or a ban. They need completely different responses.</li>
<li><strong>Identify what evidence was missing or unconvincing</strong>, and whether you can now change it.</li>
<li><strong>Check whether your route has a review path at all</strong> before paying for one.</li>
<li><strong>Reapply when your file is genuinely different</strong> — not on a calendar date someone invented.</li>
</ol>
<p>If your plans are flexible, it is also worth checking where your passport takes you without an application at all — try the <a href="/">visa checker</a>, or browse <a href="/countries">destinations by entry requirement</a>.</p>`,
      },
    ],
    faqs: [
      { q: "Do I have to wait six months to reapply after a visa refusal?", a: "No government sets that rule. US refusal notices state you may reapply at any time, the EU Visa Code says a previous refusal shall not lead to automatic refusal of a new application, and nothing on GOV.UK imposes a wait. The six-month figure comes from advice published by individual US consular posts, not from law." },
      { q: "Can I appeal a visa refusal?", a: "It depends entirely on the system. Schengen gives a documented right of appeal under Article 32(3) of the Visa Code, against the member state that took the final decision and under its national law. A US 214(b) refusal carries no appeal. A UK standard visitor refusal carries neither an appeal nor an administrative review." },
      { q: "Does a visa refusal mean I am banned from the country?", a: "No. A refusal closes one application. A ban is a separate finding under a separate provision and does not follow from an ordinary refusal. A misrepresentation finding is different again — under INA 212(a)(6)(C)(i) it attaches to the person rather than the application." },
      { q: "Do I have to declare a visa refusal on future applications?", a: "Only where the form asks, and they differ. Canada's visitor guide asks whether you have been refused a visa or denied entry by Canada or any other country. The harmonised Schengen form does not ask at all. ETIAS asks about removal decisions, not refusals. Answer the question as worded, and answer honestly." },
      { q: "Should I use administrative review after a UK visitor visa refusal?", a: "You cannot. Administrative review is only available on the routes listed at paragraph AR 1.1 of Appendix Administrative Review, and Appendix V: Visitor is not one of them. The remedy is to make a fresh application." },
      { q: "Will I get my visa fee back if I am refused?", a: "Generally not. Australia says it does not usually refund the charge even if the application is refused or withdrawn; GOV.UK says flatly that you will not get a refund; and the Schengen form has you sign a declaration acknowledging it. Check the current policy on the issuing authority's own page." },
    ],
  },
  {
    kind: "article",
    slug: "why-airlines-deny-boarding",
    title: "Why Airlines Refuse to Board You (And Why It Isn't the Border's Call)",
    description: "An airline can refuse to board you even when the destination would have let you in. Why check-in and immigration are two different decisions, what the agent is reading, and what to do at the desk.",
    h1: "Why airlines refuse to board you — and why it isn't the border's decision",
    intro:
      "Most travellers assume one authority decides whether they can fly: the country they are going to. In reality there are two decisions, made by two different parties, at two different moments — and the first one happens at the check-in desk, hours before any immigration officer sees you. Understanding the difference explains almost every story that begins \"but the embassy told me it was fine\".",
    sections: [
      {
        h2: "Two decisions, not one",
        html: `<p>The airline decides whether to <strong>carry</strong> you. The destination decides whether to <strong>admit</strong> you. They are separate judgements with separate rules, and the airline's comes first.</p>
<p>US Customs and Border Protection states the distinction plainly for its own pre-travel scheme: authorisation via ESTA <em>"does not determine whether a traveler is admissible to the United States"</em>, because CBP officers <em>"determine admissibility upon travelers' arrival"</em>. Clearance to board and permission to enter are simply not the same thing.</p>
<p>This is why a boarding refusal is <em>not</em> a finding that you would have been turned away. It is a commercial risk decision made by a company that pays if it guesses wrong.</p>`,
      },
      {
        h2: "Why the airline cares so much",
        html: `<p>If you are refused entry, the airline that brought you is generally the one that has to take you back — and it pays for it. That obligation is written into binding law, not airline policy.</p>
<p>In the EU, Council Directive 2001/51/EC supplements Article 26 of the Schengen Convention and requires that a carrier unable to return a refused traveller must <em>"find means of onward transportation immediately and to bear the cost thereof"</em>, and where that is not immediately possible, <em>"assume responsibility for the costs of the stay and return"</em>. The same duty appears in ICAO Annex 9 (Facilitation), Chapter 5, which governs how states and operators handle inadmissible persons.</p>
<p>On top of the return cost, national law adds penalties for carrying someone without the documents they needed:</p>
<ul>
<li><strong>United States</strong> — 8 U.S.C. § 1323 sets a fine of <strong>$3,000</strong> for each passenger brought without a valid passport and unexpired visa where one was required.</li>
<li><strong>United Kingdom</strong> — Home Office guidance states carriers may become liable for a charge of <strong>£2,000</strong> for every passenger arriving without a valid immigration document or the required visa, ETA or permission, under section 40 of the Immigration and Asylum Act 1999.</li>
<li><strong>European Union</strong> — Directive 2001/51/EC does not fine carriers itself; it sets floors national penalties must meet, including a maximum <em>"not less than EUR 5000"</em> per person or a lump sum <em>"not less that EUR 500000"</em> per infringement.</li>
</ul>
<p>Note what those penalties attach to: carrying a passenger <em>without the required documents</em>. That is a document test the airline can apply at a desk — which is exactly why the desk applies it strictly.</p>`,
      },
      {
        h2: "What the agent is actually looking at",
        html: `<p>The check-in agent is almost certainly not reading immigration law. They are reading a screen.</p>
<p>The industry standard is <strong>Timatic</strong>, which IATA describes as <em>"a leading provider of real-time information on travel document requirements for international air travel"</em>. IATA also sells <strong>Timatic AutoCheck</strong>, an API that automates the document check inside check-in and booking systems and which IATA says <em>"is already integrated with all other major Departure Control Systems"</em>.</p>
<p>So when an agent says "the system won't let me board you", that is usually literal. The consequence matters: you are arguing with a database entry, not with a person's reading of the rules — and the agent frequently cannot override it.</p>`,
      },
      {
        h2: "Why the airline can be stricter than the country itself",
        html: `<p>Because the risk is asymmetric. If the airline wrongly refuses you, it loses one fare. If it wrongly carries you, it pays the fine, the return flight, and sometimes your costs in the meantime.</p>
<p>UK Home Office guidance to carriers is explicit that <em>"the responsibility for deciding whether to carry the person rests with you as the carrying company in every case"</em> — and that even after seeking official advice, a carrier is <em>"not bound to act on the advice given"</em>. The airline owns the decision, so the airline sets its own tolerance.</p>
<p>The industry term for the outcome everyone is trying to avoid is an <strong>INAD</strong>. IATA adopts the ICAO definition: an inadmissible person is <em>"a person who is or will be refused admission to a State by its authorities"</em> — note that it turns on the destination's decision, not the airline's.</p>`,
      },
      {
        h2: "What to do at the desk when you think they're wrong",
        html: `<p>Arguing the general principle never works. Being specific sometimes does.</p>
<ol>
<li><strong>Ask which requirement you are failing.</strong> Not "why can't I fly" but "which document requirement is the system flagging?" You cannot fix an objection you cannot name.</li>
<li><strong>Produce the destination government's own page.</strong> Have it saved offline before you travel. A screenshot of an official immigration site is the only evidence likely to move a desk.</li>
<li><strong>Ask for a supervisor or the airline's document-check desk.</strong> Larger carriers have a team that can query the entry behind the screen.</li>
<li><strong>Accept that the airline's answer is final at that moment.</strong> There is no appeal before departure. If you are right, the remedy is a complaint and a refund claim afterwards — not the flight you are standing at.</li>
</ol>
<p>The far better strategy is not to arrive with a debatable case. Check your exact pairing with our <a href="/">visa checker</a>, and read the two rules that cause most refusals: <a href="/guides/six-month-passport-rule">the six-month passport rule</a> and <a href="/guides/proof-of-onward-travel">what counts as proof of onward travel</a>.</p>`,
      },
      {
        h2: "One thing that is not the airline's job",
        html: `<p>A common worry is that a visa which does not match your stated purpose will be caught at check-in. For a valid physical visa, that is generally not what the desk is checking. UK Home Office guidance tells carriers that in most cases <em>"you need not be concerned about the purpose for which the visa was issued, such as 'Visit' or 'Student'"</em>.</p>
<p>Purpose is assessed at the <strong>border</strong>, by an immigration officer, where admissibility is actually decided. Travelling on a visa that does not match what you intend to do is a real risk — just not usually a check-in one.</p>`,
      },
    ],
    faqs: [
      { q: "Can an airline refuse to board me even if I have a valid visa?", a: "Yes. The airline decides whether to carry you and the destination decides whether to admit you; those are separate decisions. UK Home Office guidance states the decision to carry rests with the carrier in every case, and that a carrier is not bound to follow official advice it seeks." },
      { q: "Why do airlines check visas at all?", a: "Because they carry the cost and the penalty. EU law requires a carrier to arrange and pay for a refused traveller's return, and national law adds fines — $3,000 per passenger under 8 U.S.C. § 1323 in the US, and £2,000 under UK Home Office charging guidance." },
      { q: "What system do airlines use to check travel documents?", a: "Most use Timatic, IATA's travel-document requirements database, often through Timatic AutoCheck — an API integrated into departure control systems. When an agent says the system will not let them board you, that is usually what they mean." },
      { q: "Does being denied boarding mean I would have been refused entry?", a: "No. It means the airline judged the risk unacceptable. Admissibility is decided by a border officer on arrival, and CBP states explicitly that pre-travel authorisation does not determine admissibility." },
      { q: "What is an INAD?", a: "Airline shorthand for an inadmissible passenger. IATA adopts the ICAO definition: a person who is or will be refused admission to a State by its authorities. Someone stopped at the gate and never flown is a different category." },
      { q: "What should I do if I am refused boarding and believe it is a mistake?", a: "Ask which specific requirement is being flagged, show the destination government's own published rule, and ask for a supervisor or the airline's document desk. There is no appeal before departure, so if you are right the remedy is a complaint and refund claim afterwards." },
    ],
  },
  {
    kind: "article",
    slug: "new-passport-old-visa",
    title: "I Renewed My Passport — Are My Visas Still Valid? (2026)",
    description: "A visa sticker in your old passport usually still works. An electronic authorisation like ESTA, eTA or ETIAS usually does not. The one distinction that explains what survives a passport renewal.",
    h1: "I renewed my passport — are my visas still valid?",
    intro:
      "One distinction answers almost every version of this question. A visa sticker is issued to <em>you</em> and stays usable in the old book. An electronic authorisation is bound to the <em>travel document</em> you applied with, and does not survive being replaced. Once you know which kind you hold, the rest follows.",
    sections: [
      {
        h2: "The rule in one line",
        html: `<p><strong>Stickers travel with the person. Electronic authorisations travel with the document.</strong></p>
<p>A physical visa in an expired passport is generally still usable — you simply carry both books. An ESTA, eTA, ETA or ETIAS approval is tied to the passport you applied with, so a new passport means a new application. Everything below is that principle applied scheme by scheme.</p>`,
      },
      {
        h2: "A visa sticker in an old passport",
        html: `<p>For the United States, a valid visa in an expired passport can still be used. The US Embassy's guidance is that you may travel with both passports <em>"as long as the visa is valid, not damaged, and is the appropriate type of visa required for"</em> your trip, and that both should be from the same country. You present the expired book containing the visa alongside your new valid passport.</p>
<p><strong>Do not remove the sticker.</strong> The same guidance is blunt: <em>"Do not try to remove the visa from your old passport and stick it into the new unexpired passport. If you do this, your visa will no longer be valid."</em> Cutting, peeling or transferring a visa destroys it. Leave it where it is.</p>
<p>Two practical cautions. First, some passport authorities cancel an old book by clipping or punching it, which can damage the visa page — cancellation methods differ by issuing country, so check with whoever issues your passport before handing it over. Second, this is the US rule; other countries have their own, so confirm with the destination before relying on it.</p>`,
      },
      {
        h2: "Electronic authorisations: what a new passport breaks",
        html: `<p>Each of these is linked to the document you applied with, and each has its own official wording:</p>
<ul>
<li><strong>ESTA (United States)</strong> — CBP requires an approved ESTA for the specific passport you plan to travel on, and states that travellers who acquire a new passport must submit a new ESTA application. A new application means paying the fee again.</li>
<li><strong>eTA (Canada)</strong> — IRCC states an eTA is <em>"electronically linked to a traveller's passport"</em>, is valid up to five years or until that passport expires, whichever comes first, and that <em>"if you get a new passport, you need to get a new eTA"</em>.</li>
<li><strong>ETA (United Kingdom)</strong> — GOV.UK states an ETA <em>"lasts for 2 years and is linked to your passport"</em>, and that <em>"if your passport has expired or changed, you'll need to apply for a new ETA"</em>. You must travel on the passport you applied with.</li>
<li><strong>ETIAS (Europe)</strong> — the official EU site states an ETIAS authorisation <em>"is linked to the travel document"</em> and that you must apply for a new one <em>"if you changed your travel document for any reason"</em>. It will be valid three years or until that document expires, whichever comes first. Note the EU's wording is "travel document", not "passport number".</li>
</ul>
<p>For background on how these schemes differ from visas, see <a href="/guides/visa-on-arrival-vs-evisa-vs-eta">visa on arrival vs eVisa vs ETA</a>, or the individual explainers under <a href="/travel-authorization">travel authorisations</a>.</p>`,
      },
      {
        h2: "Australia is the exception worth knowing",
        html: `<p>Australia does not treat all of its schemes the same way, and generalising here will get you the wrong answer.</p>
<p>For the <strong>Electronic Travel Authority (subclass 601)</strong>, Home Affairs states an existing ETA cannot be transferred to a new passport and you must apply for a new ETA using the new one.</p>
<p>For <strong>other Australian visas</strong> — including the eVisitor (subclass 651), which Home Affairs does not exclude from this process — you instead <strong>notify the department of your new passport details</strong> so the existing visa can be linked to the new document. You do not reapply.</p>
<p>So the honest summary is: check which Australian authorisation you actually hold, because one requires a fresh application and the other requires a form.</p>`,
      },
      {
        h2: "ETIAS is not yet running",
        html: `<p>Because this question comes up constantly: as things stand, the official EU site states that ETIAS <em>"is currently not in operation and no applications for travel authorisations are collected at this point"</em>, and that the EU will announce the specific start date in advance.</p>
<p>The European Commission has indicated a start in the last quarter of 2026, but no exact date has been announced and the timeline has moved more than once. Treat any specific launch date you see elsewhere as unconfirmed — and do not confuse ETIAS with the Entry/Exit System, which is a separate border-registration programme.</p>`,
      },
      {
        h2: "A checklist before you fly on a renewed passport",
        html: `<ol>
<li><strong>Sort what you hold into two piles</strong> — physical stickers, and electronic approvals.</li>
<li><strong>Stickers:</strong> carry both passports, check the visa is undamaged and still valid, and never remove it.</li>
<li><strong>Electronic approvals:</strong> assume each needs a fresh application, and budget for the fee and processing time again.</li>
<li><strong>Australia:</strong> identify whether you hold an ETA 601 (reapply) or another visa (notify).</li>
<li><strong>Re-check the requirement itself</strong> for your new document with the <a href="/">visa checker</a> — rules change independently of your passport.</li>
</ol>
<p>While you are at it, check the validity window on the new book against <a href="/guides/six-month-passport-rule">the six-month passport rule</a>, and make sure you know the difference between <a href="/guides/visa-validity-vs-duration-of-stay">visa validity and permitted stay</a>.</p>`,
      },
    ],
    faqs: [
      { q: "Can I travel with a visa in my old, expired passport?", a: "For the United States, yes — carry both the expired passport containing the visa and your new valid passport. US Embassy guidance conditions this on the visa still being valid, undamaged, and the correct type, with both passports from the same country. Other countries set their own rules, so confirm with the destination." },
      { q: "Can I move a visa sticker into my new passport?", a: "No. US Embassy guidance states that removing a visa from an old passport and placing it in a new one makes the visa no longer valid. Leave it in the original book and carry both." },
      { q: "Do I need a new ESTA if I get a new passport?", a: "Yes. CBP requires an approved ESTA for the specific passport you travel on, and states that travellers who acquire a new passport must submit a new ESTA application. The fee applies again." },
      { q: "Does a new passport invalidate my Canadian eTA or UK ETA?", a: "Effectively, yes. IRCC states an eTA is electronically linked to your passport and that a new passport requires a new eTA. GOV.UK states a UK ETA is linked to your passport and that if it has expired or changed you must apply for a new ETA." },
      { q: "What about ETIAS after a passport renewal?", a: "The official EU site states an ETIAS authorisation is linked to the travel document and that you must apply for a new one if you change that document for any reason. ETIAS is not yet in operation and no start date has been announced." },
      { q: "I have an Australian eVisitor — do I reapply after renewing my passport?", a: "Not usually. Home Affairs requires a fresh application only for the Electronic Travel Authority (subclass 601); for other visas you notify the department of your new passport details so the existing visa can be linked to it." },
    ],
  },
  {
    kind: "article",
    slug: "which-passport-to-use-dual-citizenship",
    title: "Dual Nationality: Which Passport Do You Actually Travel On?",
    description: "Holding two passports means choosing one at booking, one at check-in and one at the border — and they can legitimately differ. The rules that are real, and the ones the internet invented.",
    h1: "Dual nationality: which passport do you actually travel on?",
    intro:
      "If you hold two passports, almost every visa tool — including ours — asks you for one nationality. That is the one question a requirements matrix cannot answer for you. The good news is that the decision follows a short rule, and several of the constraints people worry about turn out not to exist.",
    sections: [
      {
        h2: "The working rule",
        html: `<p><strong>Use your own country's passport when entering that country. Use whichever passport gives you the easiest entry everywhere else.</strong></p>
<p>The second half is where the value is: if one of your passports needs a visa for your destination and the other does not, you travel on the one that does not. Run both pairings through the <a href="/">visa checker</a> and compare — that is a two-minute check that can save an entire application.</p>`,
      },
      {
        h2: "Countries that require their own passport",
        html: `<p>Some states genuinely do require their nationals to use their own document. These are the documented ones:</p>
<ul>
<li><strong>United States</strong> — 8 U.S.C. § 1185(b) makes it unlawful for a US citizen to enter or depart the United States without a valid US passport, and the implementing regulation at 22 CFR § 53.1 repeats it. Both are qualified: the statute opens <em>"Except as otherwise provided by the President"</em>, and the regulation says <em>"unless excepted under 22 CFR 53.2"</em>. So the rule is strong, but not absolute on its face.</li>
<li><strong>Canada</strong> — IRCC states that Canadian citizens, <em>"including dual citizens, need to fly to Canada with a valid Canadian passport"</em>. There is one exception: Canadian-American dual citizens may fly to Canada on a valid US passport. Note this is an <em>air travel</em> rule; do not extend it to land or sea crossings.</li>
<li><strong>Australia</strong> — the Australian Government states that Australian citizens who are dual nationals <em>"are required to depart and enter Australia on their Australian passport"</em>, and that an Australian citizen cannot be granted a visa for Australia in a foreign passport. This applies whether or not you currently hold an Australian passport.</li>
</ul>
<p>If your other nationality is not on a list like this, check that country's own immigration authority rather than assuming.</p>`,
      },
      {
        h2: "Two rules the internet invented",
        html: `<p><strong>"You must enter and leave a country on the same passport."</strong> As a universal legal rule, this is not true. IATA's guidance to carriers is that passengers can generally choose which passport to present at a given border crossing, and ICAO's Facilitation Manual states that <em>"Passengers can legitimately travel with multiple travel documents"</em>, naming dual nationals as the common example. What is real is narrower: some states require their own nationals to use their national passport both ways — the examples above. For third countries, using the same document each way is sound <em>practical</em> advice, because your entry record and any visa are attached to the document you arrived on.</p>
<p><strong>"The passport you gave the airline must match the one you show at the border."</strong> Also not a legal requirement for you. ICAO's Facilitation Manual explains that the intent of the relevant Annex 9 standard is to relieve the airline of liability when a passenger uses multiple travel documents during one journey, and recommends that states reconcile differences <em>"by comparing key biographical data, such as name, date of birth and sex, as opposed to travel document details"</em>. In the US, the carrier's advance-passenger-information duty attaches to the document presented to the carrier, not the one later shown to an officer. A mismatch can cause delay while it is reconciled; it is not unlawful for you.</p>`,
      },
      {
        h2: "The three moments where a passport is chosen",
        html: `<p>It helps to see that a single journey has three separate document moments, and they do not have to agree:</p>
<ol>
<li><strong>Booking and advance passenger data</strong> — the document you give the airline. This drives the automated document check, so give the passport that makes your entry look correct for the destination.</li>
<li><strong>Check-in</strong> — where that check is actually run. If you are boarding on a passport that needs no visa, that is the one to present.</li>
<li><strong>The border</strong> — where admission is decided, and where your own country's rule (if any) applies.</li>
</ol>
<p>Because the airline's decision and the border's decision are separate, it is worth understanding <a href="/guides/why-airlines-deny-boarding">why airlines refuse to board people</a> before you plan an itinerary that leans on two documents.</p>`,
      },
      {
        h2: "The real risk nobody mentions",
        html: `<p>It is not a fine. No official source we could find names a country that penalises a dual national for presenting the "wrong" passport, and you should be sceptical of pages that claim otherwise without citing one.</p>
<p>The genuine consequence is <strong>consular</strong>. A country may not recognise your other nationality — particularly if you did not enter on that country's passport — which can limit the assistance your other government is able to provide if something goes wrong. If you are travelling somewhere where that matters, that is the consideration to weigh, not an imagined penalty.</p>
<p>The other practical risk is administrative: entry stamps, permitted stay and any visa are tied to the document you arrived on. Mixing documents mid-trip is how people lose track of their own permitted stay — see <a href="/guides/visa-validity-vs-duration-of-stay">visa validity vs duration of stay</a>.</p>`,
      },
      {
        h2: "How to decide, in order",
        html: `<ol>
<li><strong>Are you entering a country you are a citizen of?</strong> Use that country's passport, and check whether it is legally required.</li>
<li><strong>Otherwise, compare.</strong> Check each of your nationalities against the destination in the <a href="/">visa checker</a>.</li>
<li><strong>Pick the easier one</strong> — visa-free beats eVisa beats embassy visa. Then check <a href="/guides/six-month-passport-rule">validity</a> on that specific book.</li>
<li><strong>Use it consistently for that leg</strong> — booking, check-in and border — so your entry record matches your documents.</li>
<li><strong>Check the exit rule of your own country</strong> if you are departing one you are a citizen of.</li>
</ol>
<p>Curious how your two passports actually compare in reach? The <a href="/reports/passport-power-2026">Passport Power Report</a> ranks all 195 by how many destinations they open without an advance visa.</p>`,
      },
    ],
    faqs: [
      { q: "Which passport should I use when travelling as a dual citizen?", a: "Use your own country's passport to enter that country, and whichever passport gives the easiest entry elsewhere. If one nationality is visa-free for your destination and the other is not, travel on the visa-free one." },
      { q: "Do I have to enter and leave a country on the same passport?", a: "Not as a universal legal rule. IATA states passengers can generally choose which passport to present, and ICAO notes travellers can legitimately hold multiple documents. Some countries do require their own nationals to use their national passport both ways — the US, Australia, and Canada for air travel." },
      { q: "Must the passport I book with match the one I show at the border?", a: "It is not unlawful for you if they differ. ICAO guidance says the relevant standard exists to relieve airlines of liability when a passenger uses multiple documents on one journey, and recommends reconciling by name and date of birth rather than document number. Expect delay, not a penalty." },
      { q: "Can US dual citizens enter the United States on their other passport?", a: "8 U.S.C. § 1185(b) and 22 CFR § 53.1 make it unlawful for a US citizen to enter or depart the US without a valid US passport, though both are written with exceptions. Plan on using your US passport." },
      { q: "Can a Canadian dual citizen fly to Canada without a Canadian passport?", a: "Generally no. IRCC states Canadian citizens, including dual citizens, need a valid Canadian passport to fly to Canada. Canadian-American dual citizens are the exception and may travel on a valid US passport. This applies to air travel." },
      { q: "Is there a penalty for using the wrong passport as a dual national?", a: "No official source we found names a country that penalises this. The real consequence is consular: a country may not recognise your other nationality, which can limit the help your other government can give — especially if you did not enter on its passport." },
    ],
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
<li><strong>The airline, at check-in.</strong> Airlines face financial penalties under national law for carrying passengers who lack the documents they needed, so they enforce document rules strictly and sometimes conservatively. Most refusals happen here, before you ever reach immigration — see <a href="/guides/why-airlines-deny-boarding">why airlines refuse to board you</a>.</li>
<li><strong>The border officer, on arrival.</strong> The final decision on entry is always theirs — and it is a <a href="/guides/why-airlines-deny-boarding">separate decision from the airline's</a>.</li>
</ul>
<p>This is why "the embassy told me it was fine" does not help at the airport — the airline applies its own reading of the rule, and you will not be at the border to argue.</p>`,
      },
      {
        h2: "Europe is the big exception",
        html: `<p>The Schengen Area does not use the six-month rule. To enter, your passport must be:</p>
<ul>
<li><strong>Valid for at least three months beyond your intended departure</strong> from the Schengen Area — not six, and measured from when you leave rather than when you arrive;</li>
<li><strong>Issued within the previous ten years</strong> — a genuine trap for anyone whose passport was issued with extra months carried over from an old one, because it can be in date yet still older than ten years and be rejected;</li>
</ul>
<p>Both come from the Schengen Borders Code (Regulation (EU) 2016/399, Article 6), which sets the entry conditions for everyone crossing a Schengen border, and both are applied at airline check-in as well as at the border itself. If you are heading to Europe, check the <em>issue</em> date as carefully as the expiry date.</p>
<p>A third requirement is often quoted alongside these: that your passport must contain <strong>at least two blank pages</strong>. That one sits in a different instrument. It is Article 12 of the Visa Code (Regulation (EC) No 810/2009), and it governs the document you present when <em>applying for a Schengen visa</em> — not the document you present at the border. If you are visa-exempt and simply arriving, it is not an entry condition. Carry blank pages anyway for stamps, but do not confuse the two rules.</p>`,
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
<li>If you are close to the line, renew before booking anything non-refundable. Renewal is far cheaper than a missed flight — but check first <a href="/guides/new-passport-old-visa">what a renewal does to visas you already hold</a>.</li>
</ol>
<p>Also worth checking at the same time: whether you need a visa at all. Our <a href="/">free visa checker</a> gives you the requirement for your exact passport and destination in one step — and if you hold two passports, <a href="/guides/which-passport-to-use-dual-citizenship">check which one to travel on</a> first.</p>`,
      },
    ],
    faqs: [
      { q: "Is the six-month passport rule counted from arrival or departure?", a: "For most countries that apply it, the six months are counted from your date of arrival, not the date you leave. The Schengen Area is different: it requires three months of validity beyond your intended departure from the Schengen Area." },
      { q: "Can an airline refuse to board me even if the country would let me in?", a: "Yes. Airlines face penalties under national law for carrying improperly documented passengers, so they enforce document rules themselves and sometimes more strictly than the border. Most passport-validity refusals happen at check-in." },
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
<p>The common thread is that the booking is <strong>confirmed, in your name, and dated inside your permitted stay</strong>. This check happens at the airline desk, not the border — <a href="/guides/why-airlines-deny-boarding">the two decisions are separate</a>, and the airline's comes first.</p>`,
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
      { q: "Who actually checks — the airline or immigration?", a: "Both can, but in practice the airline checks first, at check-in, because it carries the financial penalty for improperly documented passengers. Most refusals happen there rather than at the border." },
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
<p>If your visa is single entry and your plans change, apply for a new visa before leaving rather than hoping to be re-admitted at the border. And if you renew your passport mid-trip, check <a href="/guides/new-passport-old-visa">whether the visa survives the new book</a>.</p>`,
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
<li><strong>Expect the check at the departure gate.</strong> Transit documents are verified by the airline before you fly — <a href="/guides/why-airlines-deny-boarding">why airlines refuse to board you</a> explains who decides what.</li>
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
