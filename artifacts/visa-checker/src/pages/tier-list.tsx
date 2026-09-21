import { useEffect, useState } from "react";
import { Trophy, Share2, Check } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useListCountries } from "@workspace/api-client-react";

interface PassportScore { code: string; name: string; flag: string; score: number; }

// Colours only. The bands themselves (label, min, max, title, note) come from
// /api/visa/all-rankings so this page and the crawlable /tier-list the server
// renders can never disagree about which passport sits in which tier.
// Rank is an ordered scale, so it gets ONE hue getting darker — not the status
// colours. These tiers used to be amber, green, blue, violet, orange and red,
// which on this site already mean "visa on arrival", "visa-free", "eVisa" and so
// on: tier A read as "visa-free" and tier C as "eVisa". The badges were also
// white on amber-400 at about 2:1. Every badge below passes WCAG AA; the text
// flips to ink where white would not.
const TIER_STYLE: Record<string, { bg: string; border: string; badge: string }> = {
  S: { bg: "bg-card", border: "border-[#8FA0C8]", badge: "bg-[#0D1F4A] text-white" },
  A: { bg: "bg-card", border: "border-[#A9B6D6]", badge: "bg-[#1D3A7C] text-white" },
  B: { bg: "bg-card", border: "border-[#BFC8DE]", badge: "bg-[#3959A2] text-white" },
  C: { bg: "bg-card", border: "border-border", badge: "bg-[#94A6D1] text-foreground" },
  D: { bg: "bg-card", border: "border-border", badge: "bg-[#BFC8DE] text-foreground" },
  E: { bg: "bg-card", border: "border-border", badge: "bg-[#DFE3EC] text-foreground" },
};
const FALLBACK_STYLE = { bg: "bg-card", border: "border-border", badge: "bg-muted text-foreground" };

interface Tier { label: string; min: number; max: number; title: string; note: string; }

// Pre-computed from visa data (cached server-side, loaded on first visit only)
// This endpoint returns all scores at once from the in-memory cache
function useAllRankings() {
  const { data: countries = [] } = useListCountries();
  const [scores, setScores] = useState<PassportScore[] | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countries.length === 0 || scores !== null || loading) return;
    setLoading(true);
    fetch("/api/visa/all-rankings")
      .then((r) => r.json())
      .then((data: { rankings: { code: string; score: number }[]; tiers?: Tier[] }) => {
        const countryMap = new Map(countries.map((c) => [c.code, c]));
        const enriched: PassportScore[] = data.rankings
          .map((r) => {
            const c = countryMap.get(r.code);
            if (!c) return null;
            return { code: r.code, name: c.name, flag: c.flag, score: r.score };
          })
          .filter(Boolean) as PassportScore[];
        setScores(enriched);
        setTiers(data.tiers ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  return { scores: scores ?? [], tiers, loading };
}

export default function TierListPage() {
  useSEO({
    title: "Passport Tier List 2026 — Ranked S to E",
    description: "See all 195 passports ranked into S, A, B, C, D, and E tiers based on visa-free access to countries worldwide.",
  });

  const { scores, tiers, loading } = useAllRankings();
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

        {!loading && scores.length > 0 && tiers.map((tier) => {
          // Band membership comes straight from the server's min/max. The old
          // code compared against a hardcoded 185 for the top band, so the S
          // tier stayed empty no matter what the threshold was set to.
          const filteredPassports = scores.filter((s) => s.score >= tier.min && s.score <= tier.max);

          if (filteredPassports.length === 0) return null;
          const style = TIER_STYLE[tier.label] ?? FALLBACK_STYLE;

          return (
            <div key={tier.label} className={`rounded-2xl border ${style.border} ${style.bg} p-6 mb-4`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${style.badge} flex items-center justify-center font-bold text-lg`}>
                  {tier.label}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{tier.title}</p>
                  <p className="text-xs text-muted-foreground">{tier.note} · {tier.min}–{tier.max} countries accessible · {filteredPassports.length} passport{filteredPassports.length !== 1 ? "s" : ""}</p>
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
