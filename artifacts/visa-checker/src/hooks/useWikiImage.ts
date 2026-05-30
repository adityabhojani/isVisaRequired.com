import { useEffect, useState } from "react";

const cache: Record<string, string> = {};
const fallbackCache: Record<string, string> = {};

function fallbackImage(title: string) {
  if (fallbackCache[title]) return fallbackCache[title];
  const query = encodeURIComponent(title);
  const url = `https://picsum.photos/seed/${query}/1200/800`;
  fallbackCache[title] = url;
  return url;
}

export function useWikiImage(wikiTitle: string | undefined): { imageUrl: string | null; loading: boolean } {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wikiTitle) return;

    if (cache[wikiTitle]) {
      setImageUrl(cache[wikiTitle]);
      return;
    }

    setLoading(true);
    const encoded = encodeURIComponent(wikiTitle.replace(/ /g, "_"));
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&pithumbsize=600&format=json&origin=*`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Wikipedia API error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const pages = data?.query?.pages ?? {};
        const page = Object.values(pages)[0] as { thumbnail?: { source: string } } | undefined;
        const src = page?.thumbnail?.source ?? fallbackImage(wikiTitle);
        cache[wikiTitle] = src;
        setImageUrl(src);
      })
      .catch(() => {
        const src = fallbackImage(wikiTitle);
        cache[wikiTitle] = src;
        setImageUrl(src);
      })
      .finally(() => setLoading(false));
  }, [wikiTitle]);

  return { imageUrl, loading };
}
