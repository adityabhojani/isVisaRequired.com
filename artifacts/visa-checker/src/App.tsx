import { lazy, Suspense, useRef, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, useClerk } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/CookieConsent";
import { ErrorBoundary, PageErrorBoundary } from "@/components/ErrorBoundary";
import { initGA, initClarity } from "@/lib/analytics";
import { initAdSense } from "@/lib/adsense";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { usePageTracking } from "@/hooks/usePageTracking";

const HomePage       = lazy(() => import("@/pages/home"));
const StatsPage      = lazy(() => import("@/pages/stats"));
const PassportsRedirect = () => { window.location.replace("/stats"); return null; };
const PopularPage    = lazy(() => import("@/pages/popular"));
const PrivacyPage    = lazy(() => import("@/pages/privacy"));
const TermsPage      = lazy(() => import("@/pages/terms"));
const ContactPage    = lazy(() => import("@/pages/contact"));
const ComparePage    = lazy(() => import("@/pages/compare"));
const DiscoverPage   = lazy(() => import("@/pages/discover"));
const PassportPage   = lazy(() => import("@/pages/passport"));
const WidgetPage     = lazy(() => import("@/pages/widget"));
const SchengenPage   = lazy(() => import("@/pages/schengen"));
const TierListPage   = lazy(() => import("@/pages/tier-list"));
const MyTravelsPage  = lazy(() => import("@/pages/my-travels"));
const DestinationPage = lazy(() => import("@/pages/destination"));
const SignInPage      = lazy(() => import("@/pages/sign-in"));
const SignUpPage      = lazy(() => import("@/pages/sign-up"));
const BlogPage        = lazy(() => import("@/pages/blog"));
const BlogPostPage    = lazy(() => import("@/pages/blog-post"));
const AdminPage           = lazy(() => import("@/pages/admin/index"));
const AdminBlogList       = lazy(() => import("@/pages/admin/blog-list"));
const AdminBlogEditor     = lazy(() => import("@/pages/admin/blog-editor"));
const AdminSettings       = lazy(() => import("@/pages/admin/settings"));
const AdminNewsletterPage = lazy(() => import("@/pages/admin/newsletter"));
const AdminCorrections    = lazy(() => import("@/pages/admin/corrections"));
const AlertsPage        = lazy(() => import("@/pages/alerts"));
const DigitalNomadPage  = lazy(() => import("@/pages/digital-nomad"));
const ReciprocityPage   = lazy(() => import("@/pages/reciprocity"));
const MapPage           = lazy(() => import("@/pages/map"));
const TripPlannerPage   = lazy(() => import("@/pages/trip-planner"));
const AppLandingPage    = lazy(() => import("@/pages/app-landing"));
const NotFound          = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// Use env var directly — the publishableKeyFromHost internal API is production-only.
// Falls back to the project's Clerk key (publishable keys are public, safe to embed)
// so the app always has a ClerkProvider — Header and other components call useUser()
// unconditionally and crash without one. Override with VITE_CLERK_PUBLISHABLE_KEY in
// the deploy environment to point at a production Clerk instance.
const clerkPubKey =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ||
  "pk_test_ZGFybGluZy1wZWdhc3VzLTQxLmNsZXJrLmFjY291bnRzLmRldiQ";

