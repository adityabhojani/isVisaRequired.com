import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  useSEO({
    title: "Contact & report a correction | Is Visa Required?",
    description: "Spotted out-of-date visa information or have a question? Tell us and we'll review it against the official source.",
    canonical: "https://www.isvisarequired.com/contact",
  });

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Prefill context from ?context= (e.g. the page they came from).
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("context");
    if (c) setContext(c.slice(0, 300));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) { setError("Please enter a message of at least 5 characters."); return; }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), email: email.trim(), context: context.trim() }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Couldn't submit.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't submit — please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Contact & report a correction</h1>
        <p className="text-muted-foreground mb-8">
          Visa rules change often. If something looks out of date or wrong, tell us — we review every report against the
          official government source and update our data. You can also use this form for general questions.
        </p>

        {status === "sent" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-700">Thank you — we've received your message.</p>
            <p className="text-sm text-green-600 mt-1">We review reports against official sources and update accordingly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Your message <span className="text-red-500">*</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                maxLength={2000}
                placeholder="e.g. The page for India → Thailand shows visa-free, but the official site now says…"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Your email <span className="text-muted-foreground font-normal">(optional — only if you'd like a reply)</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {context && (
              <p className="text-xs text-muted-foreground">Referring to: <span className="font-mono">{context}</span></p>
            )}
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="h-4 w-4" /> {error}</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              We never charge for visa applications. For your specific case, always confirm with the official government portal.
            </p>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
