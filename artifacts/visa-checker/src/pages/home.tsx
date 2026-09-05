import { useState, useMemo, lazy, Suspense, useEffect, useRef } from "react";
import { useSEO } from "@/hooks/useSEO";
import { slugify } from "@/lib/slug";
import { COVERAGE } from "@/lib/coverage";
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
  XCircle, Shield, ArrowUpDown,
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

import { reqConfig, requirementOrder } from "@/lib/requirement";

function CountryCombobox({ value, onChange, countries, placeholder, label, isLoading, excludeCode, open: openProp, onOpenChange }: {
  value: string; onChange: (code: string) => void; countries: Country[];
  placeholder: string; label: string; isLoading: boolean; excludeCode?: string;
  open?: boolean; onOpenChange?: (o: boolean) => void;
}) {
  // Optionally controlled so the CTA can open the right field instead of disabling itself.
  const [openInner, setOpenInner] = useState(false);
  const open = openProp ?? openInner;
  const setOpen = onOpenChange ?? setOpenInner;
  const filtered = excludeCode ? countries.filter((c) => c.code !== excludeCode) : countries;
  const selected = countries.find((c) => c.code === value);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}
            className="w-full justify-between h-14 px-4 text-left font-normal text-base rounded-xl border-border/80 bg-secondary/40 hover:bg-secondary/70 data-[state=open]:bg-card data-[state=open]:ring-2 data-[state=open]:ring-primary/35 transition-colors">
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
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[calc(100vw-2rem)] p-0" align="start" sideOffset={6}>
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

