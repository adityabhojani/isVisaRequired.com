import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Settings {
  announcement_enabled: string;
  announcement_text: string;
  announcement_type: string;
  hero_title: string;
  hero_subtitle: string;
  seo_meta_description: string;
}

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>({
    announcement_enabled: "false",
    announcement_text: "",
    announcement_type: "info",
    hero_title: "",
    hero_subtitle: "",
    seo_meta_description: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load settings");
      return res.json() as Promise<{ settings: Settings }>;
    },
  });

  useEffect(() => {
    if (data?.settings) setForm((f) => ({ ...f, ...data.settings }));
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      return json;
    },
    onSuccess: () => { setSaved(true); setError(""); setTimeout(() => setSaved(false), 3000); },
    onError: (e: Error) => setError(e.message),
  });

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminGuard>
      <AdminLayout title="Site Settings" activeHref="/admin/settings">
        <div className="max-w-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Announcement Banner */}
              <section className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Announcement Banner
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.announcement_enabled === "true"}
                      onChange={(e) => set("announcement_enabled", e.target.checked ? "true" : "false")}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-foreground">Show announcement banner</span>
                  </label>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Banner Type</label>
                    <select
                      value={form.announcement_type}
                      onChange={(e) => set("announcement_type", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="info">Info (blue)</option>
                      <option value="warning">Warning (amber)</option>
                      <option value="success">Success (green)</option>
                      <option value="error">Alert (red)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Banner Message</label>
                    <textarea
                      value={form.announcement_text}
                      onChange={(e) => set("announcement_text", e.target.value)}
                      placeholder="Enter your announcement text here..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Hero Section */}
              <section className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Homepage Hero
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={form.hero_title}
                      onChange={(e) => set("hero_title", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Hero Subtitle</label>
                    <textarea
                      value={form.hero_subtitle}
                      onChange={(e) => set("hero_subtitle", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* SEO */}
              <section className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  SEO
                </h2>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Default Meta Description</label>
                  <textarea
                    value={form.seo_meta_description}
                    onChange={(e) => set("seo_meta_description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{form.seo_meta_description.length} / 160 chars</p>
                </div>
              </section>

              {/* Save */}
              <div className="flex items-center justify-between">
                <div>
                  {error && <p className="flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{error}</p>}
                  {saved && <p className="flex items-center gap-1 text-sm text-green-600"><CheckCircle2 className="h-4 w-4" />Settings saved!</p>}
                </div>
                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
