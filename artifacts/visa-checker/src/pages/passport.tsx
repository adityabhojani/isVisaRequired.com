import { useMemo, useState, useEffect } from "react";
import { useParams } from "wouter";
import { Globe, CheckCircle2, AlertCircle, Clock, XCircle, Shield, ArrowRight, CreditCard, Share2, Copy, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { PassportPowerCard } from "@/components/PassportPowerCard";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { slugify } from "@/lib/slug";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { VisaResult, VisaRequirement } from "@workspace/api-client-react";

const reqOrder: VisaRequirement[] = ["visa_free", "visa_on_arrival", "e_visa", "visa_required", "no_admission"];

function PassportShareBar({ code, name, vfCount }: { code: string; name: string; vfCount: number }) {
  const [copied, setCopied] = useState(false);
  const url = `https://www.isvisarequired.com/passport/${code}`;
  const text = `${name} passport gives visa-free access to ${vfCount} countries! Check your passport power on isvisarequired.com`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border/70 p-4 shadow-sm">
      <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-muted-foreground" /> Share your passport power
      </p>
      <div className="flex items-center gap-2 flex-wrap">
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary/30 text-xs font-medium hover:bg-secondary/60 transition-colors">
          {copied ? <><Check className="h-3.5 w-3.5 text-green-600" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy link</>}
        </button>
      </div>
    </div>
  );
}

const reqConfig: Record<VisaRequirement, {
  label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2; description: string;
}> = {
  visa_free:       { label: "Visa Free",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: CheckCircle2, description: "No visa needed — just show your passport at the border." },
  visa_on_arrival: { label: "Visa on Arrival",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock,        description: "Get a visa stamp when you arrive at the airport." },
  e_visa:          { label: "eVisa",            color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   icon: Shield,       description: "Apply online before travelling — no embassy visit needed." },
  visa_required:   { label: "Visa Required",    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: AlertCircle,  description: "Apply for a visa at the embassy or consulate in advance." },
  no_admission:    { label: "No Admission",     color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: XCircle,      description: "Entry is not permitted for this passport." },
};

