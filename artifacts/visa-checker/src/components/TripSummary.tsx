// The receipt: three lines that read as the answer's headline, not a ledger.
// This is the one Playfair line in the results state.
import { XCircle } from "lucide-react";
import type { VisaResult } from "@workspace/api-client-react";
import { reqConfig, requirementOrder } from "@/lib/requirement";

export function TripSummary({ results, passportFlag, passportName }: {
  results: VisaResult[]; passportFlag: string; passportName: string;
}) {
  const counts = requirementOrder
    .map((req) => ({ req, n: results.filter((r) => r.requirement === req).length }))
    .filter((c) => c.n > 0);
  const applyAhead = results
    .filter((r) => r.requirement === "e_visa" || r.requirement === "visa_required")
    .map((r) => r.destinationCountry.name);
  const blocked = results.filter((r) => r.requirement === "no_admission").map((r) => r.destinationCountry.name);

  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your results</p>
      <h2 className="font-serif text-2xl sm:text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-foreground mt-1">
        <span aria-hidden="true">{passportFlag}</span> {passportName} → {results.length === 1 ? results[0].destinationCountry.name : `${results.length} destinations`}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {counts.map(({ req, n }) => {
          const C = reqConfig[req]; const I = C.icon;
          return (
            <span key={req} className={`inline-flex items-center gap-1 font-medium ${C.color}`}>
              <I className="h-3.5 w-3.5" aria-hidden="true" />{n} {C.label.toLowerCase()}
            </span>
          );
        })}
        {applyAhead.length > 0 && <span className="text-foreground">Apply before you fly: {applyAhead.join(", ")}</span>}
        {blocked.length > 0 && (
          <span className="inline-flex items-center gap-1 font-medium text-red-700">
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />Not permitted: {blocked.join(", ")}
          </span>
        )}
      </p>
    </div>
  );
}
