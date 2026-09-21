import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useListCountries, useCheckVisaMultiple } from "@workspace/api-client-react";
import type { VisaResult } from "@workspace/api-client-react";
import { styleForResult } from "@/lib/requirement";

export default function WidgetPage() {
  const params = new URLSearchParams(window.location.search);
  const passportCode = params.get("passport")?.toUpperCase() ?? "";
  const destinationCode = params.get("destination")?.toUpperCase() ?? "";

  const { data: countries = [] } = useListCountries();
  const checkMutation = useCheckVisaMultiple();
  const [result, setResult] = useState<VisaResult | null>(null);

  useEffect(() => {
    if (!passportCode || !destinationCode || !countries.length) return;
    checkMutation.mutate(
      { data: { passport: passportCode, destinations: [destinationCode] } },
      { onSuccess: (data) => { if (data.length > 0) setResult(data[0] as VisaResult); } }
    );
  }, [countries.length, passportCode, destinationCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const passport = countries.find((c) => c.code === passportCode);
  const destination = countries.find((c) => c.code === destinationCode);

  // styleForResult, not reqConfig: a single pair with its notes, so a UK ETA /
  // US ESTA stored as e_visa is shown as "Travel authorisation".
  const cfg = result ? styleForResult(result.requirement, result.notes, result.maxStay) : null;
  const Icon = cfg?.icon;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className={`w-full max-w-sm rounded-2xl border shadow-md overflow-hidden ${cfg ? `${cfg.bg} ${cfg.border}` : "bg-card border-border"}`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b ${cfg ? cfg.border : "border-border"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {passport && destination ? (
                <>
                  <span className="text-3xl">{passport.flag}</span>
                  <span className="text-muted-foreground text-lg">→</span>
                  <span className="text-3xl">{destination.flag}</span>
                </>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm">Is Visa Required?</span>
                </div>
              )}
            </div>
            {cfg && Icon && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-white/60 border ${cfg.border} ${cfg.color}`}>
                <Icon className="h-4 w-4" />
                {cfg.label}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {checkMutation.isPending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Checking…</span>
            </div>
          )}

          {result && passport && destination && (
            <div>
              <p className="text-sm font-semibold text-foreground">
                {passport.name} → {destination.name}
              </p>
              {result.maxStay && (
                <p className="text-xs text-muted-foreground mt-1">Stay up to: {result.maxStay}</p>
              )}
              {result.notes && (
                <p className="text-xs text-muted-foreground mt-1">{result.notes}</p>
              )}
            </div>
          )}

          {!passportCode && !destinationCode && (
            <p className="text-sm text-muted-foreground">
              Add <code className="text-xs bg-muted px-1 rounded">?passport=US&destination=JP</code> to the URL
            </p>
          )}
        </div>

        {/* Footer */}
        <a
          href={result ? `https://www.isvisarequired.com/?passport=${passportCode}&destinations=${destinationCode}` : "https://www.isvisarequired.com"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs text-muted-foreground border-t ${cfg ? cfg.border : "border-border"} hover:text-foreground transition-colors`}
        >
          <Globe className="h-3 w-3" />
          isvisarequired.com — free visa checker
        </a>
      </div>
    </div>
  );
}
