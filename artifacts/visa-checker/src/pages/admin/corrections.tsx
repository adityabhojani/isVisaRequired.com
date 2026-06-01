import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";
import { MessageSquare, CheckCircle2, Mail } from "lucide-react";

interface Correction {
  id: number;
  context: string | null;
  message: string;
  email: string | null;
  resolved: boolean;
  created_at: string;
}

function formatDate(s: string) {
  try { return new Date(s).toLocaleString(); } catch { return s; }
}

export default function AdminCorrectionsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-corrections"],
    queryFn: async () => {
      const res = await fetch("/api/admin/corrections", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load corrections");
      return res.json() as Promise<{ corrections: Correction[]; total: number }>;
    },
  });

  const resolve = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/corrections/${id}/resolve`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-corrections"] }),
  });

  const items = data?.corrections ?? [];
  const open = items.filter((c) => !c.resolved);

  return (
    <AdminGuard>
      <AdminLayout title="Corrections" activeHref="/admin/corrections">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Reported corrections & messages</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {isLoading ? "Loading…" : `${open.length} open · ${items.length} total`}
          </p>

          {!isLoading && items.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
              No messages yet. Reports from the Contact page will appear here.
            </div>
          )}

          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.id} className={`bg-card border rounded-2xl p-4 ${c.resolved ? "border-border opacity-60" : "border-border"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{c.message}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span>{formatDate(c.created_at)}</span>
                      {c.context && <span className="font-mono">{c.context}</span>}
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                          <Mail className="h-3 w-3" /> {c.email}
                        </a>
                      )}
                    </div>
                  </div>
                  {!c.resolved && (
                    <button
                      onClick={() => resolve.mutate(c.id)}
                      disabled={resolve.isPending}
                      className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-800"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Resolve
                    </button>
                  )}
                  {c.resolved && <span className="flex-shrink-0 text-xs text-green-600 inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Resolved</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
