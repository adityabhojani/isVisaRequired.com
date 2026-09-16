import { useState } from "react";
import { Globe, Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { FOOTER_GROUPS, FOOTER_LINKS, FOOTER_TAGLINE, FOOTER_DISCLAIMER } from "@workspace/travel-data";

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
      <div className="bg-secondary/60 border-b border-border">
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
      <div className="bg-card">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-9">
            <a href="/" className="flex items-center gap-2 w-fit">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-foreground">isvisarequired.com</span>
            </a>
            <p className="text-xs text-muted-foreground leading-relaxed sm:max-w-xl sm:text-right">
              {FOOTER_TAGLINE}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-9">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-3.5">
                  {group.title}
                </p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-border mt-10 pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} isvisarequired.com · Data: ilyankou/passport-index-dataset
            </p>
            <nav aria-label="Site" className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-3">{FOOTER_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
