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
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-medium">
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
    <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-primary/20 rounded-2xl px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Get notified if this requirement changes
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              We'll email you when the visa rule between {passportFlag} {passportName} and {destinationFlag} {destinationName} changes.
            </p>
            <form onSubmit={submit} className="flex gap-2 mt-3 flex-wrap">
              {isLoaded && !user && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-9 px-3.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-52 transition-shadow"
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
                className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {status === "loading"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Bell className="h-3.5 w-3.5" />}
                Set Alert
              </button>
            </form>
            {status === "error" && (
              <p className="text-xs text-red-600 mt-1.5">{error}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setStatus("dismissed")}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1"
          title="Dismiss"
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
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-medium">
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
    <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-primary/20 rounded-2xl px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Get visa change alerts
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Email me when any of these {destinations.length} visa requirements change for {passportFlag} {passportName}.
            </p>
            <div className="flex flex-wrap gap-1 mt-2 mb-3">
              {destinations.slice(0, 8).map((d) => (
                <span key={d.code} className="inline-flex items-center gap-1 text-xs bg-card border border-border rounded-full px-2 py-0.5">
                  {d.flag} {d.name}
                </span>
              ))}
              {destinations.length > 8 && (
                <span className="text-xs text-muted-foreground self-center">+{destinations.length - 8} more</span>
              )}
            </div>
            <form onSubmit={submit} className="flex gap-2 flex-wrap">
              {isLoaded && !user && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-9 px-3.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-52 transition-shadow"
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
                className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {status === "loading"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Bell className="h-3.5 w-3.5" />}
                Set {destinations.length} Alert{destinations.length > 1 ? "s" : ""}
              </button>
            </form>
            {status === "error" && (
              <p className="text-xs text-red-600 mt-1.5">{error}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setStatus("dismissed")}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1"
          title="Dismiss"
        >
          <BellOff className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
