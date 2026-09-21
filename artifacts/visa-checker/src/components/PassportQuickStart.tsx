// One-tap starting points for pages that need a passport before they can show
// anything. /discover and /stats used to answer "no passport yet" with a big
// icon and the words "Select your passport" — the whole page was an instruction
// to use a dropdown already on screen. Now it's twelve buttons that start it.
//
// Titled "Start with a passport", never "most popular": we have no traffic data
// that would support a popularity claim. These are the passports with an
// editorial roundup guide behind them (guidesData.ts). Shared with the homepage.

export const START_PASSPORTS = [
  { code: "IN", name: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "NG", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "PK", name: "Pakistan", flag: "\u{1F1F5}\u{1F1F0}" },
  { code: "PH", name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "BD", name: "Bangladesh", flag: "\u{1F1E7}\u{1F1E9}" },
  { code: "KE", name: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "VN", name: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "ID", name: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "EG", name: "Egypt", flag: "\u{1F1EA}\u{1F1EC}" },
  { code: "CN", name: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "TR", name: "Türkiye", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "ZA", name: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
] as const;

export function PassportQuickStart({ onPick, blurb }: { onPick: (code: string) => void; blurb: string }) {
  return (
    <section className="py-10 sm:py-14 text-center" aria-labelledby="quickstart-heading">
      <h2 id="quickstart-heading" className="text-lg font-semibold text-foreground">Start with a passport</h2>
      <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        {START_PASSPORTS.map((p) => (
          <button
            key={p.code}
            type="button"
            onClick={() => onPick(p.code)}
            className="h-11 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-secondary/60 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden="true">{p.flag}</span>
            {p.name}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">Or choose any of the 195 passports above.</p>
    </section>
  );
}
