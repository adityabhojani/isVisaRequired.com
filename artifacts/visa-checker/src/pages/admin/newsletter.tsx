import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";
import { Mail, Download, Search, Users, Calendar } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  passport_code: string | null;
  created_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminNewsletterPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-newsletter-subscribers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/newsletter/subscribers", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load subscribers");
      return res.json() as Promise<{ subscribers: Subscriber[]; total: number }>;
    },
  });

  const subscribers = data?.subscribers ?? [];
  const filtered = subscribers.filter((s) =>
    !search || s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.passport_code ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      ["Email", "Passport Code", "Subscribed At"],
      ...subscribers.map((s) => [s.email, s.passport_code ?? "", formatDate(s.created_at)]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminGuard>
      <AdminLayout title="Newsletter Subscribers" activeHref="/admin/newsletter">
        <div className="max-w-4xl">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Newsletter Subscribers</p>
                {!isLoading && (
                  <p className="text-sm text-muted-foreground">{data?.total ?? 0} total subscriber{(data?.total ?? 0) !== 1 ? "s" : ""}</p>
                )}
              </div>
            </div>
            <button
              onClick={exportCSV}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground font-medium">Total Subscribers</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{isLoading ? "—" : (data?.total ?? 0)}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-blue-500" />
                <p className="text-xs text-muted-foreground font-medium">With Passport</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {isLoading ? "—" : subscribers.filter((s) => !!s.passport_code).length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-green-500" />
                <p className="text-xs text-muted-foreground font-medium">Last 30 days</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {isLoading ? "—" : subscribers.filter((s) => {
                  const d = new Date(s.created_at);
                  const cutoff = new Date();
                  cutoff.setDate(cutoff.getDate() - 30);
                  return d >= cutoff;
                }).length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or passport code…"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="h-10 w-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">{search ? "No subscribers match your search." : "No subscribers yet."}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Email</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Passport</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="px-5 py-3 font-medium text-foreground truncate max-w-[240px]">{s.email}</td>
                      <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                        {s.passport_code ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-secondary/60 px-2 py-0.5 rounded-full font-medium">{s.passport_code}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(s.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {filtered.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3 text-right">
              Showing {filtered.length} of {data?.total ?? 0} subscriber{(data?.total ?? 0) !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
