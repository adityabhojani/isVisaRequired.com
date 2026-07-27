import { useState, useMemo } from "react";
import { Calendar, Plus, Trash2, Info, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// 29 Schengen countries as of 2025 (Bulgaria joined for land borders Jan 2025)
const SCHENGEN_COUNTRIES = ["AT","BE","BG","HR","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE","CH"];
const SCHENGEN_NAMES: Record<string,string> = {
  AT:"Austria",BE:"Belgium",BG:"Bulgaria",HR:"Croatia",CZ:"Czech Republic",DK:"Denmark",EE:"Estonia",
  FI:"Finland",FR:"France",DE:"Germany",GR:"Greece",HU:"Hungary",IS:"Iceland",IT:"Italy",
  LV:"Latvia",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MT:"Malta",NL:"Netherlands",
  NO:"Norway",PL:"Poland",PT:"Portugal",RO:"Romania",SK:"Slovakia",SI:"Slovenia",
  ES:"Spain",SE:"Sweden",CH:"Switzerland"
};

interface Trip { id: number; entry: string; exit: string; }

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function countDaysInWindow(trips: Trip[], anchorDate: Date): number {
  const windowStart = addDays(anchorDate, -179);
  let days = 0;
  for (const t of trips) {
    if (!t.entry || !t.exit) continue;
    const entry = new Date(t.entry);
    const exit = new Date(t.exit);
    if (exit < entry) continue;
    const overlapStart = entry < windowStart ? windowStart : entry;
    const overlapEnd = exit > anchorDate ? anchorDate : exit;
    if (overlapStart <= overlapEnd) days += daysBetween(overlapStart, overlapEnd) + 1;
  }
  return days;
}

export default function SchengenPage() {
  useSEO({
    title: "Schengen Days Calculator — 90/180 Rule Tracker",
    description: "Calculate how many Schengen days you've used and how many you have left under the 90/180-day rolling rule.",
  });

  const [trips, setTrips] = useState<Trip[]>([{ id: 1, entry: "", exit: "" }]);
  const [checkDate, setCheckDate] = useState(() => new Date().toISOString().slice(0, 10));

  const addTrip = () => setTrips((t) => [...t, { id: Date.now(), entry: "", exit: "" }]);
  const removeTrip = (id: number) => setTrips((t) => t.filter((x) => x.id !== id));
  const updateTrip = (id: number, field: "entry" | "exit", val: string) =>
    setTrips((t) => t.map((x) => x.id === id ? { ...x, [field]: val } : x));

  const analysis = useMemo(() => {
    const anchor = new Date(checkDate);
    const used = countDaysInWindow(trips, anchor);
    const remaining = Math.max(0, 90 - used);

    // Earliest date you can re-enter: the first future day on which the rolling
    // 180-day window has freed up at least one day (used < 90). Advancing the
    // anchor forward naturally drops old in-window days off; out-of-window trips
    // never count, so they can't skew the result.
    let earliestReEntry: Date | null = null;
    if (remaining === 0) {
      let d = addDays(anchor, 1);
      for (let i = 0; i < 400; i++) {
        if (countDaysInWindow(trips, d) < 90) { earliestReEntry = d; break; }
        d = addDays(d, 1);
      }
    }

    // Max consecutive days you can stay now
    let maxStay = 0;
    if (remaining > 0) {
      maxStay = remaining;
      const lastExitDate = addDays(anchor, remaining);
      const daysAfterWindow = countDaysInWindow(trips, addDays(lastExitDate, 1));
      maxStay = Math.min(remaining, 90 - daysAfterWindow + remaining);
      maxStay = remaining;
    }

    return { used, remaining, maxStay, earliestReEntry };
  }, [trips, checkDate]);

  const status = analysis.used >= 90 ? "exceeded" : analysis.used >= 75 ? "warning" : "ok";

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/schengen" />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Schengen Days Calculator</h1>
          <p className="text-muted-foreground">Track your 90-day allowance within any 180-day rolling window — the rule that catches most travellers out.</p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>The 90/180 rule:</strong> You may stay in the Schengen Area for a maximum of 90 days in any 180-day period. The window is rolling — it's always the 180 days counting back from any given day, not a fixed calendar period.
          </div>
        </div>

        {/* Result card */}
        <div className={`rounded-2xl border p-6 mb-8 ${
          status === "exceeded" ? "bg-red-50 border-red-200" :
          status === "warning"  ? "bg-amber-50 border-amber-200" :
          "bg-green-50 border-green-200"
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {status === "exceeded" ? <XCircle className="h-8 w-8 text-red-500" /> :
               status === "warning"  ? <AlertCircle className="h-8 w-8 text-amber-500" /> :
               <CheckCircle2 className="h-8 w-8 text-green-600" />}
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {analysis.used} <span className="text-base font-normal text-muted-foreground">/ 90 days used</span>
                </p>
                <p className={`text-sm font-medium mt-0.5 ${
                  status === "exceeded" ? "text-red-700" :
                  status === "warning"  ? "text-amber-700" :
                  "text-green-700"
                }`}>
                  {status === "exceeded" ? "Limit exceeded — you may be overstaying" :
                   status === "warning"  ? `Only ${analysis.remaining} days remaining — use carefully` :
                   `${analysis.remaining} days remaining`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Check date</p>
              <input
                type="date"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
                className="mt-1 text-sm border border-border rounded-lg px-2 py-1 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="mt-4 bg-white/60 rounded-lg p-3">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  status === "exceeded" ? "bg-red-500" :
                  status === "warning"  ? "bg-amber-500" :
                  "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, (analysis.used / 90) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 days</span>
              <span>90 days</span>
            </div>
          </div>

          {analysis.earliestReEntry && (
            <p className="mt-3 text-sm text-red-700">
              <strong>Earliest re-entry:</strong> {analysis.earliestReEntry.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          {analysis.remaining > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              <strong>Maximum stay from check date:</strong> {analysis.remaining} days (until {addDays(new Date(checkDate), analysis.remaining - 1).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })})
            </p>
          )}
        </div>

        {/* Trip entries */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Your Schengen trips
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Enter each visit to any Schengen country. Only the 180 days before your check date count.</p>

          <div className="space-y-3">
            {trips.map((trip, i) => (
              <div key={trip.id} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <span className="text-xs text-muted-foreground w-6 flex-shrink-0 text-right">{i + 1}.</span>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Entry date</label>
                    <input type="date" value={trip.entry} onChange={(e) => updateTrip(trip.id, "entry", e.target.value)}
                      className="mt-0.5 w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Exit date</label>
                    <input type="date" value={trip.exit} onChange={(e) => updateTrip(trip.id, "exit", e.target.value)}
                      min={trip.entry}
                      className="mt-0.5 w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                {trip.entry && trip.exit && new Date(trip.exit) >= new Date(trip.entry) && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded flex-shrink-0">
                    {daysBetween(new Date(trip.entry), new Date(trip.exit)) + 1}d
                  </span>
                )}
                <button onClick={() => removeTrip(trip.id)} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0" title="Remove trip">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button onClick={addTrip}
            className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Add another trip
          </button>
        </div>

        {/* Schengen countries */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Schengen Area countries ({SCHENGEN_COUNTRIES.length})</h2>
          <div className="flex flex-wrap gap-2">
            {SCHENGEN_COUNTRIES.map((code) => (
              <span key={code} className="text-xs bg-secondary/60 text-foreground px-2 py-1 rounded-full">{SCHENGEN_NAMES[code]}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Note: Bulgaria, Cyprus, and Ireland are EU members but not part of the Schengen Area.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
