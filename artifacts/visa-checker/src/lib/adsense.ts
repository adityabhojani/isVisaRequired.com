const ADSENSE_ENABLED = import.meta.env.VITE_ADSENSE_ENABLED === "true";
const PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined;

let scriptInjected = false;

export function initAdSense(): void {
  if (!ADSENSE_ENABLED || !PUBLISHER_ID || scriptInjected) return;
  scriptInjected = true;

  const script = document.createElement("script");
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

export const isAdSenseEnabled = ADSENSE_ENABLED && !!PUBLISHER_ID;
