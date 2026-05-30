import { useState, useMemo, useEffect, useCallback } from "react";
import { Globe, CheckCircle2, Lock, Search, MapPin, TrendingUp, Download } from "lucide-react";
import { useUser, useClerk } from "@clerk/react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useListCountries } from "@workspace/api-client-react";

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function MyTravelsPage() {
  useSEO({
    title: "My Travel Map — Countries I've Visited",
    description: "Track all the countries you've visited, see your travel score, and save your progress. Create a free account to save your travel history.",
  });

  const { user, isLoaded } = useUser();
  const { openSignUp } = useClerk();
  const { data: countries = [] } = useListCountries();

  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [loaded, setLoaded] = useState(false);

  // Load visited countries from API (if logged in) or localStorage (if not)
  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      fetch("/api/user/visited-countries", { credentials: "include" })
        .then((r) => r.json())
        .then((d: { visited: string[] }) => {
          setVisited(new Set(d.visited ?? []));
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    } else {
      try {
        const saved = localStorage.getItem("my_travels");
        if (saved) setVisited(new Set(JSON.parse(saved) as string[]));
      } catch { /* ignore */ }
      setLoaded(true);
    }
  }, [user, isLoaded]);

  const toggle = useCallback(async (code: string) => {
    const isVisited = visited.has(code);
    const next = new Set(visited);
    if (isVisited) next.delete(code); else next.add(code);
    setVisited(next);

    if (user) {
      setSaving((s) => ({ ...s, [code]: true }));
      setSaveError(null);
      try {
        let res: Response;
        if (isVisited) {
          res = await fetch(`/api/user/visited-countries/${code}`, { method: "DELETE", credentials: "include" });
        } else {
          res = await fetch("/api/user/visited-countries", {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }
      } catch (err) {
        setVisited(visited); // revert optimistic update
        setSaveError(err instanceof Error ? err.message : "Could not save. Please try again.");
      }
      setSaving((s) => ({ ...s, [code]: false }));
    } else {
      try { localStorage.setItem("my_travels", JSON.stringify([...next])); } catch { /* ignore */ }
    }
  }, [visited, user]);

  const filtered = useMemo(() => {
    return countries
      .filter((c) => region === "All" || c.region === region)
      .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  }, [countries, region, search]);

  const stats = useMemo(() => {
    const total = countries.length;
    const count = visited.size;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    const byRegion = REGIONS.slice(1).map((r) => ({
      region: r,
      total: countries.filter((c) => c.region === r).length,
      visited: countries.filter((c) => c.region === r && visited.has(c.code)).length,
    }));
    return { total, count, pct, byRegion };
  }, [countries, visited]);

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/my-travels" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-7 w-7 text-primary" />
              My Travels
            </h1>
            <p className="text-muted-foreground mt-1">Check off every country you've visited and track your travel score.</p>
          </div>
          <div className="flex items-center gap-2">
            {visited.size > 0 && (
              <button
                onClick={() => {
                  const rows = [
                    ["Country", "Code", "Region"],
                    ...countries
                      .filter((c) => visited.has(c.code))
                      .map((c) => [c.name, c.code, c.region ?? ""]),
                  ];
                  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `my-travels-${new Date().toISOString().slice(0, 10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            )}
            {!user && isLoaded && (
              <button onClick={() => openSignUp({})}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors">
                <Lock className="h-4 w-4" />
                Sign up to save progress
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl border border-border/70 p-4 shadow-sm">
            <p className="text-3xl font-bold text-primary">{stats.count}</p>
            <p className="text-sm text-muted-foreground mt-1">Countries visited</p>
          </div>
          <div className="bg-card rounded-2xl border border-border/70 p-4 shadow-sm">
            <p className="text-3xl font-bold text-foreground">{stats.pct}%</p>
            <p className="text-sm text-muted-foreground mt-1">Of the world</p>
          </div>
          <div className="bg-card rounded-2xl border border-border/70 p-4 col-span-2 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />By region
            </p>
            <div className="space-y-1.5">
              {stats.byRegion.map((r) => (
                <div key={r.region} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">{r.region}</span>
                  <div className="flex-1 bg-secondary/60 rounded-full h-1.5">
                    <div className="bg-primary rounded-full h-1.5 transition-all"
                      style={{ width: r.total > 0 ? `${Math.round((r.visited / r.total) * 100)}%` : "0%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">{r.visited}/{r.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save error */}
        {saveError && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm mb-4">
            <span className="text-red-500 text-base leading-none flex-shrink-0">⚠</span>
            <span className="flex-1">{saveError}</span>
            <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
          </div>
        )}

        {/* Save prompt for guests */}
        {!user && isLoaded && stats.count > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Create a free account to save your progress</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your {stats.count} visited countr{stats.count === 1 ? "y" : "ies"} {stats.count === 1 ? "is" : "are"} stored locally — sign up to save them permanently across devices.</p>
            </div>
            <button onClick={() => openSignUp({})}
              className="flex-shrink-0 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Sign up free
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {REGIONS.map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-3 py-2 text-xs font-medium rounded-xl transition-colors ${region === r ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-foreground hover:bg-secondary"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Country grid */}
        {loaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map((c) => {
              const isVisited = visited.has(c.code);
              const isSaving = saving[c.code];
              return (
                <button key={c.code} onClick={() => toggle(c.code)} disabled={isSaving}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isVisited
                      ? "border-green-300 bg-green-50 hover:bg-green-100 shadow-sm"
                      : "border-border/70 bg-card hover:bg-secondary/30"
                  }`}>
                  <span className="text-2xl flex-shrink-0">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isVisited ? "text-green-800" : "text-foreground"}`}>{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.region}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    isVisited ? "border-green-500 bg-green-500" : "border-border"
                  }`}>
                    {isVisited && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        )}

        {filtered.length === 0 && loaded && (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No countries found matching your search.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
