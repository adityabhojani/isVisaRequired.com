import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Country } from "@workspace/api-client-react";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Searchable passport selector shared by the passport tools. `exclude` hides the
// passports already chosen in the other slots, so one can't be picked twice.
export function PassportPicker({ value, onChange, countries, exclude = [], label }: {
  value: string; onChange: (code: string) => void; countries: Country[];
  exclude?: string[]; label: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const filtered = countries.filter((c) => !exclude.includes(c.code));
  const selected = countries.find((c) => c.code === value);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id={id} aria-label={label} variant="outline" role="combobox" className="w-full justify-between h-12 font-normal text-base border-border bg-card">
            {selected ? (
              <span className="flex items-center gap-2">
                <span className="text-xl">{selected.flag}</span>
                <span className="font-medium">{selected.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select passport…</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search countries…" className="h-10" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filtered.map((c) => (
                  <CommandItem key={c.code} value={`${c.name} ${c.code}`}
                    onSelect={() => { onChange(c.code); setOpen(false); }} className="cursor-pointer">
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
  );
}
