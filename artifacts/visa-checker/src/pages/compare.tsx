import { useState, useMemo } from "react";
import { ArrowLeftRight, Trophy, Minus } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header, PageHero } from "@/components/Header";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { VisaResult, VisaRequirement } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { PassportPicker } from "@/components/PassportPicker";
import { trackEvent } from "@/lib/analytics";
import { reqConfig, requirementOrder, styleForResult, type RequirementStyle } from "@/lib/requirement";

function compare(a: VisaRequirement, b: VisaRequirement): "A" | "B" | "tie" {
  const ia = requirementOrder.indexOf(a);
  const ib = requirementOrder.indexOf(b);
  if (ia < ib) return "A";
  if (ib < ia) return "B";
  return "tie";
}

function StatBox({ req, value, winner }: { req: VisaRequirement; value: number; winner: "A" | "B" | "tie" | "none" }) {
  const isWinner = winner !== "none" && winner !== "tie";
  const cfg = reqConfig[req];
  const Icon = cfg.icon;
  return (
    <div className={`text-center p-3 rounded-xl border ${isWinner ? "bg-primary/5 border-primary/30" : "bg-muted/40 border-border"}`}>
      <div className={`text-2xl font-bold ${isWinner ? "text-primary" : "text-foreground"}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5 inline-flex items-center justify-center gap-1">
        <Icon className={`h-3 w-3 shrink-0 ${cfg.color}`} aria-hidden="true" />
        {cfg.label}
      </div>
      {isWinner && <div className="text-xs text-primary font-semibold mt-1">✓ Better</div>}
    </div>
  );
}

function StatusWord({ style }: { style: RequirementStyle }) {
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${style.color}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {style.label}
    </span>
  );
}

export default function ComparePage() {
  const [passportA, setPassportA] = useState(() => new URLSearchParams(window.location.search).get("a") ?? "");
  const [passportB, setPassportB] = useState(() => new URLSearchParams(window.location.search).get("b") ?? "");

  const { data: countries = [] } = useListCountries();
  const countryA = countries.find((c) => c.code === passportA);
  const countryB = countries.find((c) => c.code === passportB);

  useSEO({
    title: countryA && countryB
      ? `${countryA.name} vs ${countryB.name} Passport — Visa Access Comparison | Is Visa Required?`
      : "Compare Passport Visa Access | Is Visa Required?",
    description: countryA && countryB
      ? `Side-by-side visa access comparison: ${countryA.name} passport vs ${countryB.name} passport. See which passport opens more doors worldwide.`
      : "Compare two passports side-by-side to see which has better visa-free access across 195 countries.",
    canonical: "https://www.isvisarequired.com/compare",
  });

  const { data: rawA = [], isLoading: loadingA } = useCheckVisaAll(
    { passport: passportA },
    { query: { enabled: !!passportA, queryKey: getCheckVisaAllQueryKey({ passport: passportA }) } }
  );
  const { data: rawB = [], isLoading: loadingB } = useCheckVisaAll(
    { passport: passportB },
    { query: { enabled: !!passportB, queryKey: getCheckVisaAllQueryKey({ passport: passportB }) } }
  );

  const resultsA = rawA as VisaResult[];
  const resultsB = rawB as VisaResult[];

  const statsA = useMemo(() => {
    const s: Partial<Record<VisaRequirement, number>> = {};
    resultsA.forEach((r) => { s[r.requirement] = (s[r.requirement] ?? 0) + 1; });
    return s;
  }, [resultsA]);

  const statsB = useMemo(() => {
    const s: Partial<Record<VisaRequirement, number>> = {};
    resultsB.forEach((r) => { s[r.requirement] = (s[r.requirement] ?? 0) + 1; });
    return s;
  }, [resultsB]);

  const comparison = useMemo(() => {
    if (!resultsA.length || !resultsB.length) return [];
    const mapB = new Map(resultsB.map((r) => [r.destinationCountry.code, r]));
    return resultsA
      .map((ra) => {
        const rb = mapB.get(ra.destinationCountry.code);
        if (!rb) return null;
        const winner = compare(ra.requirement, rb.requirement);
        return {
          country: ra.destinationCountry, reqA: ra.requirement, reqB: rb.requirement, winner,
          styleA: styleForResult(ra.requirement, ra.notes, ra.maxStay),
          styleB: styleForResult(rb.requirement, rb.notes, rb.maxStay),
        };
      })
      .filter(Boolean) as {
        country: VisaResult["destinationCountry"]; reqA: VisaRequirement; reqB: VisaRequirement; winner: "A" | "B" | "tie";
        styleA: RequirementStyle; styleB: RequirementStyle;
      }[];
  }, [resultsA, resultsB]);

  const aWins = comparison.filter((c) => c.winner === "A");
  const bWins = comparison.filter((c) => c.winner === "B");
  const tied = comparison.filter((c) => c.winner === "tie");
  const overallWinner = aWins.length > bWins.length ? "A" : bWins.length > aWins.length ? "B" : "tie";

  const updateUrl = (a: string, b: string) => {
    const p = new URLSearchParams();
    if (a) p.set("a", a);
    if (b) p.set("b", b);
    window.history.replaceState({}, "", p.toString() ? `?${p}` : window.location.pathname);
  };

  const handleCompare = () => {
    updateUrl(passportA, passportB);
    trackEvent("passport_compare", { passport_a: passportA, passport_b: passportB });
  };

  const isReady = passportA && passportB && resultsA.length > 0 && resultsB.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/compare" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <PageHero
          title="Passport Showdown"
          description="Compare visa-free access for any two passports across 195 countries"
        />

        {/* Selector card */}
        <div className="bg-card rounded-2xl border border-border/70 shadow-sm ring-1 ring-[rgb(15_23_41/0.06)] overflow-hidden mb-8">
          <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
            <PassportPicker value={passportA} onChange={setPassportA} countries={countries} exclude={[passportB]} label="First Passport" />
            <div className="flex items-center justify-center pb-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <PassportPicker value={passportB} onChange={setPassportB} countries={countries} exclude={[passportA]} label="Second Passport" />
          </div>
          <Button
            onClick={handleCompare}
            disabled={!passportA || !passportB}
            className="w-full mt-4 h-12 font-semibold bg-primary text-primary-foreground"
          >
            Compare Passports
          </Button>
          </div>
        </div>

        <p className="-mt-4 mb-8 text-center text-sm text-muted-foreground">
          Hold both passports?{" "}
          <a href={`/dual-citizenship${passportA && passportB ? `?p=${passportA},${passportB}` : ""}`} className="font-medium text-primary hover:underline">
            See everywhere you can go with them combined →
          </a>
        </p>

        {/* Loading */}
        {(loadingA || loadingB) && passportA && passportB && (
          <div className="text-center py-12 text-muted-foreground">
            <span className="inline-block h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="mt-3 text-sm">Loading passport data…</p>
          </div>
        )}

        {/* Results */}
        {isReady && (
          <div className="space-y-8">
            {/* Winner banner */}
            {overallWinner !== "tie" && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                <Trophy className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground text-lg">
                    {overallWinner === "A" ? countryA?.flag : countryB?.flag}{" "}
                    {overallWinner === "A" ? countryA?.name : countryB?.name} wins overall
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Better access in {overallWinner === "A" ? aWins.length : bWins.length} countries vs {overallWinner === "A" ? bWins.length : aWins.length}
                  </p>
                </div>
              </div>
            )}

            {/* Side-by-side stats */}
            <div className="grid grid-cols-[1fr_2px_1fr] gap-0">
              {/* Passport A stats */}
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">{countryA?.flag}</span>
                  <div>
                    <div className="font-bold text-foreground">{countryA?.name}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Passport</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {requirementOrder.map((req) => {
                    const cntA = statsA[req] ?? 0;
                    const cntB = statsB[req] ?? 0;
                    const w = req === "visa_free" || req === "visa_on_arrival"
                      ? (cntA > cntB ? "A" : cntA < cntB ? "B" : "tie")
                      : (cntA < cntB ? "A" : cntA > cntB ? "B" : "tie");
                    return <StatBox key={req} req={req} value={cntA} winner={w === "A" ? "A" : "none"} />;
                  })}
                </div>
              </div>
              {/* Divider */}
              <div className="bg-border" />
              {/* Passport B stats */}
              <div className="pl-6">
                <div className="flex items-center gap-2 mb-4 justify-end">
                  <div className="text-right">
                    <div className="font-bold text-foreground">{countryB?.name}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Passport</div>
                  </div>
                  <span className="text-3xl">{countryB?.flag}</span>
                </div>
                <div className="space-y-2">
                  {requirementOrder.map((req) => {
                    const cntA = statsA[req] ?? 0;
                    const cntB = statsB[req] ?? 0;
                    const w = req === "visa_free" || req === "visa_on_arrival"
                      ? (cntA > cntB ? "A" : cntA < cntB ? "B" : "tie")
                      : (cntA < cntB ? "A" : cntA > cntB ? "B" : "tie");
                    return <StatBox key={req} req={req} value={cntB} winner={w === "B" ? "B" : "none"} />;
                  })}
                </div>
              </div>
            </div>

            {/* Advantage sections */}
            {aWins.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span>{countryA?.flag}</span>
                  <span>{countryA?.name} has better access in {aWins.length} countries</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aWins.map(({ country, styleA, styleB }) => (
                    <a key={country.code} href={`/?passport=${passportA}&destinations=${country.code}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/50 transition-colors text-left">
                      <span className="text-2xl">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{country.name}</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <StatusWord style={styleA} />
                          <span className="text-xs text-muted-foreground">vs</span>
                          <StatusWord style={styleB} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {bWins.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span>{countryB?.flag}</span>
                  <span>{countryB?.name} has better access in {bWins.length} countries</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bWins.map(({ country, styleA, styleB }) => (
                    <a key={country.code} href={`/?passport=${passportB}&destinations=${country.code}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/50 transition-colors text-left">
                      <span className="text-2xl">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{country.name}</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <StatusWord style={styleB} />
                          <span className="text-xs text-muted-foreground">vs</span>
                          <StatusWord style={styleA} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {tied.length > 0 && (
              <section>
                <h2 className="font-serif text-base font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Minus className="h-4 w-4" />
                  Equal access in {tied.length} countries
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tied.slice(0, 40).map(({ country, reqA, styleA, styleB }) => {
                    // Tied on the stored requirement. Show the finer verdict (e.g. ETA)
                    // only when both passports get it; otherwise the shared requirement.
                    const s = styleA === styleB ? styleA : reqConfig[reqA];
                    const Icon = s.icon;
                    return (
                      <span key={country.code}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.color} ${s.bg} ${s.border}`}>
                        {country.flag} {country.name}
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {s.short}
                      </span>
                    );
                  })}
                  {tied.length > 40 && (
                    <span className="text-xs text-muted-foreground self-center">+ {tied.length - 40} more</span>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {!passportA && !passportB && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mx-auto mb-5">
              <ArrowLeftRight className="h-10 w-10 text-primary/40" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">Select two passports to compare</p>
            <p className="text-sm">See exactly where each passport has an advantage</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
