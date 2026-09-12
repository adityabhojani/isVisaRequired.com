import { useEffect, useMemo, useRef, useState } from "react";
import { Layers, Plus, X } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header, PageHero } from "@/components/Header";
import { PassportPicker } from "@/components/PassportPicker";
import { Button } from "@/components/ui/button";
import { useListCountries, useCheckVisaAll, getCheckVisaAllQueryKey } from "@workspace/api-client-react";
import type { Country, VisaResult } from "@workspace/api-client-react";
import { reqConfig, requirementOrder } from "@/lib/requirement";
import { combinePassports } from "@/lib/dualCitizenship";
import { slugify } from "@/lib/slug";
import { trackEvent } from "@/lib/analytics";

const MAX_PASSPORTS = 3;
const SLOT_LABELS = ["First passport", "Second passport", "Third passport"];
const GUIDE = "/guides/which-passport-to-use-dual-citizenship";

// Countries that require their own citizens to travel on their own passport,
// exactly as sourced in the dual-nationality guide. For every other nationality
// the page says to check that country's own rules rather than guess.
const OWN_PASSPORT_RULES: Record<string, string> = {
  US: "US law requires US citizens to enter and leave the United States on a valid US passport, subject to narrow exceptions.",
  AU: "Australian citizens who hold another nationality are required to enter and depart Australia on their Australian passport.",
  CA: "Canadian citizens, including dual citizens, need a valid Canadian passport to fly to Canada; Canadian-American dual citizens may fly on a valid US passport instead.",
};

function initialSlots(): string[] {
  const codes = (new URLSearchParams(window.location.search).get("p") ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => /^[A-Z]{2}$/.test(s));
  const slots = [...new Set(codes)].slice(0, MAX_PASSPORTS);
  while (slots.length < 2) slots.push("");
  return slots;
}

