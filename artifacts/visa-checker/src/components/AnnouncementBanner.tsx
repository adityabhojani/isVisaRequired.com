import { useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle2, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SiteSettings {
  announcement_enabled: string;
  announcement_text: string;
  announcement_type: string;
}

const DISMISSED_KEY = "announcement_dismissed_v";

const typeConfig = {
  info:    { bg: "bg-blue-50 border-blue-200",    text: "text-blue-900",   icon: Info,          iconColor: "text-blue-500"  },
  warning: { bg: "bg-amber-50 border-amber-200",  text: "text-amber-900",  icon: AlertTriangle, iconColor: "text-amber-500" },
  success: { bg: "bg-green-50 border-green-200",  text: "text-green-900",  icon: CheckCircle2,  iconColor: "text-green-500" },
  promo:   { bg: "bg-primary/8 border-primary/20",text: "text-foreground", icon: Megaphone,     iconColor: "text-primary"   },
};

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/site/settings");
      if (!res.ok) return null;
      return res.json() as Promise<{ settings: SiteSettings }>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const settings = data?.settings;
  const text = settings?.announcement_text ?? "";
  const enabled = settings?.announcement_enabled === "true";
  const type = (settings?.announcement_type ?? "info") as keyof typeof typeConfig;

  useEffect(() => {
    if (!text) return;
    const key = DISMISSED_KEY + btoa(text).slice(0, 12);
    if (localStorage.getItem(key) === "1") setDismissed(true);
  }, [text]);

  if (!enabled || !text || dismissed) return null;

  const cfg = typeConfig[type] ?? typeConfig.info;
  const Icon = cfg.icon;

  const dismiss = () => {
    setDismissed(true);
    const key = DISMISSED_KEY + btoa(text).slice(0, 12);
    localStorage.setItem(key, "1");
  };

  return (
    <div className={`border-b ${cfg.bg} ${cfg.text} relative`} role="banner">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2.5">
        <Icon className={`h-4 w-4 flex-shrink-0 ${cfg.iconColor}`} />
        <p className="text-sm flex-1 leading-snug font-medium">{text}</p>
        <button
          onClick={dismiss}
          className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors ${cfg.text}`}
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
