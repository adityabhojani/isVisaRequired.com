import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { VisaResult, VisaRequirement } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronDown, Globe, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { reqConfig, requirementOrder, styleForResult, NO_DATA_FILL } from "@/lib/requirement";
import { alpha2FromAtlasId } from "@/data/isoMapping";
import { StatusPatternDefs, statusFill, noDataFill, Swatch } from "@/components/mapPatterns";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO 3166-1 numeric → alpha-2 mapping (world-atlas uses numeric codes)
// Country lookup: alpha2FromAtlasId in @/data/isoMapping (shared with WorldMap).


// Status colours and words come from @/lib/requirement. The fills below are
// NOT statuses: the passport's own country (brand navy, as in WorldMap), the
// pale neutral for a shape this page can't match to a country code (or before
// any results have arrived), and the opacity used to push filtered-out
// countries back without greying them — grey (NO_DATA_FILL) means "no rule in
// the dataset" and nothing else.
const PASSPORT_FILL = "hsl(222 89% 30%)";
const UNMAPPED_FILL = "#e2e8f0";
const FILTERED_OUT_OPACITY = 0.15;

// Status textures, fills and the legend swatch are shared with the homepage map
// (components/mapPatterns.tsx). This page scopes its <pattern> ids with a
// prefix so they never collide with WorldMap's.
const PATTERN_PREFIX = "map-page-";

interface CountryFill {
  fill: string;
  /** true when the country has a status but the active filter excludes it */
  dimmed: boolean;
}

interface TooltipState {
  name: string;
  code: string;
  x: number;
  y: number;
}

