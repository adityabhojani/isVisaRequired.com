import { useEffect, useRef } from "react";

const ADSENSE_ENABLED = import.meta.env.VITE_ADSENSE_ENABLED === "true";
const PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined;

export type AdSlotSize =
  | "leaderboard"
  | "rectangle"
  | "mobile-banner"
  | "responsive";

interface AdSlotProps {
  slotId: string;
  size?: AdSlotSize;
  className?: string;
}

const SIZE_STYLES: Record<AdSlotSize, { width: number | string; height: number }> = {
  leaderboard:    { width: 728,   height: 90  },
  rectangle:      { width: 300,   height: 250 },
  "mobile-banner":{ width: 320,   height: 50  },
  responsive:     { width: "100%", height: 90  },
};

export function AdSlot({ slotId, size = "responsive", className = "" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_ENABLED || !PUBLISHER_ID || !insRef.current) return;
    try {
      (
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []
      ).push({});
    } catch {
    }
  }, []);

  if (!ADSENSE_ENABLED || !PUBLISHER_ID) {
    return null;
  }

  const { width, height } = SIZE_STYLES[size];

  return (
    <div
      className={`ad-slot-wrapper flex items-center justify-center ${className}`}
      style={{ minHeight: height, width }}
      aria-label="Advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width, height }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={size === "responsive" ? "auto" : undefined}
        data-full-width-responsive={size === "responsive" ? "true" : undefined}
      />
    </div>
  );
}
