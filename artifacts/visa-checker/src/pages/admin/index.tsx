import { useQuery } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";
import { Users, FileText, Settings, TrendingUp, Globe, Plus } from "lucide-react";

interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  settingsCount: number;
  registeredUsers: number;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: typeof Users; color: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json() as Promise<AdminStats>;
    },
  });

  return (
    <AdminGuard>
      <AdminLayout title="Dashboard" activeHref="/admin">
        <div className="max-w-5xl">
          {/* Welcome */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 rounded-2xl p-6 mb-6">
            <h2 className="font-serif text-xl font-bold text-foreground mb-1">Welcome to the Admin Panel</h2>
            <p className="text-muted-foreground text-sm">Manage your website content, blog posts, and site settings from here.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3 w-2/3" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </div>
              ))
            ) : (
              <>
                <StatCard label="Total Blog Posts" value={data?.totalPosts ?? 0} icon={FileText} color="bg-blue-50 text-blue-600" />
                <StatCard label="Published Posts" value={data?.publishedPosts ?? 0} icon={TrendingUp} color="bg-green-50 text-green-600" />
                <StatCard label="Registered Users" value={data?.registeredUsers ?? 0} icon={Users} color="bg-purple-50 text-purple-600" />
                <StatCard label="Site Settings" value={data?.settingsCount ?? 0} icon={Settings} color="bg-amber-50 text-amber-600" />
              </>
            )}
          </div>

          {/* Quick actions */}
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="/admin/blog/new"
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">New Blog Post</p>
                <p className="text-xs text-muted-foreground">Write and publish content</p>
              </div>
            </a>
            <a href="/admin/blog"
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Manage Posts</p>
                <p className="text-xs text-muted-foreground">Edit, publish or delete</p>
              </div>
            </a>
            <a href="/admin/settings"
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <Settings className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Site Settings</p>
                <p className="text-xs text-muted-foreground">Update announcements & copy</p>
              </div>
            </a>
          </div>

          {/* View site link */}
          <div className="mt-6 flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a href="/" target="_blank" rel="noopener" className="text-sm text-primary hover:underline underline-offset-2">
              View live site →
            </a>
            <span className="text-muted-foreground text-sm mx-1">·</span>
            <a href="/blog" target="_blank" rel="noopener" className="text-sm text-primary hover:underline underline-offset-2">
              View public blog →
            </a>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
