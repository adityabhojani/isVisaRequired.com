import { useState, useMemo, lazy, Suspense, useEffect, useRef } from "react";
import { useSEO } from "@/hooks/useSEO";
import { useQuery } from "@tanstack/react-query";
import {
  useListCountries,
  useCheckVisaMultiple,
  useCheckVisaAll,
  getCheckVisaAllQueryKey,
} from "@workspace/api-client-react";
import type { Country, VisaResult, VisaRequirement } from "@workspace/api-client-react";
import {
  Search, Globe, ChevronDown, X, CheckCircle2, AlertCircle, Clock,
  XCircle, Shield, ArrowUpDown, ChevronRight, ChevronUp,
  Share2, Link2, Check as CheckIcon, Plane, Users, Zap, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TripSummary } from "@/components/TripSummary";
import { DestinationDetailExpanded } from "@/components/DestinationDetailExpanded";
import { MysteryDestination } from "@/components/MysteryDestination";
import { MultiAlertSubscribeWidget } from "@/components/AlertSubscribeWidget";
import { AdSlot } from "@/components/AdSlot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { trackEvent } from "@/lib/analytics";

const WorldMap = lazy(() => import("@/components/WorldMap"));

const requirementOrder: VisaRequirement[] = [
  "visa_free", "visa_on_arrival", "e_visa", "visa_required", "no_admission",
];

