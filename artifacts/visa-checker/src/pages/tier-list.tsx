import { useEffect, useState } from "react";
import { Trophy, Share2, Check } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useListCountries } from "@workspace/api-client-react";

interface PassportScore { code: string; name: string; flag: string; score: number; }

const TIER_CONFIG = [
  { label: "S", min: 185, bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-400 text-white", title: "World Elite", subtitle: "Near-universal access" },
  { label: "A", min: 165, bg: "bg-green-50", border: "border-green-300", badge: "bg-green-500 text-white", title: "Highly Powerful", subtitle: "Excellent global mobility" },
  { label: "B", min: 145, bg: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-500 text-white", title: "Strong", subtitle: "Strong global access" },
  { label: "C", min: 125, bg: "bg-violet-50", border: "border-violet-300", badge: "bg-violet-500 text-white", title: "Average", subtitle: "Moderate travel freedom" },
  { label: "D", min: 100, bg: "bg-orange-50", border: "border-orange-300", badge: "bg-orange-500 text-white", title: "Below Average", subtitle: "Limited access" },
  { label: "E", min: 0, bg: "bg-red-50", border: "border-red-300", badge: "bg-red-500 text-white", title: "Restricted", subtitle: "Significant travel restrictions" },
];

// Pre-computed from visa data (cached server-side, loaded on first visit only)
// This endpoint returns all scores at once from the in-memory cache
function useAllRankings() {
  const { data: countries = [] } = useListCountries();
  const [scores, setScores] = useState<PassportScore[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countries.length === 0 || scores !== null || loading) return;
    setLoading(true);
    fetch("/api/visa/all-rankings")
      .then((r) => r.json())
      .then((data: { rankings: { code: string; score: number }[] }) => {
        const countryMap = new Map(countries.map((c) => [c.code, c]));
        const enriched: PassportScore[] = data.rankings
          .map((r) => {
            const c = countryMap.get(r.code);
            if (!c) return null;
            return { code: r.code, name: c.name, flag: c.flag, score: r.score };
          })
          .filter(Boolean) as PassportScore[];
        setScores(enriched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  return { scores: scores ?? [], loading };
}

export default function TierListPage() {
  useSEO({
    title: "Passport Tier List 2026 — Ranked S to E",
    description: "See all 195 passports ranked into S, A, B, C, D, and E tiers based on visa-free access to countries worldwide.",
  });

  const { scores, loading } = useAllRankings();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/tier-list" extra={
        <button onClick={share}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-secondary/50 transition-colors ml-1">
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Share2 className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
        </button>
      } />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Passport Tier List 2026</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">All 195 passports ranked by the number of countries accessible without requiring a visa in advance (visa-free + visa on arrival + eVisa).</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        )}

        {!loading && scores.length > 0 && TIER_CONFIG.map((tier, ti) => {
          const filteredPassports = scores.filter((s) => {
            const above = ti === 0 ? 185 : TIER_CONFIG[ti].min;
            const below = ti === 0 ? Infinity : (TIER_CONFIG[ti - 1]?.min ?? Infinity);
            return s.score >= above && s.score < below;
          });

          if (filteredPassports.length === 0) return null;

          return (
            <div key={tier.label} className={`rounded-2xl border ${tier.border} ${tier.bg} p-6 mb-4`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${tier.badge} flex items-center justify-center font-bold text-lg`}>
                  {tier.label}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{tier.title}</p>
                  <p className="text-xs text-muted-foreground">{tier.subtitle} · {TIER_CONFIG[ti].min}{ti === TIER_CONFIG.length - 1 ? "–99" : `–${(TIER_CONFIG[ti-1]?.min ?? 200) - 1}`} countries accessible · {filteredPassports.length} passport{filteredPassports.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredPassports.map((p) => (
                  <a key={p.code} href={`/passport/${p.code}`}
                    className="flex items-center gap-1.5 bg-white/70 hover:bg-white border border-white/50 rounded-full px-3 py-1.5 text-sm transition-colors group"
                    title={`${p.name} — ${p.score} countries accessible`}>
                    <span className="text-base">{p.flag}</span>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors text-xs">{p.name}</span>
                    <span className="text-muted-foreground text-xs">({p.score})</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Rankings based on ilyankou/passport-index-dataset · Score = countries accessible without prior embassy visa (visa-free + visa on arrival + eVisa)
        </p>
      </main>

      <Footer />
    </div>
  );
}
