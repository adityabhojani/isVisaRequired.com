import { useRef, useState } from "react";
import { Download, Share2, Check, X } from "lucide-react";

interface Props {
  flag: string;
  country: string;
  code: string;
  rank: number;
  total: number;
  visaFree: number;
  visaOnArrival: number;
  eVisa: number;
  visaRequired: number;
  noAdmission: number;
  onClose: () => void;
}

export function PassportPowerCard({ flag, country, code, rank, total, visaFree, visaOnArrival, eVisa, visaRequired, noAdmission, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  const accessible = visaFree + visaOnArrival + eVisa;
  const accessPct = Math.round((accessible / total) * 100);

  const download = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${code.toLowerCase()}-passport-power-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  const share = async () => {
    const text = `🛂 ${country} passport is ranked #${rank} globally with access to ${accessible} countries (${accessPct}% of the world) — check yours at isvisarequired.com`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(`https://isvisarequired.com/passport/${code}`)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`https://isvisarequired.com/passport/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tierLabel = rank <= 10 ? "S" : rank <= 30 ? "A" : rank <= 60 ? "B" : rank <= 100 ? "C" : rank <= 140 ? "D" : "E";
  const tierColor = rank <= 10 ? "bg-amber-400" : rank <= 30 ? "bg-green-500" : rank <= 60 ? "bg-blue-500" : rank <= 100 ? "bg-violet-500" : rank <= 140 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-3xl border border-border shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Actions header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <p className="text-sm font-semibold text-foreground">Passport Power Card</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card preview — this is what gets captured */}
        <div ref={cardRef} className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1d4ed8 100%)" }}>
          <div className="p-6 text-white">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-blue-200 text-xs uppercase tracking-widest font-medium">Passport Power Card</p>
                <p className="text-white/60 text-xs mt-0.5">isvisarequired.com</p>
              </div>
              <div className={`${tierColor} rounded-xl w-10 h-10 flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                {tierLabel}
              </div>
            </div>

            {/* Country */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">{flag}</span>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">{country}</h2>
                <p className="text-blue-200 text-sm">Ranked #{rank} of {total} globally</p>
              </div>
            </div>

            {/* Big number */}
            <div className="bg-white/15 rounded-xl p-4 mb-4 backdrop-blur-sm">
              <p className="text-5xl font-bold text-white">{accessible}</p>
              <p className="text-blue-200 text-sm mt-1">countries accessible without prior embassy visa</p>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${accessPct}%` }} />
              </div>
              <p className="text-blue-200 text-xs mt-1">{accessPct}% of the world</p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-400/20 rounded-xl p-2.5">
                <p className="text-xl font-bold text-green-300">{visaFree}</p>
                <p className="text-green-200 text-xs">Visa Free</p>
              </div>
              <div className="bg-amber-400/20 rounded-xl p-2.5">
                <p className="text-xl font-bold text-amber-300">{visaOnArrival}</p>
                <p className="text-amber-200 text-xs">On Arrival</p>
              </div>
              <div className="bg-blue-400/20 rounded-xl p-2.5">
                <p className="text-xl font-bold text-blue-300">{eVisa}</p>
                <p className="text-blue-200 text-xs">eVisa</p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-blue-300/60 text-xs text-center mt-4">isvisarequired.com · {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-5 space-y-2">
          <button onClick={download} disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
            <Download className="h-4 w-4" />
            {downloading ? "Generating…" : "Download PNG"}
          </button>
          {downloadError && (
            <p className="text-xs text-red-600 text-center mt-1">
              Download failed. Try a different browser or use the share link instead.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={share}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary/50 transition-colors">
              <Share2 className="h-4 w-4" />
              Share on X
            </button>
            <button onClick={copyLink}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary/50 transition-colors">
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
