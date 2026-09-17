// Server-side rendering for public blog posts (/blog/{slug}) so the editorial
// content is crawlable. Same pattern as appShell: inject title/meta/canonical/
// Article JSON-LD + the rendered post into the SPA shell's #root; React
// replaces it on load. Markdown is converted with an escape-FIRST mini renderer
// (everything is HTML-escaped before our own tags are added), so post content
// can never inject script.
import { loadShell, SITE } from "./appShell";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Minimal, safe markdown → HTML: headings, bold, italic, links (http(s) only),
// images (http(s) only), unordered/ordered lists, GFM pipe tables, code fences,
// paragraphs.
export function miniMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let list: "ul" | "ol" | null = null;
  let inCode = false;

  const inline = (raw: string): string => {
    let s = esc(raw);
    // images first (so the link rule doesn't eat them): ![alt](https://url)
    //
    // An optional "#WxH" fragment on the URL carries the photo's real pixel
    // size, e.g. ![alt](https://…/foo.jpg#1280x854). Without width/height the
    // browser cannot reserve the right box and the article reflows as each
    // photo arrives. Markdown has no syntax for dimensions and raw HTML is
    // escaped by the client renderer (deliberately — see lib/markdown.ts), so
    // the fragment is the one channel both renderers can read. It is stripped
    // from the emitted src; Commons URLs never use fragments themselves.
    // lib/markdown.ts parses the same hint, so both versions of a post agree.
    //
    // The whole destination is captured first and the hint picked off it
    // afterwards, exactly as the client does. Matching the hint inside the URL
    // pattern instead would make a MALFORMED hint ("#1280x") fail the image
    // rule, drop through to the link rule below, and render an <a> on the
    // server against an <img> on the client — the same silent server/client
    // divergence that shipped the truncated credit links.
    s = s.replace(
      /!\[([^\]]*)\]\((https?:\/\/(?:[^()\s]|\([^()\s]*\))+)\)/g,
      (_m, alt: string, url: string) => {
        const hint = url.match(/^(.*)#(\d{2,5})x(\d{2,5})$/);
        const src = hint ? hint[1] : url;
        const size = hint ? ` width="${hint[2]}" height="${hint[3]}"` : "";
        return `<img src="${src}" alt="${alt}"${size} loading="lazy" decoding="async" style="max-width:100%;height:auto;border-radius:12px">`;
      },
    );
    // The destination allows ONE level of balanced parentheses, because
    // Wikimedia Commons file pages routinely contain them —
    // File:Princetown_(AU),_..._Twelve_Apostles_--_2019_--_0969.jpg. A plain
    // [^)]+ stops at the first ")", which silently cut five photo-credit links
    // down to a 404 and spilled the rest of each URL onto the page as visible
    // text. It failed only server-side, because marked (the client renderer)
    // already handles balanced parentheses — so the bug was invisible in the
    // browser and showed only to crawlers and no-JS readers. Keep the two in
    // step: anything accepted here must parse the same way in marked.
    s = s.replace(
      /\[([^\]]+)\]\(((?:https?:\/\/|\/)(?:[^()\s]|\([^()\s]*\))*)\)/g,
      '<a href="$2" rel="noopener">$1</a>',
    );
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, "$1<em>$2</em>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  };
  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; }
  };
  const flushList = () => {
    if (list) { out.push(`</${list}>`); list = null; }
  };

  // GFM pipe table: a header row, a |---|:--:| delimiter row, then body rows.
  // The client renders posts with marked, which supports these; without the same
  // support here a table would reach crawlers as a wall of pipe characters,
  // which is precisely the version that gets indexed.
  const cells = (row: string): string[] =>
    row.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
  const isDelim = (row: string): boolean =>
    /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(row);
  const alignOf = (spec: string): string => {
    const s = spec.trim();
    if (s.startsWith(":") && s.endsWith(":")) return " style=\"text-align:center\"";
    if (s.endsWith(":")) return " style=\"text-align:right\"";
    return "";
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.trim().startsWith("```")) {
      flushPara(); flushList();
      out.push(inCode ? "</pre>" : "<pre>");
      inCode = !inCode;
      continue;
    }
    if (inCode) { out.push(esc(line)); continue; }

    const h = line.match(/^(#{1,5})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      // The shell already emits the post's <h1>, so a post's own headings start
      // at <h2>. "##" is the house convention for a section; a stray "#" is
      // clamped rather than allowed to produce a second <h1> on the page. The
      // client renderer clamps identically, so both versions agree.
      const n = Math.max(2, Math.min(6, (h[1] ?? "").length));
      out.push(`<h${n}>${inline(h[2] ?? "")}</h${n}>`);
      continue;
    }

    const next = lines[i + 1];
    if (line.includes("|") && line.trim() && next !== undefined && isDelim(next) && !isDelim(line)) {
      flushPara(); flushList();
      const head = cells(line);
      const aligns = cells(next).map(alignOf);
      const body: string[][] = [];
      let j = i + 2;
      for (; j < lines.length; j++) {
        const row = lines[j] ?? "";
        if (!row.trim() || !row.includes("|")) break;
        body.push(cells(row));
      }
      const th = head.map((c, k) => `<th${aligns[k] ?? ""}>${inline(c)}</th>`).join("");
      const trs = body
        .map((r) => `<tr>${head.map((_, k) => `<td${aligns[k] ?? ""}>${inline(r[k] ?? "")}</td>`).join("")}</tr>`)
        .join("");
      // Wrapped so a wide table scrolls inside itself instead of breaking the page.
      out.push(`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`);
      i = j - 1;
      continue;
    }

    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const want = ul ? "ul" : "ol";
      if (list !== want) { flushList(); out.push(`<${want}>`); list = want as "ul" | "ol"; }
      out.push(`<li>${inline((ul ?? ol)![1])}</li>`);
      continue;
    }

    if (!line.trim()) { flushPara(); flushList(); continue; }
    para.push(line.trim());
  }
  flushPara(); flushList();
  if (inCode) out.push("</pre>");
  return out.join("\n");
}

