// Responsive srcset for the Wikimedia Commons thumbnails used in blog posts.
//
// Commons serves ONLY a fixed set of thumbnail widths. Asking for anything else
// now returns HTTP 400 ("Use thumbnail sizes listed on https://w.wiki/GHai"),
// and asking the API for an unlisted width hands back a URL on the next bucket
// up while still reporting the width you asked for — which is why every
// width/height in posts.ts is measured from the image bytes rather than trusted
// from the API.
//
// Verified against upload.wikimedia.org on 2026-09-17 by requesting 26 widths:
// 120, 250, 500, 960, 1280 and 1920 returned 200; 160, 200, 240, 256, 320, 400,
// 480, 512, 640, 720, 768, 800, 1000, 1024, 1200, 1500, 1536, 1600, 2048 and
// 2560 all returned 400. Do not add a width to this list without checking it.
export const COMMONS_THUMB_WIDTHS = [120, 250, 500, 960, 1280, 1920] as const;

/**
 * A Commons thumbnail URL, e.g.
 *   https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Foo.jpg/1920px-Foo.jpg
 * The width appears twice over: once as the directory-level `<W>px-` prefix on
 * the final segment. Only that final segment carries it.
 */
const THUMB = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/.+\/)(\d+)px-([^/]+)$/;

/** Swap a Commons thumbnail URL to another served width, or null if it isn't one. */
export function commonsThumbAt(src: string, width: number): string | null {
  const m = THUMB.exec(src);
  return m ? `${m[1]}${width}px-${m[3]}` : null;
}

/**
 * Build a srcset for a Commons thumbnail, capped at the width we actually have.
 *
 * Returns null when the URL is not a Commons thumbnail, or when no smaller
 * bucket exists — callers then just omit the attribute. Never offers a width
 * above `naturalWidth`: Commons will happily render an upscaled thumbnail and
 * we would be paying for pixels the original does not contain.
 *
 * Both renderers call this so the crawled and hydrated markup agree; see the
 * note on StaticPost.cover in api-server/src/content/posts.ts.
 */
export function commonsSrcSet(src: string, naturalWidth: number): string | null {
  if (!THUMB.test(src)) return null;
  const widths = COMMONS_THUMB_WIDTHS.filter((w) => w <= naturalWidth);
  if (widths.length < 2) return null;
  const parts: string[] = [];
  for (const w of widths) {
    const u = commonsThumbAt(src, w);
    if (u) parts.push(`${u} ${w}w`);
  }
  return parts.length >= 2 ? parts.join(", ") : null;
}

/**
 * `sizes` for an image that spans the article column.
 *
 * The blog column is capped around 720px, so on anything wider than a phone the
 * image is never larger than that; below it the image is full-bleed minus the
 * page gutter. Without this the browser assumes 100vw and pulls the 1920px file
 * onto a phone — 410KB where 32KB would do.
 */
export const ARTICLE_IMAGE_SIZES = "(min-width: 768px) 720px, 100vw";

/** `sizes` for the cards on /blog: a 3-up grid on desktop, full width on a phone. */
export const CARD_IMAGE_SIZES = "(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw";
