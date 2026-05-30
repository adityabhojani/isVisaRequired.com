import { Header } from "@/components/Header";
import { Globe } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
          <Globe className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-6">This page couldn't be found.</p>
        <a href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          ← Back to Visa Checker
        </a>
      </div>
    </div>
  );
}
