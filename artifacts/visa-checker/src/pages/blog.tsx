import { useQuery } from "@tanstack/react-query";
import { Header, PageHero } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { Calendar, Tag, User, ArrowRight } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string | null;
  tags: string[];
  author: string;
  created_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPage() {
  useSEO({
    title: "Travel Blog — Visa Tips & Destination Guides | Is Visa Required?",
    description: "Expert visa tips, destination guides, and travel advice. Learn how to navigate visa applications, discover visa-free destinations, and plan smarter trips.",
    canonical: "https://www.isvisarequired.com/blog",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts");
      if (!res.ok) throw new Error("Failed to load posts");
      return res.json() as Promise<{ posts: BlogPost[] }>;
    },
  });

  const posts = data?.posts ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/blog" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <PageHero
          eyebrow="Travel Blog"
          title="Visa Tips & Travel Guides"
          description="Expert advice on navigating visa requirements, discovering new destinations, and travelling smarter."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-muted" />
                <div className="p-5">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-full mb-1" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="font-semibold text-foreground text-lg mb-1">No posts yet</p>
            <p className="text-muted-foreground text-sm">Check back soon for travel tips and destination guides.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {posts[0] && (
              <a
                href={`/blog/${posts[0].slug}`}
                className="block mb-10 group"
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  {posts[0].cover_url ? (
                    <img src={posts[0].cover_url} alt={posts[0].title} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
                      <div className="text-6xl">✈️</div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {posts[0].tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{formatDate(posts[0].created_at)}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {posts[0].title}
                    </h2>
                    {posts[0].excerpt && <p className="text-muted-foreground leading-relaxed mb-4">{posts[0].excerpt}</p>}
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                      Read more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            )}

            {/* Rest of posts */}
            {posts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1).map((post) => (
                  <a key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                      {post.cover_url ? (
                        <img src={post.cover_url} alt={post.title} className="w-full h-44 object-cover" />
                      ) : (
                        <div className="w-full h-44 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                          <span className="text-4xl">🌍</span>
                        </div>
                      )}
                      <div className="p-5">
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium">{tag}</span>
                            ))}
                          </div>
                        )}
                        <h3 className="font-serif font-bold text-foreground text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