const reqConfig: Record<VisaRequirement, {
  label: string; color: string; bg: string; border: string; dotColor: string; icon: typeof CheckCircle2;
}> = {
  visa_free:       { label: "Visa Free",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  dotColor: "bg-green-500",  icon: CheckCircle2 },
  visa_on_arrival: { label: "Visa on Arrival",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  dotColor: "bg-amber-500",  icon: Clock },
  e_visa:          { label: "eVisa",            color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   dotColor: "bg-blue-500",   icon: Shield },
  visa_required:   { label: "Visa Required",    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", dotColor: "bg-orange-500", icon: AlertCircle },
  no_admission:    { label: "No Admission",     color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    dotColor: "bg-red-500",    icon: XCircle },
};

function CountryCombobox({ value, onChange, countries, placeholder, label, isLoading, excludeCode }: {
  value: string; onChange: (code: string) => void; countries: Country[];
  placeholder: string; label: string; isLoading: boolean; excludeCode?: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = excludeCode ? countries.filter((c) => c.code !== excludeCode) : countries;
  const selected = countries.find((c) => c.code === value);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}
            className="w-full justify-between h-12 text-left font-normal text-base border-border bg-card hover:bg-secondary/50">
            {selected ? (
              <span className="flex items-center gap-2">
                <span className="text-xl">{selected.flag}</span>
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
                {filtered.map((c) => (
                  <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                    onSelect={() => { onChange(c.code); setOpen(false); }} className="cursor-pointer">
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
    </div>
  );
}

function MultiCountrySelect({ selected, onAdd, onRemove, countries, isLoading, passportCode }: {
  selected: string[]; onAdd: (code: string) => void; onRemove: (code: string) => void;
  countries: Country[]; isLoading: boolean; passportCode: string;
}) {
  const [open, setOpen] = useState(false);
  const available = countries.filter((c) => !selected.includes(c.code) && c.code !== passportCode);
  const selectedCountries = selected.map((code) => countries.find((c) => c.code === code)).filter(Boolean) as Country[];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Destination Countries</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}
            className="w-full justify-between h-12 text-left font-normal text-base border-border bg-card hover:bg-secondary/50">
            {selected.length === 0
              ? <span className="text-muted-foreground">Add destination countries...</span>
              : <span className="text-muted-foreground">{selected.length} countr{selected.length > 1 ? "ies" : "y"} selected</span>}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search destinations..." className="h-10" />
            <CommandList>
              <CommandEmpty>{isLoading ? "Loading..." : "No country found."}</CommandEmpty>
              <CommandGroup>
                {available.map((c) => (
                  <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                    onSelect={() => onAdd(c.code)} className="cursor-pointer">
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
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {selectedCountries.map((c) => (
            <span key={c.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span>{c.flag}</span><span>{c.name}</span>
              <button onClick={() => onRemove(c.code)} className="ml-0.5 hover:opacity-70 transition-opacity">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

type SortOption = "status" | "alpha";
type FilterOption = VisaRequirement | "all";

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "visa_free", label: "Visa Free" },
  { value: "visa_on_arrival", label: "Visa on Arrival" },
  { value: "e_visa", label: "eVisa" },
  { value: "visa_required", label: "Visa Required" },
  { value: "no_admission", label: "No Admission" },
];

function ResultCard({ result, passport, isExpanded, onToggle }: {
  result: VisaResult;
  passport: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const config = reqConfig[result.requirement];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${isExpanded ? "shadow-md ring-1 ring-black/5" : "shadow-sm hover:shadow-md"} ${config.border}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${config.bg} hover:brightness-[0.97]`}
      >
        <span className="text-3xl flex-shrink-0 leading-none">{result.destinationCountry.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-foreground text-base leading-tight">{result.destinationCountry.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{result.destinationCountry.region}</div>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color} bg-white/80 border ${config.border} shadow-sm`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </div>
          <div className={`flex sm:hidden w-2.5 h-2.5 rounded-full ${config.dotColor} flex-shrink-0`} />
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isExpanded ? "bg-white/60" : "bg-white/40 hover:bg-white/60"}`}>
            {isExpanded
              ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="bg-card px-5 py-5 border-t border-border">
          <DestinationDetailExpanded
            passport={passport}
            destinationCode={result.destinationCountry.code}
            destinationName={result.destinationCountry.name}
            destinationFlag={result.destinationCountry.flag}
            requirement={result.requirement}
            maxStay={result.maxStay}
          />
        </div>
      )}
    </div>
  );
}

function ShareButtons({ passport, passportFlag, passportName, destinations, results }: {
  passport: string; passportFlag: string; passportName: string;
  destinations: string[]; results: VisaResult[];
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl = `https://www.isvisarequired.com/?passport=${passport}&destinations=${destinations.join(",")}`;

  let shareText: string;
  if (results.length === 1) {
    const r = results[0];
    const reqLabel: Record<VisaRequirement, string> = {
      visa_free: "Visa Free ✅", visa_on_arrival: "Visa on Arrival 🟡",
      e_visa: "eVisa 🔵", visa_required: "Visa Required ❌", no_admission: "No Admission 🚫",
    };
    shareText = `${passportFlag} ${passportName} → ${r.destinationCountry.flag} ${r.destinationCountry.name}: ${reqLabel[r.requirement]}${r.maxStay ? ` (${r.maxStay})` : ""}`;
  } else {
    const vf = results.filter((r) => r.requirement === "visa_free").length;
    const voa = results.filter((r) => r.requirement === "visa_on_arrival").length;
    const ev = results.filter((r) => r.requirement === "e_visa").length;
    const vr = results.filter((r) => r.requirement === "visa_required").length;
    shareText = `${passportFlag} ${passportName} passport across ${results.length} countries: ${vf} visa-free ✅, ${voa} on arrival 🟡, ${ev} e-visa 🔵, ${vr} need visa ❌`;
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + "\n\nCheck yours:")}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n\nCheck yours: " + shareUrl)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent("share", { method: "copy_link" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border bg-card hover:bg-secondary/50 hover:text-foreground transition-all"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1.5 z-20 bg-card border border-border rounded-xl shadow-lg p-2 flex flex-col gap-1 min-w-[180px]">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 transition-colors text-left"
            >
              {copied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4 text-muted-foreground" />}
              {copied ? "Link copied!" : "Copy link"}
            </button>
            <a
              href={twitterUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => { setOpen(false); trackEvent("share", { method: "twitter" }); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.731-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share on X
            </a>
            <a
              href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => { setOpen(false); trackEvent("share", { method: "whatsapp" }); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 transition-colors"
            >
              <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.527 5.857L0 24l6.335-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.384l-.36-.214-3.732.885.922-3.642-.236-.374A9.808 9.808 0 012.182 12c0-5.422 4.396-9.818 9.818-9.818 5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z"/></svg>
              WhatsApp
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  const [initialParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    // `from`/`to` are legacy aliases used by older server-rendered pair-page
    // CTAs (and anything Google has cached with those links) — honor both.
    const p = params.get("passport") ?? params.get("from") ?? "";
    const d = (params.get("destinations") ?? params.get("to"))?.split(",").filter(Boolean) ?? [];
    return { passport: p.toUpperCase(), destinations: d.map((c) => c.toUpperCase()) };
  });
  const hasAutoChecked = useRef(false);

  const [passport, setPassport] = useState(initialParams.passport);
  const [destinations, setDestinations] = useState<string[]>(initialParams.destinations);
  const [results, setResults] = useState<VisaResult[] | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("status");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<string | undefined>();
  const [allFilterBy, setAllFilterBy] = useState<FilterOption>("all");
  const [allSortBy, setAllSortBy] = useState<SortOption>("status");

  const { data: countries = [], isLoading: countriesLoading } = useListCountries();
  const checkMutation = useCheckVisaMultiple();

  const { data: newsletterData } = useQuery({
    queryKey: ["newsletter-count"],
    queryFn: async () => {
      const res = await fetch("/api/newsletter/count");
      if (!res.ok) return { count: 0 };
      return res.json() as Promise<{ count: number }>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: allVisaResults = [], isLoading: allLoading, isError: allError } = useCheckVisaAll(
    { passport },
    { query: { enabled: !!passport, queryKey: getCheckVisaAllQueryKey({ passport }) } }
  );

  useEffect(() => {
    if (hasAutoChecked.current) return;
    if (!countries.length) return;
    if (!initialParams.passport || !initialParams.destinations.length) return;
    hasAutoChecked.current = true;
    checkMutation.mutate(
      { data: { passport: initialParams.passport, destinations: initialParams.destinations } },
      {
        onSuccess: (data) => {
          setResults(data as VisaResult[]);
          setExpandedCode(data.length > 0 ? (data[0] as VisaResult).destinationCountry.code : null);
        },
      }
    );
  }, [countries.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const passportCountry = countries.find((c) => c.code === passport);
  const singleDest = destinations.length === 1 ? countries.find((c) => c.code === destinations[0]) : null;
  const dynamicTitle = passportCountry && singleDest
    ? `${passportCountry.name} to ${singleDest.name} Visa Requirements | Is Visa Required?`
    : "Is Visa Required? | Free Visa Checker for 199 Countries";
  const dynamicDesc = passportCountry && singleDest
    ? `Do ${passportCountry.name} passport holders need a visa for ${singleDest.name}? Check the requirement instantly — visa free, visa on arrival, e-visa, or visa required.`
    : "Check visa requirements instantly for any passport and destination. Find out if you need a visa, visa on arrival, e-visa, or can travel freely — covers 199 countries worldwide.";

  useSEO({
    title: dynamicTitle,
    description: dynamicDesc,
    canonical: "https://www.isvisarequired.com/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.isvisarequired.com/" }
      ]
    },
  });

  const visaMapForMap = useMemo(() => {
    const map: Record<string, VisaRequirement> = {};
    (allVisaResults as VisaResult[]).forEach((r) => {
      map[r.destinationCountry.code] = r.requirement;
    });
    return map;
  }, [allVisaResults]);

  const pushUrl = (p: string, dests: string[]) => {
    if (!p || !dests.length) {
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    const params = new URLSearchParams();
    params.set("passport", p);
    params.set("destinations", dests.join(","));
    window.history.replaceState({}, "", `?${params.toString()}`);
  };

  const handleCheck = () => {
    if (!passport || destinations.length === 0) return;
    checkMutation.mutate(
      { data: { passport, destinations } },
      {
        onSuccess: (data) => {
          setResults(data as VisaResult[]);
          setExpandedCode(data.length > 0 ? (data[0] as VisaResult).destinationCountry.code : null);
          setFilterBy("all");
          pushUrl(passport, destinations);
          trackEvent("visa_check", { passport_code: passport, destination_count: destinations.length });
        },
      }
    );
  };

  const checkError = checkMutation.isError;

  const handleCountryClickOnMap = (code: string) => {
    if (!destinations.includes(code) && code !== passport) {
      setDestinations((prev) => [...prev, code]);
      setHighlightedCode(code);
      setResults(null);
    }
  };

  const sortedFilteredResults = useMemo(() => {
    if (!results) return [];
    let filtered = results;
    if (filterBy !== "all") filtered = filtered.filter((r) => r.requirement === filterBy);
    return [...filtered].sort((a, b) => {
      if (sortBy === "status") return requirementOrder.indexOf(a.requirement) - requirementOrder.indexOf(b.requirement);
      return a.destinationCountry.name.localeCompare(b.destinationCountry.name);
    });
  }, [results, sortBy, filterBy]);

  const allResultsSorted = useMemo(() => {
    const typed = allVisaResults as VisaResult[];
    let filtered = allFilterBy !== "all" ? typed.filter((r) => r.requirement === allFilterBy) : typed;
    return [...filtered].sort((a, b) => {
      if (allSortBy === "status") return requirementOrder.indexOf(a.requirement) - requirementOrder.indexOf(b.requirement);
      return a.destinationCountry.name.localeCompare(b.destinationCountry.name);
    });
  }, [allVisaResults, allSortBy, allFilterBy]);

  const resultCounts = useMemo(() => {
    if (!results) return null;
    return results.reduce((acc, r) => {
      acc[r.requirement] = (acc[r.requirement] ?? 0) + 1;
      return acc;
    }, {} as Partial<Record<VisaRequirement, number>>);
  }, [results]);

  const showAllCountries = passport && !results;

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/" />

      {/* Hero strip */}
      <div className="bg-gradient-to-b from-primary/8 via-primary/4 to-transparent border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/12 text-primary rounded-full px-3.5 py-1 text-xs font-semibold mb-4 border border-primary/20 shadow-sm">
            <Plane className="h-3 w-3" />
            199 countries · Instant results
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            Do you need a visa?
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Select your passport and destination — get instant visa requirements, costs, and travel highlights.
          </p>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold cursor-default">
              Website
            </span>
            <a href="/app" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-foreground font-semibold hover:bg-secondary/50 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              iOS &amp; Android App
            </a>
          </div>

          {/* Social proof strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Globe className="h-4 w-4 text-primary/70" />
              <span>199 countries covered</span>
            </div>
            <span className="text-border/70 hidden sm:block">·</span>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-amber-500/80" />
              <span>Instant results, no sign-up</span>
            </div>
            <span className="text-border/70 hidden sm:block">·</span>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-green-600/70" />
              <span>Always free</span>
            </div>
            {(newsletterData?.count ?? 0) > 0 && (
              <>
                <span className="text-border/70 hidden sm:block">·</span>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-blue-500/70" />
                  <span>
                    {newsletterData!.count.toLocaleString()}+ travellers subscribed
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Card */}
        <Card className="shadow-lg border-border/70 mb-7 overflow-hidden bg-card/95">
          <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-amber-400/70" />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <CountryCombobox
                value={passport}
                onChange={(code) => { setPassport(code); setResults(null); setHighlightedCode(undefined); window.history.replaceState({}, "", window.location.pathname); }}
                countries={countries}
                placeholder="Select your passport..."
                label="Your Passport"
                isLoading={countriesLoading}
              />
              <MultiCountrySelect
                selected={destinations}
                onAdd={(code) => { setDestinations((prev) => [...prev, code]); setResults(null); }}
                onRemove={(code) => { setDestinations((prev) => prev.filter((d) => d !== code)); setResults(null); }}
                countries={countries}
                isLoading={countriesLoading}
                passportCode={passport}
              />
            </div>
            <Button
              onClick={handleCheck}
              disabled={!passport || destinations.length === 0 || checkMutation.isPending}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/10">
              {checkMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  Checking…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Check Visa Requirements
                </span>
              )}
            </Button>
            {checkError && (
              <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                Could not load visa data. Check your connection and try again.
              </p>
            )}
          </CardContent>
        </Card>

        <AdSlot slotId="7432198541" size="responsive" className="my-4" />

        {/* World Map */}
        {passport && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground">World Visa Map</h2>
                {allLoading ? (
                  <span className="inline-block h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
                    {(allVisaResults as VisaResult[]).length} countries · click to add
                  </span>
                )}
              </div>
              {!allLoading && (allVisaResults as VisaResult[]).length > 0 && (
                <MysteryDestination
                  passport={passport}
                  results={allVisaResults as VisaResult[]}
                />
              )}
            </div>
            <Suspense fallback={
                <div className="h-64 bg-muted/30 rounded-2xl border border-border/70 flex items-center justify-center text-muted-foreground text-sm">
                <span className="animate-pulse">Loading map…</span>
              </div>
            }>
              <WorldMap
                visaMap={visaMapForMap}
                passportCode={passport}
                onCountryClick={handleCountryClickOnMap}
                highlightedCode={highlightedCode}
              />
            </Suspense>
          </div>
        )}

        {/* Specific destination results */}
        {results && results.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <TripSummary results={results} />
              </div>
              <div className="flex-shrink-0 pt-1">
                <ShareButtons
                  passport={passport}
                  passportFlag={passportCountry?.flag ?? ""}
                  passportName={passportCountry?.name ?? passport}
                  destinations={destinations}
                  results={results}
                />
              </div>
            </div>

            <AdSlot slotId="3198762045" size="rectangle" className="mx-auto" />

            {/* Filter + sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {filterOptions.map(({ value, label }) => {
                  const count = value === "all" ? results.length : (resultCounts?.[value as VisaRequirement] ?? 0);
                  if (count === 0 && value !== "all") return null;
                  const config = value !== "all" ? reqConfig[value as VisaRequirement] : null;
                  return (
                    <button key={value} onClick={() => setFilterBy(value)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        filterBy === value
                          ? config ? `${config.color} ${config.bg} ${config.border}` : "text-foreground bg-secondary border-border"
                          : "text-muted-foreground bg-muted border-transparent hover:border-border"
                      }`}>
                      {label}<span className="ml-1 opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <ArrowUpDown className="h-3 w-3 mr-1" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Sort by Status</SelectItem>
                  <SelectItem value="alpha">Sort A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Result cards */}
            <div className="space-y-2.5">
              {sortedFilteredResults.map((r) => (
                <ResultCard
                  key={r.destinationCountry.code}
                  result={r}
                  passport={passport}
                  isExpanded={expandedCode === r.destinationCountry.code}
                  onToggle={() => setExpandedCode((prev) => prev === r.destinationCountry.code ? null : r.destinationCountry.code)}
                />
              ))}
              {sortedFilteredResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No results match this filter.</div>
              )}
            </div>

            {/* Visa change alerts */}
            {results.length > 0 && passportCountry && (
              <MultiAlertSubscribeWidget
                passportCode={passport}
                passportFlag={passportCountry.flag}
                passportName={passportCountry.name}
                destinations={results.map((r) => ({
                  code: r.destinationCountry.code,
                  flag: r.destinationCountry.flag,
                  name: r.destinationCountry.name,
                }))}
              />
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setResults(null)}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors">
                ← Browse all countries
              </button>
              <p className="text-xs text-muted-foreground">
                Requirements are indicative. Verify with official embassy before travel.
              </p>
            </div>
          </div>
        )}

        {/* Error state for all-countries load */}
        {allError && !allLoading && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Could not load visa data for this passport. Please try refreshing the page.</span>
          </div>
        )}

        {/* All countries browse mode */}
        {showAllCountries && !allLoading && allVisaResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground mb-1">
                  All Countries — {countries.find((c) => c.code === passport)?.flag} {countries.find((c) => c.code === passport)?.name} Passport
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {filterOptions.map(({ value, label }) => {
                    const typed = allVisaResults as VisaResult[];
                    const count = value === "all" ? typed.length : typed.filter((r) => r.requirement === value).length;
                    if (count === 0 && value !== "all") return null;
                    const config = value !== "all" ? reqConfig[value as VisaRequirement] : null;
                    return (
                      <button key={value} onClick={() => setAllFilterBy(value)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                          allFilterBy === value
                            ? config ? `${config.color} ${config.bg} ${config.border}` : "text-foreground bg-secondary border-border"
                            : "text-muted-foreground bg-muted border-transparent hover:border-border"
                        }`}>
                        {label}<span className="ml-1 opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <Select value={allSortBy} onValueChange={(v) => setAllSortBy(v as SortOption)}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <ArrowUpDown className="h-3 w-3 mr-1" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Sort by Status</SelectItem>
                  <SelectItem value="alpha">Sort A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allResultsSorted.map((r) => {
                const config = reqConfig[r.requirement];
                const Icon = config.icon;
                const isSelected = destinations.includes(r.destinationCountry.code);
                return (
                  <button
                    key={r.destinationCountry.code}
                    onClick={() => {
                      if (!isSelected) setDestinations((prev) => [...prev, r.destinationCountry.code]);
                      else setDestinations((prev) => prev.filter((d) => d !== r.destinationCountry.code));
                    }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : `${config.border} ${config.bg} hover:brightness-[0.985]`
                    }`}>
                    <span className="text-2xl flex-shrink-0 leading-none">{r.destinationCountry.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{r.destinationCountry.name}</div>
                      {r.maxStay && <div className="text-xs text-muted-foreground">{r.maxStay}</div>}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${
                      isSelected ? "bg-primary text-primary-foreground border-primary" : `${config.color} ${config.border} bg-white/70`
                    }`}>
                      {isSelected ? <CheckCircle2 className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                      <span className="hidden sm:inline">{isSelected ? "Selected" : config.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {destinations.length > 0 && (
              <div className="sticky bottom-4">
                <Button
                  onClick={handleCheck}
                  disabled={checkMutation.isPending}
                  className="w-full h-12 text-base font-semibold bg-primary shadow-lg shadow-primary/15">
                  {checkMutation.isPending ? "Checking…" : `Check ${destinations.length} Selected Destination${destinations.length > 1 ? "s" : ""}`}
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Click countries to select them. Requirements are indicative — always verify with official sources.
            </p>
          </div>
        )}

        {/* Empty state — no passport selected */}
        {!passport && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto shadow-inner">
                <Globe className="h-10 w-10 text-primary/60" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center shadow">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <p className="text-xl font-semibold text-foreground mb-2">Select your passport to get started</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Instant visa requirements, costs, and tourist highlights for all {countries.length || "199"} countries worldwide.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              {[
                { color: "bg-green-500", label: "Visa Free" },
                { color: "bg-amber-500", label: "On Arrival" },
                { color: "bg-blue-500", label: "eVisa" },
                { color: "bg-orange-500", label: "Visa Required" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
