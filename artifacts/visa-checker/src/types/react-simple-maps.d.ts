declare module "react-simple-maps" {
  import type { ReactNode, CSSProperties, Ref } from "react";

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
    ref?: Ref<SVGSVGElement>;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    center?: [number, number];
    onMoveEnd?: (data: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }

  export interface GeographyStyle {
    default?: CSSProperties;
    hover?: CSSProperties;
    pressed?: CSSProperties;
  }

  export interface Geo {
    rsmKey: string;
    id?: string | number;
    properties: Record<string, unknown>;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Geo[] }) => ReactNode;
    parseGeographies?: (geographies: unknown[]) => unknown[];
  }

  export interface GeographyProps {
    geography: Geo;
    style?: GeographyStyle;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
  }

  export const ComposableMap: React.ForwardRefExoticComponent<ComposableMapProps & React.RefAttributes<SVGSVGElement>>;
  export const ZoomableGroup: (props: ZoomableGroupProps) => ReactNode;
  export const Geographies: (props: GeographiesProps) => ReactNode;
  export const Geography: (props: GeographyProps) => ReactNode;
}
