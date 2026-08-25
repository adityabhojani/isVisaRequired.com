import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";
import { Save, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Film, Youtube } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { upload } from "@vercel/blob/client";

async function uploadMedia(file: File): Promise<string> {
  // Browser uploads directly to Vercel Blob (no 4.5 MB function limit). The
  // /api/admin/upload endpoint only issues the token (admin-gated server-side).
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    contentType: file.type || undefined,
  });
  return blob.url;
}

function toVideoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

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

  // ── media (image / video upload + embed) ───────────────────────────────────
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const insertIntoContent = useCallback((snippet: string) => {
    const ta = contentRef.current;
    const at = ta && typeof ta.selectionStart === "number" ? ta.selectionStart : null;
    setForm((f) => {
      const text = f.content;
      const pos = at ?? text.length;
      const before = text.slice(0, pos);
      const after = text.slice(pos);
      const lead = before && !before.endsWith("\n") ? "\n" : "";
      const trail = after.startsWith("\n") ? "" : "\n";
      return { ...f, content: `${before}${lead}${snippet}\n${trail}${after}` };
    });
  }, []);

  const handleUpload = useCallback(async (file: File | undefined, kind: "image" | "video" | "cover") => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      if (kind === "cover") set("cover_url", url);
      else if (kind === "image") insertIntoContent(`![${file.name.replace(/\.[^.]+$/, "")}](${url})`);
      else insertIntoContent(`<video src="${url}" controls style="max-width:100%;border-radius:12px"></video>`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [set, insertIntoContent]);

  const handleEmbed = useCallback(() => {
    const url = window.prompt("Paste a YouTube or Vimeo video link:");
    if (!url) return;
    const embed = toVideoEmbed(url.trim());
    if (!embed) { setError("That doesn't look like a YouTube or Vimeo link."); return; }
    insertIntoContent(`<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0"><iframe src="${embed}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
  }, [insertIntoContent]);

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
    ? renderMarkdown(form.content)
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
                {!preview && (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent disabled:opacity-50">
                      <ImageIcon className="h-3.5 w-3.5" /> Image
                    </button>
                    <button type="button" onClick={() => videoInputRef.current?.click()} disabled={uploading}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent disabled:opacity-50">
                      <Film className="h-3.5 w-3.5" /> Video
                    </button>
                    <button type="button" onClick={handleEmbed} disabled={uploading}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent disabled:opacity-50">
                      <Youtube className="h-3.5 w-3.5" /> Embed video
                    </button>
                    {uploading && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground/70 ml-auto">Images &amp; videos up to 100&nbsp;MB</span>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { void handleUpload(e.target.files?.[0], "image"); e.target.value = ""; }} />
                    <input ref={videoInputRef} type="file" accept="video/*" className="hidden"
                      onChange={(e) => { void handleUpload(e.target.files?.[0], "video"); e.target.value = ""; }} />
                  </div>
                )}
                {preview ? (
                  <div
                    className="min-h-[400px] p-5 rounded-xl border border-border bg-card prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <textarea
                    ref={contentRef}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-muted-foreground">Cover Image</label>
                    <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploading}
                      className="text-xs font-medium text-primary hover:underline disabled:opacity-50">
                      Upload from computer
                    </button>
                  </div>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { void handleUpload(e.target.files?.[0], "cover"); e.target.value = ""; }} />
                  <input
                    type="url"
                    value={form.cover_url}
                    onChange={(e) => set("cover_url", e.target.value)}
                    placeholder="https://…  or click Upload above"
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
