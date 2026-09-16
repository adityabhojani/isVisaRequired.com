import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initGA, initClarity, isAnalyticsEnabled, isClarityEnabled } from "@/lib/analytics";

const CONSENT_KEY = "cookie_consent";

// The banner exists to ask permission for tracking that needs it, so what it
// names comes from the same build-time flags that switch each service on. It
// said "We use Google Analytics" for months while no GA measurement ID was set;
// deriving the list from the flags means it can't describe a service that isn't
// running, and it reappears with the right wording when one is switched on.
//
// Deliberately not listed, because neither needs consent: Vercel Web Analytics,
// which is always on and sets no cookies, and the sign-in cookies Clerk sets,
// which are strictly necessary for an account.
const CONSENT_SERVICES = [
  isAnalyticsEnabled ? "Google Analytics" : null,
  isClarityEnabled ? "Microsoft Clarity" : null,
].filter((s): s is string => s !== null);

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (CONSENT_SERVICES.length === 0) return;
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    initGA();
    initClarity();
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  // Nothing that needs consent is switched on, so there is nothing to ask.
  if (!visible || CONSENT_SERVICES.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Analytics cookies</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              With your permission, we use {joinNames(CONSENT_SERVICES)} to understand how visitors use
              this site. They only run if you accept, and we never sell your data.{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={decline} className="flex-1 sm:flex-none text-xs h-8">
            Decline
          </Button>
          <Button size="sm" onClick={accept} className="flex-1 sm:flex-none text-xs h-8 bg-primary text-primary-foreground">
            Accept
          </Button>
          <button
            onClick={decline}
            className="text-muted-foreground hover:text-foreground transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
