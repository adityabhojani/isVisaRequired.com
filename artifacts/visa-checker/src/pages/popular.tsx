import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header, PageHero } from "@/components/Header";
import { useGetPopularDestinations, useListCountries, useCheckVisaMultiple, getGetPopularDestinationsQueryKey } from "@workspace/api-client-react";
import type { Country, VisaResult } from "@workspace/api-client-react";
import { Globe, ChevronDown, CheckCircle2, AlertCircle, Clock, XCircle, Shield } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { VisaRequirement } from "@workspace/api-client-react";

const requirementConfig: Record<VisaRequirement, {
  label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2;
}> = {
  visa_free:       { label: "Visa Free",      color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: CheckCircle2 },
  visa_on_arrival: { label: "Visa on Arrival", color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock },
  e_visa:          { label: "eVisa",           color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   icon: Shield },
  visa_required:   { label: "Visa Required",   color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: AlertCircle },
  no_admission:    { label: "No Admission",    color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: XCircle },
};

export default function PopularPage() {
  useSEO({
    title: "Visa Requirements for Popular Travel Destinations | Is Visa Required?",
    description: "Check visa requirements for the world's most visited countries — France, Japan, USA, Thailand, UK, Italy, and more. Instant results for any passport.",
    canonical: "https://www.isvisarequired.com/popular",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.isvisarequired.com/" },
          { "@type": "ListItem", "position": 2, "name": "Popular Destinations", "item": "https://www.isvisarequired.com/popular" }
        ]
      },
    ],
  });

  const [passport, setPassport] = useState("");
  const [open, setOpen] = useState(false);

  const { data: countries = [], isLoading: countriesLoading } = useListCountries();
  const { data: popularDests = [], isLoading: popularLoading } = useGetPopularDestinations({
    query: { queryKey: getGetPopularDestinationsQueryKey() }
  });

  const checkMutation = useCheckVisaMultiple();
  const [results, setResults] = useState<Record<string, VisaResult>>({});

  const selected = countries.find((c: Country) => c.code === passport);

  const handleCheck = (passportCode: string) => {
    if (!popularDests.length) return;
    checkMutation.mutate(
      { data: { passport: passportCode, destinations: popularDests.map((d: Country) => d.code) } },
      {
        onSuccess: (data: VisaResult[]) => {
          const map: Record<string, VisaResult> = {};
          data.forEach((r: VisaResult) => { map[r.destinationCountry.code] = r; });
          setResults(map);
        },
      }
    );
  };

  const handlePassportChange = (code: string) => {
    setPassport(code);
    setResults({});
    handleCheck(code);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeHref="/discover" />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <PageHero
          title="Popular Destinations"
          description="Check visa requirements for the world's top travel destinations"
        />

        {/* Passport selector */}
        <div className="max-w-sm mx-auto mb-10">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-12 text-left font-normal text-base"
                data-testid="input-passport-popular"
              >
                {selected ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{selected.flag}</span>
                    <span className="font-medium">{selected.name}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Select your passport to check access...</span>
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
                    {countries.map((c: Country) => (
                      <CommandItem
                        key={c.code}
                        value={`${c.name} ${c.code}`}
                        onSelect={() => { handlePassportChange(c.code); setOpen(false); }}
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

        {popularLoading && (
          <div className="text-center py-8 text-muted-foreground">Loading destinations...</div>
        )}

        {!popularLoading && popularDests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularDests.map((dest) => {
              const result = results[dest.code];
              const config = result ? requirementConfig[result.requirement] : null;
              const Icon = config?.icon;

              return (
                <div
                  key={dest.code}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${config ? `${config.border}` : "border-border"}`}
                  data-testid={`card-popular-${dest.code}`}
                >
                  <div className={`p-4 ${config ? config.bg : "bg-card"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl leading-none">{dest.flag}</span>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{dest.name}</div>
                          <div className="text-xs text-muted-foreground">{dest.region}</div>
                        </div>
                      </div>
                      {config && Icon && (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color} bg-white/80 border ${config.border} shadow-sm flex-shrink-0`}>
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">{config.label}</span>
                        </div>
                      )}
                    </div>
                    {result?.maxStay && (
                      <div className="text-xs text-muted-foreground mt-2.5 pl-0.5">
                        Max stay: <span className="font-medium text-foreground">{result.maxStay}</span>
                      </div>
                    )}
                    {!passport && (
                      <div className="text-xs text-muted-foreground mt-2.5 pl-0.5">Select your passport above</div>
                    )}
                    {checkMutation.isPending && passport && !result && (
                      <div className="text-xs text-muted-foreground mt-2.5 animate-pulse pl-0.5">Checking…</div>
                    )}
                  </div>
                  <a
                    href={passport ? `/?passport=${passport}&destinations=${dest.code}` : `/destination/${dest.code}`}
                    className={`block px-4 py-2 text-xs font-medium text-primary hover:underline underline-offset-2 transition-colors bg-white/50 border-t ${config ? config.border : "border-border"}`}
                  >
                    View full details →
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <AdSlot slotId="8904521367" size="responsive" className="mt-8" />

        {!passport && !popularLoading && (
          <p className="text-center text-muted-foreground text-sm mt-4">
            Select your passport to see visa requirements for each destination
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
