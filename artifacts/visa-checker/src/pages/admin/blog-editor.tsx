import { useState, useEffect, useCallback } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";
import { Save, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { marked } from "marked";

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  tags: string;
  author: string;
  published: boolean;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const EMPTY: PostForm = {
  title: "", slug: "", excerpt: "", content: "", cover_url: "", tags: "", author: "Admin", published: false,
};

export default function AdminBlogEditor() {
  const params = useParams<{ id?: string }>();
  const isNew = !params.id || params.id === "new";
  const postId = isNew ? null : Number(params.id);

  const [form, setForm] = useState<PostForm>(EMPTY);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const { data, isLoading: loadingPost } = useQuery({
    queryKey: ["admin-post", postId],
    enabled: !isNew && !!postId,
    queryFn: async () => {
      const res = await fetch(`/api/admin/posts/${postId!}`, { credentials: "include" });
      if (!res.ok) throw new Error("Post not found");
      return res.json() as Promise<{ post: PostForm & { tags: string[] | string } }>;
    },
  });

  useEffect(() => {
    if (data?.post) {
      const p = data.post;
      setForm({
        title: p.title ?? "",
        slug: p.slug ?? "",
        excerpt: p.excerpt ?? "",
        content: p.content ?? "",
        cover_url: (p as unknown as { cover_url?: string }).cover_url ?? "",
        tags: Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags ?? ""),
        author: p.author ?? "Admin",
        published: (p as unknown as { published?: boolean }).published ?? false,
      });
      setSlugTouched(true);
    }
  }, [data]);

  const set = useCallback(<K extends keyof PostForm>(k: K, v: PostForm[K]) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "title" && !slugTouched) {
        next.slug = slugify(String(v));
      }
      return next;
    });
  }, [slugTouched]);

  const saveMutation = useMutation({
    mutationFn: async (publish?: boolean) => {
      const payload = {
        ...form,
        published: publish !== undefined ? publish : form.published,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const url = isNew ? "/api/admin/posts" : `/api/admin/posts/${postId!}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json() as { id?: number; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      return json;
    },
    onSuccess: (data) => {
      setError("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (isNew && data.id) {
        window.history.replaceState(null, "", `/admin/blog/${data.id}`);
      }
    },
    onError: (e: Error) => setError(e.message),
  });

  const previewHtml = preview
    ? (marked.parse(form.content) as string)
    : "";

  const title = isNew ? "New Post" : "Edit Post";

  if (loadingPost) {
    return (
      <AdminGuard>
        <AdminLayout title={title} activeHref="/admin/blog">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout title={title} activeHref="/admin/blog">
        <div className="max-w-4xl">
          {/* Back + actions */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <a href="/admin/blog" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              All posts
            </a>
            <div className="flex items-center gap-2">
              {error && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" /> {error}
                </p>
              )}
              {saved && (
                <p className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> Saved!
                </p>
              )}
              <button
                onClick={() => setPreview((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {preview ? "Editor" : "Preview"}
              </button>
              <button
                onClick={() => saveMutation.mutate(false)}
                disabled={saveMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-60"
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Draft
              </button>
              <button
                onClick={() => saveMutation.mutate(true)}
                disabled={saveMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {form.published ? "Update & Publish" : "Publish"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Your amazing blog post title"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Content * <span className="normal-case font-normal text-muted-foreground/70">(Markdown supported)</span>
                </label>
                {preview ? (
                  <div
                    className="min-h-[400px] p-5 rounded-xl border border-border bg-card prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <textarea
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    placeholder={`Write your post content in Markdown...\n\n# Heading\n\n**Bold text** and *italic text*\n\n- List item\n- Another item\n\n> Blockquote`}
                    rows={20}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="A short summary shown in the blog listing..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Publishing</p>
                <label className="flex items-center gap-2 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => set("published", e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span className="text-sm font-medium text-foreground">Published</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  {form.published ? "Visible to all visitors" : "Only visible to admins"}
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Post Details</p>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">URL Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }}
                    placeholder="my-post-title"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">/blog/{form.slug || "…"}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => set("author", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    placeholder="travel, visa, europe"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={form.cover_url}
                    onChange={(e) => set("cover_url", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {form.cover_url && (
                    <img src={form.cover_url} alt="cover preview" className="mt-2 w-full h-24 object-cover rounded-lg" onError={(e) => (e.currentTarget.style.display = "none")} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
