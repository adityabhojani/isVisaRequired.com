import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Tag, Calendar } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string | null;
  tags: string[];
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminBlogList() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/posts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load posts");
      return res.json() as Promise<{ posts: BlogPost[] }>;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ post, published }: { post: BlogPost; published: boolean }) => {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, published }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => { setConfirmDelete(null); qc.invalidateQueries({ queryKey: ["admin-posts"] }); },
  });

  const posts = data?.posts ?? [];
  const filtered = posts.filter((p) => {
    if (filter === "published" && !p.published) return false;
    if (filter === "draft" && p.published) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminGuard>
      <AdminLayout title="Blog Posts" activeHref="/admin/blog">
        <div className="max-w-5xl">
          {/* Actions bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "published", "draft"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <a
              href="/admin/blog/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Post
            </a>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <FileTextIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground">No posts found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {posts.length === 0 ? "Create your first blog post to get started." : "Try adjusting your search or filter."}
              </p>
              {posts.length === 0 && (
                <a href="/admin/blog/new" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="h-4 w-4" /> Create first post
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 hover:border-primary/20 transition-colors">
                  {post.cover_url && (
                    <img src={post.cover_url} alt="" className="w-16 h-12 rounded-xl object-cover flex-shrink-0 hidden sm:block" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">{post.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        post.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    {post.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.created_at)}</span>
                      {post.tags?.length > 0 && (
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{post.tags.slice(0, 2).join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleMutation.mutate({ post, published: !post.published })}
                      title={post.published ? "Unpublish" : "Publish"}
                      className={`p-2 rounded-xl transition-colors ${
                        post.published
                          ? "text-green-600 hover:bg-green-50"
                          : "text-muted-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <a
                      href={`/admin/blog/${post.id}`}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setConfirmDelete(post.id)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete confirm dialog */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl p-6 max-w-sm w-full">
              <h3 className="font-semibold text-foreground mb-2">Delete this post?</h3>
              <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The post will be permanently deleted.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(confirmDelete)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminGuard>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
