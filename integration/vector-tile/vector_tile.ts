

export interface Tile {
  layers: Tile_Layer[];
}

export interface Tile_Value {
  stringValue: string;
  floatValue: number;
  doubleValue: number;
  intValue: number;
  uintValue: number;
  sintValue: number;
  boolValue: boolean;
}

export interface Tile_Feature {
  id: number;
  tags: number[];
  type: Tile_GeomType;
  geometry: number[];
}

export interface Tile_Layer {
  version: number;
  name: string;
  features: Tile_Feature[];
  keys: string[];
  values: Tile_Value[];
  extent: number;
}

export const Tile_GeomType = {
  UNKNOWN: 0 as const,
  POINT: 1 as const,
  LINESTRING: 2 as const,
  POLYGON: 3 as const,
  UNRECOGNIZED: -1 as const,
}

export type Tile_GeomType = 0 | 1 | 2 | 3 | -1;

export const VECTOR_TILE_PACKAGE_NAME = 'vector_tile'