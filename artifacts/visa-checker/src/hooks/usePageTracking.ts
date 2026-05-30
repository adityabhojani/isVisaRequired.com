import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";

const PAGE_TITLES: Record<string, string> = {
  "/": "Is Visa Required? — Check Visa Requirements",
  "/stats": "Passport Power — Visa Stats",
  "/popular": "Popular Destinations — Visa Requirements",
};

export function usePageTracking(): void {
  const [location] = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[location] ?? document.title;
    trackPageView(location, title);
  }, [location]);
}
