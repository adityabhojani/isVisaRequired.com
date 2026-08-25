// Shared markdown → HTML for blog content, hardened against stored XSS.
// marked passes raw HTML blocks through untouched by default, so a post
// containing `<script>` (or an onerror attribute) would execute for every
// visitor of the public /blog/:slug page. We escape raw-HTML tokens instead —
// posts are written in plain Markdown, so nothing legitimate is lost.
import { Marked } from "marked";

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
    link({ href, title, tokens }) {
      const url = safeUrl(href);
      const text = this.parser.parseInline(tokens);
      if (!url) return text;
      return `<a href="${escapeHtml(url).replace(/"/g, "&quot;")}"${title ? ` title="${escapeHtml(title).replace(/"/g, "&quot;")}"` : ""} rel="noopener">${text}</a>`;
    },
    image({ href, title, text }) {
      const url = safeUrl(href);
      if (!url) return escapeHtml(text);
      return `<img src="${escapeHtml(url).replace(/"/g, "&quot;")}" alt="${escapeHtml(text).replace(/"/g, "&quot;")}"${title ? ` title="${escapeHtml(title).replace(/"/g, "&quot;")}"` : ""} loading="lazy">`;
    },
  },
});

export function renderMarkdown(content: string): string {
  return safeMarked.parse(content, { async: false }) as string;
}
