import { useCallback, useMemo, useState, type KeyboardEvent, type ReactNode, type SVGProps } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type Geo, type GeographyProps } from "react-simple-maps";
import type { VisaRequirement } from "@workspace/api-client-react";
import { alpha2FromAtlasId } from "@/data/isoMapping";
import { reqConfig, requirementOrder } from "@/lib/requirement";
import { StatusPatternDefs, statusFill, noDataFill, Swatch } from "@/components/mapPatterns";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Not statuses: the brand navy marks the reader's own passport (and the
// keyboard focus ring); the pale neutral is land the dataset doesn't cover at
// all (Antarctica, Western Sahara, Kosovo…), and is not clickable.
const PASSPORT_FILL = "hsl(222 89% 30%)";
const UNMAPPED_FILL = "#e2e8f0";
// Hover and highlight ease on the shared fast track (lib/travel-data MOTION).
const MAP_EASE = "opacity var(--motion-fast) var(--motion-ease), filter var(--motion-fast) var(--motion-ease)";

// Status textures, fills and the legend swatch are shared with the /map page
// (components/mapPatterns.tsx) so the two maps can't drift apart.

// react-simple-maps renders each Geography as a plain <path> and forwards any
// other prop to it (tabIndex, role, key handlers, a <title> child); the local
// typings only list a few, so widen them here rather than cast at each use.
const Country = Geography as unknown as (
  props: GeographyProps & Omit<SVGProps<SVGPathElement>, keyof GeographyProps | "ref">,
) => ReactNode;

// react-simple-maps 3 supports filterZoomEvent at runtime but omits it from its
// type declarations. One finger scrolls the page, two fingers pan, and a
// trackpad wheel only zooms with ctrl held. Module-level so it stays one
// function and the map doesn't rebind its zoom handler on every render.
const zoomExtras = { filterZoomEvent: (e: any) => e.type === "wheel" ? e.ctrlKey : !(e.type === "touchstart" && e.touches?.length === 1) } as object;

// Zero-padded atlas ids are handled inside the shared lookup.
const toAlpha2 = alpha2FromAtlasId;

const isFocusVisible = (el: Element) => {
  try {
    return el.matches(":focus-visible");
  } catch {
    return true;
  }
};

interface WorldMapProps {
  visaMap: Record<string, VisaRequirement>;
  passportCode?: string;
  onCountryClick?: (code: string) => void;
  highlightedCode?: string;
}

