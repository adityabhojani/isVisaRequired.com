import { useState } from "react";
import {
  DollarSign, FileText, AlertCircle, CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";
import type { VisaResult, VisaRequirement } from "@workspace/api-client-react";

const defaultFees: Record<VisaRequirement, number | null> = {
  visa_free: 0,
  visa_on_arrival: null,
  e_visa: null,
  visa_required: null,
  no_admission: null,
};

const defaultDocs: Record<VisaRequirement, string[]> = {
  visa_free: [
    "Valid passport (6+ months validity)",
    "Return or onward ticket",
    "Proof of sufficient funds",
  ],
  visa_on_arrival: [
    "Valid passport (6+ months validity)",
    "Completed arrival/VOA form",
    "Passport-size photo",
    "Return or onward ticket",
    "Proof of accommodation",
    "Cash for visa fee (USD accepted at most airports)",
  ],
  e_visa: [
    "Scanned passport bio-data page",
    "Passport-size photo (white background)",
    "Travel itinerary / flight details",
    "Proof of accommodation",
    "Credit/debit card for payment",
  ],
  visa_required: [
    "Completed visa application form",
    "Valid passport (6+ months validity, 2 blank pages)",
    "2 recent passport-size photos",
    "Round-trip flight tickets",
    "Proof of accommodation",
    "Bank statements (last 3 months)",
    "Travel insurance",
    "Proof of employment / business registration",
    "Cover letter stating purpose of visit",
  ],
  no_admission: [],
};

interface TripSummaryProps {
  results: VisaResult[];
}

export function TripSummary({ results }: TripSummaryProps) {
  const [expanded, setExpanded] = useState(true);
  const [docsExpanded, setDocsExpanded] = useState(false);

  const knownFeeTotal = results.reduce((sum, r) => {
    const fee = defaultFees[r.requirement];
    return fee != null ? sum + fee : sum;
  }, 0);
  const allFreeOrUnknown = results.every((r) => r.requirement === "visa_free" || r.requirement === "no_admission");
  const hasPaidFees = results.some((r) => r.requirement !== "visa_free" && r.requirement !== "no_admission");

  const allDocuments = Array.from(
    new Set(results.flatMap((r) => defaultDocs[r.requirement]))
  );

  const requirementCounts = results.reduce(
    (acc, r) => {
      acc[r.requirement] = (acc[r.requirement] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<VisaRequirement, number>>
  );

  const requiresAdvancePlanning = results.some(
    (r) => r.requirement === "visa_required" || r.requirement === "e_visa"
  );

  const reqColors: Record<VisaRequirement, string> = {
    visa_free: "bg-green-100 text-green-700",
    visa_on_arrival: "bg-amber-100 text-amber-700",
    e_visa: "bg-blue-100 text-blue-700",
    visa_required: "bg-orange-100 text-orange-700",
    no_admission: "bg-red-100 text-red-700",
  };
  const reqLabels: Record<VisaRequirement, string> = {
    visa_free: "Visa Free",
    visa_on_arrival: "On Arrival",
    e_visa: "eVisa",
    visa_required: "Visa Required",
    no_admission: "No Entry",
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Trip Overview</span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {results.length} destination{results.length > 1 ? "s" : ""}
          </span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Cost per destination */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Estimated Visa Costs</div>
            <div className="space-y-2">
              {results.map((r) => {
                const fee = defaultFees[r.requirement];
                return (
                  <div key={r.destinationCountry.code} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <span>{r.destinationCountry.flag}</span>
                      <span className="text-foreground">{r.destinationCountry.name}</span>
                    </div>
                    <div className="font-semibold">
                      {r.requirement === "no_admission" ? (
                        <span className="text-red-600 text-xs">Not permitted</span>
                      ) : fee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : fee != null ? (
                        <span className="text-foreground">~${fee}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Check embassy</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {allFreeOrUnknown ? "Visa Cost" : "Total Visa Cost"}
              </span>
              <span className="text-lg font-bold text-primary">
                {allFreeOrUnknown
                  ? <span className="text-green-600">Free</span>
                  : hasPaidFees && knownFeeTotal === 0
                    ? <span className="text-sm font-medium text-muted-foreground">Check embassies</span>
                    : knownFeeTotal > 0
                      ? `~$${knownFeeTotal}+ USD`
                      : <span className="text-green-600">Free</span>
                }
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasPaidFees
                ? "Fees vary by passport nationality and are set by each country's government. Always verify with the official embassy or consulate."
                : "No visa fees required for your trip."}
            </p>
          </div>

          {/* Breakdown */}
          {Object.keys(requirementCounts).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(requirementCounts) as [VisaRequirement, number][]).map(([req, count]) => (
                <span key={req} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${reqColors[req]}`}>
                  {count}× {reqLabels[req]}
                </span>
              ))}
            </div>
          )}

          {/* Advance planning notice */}
          {requiresAdvancePlanning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <span className="font-semibold">Plan ahead:</span> Some destinations require advance visa applications — allow 10–15 business days and apply as early as possible.
                </div>
              </div>
            </div>
          )}

          {/* Combined documents */}
          {allDocuments.length > 0 && (
            <div>
              <button
                onClick={() => setDocsExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors"
              >
                <FileText className="h-3 w-3" />
                Documents to Prepare ({allDocuments.length})
                {docsExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </button>
              {docsExpanded && (
                <div className="space-y-1.5">
                  {allDocuments.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                      {doc}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
