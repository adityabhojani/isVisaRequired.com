import { useParams } from "wouter";
import { commonsSrcSet, ARTICLE_IMAGE_SIZES } from "@workspace/travel-data";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { renderMarkdown } from "@/lib/markdown";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";

interface BlogPost {
  /** Database rows use a numeric id; repo-authored posts use their slug. */
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  cover_alt?: string | null;
  cover_width?: number | null;
  cover_height?: number | null;
  cover_caption?: string | null;
  cover_credit?: { author: string; authorUrl?: string; license: string; licenseUrl: string; sourceUrl: string } | null;
  tags: string[];
  author: string;
  created_at: string;
  updated_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${slug}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json() as Promise<{ post: BlogPost }>;
    },
  });

  const post = data?.post;

  useSEO({
    title: post
      ? `${post.title} | isvisarequired.com Blog`
      : "Blog Post | isvisarequired.com",
    description: post?.excerpt ?? "Read travel tips and visa guides on isvisarequired.com",
    canonical: `https://www.isvisarequired.com/blog/${slug}`,
    ...(post?.cover_url ? { ogImage: post.cover_url } : {}),
    ogType: "article",
    jsonLd: post
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt ?? "",
            "url": `https://www.isvisarequired.com/blog/${post.slug}`,
            "image": post.cover_url ?? "https://www.isvisarequired.com/opengraph.jpg",
            "datePublished": post.created_at,
            "dateModified": post.updated_at,
            "author": { "@type": "Person", "name": post.author },
            "publisher": {
              "@type": "Organization",
              "name": "isvisarequired.com",
              "logo": { "@type": "ImageObject", "url": "https://www.isvisarequired.com/logo.svg" }
            },
            "keywords": post.tags?.join(", ") ?? "",
            "inLanguage": "en",
            "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.isvisarequired.com/blog/${post.slug}` }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.isvisarequired.com/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.isvisarequired.com/blog" },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://www.isvisarequired.com/blog/${post.slug}` }
            ]
          }
        ]
      : undefined,
  });

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({ title: post.title, url: window.location.href });
      } catch { /* dismissed */ }
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeHref="/blog" />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/5" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeHref="/blog" />
        <main className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">This post doesn't exist or may have been removed.</p>
          <a href="/blog" className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-2">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const html = renderMarkdown(post.content);

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/blog" />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <a href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </a>

        {/* Cover */}
        {post.cover_url && (
          <figure className="mb-8">
            <img
              src={post.cover_url}
              srcSet={
                (post.cover_width ? commonsSrcSet(post.cover_url, post.cover_width) : null) ??
                undefined
              }
              sizes={
                post.cover_width && commonsSrcSet(post.cover_url, post.cover_width)
                  ? ARTICLE_IMAGE_SIZES
                  : undefined
              }
              alt={post.cover_alt || post.title}
              width={post.cover_width ?? undefined}
              height={post.cover_height ?? undefined}
              fetchPriority="high"
              decoding="async"
              className="w-full h-64 md:h-[26rem] object-cover rounded-2xl shadow-sm bg-muted"
            />
            {(post.cover_caption || post.cover_credit) && (
              <figcaption className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                {post.cover_caption && <span>{post.cover_caption}</span>}
                {post.cover_caption && post.cover_credit && <span> · </span>}
                {post.cover_credit && (
                  <span>
                    Photo:{" "}
                    {post.cover_credit.authorUrl ? (
                      <a href={post.cover_credit.authorUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">{post.cover_credit.author}</a>
                    ) : (
                      post.cover_credit.author
                    )}{" "}
                    /{" "}
                    <a href={post.cover_credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-foreground">{post.cover_credit.license}</a>
                    , via{" "}
                    <a href={post.cover_credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Wikimedia Commons</a>
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                <Tag className="h-2.5 w-2.5" />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-[1.1] tracking-[-0.018em] mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(post.created_at)}</span>
          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>

        {/* Content */}
        <div
          className="prose prose-slate max-w-none
            prose-headings:font-serif prose-headings:text-foreground
            prose-p:text-foreground/85 prose-p:leading-relaxed
            prose-a:text-primary prose-a:underline-offset-2
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[hsl(222_47%_11%)] prose-pre:text-white/90
            prose-img:rounded-xl prose-img:w-full prose-img:mb-2
            [&_p:has(>img)+p>em]:text-xs [&_p:has(>img)+p>em]:text-muted-foreground [&_p:has(>img)+p>em]:not-italic
            prose-strong:text-foreground
            prose-ul:text-foreground/85 prose-ol:text-foreground/85
            prose-hr:border-border"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Share footer */}
        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <a href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            All posts
          </a>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share this post
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