export interface BlogPostRow {
  title: string;
  slug: string;
  excerpt?: string | null;
  /** Preferred source for the meta description; `excerpt` is the fallback. */
  metaDescription?: string | null;
  content: string;
  cover_url?: string | null;
  author?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  /**
   * Questions this post answers outright, emitted as FAQPage structured data.
   * Only ever populate this from questions the post itself genuinely answers —
   * schema that does not match visible content is a manual-action risk, not a
   * shortcut to a rich result.
   */
  faq?: { q: string; a: string }[] | null;
  /** Alt text for the cover; falls back to the title. */
  cover_alt?: string | null;
  cover_width?: number | null;
  cover_height?: number | null;
  cover_caption?: string | null;
  cover_credit?: { author: string; authorUrl?: string; license: string; licenseUrl: string; sourceUrl: string } | null;
}

/** "Photo: Author / CC BY-SA 4.0, via Wikimedia Commons", each part linked where a link exists. */
export function photoCreditHtml(c: NonNullable<BlogPostRow["cover_credit"]>): string {
  const who = c.authorUrl ? `<a href="${esc(c.authorUrl)}" rel="noopener">${esc(c.author)}</a>` : esc(c.author);
  const host = /commons\.wikimedia\.org/.test(c.sourceUrl) ? "Wikimedia Commons" : "source";
  return `Photo: ${who} / <a href="${esc(c.licenseUrl)}" rel="noopener license">${esc(c.license)}</a>, via <a href="${esc(c.sourceUrl)}" rel="noopener">${host}</a>`;
}

function isoDate(v: string | Date | null | undefined): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