export default function MapPage() {
  useSEO({
    title: "World Visa Map — See Where Your Passport Can Travel",
    description: "Interactive world map showing visa requirements for every country. Select your passport and see visa-free, eVisa, and visa-required countries at a glance.",
  });

  const [passport, setPassport] = useState("US");
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activeFilter, setActiveFilter] = useState<VisaRequirement | "all">("all");
  const [, setLocation] = useLocation();

  const { data: countries = [] } = useListCountries();
  const passportCountry = countries.find((c) => c.code === passport);

  const { data: rawResults = [], isLoading } = useCheckVisaAll(
    { passport },
    { query: { enabled: !!passport, queryKey: getCheckVisaAllQueryKey({ passport }) } }
  );

  const visaMap = useMemo(() => {
    const m: Record<string, VisaRequirement> = {};
    (rawResults as VisaResult[]).forEach((r) => { m[r.destinationCountry.code] = r.requirement; });
    return m;
  }, [rawResults]);

  // The full entry per destination, so a single pair's word can use its notes
  // and maxStay (styleForResult labels a UK ETA / US ESTA correctly).
  const resultByCode = useMemo(() => {
    const m: Record<string, VisaResult> = {};
    (rawResults as VisaResult[]).forEach((r) => { m[r.destinationCountry.code] = r; });
    return m;
  }, [rawResults]);

  // Until results arrive nothing is "no data" yet — it just hasn't loaded.
  const hasData = (rawResults as VisaResult[]).length > 0;

  const pairStyle = useCallback((code: string) => {
    const r = resultByCode[code];
    return r && reqConfig[r.requirement] ? styleForResult(r.requirement, r.notes, r.maxStay) : null;
  }, [resultByCode]);

  const counts = useMemo(() => {
    const c: Partial<Record<VisaRequirement, number>> = {};
    (rawResults as VisaResult[]).forEach((r) => { c[r.requirement] = (c[r.requirement] ?? 0) + 1; });
    return c;
  }, [rawResults]);

  const getCountryColor = useCallback((numericCode: string | number): CountryFill => {
    const code = alpha2FromAtlasId(numericCode);
    if (!code) return { fill: UNMAPPED_FILL, dimmed: false };
    if (code === passport) return { fill: PASSPORT_FILL, dimmed: false };
    const req = visaMap[code];
    if (!req || !reqConfig[req]) return { fill: hasData ? noDataFill(PATTERN_PREFIX) : UNMAPPED_FILL, dimmed: false };
    return { fill: statusFill(req, PATTERN_PREFIX), dimmed: activeFilter !== "all" && req !== activeFilter };
  }, [visaMap, activeFilter, passport, hasData]);

  const handleMouseEnter = useCallback((geo: { id?: string; properties: { name: string } }, evt: React.MouseEvent) => {
    const code = alpha2FromAtlasId(geo.id) ?? "";
    setTooltip({ name: geo.properties.name, code, x: evt.clientX, y: evt.clientY });
  }, []);

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    setTooltip((prev) => prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null);
  }, []);

  const tipStyle = tooltip?.code ? pairStyle(tooltip.code) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/map" />

      <div className="bg-secondary/40 border-b border-border/70">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-3.5 py-1 text-xs font-semibold mb-3 border border-sky-200">
                <Globe className="h-3 w-3" />
                Interactive World Visa Map
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {passportCountry ? `${passportCountry.flag} ${passportCountry.name} Passport` : "Select Your Passport"}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {isLoading ? "Loading visa data…" : passport
                  ? `${(rawResults as VisaResult[]).length} countries shown · ${counts.visa_free ?? 0} visa-free`
                  : "Select a passport to see colored visa access"}
              </p>
            </div>

            <div className="flex items-end gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 w-64 justify-between font-normal border-border bg-card">
                    {passportCountry ? (
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{passportCountry.flag}</span>
                        <span className="font-medium">{passportCountry.name}</span>
                      </span>
                    ) : <span className="text-muted-foreground">Select passport…</span>}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0">
                  <Command>
                    <CommandInput placeholder="Search…" className="h-10" />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((c) => (
                          <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                            onSelect={() => { setPassport(c.code); setOpen(false); }}>
                            <span className="mr-2">{c.flag}</span>{c.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Legend + filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveFilter("all")}
            aria-pressed={activeFilter === "all"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeFilter === "all" ? "bg-foreground text-background border-foreground" : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
            }`}>
            All countries
          </button>
          {requirementOrder.map((req) => {
            const cfg = reqConfig[req];
            const Icon = cfg.icon;
            const active = activeFilter === req;
            return (
              <button key={req}
                onClick={() => setActiveFilter(active ? "all" : req)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active ? `${cfg.dot} text-white border-transparent` : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
                }`}>
                <Swatch fill={statusFill(req, PATTERN_PREFIX)} onSolid={active} />
                <Icon className="h-3.5 w-3.5 flex-shrink-0" style={active ? undefined : { color: cfg.solid }} aria-hidden="true" />
                {cfg.label}
                {/* Full white on the solid chip: white at 70% drops below 4.5:1 on the lighter solids. */}
                {counts[req] ? <span className={active ? undefined : "opacity-70"}>({counts[req]})</span> : null}
              </button>
            );
          })}
          <span className="flex items-center gap-1.5 px-1 py-1.5 text-xs text-muted-foreground">
            <Swatch fill={PASSPORT_FILL} />
            Your passport
          </span>
          <span className="flex items-center gap-1.5 px-1 py-1.5 text-xs text-muted-foreground">
            <Swatch fill={noDataFill(PATTERN_PREFIX)} />
            No data
          </span>
        </div>

        {/* Map */}
        <div className="relative bg-secondary/40 rounded-2xl border border-border/70 overflow-hidden"
          style={{ height: "520px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 rounded-2xl">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Loading visa data…</p>
              </div>
            </div>
          )}

          <ComposableMap
            projectionConfig={{ scale: 147, center: center }}
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <StatusPatternDefs prefix={PATTERN_PREFIX} />
            </defs>
            <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({ zoom: z, coordinates }) => {
              setZoom(z); setCenter(coordinates as [number, number]);
            }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: { rsmKey: string; id?: string; properties: { name: string } }[] }) =>
                  geographies.map((geo) => {
                    const alpha2 = alpha2FromAtlasId(geo.id);
                    const { fill, dimmed } = getCountryColor(String(geo.id ?? ""));
                    const fillOpacity = dimmed ? FILTERED_OUT_OPACITY : 1;
                    // The word for screen readers (paths are focusable); sighted
                    // readers get it from the tooltip, so no <title> double-tooltip.
                    const word = !alpha2 ? null
                      : alpha2 === passport ? "Your passport"
                      : pairStyle(alpha2)?.label ?? (hasData ? "No data" : null);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#fff"
                        strokeWidth={0.4}
                        aria-label={word ? `${geo.properties.name}: ${word}` : geo.properties.name}
                        style={{
                          default: { outline: "none", transition: "fill 0.15s, fill-opacity 0.15s", fillOpacity },
                          hover: { outline: "none", fill, fillOpacity: dimmed ? FILTERED_OUT_OPACITY * 2 : 1, opacity: 0.85, cursor: alpha2 ? "pointer" : "default" },
                          // Pressed also covers a drag-to-pan that starts on a country:
                          // keep a filtered-out country dimmed for the whole drag.
                          pressed: { outline: "none", fillOpacity },
                        }}
                        onMouseEnter={(evt: React.MouseEvent) => handleMouseEnter(geo, evt)}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => {
                          if (!alpha2) return;
                          setLocation(`/destination/${alpha2}`);
                          // The old full page load landed at the top; client-side
                          // navigation keeps the map's scroll offset unless reset.
                          window.scrollTo(0, 0);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
            <button onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg border border-border shadow-sm flex items-center justify-center hover:bg-white transition-colors">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg border border-border shadow-sm flex items-center justify-center hover:bg-white transition-colors">
              <ZoomOut className="h-4 w-4" />
            </button>
            <button onClick={() => { setZoom(1); setCenter([0, 20]); }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg border border-border shadow-sm flex items-center justify-center hover:bg-white transition-colors">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none bg-popover border border-border rounded-xl shadow-md px-3 py-2 text-sm"
              style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}>
              <p className="font-semibold text-foreground">{tooltip.name}</p>
              {tooltip.code && tooltip.code === passport ? (
                <p className="text-xs text-muted-foreground mt-0.5">Your passport</p>
              ) : tipStyle ? (
                <p className={`flex items-center gap-1 text-xs mt-0.5 font-medium ${tipStyle.color}`}>
                  <tipStyle.icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  {tipStyle.label}
                </p>
              ) : tooltip.code && hasData ? (
                <p className="text-xs text-muted-foreground mt-0.5">No data</p>
              ) : null}
              {tooltip.code && <p className="text-xs text-muted-foreground">Click to view profile</p>}
            </div>
          )}
        </div>

        {/* Stats row */}
        {passport && !isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
            {requirementOrder.map((req) => {
              const cfg = reqConfig[req];
              const Icon = cfg.icon;
              return (
                <div key={req} className="rounded-xl border border-border/70 bg-card p-3 shadow-sm text-center">
                  <Icon className="h-4 w-4 mx-auto mb-1.5" style={{ color: cfg.solid }} aria-hidden="true" />
                  <p className="text-xl font-bold text-foreground">{counts[req] ?? 0}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{cfg.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {!passport && (
          <div className="mt-6 text-center text-muted-foreground py-8">
            <Globe className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>Select a passport above to see the world colored by visa access.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
