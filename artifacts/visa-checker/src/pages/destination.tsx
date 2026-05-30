import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { MapPin, DollarSign, MessageSquare, Users, Maximize2, CheckCircle2, Clock, Shield, AlertCircle, XCircle, ArrowRight, CalendarDays, Landmark, ShieldCheck, Wifi, Laptop, Heart, Sun, ThumbsUp, Share2, Copy, Check } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey, useGetCountryTouristInfo, getGetCountryTouristInfoQueryKey } from "@workspace/api-client-react";
import type { VisaResult, VisaRequirement } from "@workspace/api-client-react";
import { countryMeta } from "@/data/countryMeta";
import { AttractionCard } from "@/components/AttractionCard";
import { EntryChecklist } from "@/components/EntryChecklist";
import { getEntryRules, hasSpecificRules } from "@/data/entryRequirements";
import { getEnrichedScore, getSafetyLabel, getCostLabel, getInternetLabel, getLivabilityLabel, getHealthcareLabel } from "@/data/countryScores";

const POPULAR_DESTINATIONS = [
  { code: "JP", label: "Japan" }, { code: "FR", label: "France" }, { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" }, { code: "TH", label: "Thailand" }, { code: "GB", label: "UK" },
  { code: "US", label: "USA" }, { code: "AU", label: "Australia" }, { code: "GR", label: "Greece" },
  { code: "PT", label: "Portugal" }, { code: "ID", label: "Indonesia" }, { code: "MX", label: "Mexico" },
  { code: "AE", label: "Dubai" }, { code: "SG", label: "Singapore" }, { code: "TR", label: "Turkey" },
  { code: "MA", label: "Morocco" }, { code: "VN", label: "Vietnam" }, { code: "DE", label: "Germany" },
  { code: "HR", label: "Croatia" }, { code: "NZ", label: "New Zealand" },
];

function PeopleAlsoCheck({ currentCode, countries }: { currentCode: string; countries: { code: string; flag: string; name: string }[] }) {
  const items = POPULAR_DESTINATIONS.filter((d) => d.code !== currentCode).slice(0, 10);
  const flagOf = (c: string) => countries.find((x) => x.code === c)?.flag ?? "🌍";
  return (
    <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-sm mb-4">
      <h2 className="text-sm font-semibold text-foreground mb-3">People also check</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((d) => (
          <a key={d.code} href={`/destination/${d.code}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors text-sm text-foreground">
            <span>{flagOf(d.code)}</span>
            <span>{d.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ShareBar({ name, code }: { name: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://www.isvisarequired.com/destination/${code}`;
  const text = `Explore ${name} — visa info, travel tips, and country profile on isvisarequired.com`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-zinc-800 transition-colors">
        𝕏 Post
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors">
        WhatsApp
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">
        Facebook
      </a>
      <button onClick={copy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium hover:bg-secondary/50 transition-colors">
        {copied ? <><Check className="h-3.5 w-3.5 text-green-600" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy link</>}
      </button>
    </div>
  );
}

const reqConfig: Record<VisaRequirement, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  visa_free:       { label: "Visa Free",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: CheckCircle2 },
  visa_on_arrival: { label: "Visa on Arrival",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock },
  e_visa:          { label: "eVisa",            color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   icon: Shield },
  visa_required:   { label: "Visa Required",    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: AlertCircle },
  no_admission:    { label: "No Admission",     color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: XCircle },
};

const reqOrder: VisaRequirement[] = ["visa_free", "visa_on_arrival", "e_visa", "visa_required", "no_admission"];

export default function DestinationPage() {
  const params = useParams<{ code: string }>();
  const code = (params.code ?? "").toUpperCase();

  const { data: countries = [] } = useListCountries();
  const country = countries.find((c) => c.code === code);
  const meta = countryMeta[code];

  const { data: touristInfo } = useGetCountryTouristInfo(code, {
    query: { enabled: !!code, queryKey: getGetCountryTouristInfoQueryKey(code) },
  });

  // Get all visa results where this country is the DESTINATION
  // We'll use check-all for a few key passports as a sample — for full breakdown we aggregate
  const { data: allResults = [], isLoading } = useCheckVisaAll(
    { passport: code },
    { query: { enabled: !!code, queryKey: getCheckVisaAllQueryKey({ passport: code }) } }
  );

  // Passports that can enter this destination visa-free (we'd need a reverse lookup)
  // For now, show how THIS passport accesses others (standard check-all)
  const grouped = useMemo(() => {
    const map: Partial<Record<VisaRequirement, VisaResult[]>> = {};
    (allResults as VisaResult[]).forEach((r) => {
      if (!map[r.requirement]) map[r.requirement] = [];
      map[r.requirement]!.push(r);
    });
    return map;
  }, [allResults]);

  const score = getEnrichedScore(code);

  const vfCount = grouped.visa_free?.length ?? 0;
  const voaCount = grouped.visa_on_arrival?.length ?? 0;
  const evCount = grouped.e_visa?.length ?? 0;
  const vrCount = grouped.visa_required?.length ?? 0;
  const naCount = grouped.no_admission?.length ?? 0;
  const accessible = vfCount + voaCount + evCount;

  const siteUrl = "https://www.isvisarequired.com";

  useSEO({
    title: country ? `${country.name} — Country Profile, Visa Info & Travel Facts` : "Country Profile",
    description: meta
      ? `${meta.description} Capital: ${meta.capital}. Currency: ${meta.currency}. Language: ${meta.language}.`
      : `Travel information and visa requirements for ${country?.name ?? "this country"}.`,
    canonical: `${siteUrl}/destination/${code}`,
    jsonLd: country ? [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
          { "@type": "ListItem", "position": 2, "name": "Discover", "item": `${siteUrl}/discover` },
          { "@type": "ListItem", "position": 3, "name": country.name, "item": `${siteUrl}/destination/${code}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Country",
        "name": country.name,
        "url": `${siteUrl}/destination/${code}`,
        ...(meta ? {
          "description": meta.description,
          "containedInPlace": { "@type": "Continent" },
        } : {}),
      },
    ] : undefined,
  });

  // Loading skeleton — countries haven't arrived from API yet
  if (countries.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeHref="/discover" />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="animate-pulse">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 bg-secondary/60 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2.5 pt-1">
                <div className="h-8 bg-secondary/60 rounded-lg w-56" />
                <div className="h-4 bg-secondary/40 rounded-lg w-full max-w-lg" />
                <div className="h-4 bg-secondary/30 rounded-lg w-3/4 max-w-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="h-52 bg-secondary/60 rounded-2xl" />
              <div className="lg:col-span-2 h-52 bg-secondary/60 rounded-2xl" />
            </div>
            <div className="h-40 bg-secondary/40 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Country not found.</p>
          <a href="/" className="text-primary text-sm mt-2 inline-block">← Back to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/discover" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {country && (
          <>
            {/* Hero */}
            <div className="flex items-start gap-4 mb-8">
              <span className="text-6xl drop-shadow-sm">{country.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-serif font-bold text-foreground">{country.name}</h1>
                  <span className="text-xs bg-secondary/60 text-foreground px-2 py-1 rounded-full">{country.region}</span>
                </div>
                {meta && <p className="text-muted-foreground mt-1 leading-relaxed max-w-2xl">{meta.description}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Country facts */}
              {meta && (
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Country Facts</h2>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Capital</p>
                          <p className="text-sm font-medium text-foreground">{meta.capital}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <DollarSign className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Currency</p>
                          <p className="text-sm font-medium text-foreground">{meta.currency}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Language</p>
                          <p className="text-sm font-medium text-foreground">{meta.language}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Population</p>
                          <p className="text-sm font-medium text-foreground">{meta.population}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Maximize2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Area</p>
                          <p className="text-sm font-medium text-foreground">{meta.area}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-5 pt-5 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Check if you need a visa to visit {country.name}</p>
                      <a href={`/?destinations=${code}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Check Visa Requirements
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Passport power stats */}
              <div className={meta ? "lg:col-span-2" : "lg:col-span-3"}>
                  <div className="bg-card rounded-2xl border border-border/70 p-5 h-full shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">{country.name} Passport Power</h2>
                  <p className="text-xs text-muted-foreground mb-4">Where can {country.name} passport holders travel?</p>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                        {[
                          { label: "Visa Free", count: vfCount, cls: "text-green-700 bg-green-50 border-green-200" },
                          { label: "Visa on Arrival", count: voaCount, cls: "text-amber-700 bg-amber-50 border-amber-200" },
                          { label: "eVisa", count: evCount, cls: "text-blue-700 bg-blue-50 border-blue-200" },
                          { label: "Visa Required", count: vrCount, cls: "text-orange-700 bg-orange-50 border-orange-200" },
                          { label: "No Admission", count: naCount, cls: "text-red-700 bg-red-50 border-red-200" },
                          { label: "Total Accessible", count: accessible, cls: "text-primary bg-primary/5 border-primary/20" },
                        ].map((s) => (
                          <div key={s.label} className={`rounded-xl border p-3 ${s.cls}`}>
                            <p className="text-2xl font-bold">{s.count}</p>
                            <p className="text-xs mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Destination lists by requirement */}
                      {reqOrder.map((req) => {
                        const list = grouped[req];
                        if (!list || list.length === 0) return null;
                        const cfg = reqConfig[req];
                        const Icon = cfg.icon;
                        return (
                          <div key={req} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3 mb-3 shadow-sm`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className={`h-4 w-4 ${cfg.color}`} />
                              <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                              <span className="text-xs text-muted-foreground">({list.length} countries)</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {list.slice(0, 30).map((r) => (
                                <a key={r.destinationCountry.code}
                                  href={`/destination/${r.destinationCountry.code}`}
                                  className="inline-flex items-center gap-1 text-xs bg-white/60 hover:bg-white rounded-full px-2 py-0.5 transition-colors">
                                  <span>{r.destinationCountry.flag}</span>
                                  <span className="text-foreground">{r.destinationCountry.name}</span>
                                </a>
                              ))}
                              {list.length > 30 && (
                                <a href={`/passport/${code}`} className="text-xs text-primary underline ml-1 self-center">
                                  +{list.length - 30} more →
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Travel Scores */}
            {score && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-foreground">Travel Scores</h2>
                    <p className="text-xs text-muted-foreground">Safety · Cost of living · Internet speed · Climate</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Safety */}
                  {(() => {
                    const s = getSafetyLabel(score.safetyIndex);
                    return (
                      <div className={`rounded-2xl border p-4 ${s.bg} ${s.border}`}>
                        <ShieldCheck className={`h-5 w-5 mb-2 ${s.color}`} />
                        <p className={`text-2xl font-bold ${s.color}`}>{score.safetyIndex}<span className="text-sm font-normal">/100</span></p>
                        <p className={`text-xs font-semibold mt-0.5 ${s.color}`}>{s.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Safety Index</p>
                      </div>
                    );
                  })()}
                  {/* Cost of Living */}
                  {(() => {
                    const c = getCostLabel(score.costOfLivingIndex);
                    return (
                      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <DollarSign className={`h-5 w-5 mb-2 ${c.color}`} />
                        <p className={`text-2xl font-bold ${c.color}`}>{score.costOfLivingIndex}<span className="text-sm font-normal text-muted-foreground"> /NYC</span></p>
                        <p className={`text-xs font-semibold mt-0.5 ${c.color}`}>{c.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Cost of Living</p>
                      </div>
                    );
                  })()}
                  {/* Internet */}
                  {(() => {
                    const n = getInternetLabel(score.internetSpeedMbps);
                    return (
                      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <Wifi className={`h-5 w-5 mb-2 ${n.color}`} />
                        <p className={`text-2xl font-bold ${n.color}`}>{score.internetSpeedMbps}<span className="text-sm font-normal text-muted-foreground"> Mbps</span></p>
                        <p className={`text-xs font-semibold mt-0.5 ${n.color}`}>{n.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Avg Internet Speed</p>
                      </div>
                    );
                  })()}
                  {/* Nomad Score */}
                  <div className={`rounded-2xl border p-4 ${score.nomadScore >= 75 ? "bg-violet-50 border-violet-200" : score.nomadScore >= 55 ? "bg-blue-50 border-blue-200" : "bg-secondary/30 border-border/70"}`}>
                    <Laptop className={`h-5 w-5 mb-2 ${score.nomadScore >= 75 ? "text-violet-600" : score.nomadScore >= 55 ? "text-blue-600" : "text-muted-foreground"}`} />
                    <p className={`text-2xl font-bold ${score.nomadScore >= 75 ? "text-violet-700" : score.nomadScore >= 55 ? "text-blue-700" : "text-muted-foreground"}`}>
                      {score.nomadScore}<span className="text-sm font-normal">/100</span>
                    </p>
                    <p className={`text-xs font-semibold mt-0.5 ${score.nomadScore >= 75 ? "text-violet-700" : score.nomadScore >= 55 ? "text-blue-700" : "text-muted-foreground"}`}>
                      {score.nomadScore >= 80 ? "Top Nomad Hub" : score.nomadScore >= 65 ? "Nomad Friendly" : score.nomadScore >= 45 ? "Emerging" : "Limited"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Digital Nomad Score</p>
                  </div>
                </div>
                {/* Livability + Healthcare (extended data) */}
                {(score.livabilityScore || score.healthcareScore) && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {score.livabilityScore && (() => {
                      const l = getLivabilityLabel(score.livabilityScore!);
                      return (
                        <div className={`rounded-2xl border p-4 ${l.bg} ${l.border}`}>
                          <ThumbsUp className={`h-5 w-5 mb-2 ${l.color}`} />
                          <p className={`text-2xl font-bold ${l.color}`}>{score.livabilityScore}<span className="text-sm font-normal">/100</span></p>
                          <p className={`text-xs font-semibold mt-0.5 ${l.color}`}>{l.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Livability Score</p>
                        </div>
                      );
                    })()}
                    {score.healthcareScore && (() => {
                      const h = getHealthcareLabel(score.healthcareScore!);
                      return (
                        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                          <Heart className={`h-5 w-5 mb-2 ${h.color}`} />
                          <p className={`text-2xl font-bold ${h.color}`}>{score.healthcareScore}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
                          <p className={`text-xs font-semibold mt-0.5 ${h.color}`}>{h.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Healthcare Quality</p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Climate + Best Time row */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                    <CalendarDays className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-amber-700">Climate: </span>
                      <span className="text-xs text-amber-800">{score.climate}</span>
                    </div>
                    {score.nomadScore >= 70 && (
                      <a href="/digital-nomad" className="text-xs text-violet-600 font-medium hover:underline flex-shrink-0">
                        Nomad visa →
                      </a>
                    )}
                  </div>

                  {score.bestTimeToVisit && (
                    <div className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl px-4 py-2.5">
                      <Sun className="h-4 w-4 text-sky-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-sky-700">Best time to visit: </span>
                        <span className="text-xs text-sky-800">{score.bestTimeToVisit}</span>
                        {score.weatherSummary && (
                          <p className="text-xs text-sky-700 mt-0.5 leading-relaxed">{score.weatherSummary}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick links */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`/map?passport=${code}`}
                    className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline border border-primary/20 bg-primary/5 rounded-full px-3 py-1">
                    🗺 View on World Map
                  </a>
                  <a href={`/trip-planner`}
                    className="inline-flex items-center gap-1 text-xs text-teal-700 font-medium hover:underline border border-teal-200 bg-teal-50 rounded-full px-3 py-1">
                    ✈️ Plan a trip here
                  </a>
                  <a href={`/reciprocity?passportA=${code}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-700 font-medium hover:underline border border-blue-200 bg-blue-50 rounded-full px-3 py-1">
                    ↔️ Check reciprocity
                  </a>
                </div>
              </div>
            )}

            {/* Entry Requirements Checklist */}
            <div className="mb-6">
              <EntryChecklist
                countryName={country.name}
                countryFlag={country.flag}
                rules={getEntryRules(code)}
                hasSpecific={hasSpecificRules(code)}
              />
            </div>

            {/* Tourist Attractions */}
            {touristInfo && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Landmark className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-foreground">Top Attractions</h2>
                    {touristInfo.tagline && (
                      <p className="text-sm text-muted-foreground italic">"{touristInfo.tagline}"</p>
                    )}
                  </div>
                </div>

                {/* Quick facts strip */}
                <div className="flex flex-wrap gap-3 mb-5">
                  {touristInfo.bestTimeToVisit && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                      <CalendarDays className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-amber-700 font-semibold">Best time to visit</p>
                        <p className="text-xs text-amber-800">{touristInfo.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}
                  {touristInfo.timezone && (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                      <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-700 font-semibold">Timezone</p>
                        <p className="text-xs text-blue-800">{touristInfo.timezone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attraction cards grid */}
                {touristInfo.attractions && touristInfo.attractions.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {touristInfo.attractions.slice(0, 8).map((attraction) => (
                      <AttractionCard key={attraction.name} attraction={attraction} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* People Also Check */}
            <PeopleAlsoCheck currentCode={code} countries={countries} />

            {/* Share this page */}
            <ShareBar name={country.name} code={code} />

            {/* Related links */}
            <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-3">Explore more</h2>
              <div className="flex flex-wrap gap-2">
                <a href={`/passport/${code}`}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-secondary/50 transition-colors">
                  {country.flag} Full passport page →
                </a>
                <a href={`/?destinations=${code}`}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-secondary/50 transition-colors">
                  Who can visit {country.name} →
                </a>
                <a href="/discover"
                  className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-secondary/50 transition-colors">
                  Discover more destinations →
                </a>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Country facts sourced from UN Statistics Division, World Bank, and CIA World Factbook. Always verify visa requirements with official embassy sources before travel.
            </p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