/** Trim to a whole word, so a meta description never ends mid-syllable. */
function clip(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.—-]+$/, "")}…`;
}

export function renderBlogPostShell(post: BlogPostRow): string | null {
  const shell = loadShell();
  if (!shell) return null;

  const canonical = `${SITE}/blog/${post.slug}`;
  const title = `${post.title} | isvisarequired.com`;
  const plain = post.content.replace(/[#*`\[\]()>_]/g, " ").replace(/\s+/g, " ").trim();
  const description = clip(post.metaDescription || post.excerpt || plain, 158);
  const published = isoDate(post.created_at);
  const modified = isoDate(post.updated_at) ?? published;
  const cover = post.cover_url && /^https?:\/\//.test(post.cover_url) ? post.cover_url : null;
  const coverAlt = post.cover_alt || post.title;
  const dims = post.cover_width && post.cover_height ? ` width="${post.cover_width}" height="${post.cover_height}"` : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    url: canonical,
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(cover
      ? {
          image: {
            "@type": "ImageObject",
            url: cover,
            ...(post.cover_width && post.cover_height ? { width: post.cover_width, height: post.cover_height } : {}),
            ...(post.cover_credit ? { creditText: post.cover_credit.author, license: post.cover_credit.licenseUrl, acquireLicensePage: post.cover_credit.sourceUrl } : {}),
          },
        }
      : {}),
    author: { "@type": "Organization", name: post.author || "isvisarequired.com" },
    publisher: { "@type": "Organization", name: "isvisarequired.com", url: SITE },
    isPartOf: { "@type": "WebSite", name: "isvisarequired.com", url: SITE },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };
  const faqLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const injected = `<article style="max-width:760px;margin:0 auto;padding:24px 20px;font-family:Inter,system-ui,sans-serif;line-height:1.7">
    <nav style="font-size:13px;color:#64748b"><a href="/" style="color:#64748b">Home</a> › <a href="/blog" style="color:#64748b">Blog</a></nav>
    <h1>${esc(post.title)}</h1>
    ${published ? `<p style="color:#64748b;font-size:14px">${esc(post.author || "isvisarequired.com")} · ${esc(published)}</p>` : ""}
    ${cover ? `<figure style="margin:20px 0 28px"><img src="${esc(cover)}" alt="${esc(coverAlt)}"${dims} fetchpriority="high" decoding="async" style="width:100%;height:auto;max-height:440px;object-fit:cover;border-radius:14px;display:block"><figcaption style="font-size:12px;color:#64748b;margin-top:8px;line-height:1.5">${post.cover_caption ? `${esc(post.cover_caption)} · ` : ""}${post.cover_credit ? photoCreditHtml(post.cover_credit) : ""}</figcaption></figure>` : ""}
    ${miniMarkdown(post.content)}
    <p style="margin-top:28px"><a href="/">Check your visa requirements instantly →</a></p>
  </article>`;

  let html = shell;
  // The shell carries the site-wide FAQ schema, which is right for the homepage
  // and wrong here: two FAQPage blocks on one URL is not two chances at a rich
  // result, it is a reason for Google to trust neither. When the post brings its
  // own — always more relevant to the query that found it — the shell's goes.
  //
  // This runs unconditionally, not only when the post has its own FAQ. A post
  // without one used to inherit the homepage's questions ("How do I check if I
  // need a visa?" and seven others), none of which appear anywhere on the post.
  // Structured data that isn't on the page is a manual-action offence, so the
  // shell's block has to go whether or not we have something to put in its place.
  html = html.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/gi,
    (match, body: string) => (/"@type"\s*:\s*"FAQPage"/.test(body) ? "" : match),
  );
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${esc(description)}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${esc(canonical)}" />`);
  // The shell ships the homepage's Open Graph and Twitter tags. Appending a
  // post's own tags after them left two of each, and Facebook, LinkedIn, Slack
  // and X take the first — so every post shared as the generic homepage card.
  // Strip the page-specific ones and write this post's set in their place;
  // og:site_name, og:locale and twitter:site/creator are site-wide and stay.
  html = html.replace(/\s*<meta\s+property="og:(?:type|url|title|description|image(?::[a-z_]+)?)"[^>]*>/gi, "");
  html = html.replace(/\s*<meta\s+name="twitter:(?:card|title|description|image(?::[a-z_]+)?)"[^>]*>/gi, "");
  const shareImage = cover ?? `${SITE}/opengraph.jpg`;
  const shareAlt = cover ? coverAlt : "Is Visa Required? – Free Visa Checker";
  const shareDims = cover
    ? post.cover_width && post.cover_height
      ? `<meta property="og:image:width" content="${post.cover_width}"><meta property="og:image:height" content="${post.cover_height}">`
      : ""
    : `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`;
  html = html.replace(
    "</head>",
    `<meta property="og:type" content="article"><meta property="og:title" content="${esc(post.title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(shareImage)}"><meta property="og:image:alt" content="${esc(shareAlt)}">${shareDims}${published ? `<meta property="article:published_time" content="${published}">` : ""}${modified ? `<meta property="article:modified_time" content="${modified}">` : ""}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(post.title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(shareImage)}"><meta name="twitter:image:alt" content="${esc(shareAlt)}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>${faqLd ? `\n<script type="application/ld+json">${JSON.stringify(faqLd)}</script>` : ""}
</head>`,
  );
  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${injected}</div>`);
  return html;
}
