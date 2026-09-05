import { Clock } from "lucide-react";
import { useWikiImage } from "@/hooks/useWikiImage";
import type { Attraction } from "@workspace/api-client-react";

const typeColors: Record<string, string> = {
  landmark: "bg-blue-500/90 text-white",
  nature: "bg-emerald-500/90 text-white",
  museum: "bg-purple-500/90 text-white",
  beach: "bg-cyan-500/90 text-white",
  city: "bg-amber-500/90 text-white",
  heritage: "bg-orange-500/90 text-white",
  temple: "bg-rose-500/90 text-white",
};

const typeLabels: Record<string, string> = {
  landmark: "Landmark",
  nature: "Nature",
  museum: "Museum",
  beach: "Beach",
  city: "City",
  heritage: "Heritage",
  temple: "Temple",
};

export function AttractionCard({ attraction }: { attraction: Attraction }) {
  const { imageUrl } = useWikiImage(attraction.wikiTitle);
  
  return (
    <div className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative h-48 bg-secondary overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={attraction.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-48 bg-secondary" aria-hidden="true" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute top-2.5 left-2.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${typeColors[attraction.type] ?? "bg-slate-500/90 text-white"}`}>
            {typeLabels[attraction.type] ?? attraction.type}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-4">
          <h4 className="font-semibold text-white text-sm leading-tight drop-shadow">{attraction.name}</h4>
        </div>
      </div>

      <div className="p-3 pt-2.5">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{attraction.description}</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          <span>{attraction.visitDuration}</span>
        </div>
      </div>
    </div>
  );
}
