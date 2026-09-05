import { useState } from "react";
import { Globe, Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <footer className="border-t border-border">
      {/* Newsletter bar — gradient accent */}
      <div className="bg-gradient-to-r from-primary/8 via-primary/5 to-transparent border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Get visa policy alerts</p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
                  We'll email you when major visa policies change — new visa-free agreements, e-visa launches, and more.
                </p>
              </div>
            </div>
            {status === "success" ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm font-medium flex-shrink-0">
                <CheckCircle2 className="h-4 w-4" />
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={subscribe} className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-10 px-3.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-56 transition-shadow"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5 flex-shrink-0"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                  Subscribe
                </button>
              </form>
            )}
          </div>
          {status === "error" && (
            <p className="text-xs text-red-600 mt-2.5">{errorMsg}</p>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Globe className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-serif font-bold text-foreground">isvisarequired.com</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Free visa requirement checker covering 195 countries and 37,830 passport–destination combinations.
              </p>
            </div>

            {/* Tools */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Tools</p>
              <nav className="flex flex-col gap-2">
                {[
                  { href: "/", label: "Check Visa Requirements" },
                  { href: "/visa-requirements", label: "Visa Requirements by Passport" },
                  { href: "/countries", label: "Visa Requirements by Country" },
                  { href: "/compare", label: "Compare Two Passports" },
                  { href: "/discover", label: "Discover Destinations" },
                  { href: "/map", label: "World Visa Map" },
                  { href: "/trip-planner", label: "Trip Planner" },
                  { href: "/schengen", label: "Schengen Calculator" },
                  { href: "/tier-list", label: "Passport Tier List" },
                  { href: "/digital-nomad", label: "Digital Nomad Visas" },
                  { href: "/reciprocity", label: "Visa Reciprocity" },
                  { href: "/my-travels", label: "My Travels" },
                  { href: "/alerts", label: "Visa Alerts" },
                  { href: "/stats", label: "Passport Power Index" },
                  { href: "/reports/passport-power-2026", label: "Passport Power Report 2026" },
                  { href: "/popular", label: "Popular Destinations" },
                  { href: "/transit-visa", label: "Transit Visa Guides" },
                  { href: "/travel-authorization", label: "ETIAS, ESTA & ETA" },
                  { href: "/residence-permit-visa-benefits", label: "Residence Permit Travel" },
                  { href: "/guides", label: "Visa & Travel Guides" },
                  { href: "/blog", label: "Travel Blog" },
                  { href: "/methodology", label: "How We Source Our Data" },
                ].map(({ href, label }) => (
                  <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all inline-block">
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Legal</p>
              <nav className="flex flex-col gap-2">
                <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact &amp; Corrections</a>
              </nav>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 mt-6">Embed</p>
              <a href="/widget" target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                Widget for your site →
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} isvisarequired.com · Data: ilyankou/passport-index-dataset
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-right">
              Visa data is indicative only. Always verify with official embassy sources before travel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
