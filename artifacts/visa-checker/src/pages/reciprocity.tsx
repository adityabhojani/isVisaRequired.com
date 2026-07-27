import { useState, useMemo, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { VisaResult, VisaRequirement } from "@workspace/api-client-react";
import { ArrowLeftRight, CheckCircle2, Clock, Shield, AlertCircle, XCircle, ChevronDown, Globe, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const reqConfig: Record<VisaRequirement, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  visa_free:       { label: "Visa Free",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: CheckCircle2 },
  visa_on_arrival: { label: "Visa on Arrival",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock },
  e_visa:          { label: "eVisa",            color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   icon: Shield },
  visa_required:   { label: "Visa Required",    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: AlertCircle },
  no_admission:    { label: "No Admission",     color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: XCircle },
};

type ReciprocityStatus = "mutual_free" | "one_way_free" | "mutual_visa" | "asymmetric" | "no_admission";

function getReciprocityStatus(a: VisaRequirement | undefined, b: VisaRequirement | undefined): ReciprocityStatus {
  const free = (r?: VisaRequirement) => r === "visa_free" || r === "visa_on_arrival" || r === "e_visa";
  const hardNo = (r?: VisaRequirement) => r === "no_admission";

  if (hardNo(a) || hardNo(b)) return "no_admission";
  if (free(a) && free(b)) return "mutual_free";
  if (!free(a) && !free(b)) return "mutual_visa";
  if (free(a) && !free(b)) return "one_way_free";
  return "asymmetric"; // b free, a not
}

const reciprocityLabels: Record<ReciprocityStatus, { label: string; color: string; bg: string; border: string; icon: string }> = {
  mutual_free:    { label: "Mutual Visa-Free", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", icon: "✅" },
  one_way_free:   { label: "One-way Free",     color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-300",   icon: "↔️" },
  asymmetric:     { label: "One-way Free",     color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-300",   icon: "↔️" },
  mutual_visa:    { label: "Both Need Visa",   color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-300",  icon: "📋" },
  no_admission:   { label: "No Admission",     color: "text-red-700",     bg: "bg-red-50",     border: "border-red-300",     icon: "🚫" },
};

function CountrySelect({ value, onChange, countries, placeholder, isLoading }: {
  value: string;
  onChange: (code: string) => void;
  countries: { code: string; name: string; flag: string }[];
  placeholder: string;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = countries.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox"
          className="w-full justify-between h-14 text-left font-normal text-base border-border bg-card hover:bg-secondary/50">
          {selected ? (
            <span className="flex items-center gap-2">
              <span className="text-2xl">{selected.flag}</span>
              <span className="font-medium">{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." className="h-10" />
          <CommandList>
            <CommandEmpty>{isLoading ? "Loading..." : "No country found."}</CommandEmpty>
            <CommandGroup>
              {countries.map((c) => (
                <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                  onSelect={() => { onChange(c.code); setOpen(false); }}
                  className="cursor-pointer">
                  <span className="mr-2 text-lg">{c.flag}</span>
                  <span>{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{c.code}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ReciprocityPage() {
  useSEO({
    title: "Visa Reciprocity Checker — Are Visa Policies Mutual?",
    description:
      "Check if two countries have mutual visa-free access or if one country requires a visa while the other doesn't. Explore visa reciprocity for all passport pairs.",
  });

  const [passportA, setPassportA] = useState("US");
  const [passportB, setPassportB] = useState("CN");

  // Honour deep links, e.g. /reciprocity?passportA=JP&passportB=US
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = params.get("passportA");
    const b = params.get("passportB");
    if (a) setPassportA(a.toUpperCase());
    if (b) setPassportB(b.toUpperCase());
  }, []);

  const { data: countries = [], isLoading: countriesLoading } = useListCountries();

  // Get all visa results for passport A (as origin) to see what A can access
  const { data: resultsA = [], isLoading: loadingA } = useCheckVisaAll(
    { passport: passportA },
    { query: { enabled: !!passportA, queryKey: getCheckVisaAllQueryKey({ passport: passportA }) } }
  );

  // Get all visa results for passport B (as origin) to see what B can access
  const { data: resultsB = [], isLoading: loadingB } = useCheckVisaAll(
    { passport: passportB },
    { query: { enabled: !!passportB, queryKey: getCheckVisaAllQueryKey({ passport: passportB }) } }
  );

  const isLoading = loadingA || loadingB;

  const countryA = countries.find((c) => c.code === passportA);
  const countryB = countries.find((c) => c.code === passportB);

  // What does A need to enter B?
  const aEntersB = useMemo(() => {
    return (resultsA as VisaResult[]).find((r) => r.destinationCountry.code === passportB);
  }, [resultsA, passportB]);

  // What does B need to enter A?
  const bEntersA = useMemo(() => {
    return (resultsB as VisaResult[]).find((r) => r.destinationCountry.code === passportA);
  }, [resultsB, passportA]);

  const reciprocityStatus = getReciprocityStatus(aEntersB?.requirement, bEntersA?.requirement);
  const reciprocityInfo = reciprocityLabels[reciprocityStatus];

  // Build a comprehensive comparison table of all shared destinations
  const sharedComparison = useMemo(() => {
    if (!resultsA.length || !resultsB.length) return [];

    const bMap = new Map<string, VisaRequirement>();
    (resultsB as VisaResult[]).forEach((r) => bMap.set(r.destinationCountry.code, r.requirement));

    return (resultsA as VisaResult[]).map((rA) => {
      const reqB = bMap.get(rA.destinationCountry.code);
      const status = getReciprocityStatus(rA.requirement, reqB);
      return {
        country: rA.destinationCountry,
        reqA: rA.requirement,
        reqB,
        status,
      };
    }).filter((row) => row.reqB !== undefined);
  }, [resultsA, resultsB]);

  const groupedComparison = useMemo(() => {
    const groups: Record<ReciprocityStatus, typeof sharedComparison> = {
      mutual_free: [],
      one_way_free: [],
      asymmetric: [],
      mutual_visa: [],
      no_admission: [],
    };
    sharedComparison.forEach((row) => {
      groups[row.status].push(row);
    });
    return groups;
  }, [sharedComparison]);

  const swap = () => {
    setPassportA(passportB);
    setPassportB(passportA);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/reciprocity" />

      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-50/80 via-primary/4 to-transparent border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3.5 py-1 text-xs font-semibold mb-4 border border-blue-200">
            <ArrowLeftRight className="h-3 w-3" />
            Reciprocity · Are policies mutual?
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Visa Reciprocity Checker
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Select two passports to see if their visa policies are mutual — or if one country gets better treatment than the other.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Selector card */}
        <div className="bg-card rounded-2xl border border-border/70 shadow-sm overflow-hidden mb-8">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-primary/70 to-violet-400/70" />
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Passport A
                </label>
                <CountrySelect
                  value={passportA}
                  onChange={setPassportA}
                  countries={countries}
                  placeholder="Select passport…"
                  isLoading={countriesLoading}
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={swap}
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                  title="Swap passports"
                >
                  <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Passport B
                </label>
                <CountrySelect
                  value={passportB}
                  onChange={setPassportB}
                  countries={countries}
                  placeholder="Select passport…"
                  isLoading={countriesLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main reciprocity result */}
        {countryA && countryB && (
          <div className={`rounded-2xl border-2 p-6 mb-8 ${reciprocityInfo.border} ${reciprocityInfo.bg}`}>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="text-center flex-1">
                <span className="text-5xl">{countryA.flag}</span>
                <p className="font-semibold text-foreground mt-1">{countryA.name}</p>
                <p className="text-xs text-muted-foreground">holders travelling to {countryB.name}</p>
                {aEntersB && (() => {
                  const cfg = reqConfig[aEntersB.requirement];
                  const Icon = cfg.icon;
                  return (
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </div>
                  );
                })()}
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{reciprocityInfo.icon}</span>
                <span className={`text-sm font-bold ${reciprocityInfo.color}`}>{reciprocityInfo.label}</span>
              </div>

              <div className="text-center flex-1">
                <span className="text-5xl">{countryB.flag}</span>
                <p className="font-semibold text-foreground mt-1">{countryB.name}</p>
                <p className="text-xs text-muted-foreground">holders travelling to {countryA.name}</p>
                {bEntersA && (() => {
                  const cfg = reqConfig[bEntersA.requirement];
                  const Icon = cfg.icon;
                  return (
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </div>
                  );
                })()}
              </div>
            </div>

            {reciprocityStatus === "mutual_free" && (
              <p className={`text-sm text-center ${reciprocityInfo.color} font-medium`}>
                Both passports enjoy visa-free (or equivalent) access to each other's country. 🎉
              </p>
            )}
            {(reciprocityStatus === "one_way_free" || reciprocityStatus === "asymmetric") && (
              <div className={`flex items-start gap-2 text-sm ${reciprocityInfo.color}`}>
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  These countries do not have a <strong>mutual</strong> visa arrangement.
                  One passport gets easier access than the other.
                </p>
              </div>
            )}
            {reciprocityStatus === "mutual_visa" && (
              <div className="flex items-start gap-2 text-sm text-orange-700">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  Both passports require a visa to visit each other's country.
                  At least the policy is symmetric!
                </p>
              </div>
            )}
          </div>
        )}

        <AdSlot slotId="5938274612" size="responsive" className="mb-8" />

        {/* Full comparison table */}
        {!isLoading && sharedComparison.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              All Destinations Compared
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              How do {countryA?.name} and {countryB?.name} passports compare across all {sharedComparison.length} shared destinations?
            </p>

            {/* Summary tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
              {([
                ["mutual_free", "Both Visa-Free"],
                ["one_way_free", "One-Way Free"],
                ["mutual_visa", "Both Need Visa"],
                ["no_admission", "No Admission"],
              ] as [ReciprocityStatus, string][]).map(([status, label]) => {
                const info = reciprocityLabels[status];
                const count = groupedComparison[status].length + (status === "one_way_free" ? groupedComparison.asymmetric.length : 0);
                return (
                  <div key={status} className={`rounded-xl border p-3 ${info.border} ${info.bg}`}>
                    <p className={`text-2xl font-bold ${info.color}`}>{count}</p>
                    <p className={`text-xs mt-0.5 ${info.color}`}>{label}</p>
                  </div>
                );
              })}
            </div>

            {/* Grouped results */}
            {(["mutual_free", "one_way_free", "asymmetric", "mutual_visa", "no_admission"] as ReciprocityStatus[]).map((status) => {
              const group = groupedComparison[status];
              if (!group.length) return null;
              const info = reciprocityLabels[status];
              return (
                <div key={status} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{info.icon}</span>
                    <h3 className={`font-semibold ${info.color}`}>{info.label}</h3>
                    <span className="text-xs text-muted-foreground">({group.length} countries)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.map((row) => {
                      const cfgA = reqConfig[row.reqA];
                      const cfgB = row.reqB ? reqConfig[row.reqB] : null;
                      const IconA = cfgA.icon;
                      const IconB = cfgB?.icon;
                      return (
                        <a key={row.country.code}
                          href={`/destination/${row.country.code}`}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:brightness-[0.97] ${info.border} ${info.bg}`}>
                          <span className="text-2xl flex-shrink-0">{row.country.flag}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{row.country.name}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium border ${cfgA.color} ${cfgA.border} bg-white/70`}>
                              <IconA className="h-3 w-3" />
                              <span className="hidden sm:inline">{countryA?.flag}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">/</span>
                            {cfgB && IconB && (
                              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium border ${cfgB.color} ${cfgB.border} bg-white/70`}>
                                <IconB className="h-3 w-3" />
                                <span className="hidden sm:inline">{countryB?.flag}</span>
                              </div>
                            )}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        )}

        {/* Info box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">About Visa Reciprocity</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Visa reciprocity means that countries apply similar entry requirements to each other's citizens.
                When Country A allows Country B passport holders visa-free entry, true reciprocity means Country B does the same for Country A holders.
                Many bilateral agreements are asymmetric — especially between powerful and weaker passports.
                Data is indicative only; always verify with official embassy sources.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
