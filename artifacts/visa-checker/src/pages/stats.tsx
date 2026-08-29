import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header, PageHero } from "@/components/Header";
import { useListCountries, useGetVisaStats, getGetVisaStatsQueryKey } from "@workspace/api-client-react";
import type { Country } from "@workspace/api-client-react";
import { Trophy, ChevronDown } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#16a34a", "#d97706", "#2563eb", "#ea580c", "#dc2626"];
const LABELS = ["Visa Free", "Visa on Arrival", "eVisa", "Visa Required", "No Admission"];

export default function StatsPage() {
  useSEO({
    title: "Passport Power Index – Compare Passport Strength | Is Visa Required?",
    description: "Discover how powerful your passport is. See how many countries you can visit visa-free, on arrival, or with an e-visa. Compare passport rankings for all 199 countries.",
    canonical: "https://www.isvisarequired.com/stats",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.isvisarequired.com/" },
          { "@type": "ListItem", "position": 2, "name": "Passport Power Index", "item": "https://www.isvisarequired.com/stats" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Passport Power Index",
        "description": "Rankings of all 199 passports by the number of countries accessible without a prior visa.",
        "url": "https://www.isvisarequired.com/stats",
        "creator": { "@type": "Organization", "name": "isvisarequired.com", "url": "https://www.isvisarequired.com" },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "isAccessibleForFree": true,
        "keywords": ["passport power", "passport index", "visa free countries", "passport ranking", "travel freedom"]
      }
    ],
  });

  const [passport, setPassport] = useState("");
  const [open, setOpen] = useState(false);

  const { data: countries = [], isLoading: countriesLoading } = useListCountries();

  const { data: stats, isLoading: statsLoading } = useGetVisaStats(
    { passport },
    { query: { enabled: !!passport, queryKey: getGetVisaStatsQueryKey({ passport }) } }
  );

  const selected = countries.find((c: Country) => c.code === passport);

  const chartData = stats
    ? [
        { name: "Visa Free", value: stats.visaFree },
        { name: "Visa on Arrival", value: stats.visaOnArrival },
        { name: "eVisa", value: stats.eVisa },
        { name: "Visa Required", value: stats.visaRequired },
        { name: "No Admission", value: stats.noAdmission },
      ].filter((d) => d.value > 0)
    : [];

  const powerPercent = stats
    ? Math.round(((stats.visaFree + stats.visaOnArrival) / stats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/stats" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <PageHero
          title="Passport Power Index"
          description="See how many countries you can access with your passport"
        />

        {/* Passport selector */}
        <div className="max-w-sm mx-auto mb-10">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-12 text-left font-normal text-base"
                data-testid="input-passport-stats"
              >
                {selected ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{selected.flag}</span>
                    <span className="font-medium">{selected.name}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Select your passport...</span>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
              <Command>
                <CommandInput placeholder="Search countries..." className="h-10" />
                <CommandList>
                  <CommandEmpty>{countriesLoading ? "Loading..." : "No country found."}</CommandEmpty>
                  <CommandGroup>
                    {countries.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={`${c.name} ${c.code}`}
                        onSelect={() => { setPassport(c.code); setOpen(false); }}
                        className="cursor-pointer"
                      >
                        <span className="mr-2 text-lg">{c.flag}</span>
                        <span>{c.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{c.code}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {statsLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="inline-block animate-spin h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full" />
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            {/* Rank + power bar */}
            <Card className="shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/30" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-3xl">{selected?.flag}</span>
                      <span className="font-serif text-2xl font-bold">{selected?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      Rank <strong className="text-foreground">#{stats.powerRank}</strong> of {stats.total} globally
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary">{powerPercent}%</div>
                    <div className="text-xs text-muted-foreground mt-0.5">of countries accessible</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-700"
                    style={{ width: `${powerPercent}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Visa Free",      value: stats.visaFree,       color: "text-green-600",  bg: "bg-green-50  border-green-100"  },
                { label: "Visa on Arrival", value: stats.visaOnArrival, color: "text-amber-600",  bg: "bg-amber-50  border-amber-100"  },
                { label: "eVisa",           value: stats.eVisa,         color: "text-blue-600",   bg: "bg-blue-50   border-blue-100"   },
                { label: "Visa Required",   value: stats.visaRequired,  color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
                { label: "No Admission",    value: stats.noAdmission,   color: "text-red-600",    bg: "bg-red-50    border-red-100"    },
              ].map((stat) => (
                <Card key={stat.label} className={`border ${stat.bg}`} data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pie chart */}
            {chartData.length > 0 && (
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Access Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%" cy="50%"
                        innerRadius={70} outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry) => (
                          <Cell key={entry.name} fill={COLORS[LABELS.indexOf(entry.name)]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} countries`, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <AdSlot slotId="5621034987" size="responsive" className="mt-8" />

        {!passport && !stats && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
              <Trophy className="h-10 w-10 text-amber-400" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">Select your passport</p>
            <p className="text-sm">See its global power rank and access breakdown</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
