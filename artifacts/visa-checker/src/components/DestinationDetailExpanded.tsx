import { useState } from "react";
import {
  CheckCircle2, AlertCircle, Clock, XCircle, Shield,
  FileText, ListOrdered, Globe, Calendar, DollarSign,
  Landmark, ChevronDown, ChevronUp, ExternalLink, MapPin,
} from "lucide-react";
import { useGetDestinationInfo, getGetDestinationInfoQueryKey } from "@workspace/api-client-react";
import type { VisaRequirement } from "@workspace/api-client-react";
import { AttractionCard } from "./AttractionCard";

const reqConfig: Record<VisaRequirement, {
  label: string; color: string; bg: string; border: string;
  gradientFrom: string; gradientTo: string; icon: typeof CheckCircle2;
}> = {
  visa_free:       { label: "Visa Free",       color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200",  gradientFrom: "from-green-50",  gradientTo: "to-emerald-50/50", icon: CheckCircle2 },
  visa_on_arrival: { label: "Visa on Arrival",  color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  gradientFrom: "from-amber-50",  gradientTo: "to-yellow-50/50",  icon: Clock },
  e_visa:          { label: "eVisa Required",   color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   gradientFrom: "from-blue-50",   gradientTo: "to-sky-50/50",     icon: Shield },
  visa_required:   { label: "Visa Required",    color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-200", gradientFrom: "from-orange-50", gradientTo: "to-amber-50/50",   icon: AlertCircle },
  no_admission:    { label: "No Admission",     color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200",    gradientFrom: "from-red-50",    gradientTo: "to-rose-50/50",    icon: XCircle },
};

const quickFactConfig = [
  { key: "capital",         icon: Landmark,    label: "Capital",    iconBg: "bg-blue-100",    iconColor: "text-blue-600" },
  { key: "currency",        icon: DollarSign,  label: "Currency",   iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { key: "language",        icon: Globe,       label: "Language",   iconBg: "bg-violet-100",  iconColor: "text-violet-600" },
  { key: "bestTimeToVisit", icon: Calendar,    label: "Best Time",  iconBg: "bg-amber-100",   iconColor: "text-amber-600" },
] as const;

interface DestinationDetailExpandedProps {
  passport: string;
  destinationCode: string;
  destinationName: string;
  destinationFlag: string;
  requirement: VisaRequirement;
  maxStay?: string | null;
}

export function DestinationDetailExpanded({
  passport,
  destinationCode,
  destinationName,
  destinationFlag,
  requirement,
  maxStay,
}: DestinationDetailExpandedProps) {
  const [showAttractions, setShowAttractions] = useState(true);
  const config = reqConfig[requirement];
  const Icon = config.icon;

  const { data: info, isLoading } = useGetDestinationInfo(
    { passport, destination: destinationCode },
    {
      query: {
        queryKey: getGetDestinationInfoQueryKey({ passport, destination: destinationCode }),
        enabled: true,
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2.5" />
        <span className="text-sm text-muted-foreground">Loading destination details…</span>
      </div>
    );
  }

  const { visaDetail, touristInfo } = info ?? {};

  return (
    <div className="space-y-6">
      {/* Header — gradient tinted by requirement */}
      <div className={`rounded-2xl p-5 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} border ${config.border}`}>
        <div className="flex items-start gap-4">
          <span className="text-5xl leading-none">{destinationFlag}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-2xl font-bold text-foreground leading-tight">{destinationName}</h2>
            {touristInfo && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{touristInfo.tagline}</p>
            )}
            <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-sm font-semibold ${config.color} bg-white/80 border ${config.border} shadow-sm`}>
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {config.label}
              {maxStay && <span className="font-normal opacity-75">— up to {maxStay}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Official Government Links */}
      {info?.officialLinks && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Official Government Links</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={info.officialLinks.visaPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-primary text-primary-foreground rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-md"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <div>Official Visa Portal</div>
                <div className="text-xs font-normal opacity-70 truncate">{info.officialLinks.visaPortal.replace(/^https?:\/\//, "")}</div>
              </div>
            </a>
            <a
              href={info.officialLinks.embassyFinder}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border-2 border-primary/20 rounded-xl px-4 py-3 font-semibold text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Globe className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <div>Find Nearest Embassy</div>
                <div className="text-xs font-normal text-muted-foreground truncate">{info.officialLinks.embassyFinder.replace(/^https?:\/\//, "")}</div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Country Quick Facts */}
      {touristInfo && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickFactConfig.map(({ key, icon: FactIcon, label, iconBg, iconColor }) => {
            const value = touristInfo[key as keyof typeof touristInfo] as string | undefined;
            if (!value) return null;
            return (
              <div key={label} className="bg-card rounded-xl p-3.5 border border-border hover:border-primary/30 transition-colors">
                <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>
                  <FactIcon className={`h-3.5 w-3.5 ${iconColor}`} />
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="text-sm font-semibold text-foreground mt-0.5 leading-tight">{value}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Visa Details */}
      {visaDetail && requirement !== "no_admission" && (
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            {requirement === "visa_free" ? "Entry Requirements" : "Visa Requirements & Process"}
          </h3>

          {/* Cost + Processing row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Visa Fee</div>
              <div className="text-2xl font-bold text-foreground">
                {visaDetail.feeUSD === 0
                  ? <span className="text-green-600">Free</span>
                  : visaDetail.feeUSD != null
                    ? `$${visaDetail.feeUSD}`
                    : <span className="text-base font-semibold text-muted-foreground">Check official site</span>
                }
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {visaDetail.feeUSD != null && visaDetail.feeUSD > 0
                  ? "Per person, USD approx."
                  : "Verify before travel"}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Processing</div>
              <div className="text-sm font-bold text-foreground mt-1">{visaDetail.processingDays}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Max Stay</div>
              <div className="text-sm font-bold text-foreground mt-1">{visaDetail.maxStay}</div>
            </div>
          </div>

          {/* Documents */}
          {visaDetail.documents.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground text-sm mb-1.5 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                {requirement === "visa_free" ? "Typical Entry Documents" : "Typical Documents Required"}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">Requirements vary by destination — verify with the official embassy or border authority.</p>
              <ul className="space-y-2">
                {visaDetail.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    </div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Process Steps */}
          {visaDetail.process.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-primary" />
                {requirement === "visa_free" ? "Typical Border Entry Steps" : "Typical Application Process"}
              </h4>
              <ol className="space-y-3">
                {visaDetail.process.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                      {i + 1}
                    </div>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {visaDetail.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-sm text-amber-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{visaDetail.notes}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Fees and requirements are indicative and subject to change. Always verify with the official embassy or consulate before travelling.
          </p>
        </div>
      )}

      {/* No Admission Notice */}
      {requirement === "no_admission" && visaDetail && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <h4 className="font-semibold text-red-800 text-base">Travel Not Permitted</h4>
          </div>
          {visaDetail.notes && <p className="text-sm text-red-700 mb-3 leading-relaxed">{visaDetail.notes}</p>}
          <ul className="space-y-1.5 mb-4">
            {visaDetail.process.map((step, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start gap-1.5">
                <span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                {step}
              </li>
            ))}
          </ul>
          {info?.officialLinks && (
            <a
              href={info.officialLinks.embassyFinder}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 underline underline-offset-2 hover:text-red-900 transition-colors"
            >
              <Globe className="h-4 w-4" />
              Check {destinationName} Ministry of Foreign Affairs
            </a>
          )}
        </div>
      )}

      {/* Tourist Attractions */}
      {touristInfo && touristInfo.attractions.length > 0 && (
        <div>
          <button
            onClick={() => setShowAttractions((v) => !v)}
            className="flex items-center gap-2 w-full text-left mb-4 group"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground flex-1">
              Top Things to Do in {destinationName}
            </h3>
            <span className="text-xs text-muted-foreground mr-1">{touristInfo.attractions.length} attractions</span>
            {showAttractions
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {showAttractions && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {touristInfo.attractions.map((a) => (
                <AttractionCard key={a.name} attraction={a} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
