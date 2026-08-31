import { useState, useMemo, useEffect, useRef } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { VisaResult, VisaRequirement } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Route, Plus, Trash2, ChevronDown, CheckCircle2, Clock, Shield,
  AlertCircle, XCircle, ArrowRight, MapPin, Plane, Save, Share2, Info, CalendarDays, Download,
} from "lucide-react";

const reqConfig: Record<VisaRequirement, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  visa_free:       { label: "Visa Free",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: CheckCircle2 },
  visa_on_arrival: { label: "Visa on Arrival",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock },
  e_visa:          { label: "eVisa",            color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   icon: Shield },
  visa_required:   { label: "Visa Required",    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: AlertCircle },
  no_admission:    { label: "No Admission",     color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: XCircle },
};

interface TripStop {
  id: string;
  countryCode: string;
  days: number;
}

interface LegVisa {
  from: string;
  to: string;
  req: VisaRequirement;
  country: { name: string; flag: string };
}

const MAX_STOPS = 8;

function uid() { return Math.random().toString(36).slice(2, 9); }

function CountryPicker({ value, onChange, countries, placeholder }: {
  value: string;
  onChange: (code: string) => void;
  countries: { code: string; name: string; flag: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = countries.find((c) => c.code === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-10 font-normal text-sm border-border bg-card">
          {selected ? (
            <span className="flex items-center gap-1.5">
              <span className="text-base">{selected.flag}</span>
              <span className="font-medium truncate">{selected.name}</span>
            </span>
          ) : <span className="text-muted-foreground truncate">{placeholder ?? "Select country…"}</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-40 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search…" className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((c) => (
                <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                  onSelect={() => { onChange(c.code); setOpen(false); }}>
                  <span className="mr-2">{c.flag}</span>{c.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function VisaBadge({ req }: { req: VisaRequirement }) {
  const cfg = reqConfig[req];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

const LS_KEY = "trip_planner_trips";

function loadSavedTrips(): { name: string; passport: string; stops: TripStop[] }[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}

// Hex colors for the downloadable card (html2canvas can't parse Tailwind v4 oklch).
const REQ_HEX: Record<VisaRequirement, { label: string; color: string }> = {
  visa_free: { label: "Visa-free", color: "#10b981" },
  visa_on_arrival: { label: "Visa on arrival", color: "#f59e0b" },
  e_visa: { label: "eVisa", color: "#0DB5E8" },
  visa_required: { label: "Visa required", color: "#ef4444" },
  no_admission: { label: "Not permitted", color: "#6b7280" },
};

export default function TripPlannerPage() {
  useSEO({
    title: "Trip Planner — Plan Multi-Destination Travel with Visa Requirements",
    description: "Plan your multi-destination trip and instantly see visa requirements for every leg. Know before you go which visas to apply for.",
  });

  const [passport, setPassport] = useState("US");
  const [passportOpen, setPassportOpen] = useState(false);
  const [stops, setStops] = useState<TripStop[]>([
    { id: uid(), countryCode: "FR", days: 7 },
    { id: uid(), countryCode: "IT", days: 5 },
    { id: uid(), countryCode: "ES", days: 5 },
  ]);
  const [savedTrips, setSavedTrips] = useState(loadSavedTrips);
  const [tripName, setTripName] = useState("My Europe Trip");
  const [shareMsg, setShareMsg] = useState("");

  const { data: countries = [] } = useListCountries();
  const passportCountry = countries.find((c) => c.code === passport);

  // Fetch visa results for passport → all destinations
  const { data: rawResults = [], isLoading } = useCheckVisaAll(
    { passport },
    { query: { enabled: !!passport, queryKey: getCheckVisaAllQueryKey({ passport }) } }
  );

  const visaMap = useMemo(() => {
    const m: Record<string, VisaRequirement> = {};
    (rawResults as VisaResult[]).forEach((r) => { m[r.destinationCountry.code] = r.requirement; });
    return m;
  }, [rawResults]);

  const legVisas: LegVisa[] = useMemo(() => {
    const result: LegVisa[] = [];
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      if (!stop.countryCode) continue;
      const req = visaMap[stop.countryCode];
      if (!req) continue;
      const country = countries.find((c) => c.code === stop.countryCode);
      if (!country) continue;
      result.push({ from: passport, to: stop.countryCode, req, country });
    }
    return result;
  }, [stops, visaMap, passport, countries]);

  const totalDays = stops.reduce((s, t) => s + t.days, 0);
  const visasNeeded = legVisas.filter((l) => l.req === "visa_required").length;
  const evisas = legVisas.filter((l) => l.req === "e_visa").length;
  const blockers = legVisas.filter((l) => l.req === "no_admission").length;

  const addStop = () => {
    if (stops.length >= MAX_STOPS) return;
    setStops((prev) => [...prev, { id: uid(), countryCode: "", days: 5 }]);
  };
  const removeStop = (id: string) => setStops((prev) => prev.filter((s) => s.id !== id));
  const updateStop = (id: string, patch: Partial<TripStop>) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const saveTrip = () => {
    const trip = { name: tripName || "My Trip", passport, stops };
    const trips = [trip, ...savedTrips.filter((t) => t.name !== trip.name)].slice(0, 5);
    localStorage.setItem(LS_KEY, JSON.stringify(trips));
    setSavedTrips(trips);
    setShareMsg("Trip saved!");
    setTimeout(() => setShareMsg(""), 2000);
  };

  const shareTrip = async () => {
    const params = new URLSearchParams({ passport, stops: JSON.stringify(stops.map((s) => ({ c: s.countryCode, d: s.days }))) });
    const url = `${window.location.origin}/trip-planner?${params}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setShareMsg("Link copied!");
    setTimeout(() => setShareMsg(""), 2000);
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const downloadCard = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    setShareMsg("Generating card…");
    try {
      // Loaded on demand: html2canvas is ~196 KB and only needed when the
      // visitor actually downloads a card (same pattern as PassportPowerCard).
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
      const link = document.createElement("a");
      link.download = `${(tripName || "trip").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-visa-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setShareMsg("Card downloaded!");
    } catch {
      setShareMsg("Couldn't generate card — try again.");
    } finally {
      setDownloading(false);
      setTimeout(() => setShareMsg(""), 2500);
    }
  };

  // Load from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("passport");
    const s = params.get("stops");
    if (p) setPassport(p);
    if (s) {
      try {
        const parsed = JSON.parse(s) as { c: string; d: number }[];
        setStops(parsed.map((x) => ({ id: uid(), countryCode: x.c, days: x.d })));
      } catch {}
    }
  }, []);

  const loadSaved = (t: { name: string; passport: string; stops: TripStop[] }) => {
    setPassport(t.passport);
    setStops(t.stops);
    setTripName(t.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/trip-planner" />

      {/* Hero */}
      <div className="bg-gradient-to-b from-teal-50/80 via-primary/4 to-transparent border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 rounded-full px-3.5 py-1 text-xs font-semibold mb-4 border border-teal-200">
            <Route className="h-3 w-3" />
            Multi-stop · Visa requirements per leg
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
            Trip Planner
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Build your multi-destination itinerary and instantly see what visas you'll need for every stop.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Left: planner */}
          <div className="space-y-5">
            {/* Passport row */}
            <div className="bg-card rounded-2xl border border-border/70 shadow-sm p-5">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-primary flex-shrink-0" />
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap">Your Passport</label>
                </div>
                <div className="w-56">
                  <Popover open={passportOpen} onOpenChange={setPassportOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-10 font-normal text-sm border-border bg-card">
                        {passportCountry ? (
                          <span className="flex items-center gap-2">
                            <span>{passportCountry.flag}</span>
                            <span className="font-medium">{passportCountry.name}</span>
                          </span>
                        ) : <span className="text-muted-foreground">Select passport…</span>}
                        <ChevronDown className="h-3.5 w-3.5 opacity-40" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0">
                      <Command>
                        <CommandInput placeholder="Search…" className="h-9" />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((c) => (
                              <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                                onSelect={() => { setPassport(c.code); setPassportOpen(false); }}>
                                <span className="mr-2">{c.flag}</span>{c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {passportCountry && (
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Loading visa data…" : `${Object.keys(visaMap).length} countries loaded`}
                  </p>
                )}
              </div>
            </div>

            {/* Stops */}
            <div className="space-y-2">
              {stops.map((stop, idx) => {
                const legVisa = legVisas.find((l) => l.to === stop.countryCode);
                const cfg = legVisa ? reqConfig[legVisa.req] : null;
                const Icon = cfg?.icon;
                return (
                  <div key={stop.id}>
                    {/* Connector */}
                    {idx > 0 && (
                      <div className="flex items-center gap-2 py-1 pl-5">
                        <div className="w-px h-4 bg-border mx-3" />
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                        <span className="text-xs text-muted-foreground">Fly to →</span>
                      </div>
                    )}

                    <div className={`bg-card rounded-2xl border shadow-sm p-4 transition-colors ${cfg ? `${cfg.border}` : "border-border/70"}`}>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Stop number */}
                        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>

                        {/* Country picker */}
                        <div className="flex-1 min-w-[160px]">
                          <CountryPicker
                            value={stop.countryCode}
                            onChange={(code) => updateStop(stop.id, { countryCode: code })}
                            countries={countries}
                            placeholder="Select destination…"
                          />
                        </div>

                        {/* Days */}
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="number"
                            min={1}
                            max={365}
                            value={stop.days}
                            onChange={(e) => updateStop(stop.id, { days: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="w-16 text-center text-sm border border-border rounded-lg h-9 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          <span className="text-xs text-muted-foreground">days</span>
                        </div>

                        {/* Visa badge */}
                        {cfg && Icon && <VisaBadge req={legVisa!.req} />}

                        {/* Remove */}
                        {stops.length > 1 && (
                          <button onClick={() => removeStop(stop.id)}
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors ml-auto">
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </div>

                      {/* Notes for visa req */}
                      {legVisa && legVisa.req === "visa_required" && (
                        <div className="mt-3 flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                          <Info className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-orange-700">
                            {passportCountry?.name} passport holders need to apply for a visa in advance for{" "}
                            <a href={`/destination/${stop.countryCode}`} className="underline font-medium">
                              {legVisa.country.name}
                            </a>.
                          </p>
                        </div>
                      )}
                      {legVisa && legVisa.req === "no_admission" && (
                        <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                          <XCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-red-700">
                            Entry not permitted for {passportCountry?.name} passport holders.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add stop */}
            {stops.length < MAX_STOPS && (
              <button onClick={addStop}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Plus className="h-4 w-4" />
                Add destination
              </button>
            )}

            <AdSlot slotId="7261930485" size="responsive" />
          </div>

          {/* Right: summary */}
          <div className="space-y-4">
            {/* Trip name + save */}
            <div className="bg-card rounded-2xl border border-border/70 shadow-sm p-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                Trip Name
              </label>
              <input
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="w-full text-sm border border-border rounded-xl h-10 px-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                placeholder="My dream trip…"
              />
              <div className="flex gap-2">
                <button onClick={saveTrip}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                  <Save className="h-3.5 w-3.5" />
                  Save
                </button>
                <button onClick={shareTrip}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors border border-border">
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              </div>
              <button onClick={downloadCard} disabled={downloading || legVisas.length === 0}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition disabled:opacity-40">
                <Download className="h-3.5 w-3.5" />
                {downloading ? "Generating…" : "Download visa card"}
              </button>
              {shareMsg && <p className="text-xs text-green-600 text-center mt-2 font-medium">{shareMsg}</p>}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-2xl border border-border/70 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Trip Summary</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Destinations", value: stops.filter(s => s.countryCode).length, color: "text-primary" },
                  { label: "Total Days", value: totalDays, color: "text-foreground" },
                  { label: "Visas Needed", value: visasNeeded, color: visasNeeded > 0 ? "text-orange-600" : "text-green-600" },
                  { label: "eVisas", value: evisas, color: evisas > 0 ? "text-blue-600" : "text-foreground" },
                  { label: "Blockers", value: blockers, color: blockers > 0 ? "text-red-600" : "text-green-600" },
                  { label: "Visa-Free", value: legVisas.filter(l => l.req === "visa_free").length, color: "text-green-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-secondary/30 rounded-xl p-2.5 text-center">
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Checklist */}
              {legVisas.filter(l => l.req !== "visa_free").length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Action Required</p>
                  <div className="space-y-2">
                    {legVisas.filter(l => l.req !== "visa_free").map((l) => {
                      const cfg = reqConfig[l.req];
                      const Icon = cfg.icon;
                      return (
                        <div key={l.to} className={`flex items-center gap-2 p-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                          <span className="text-lg flex-shrink-0">{l.country.flag}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{l.country.name}</p>
                            <span className={`text-xs ${cfg.color} font-medium`}>{cfg.label}</span>
                          </div>
                          <a href={`/destination/${l.to}`}
                            className="text-xs text-primary hover:underline flex-shrink-0">
                            Info →
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {legVisas.length > 0 && legVisas.every(l => l.req === "visa_free") && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-green-700">All visa-free!</p>
                  <p className="text-xs text-green-600 mt-0.5">No visa applications needed for this trip.</p>
                </div>
              )}
            </div>

            {/* Saved trips */}
            {savedTrips.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/70 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Saved Trips</h3>
                <div className="space-y-2">
                  {savedTrips.map((t, i) => {
                    const pc = countries.find((c) => c.code === t.passport);
                    return (
                      <button key={i} onClick={() => loadSaved(t)}
                        className="w-full text-left flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-secondary/20 hover:bg-secondary/50 transition-colors">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{pc?.flag} {pc?.name} · {t.stops.length} stops</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Off-screen branded card captured by html2canvas (inline styles only — no Tailwind oklch). */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={cardRef} style={{ width: 560, fontFamily: "Inter, Arial, sans-serif", background: "#ffffff", padding: 28, boxSizing: "border-box", color: "#0f172a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#0A2FA1" }}>isvisarequired<span style={{ color: "#0DB5E8" }}>.com</span></div>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Trip Visa Card</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{tripName || "My Trip"}</div>
          <div style={{ fontSize: 14, color: "#475569", marginBottom: 14 }}>
            Passport: <strong>{passportCountry?.flag} {passportCountry?.name}</strong> · {stops.filter((s) => s.countryCode).length} destinations · {totalDays} days
          </div>
          <div>
            {legVisas.map((l) => {
              const cfg = REQ_HEX[l.req];
              return (
                <div key={l.to} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{l.country.flag} {l.country.name}</div>
                  <div style={{ background: cfg.color, color: "#ffffff", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{cfg.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "2px solid #0A2FA1", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
            <span>{visasNeeded} need a visa · {evisas} eVisa · {legVisas.filter((l) => l.req === "visa_free").length} visa-free</span>
            <span>Plan yours free at isvisarequired.com</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
