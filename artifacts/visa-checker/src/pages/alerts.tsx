import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { Bell, Trash2, Loader2, BellOff, BellRing, LogIn, Plus } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useListCountries } from "@workspace/api-client-react";
import type { Country } from "@workspace/api-client-react";

interface Alert {
  id: number;
  passport_code: string;
  destination_code: string;
  created_at: string;
}

function getCountry(countries: Country[], code: string) {
  return countries.find((c) => c.code === code.toUpperCase());
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export default function AlertsPage() {
  useSEO({
    title: "My Visa Alerts | Is Visa Required?",
    description: "Manage your visa change alerts. Get notified when visa requirements change for your saved passport and destination pairs.",
  });

  const { user, isLoaded } = useUser();
  const qc = useQueryClient();
  const { data: countries = [] } = useListCountries();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-alerts"],
    queryFn: async () => {
      const res = await fetch("/api/alerts", { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json() as Promise<{ alerts: Alert[] }>;
    },
    enabled: isLoaded && !!user,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/alerts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["my-alerts"] });
      setDeleteId(null);
    },
  });

  const alerts = data?.alerts ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/alerts" />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BellRing className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">My Visa Alerts</h1>
            <p className="text-muted-foreground mt-1">
              You'll be emailed when a tracked visa requirement changes. Set alerts from any visa check.
            </p>
          </div>
        </div>

        {/* Not signed in */}
        {isLoaded && !user && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground text-lg mb-2">Sign in to manage alerts</h2>
            <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto">
              Create an account to save and manage all your visa change alerts in one place.
            </p>
            <a
              href="/sign-in?redirect_url=/alerts"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </a>
          </div>
        )}

        {/* Loading */}
        {isLoaded && user && isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty state */}
        {isLoaded && user && !isLoading && alerts.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-4">
              <BellOff className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="font-semibold text-foreground text-lg mb-2">No alerts yet</h2>
            <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto">
              After checking visa requirements, use the "Set Alert" button to get notified when rules change.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Check visa requirements
            </a>
          </div>
        )}

        {/* Alert list */}
        {isLoaded && user && !isLoading && alerts.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {alerts.length} active alert{alerts.length > 1 ? "s" : ""} — we'll email{" "}
              <span className="font-medium text-foreground">{user.primaryEmailAddress?.emailAddress}</span> when any change occurs.
            </p>

            {alerts.map((alert) => {
              const passport = getCountry(countries, alert.passport_code);
              const destination = getCountry(countries, alert.destination_code);
              const isDeleting = deleteId === alert.id && deleteMutation.isPending;

              return (
                <div
                  key={alert.id}
                  className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">
                        {passport?.flag ?? ""} {passport?.name ?? alert.passport_code}
                      </span>
                      <span className="text-muted-foreground text-xs">→</span>
                      <span className="font-semibold text-foreground text-sm">
                        {destination?.flag ?? ""} {destination?.name ?? alert.destination_code}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Set {timeAgo(alert.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/?passport=${alert.passport_code}&destinations=${alert.destination_code}`}
                      className="text-xs text-primary hover:underline font-medium hidden sm:block"
                    >
                      Check →
                    </a>
                    <button
                      onClick={() => {
                        setDeleteId(alert.id);
                        deleteMutation.mutate(alert.id);
                      }}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Remove alert"
                    >
                      {isDeleting
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              );
            })}

            <p className="text-xs text-muted-foreground text-center mt-6 px-4">
              Alerts are informational. Always verify visa requirements with official embassy sources before travel.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
