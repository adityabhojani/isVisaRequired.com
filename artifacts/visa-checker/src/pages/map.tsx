import { useState, useMemo, useCallback } from "react";
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

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO 3166-1 numeric → alpha-2 mapping (world-atlas uses numeric codes)
const NUM_TO_A2: Record<string, string> = {
  "4":"AF","8":"AL","12":"DZ","24":"AO","32":"AR","36":"AU","40":"AT","50":"BD",
  "56":"BE","64":"BT","68":"BO","70":"BA","72":"BW","76":"BR","100":"BG","104":"MM",
  "116":"KH","124":"CA","140":"CF","144":"LK","148":"TD","152":"CL","156":"CN",
  "170":"CO","188":"CR","191":"HR","192":"CU","196":"CY","203":"CZ","208":"DK",
  "218":"EC","222":"SV","231":"ET","233":"EE","246":"FI","250":"FR","266":"GA",
  "276":"DE","288":"GH","300":"GR","320":"GT","324":"GN","332":"HT","340":"HN",
  "348":"HU","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL",
  "380":"IT","388":"JM","392":"JP","400":"JO","404":"KE","408":"KP","410":"KR",
  "414":"KW","418":"LA","422":"LB","428":"LV","430":"LR","434":"LY","440":"LT",
  "442":"LU","450":"MG","458":"MY","466":"ML","484":"MX","496":"MN","498":"MD",
  "499":"ME","504":"MA","508":"MZ","516":"NA","524":"NP","528":"NL","554":"NZ",
  "558":"NI","566":"NG","578":"NO","586":"PK","591":"PA","598":"PG","600":"PY",
  "604":"PE","608":"PH","616":"PL","620":"PT","634":"QA","642":"RO","643":"RU",
  "682":"SA","686":"SN","694":"SL","703":"SK","704":"VN","705":"SI","706":"SO",
  "710":"ZA","716":"ZW","724":"ES","728":"SS","729":"SD","740":"SR","752":"SE",
  "756":"CH","760":"SY","762":"TJ","764":"TH","780":"TT","788":"TN","792":"TR",
  "800":"UG","804":"UA","784":"AE","826":"GB","834":"TZ","840":"US","858":"UY",
  "860":"UZ","862":"VE","887":"YE","894":"ZM","031":"AZ","051":"AM","096":"BN",
  "262":"DJ","807":"MK","670":"VC","662":"LC","659":"KN","688":"RS",
};

const reqColors: Record<VisaRequirement, string> = {
  visa_free:       "#16a34a",
  visa_on_arrival: "#d97706",
  e_visa:          "#2563eb",
  visa_required:   "#ea580c",
  no_admission:    "#dc2626",
};

const reqLabels: Record<VisaRequirement, string> = {
  visa_free:       "Visa Free",
  visa_on_arrival: "Visa on Arrival",
  e_visa:          "eVisa Available",
  visa_required:   "Visa Required",
  no_admission:    "No Admission",
};

const reqOrder: VisaRequirement[] = ["visa_free", "visa_on_arrival", "e_visa", "visa_required", "no_admission"];

interface TooltipState {
  name: string;
  code: string;
  req: VisaRequirement | null;
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

  const counts = useMemo(() => {
    const c: Partial<Record<VisaRequirement, number>> = {};
    (rawResults as VisaResult[]).forEach((r) => { c[r.requirement] = (c[r.requirement] ?? 0) + 1; });
    return c;
  }, [rawResults]);

  const getCountryColor = useCallback((numericCode: string | number) => {
    const code = NUM_TO_A2[String(numericCode)];
    if (!code) return "#e2e8f0";
    const req = visaMap[code];
    if (!req) return "#e2e8f0";
    if (activeFilter !== "all" && req !== activeFilter) return "#e2e8f0";
    return reqColors[req];
  }, [visaMap, activeFilter]);

  const handleMouseEnter = useCallback((geo: { id?: string; properties: { name: string } }, evt: React.MouseEvent) => {
    const code = NUM_TO_A2[String(geo.id ?? "")] ?? "";
    const req = code ? (visaMap[code] ?? null) : null;
    setTooltip({ name: geo.properties.name, code, req, x: evt.clientX, y: evt.clientY });
  }, [visaMap]);

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    setTooltip((prev) => prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/map" />

      <div className="bg-gradient-to-b from-sky-50/80 via-primary/4 to-transparent border-b border-border/50">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeFilter === "all" ? "bg-foreground text-background border-foreground" : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
            }`}>
            All countries
          </button>
          {reqOrder.map((req) => (
            <button key={req}
              onClick={() => setActiveFilter(activeFilter === req ? "all" : req)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeFilter === req ? "text-white border-transparent" : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
              }`}
              style={activeFilter === req ? { backgroundColor: reqColors[req], borderColor: reqColors[req] } : {}}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: reqColors[req] }} />
              {reqLabels[req]}
              {counts[req] ? <span className="opacity-70">({counts[req]})</span> : null}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="relative bg-gradient-to-b from-sky-100/60 to-sky-50/30 rounded-2xl border border-border/70 overflow-hidden shadow-sm"
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
            <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({ zoom: z, coordinates }) => {
              setZoom(z); setCenter(coordinates as [number, number]);
            }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: { rsmKey: string; id?: string; properties: { name: string } }[] }) =>
                  geographies.map((geo) => {
                    const alpha2 = NUM_TO_A2[String(geo.id ?? "")];
                    const fill = getCountryColor(String(geo.id ?? ""));
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#fff"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: "none", transition: "fill 0.15s" },
                          hover: { outline: "none", fill: fill === "#e2e8f0" ? "#cbd5e1" : fill, opacity: 0.85, cursor: alpha2 ? "pointer" : "default" },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={(evt: React.MouseEvent) => handleMouseEnter(geo, evt)}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => {
                          if (alpha2) window.location.href = `/destination/${alpha2}`;
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
              className="fixed z-50 pointer-events-none bg-popover border border-border rounded-xl shadow-xl px-3 py-2 text-sm"
              style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}>
              <p className="font-semibold text-foreground">{tooltip.name}</p>
              {tooltip.req ? (
                <p className="text-xs mt-0.5 font-medium" style={{ color: reqColors[tooltip.req] }}>
                  {reqLabels[tooltip.req]}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">No data</p>
              )}
              {tooltip.code && <p className="text-xs text-muted-foreground">Click to view profile</p>}
            </div>
          )}
        </div>

        {/* Stats row */}
        {passport && !isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
            {reqOrder.map((req) => (
              <div key={req} className="rounded-xl border border-border/70 bg-card p-3 shadow-sm text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ backgroundColor: reqColors[req] }} />
                <p className="text-xl font-bold text-foreground">{counts[req] ?? 0}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{reqLabels[req]}</p>
              </div>
            ))}
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
