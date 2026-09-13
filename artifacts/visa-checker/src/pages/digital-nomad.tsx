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

const OPEN_VISAS = digitalNomadVisas.filter((v) => v.status !== "ended");
const ENDED_VISAS = digitalNomadVisas.filter((v) => v.status === "ended");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-13" -> "13 Sep 2026". Parsed by hand so the label never shifts with the reader's timezone. */
function formatVerified(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function SourceLine({ visa }: { visa: DigitalNomadVisa }) {
  if (!visa.source || !visa.verifiedOn) {
    return (
      <span className="text-xs text-muted-foreground">
        Not yet re-checked against an official source
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground">
      Checked against the{" "}
      <a href={visa.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
        official source
      </a>{" "}
      on {formatVerified(visa.verifiedOn)}
    </span>
  );
}

function ClosedCard({ visa }: { visa: DigitalNomadVisa }) {
  return (
    <div className="bg-card rounded-2xl border border-border/70 shadow-sm p-4 flex items-start gap-4">
      <span className="text-3xl flex-shrink-0 leading-none grayscale opacity-60">{visa.flag}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground">{visa.country}</p>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            Closed
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{visa.visaName}</p>
        {visa.endedNote && (
          <p className="text-sm text-foreground mt-1.5 leading-relaxed">{visa.endedNote}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{visa.notes}</p>
        <div className="mt-2">
          <SourceLine visa={visa} />
        </div>
      </div>
    </div>
  );
}

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
            {visa.verifiedOn && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-800 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Verified {formatVerified(visa.verifiedOn)}
              </span>
            )}
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
            <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-foreground bg-secondary border border-border px-2 py-0.5 rounded-full">
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
              <span className="flex items-center gap-1 text-xs font-medium text-foreground bg-secondary border border-border px-2.5 py-1 rounded-full">
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <a
              href={visa.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Official application page
            </a>
            <SourceLine visa={visa} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DigitalNomadPage() {
  useSEO({
    title: "Digital Nomad Visa Directory — Checked Against Official Sources",
    description:
      `Every digital nomad visa we track — ${OPEN_VISAS.length} open programmes plus ${ENDED_VISAS.length} that have closed. Income requirements, fees and duration, each checked against the government's own page.`,
  });

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [taxOnly, setTaxOnly] = useState(false);
  const [renewableOnly, setRenewableOnly] = useState(false);

  const filtered = useMemo(() => {
    const list = OPEN_VISAS.filter((v) => {
      if (region !== "All" && v.region !== region) return false;
      if (taxOnly && !v.taxBenefits) return false;
      if (renewableOnly && !v.renewable) return false;
      if (search) {
        const q = search.toLowerCase();
        return v.country.toLowerCase().includes(q) || v.visaName.toLowerCase().includes(q);
      }
      return true;
    });
    return list.sort((a, b) => a.country.localeCompare(b.country));
  }, [search, region, taxOnly, renewableOnly]);

  const byRegion = useMemo(() => {
    const map: Record<string, number> = {};
    OPEN_VISAS.forEach((v) => { map[v.region] = (map[v.region] ?? 0) + 1; });
    return map;
  }, []);

  const verifiedCount = OPEN_VISAS.filter((v) => v.verifiedOn).length;

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/digital-nomad" />

      {/* Hero */}
      <div className="bg-secondary/40 border-b border-border/70">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3.5 py-1 text-xs font-semibold mb-4 border border-primary/20">
            <Laptop className="h-3 w-3" />
            {OPEN_VISAS.length} open programmes · {verifiedCount} checked against source
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Digital Nomad Visa Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Income requirements, fees, duration and tax rules side by side — each figure read off the government's own page, with the date we checked it.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {[
            { label: "Open Programmes", value: OPEN_VISAS.length.toString(), icon: Globe, color: "text-primary" },
            { label: "Checked at Source", value: verifiedCount.toString(), icon: CheckCircle2, color: "text-primary" },
            { label: "With Tax Benefits", value: OPEN_VISAS.filter(v => v.taxBenefits).length.toString(), icon: DollarSign, color: "text-primary" },
            { label: "Closed Since 2025", value: ENDED_VISAS.length.toString(), icon: Clock, color: "text-primary" },
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
                    ? "bg-primary text-primary-foreground border-primary"
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
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {OPEN_VISAS.length} open programmes
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

        {ENDED_VISAS.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-1.5">
              Programmes that have closed
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
              These {ENDED_VISAS.length} nomad visas are still widely listed as available elsewhere. They are not.
              They stay here so you can see what replaced them, rather than applying for something that no longer exists.
            </p>
            <div className="space-y-3">
              {ENDED_VISAS.map((visa) => (
                <ClosedCard key={`${visa.code}-${visa.visaName}`} visa={visa} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 bg-card rounded-2xl border border-border/70 shadow-sm p-5">
          <h2 className="font-semibold text-foreground mb-1.5">What the check turned up</h2>
          <ul className="text-sm text-muted-foreground space-y-1.5 leading-relaxed">
            <li>
              <a href="/blog/what-we-found-checking-every-digital-nomad-visa" className="text-primary hover:underline">
                What we found checking every digital nomad visa against its own government's page
              </a>{" "}
              — 218 values changed; Japan's income requirement was out by a factor of ten.
            </li>
            <li>
              <a href="/blog/digital-nomad-visas-that-have-closed" className="text-primary hover:underline">
                Five digital nomad visas that no longer exist
              </a>{" "}
              — and what replaced them.
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>How to read this:</strong> a programme marked “Verified” had every figure above read off the linked
            government page on that date. Where a government states only a monthly or only an annual threshold we show
            that one and leave the other blank, rather than multiplying it out and presenting the result as official.
            Thresholds tied to a minimum wage or GNI move each year. Governments change these rules without notice, so
            confirm on the official site before you apply.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
