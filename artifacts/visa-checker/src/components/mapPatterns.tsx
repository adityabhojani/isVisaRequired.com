// Status textures for the choropleth maps — the homepage WorldMap and the /map
// page both draw from here, so the patterns a colour-blind reader relies on
// can't drift apart between the two.
//
// A choropleth has no room for a word, so each status also carries the texture
// its shared record names (VISA_STATUS[req].patternId). White marks at low
// opacity keep it a colour map at a glance. Sizes are map units (~1px on
// desktop), so the texture grows with zoom and pinch-zooming makes it legible.
import type { ReactNode } from "react";
import type { VisaRequirement } from "@workspace/api-client-react";
import { VISA_STATUS } from "@workspace/travel-data";
import { reqConfig, requirementOrder, NO_DATA_FILL } from "@/lib/requirement";

export const NO_DATA_PATTERN_ID = "status-no-data";

const TEXTURES: Record<string, { size: number; angle?: number; marks?: ReactNode }> = {
  "status-solid": { size: 4 },
  "status-dots": {
    size: 4,
    marks: <circle cx={2} cy={2} r={0.75} fill="#fff" fillOpacity={0.5} />,
  },
  "status-hatch": {
    size: 4,
    angle: 45,
    marks: <path d="M2 0V4" stroke="#fff" strokeOpacity={0.4} strokeWidth={0.6} />,
  },
  "status-crosshatch": {
    size: 4,
    angle: 45,
    marks: <path d="M2 0V4M0 2H4" stroke="#fff" strokeOpacity={0.4} strokeWidth={0.6} />,
  },
  "status-dense": {
    size: 2.5,
    marks: <path d="M1.25 0V2.5M0 1.25H2.5" stroke="#fff" strokeOpacity={0.35} strokeWidth={0.45} />,
  },
  [NO_DATA_PATTERN_ID]: {
    size: 3,
    angle: -45,
    marks: <path d="M1.5 0V3" stroke="#fff" strokeOpacity={0.6} strokeWidth={0.6} />,
  },
};

function Pattern({ domId, textureId, background }: { domId: string; textureId: string; background: string }) {
  const t = TEXTURES[textureId] ?? { size: 4 };
  return (
    <pattern
      id={domId}
      patternUnits="userSpaceOnUse"
      width={t.size}
      height={t.size}
      patternTransform={t.angle ? `rotate(${t.angle})` : undefined}
    >
      <rect width={t.size} height={t.size} fill={background} />
      {t.marks}
    </pattern>
  );
}

/**
 * Every status pattern plus the no-data hatch, for a map's <defs>. `prefix`
 * scopes the DOM ids: two maps on one page must not share pattern ids.
 */
export function StatusPatternDefs({ prefix = "" }: { prefix?: string }) {
  return (
    <>
      {requirementOrder.map((req) => (
        <Pattern key={req} domId={`${prefix}${VISA_STATUS[req].patternId}`} textureId={VISA_STATUS[req].patternId} background={reqConfig[req].solid} />
      ))}
      <Pattern domId={`${prefix}${NO_DATA_PATTERN_ID}`} textureId={NO_DATA_PATTERN_ID} background={NO_DATA_FILL} />
    </>
  );
}

/** Pattern fill with the plain colour as fallback if the reference can't resolve. */
export const statusFill = (req: VisaRequirement, prefix = "") =>
  `url(#${prefix}${VISA_STATUS[req].patternId}) ${reqConfig[req].solid}`;
export const noDataFill = (prefix = "") => `url(#${prefix}${NO_DATA_PATTERN_ID}) ${NO_DATA_FILL}`;

/** Legend key: the same fill the map uses. `onSolid` rings it when it sits on a solid chip. */
export function Swatch({ fill, onSolid = false, size = 12 }: { fill: string; onSolid?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" className="flex-shrink-0">
      <rect x="0.5" y="0.5" width="11" height="11" rx="2" fill={fill}
        stroke={onSolid ? "#fff" : "none"} strokeWidth={1} />
    </svg>
  );
}
