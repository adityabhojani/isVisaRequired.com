import { useState } from "react";
import { CheckCircle2, AlertCircle, XCircle, ChevronDown, ExternalLink } from "lucide-react";
import { useGetDestinationInfo, getGetDestinationInfoQueryKey } from "@workspace/api-client-react";
import type { VisaRequirement } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { AttractionCard } from "./AttractionCard";

const QUICK_FACTS = [
  { key: "capital", label: "Capital" },
  { key: "currency", label: "Currency" },
  { key: "language", label: "Language" },
  { key: "bestTimeToVisit", label: "Best time" },
] as const;

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";
const LINK = "text-primary underline underline-offset-2 hover:text-[hsl(222_89%_25%)]";

interface DestinationDetailExpandedProps {
  passport: string;
  destinationCode: string;
  destinationName: string;
  requirement: VisaRequirement;
  maxStay?: string | null;
}

// The detail lives IN the verdict row's recessed well - never a second
// elevated object. Flag, name, verdict and stay are already in the row above,
// so nothing here repeats them.
export function DestinationDetailExpanded({
  passport,
  destinationCode,
  destinationName,
  requirement,
  maxStay,
}: DestinationDetailExpandedProps) {
  // Collapsed by default: opening fires ~10 image requests the visa answer never needed.
  const [showAttractions, setShowAttractions] = useState(false);
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
      <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading destination details">
        <div className="h-4 w-2/3 rounded bg-secondary" />
        <div className="h-11 w-full sm:w-64 rounded-xl bg-secondary/70" />
        <div className="h-24 rounded-xl bg-secondary/60" />
        <div className="space-y-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-3.5 rounded bg-secondary" style={{ width: `${88 - i * 9}%` }} />)}</div>
      </div>
    );
  }

  const { visaDetail, touristInfo } = info ?? {};
  const needsAction = requirement === "e_visa" || requirement === "visa_on_arrival" || requirement === "visa_required";
  const portalLabel = ({ e_visa: "Apply on the official eVisa portal", visa_on_arrival: "Official entry requirements", visa_required: "Official visa portal" } as Partial<Record<VisaRequirement, string>>)[requirement];
  const stayValue = maxStay ?? visaDetail?.maxStay;

  return (
    <div className="space-y-5">
      {touristInfo?.tagline && <p className="text-sm text-muted-foreground leading-relaxed max-w-[60ch]">{touristInfo?.tagline}</p>}
      {info?.officialLinks && needsAction && (
        <Button asChild className="h-11 w-full sm:w-auto rounded-xl px-5 text-sm font-semibold shadow-none">
          <a href={info.officialLinks.visaPortal} target="_blank" rel="noopener noreferrer" title={info.officialLinks.visaPortal}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />{portalLabel}<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      )}

      {visaDetail && requirement !== "no_admission" && (
        <div className="space-y-4">
          <h3 className={EYEBROW}>{requirement === "visa_free" ? "What to carry" : "What you need"}</h3>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 rounded-xl bg-secondary/50 px-4 py-3.5">
            <div>
              <dt className={EYEBROW}>Fee</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
                {visaDetail.feeUSD === 0
                  ? <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />Free</span>
                  : visaDetail.feeUSD != null
                    ? <>${visaDetail.feeUSD} <span className="font-normal text-muted-foreground">USD, approx.</span></>
                    : <span className="font-medium text-muted-foreground">Varies</span>}
              </dd>
            </div>
            <div>
              <dt className={EYEBROW}>Stay</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">{stayValue}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className={EYEBROW}>Processing</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground leading-snug">{visaDetail.processingDays}</dd>
            </div>
          </dl>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {visaDetail.documents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Documents</h4>
                <ul className="space-y-1.5 text-sm text-foreground">
                  {visaDetail.documents.map((doc, i) => (
                    <li key={i} className="flex gap-2.5"><span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" />{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            {requirement !== "visa_free" && visaDetail.process.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">{requirement === "visa_on_arrival" ? "On arrival" : "How to apply"}</h4>
                <ol className="space-y-2 text-sm text-foreground">
                  {visaDetail.process.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-4 shrink-0 pt-px text-[11px] font-semibold tabular-nums text-muted-foreground">{i + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {visaDetail.notes && (
            <p className="flex items-start gap-2 border-l-2 border-amber-400 pl-3 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" /><span>{visaDetail.notes}</span>
            </p>
          )}

          {info?.officialLinks && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fees and requirements are indicative and change. Verify with{" "}
              <a href={info.officialLinks.embassyFinder} target="_blank" rel="noopener noreferrer" className={LINK}>{destinationName}'s embassies and consulates</a>
              {!needsAction && <> or the <a href={info.officialLinks.visaPortal} target="_blank" rel="noopener noreferrer" className={LINK}>official entry rules</a></>}.
            </p>
          )}
        </div>
      )}

      {requirement === "no_admission" && visaDetail && (
        <div className="rounded-xl border-l-2 border-red-500 bg-red-50/60 px-4 py-3.5">
          <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-red-800"><XCircle className="h-4 w-4" aria-hidden="true" />Entry not permitted</h4>
          {visaDetail.notes && <p className="mt-1.5 text-sm text-red-800/90 leading-relaxed">{visaDetail.notes}</p>}
          {visaDetail.process.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-red-800/90">
              {visaDetail.process.map((step, i) => <li key={i} className="flex gap-2.5"><span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-red-400" />{step}</li>)}
            </ul>
          )}
          {info?.officialLinks && (
            <a href={info.officialLinks.embassyFinder} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-800 underline underline-offset-2">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />Check {destinationName}'s foreign ministry
            </a>
          )}
        </div>
      )}

      {touristInfo && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 border-t border-border/70 pt-5">
          {QUICK_FACTS.map(({ key, label }) => {
            const value = touristInfo[key as keyof typeof touristInfo] as string | undefined;
            if (!value) return null;
            return (
              <div key={key}>
                <dt className={EYEBROW}>{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground leading-snug">{value}</dd>
              </div>
            );
          })}
        </dl>
      )}

      {touristInfo && touristInfo.attractions.length > 0 && (
        <div>
          <button type="button" onClick={() => setShowAttractions((v) => !v)} aria-expanded={showAttractions}
            className="flex w-full min-h-11 items-center justify-between rounded-xl border border-border/70 bg-secondary/40 px-4 text-left text-sm font-medium text-foreground hover:bg-secondary/70 active:bg-secondary transition-colors">
            <span>Things to do in {destinationName}</span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="tabular-nums">{touristInfo.attractions.length} places</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAttractions ? "rotate-180" : ""}`} aria-hidden="true" />
            </span>
          </button>
          {showAttractions && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {touristInfo.attractions.map((a) => <AttractionCard key={a.name} attraction={a} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
