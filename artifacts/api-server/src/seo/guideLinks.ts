// Internal linking from the programmatic layer into the editorial layer.
//
// The 37,830 pair pages and 390 hubs previously linked to just three of the
// twelve guides, so nine of them had exactly one inbound link (the guides hub)
// and no crawl equity at all. Every guide below is genuinely relevant to every
// international trip, so the honest fix is to rotate: each page links to a
// requirement-matched guide plus a rotating pick, seeded by the page itself.
//
// Seeding (rather than random) keeps the link graph stable between renders,
// which matters for crawlers, and spreads inbound links evenly across the
// whole editorial set instead of pointing 38k pages at the same article.
import type { VisaRequirement } from "../data/visaData";

export interface GuideLink { href: string; label: string; sub?: string }

// Guides that apply to any traveller regardless of the requirement.
const EVERGREEN: GuideLink[] = [
  { href: "/guides/six-month-passport-rule", label: "The six-month passport rule", sub: "Why airlines refuse valid passports" },
  { href: "/guides/why-airlines-deny-boarding", label: "Why airlines refuse to board you", sub: "It is not the border's decision" },
  { href: "/guides/visa-validity-vs-duration-of-stay", label: "Visa validity vs duration of stay", sub: "The confusion that causes overstays" },
  { href: "/guides/proof-of-onward-travel", label: "Proof of onward travel", sub: "What actually counts at check-in" },
  { href: "/guides/new-passport-old-visa", label: "Renewed your passport?", sub: "What happens to visas you hold" },
  { href: "/guides/which-passport-to-use-dual-citizenship", label: "Two passports — which to travel on", sub: "For dual nationals" },
  { href: "/guides/do-children-need-their-own-visa", label: "Do children need their own visa?", sub: "Infants included" },
  { href: "/guides/how-early-to-apply-for-a-visa", label: "How early should you apply?", sub: "You can apply too early" },
  { href: "/guides/visa-refused-what-happens-next", label: "If your visa is refused", sub: "There is no six-month wait" },
  { href: "/guides/single-entry-vs-multiple-entry-visas", label: "Single vs multiple entry", sub: "A day trip can use up your visa" },
  { href: "/guides/can-i-leave-the-airport-during-a-layover", label: "Leaving the airport on a layover", sub: "Twelve major hubs" },
  { href: "/guides/visa-on-arrival-vs-evisa-vs-eta", label: "Visa on arrival vs eVisa vs ETA", sub: "How the categories differ" },
  { href: "/guides/eu-entry-exit-system-ees", label: "Europe's Entry/Exit System", sub: "The passport stamp is gone" },
  { href: "/guides/damaged-passport-travel", label: "Is your passport too damaged?", sub: "Valid is not the same as usable" },
];

// The guide that speaks most directly to a given verdict.
const BY_REQUIREMENT: Record<VisaRequirement, GuideLink> = {
  visa_free: { href: "/guides/six-month-passport-rule", label: "Is your passport valid long enough?", sub: "Read before you book" },
  visa_on_arrival: { href: "/guides/visa-on-arrival-vs-evisa-vs-eta", label: "Visa on arrival vs eVisa vs ETA", sub: "Read before you book" },
  e_visa: { href: "/guides/how-early-to-apply-for-a-visa", label: "How early should you apply?", sub: "Some clocks start at approval" },
  visa_required: { href: "/guides/proof-of-onward-travel", label: "What counts as proof of onward travel", sub: "Read before you book" },
  no_admission: { href: "/guides/visa-refused-what-happens-next", label: "Refused entry or a visa?", sub: "What actually happens next" },
};

// Stable, evenly distributed index from an arbitrary key (a country pair or a
// single country code). Same key always yields the same pick.
function seedFrom(key: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 100003;
  return h % modulo;
}

/** Requirement-matched guide, plus a rotating second one that is never a duplicate. */
export function guideLinksForPair(requirement: VisaRequirement, key: string): GuideLink[] {
  const matched = BY_REQUIREMENT[requirement];
  const pool = EVERGREEN.filter((g) => g.href !== matched.href);
  return [matched, pool[seedFrom(key, pool.length)]];
}

/** Two rotating guides for a hub page, seeded by its country code. */
export function guideLinksForHub(key: string): GuideLink[] {
  const i = seedFrom(key, EVERGREEN.length);
  return [EVERGREEN[i], EVERGREEN[(i + 5) % EVERGREEN.length]];
}