// Only set proxy URL in production (it's auto-set by the platform, undefined in dev)
const clerkProxyUrl = (import.meta.env.VITE_CLERK_PROXY_URL as string | undefined) || undefined;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk" as const,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#2563eb",
    colorForeground: "#0f172a",
    colorMutedForeground: "#64748b",
    colorDanger: "#ef4444",
    colorBackground: "#f8fafc",
    colorInput: "#ffffff",
    colorInputForeground: "#0f172a",
    colorNeutral: "#e2e8f0",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg border border-slate-200",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-slate-900 font-semibold",
    headerSubtitle: "text-slate-500",
    socialButtonsBlockButtonText: "text-slate-700 font-medium",
    formFieldLabel: "text-slate-700 font-medium text-sm",
    footerActionLink: "text-blue-600 font-medium hover:text-blue-700",
    footerActionText: "text-slate-500",
    dividerText: "text-slate-400",
    identityPreviewEditButton: "text-blue-600",
    formFieldSuccessText: "text-green-600",
    alertText: "text-slate-700",
    logoBox: "flex justify-center",
    logoImage: "h-10 w-10",
    socialButtonsBlockButton: "border border-slate-200 bg-white hover:bg-slate-50",
    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
    formFieldInput: "border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500",
    footerAction: "border-t border-slate-100",
    dividerLine: "bg-slate-200",
    alert: "border border-red-200 bg-red-50",
    otpCodeFieldInput: "border-slate-200",
    formFieldRow: "",
    main: "",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

function wrap(Component: React.LazyExoticComponent<React.ComponentType>) {
  return () => (
    <PageErrorBoundary>
      <Component />
    </PageErrorBoundary>
  );
}

function AppRoutes() {
  usePageTracking();
  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") initGA();
    initClarity();
    initAdSense();
  }, []);

  return (
    <>
      <AnnouncementBanner />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/"                  component={wrap(HomePage)} />
          <Route path="/stats"             component={wrap(StatsPage)} />
          <Route path="/passports"         component={PassportsRedirect} />
          <Route path="/popular"           component={wrap(PopularPage)} />
          <Route path="/compare"           component={wrap(ComparePage)} />
          <Route path="/discover"          component={wrap(DiscoverPage)} />
          <Route path="/passport/:code"    component={wrap(PassportPage)} />
          <Route path="/destination/:code" component={wrap(DestinationPage)} />
          <Route path="/schengen"          component={wrap(SchengenPage)} />
          <Route path="/tier-list"         component={wrap(TierListPage)} />
          <Route path="/my-travels"        component={wrap(MyTravelsPage)} />
          <Route path="/widget"            component={wrap(WidgetPage)} />
          <Route path="/privacy"           component={wrap(PrivacyPage)} />
          <Route path="/terms"             component={wrap(TermsPage)} />
          <Route path="/contact"           component={wrap(ContactPage)} />
          <Route path="/sign-in/*?"        component={wrap(SignInPage)} />
          <Route path="/sign-up/*?"        component={wrap(SignUpPage)} />
          <Route path="/blog"              component={wrap(BlogPage)} />
          <Route path="/blog/:slug"        component={wrap(BlogPostPage)} />
          <Route path="/admin"             component={wrap(AdminPage)} />
          <Route path="/admin/blog"        component={wrap(AdminBlogList)} />
          <Route path="/admin/blog/new"    component={wrap(AdminBlogEditor)} />
          <Route path="/admin/blog/:id"    component={wrap(AdminBlogEditor)} />
          <Route path="/admin/settings"    component={wrap(AdminSettings)} />
          <Route path="/admin/newsletter"  component={wrap(AdminNewsletterPage)} />
          <Route path="/admin/corrections" component={wrap(AdminCorrections)} />
          <Route path="/alerts"            component={wrap(AlertsPage)} />
          <Route path="/digital-nomad"     component={wrap(DigitalNomadPage)} />
          <Route path="/reciprocity"       component={wrap(ReciprocityPage)} />
          <Route path="/map"               component={wrap(MapPage)} />
          <Route path="/trip-planner"      component={wrap(TripPlannerPage)} />
          <Route path="/app"              component={wrap(AppLandingPage)} />
          <Route                           component={wrap(NotFound)} />
        </Switch>
      </Suspense>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  // If no Clerk key available (shouldn't happen but guard anyway), render without auth
  if (!clerkPubKey) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
          <CookieConsent />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to your isvisarequired.com account" } },
        signUp: { start: { title: "Create your account", subtitle: "Track your travels and save your progress" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
          <CookieConsent />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
