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
// images (http(s) only), unordered/ordered lists, code fences, paragraphs.
export function miniMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let list: "ul" | "ol" | null = null;
  let inCode = false;

  const inline = (raw: string): string => {
    let s = esc(raw);
    // images first (so the link rule doesn't eat them): ![alt](https://url)
    s = s.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy" style="max-width:100%">');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2" rel="noopener">$1</a>');
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

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      flushPara(); flushList();
      out.push(inCode ? "</pre>" : "<pre>");
      inCode = !inCode;
      continue;
    }
    if (inCode) { out.push(esc(line)); continue; }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flushPara(); flushList(); const n = h[1].length + 1; out.push(`<h${n}>${inline(h[2])}</h${n}>`); continue; }

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
  content: string;
  cover_url?: string | null;
  author?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
}

function isoDate(v: string | Date | null | undefined): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export function renderBlogPostShell(post: BlogPostRow): string | null {
  const shell = loadShell();
  if (!shell) return null;

  const canonical = `${SITE}/blog/${post.slug}`;
  const title = `${post.title} | isvisarequired.com`;
  const plain = post.content.replace(/[#*`\[\]()>_]/g, " ").replace(/\s+/g, " ").trim();
  const description = (post.excerpt || plain).slice(0, 158);
  const published = isoDate(post.created_at);
  const modified = isoDate(post.updated_at) ?? published;
  const cover = post.cover_url && /^https?:\/\//.test(post.cover_url) ? post.cover_url : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    url: canonical,
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(cover ? { image: cover } : {}),
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

  const injected = `<article style="max-width:760px;margin:0 auto;padding:24px 20px;font-family:Inter,system-ui,sans-serif;line-height:1.7">
    <nav style="font-size:13px;color:#64748b"><a href="/" style="color:#64748b">Home</a> › <a href="/blog" style="color:#64748b">Blog</a></nav>
    <h1>${esc(post.title)}</h1>
    ${published ? `<p style="color:#64748b;font-size:14px">${esc(post.author || "isvisarequired.com")} · ${esc(published)}</p>` : ""}
    ${cover ? `<img src="${esc(cover)}" alt="${esc(post.title)}" loading="lazy" style="max-width:100%;border-radius:12px">` : ""}
    ${miniMarkdown(post.content)}
    <p style="margin-top:28px"><a href="/">Check your visa requirements instantly →</a></p>
  </article>`;

  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${esc(description)}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${esc(canonical)}" />`);
  html = html.replace(
    "</head>",
    `<meta property="og:type" content="article"><meta property="og:title" content="${esc(post.title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}">${cover ? `<meta property="og:image" content="${esc(cover)}">` : ""}
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>`,
  );
  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${injected}</div>`);
  return html;
}
