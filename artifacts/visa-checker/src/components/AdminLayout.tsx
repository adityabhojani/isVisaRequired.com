import { useState } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { UserButton } from "@clerk/react";
import {
  LayoutDashboard, FileText, Settings, Globe, Menu, X,
  ChevronRight, LogOut, Mail,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/blog",         label: "Blog Posts",   icon: FileText        },
  { href: "/admin/newsletter",   label: "Newsletter",   icon: Mail            },
  { href: "/admin/settings",     label: "Settings",     icon: Settings        },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  activeHref: string;
}

export function AdminLayout({ children, title, activeHref }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin } = useAdminCheck();

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Globe className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-foreground leading-tight">Admin Panel</div>
            <div className="text-xs text-muted-foreground">isvisarequired.com</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">Management</p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = activeHref === href;
            return (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </a>
            );
          })}

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">Quick Links</p>
            <a href="/" target="_blank" rel="noopener"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors mb-0.5">
              <Globe className="h-4 w-4 flex-shrink-0" />
              View Site
            </a>
            <a href="/blog" target="_blank" rel="noopener"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              <FileText className="h-4 w-4 flex-shrink-0" />
              View Blog
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border flex items-center justify-between">
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <LogOut className="h-3 w-3" />
            Exit
          </a>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center gap-3 px-4 md:px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="font-semibold text-foreground text-lg">{title}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
