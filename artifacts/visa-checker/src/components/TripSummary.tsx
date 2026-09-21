// The answer's headline.
//
// One destination: the verdict itself is the largest text on screen — "eVisa
// needed", "No visa needed" — with its icon, a one-line action, and the stay
// limit only when the data actually has one. Until 2026-09 the largest text in
// the results state was the route the reader had just typed ("India → Japan",
// 28px serif) while the answer was a 13px pill further down.
//
// Several destinations: the route, then one chip per outcome with its count.
//
// Words, colours and icons come from lib/requirement → lib/travel-data, the
// same record the server-rendered pair pages use, so the two can't disagree.
import type { VisaResult } from "@workspace/api-client-react";
import { styleForResult, verdictKind, reqConfig, etaConfig, type VerdictKind } from "@/lib/requirement";

const KIND_ORDER: VerdictKind[] = ["visa_free", "visa_on_arrival", "eta", "e_visa", "visa_required", "no_admission"];
const styleForKind = (k: VerdictKind) => (k === "eta" ? etaConfig : reqConfig[k]);

export function TripSummary({ results, passportFlag, passportName }: {
  results: VisaResult[]; passportFlag: string; passportName: string;
}) {
  if (results.length === 1) {
    const r = results[0];
    const C = styleForResult(r.requirement, r.notes, r.maxStay);
    const Icon = C.icon;
    const stay = r.maxStay === "unlimited" ? "No stay limit" : r.maxStay ? `Stay up to ${r.maxStay}` : null;
    const kind = verdictKind(r.requirement, r.notes, r.maxStay);
    // The visa-free hint is about the stay; never print it beside a known stay.
    const showHint = kind !== "visa_free" || !stay;
    return (
      <div className="min-w-0" aria-live="polite">
        <p className="text-sm text-muted-foreground">
          <span aria-hidden="true">{passportFlag}</span> {passportName} passport <span aria-hidden="true">→</span>{" "}
          <span aria-hidden="true">{r.destinationCountry.flag}</span> {r.destinationCountry.name}
        </p>
        <h2 className={`mt-2 flex items-center gap-3 text-verdict font-bold tracking-[-0.02em] ${C.color}`}>
          <span className={`grid h-12 w-12 flex-none place-items-center rounded-xl border ${C.bg} ${C.border}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="min-w-0">{C.verdictWord}</span>
        </h2>
        {showHint && <p className="mt-2.5 text-base sm:text-lg text-foreground">{C.hint}</p>}
        {stay && (
          <p className="mt-3">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold tabular-nums ${C.color} ${C.bg} ${C.border}`}>
              {stay}
            </span>
          </p>
        )}
      </div>
    );
  }

  const kinds = results.map((r) => ({ r, k: verdictKind(r.requirement, r.notes, r.maxStay) }));
  const counts = KIND_ORDER
    .map((k) => ({ k, n: kinds.filter((x) => x.k === k).length }))
    .filter((c) => c.n > 0);
  // The to-do list: everything that needs an application before departure.
  const applyAhead = kinds
    .filter((x) => x.k === "eta" || x.k === "e_visa" || x.k === "visa_required")
    .map((x) => x.r.destinationCountry.name);

  return (
    <div className="min-w-0" aria-live="polite">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Your results</p>
      <h2 className="mt-1 text-2xl sm:text-[1.75rem] font-semibold leading-tight tracking-[-0.015em] text-foreground">
        <span aria-hidden="true">{passportFlag}</span> {passportName} → {results.length} destinations
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {counts.map(({ k, n }) => {
          const C = styleForKind(k); const I = C.icon;
          return (
            <li key={k} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${C.color} ${C.bg} ${C.border}`}>
              <I className="h-4 w-4" aria-hidden="true" />
              <span className="tabular-nums">{n}</span> {C.label.toLowerCase()}
            </li>
          );
        })}
      </ul>
      {applyAhead.length > 0 && (
        <p className="mt-2.5 text-sm text-foreground">
          <span className="font-semibold">Apply before you fly:</span> {applyAhead.join(", ")}
        </p>
      )}
    </div>
  );
}
