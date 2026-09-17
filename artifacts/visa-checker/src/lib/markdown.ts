// Shared markdown → HTML for blog content, hardened against stored XSS.
// marked passes raw HTML blocks through untouched by default, so a post
// containing `<script>` (or an onerror attribute) would execute for every
// visitor of the public /blog/:slug page. We escape raw-HTML tokens instead —
// posts are written in plain Markdown, so nothing legitimate is lost.
import { Marked } from "marked";
import { commonsSrcSet, ARTICLE_IMAGE_SIZES } from "@workspace/travel-data";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Only allow safe URL schemes in links/images ("javascript:alert(1)" in a
// markdown link would otherwise land in href verbatim). Relative URLs pass.
function safeUrl(href: string): string | null {
  const trimmed = href.trim();
  if (/^(https?:|mailto:|tel:|\/|#|\.)/i.test(trimmed)) return trimmed;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed; // scheme-less relative
  return null;
}

const safeMarked = new Marked({
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    // The page already renders the post title as its <h1>, so a post's own
    // headings must start at <h2> — a second <h1> muddies the document outline
    // for search engines. miniMarkdown on the server clamps the same way, so
    // the crawled and hydrated versions of a post agree heading for heading.
    heading({ tokens, depth }) {
      const level = Math.max(2, Math.min(6, depth));
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
    link({ href, title, tokens }) {
      const url = safeUrl(href);
      const text = this.parser.parseInline(tokens);
      if (!url) return text;
      return `<a href="${escapeHtml(url).replace(/"/g, "&quot;")}"${title ? ` title="${escapeHtml(title).replace(/"/g, "&quot;")}"` : ""} rel="noopener">${text}</a>`;
    },
    // An optional "#WxH" fragment on the URL carries the photo's real pixel
    // size, e.g. ![alt](https://…/foo.jpg#1280x854). Without width/height the
    // browser cannot reserve the right box and the article reflows as each
    // photo arrives. Markdown has no syntax for dimensions, and raw HTML is
    // escaped above by design, so the fragment is the one channel both
    // renderers can read. It is stripped from the emitted src; the Wikimedia
    // Commons URLs these posts use never carry fragments themselves.
    // miniMarkdown on the server parses the same hint, so the crawled and
    // hydrated versions of a post agree image for image.
    image({ href, title, text }) {
      const url = safeUrl(href);
      if (!url) return escapeHtml(text);
      const dims = url.match(/^(.*)#(\d{2,5})x(\d{2,5})$/);
      const src = dims ? (dims[1] as string) : url;
      const size = dims ? ` width="${dims[2]}" height="${dims[3]}"` : "";
      // Commons only serves a fixed set of widths, and without a srcset the
      // browser takes the 1920px file onto a phone rendering it at 375px.
      // miniMarkdown builds the same attribute from the same helper.
      const set = dims ? commonsSrcSet(src, Number(dims[2])) : null;
      const responsive = set ? ` srcset="${escapeHtml(set).replace(/"/g, "&quot;")}" sizes="${ARTICLE_IMAGE_SIZES}"` : "";
      return `<img src="${escapeHtml(src).replace(/"/g, "&quot;")}" alt="${escapeHtml(text).replace(/"/g, "&quot;")}"${size}${responsive}${title ? ` title="${escapeHtml(title).replace(/"/g, "&quot;")}"` : ""} loading="lazy">`;
    },
  },
});

export function renderMarkdown(content: string): string {
  return safeMarked.parse(content, { async: false }) as string;
}
