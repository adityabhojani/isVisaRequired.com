import { useEffect, useState } from "react";

const cache: Record<string, string | null> = {};


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
        const src = page?.thumbnail?.source ?? null;
        cache[wikiTitle] = src;
        setImageUrl(src);
      })
      .catch(() => {
        const src: string | null = null;
        cache[wikiTitle] = src;
        setImageUrl(src);
      })
      .finally(() => setLoading(false));
  }, [wikiTitle]);

  return { imageUrl, loading };
}
