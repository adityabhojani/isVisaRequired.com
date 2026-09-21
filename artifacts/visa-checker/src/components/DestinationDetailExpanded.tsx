import { useState } from "react";
import type React from "react";
import { CheckCircle2, AlertCircle, ChevronDown, ExternalLink } from "lucide-react";
import { useGetDestinationInfo, getGetDestinationInfoQueryKey } from "@workspace/api-client-react";
import type { VisaRequirement } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { reqConfig, verdictKind } from "@/lib/requirement";
import { isKnownFact, unknownFactsSentence, needsApplication } from "@workspace/travel-data";
import { AttractionCard } from "./AttractionCard";

const QUICK_FACTS = [
  { key: "capital", label: "Capital" },
  { key: "currency", label: "Currency" },
  { key: "language", label: "Language" },
  { key: "bestTimeToVisit", label: "Best time" },
] as const;

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";
const LINK = "text-primary underline underline-offset-2 hover:text-[hsl(222_89%_25%)]";
// The no-entry panel wears the shared no_admission record: word, icon, ink on tint, solid rail.
const NO_ENTRY = reqConfig.no_admission;

interface DestinationDetailExpandedProps {
  passport: string;
  destinationCode: string;
  destinationName: string;
  requirement: VisaRequirement;
  maxStay?: string | null;
  /** Lets the panel tell a UK ETA or US ESTA from an eVisa. */
  notes?: string | null;
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
  notes,
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
  const kind = verdictKind(requirement, notes, maxStay);
  const facts: { label: string; value: React.ReactNode }[] = [];
  const unknown: string[] = [];
  if (visaDetail) {
    if (visaDetail.feeUSD === 0) facts.push({ label: "Fee", value: <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />Free</span> });
    else if (visaDetail.feeUSD != null) facts.push({ label: "Fee", value: <>${visaDetail.feeUSD} <span className="font-normal text-muted-foreground">USD, approx.</span></> });
    else unknown.push("fee");
    const stay = maxStay ?? visaDetail.maxStay;
    if (isKnownFact(stay)) facts.push({ label: "Stay", value: stay });
    else if (kind !== "visa_free") unknown.push("permitted stay");
    if (needsApplication(kind)) {
      if (isKnownFact(visaDetail.processingDays)) facts.push({ label: "Processing", value: visaDetail.processingDays });
      else unknown.push("processing time");
    }
  }
  const unknownNote = requirement === "no_admission" ? "" : unknownFactsSentence(unknown, kind);
  const needsAction = requirement === "e_visa" || requirement === "visa_on_arrival" || requirement === "visa_required";
  // Never "Apply on…": only some of these links are application forms (Japan's,
  // for one, is a ministry information page), and a UK ETA or US ESTA isn't an
  // eVisa at all. Say what the link is, and show where it goes.
  const portalHost = (() => { try { return new URL(info?.officialLinks?.visaPortal ?? "").hostname.replace(/^www\./, ""); } catch { return ""; } })();
  const portalLabel = requirement === "visa_on_arrival" ? "Official entry requirements" : "Official visa information";

  return (
    <div className="space-y-5">
      {touristInfo?.tagline && <p className="text-sm text-muted-foreground leading-relaxed max-w-[60ch]">{touristInfo?.tagline}</p>}
      {info?.officialLinks && needsAction && (
        <Button asChild className="h-11 w-full sm:w-auto rounded-xl px-5 text-sm font-semibold shadow-none">
          <a href={info.officialLinks.visaPortal} target="_blank" rel="noopener noreferrer" title={info.officialLinks.visaPortal}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />{portalLabel}{portalHost && <span className="font-normal opacity-80">· {portalHost}</span>}<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      )}

      {visaDetail && requirement !== "no_admission" && (
        <div className="space-y-4">
          <h3 className={EYEBROW}>{requirement === "visa_free" ? "What to carry" : "What you need"}</h3>

          {/* Only facts the data actually holds get fact weight. Per-visa-type
              placeholders ("Varies — check approval letter") used to fill this
              grid in bold; they are now named once, quietly, below it. Same
              rule as the server-rendered pair pages (lib/travel-data). */}
          {facts.length > 0 && (
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 rounded-xl bg-secondary/50 px-4 py-3.5">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className={EYEBROW}>{f.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-foreground tabular-nums leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {unknownNote && <p className="text-sm text-muted-foreground">{unknownNote}</p>}

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
            <p className="flex items-start gap-2 border-l-2 border-muted-foreground/40 pl-3 text-sm text-foreground">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" /><span>{visaDetail.notes}</span>
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
        <div className={`rounded-xl border-l-2 ${NO_ENTRY.bg} px-4 py-3.5`} style={{ borderLeftColor: NO_ENTRY.solid }}>
          <h4 className={`inline-flex items-center gap-2 text-sm font-semibold ${NO_ENTRY.color}`}><NO_ENTRY.icon className="h-4 w-4" aria-hidden="true" />{NO_ENTRY.label}</h4>
          {visaDetail.notes && <p className={`mt-1.5 text-sm leading-relaxed ${NO_ENTRY.color}`}>{visaDetail.notes}</p>}
          {visaDetail.process.length > 0 && (
            <ul className={`mt-2 space-y-1 text-sm ${NO_ENTRY.color}`}>
              {visaDetail.process.map((step, i) => <li key={i} className="flex gap-2.5"><span aria-hidden="true" className={`mt-[9px] h-1 w-1 shrink-0 rounded-full ${NO_ENTRY.dot}`} />{step}</li>)}
            </ul>
          )}
          {info?.officialLinks && (
            <a href={info.officialLinks.embassyFinder} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-2 ${NO_ENTRY.color}`}>
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
