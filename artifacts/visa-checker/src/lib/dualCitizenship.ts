// Combining the passports a dual (or triple) citizen holds. Pure, so the page
// stays presentational and this can be tested against real API data.
import type { Country, VisaResult, VisaRequirement } from "@workspace/api-client-react";
import { requirementOrder } from "@/lib/requirement";

// Reachable without applying at an embassy — the same definition as the
// mobility score in the Passport Power Report.
export const NO_EMBASSY: VisaRequirement[] = ["visa_free", "visa_on_arrival", "e_visa"];

export interface PassportOption { code: string; requirement: VisaRequirement }
export interface CombinedDestination {
  country: Country;
  options: PassportOption[];
  best: VisaRequirement;
  bestCodes: string[];
}
export interface CombinedAccess {
  rows: CombinedDestination[];
  single: { code: string; count: number }[];
  combined: number;
  gain: number;
  breakdown: Record<VisaRequirement, number>;
  groups: [string, CombinedDestination[]][];
  decisiveCount: number;
  stillNeedVisa: CombinedDestination[];
  noEntry: CombinedDestination[];
}

const severity = (r: VisaRequirement) => requirementOrder.indexOf(r);
export const reachable = (r: VisaRequirement) => NO_EMBASSY.includes(r);

/**
 * Combine the check-all results of every passport held. Countries the traveller
 * is a citizen of are left out: you enter those on their own passport, so the
 * easiest requirement across passports means nothing there.
 */
export function combinePassports(held: string[], results: Map<string, VisaResult[]>): CombinedAccess {
  const own = new Set(held);
  const byDest = new Map<string, { country: Country; options: PassportOption[] }>();
  for (const code of held) {
    for (const r of results.get(code) ?? []) {
      if (own.has(r.destinationCountry.code)) continue;
      const entry = byDest.get(r.destinationCountry.code) ?? { country: r.destinationCountry, options: [] };
      entry.options.push({ code, requirement: r.requirement });
      byDest.set(r.destinationCountry.code, entry);
    }
  }

  const rows: CombinedDestination[] = [...byDest.values()]
    .map(({ country, options }) => {
      const bestSeverity = Math.min(...options.map((o) => severity(o.requirement)));
      return {
        country,
        options,
        best: requirementOrder[bestSeverity],
        bestCodes: options.filter((o) => severity(o.requirement) === bestSeverity).map((o) => o.code),
      };
    })
    .sort((a, b) => a.country.name.localeCompare(b.country.name));

  const single = held.map((code) => ({
    code,
    count: rows.filter((row) => row.options.some((o) => o.code === code && reachable(o.requirement))).length,
  }));
  const combined = rows.filter((row) => reachable(row.best)).length;
  const breakdown = Object.fromEntries(
    requirementOrder.map((req) => [req, rows.filter((row) => row.best === req).length]),
  ) as Record<VisaRequirement, number>;

  // Where the choice matters: one passport gets a strictly easier entry than
  // another. Grouped by which passport (or passports) to travel on.
  const decisive = rows.filter((row) => row.bestCodes.length < row.options.length);
  const groupMap = new Map<string, CombinedDestination[]>();
  for (const row of decisive) {
    const key = row.bestCodes.join(",");
    groupMap.set(key, [...(groupMap.get(key) ?? []), row]);
  }

  return {
    rows,
    single,
    combined,
    gain: combined - Math.max(0, ...single.map((s) => s.count)),
    breakdown,
    groups: [...groupMap.entries()].sort((a, b) => b[1].length - a[1].length),
    decisiveCount: decisive.length,
    // "needs a visa" and "not admitted at all" are different answers and must not
    // share a list: one is an application, the other is a closed door.
    stillNeedVisa: rows.filter((row) => row.best === "visa_required"),
    noEntry: rows.filter((row) => row.best === "no_admission"),
  };
}
