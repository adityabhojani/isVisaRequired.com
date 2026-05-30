import { useState } from "react";
import { Sparkles, X, ArrowRight, RefreshCw } from "lucide-react";
import type { VisaResult } from "@workspace/api-client-react";

interface Props {
  passport: string;
  results: VisaResult[];
}

const FUN_FACTS: Record<string, string> = {
  JP: "Japan has more vending machines per person than any other country — one for every 23 people.",
  FR: "The Eiffel Tower grows about 15 cm taller in summer due to thermal expansion of the iron.",
  IS: "Iceland has no mosquitoes — the climate is simply too cold and unpredictable for them to survive.",
  NZ: "New Zealand was the first country to give women the vote, in 1893.",
  SG: "Singapore is one of only three city-states in the world, and it's one of the greenest cities on Earth.",
  AU: "Australia is wider than the Moon. The continent is about 4,000 km across, the Moon 3,474 km.",
  BR: "Brazil contains the Amazon — the world's largest tropical rainforest, covering more than 5.5 million km² and home to roughly 10% of all species on Earth.",
  MX: "Mexico City is built on a lake — the ancient Aztec capital Tenochtitlán — and it sinks up to 50 cm per year.",
  IN: "India has the world's largest number of vegetarians — about 400 million people.",
  TH: "Thailand has over 40,000 Buddhist temples. White elephants are considered sacred and belong to the king.",
  PT: "Portugal is one of the world's oldest countries — its borders have barely changed since 1139 AD.",
  GR: "Greece has more archaeological museums than any other country in the world.",
  IT: "Italy has more UNESCO World Heritage Sites than any other country — 58 in total.",
  ES: "Spain has the second-highest number of bars per capita in the world, after Cyprus.",
  MA: "Morocco's Fez el-Bali is the world's largest car-free urban area — no cars have entered since the 14th century.",
  PE: "Machu Picchu was built by the Inca in the 15th century and abandoned just 100 years later — it wasn't known to the outside world until 1911 when explorer Hiram Bingham was guided there by locals.",
  MV: "The Maldives is the flattest country on Earth — no land is more than 2.4 metres above sea level.",
  KE: "Kenya is home to the Great Rift Valley, which stretches 9,600 km from Lebanon to Mozambique.",
  TZ: "Kilimanjaro in Tanzania is the world's highest free-standing mountain — you can hike to the top without ropes.",
  VN: "Vietnam is the world's second-largest coffee exporter after Brazil, and also one of the world's top producers and exporters of cashew nuts.",
  GE: "Georgia has been making wine for 8,000 years — longer than any other known wine-producing region.",
  CR: "Costa Rica abolished its military in 1948 — one of the few countries in the world to do so — and redirected that budget to education and healthcare, giving it one of the highest literacy rates in the Americas.",
  UY: "Uruguay was the first country in South America to legalise same-sex marriage and recreational cannabis.",
  CL: "Chile's Atacama Desert is the driest non-polar place on Earth — some weather stations have never recorded rain.",
  ZA: "South Africa has 11 official languages — the most of any country in the world.",
};

const DEFAULT_FACT = "Every destination has a story waiting to be discovered.";

function getVisaLabel(req: string): string {
  switch (req) {
    case "visa_free": return "🟢 Visa Free";
    case "visa_on_arrival": return "🟡 Visa on Arrival";
    case "e_visa": return "🔵 eVisa";
    default: return "";
  }
}

export function MysteryDestination({ passport, results }: Props) {
  const eligible = results.filter(
    (r) => r.requirement === "visa_free" || r.requirement === "visa_on_arrival" || r.requirement === "e_visa"
  );

  const [pick, setPick] = useState<VisaResult | null>(null);
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (eligible.length === 0 || spinning) return;
    setSpinning(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * eligible.length);
      setPick(eligible[idx]);
      setVisible(true);
      setSpinning(false);
    }, 500);
  };

  if (!passport || eligible.length === 0) return null;

  return (
    <>
      <button
        onClick={spin}
        disabled={spinning}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-60"
      >
        {spinning
          ? <RefreshCw className="h-4 w-4 animate-spin" />
          : <Sparkles className="h-4 w-4" />}
        {spinning ? "Picking…" : "Mystery Destination"}
      </button>

      {visible && pick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-3xl border border-border shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white text-center relative">
              <button onClick={() => setVisible(false)}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
              <div className="text-6xl mb-2">{pick.destinationCountry.flag}</div>
              <h2 className="text-2xl font-bold">{pick.destinationCountry.name}</h2>
              <div className="mt-2 inline-block bg-white/20 rounded-full px-3 py-1 text-sm">
                {getVisaLabel(pick.requirement)} {pick.maxStay ? `· Up to ${pick.maxStay}` : ""}
              </div>
            </div>

            <div className="p-6">
              <div className="bg-secondary/40 rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{FUN_FACTS[pick.destinationCountry.code] ?? DEFAULT_FACT}"
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={spin}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary/50 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Spin again
                </button>
                <a href={`/?passport=${passport}&destinations=${pick.destinationCountry.code}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <a href={`/destination/${pick.destinationCountry.code}`}
                className="block text-center text-xs text-muted-foreground hover:text-primary mt-3 transition-colors">
                View full country profile →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
