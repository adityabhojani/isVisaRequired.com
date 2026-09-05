import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import type { VisaRequirement } from "@workspace/api-client-react";
import { numericToAlpha2 } from "@/data/isoMapping";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const requirementColors: Record<VisaRequirement, string> = {
  visa_free: "#16a34a",
  visa_on_arrival: "#d97706",
  e_visa: "#2563eb",
  visa_required: "#ea580c",
  no_admission: "#dc2626",
};

const requirementLabels: Record<VisaRequirement, string> = {
  visa_free: "Visa Free",
  visa_on_arrival: "Visa on Arrival",
  e_visa: "eVisa",
  visa_required: "Visa Required",
  no_admission: "No Admission",
};

interface WorldMapProps {
  visaMap: Record<string, VisaRequirement>;
  passportCode?: string;
  onCountryClick?: (code: string) => void;
  highlightedCode?: string;
}

const legend: { req: VisaRequirement; label: string; color: string }[] = [
  { req: "visa_free", label: "Visa Free", color: requirementColors.visa_free },
  { req: "visa_on_arrival", label: "Visa on Arrival", color: requirementColors.visa_on_arrival },
  { req: "e_visa", label: "eVisa", color: requirementColors.e_visa },
  { req: "visa_required", label: "Visa Required", color: requirementColors.visa_required },
  { req: "no_admission", label: "No Admission", color: requirementColors.no_admission },
];

export default function WorldMap({
  visaMap,
  passportCode,
  onCountryClick,
  highlightedCode,
}: WorldMapProps) {
  // react-simple-maps 3 supports filterZoomEvent at runtime but omits it from its
  // type declarations. One finger scrolls the page, two fingers pan, and a
  // trackpad wheel only zooms with ctrl held.
  const zoomExtras = { filterZoomEvent: (e: any) => e.type === "wheel" ? e.ctrlKey : !(e.type === "touchstart" && e.touches?.length === 1) } as object;
  return (
    <div className="relative w-full bg-secondary/40 rounded-2xl overflow-hidden border border-border/70" style={{ touchAction: "pan-y" }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "auto" }}
        height={400}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={6} {...zoomExtras}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numericId = String(geo.id);
                const alpha2 = numericToAlpha2[numericId];
                const isPassport = alpha2 === passportCode;
                const req = alpha2 ? visaMap[alpha2] : undefined;
                const isHighlighted = alpha2 === highlightedCode;

                let fill = "#e2e8f0";
                if (isPassport) {
                  fill = "hsl(222 89% 30%)";
                } else if (req) {
                  fill = requirementColors[req];
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={0.4}
                    style={{
                      default: {
                        outline: "none",
                        opacity: isHighlighted ? 1 : 0.9,
                        filter: isHighlighted ? "brightness(1.2) drop-shadow(0 0 4px rgba(0,0,0,0.4))" : "none",
                      },
                      hover: {
                        outline: "none",
                        opacity: 1,
                        cursor: alpha2 && visaMap[alpha2] ? "pointer" : "default",
                        filter: "brightness(1.15)",
                      },
                      pressed: { outline: "none" },
                    }}
                    onClick={() => {
                      if (alpha2 && onCountryClick) {
                        onCountryClick(alpha2);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="sm:absolute sm:bottom-3 sm:left-3 sm:rounded-lg sm:border sm:border-border sm:bg-white/90 sm:backdrop-blur-sm sm:shadow-sm sm:p-2.5 px-3 py-2 border-t border-border/70 bg-card">
        <div className="hidden sm:block text-xs font-semibold text-foreground mb-1.5">Legend</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 sm:flex-col sm:gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "hsl(222 89% 30%)" }} />
            <span className="text-xs text-muted-foreground">Your Passport</span>
          </div>
          {legend.map(({ req, label, color }) => (
            <div key={req} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm flex-shrink-0 bg-slate-200" />
            <span className="text-xs text-muted-foreground">No Data</span>
          </div>
        </div>
      </div>

      {/* Zoom hint */}
      <div className="hidden sm:block absolute top-2 right-3 text-xs text-muted-foreground/60">
        Scroll to zoom · Drag to pan
      </div>
    </div>
  );
}
