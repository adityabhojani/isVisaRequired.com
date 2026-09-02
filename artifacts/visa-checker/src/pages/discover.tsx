import { useState, useMemo } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header, PageHero } from "@/components/Header";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { Country, VisaResult, VisaRequirement } from "@workspace/api-client-react";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const reqConfig: Record<VisaRequirement, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  visa_free:       { label: "Visa Free",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  emoji: "✅" },
  visa_on_arrival: { label: "Visa on Arrival",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  emoji: "🟡" },
  e_visa:          { label: "eVisa",            color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   emoji: "🔵" },
  visa_required:   { label: "Visa Required",    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", emoji: "❌" },
  no_admission:    { label: "No Admission",     color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    emoji: "🚫" },
};

const REGIONS = ["All regions", "Europe", "Asia", "Americas", "Africa", "Middle East", "Oceania", "Caribbean"];

const QUICK_FILTERS = [
  { label: "🏝️ Visa-Free Only",    req: "visa_free" as VisaRequirement },
  { label: "🟡 Easy Entry",         req: "visa_on_arrival" as VisaRequirement },
  { label: "🔵 eVisa Available",    req: "e_visa" as VisaRequirement },
  { label: "❌ Need Full Visa",     req: "visa_required" as VisaRequirement },
];

export default function DiscoverPage() {
  const [passport, setPassport] = useState(() => new URLSearchParams(window.location.search).get("passport") ?? "");
  const [open, setOpen] = useState(false);
  const [reqFilter, setReqFilter] = useState<VisaRequirement | "all">("all");
  const [region, setRegion] = useState("All regions");
  const [maxStayOnly, setMaxStayOnly] = useState(false);

  const { data: countries = [] } = useListCountries();
  const passportCountry = countries.find((c) => c.code === passport);

  useSEO({
    title: passportCountry
      ? `Discover Where ${passportCountry.name} Passport Can Travel | Is Visa Required?`
      : "Discover Destinations by Visa Type | Is Visa Required?",
    description: "Filter destinations by visa type, region, and travel ease. Find your next visa-free adventure.",
    canonical: "https://www.isvisarequired.com/discover",
  });

  const { data: rawResults = [], isLoading } = useCheckVisaAll(
    { passport },
    { query: { enabled: !!passport, queryKey: getCheckVisaAllQueryKey({ passport }) } }
  );

  const results = rawResults as VisaResult[];

  const filtered = useMemo(() => {
    let list = results;
    if (reqFilter !== "all") list = list.filter((r) => r.requirement === reqFilter);
    if (region !== "All regions") {
      list = list.filter((r) => {
        const reg = r.destinationCountry.region ?? "";
        if (region === "Middle East") return reg.includes("Middle East");
        if (region === "Caribbean") return reg.includes("Caribbean") || reg.includes("Americas");
        return reg.includes(region);
      });
    }
    if (maxStayOnly) list = list.filter((r) => !!r.maxStay);
    return list.sort((a, b) => a.destinationCountry.name.localeCompare(b.destinationCountry.name));
  }, [results, reqFilter, region, maxStayOnly]);

  const counts = useMemo(() => {
    const c: Partial<Record<VisaRequirement, number>> = {};
    results.forEach((r) => { c[r.requirement] = (c[r.requirement] ?? 0) + 1; });
    return c;
  }, [results]);

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/discover" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <PageHero
          title="Discover Destinations"
          description="Filter all 195 countries by visa type, region, and more"
        />

        {/* Controls */}
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden mb-8">
          <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/30" />
          <div className="p-6 space-y-5">
            {/* Passport picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your Passport</label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-80 justify-between h-12 font-normal text-base border-border bg-card">
                    {passportCountry ? (
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{passportCountry.flag}</span>
                        <span className="font-medium">{passportCountry.name}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Select your passport…</span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search countries…" className="h-10" />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((c) => (
                          <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                            onSelect={() => { setPassport(c.code); setOpen(false); }}>
                            <span className="mr-2 text-lg">{c.flag}</span>
                            <span>{c.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Quick filters */}
            {passport && results.length > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5 block">Visa Type</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setReqFilter("all")}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        reqFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:border-border"
                      }`}>
                      All ({results.length})
                    </button>
                    {QUICK_FILTERS.map(({ label, req }) => (
                      <button key={req} onClick={() => setReqFilter(req === reqFilter ? "all" : req)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          reqFilter === req
                            ? `${reqConfig[req].color} ${reqConfig[req].bg} ${reqConfig[req].border}`
                            : "bg-muted border-border text-muted-foreground hover:border-border"
                        }`}>
                        {label} {counts[req] ? `(${counts[req]})` : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5 block">Region</label>
                  <div className="flex flex-wrap gap-1.5">
                    {REGIONS.map((r) => (
                      <button key={r} onClick={() => setRegion(r)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          region === r
                            ? "bg-foreground text-background border-foreground"
                            : "bg-muted border-border text-muted-foreground hover:border-border"
                        }`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && passport && (
          <div className="text-center py-16 text-muted-foreground">
            <span className="inline-block h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Results */}
        {filtered.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{filtered.length}</strong> destinations
              </p>
              <a href={`/?passport=${passport}&destinations=${filtered.slice(0, 20).map(r => r.destinationCountry.code).join(",")}`}
                className="text-xs text-primary font-medium hover:underline underline-offset-2">
                Check top 20 in the checker →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filtered.map((r) => {
                const cfg = reqConfig[r.requirement];
                return (
                  <a
                    key={r.destinationCountry.code}
                    href={`/?passport=${passport}&destinations=${r.destinationCountry.code}`}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm hover:-translate-y-px ${cfg.border} ${cfg.bg}`}
                  >
                    <span className="text-2xl flex-shrink-0 leading-none">{r.destinationCountry.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{r.destinationCountry.name}</div>
                      {r.maxStay && <div className="text-xs text-muted-foreground">{r.maxStay}</div>}
                    </div>
                    <span className={`text-sm flex-shrink-0`}>{cfg.emoji}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {passport && !isLoading && results.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No countries match this filter</p>
            <button onClick={() => { setReqFilter("all"); setRegion("All regions"); }}
              className="text-sm text-primary mt-2 underline underline-offset-2">Clear filters</button>
          </div>
        )}

        {!passport && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="h-10 w-10 text-violet-400" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">Select your passport</p>
            <p className="text-sm">Filter all 195 countries by visa type and region</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
