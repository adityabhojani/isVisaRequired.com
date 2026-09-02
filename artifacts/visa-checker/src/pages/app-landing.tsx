import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Smartphone, Globe, Clock, Shield, Star,
  CheckCircle2, ArrowRight, Zap, BookMarked,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant visa answers",
    description: "Select your passport and destination — get the requirement in under a second, covering 195 countries.",
  },
  {
    icon: Globe,
    title: "Browse all destinations",
    description: "Explore countries by region with live visa-status colour coding based on your passport — no searching needed.",
  },
  {
    icon: Clock,
    title: "Check history",
    description: "Every lookup is saved locally. Revisit recent results without an account or internet connection.",
  },
  {
    icon: BookMarked,
    title: "Passport power stats",
    description: "See your passport's global rank, tier (S–D), and a full breakdown by visa type — all on one screen.",
  },
  {
    icon: Shield,
    title: "Full entry details",
    description: "Fee, processing time, required documents, step-by-step process, and official visa portal links.",
  },
  {
    icon: Star,
    title: "Top attractions",
    description: "Each destination page includes must-see spots, capital, currency, language, and best time to visit.",
  },
];

const screens = [
  { label: "Check", emoji: "🔍", description: "Visa check with passport stats" },
  { label: "Explore", emoji: "🌍", description: "Browse 195 countries with visa status" },
  { label: "History", emoji: "🕐", description: "Recent lookups saved offline" },
  { label: "Passport", emoji: "🛂", description: "Power card, rank & tier" },
];

export default function AppLandingPage() {
  useSEO({
    title: "Is Visa Required? — iOS App | Visa Checker for iPhone",
    description: "Download the Is Visa Required? iOS app. Check visa requirements for 195 countries instantly on your iPhone. Free, no sign-up needed.",
    canonical: "https://www.isvisarequired.com/app",
  });

  const expoUrl = `exp://${import.meta.env.VITE_REPLIT_EXPO_DEV_DOMAIN ?? ""}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(expoUrl)}&color=0A2FA1&bgcolor=F7F9FC&qzone=2`;

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/app" />

      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/8 via-primary/4 to-transparent border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/12 text-primary rounded-full px-3.5 py-1 text-xs font-semibold mb-4 border border-primary/20 shadow-sm">
            <Smartphone className="h-3 w-3" />
            Available for iOS &amp; Android
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            Visa checker in your pocket
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The full power of isvisarequired.com — optimised for mobile. Check visa requirements, explore destinations, and track your passport power, all offline-ready.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              disabled
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-foreground text-background font-semibold text-sm opacity-60 cursor-not-allowed"
              title="Coming soon to App Store"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store — Coming Soon
            </button>
            <button
              disabled
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm opacity-60 cursor-not-allowed"
              title="Coming soon to Google Play"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.17.65.19.97.07l12.44-7.2-2.97-2.97-10.44 10.1zm-1.39-20.9C1.5 3.2 1.33 3.62 1.33 4.1v15.8c0 .48.17.9.46 1.24l.07.06 8.84-8.84v-.21L1.86 3.1l-.07.06zm17.49 8.14l-2.55-1.47-3.17 3.18 3.17 3.17 2.56-1.48c.73-.42.73-1.97-.01-2.4zm-15.6 11.19L15.92 14.9l-2.97-2.97L3.68 22.19z"/>
              </svg>
              Google Play — Coming Soon
            </button>
          </div>

          {/* Try in browser */}
          <div className="mt-5">
            <a
              href="/visa-app"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              Try the web preview now
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Screen previews */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary text-center mb-6">4 tabs — everything you need</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {screens.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
              <div className="text-4xl mb-3">{s.emoji}</div>
              <div className="font-semibold text-foreground text-base mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{s.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary text-center mb-2">Features</p>
        <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-10">Everything a traveller needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR / Dev preview section */}
      {import.meta.env.DEV && import.meta.env.VITE_REPLIT_EXPO_DEV_DOMAIN && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="flex-shrink-0">
              <img
                src={qrApi}
                alt="Scan QR code with Expo Go"
                className="w-44 h-44 rounded-xl border border-border shadow-sm"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 rounded-full px-3 py-1 text-xs font-semibold mb-3 border border-amber-500/20">
                Development Preview
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Try it on your phone now</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Scan with the <strong>Expo Go</strong> app (iOS / Android) or the iPhone Camera app to run the native version instantly — no App Store needed.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {[
                  "Install Expo Go from the App Store or Google Play",
                  "Open the Camera app and point it at the QR code",
                  "Tap the notification to open the app",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free + no account needed */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Free, no sign-up needed</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Visa data for all 195 countries. No account required — just open the app and check. History is saved locally on your device.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