function MultiCountrySelect({ selected, onAdd, onRemove, countries, isLoading, passportCode, open: openProp, onOpenChange }: {
  selected: string[]; onAdd: (code: string) => void; onRemove: (code: string) => void;
  countries: Country[]; isLoading: boolean; passportCode: string;
  open?: boolean; onOpenChange?: (o: boolean) => void;
}) {
  const [openInner, setOpenInner] = useState(false);
  const open = openProp ?? openInner;
  const setOpen = onOpenChange ?? setOpenInner;
  const available = countries.filter((c) => !selected.includes(c.code) && c.code !== passportCode);
  const selectedCountries = selected.map((code) => countries.find((c) => c.code === code)).filter(Boolean) as Country[];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Where you're going</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}
            className="w-full justify-between h-14 px-4 text-left font-normal text-base rounded-xl border-border/80 bg-secondary/40 hover:bg-secondary/70 data-[state=open]:bg-card data-[state=open]:ring-2 data-[state=open]:ring-primary/35 transition-colors">
            {selected.length === 0
              ? <span className="text-muted-foreground">Add destination countries...</span>
              : <span className="text-muted-foreground">{selected.length} countr{selected.length > 1 ? "ies" : "y"} selected</span>}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[calc(100vw-2rem)] p-0" align="start" sideOffset={6}>
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
              <button type="button" onClick={() => onRemove(c.code)} aria-label={`Remove ${c.name}`}
                className="ml-0.5 grid place-items-center h-6 w-6 rounded-full transition-colors hover:bg-primary/15 active:bg-primary/25">
                <X className="h-3.5 w-3.5" />
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
  const stay = result.maxStay === "unlimited" ? "No stay limit" : result.maxStay ? `Stay up to ${result.maxStay}` : config.hint;

  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`detail-${result.destinationCountry.code}`}
        className={`group relative w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-left bg-card transition-colors hover:bg-secondary/40 aria-expanded:bg-secondary/40 before:absolute before:left-0 before:inset-y-3 before:w-[3px] before:rounded-r-full ${config.rail}`}
      >
        <span className="text-2xl sm:text-3xl flex-shrink-0 leading-none" aria-hidden="true">{result.destinationCountry.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground text-base leading-tight">{result.destinationCountry.name}</div>
          <div className="text-[13px] text-muted-foreground mt-0.5 leading-snug tabular-nums">{stay}</div>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <div className={`inline-flex shrink-0 items-center gap-1.5 h-7 px-2.5 rounded-full text-[13px] font-semibold leading-none ${config.color} ${config.bg} border ${config.border}`}>
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">{config.short}</span><span className="hidden sm:inline">{config.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/70 transition-transform duration-200 group-aria-expanded:rotate-180" aria-hidden="true" />
        </div>
      </button>

      {isExpanded && (
        <div id={`detail-${result.destinationCountry.code}`} className="bg-background border-t border-border/70 px-4 sm:px-5 py-5">
          <DestinationDetailExpanded
            passport={passport}
            destinationCode={result.destinationCountry.code}
            destinationName={result.destinationCountry.name}
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
          <div className="absolute right-0 mt-1.5 z-20 bg-card border border-border rounded-xl shadow-md ring-1 ring-[rgb(15_23_41/0.06)] p-2 flex flex-col gap-1 min-w-[180px]">
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


// Below this, the subscriber count is noise rather than proof and is hidden.
const SOCIAL_PROOF_MIN = 50;

// Passports that have an editorial roundup guide behind them (guidesData.ts).
// Deliberately titled "Start with a passport", not "most popular" — we have no
// traffic data to substantiate a popularity claim.
const START_PASSPORTS = [
  { code: "IN", name: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "NG", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "PK", name: "Pakistan", flag: "\u{1F1F5}\u{1F1F0}" },
  { code: "PH", name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "BD", name: "Bangladesh", flag: "\u{1F1E7}\u{1F1E9}" },
  { code: "KE", name: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "VN", name: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "ID", name: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "EG", name: "Egypt", flag: "\u{1F1EA}\u{1F1EC}" },
  { code: "CN", name: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "TR", name: "T\u00FCrkiye", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "ZA", name: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
];

// Static link panels. Each entry states a route, never an outcome, so no visa
// fact is asserted here and nothing can drift out of date.
const EXPLORE_PANELS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Popular checks",
    links: [
      { href: "/visa-requirements/united-states/japan", label: "United States → Japan" },
      { href: "/visa-requirements/india/thailand", label: "India → Thailand" },
      { href: "/visa-requirements/united-kingdom/united-states", label: "United Kingdom → United States" },
      { href: "/visa-requirements/germany/united-states", label: "Germany → United States" },
      { href: "/visa-requirements/nigeria/united-kingdom", label: "Nigeria → United Kingdom" },
      { href: "/visa-requirements/china/singapore", label: "China → Singapore" },
    ],
  },
  {
    heading: "Before you book",
    links: [
      { href: "/guides/six-month-passport-rule", label: "The six-month passport rule, explained" },
      { href: "/guides/visa-validity-vs-duration-of-stay", label: "Visa validity vs duration of stay" },
      { href: "/guides/proof-of-onward-travel", label: "What counts as proof of onward travel" },
      { href: "/guides/single-entry-vs-multiple-entry-visas", label: "Single-entry vs multiple-entry visas" },
      { href: "/guides/can-i-leave-the-airport-during-a-layover", label: "Can I leave the airport during a layover?" },
    ],
  },
  {
    heading: "Browse everything",
    links: [
      { href: "/visa-requirements", label: "All 195 passports" },
      { href: "/countries", label: "All 195 destinations" },
      { href: "/guides", label: "Visa & travel guides" },
      { href: "/reports/passport-power-2026", label: "Passport Power Report 2026" },
      { href: "/tier-list", label: "Passport tier list" },
    ],
  },
];

// Requirement → follow-on guide. Editorial routing, not a visa fact.
const GUIDE_FOR_REQUIREMENT: Record<string, { href: string; label: string }> = {
  visa_free: { href: "/guides/six-month-passport-rule", label: "Check your passport is still valid enough" },
  visa_on_arrival: { href: "/guides/visa-on-arrival-vs-evisa-vs-eta", label: "Visa on arrival vs eVisa vs ETA" },
  e_visa: { href: "/guides/visa-on-arrival-vs-evisa-vs-eta", label: "Visa on arrival vs eVisa vs ETA" },
  visa_required: { href: "/guides/proof-of-onward-travel", label: "What counts as proof of onward travel" },
  no_admission: { href: "/guides", label: "Browse our visa guides" },
};

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
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!results?.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [results]);
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
          setExpandedCode(data.length === 1 ? (data[0] as VisaResult).destinationCountry.code : null);
        },
      }
    );
  }, [countries.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const passportCountry = countries.find((c) => c.code === passport);

  // Follow-on links built from the answer the user just got. Nothing is
  // fetched and nothing new is asserted — URLs come from slugify() on the
  // country names already in `results`.
  const keepGoingTiles = useMemo(() => {
    if (!results || results.length === 0 || !passportCountry) return [];
    const pSlug = slugify(passportCountry.name);
    const first = results[0];
    const dSlug = slugify(first.destinationCountry.name);
    const tiles = [
      { href: `/visa-requirements/${pSlug}/${dSlug}`, label: `Full requirements: ${passportCountry.name} → ${first.destinationCountry.name}` },
      { href: `/countries/${dSlug}`, label: `Who else can enter ${first.destinationCountry.name}?` },
      { href: `/visa-requirements/${pSlug}`, label: `All destinations for ${passportCountry.name}` },
    ];
    if (results.length > 1) {
      tiles.push({ href: "/trip-planner", label: `Plan all ${results.length} legs of this trip` });
    } else {
      const g = GUIDE_FOR_REQUIREMENT[first.requirement] ?? GUIDE_FOR_REQUIREMENT.visa_required;
      tiles.push(g);
    }
    return tiles;
  }, [results, passportCountry]);
  const singleDest = destinations.length === 1 ? countries.find((c) => c.code === destinations[0]) : null;
  const dynamicTitle = passportCountry && singleDest
    ? `${passportCountry.name} to ${singleDest.name} Visa Requirements | Is Visa Required?`
    : `Is Visa Required? | Free Visa Checker for ${COVERAGE.countries} Countries`;
  const dynamicDesc = passportCountry && singleDest
    ? `Do ${passportCountry.name} passport holders need a visa for ${singleDest.name}? Check the requirement instantly — visa free, visa on arrival, e-visa, or visa required.`
    : `Check visa requirements instantly for any passport and destination. Find out if you need a visa, visa on arrival, e-visa, or can travel freely — covers ${COVERAGE.countries} countries worldwide.`;

  // The CTA never disables. It used to grey out until both fields were chosen,
  // which rendered the page's most important control as a periwinkle ghost on
  // first paint and removed it from the tab order. handleCheck already guards
  // an incomplete form; the button's job is to open whichever field is empty.
  const [passportOpen, setPassportOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const ctaState = !passport ? "passport" : destinations.length === 0 ? "destination" : "ready";
  const onCta = () => {
    if (ctaState === "passport") { setPassportOpen(true); return; }
    if (ctaState === "destination") { setDestOpen(true); return; }
    handleCheck();
  };

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
          setExpandedCode(data.length === 1 ? (data[0] as VisaResult).destinationCountry.code : null);
          setFilterBy("all");
          pushUrl(passport, destinations);
          trackEvent("visa_check", { passport_code: passport, destination_count: destinations.length });
        },
      }
    );
  };

  const checkError = checkMutation.isError;

  const handleCountryClickOnMap = (code: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!destinations.includes(code) && code !== passport) {
      setDestinations((prev) => [...prev, code]);
      setHighlightedCode(code);
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

  const renderMap = (inResults: boolean) => (
<>
          <div className={inResults ? "" : "mb-8"}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">{inResults ? "Add another destination" : "World Visa Map"}</h2>
                {allLoading ? (
                  <span className="inline-block h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
                    {(allVisaResults as VisaResult[]).length} countries · {inResults ? "tap one to add it" : "click to add"}
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
            <div className="max-w-4xl mx-auto">
            <Suspense fallback={
                <div className="aspect-[2/1] bg-secondary/40 rounded-2xl border border-border/70 flex items-center justify-center text-muted-foreground text-sm">
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
          </div>
        </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/" />

      {/* Hero strip */}
      <div className="relative bg-hero">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-16 md:pt-12 md:pb-24 text-center">
          <a
            href="/methodology"
            className="inline-flex items-center gap-2 bg-white/10 text-white/90 rounded-full px-3.5 py-1 text-xs font-semibold mb-3 border border-white/20 backdrop-blur-sm hover:bg-white/[0.18] transition-colors">
            <Shield className="h-3 w-3" />
            Data last reviewed {COVERAGE.lastReviewedLabel}
          </a>
          <h1 className="font-serif text-[2.5rem] md:text-[3.25rem] font-semibold text-white mb-3 leading-[1.06] tracking-[-0.022em] text-balance">
            Do you need a visa?
          </h1>
          <p className="text-lg text-white/75 max-w-lg mx-auto leading-relaxed">
            Any passport, any destination — the rule in one tap.
          </p>
          {/* One line, real numbers. Fixed min-height so the async subscriber
              count cannot add a wrap line and shove the search card down. */}
          <div className="mt-4 min-h-[20px] text-sm text-white/65">
            <span className="tabular-nums">{COVERAGE.countries} countries</span>
            <span className="mx-2 text-white/25">·</span>
            <span className="tabular-nums">{COVERAGE.pairsLabel} rules</span>
            <span className="mx-2 text-white/25">·</span>
            <span>Free, no sign-up</span>
            {/* Only once the number reads as a community. The live page was
                showing "1+ subscribed", which is worse than showing nothing:
                social proof that resolves to one person actively costs
                credibility. Real number, honest threshold. */}
            {(newsletterData?.count ?? 0) >= SOCIAL_PROOF_MIN && (
              <>
                <span className="mx-2 text-white/25">·</span>
                <span className="tabular-nums">{newsletterData!.count.toLocaleString()}+ subscribed</span>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="relative z-[1] max-w-5xl mx-auto px-4 pb-8 -mt-12 md:-mt-16">
        {/* Search Card */}
        <Card className="relative rounded-2xl border-border/50 bg-card shadow-xl overflow-hidden">
          <CardContent className="p-5 sm:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
              <CountryCombobox
                value={passport}
                onChange={(code) => { setPassport(code); setResults(null); setHighlightedCode(undefined); window.history.replaceState({}, "", window.location.pathname); }}
                countries={countries}
                placeholder="Select your passport..."
                label="Your passport"
                isLoading={countriesLoading}
                open={passportOpen}
                onOpenChange={setPassportOpen}
              />
              <MultiCountrySelect
                selected={destinations}
                onAdd={(code) => { setDestinations((prev) => [...prev, code]); setResults(null); }}
                onRemove={(code) => { setDestinations((prev) => prev.filter((d) => d !== code)); setResults(null); }}
                countries={countries}
                isLoading={countriesLoading}
                passportCode={passport}
                open={destOpen}
                onOpenChange={setDestOpen}
              />
            </div>
            <Button
              onClick={onCta}
              disabled={checkMutation.isPending}
              className="w-full h-14 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-[box-shadow,transform,background-color] duration-150 hover:bg-[hsl(222_89%_25%)] hover:shadow-primary/30 active:translate-y-px disabled:opacity-100 disabled:cursor-wait">
              {checkMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  Checking…
                </span>
              ) : ctaState === "passport" ? (
                <span className="flex items-center gap-2"><ChevronDown className="h-4 w-4" />Choose your passport</span>
              ) : ctaState === "destination" ? (
                <span className="flex items-center gap-2"><ChevronDown className="h-4 w-4" />Add a destination</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {destinations.length === 1 ? "Check this destination" : `Check ${destinations.length} destinations`}
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

        {showAllCountries && <AdSlot slotId="7432198541" size="responsive" className="my-6" />}

        {/* World Map */}
        {passport && !results && renderMap(false)}
        {/* Specific destination results */}
        {results && results.length > 0 && (
          <div ref={resultsRef} className="space-y-5 scroll-mt-20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <TripSummary results={results} passportFlag={passportCountry?.flag ?? ""} passportName={passportCountry?.name ?? passport} />
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

            
            {/* Filter + sort — only worth a row once there is something to filter */}
            {results.length >= 4 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="-mx-4 flex gap-2 overflow-x-auto snap-x px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {filterOptions.map(({ value, label }) => {
                  const count = value === "all" ? results.length : (resultCounts?.[value as VisaRequirement] ?? 0);
                  if (count === 0 && value !== "all") return null;
                  const config = value !== "all" ? reqConfig[value as VisaRequirement] : null;
                  const FIcon = config?.icon;
                  return (
                    <button key={value} onClick={() => setFilterBy(value)} aria-pressed={filterBy === value}
                      className={`snap-start shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[13px] font-semibold border transition-colors ${
                        filterBy === value
                          ? config ? `${config.color} ${config.bg} ${config.border}` : "text-foreground bg-secondary border-border"
                          : "text-muted-foreground bg-card border-border/70 hover:border-border hover:text-foreground"
                      }`}>
                      {FIcon && <FIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                      {label}<span className="tabular-nums font-medium text-muted-foreground">{count}</span>
                    </button>
                  );
                })}
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="h-9 w-auto gap-1.5 rounded-full border-border/70 bg-card px-3 text-[13px] shadow-none">
                  <ArrowUpDown className="h-3 w-3" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="alpha">A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            )}

            {/* Result cards */}
            <div className="rounded-2xl bg-card shadow-sm ring-1 ring-[rgb(15_23_41/0.06)] divide-y divide-border/70 overflow-hidden">
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
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">No results match this filter.</div>
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

            <AdSlot slotId="3198762045" size="rectangle" className="mx-auto" />

            {results.length > 0 && passportCountry && (
              <div className="mt-5 pt-5 border-t border-border/60">
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Keep going
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {keepGoingTiles.map((t) => (
                    <a
                      key={t.href}
                      href={t.href}
                      className="bg-card border border-border rounded-xl p-3.5 min-h-16 flex items-center text-sm leading-snug hover:border-primary/50 hover:bg-secondary/40 active:bg-secondary transition-colors">
                      {t.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <section className="pt-6 border-t border-border/60">{renderMap(true)}</section>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <button
                onClick={() => setResults(null)}
                className="inline-flex items-center min-h-11 text-sm text-primary underline-offset-2 hover:underline">
                ← Browse all countries
              </button>
              <p className="text-xs text-muted-foreground leading-relaxed">
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
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
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
                        : `${config.border} ${config.bg} hover:border-primary/40`
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
              <div className="sticky bottom-4 z-20">
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

        {/* Explore floor. Rendered in EVERY state, not just the empty one: the
            page used to end here for anyone who didn't immediately pick a
            passport, with no route into the 37,830 pair pages, 195 hubs or the
            guides. Static links — no fetch, no layout shift, crawlable. */}
        <section id="explore" className="mt-14 -mx-4 sm:mx-0 sm:rounded-3xl bg-secondary/60 px-4 sm:px-7 py-9 sm:py-11 border-t sm:border border-border/70 shadow-[inset_0_2px_4px_rgb(15_23_41/0.05)]">
          {!passport && (
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Start with a passport
              </h2>
              <div className="flex gap-2 overflow-x-auto snap-x pb-1 sm:flex-wrap sm:overflow-visible">
                {START_PASSPORTS.map((p) => (
                  <button
                    key={p.code}
                    onClick={() => setPassport(p.code)}
                    className="snap-start shrink-0 h-11 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium hover:bg-secondary/60 transition-colors">
                    <span aria-hidden="true">{p.flag}</span>
                    {p.name}
                  </button>
                ))}
              </div>
              <a href="/visa-requirements" className="inline-block mt-3 text-sm text-primary hover:underline">
                Or browse all {COVERAGE.countries} passports →
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXPLORE_PANELS.map((panel) => (
              <div key={panel.heading} className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-[rgb(15_23_41/0.06)] hover:shadow-md transition-shadow">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  {panel.heading}
                </h2>
                <div className="flex flex-col gap-2">
                  {panel.links.map((l) => (
                    <a key={l.href} href={l.href} className="-mx-2 flex items-center rounded-lg px-2 py-2.5 min-h-11 text-sm text-muted-foreground hover:bg-secondary/70 hover:text-foreground active:bg-secondary transition-colors">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <AdSlot slotId="7432198541" size="responsive" className="mt-8" />

          <p className="mt-8 text-sm text-muted-foreground leading-relaxed max-w-[62ch]">
            Built from an open base dataset, corrected against official government portals, and
            last reviewed {COVERAGE.lastReviewedLabel}. We're independent — not a visa agency, and
            we never charge for applications.{" "}
            <a href="/methodology" className="text-primary hover:underline">How we source this →</a>
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