export default function PassportPage() {
  const params = useParams<{ code: string }>();
  const code = (params.code ?? "").toUpperCase();

  const { data: countries = [] } = useListCountries();
  const country = countries.find((c) => c.code === code);

  const [showPowerCard, setShowPowerCard] = useState(false);
  const [globalRank, setGlobalRank] = useState(0);

  const { data: rawResults = [], isLoading } = useCheckVisaAll(
    { passport: code },
    { query: { enabled: !!code, queryKey: getCheckVisaAllQueryKey({ passport: code }) } }
  );
  const results = rawResults as VisaResult[];

  const grouped = useMemo(() => {
    const map: Partial<Record<VisaRequirement, VisaResult[]>> = {};
    results.forEach((r) => {
      if (!map[r.requirement]) map[r.requirement] = [];
      map[r.requirement]!.push(r);
    });
    reqOrder.forEach((req) => {
      if (map[req]) map[req]!.sort((a, b) => a.destinationCountry.name.localeCompare(b.destinationCountry.name));
    });
    return map;
  }, [results]);

  const vfCount = grouped.visa_free?.length ?? 0;
  const voaCount = grouped.visa_on_arrival?.length ?? 0;
  const evCount = grouped.e_visa?.length ?? 0;
  const vrCount = grouped.visa_required?.length ?? 0;
  const naCount = grouped.no_admission?.length ?? 0;

  useEffect(() => {
    if (!code || results.length === 0) return;
    fetch("/api/visa/all-rankings")
      .then((r) => r.json())
      .then((d: { rankings: { code: string; score: number }[] }) => {
        const idx = d.rankings.findIndex((r) => r.code === code);
        if (idx !== -1) setGlobalRank(idx + 1);
      })
      .catch(() => {});
  }, [code, results.length]);

  useSEO({
    title: country
      ? `${country.name} Passport Visa Requirements — ${vfCount} Visa-Free Countries | Is Visa Required?`
      : `Passport Visa Requirements | Is Visa Required?`,
    description: country
      ? `Complete visa requirements for ${country.name} passport holders. Visa-free access to ${vfCount} countries, visa on arrival for ${voaCount}, eVisa for ${evCount}. Check all 199 destinations.`
      : "Check visa requirements for this passport across all 199 countries.",
    canonical: country ? `https://www.isvisarequired.com/visa-requirements/${slugify(country.name)}` : `https://www.isvisarequired.com/visa-requirements`,
    jsonLd: country && results.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": `${country.name} Passport Visa Requirements`,
      "description": `Visa requirements for ${country.name} passport holders across 199 countries`,
      "url": `https://www.isvisarequired.com/passport/${code}`,
      "keywords": `${country.name} passport, visa requirements, visa free countries ${country.name}`,
    } : undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref={`/passport/${code}`} />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {country ? (
          <>
            {/* Hero */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">{country.flag}</span>
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                    {country.name} Passport
                  </h1>
                  <p className="text-muted-foreground mt-1">Visa requirements for {country.name} passport holders</p>
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-3 mt-1">
                <a href={`/?passport=${code}`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline underline-offset-2">
                  Open interactive checker for {country.name} <ArrowRight className="h-3.5 w-3.5" />
                </a>
                {!isLoading && results.length > 0 && (
                  <button
                    onClick={() => setShowPowerCard(true)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border bg-card rounded-lg px-3 py-1.5 hover:bg-secondary/50 transition-colors">
                    <CreditCard className="h-3.5 w-3.5" />
                    Share Power Card
                  </button>
                )}
              </div>
            </div>

            {/* Stats row */}
            {!isLoading && results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
                {[
                  { req: "visa_free" as VisaRequirement, count: vfCount },
                  { req: "visa_on_arrival" as VisaRequirement, count: voaCount },
                  { req: "e_visa" as VisaRequirement, count: evCount },
                  { req: "visa_required" as VisaRequirement, count: vrCount },
                  { req: "no_admission" as VisaRequirement, count: naCount },
                ].map(({ req, count }) => {
                  const cfg = reqConfig[req];
                  const Icon = cfg.icon;
                  return (
                    <a key={req} href={`#${req}`}
                      className={`flex flex-col items-center p-4 rounded-2xl border text-center ${cfg.bg} ${cfg.border} hover:shadow-sm transition-shadow`}>
                      <Icon className={`h-5 w-5 ${cfg.color} mb-1`} />
                      <div className={`text-2xl font-bold ${cfg.color}`}>{count}</div>
                      <div className={`text-xs font-medium ${cfg.color} mt-0.5`}>{cfg.label}</div>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-16 text-muted-foreground">
                <span className="inline-block h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="mt-3 text-sm">Loading visa data…</p>
              </div>
            )}

            {/* Grouped sections */}
            {!isLoading && reqOrder.map((req) => {
              const group = grouped[req];
              if (!group || group.length === 0) return null;
              const cfg = reqConfig[req];
              const Icon = cfg.icon;
              return (
                <section key={req} id={req} className="mb-10 scroll-mt-20">
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-t-xl border-x border-t ${cfg.bg} ${cfg.border}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                    <h2 className={`font-bold text-base ${cfg.color}`}>{cfg.label}</h2>
                    <span className={`text-xs font-medium ml-1 ${cfg.color} opacity-70`}>({group.length} countries)</span>
                  </div>
                  <p className={`text-xs px-4 py-2 border-x ${cfg.bg} ${cfg.border} text-muted-foreground`}>{cfg.description}</p>
                  <div className={`border-x border-b rounded-b-xl ${cfg.border} overflow-hidden`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {group.map((r, i) => (
                        <a
                          key={r.destinationCountry.code}
                          href={`/?passport=${code}&destinations=${r.destinationCountry.code}`}
                          className={`flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 transition-colors border-b border-r ${cfg.border} ${
                            i >= group.length - (group.length % 3 === 0 ? 3 : group.length % 3) ? "border-b-0" : ""
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{r.destinationCountry.flag}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-foreground truncate">{r.destinationCountry.name}</div>
                            {r.maxStay && <div className="text-xs text-muted-foreground">{r.maxStay}</div>}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}

            {/* Share + compare */}
            {!isLoading && results.length > 0 && (
              <div className="space-y-4">
                <PassportShareBar code={code} name={country.name} vfCount={vfCount} />
                <div className="bg-muted/40 border border-border rounded-2xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Want to see how {country.name} compares to another passport?</p>
                  <a href={`/compare?a=${code}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Compare {country.name} vs another passport
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Globe className="h-14 w-14 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">{code ? `Unknown passport code: ${code}` : "No passport specified"}</p>
            <a href="/" className="text-sm text-primary mt-2 underline underline-offset-2 block">Back to visa checker</a>
          </div>
        )}
      </main>
      <Footer />
      {showPowerCard && country && (
        <PassportPowerCard
          flag={country.flag}
          country={country.name}
          code={code}
          rank={globalRank}
          total={countries.length}
          visaFree={vfCount}
          visaOnArrival={voaCount}
          eVisa={evCount}
          visaRequired={vrCount}
          noAdmission={naCount}
          onClose={() => setShowPowerCard(false)}
        />
      )}
    </div>
  );
}