export default function DualCitizenshipPage() {
  const [slots, setSlots] = useState<string[]>(initialSlots);
  const { data: countries = [] } = useListCountries();
  const byCode = useMemo(() => new Map(countries.map((c) => [c.code, c])), [countries]);
  const nameOf = (code: string) => byCode.get(code)?.name ?? code;
  const flagOf = (code: string) => byCode.get(code)?.flag ?? "";

  // Hooks can't be called in a loop, so there is one per slot; empty slots stay disabled.
  const p0 = slots[0] ?? "", p1 = slots[1] ?? "", p2 = slots[2] ?? "";
  const q0 = useCheckVisaAll({ passport: p0 }, { query: { enabled: !!p0, queryKey: getCheckVisaAllQueryKey({ passport: p0 }) } });
  const q1 = useCheckVisaAll({ passport: p1 }, { query: { enabled: !!p1, queryKey: getCheckVisaAllQueryKey({ passport: p1 }) } });
  const q2 = useCheckVisaAll({ passport: p2 }, { query: { enabled: !!p2, queryKey: getCheckVisaAllQueryKey({ passport: p2 }) } });

  // ?p= is validated by shape only, so an unknown code (e.g. "UK", which the
  // dataset spells GB) has to be dropped once the country list has loaded —
  // otherwise its request 400s and the page waits on data that never arrives.
  useEffect(() => {
    if (!countries.length) return;
    setSlots((s) => (s.some((c) => c && !byCode.has(c)) ? s.map((c) => (c && !byCode.has(c) ? "" : c)) : s));
  }, [countries.length, byCode]);

  const held = slots.filter(Boolean);
  const heldKey = held.join(",");
  const perSlot = [{ code: p0, q: q0 }, { code: p1, q: q1 }, { code: p2, q: q2 }].filter((s) => s.code);
  const loading = perSlot.some((s) => s.q.isLoading);
  const failed = perSlot.filter((s) => s.q.isError).map((s) => s.code);

  const analysis = useMemo(() => {
    if (held.length < 2) return null;
    const results = new Map<string, VisaResult[]>();
    for (const s of perSlot) {
      const data = s.q.data as VisaResult[] | undefined;
      if (!data?.length) return null; // still loading, or failed
      results.set(s.code, data);
    }
    return combinePassports(held, results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heldKey, q0.data, q1.data, q2.data]);

  useEffect(() => {
    // Keep every other query parameter (utm_*, gclid, ref) and the hash: analytics
    // scripts load after this runs and would otherwise see a stripped URL.
    const params = new URLSearchParams(window.location.search);
    params.delete("p");
    const rest = params.toString();
    const query = heldKey ? `?p=${heldKey}${rest ? `&${rest}` : ""}` : rest ? `?${rest}` : "";
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query}${window.location.hash}`);
  }, [heldKey]);

  const tracked = useRef("");
  useEffect(() => {
    if (!analysis || tracked.current === heldKey) return;
    tracked.current = heldKey;
    trackEvent("dual_citizenship_check", { passports: heldKey, combined: String(analysis.combined), gain: String(analysis.gain) });
  }, [analysis, heldKey]);

  const named = held.length >= 2 && held.every((c) => byCode.has(c));
  const heldNames = held.map(nameOf);
  useSEO({
    title: named
      ? `${heldNames.join(" + ")} Dual Citizenship — Combined Visa-Free Access | Is Visa Required?`
      : "Dual Citizenship Visa Checker — Combine Your Passports | Is Visa Required?",
    description: named
      ? `Where ${heldNames.join(" and ")} dual citizens can travel without an embassy visa using any of their passports, and which passport to use for each country.`
      : "Hold two or three passports? See the easiest entry any of them gets for every country, which passport to travel on, and where your second passport adds access.",
    canonical: "https://www.isvisarequired.com/dual-citizenship",
  });

  const setSlot = (i: number, code: string) => setSlots((s) => s.map((v, j) => (j === i ? code : v)));
  const addSlot = () => setSlots((s) => (s.length < MAX_PASSPORTS ? [...s, ""] : s));
  const clearSlot = (i: number) =>
    setSlots((s) => (s.length > 2 ? s.filter((_, j) => j !== i) : s.map((v, j) => (j === i ? "" : v))));
  const pairHref = (code: string, dest: Country) => `/visa-requirements/${slugify(nameOf(code))}/${slugify(dest.name)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/dual-citizenship" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <PageHero
          title="Dual Citizenship Visa Checker"
          description="Enter every passport you hold. See the easiest way into each country, and which passport to travel on."
        />

        <div className="bg-card rounded-2xl border border-border/70 shadow-sm ring-1 ring-[rgb(15_23_41/0.06)] p-6 mb-8">
          <div className={`grid grid-cols-1 gap-4 ${slots.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {slots.map((code, i) => (
              <div key={i} className="relative">
                <PassportPicker
                  value={code}
                  onChange={(c) => setSlot(i, c)}
                  countries={countries}
                  exclude={slots.filter((_, j) => j !== i)}
                  label={SLOT_LABELS[i]}
                />
                {(slots.length > 2 || code) && (
                  <button
                    type="button"
                    onClick={() => clearSlot(i)}
                    aria-label={code ? `Remove ${nameOf(code)}` : "Remove this passport"}
                    className="absolute -top-1 right-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {slots.length < MAX_PASSPORTS && (
            <Button type="button" variant="ghost" onClick={addSlot} className="mt-3 px-2 text-sm text-primary">
              <Plus className="mr-1.5 h-4 w-4" /> Add a third passport
            </Button>
          )}
        </div>

        {failed.length > 0 && (
          <div role="alert" className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Couldn't load visa data for {failed.map(nameOf).join(" and ")}. Refresh the page to try again.
          </div>
        )}

        {held.length >= 2 && loading && (
          <div className="py-12 text-center text-muted-foreground">
            <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="mt-3 text-sm">Loading visa data…</p>
          </div>
        )}

        {held.length < 2 && (
          <div className="py-16 text-center text-muted-foreground">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/8">
              <Layers className="h-10 w-10 text-primary/40" />
            </div>
            <p className="mb-1 text-lg font-semibold text-foreground">Choose at least two passports</p>
            <p className="text-sm">We'll combine them country by country.</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-10">
            <section className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">With all your passports</p>
                <p className="mt-2 text-4xl font-bold tabular-nums text-foreground">{analysis.combined}</p>
                <p className="text-sm text-muted-foreground">countries without an embassy visa</p>
                <p className="mt-3 text-sm text-foreground">
                  {analysis.gain > 0 ? (
                    <>That's <strong>{analysis.gain} more</strong> than your strongest passport on its own.</>
                  ) : (
                    <>Your strongest passport already covers every one of them.</>
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Each passport on its own</p>
                <ul className="mt-3 space-y-2">
                  {analysis.single.map((s) => (
                    <li key={s.code} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2"><span className="text-lg">{flagOf(s.code)}</span>{nameOf(s.code)}</span>
                      <span className="font-semibold tabular-nums">{s.count}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Out of the {analysis.rows.length} countries that aren't yours: visa-free, visa on arrival or eVisa.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-lg font-bold text-foreground">The easiest entry you get, country by country</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {requirementOrder.map((req) => {
                  const cfg = reqConfig[req];
                  const Icon = cfg.icon;
                  return (
                    <div key={req} className={`rounded-xl border p-3 ${cfg.border} ${cfg.bg}`}>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                        <Icon className="h-3.5 w-3.5" />{cfg.label}
                      </div>
                      <div className="mt-1 text-2xl font-bold tabular-nums text-foreground">{analysis.breakdown[req]}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-1 font-serif text-lg font-bold text-foreground">Which passport to travel on</h2>
              <p className="mb-5 text-sm text-muted-foreground">
                {analysis.decisiveCount === 0
                  ? "All your passports get the same entry everywhere, so any of them will do."
                  : `${analysis.decisiveCount} ${analysis.decisiveCount === 1 ? "country treats" : "countries treat"} your passports differently. For the other ${analysis.rows.length - analysis.decisiveCount}, any of them gets the same entry.`}
              </p>
              {analysis.groups.map(([key, rows]) => {
                const codes = key.split(",");
                return (
                  <div key={key} className="mb-6">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span className="text-lg">{codes.map(flagOf).join(" ")}</span>
                      Use your {codes.map(nameOf).join(" or ")} passport
                      <span className="font-normal text-muted-foreground">· {rows.length}</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {rows.map((row) => {
                        const cfg = reqConfig[row.best];
                        const others = row.options.filter((o) => !row.bestCodes.includes(o.code));
                        return (
                          <a
                            key={row.country.code}
                            href={pairHref(row.bestCodes[0], row.country)}
                            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 transition-colors hover:bg-muted/40"
                          >
                            <span className="text-2xl">{row.country.flag}</span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold text-foreground">{row.country.name}</div>
                              <div className="mt-0.5 text-xs">
                                <span className={`font-medium ${cfg.color}`}>{cfg.label}</span>
                                <span className="text-muted-foreground">
                                  {" · "}{others.map((o) => `${nameOf(o.code)}: ${reqConfig[o.requirement].short.toLowerCase()}`).join(", ")}
                                </span>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>

            {[
              { rows: analysis.stillNeedVisa, title: "Still a visa with every passport", note: (n: number) => `${n} ${n === 1 ? "country needs" : "countries need"} an embassy visa whichever passport you use.` },
              { rows: analysis.noEntry, title: "No entry on any of your passports", note: (n: number) => `${n} ${n === 1 ? "country does" : "countries do"} not admit holders of any passport you hold.` },
            ].filter((s) => s.rows.length > 0).map((section) => (
              <section key={section.title}>
                <h2 className="mb-1 font-serif text-lg font-bold text-foreground">{section.title}</h2>
                <p className="mb-3 text-sm text-muted-foreground">{section.note(section.rows.length)}</p>
                <div className="flex flex-wrap gap-2">
                  {section.rows.map((row) => {
                    const cfg = reqConfig[row.best];
                    return (
                      <a
                        key={row.country.code}
                        href={pairHref(row.bestCodes[0], row.country)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}
                      >
                        {row.country.flag} {row.country.name}
                        <span className="opacity-70">· {cfg.short}</span>
                      </a>
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="font-serif text-lg font-bold text-foreground">Travelling to one of your own countries</h2>
              <p className="mt-1 text-sm text-muted-foreground">Enter a country you're a citizen of on that country's passport.</p>
              <ul className="mt-4 space-y-3">
                {held.map((code) => (
                  <li key={code} className="flex gap-3 text-sm">
                    <span className="text-xl leading-none">{flagOf(code)}</span>
                    <span>
                      <strong className="text-foreground">{nameOf(code)}.</strong>{" "}
                      <span className="text-muted-foreground">
                        {OWN_PASSPORT_RULES[code] ?? `Check ${nameOf(code)}'s own immigration authority on whether its citizens must use its passport.`}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <a href={GUIDE} className="font-medium text-primary hover:underline">Which passport to use at booking, check-in and the border →</a>
              </p>
            </section>

            <p className="text-xs text-muted-foreground">
              Based on nationality alone. Permitted stay, passport validity and other entry conditions still apply to each trip — open any country for its full rules.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
