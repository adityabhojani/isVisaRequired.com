// Footer navigation, shared by both footers so they can't drift apart again:
// the React app's <Footer> (artifacts/visa-checker/src/components/Footer.tsx)
// and the server-rendered pages' renderFooter() (artifacts/api-server/src/seo/shell.ts).
//
// Four groups of six keeps the columns balanced. Add a new page to the group it
// belongs to, and keep labels short enough to sit on one line in a column.

export interface NavLink {
  href: string;
  label: string;
  /** Opens in a new tab (used for the standalone embeddable widget). */
  newTab?: boolean;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const FOOTER_TAGLINE =
  "Free visa requirement checker. Independent — not a visa agency, and we never charge for applications.";

export const FOOTER_GROUPS: NavGroup[] = [
  {
    title: "Check visas",
    links: [
      { href: "/", label: "Visa checker" },
      { href: "/visa-requirements", label: "By passport" },
      { href: "/countries", label: "By destination" },
      { href: "/map", label: "World visa map" },
      { href: "/popular", label: "Popular destinations" },
      { href: "/discover", label: "Discover destinations" },
    ],
  },
  {
    title: "Plan a trip",
    links: [
      { href: "/compare", label: "Compare passports" },
      { href: "/dual-citizenship", label: "Dual citizenship" },
      { href: "/trip-planner", label: "Trip planner" },
      { href: "/schengen", label: "Schengen calculator" },
      { href: "/my-travels", label: "My travels" },
      { href: "/alerts", label: "Visa alerts" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/guides", label: "Visa guides" },
      { href: "/transit-visa", label: "Transit visas" },
      { href: "/travel-authorization", label: "ETIAS, ESTA & ETA" },
      { href: "/residence-permit-visa-benefits", label: "Residence permits" },
      { href: "/digital-nomad", label: "Digital nomad visas" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Rankings & data",
    links: [
      { href: "/stats", label: "Passport index" },
      { href: "/tier-list", label: "Passport tier list" },
      { href: "/reports/passport-power-2026", label: "Passport power report" },
      { href: "/reports/most-welcoming-countries-2026", label: "Most welcoming countries" },
      { href: "/reciprocity", label: "Visa reciprocity" },
      { href: "/visa-changes", label: "Verified rule changes" },
    ],
  },
];

/** The small row of site links under the columns. */
export const FOOTER_LINKS: NavLink[] = [
  { href: "/methodology", label: "Methodology" },
  { href: "/contact", label: "Contact" },
  { href: "/widget", label: "Embed widget", newTab: true },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export const FOOTER_DISCLAIMER =
  "Visa information is general guidance only. Always confirm with the official government source before you travel.";
