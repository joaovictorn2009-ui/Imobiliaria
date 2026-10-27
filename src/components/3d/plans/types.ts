import type { FurnOpts, FurnType } from './furniture'

export type Side = 'n' | 's' | 'e' | 'w'
export type FloorKind = 'wood' | 'woodDark' | 'tile' | 'tileLight' | 'stone' | 'concrete'

/** Retângulo em unidades de projeto (antes de ajustar à área do anúncio). x leste, z sul. */
export interface Rect {
  x: number
  z: number
  w: number
  d: number
}

export interface RoomSpec {
  id: string
  name: string
  rects: Rect[]
  floor: FloorKind
  desc: string
  /** acabamento das paredes externas deste cômodo */
  tone?: 'timber' | 'stone'
  /** lados sem parede (varanda, área gourmet) */
  open?: Side[]
  /** não conta como área "interna" nem tem forro */
  covered?: boolean
  /** nome curto, usado em rótulos de cômodos pequenos */
  short?: string
}

export type DoorKind = 'door' | 'void' | 'slide' | 'garage'

export interface DoorSpec {
  a: string
  /** cômodo do outro lado; se omitido, é uma porta externa de `a` na face `side` */
  b?: string
  side?: Side
  kind: DoorKind
  /** posição ao longo da parede (0 a 1) */
  frac?: number
  w?: number
  /** fração da parede ocupada (para portas largas, como a de garagem) */
  wFrac?: number
  /** cômodo para onde a porta abre */
  into?: string
  hinge?: 'lo' | 'hi'
}

export interface WindowSpec {
  room: string
  side: Side
  frac: number
  w: number
  /** parapeito (altura do chão) e topo, em metros */
  sill?: number
  top?: number
}

export interface FurnSpec {
  room: string
  type: FurnType
  /** posição dentro do cômodo (0 a 1) */
  fx: number
  fz: number
  rot?: number
  opts?: FurnOpts
  /** índice do retângulo do cômodo (padrão 0) */
  rect?: number
}

export interface PlanSpec {
  id: string
  propertyId: string
  title: string
  subtitle: string
  /** área total do anúncio, em m² (a planta é ajustada para fechar com ela) */
  targetArea: number
  rooms: RoomSpec[]
  doors: DoorSpec[]
  windows: WindowSpec[]
  furniture: FurnSpec[]
  /** retângulo do espelho d'água, em unidades de projeto */
  pool: Rect
  ceiling: number
}

// ---------- Resultado já calculado (em metros) ----------

export interface RoomM {
  id: string
  name: string
  floor: FloorKind
  desc: string
  rects: { x: number; z: number; w: number; d: number }[]
  /** área em m² */
  area: number
  /** ponto de ancoragem do rótulo */
  cx: number
  cz: number
  /** largura e profundidade do maior retângulo */
  w: number
  d: number
  covered: boolean
  open: Side[]
  short: string
}

export interface Opening {
  at: number
  w: number
  bottom: number
  top: number
  kind: 'glass' | 'door' | 'void' | 'garage'
}

export interface WallSeg {
  axis: 'h' | 'v'
  /** coordenada fixa da linha da parede (z para 'h', x para 'v'), em metros */
  line: number
  a0: number
  a1: number
  exterior: boolean
  tone?: 'timber' | 'stone'
  openings: Opening[]
}

export interface DoorArc {
  /** dobradiça */
  hx: number
  hz: number
  /** direção da folha fechada */
  dx: number
  dz: number
  /** direção para onde a porta abre */
  nx: number
  nz: number
  w: number
}

export interface RoofBox {
  x: number
  z: number
  w: number
  d: number
}

export interface FurnM {
  type: FurnType
  x: number
  z: number
  rot: number
  opts?: FurnOpts
  room: string
}

export interface BuiltPlan {
  spec: PlanSpec
  /** fator de escala aplicado às dimensões de projeto */
  k: number
  rooms: RoomM[]
  walls: WallSeg[]
  arcs: DoorArc[]
  roofs: RoofBox[]
  slabs: RoofBox[]
  furniture: FurnM[]
  posts: { x: number; z: number }[]
  bbox: { minX: number; maxX: number; minZ: number; maxZ: number }
  /** área interna somando todos os cômodos fechados, em m² */
  netArea: number
  pool: { x: number; z: number; w: number; d: number }
  ceiling: number
}

export const WALL_EXT = 0.28
export const WALL_INT = 0.12
