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
];

const BY_SLUG = new Map(STATIC_POSTS.map((p) => [p.slug, p]));

export function staticPostBySlug(slug: string): StaticPost | undefined {
  return BY_SLUG.get(slug);
}

/** Newest first, matching the ORDER BY created_at DESC the database queries use. */
export function staticPostsNewestFirst(): StaticPost[] {
  return [...STATIC_POSTS].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
