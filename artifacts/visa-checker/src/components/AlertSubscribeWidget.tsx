import { useState } from "react";
import { Bell, CheckCircle2, Loader2, X, BellOff } from "lucide-react";
import { useUser } from "@clerk/react";

interface Props {
  passportCode: string;
  passportFlag: string;
  passportName: string;
  destinationCode: string;
  destinationFlag: string;
  destinationName: string;
  compact?: boolean;
}

export function AlertSubscribeWidget({
  passportCode,
  passportFlag,
  passportName,
  destinationCode,
  destinationFlag,
  destinationName,
  compact = false,
}: Props) {
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "dismissed">("idle");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [error, setError] = useState("");

  if (status === "dismissed") return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          passport_code: passportCode,
          destination_code: destinationCode,
        }),
      });
      const data = await res.json() as { success?: boolean; needsConfirmation?: boolean; error?: string };
      if (data.success) {
        setNeedsConfirm(Boolean(data.needsConfirmation));
        setStatus("success");
      } else {
        setStatus("error");
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        <span>{needsConfirm
          ? `Almost done — check your inbox and click the confirmation link to activate your ${destinationName} alert.`
          : `Alert set! We'll email you if the requirement for ${destinationFlag} ${destinationName} changes.`}</span>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="h-8 px-3 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-44"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5 flex-shrink-0"
        >
          {status === "loading" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bell className="h-3 w-3" />}
          Alert me
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 sm:px-5 py-4 shadow-[inset_0_2px_4px_rgb(15_23_41/0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground inline-flex items-center gap-2"><Bell className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />Get an email if this rule changes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              We'll email you when the visa rule between {passportFlag} {passportName} and {destinationFlag} {destinationName} changes.
            </p>
            <form onSubmit={submit} className="mt-3 flex flex-col sm:flex-row gap-2">
              {isLoaded && !user && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-11 w-full sm:w-64 px-3.5 rounded-xl border border-border/80 bg-card text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/35 transition-shadow"
                />
              )}
              {isLoaded && user && (
                <p className="text-xs text-muted-foreground self-center">
                  Alert sent to {user.primaryEmailAddress?.emailAddress}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 w-full sm:w-auto px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-[hsl(222_89%_25%)] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-1.5 hover-elevate active-elevate-2"
              >
                {status === "loading"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Bell className="h-3.5 w-3.5" />}
                Set alert
              </button>
            </form>
            {status === "error" && (
              <p className="text-xs text-red-600 mt-1.5">{error}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStatus("dismissed")}
          aria-label="Dismiss alert sign-up"
          className="shrink-0 grid place-items-center h-9 w-9 -mr-1.5 -mt-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Multi-destination version — shows a single widget for all destinations
interface MultiProps {
  passportCode: string;
  passportFlag: string;
  passportName: string;
  destinations: Array<{ code: string; flag: string; name: string }>;
}

export function MultiAlertSubscribeWidget({ passportCode, passportFlag, passportName, destinations }: MultiProps) {
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "dismissed">("idle");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [error, setError] = useState("");

  if (status === "dismissed" || destinations.length === 0) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !user) return;
    const resolvedEmail = email || (user?.primaryEmailAddress?.emailAddress ?? "");
    if (!resolvedEmail) return;
    setStatus("loading");
    setError("");

    try {
      const results = await Promise.all(
        destinations.map((dest) =>
          fetch("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: resolvedEmail,
              passport_code: passportCode,
              destination_code: dest.code,
            }),
          })
        )
      );
      const allOk = results.every((r) => r.ok);
      if (allOk) {
        const bodies = await Promise.all(results.map((r) => r.json().catch(() => ({})) as Promise<{ needsConfirmation?: boolean }>));
        setNeedsConfirm(bodies.some((b) => b.needsConfirmation));
        setStatus("success");
      } else {
        setStatus("error");
        setError("Some alerts could not be saved. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        <span>
          {needsConfirm
            ? `Almost done — check your inbox and confirm to activate your ${destinations.length} alert${destinations.length > 1 ? "s" : ""}.`
            : `Alerts set for ${destinations.length} destination${destinations.length > 1 ? "s" : ""}! We'll email you when requirements change.`}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 sm:px-5 py-4 shadow-[inset_0_2px_4px_rgb(15_23_41/0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground inline-flex items-center gap-2"><Bell className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />Get an email if any of these {destinations.length} rules change</h3>
            <p className="text-xs text-muted-foreground mt-0.5">One message when a requirement for your {passportFlag} {passportName} passport changes. No newsletter.</p>
            <form onSubmit={submit} className="mt-3 flex flex-col sm:flex-row gap-2">
              {isLoaded && !user && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-11 w-full sm:w-64 px-3.5 rounded-xl border border-border/80 bg-card text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/35 transition-shadow"
                />
              )}
              {isLoaded && user && (
                <p className="text-xs text-muted-foreground self-center">
                  Alerts sent to {user.primaryEmailAddress?.emailAddress}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 w-full sm:w-auto px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-[hsl(222_89%_25%)] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-1.5 hover-elevate active-elevate-2"
              >
                {status === "loading"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Bell className="h-3.5 w-3.5" />}
                Set {destinations.length} alert{destinations.length > 1 ? "s" : ""}
              </button>
            </form>
            {status === "error" && (
              <p className="text-xs text-red-600 mt-1.5">{error}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStatus("dismissed")}
          aria-label="Dismiss alert sign-up"
          className="shrink-0 grid place-items-center h-9 w-9 -mr-1.5 -mt-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <BellOff className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
