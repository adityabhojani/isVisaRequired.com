declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;

let gaInitialized = false;
let clarityInitialized = false;

export function initGA(): void {
  if (!GA_ID || gaInitialized) return;
  gaInitialized = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

export function initClarity(): void {
  if (!CLARITY_ID || clarityInitialized) return;
  clarityInitialized = true;

  window.clarity = window.clarity || function (...args: unknown[]) {
    (window.clarity.q = window.clarity.q || []).push(args);
  };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  const first = document.getElementsByTagName("script")[0];
  first.parentNode?.insertBefore(script, first);
}

export function trackPageView(path: string, title?: string): void {
  if (!GA_ID || !window.gtag) return;
  window.gtag("config", GA_ID, {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", action, params ?? {});
}

export const isAnalyticsEnabled = !!GA_ID;
