import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import {
  Laptop, Search, ChevronDown, ChevronUp, ExternalLink,
  DollarSign, Clock, RefreshCw, CheckCircle2, XCircle,
  Briefcase, ShieldCheck, Globe,
} from "lucide-react";
import { digitalNomadVisas, NOMAD_REGIONS } from "@/data/digitalNomadVisas";
import type { DigitalNomadVisa } from "@/data/digitalNomadVisas";

const ALL_REGIONS = NOMAD_REGIONS;

function VisaCard({ visa }: { visa: DigitalNomadVisa }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-2xl border border-border/70 shadow-sm overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-center gap-4"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-3xl flex-shrink-0 leading-none">{visa.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground">{visa.country}</p>
            <span className="text-xs bg-secondary/60 text-muted-foreground px-2 py-0.5 rounded-full">
              {visa.region}
            </span>
          </div>
          <p className="text-sm text-primary font-medium mt-0.5">{visa.visaName}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {visa.minMonthlyIncome && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                {visa.minMonthlyIncome}/mo
              </span>
            )}
            {!visa.minMonthlyIncome && visa.minAnnualIncome && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                {visa.minAnnualIncome}/yr
              </span>
            )}
            {!visa.minMonthlyIncome && !visa.minAnnualIncome && (
              <span className="flex items-center gap-1 text-xs text-green-700">
                <CheckCircle2 className="h-3 w-3" />
                No income req.
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {visa.duration}
            </span>
            {visa.govFee && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                {visa.govFee} fee
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {visa.taxBenefits && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Tax benefit
            </span>
          )}
          {visa.renewable && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              <RefreshCw className="h-3 w-3" />
              Renewable
            </span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border/60 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Min. Income</p>
              <p className="text-sm font-semibold text-foreground">
                {visa.minMonthlyIncome
                  ? `${visa.minMonthlyIncome}/mo`
                  : visa.minAnnualIncome
                    ? `${visa.minAnnualIncome}/yr`
                    : "None required"}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Gov. Fee</p>
              <p className="text-sm font-semibold text-foreground">{visa.govFee ?? "Varies"}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Duration</p>
              <p className="text-sm font-semibold text-foreground">{visa.duration}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Renewable</p>
              <p className={`text-sm font-semibold ${visa.renewable ? "text-green-700" : "text-muted-foreground"}`}>
                {visa.renewable ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {visa.taxBenefits && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Tax Benefits
              </span>
            )}
            {visa.businessRequired && (
              <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                <Briefcase className="h-3 w-3" />
                Business / Employer Proof
              </span>
            )}
            {visa.insuranceRequired && (
              <span className="flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                <ShieldCheck className="h-3 w-3" />
                Insurance Required
              </span>
            )}
            {!visa.taxBenefits && !visa.businessRequired && !visa.insuranceRequired && (
              <span className="text-xs text-muted-foreground">No special requirements</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{visa.notes}</p>

          <a
            href={visa.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Official application page
          </a>
        </div>
      )}
    </div>
  );
}

export default function DigitalNomadPage() {
  useSEO({
    title: "Digital Nomad Visa Directory 2025 — Work Remotely Abroad",
    description:
      "Complete directory of digital nomad visas for 2025. Compare income requirements, fees, duration, and tax benefits for 40+ countries worldwide.",
  });

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [taxOnly, setTaxOnly] = useState(false);
  const [renewableOnly, setRenewableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"country" | "income" | "fee" | "duration">("country");

  const filtered = useMemo(() => {
    let list = digitalNomadVisas.filter((v) => {
      if (region !== "All" && v.region !== region) return false;
      if (taxOnly && !v.taxBenefits) return false;
      if (renewableOnly && !v.renewable) return false;
      if (search) {
        const q = search.toLowerCase();
        return v.country.toLowerCase().includes(q) || v.visaName.toLowerCase().includes(q);
      }
      return true;
    });
    if (sortBy === "country") list = list.sort((a, b) => a.country.localeCompare(b.country));
    return list;
  }, [search, region, taxOnly, renewableOnly, sortBy]);

  const byRegion = useMemo(() => {
    const map: Record<string, number> = {};
    digitalNomadVisas.forEach((v) => { map[v.region] = (map[v.region] ?? 0) + 1; });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/digital-nomad" />

      {/* Hero */}
      <div className="bg-gradient-to-b from-violet-50/80 via-primary/4 to-transparent border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-3.5 py-1 text-xs font-semibold mb-4 border border-violet-200">
            <Laptop className="h-3 w-3" />
            {digitalNomadVisas.length} programs · 2026 edition
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Digital Nomad Visa Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Compare every country offering remote work visas — income requirements, fees, duration, and tax benefits side by side.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {[
            { label: "Total Programs", value: digitalNomadVisas.length.toString(), icon: Globe, color: "text-primary" },
            { label: "With Tax Benefits", value: digitalNomadVisas.filter(v => v.taxBenefits).length.toString(), icon: CheckCircle2, color: "text-emerald-600" },
            { label: "Free to Apply", value: digitalNomadVisas.filter(v => v.govFee === "Free").length.toString(), icon: DollarSign, color: "text-amber-600" },
            { label: "10+ Year Programs", value: digitalNomadVisas.filter(v => v.duration.includes("10")).length.toString(), icon: Clock, color: "text-blue-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card rounded-2xl border border-border/70 p-4 shadow-sm text-center">
              <Icon className={`h-5 w-5 mx-auto mb-1.5 ${color}`} />
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <AdSlot slotId="2847392015" size="responsive" className="mb-7" />

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border/70 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries or visa names…"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTaxOnly((o) => !o)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  taxOnly
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-secondary/50 text-foreground border-border hover:bg-secondary"
                }`}
              >
                Tax Benefits Only
              </button>
              <button
                onClick={() => setRenewableOnly((o) => !o)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  renewableOnly
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-secondary/50 text-foreground border-border hover:bg-secondary"
                }`}
              >
                Renewable Only
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  region === r
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-transparent hover:border-border"
                }`}
              >
                {r}
                {r !== "All" && byRegion[r] && (
                  <span className="ml-1 opacity-70">({byRegion[r]})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> programs
          </p>
        </div>

        <div className="space-y-3">
          {filtered.map((visa) => (
            <VisaCard key={`${visa.code}-${visa.visaName}`} visa={visa} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <XCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No programs match your filters.</p>
              <button onClick={() => { setSearch(""); setRegion("All"); setTaxOnly(false); setRenewableOnly(false); }}
                className="mt-3 text-sm text-primary hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> Visa policies change frequently. Income requirements, fees, and durations listed are approximate and for informational purposes only. Always verify current requirements on the official government immigration website before applying.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
