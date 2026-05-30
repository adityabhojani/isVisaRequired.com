import { useState } from "react";
import { Globe, ChevronDown, Menu, X, LogIn, ShieldCheck } from "lucide-react";
import { useUser, UserButton } from "@clerk/react";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface NavItem {
  href: string;
  label: string;
  active?: boolean;
  hideOnMobile?: boolean;
}

interface HeaderProps {
  activeHref?: string;
  items?: NavItem[];
  extra?: React.ReactNode;
}

const DEFAULT_ITEMS: NavItem[] = [
  { href: "/", label: "Check Visa" },
  { href: "/compare", label: "Compare", hideOnMobile: true },
  { href: "/discover", label: "Discover", hideOnMobile: true },
  { href: "/stats", label: "Passports", hideOnMobile: true },
  { href: "/blog", label: "Blog", hideOnMobile: true },
];

const MORE_ITEMS: NavItem[] = [
  { href: "/schengen", label: "Schengen Calculator" },
  { href: "/tier-list", label: "Passport Tier List" },
  { href: "/map", label: "World Visa Map" },
  { href: "/trip-planner", label: "Trip Planner" },
  { href: "/digital-nomad", label: "Digital Nomad Visas" },
  { href: "/reciprocity", label: "Visa Reciprocity" },
  { href: "/my-travels", label: "My Travels" },
  { href: "/alerts", label: "Visa Alerts" },
  { href: "/popular", label: "Popular Routes" },
];

export function Header({ activeHref = "/", items = DEFAULT_ITEMS, extra }: HeaderProps) {
  const { user, isLoaded } = useUser();
  const { isAdmin } = useAdminCheck();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allNavItems = [...items, ...MORE_ITEMS];
  const isMoreActive = MORE_ITEMS.some((i) => i.href === activeHref);

  return (
    <header className="border-b border-border/70 bg-card/85 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <a href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Globe className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-serif font-bold text-lg text-foreground">isvisarequired</span>
            <span className="text-muted-foreground text-sm hidden sm:inline">.com</span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {items.map(({ href, label }) => {
            const isActive = activeHref === href;
            return (
              <a
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {label}
              </a>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isMoreActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              More
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                <div className="absolute left-0 mt-1.5 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[200px]">
                  {MORE_ITEMS.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                        activeHref === href
                          ? "text-primary bg-primary/5 font-medium"
                          : "text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          {extra}
          {isAdmin && (
            <a
              href="/admin"
              title="Admin Panel"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeHref.startsWith("/admin")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </a>
          )}
          {isLoaded && (
            user ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            ) : (
              <a
                href="/sign-in"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </a>
            )
          )}
          <button
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1">
            {allNavItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeHref === href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {label}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeHref.startsWith("/admin") ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Panel
              </a>
            )}
            {isLoaded && !user && (
              <a
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg text-primary hover:bg-primary/5 transition-colors mt-1 border-t border-border pt-3"
              >
                <LogIn className="h-4 w-4" />
                Sign in to save your travels
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string; }) {
  return (
    <div className="text-center mb-8">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">{eyebrow}</p>}
      <h1 className="font-serif text-4xl font-bold text-foreground mb-3 leading-tight tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">{description}</p>}
    </div>
  );
}
