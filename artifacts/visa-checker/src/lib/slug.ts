// Country-name → URL slug. MUST stay identical to the server's slugify
// (api-server/src/seo/render.ts) so SPA canonicals match the server-rendered
// hub URLs (/visa-requirements/{slug}, /countries/{slug}) exactly.
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