export default function WorldMap({
  visaMap,
  passportCode,
  onCountryClick,
  highlightedCode,
}: WorldMapProps) {
  // While the passport's results are still loading the map is empty, not
  // "no data" — everything stays the pale neutral until something arrives.
  const hasData = useMemo(() => Object.keys(visaMap).length > 0, [visaMap]);

  // Which countries the atlas actually draws, so the legend only offers
  // "No data" when one of them is painted that way. Stable identity: the
  // library refetches the atlas whenever this function changes.
  const [drawnCodes, setDrawnCodes] = useState<string[]>([]);
  const collectCodes = useCallback((features: unknown[]) => {
    setDrawnCodes(features.flatMap((f) => {
      const code = toAlpha2((f as { id?: unknown }).id);
      return code ? [code] : [];
    }));
    return features;
  }, []);
  const showNoData = useMemo(
    () => hasData && drawnCodes.some((c) => c !== passportCode && !reqConfig[visaMap[c]]),
    [hasData, drawnCodes, passportCode, visaMap],
  );

  // Keyboard focus ring, drawn after every country so neighbours can't paint
  // over it: navy outside, a white core so it shows on the dark fills too.
  const [ring, setRing] = useState<{ key: string; d: string } | null>(null);

  return (
    <div className="relative w-full bg-secondary/40 rounded-2xl overflow-hidden border border-border/70" style={{ touchAction: "pan-y" }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "auto" }}
        height={400}
      >
        <defs>
          <StatusPatternDefs />
        </defs>
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={6} {...zoomExtras}>
          <Geographies geography={GEO_URL} parseGeographies={collectCodes}>
            {({ geographies }) =>
              geographies.map((geo: Geo) => {
                const alpha2 = toAlpha2(geo.id);
                const isPassport = !!alpha2 && alpha2 === passportCode;
                const req = alpha2 && reqConfig[visaMap[alpha2]] ? visaMap[alpha2] : undefined;
                const isHighlighted = !!alpha2 && alpha2 === highlightedCode;
                const interactive = !!alpha2 && !!onCountryClick;
                const name = typeof geo.properties.name === "string" ? geo.properties.name : alpha2 ?? "";
                const svgPath = (geo as Geo & { svgPath?: string }).svgPath ?? "";

                let fill = UNMAPPED_FILL;
                let status: string | undefined;
                if (isPassport) {
                  fill = PASSPORT_FILL;
                  status = "Your Passport";
                } else if (req) {
                  fill = statusFill(req);
                  status = reqConfig[req].label;
                } else if (alpha2 && hasData) {
                  fill = noDataFill();
                  status = "No data";
                }

                const activate = () => {
                  if (alpha2 && onCountryClick) {
                    onCountryClick(alpha2);
                  }
                };
                const cursor = req ? "pointer" : "default";
                // The drawn ring replaces the browser's bounding-box outline. In
                // every state: the library drops back to "default" on mouseleave
                // (and "pressed" on mousedown) while the path keeps keyboard focus.
                const ringOutline = ring?.key === geo.rsmKey ? { outline: "none" } : {};

                return (
                  <Country
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={0.4}
                    tabIndex={interactive ? 0 : -1}
                    role={interactive ? "button" : undefined}
                    // The library swaps the whole style object per state, so
                    // the easing has to ride on every state or the hover-off
                    // snaps while hover-on glides.
                    style={{
                      default: {
                        opacity: isHighlighted ? 1 : 0.9,
                        filter: isHighlighted ? "brightness(1.2) drop-shadow(0 0 4px rgba(0,0,0,0.4))" : "none",
                        transition: MAP_EASE,
                        ...ringOutline,
                      },
                      hover: {
                        opacity: 1,
                        cursor,
                        filter: "brightness(1.15)",
                        transition: MAP_EASE,
                        ...ringOutline,
                      },
                      pressed: { cursor, transition: MAP_EASE, ...ringOutline },
                    }}
                    onClick={activate}
                    onKeyDown={(e: KeyboardEvent<SVGPathElement>) => {
                      if (interactive && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        activate();
                      }
                    }}
                    onFocus={(e) => {
                      if (isFocusVisible(e.currentTarget)) setRing({ key: geo.rsmKey, d: svgPath });
                    }}
                    onBlur={() => setRing(null)}
                  >
                    <title>{status ? `${name} — ${status}` : name}</title>
                  </Country>
                );
              })
            }
          </Geographies>
          {ring && (
            <g pointerEvents="none" aria-hidden="true">
              <path d={ring.d} fill="none" stroke={PASSPORT_FILL} strokeWidth={1.75} strokeLinejoin="round" />
              <path d={ring.d} fill="none" stroke="#fff" strokeWidth={0.6} strokeLinejoin="round" />
            </g>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend: swatch + pattern + word, least effort first */}
      <div className="sm:absolute sm:bottom-3 sm:left-3 sm:rounded-lg sm:border sm:border-border sm:bg-white/90 sm:backdrop-blur-sm sm:shadow-sm sm:p-2.5 px-3 py-2 border-t border-border/70 bg-card">
        <div className="hidden sm:block text-xs font-semibold text-foreground mb-1.5">Legend</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 sm:flex-col sm:gap-1">
          <div className="flex items-center gap-1.5">
            <Swatch fill={PASSPORT_FILL} size={14} />
            <span className="text-xs text-muted-foreground">Your Passport</span>
          </div>
          {requirementOrder.map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <Swatch fill={statusFill(k)} size={14} />
              <span className="text-xs text-muted-foreground">{reqConfig[k].label}</span>
            </div>
          ))}
          {showNoData && (
            <div className="flex items-center gap-1.5">
              <Swatch fill={noDataFill()} size={14} />
              <span className="text-xs text-muted-foreground">No data</span>
            </div>
          )}
        </div>
      </div>

      {/* Zoom hint */}
      <div className="hidden sm:block absolute top-2 right-3 text-xs text-muted-foreground/60">
        Scroll to zoom · Drag to pan
      </div>
    </div>
  );
}
