// Projeto da casa ilustrativa: dois pavimentos, 12 m x 8 m cada.
// Origem do desenho no canto (0,0); a cena centraliza tudo depois.

export type LevelId = 'ground' | 'upper'

export const FLOOR_H = 3
export const WALL_EXT = 0.26
export const WALL_INT = 0.12
export const HOUSE_W = 12
export const HOUSE_D = 8

export interface RoomDef {
  id: string
  name: string
  level: LevelId
  x: number
  z: number
  w: number
  d: number
  floor: string
  desc: string
}

export const ROOMS: RoomDef[] = [
  { id: 'living', name: 'Sala de estar e jantar', level: 'ground', x: 0, z: 0, w: 7, d: 8, floor: '#b98b5e', desc: 'Ambiente integrado com pé-direito generoso e portas de correr para o jardim e a piscina.' },
  { id: 'kitchen', name: 'Cozinha gourmet', level: 'ground', x: 7, z: 0, w: 5, d: 4, floor: '#d8d3ca', desc: 'Ilha central, bancada em pedra e abertura para a sala.' },
  { id: 'hall', name: 'Hall e escada', level: 'ground', x: 7, z: 4, w: 3, d: 4, floor: '#c9c2b6', desc: 'Entrada social com escada em madeira para o pavimento superior.' },
  { id: 'wc', name: 'Lavabo', level: 'ground', x: 10, z: 4, w: 2, d: 4, floor: '#cfd8dc', desc: 'Lavabo de apoio para visitas, com ventilação natural.' },
  { id: 'balcony', name: 'Varanda', level: 'upper', x: 0, z: -2, w: 5, d: 2, floor: '#a8a29a', desc: 'Varanda da suíte com guarda-corpo de vidro e vista para a piscina.' },
  { id: 'master', name: 'Suíte master', level: 'upper', x: 0, z: 0, w: 5, d: 8, floor: '#b98b5e', desc: 'Suíte ampla com acesso à varanda e espaço para closet.' },
  { id: 'corridor', name: 'Circulação', level: 'upper', x: 5, z: 0, w: 2, d: 8, floor: '#c9c2b6', desc: 'Corredor com iluminação natural, ligando os quartos.' },
  { id: 'bed2', name: 'Quarto 2', level: 'upper', x: 7, z: 0, w: 5, d: 4, floor: '#b98b5e', desc: 'Quarto com janela para o jardim e armários planejados.' },
  { id: 'bed3', name: 'Quarto 3', level: 'upper', x: 7, z: 4, w: 3, d: 4, floor: '#b98b5e', desc: 'Quarto com banheiro privativo ao lado.' },
  { id: 'bath', name: 'Banheiro do quarto 3', level: 'upper', x: 10, z: 4, w: 2, d: 4, floor: '#cfd8dc', desc: 'Banheiro com box de vidro e janela alta.' },
]

export type OpeningKind = 'glass' | 'door' | 'void'

export interface Opening {
  /** distância do início da parede até o centro da abertura (m) */
  at: number
  w: number
  bottom: number
  top: number
  kind: OpeningKind
}

export interface WallDef {
  level: LevelId
  x1: number
  z1: number
  x2: number
  z2: number
  exterior?: boolean
  tone?: 'timber'
  openings?: Opening[]
}

const g = (at: number, w: number, bottom = 0.9, top = 2.3): Opening => ({ at, w, bottom, top, kind: 'glass' })
const slide = (at: number, w: number): Opening => ({ at, w, bottom: 0, top: 2.45, kind: 'glass' })
const door = (at: number, w = 0.95): Opening => ({ at, w, bottom: 0, top: 2.2, kind: 'door' })
const gap = (at: number, w: number): Opening => ({ at, w, bottom: 0, top: 2.35, kind: 'void' })

export const WALLS: WallDef[] = [
  // Térreo, paredes externas
  { level: 'ground', x1: 0, z1: 0, x2: 12, z2: 0, exterior: true, openings: [slide(3.5, 5), g(9.5, 2.4, 1, 2.3)] },
  { level: 'ground', x1: 0, z1: 8, x2: 12, z2: 8, exterior: true, openings: [g(3, 3), { at: 8.5, w: 1.3, bottom: 0, top: 2.4, kind: 'door' }] },
  { level: 'ground', x1: 0, z1: 0, x2: 0, z2: 8, exterior: true, openings: [g(4, 3)] },
  { level: 'ground', x1: 12, z1: 0, x2: 12, z2: 8, exterior: true, openings: [g(2, 2, 1, 2.3), g(6, 0.7, 1.7, 2.3)] },
  // Térreo, paredes internas
  { level: 'ground', x1: 7, z1: 0, x2: 7, z2: 8, openings: [gap(2, 3), gap(6, 1.6)] },
  { level: 'ground', x1: 7, z1: 4, x2: 12, z2: 4, openings: [door(1.5)] },
  { level: 'ground', x1: 10, z1: 4, x2: 10, z2: 8, openings: [door(2, 0.9)] },
  // Pavimento superior, paredes externas
  { level: 'upper', x1: 0, z1: 0, x2: 12, z2: 0, exterior: true, openings: [slide(2.5, 3), g(9.5, 2.4)] },
  { level: 'upper', x1: 0, z1: 8, x2: 12, z2: 8, exterior: true, tone: 'timber', openings: [g(2.5, 2), g(6, 0.8), g(8.5, 1.6), g(11, 1)] },
  { level: 'upper', x1: 0, z1: 0, x2: 0, z2: 8, exterior: true, openings: [g(4, 2)] },
  { level: 'upper', x1: 12, z1: 0, x2: 12, z2: 8, exterior: true, openings: [g(2, 2), g(6, 1.4, 1.3, 2.3)] },
  // Pavimento superior, paredes internas
  { level: 'upper', x1: 5, z1: 0, x2: 5, z2: 8, openings: [door(6)] },
  { level: 'upper', x1: 7, z1: 0, x2: 7, z2: 8, openings: [door(2), door(6)] },
  { level: 'upper', x1: 7, z1: 4, x2: 12, z2: 4 },
  { level: 'upper', x1: 10, z1: 4, x2: 10, z2: 8, openings: [door(2, 0.9)] },
]

export interface FurnitureDef {
  level: LevelId
  x: number
  z: number
  w: number
  d: number
  h: number
  color: string
  y?: number
}

export const FURNITURE: FurnitureDef[] = [
  // Sala
  { level: 'ground', x: 3, z: 6.6, w: 2.6, d: 1, h: 0.8, color: '#5b6b7a' },
  { level: 'ground', x: 1.4, z: 5.4, w: 1, d: 1.8, h: 0.8, color: '#5b6b7a' },
  { level: 'ground', x: 3, z: 5.1, w: 1.2, d: 0.7, h: 0.35, color: '#3a2f27' },
  { level: 'ground', x: 3, z: 7.8, w: 2.4, d: 0.3, h: 0.5, color: '#2b2b2b' },
  { level: 'ground', x: 4.6, z: 1.8, w: 2, d: 1, h: 0.75, color: '#7a5532' },
  { level: 'ground', x: 3.6, z: 1.8, w: 0.45, d: 0.45, h: 0.45, color: '#2f2f2f' },
  { level: 'ground', x: 5.6, z: 1.8, w: 0.45, d: 0.45, h: 0.45, color: '#2f2f2f' },
  { level: 'ground', x: 4.6, z: 0.9, w: 0.45, d: 0.45, h: 0.45, color: '#2f2f2f' },
  { level: 'ground', x: 4.6, z: 2.7, w: 0.45, d: 0.45, h: 0.45, color: '#2f2f2f' },
  // Cozinha
  { level: 'ground', x: 9.4, z: 1.9, w: 2.6, d: 0.9, h: 0.92, color: '#e9e5dd' },
  { level: 'ground', x: 11.6, z: 2, w: 0.7, d: 3.2, h: 0.92, color: '#4a4540' },
  { level: 'ground', x: 9.4, z: 0.45, w: 3.2, d: 0.6, h: 0.92, color: '#4a4540' },
  // Lavabo
  { level: 'ground', x: 11.3, z: 7.4, w: 0.5, d: 0.7, h: 0.4, color: '#f4f4f4' },
  { level: 'ground', x: 10.5, z: 5.2, w: 0.5, d: 0.9, h: 0.85, color: '#f4f4f4' },
  // Suíte
  { level: 'upper', x: 2.5, z: 5.6, w: 2, d: 2.1, h: 0.5, color: '#e8e2d8' },
  { level: 'upper', x: 2.5, z: 6.7, w: 2.3, d: 0.2, h: 1.1, color: '#6b4a2e' },
  { level: 'upper', x: 1.1, z: 6.9, w: 0.5, d: 0.5, h: 0.5, color: '#6b4a2e' },
  { level: 'upper', x: 3.9, z: 6.9, w: 0.5, d: 0.5, h: 0.5, color: '#6b4a2e' },
  { level: 'upper', x: 0.4, z: 2.2, w: 0.6, d: 2.8, h: 2.1, color: '#8a6a4a' },
  // Quarto 2
  { level: 'upper', x: 10, z: 2, w: 1.5, d: 2, h: 0.45, color: '#dfe6ee' },
  { level: 'upper', x: 11.6, z: 3.1, w: 0.6, d: 1.6, h: 2.0, color: '#8a6a4a' },
  // Quarto 3
  { level: 'upper', x: 8.5, z: 6, w: 1.4, d: 1.9, h: 0.45, color: '#eadfd7' },
  // Banheiro
  { level: 'upper', x: 11.4, z: 7.3, w: 0.5, d: 0.7, h: 0.4, color: '#f4f4f4' },
  { level: 'upper', x: 10.6, z: 5.3, w: 0.9, d: 0.9, h: 0.05, color: '#bfd8e6' },
]

export const CAMERA_PRESETS = {
  facade: { pos: [17, 9, 19] as [number, number, number], target: [0, 3, 0] as [number, number, number] },
  explode: { pos: [27, 17, 29] as [number, number, number], target: [0, 5.5, 0] as [number, number, number] },
  plan: { pos: [0.01, 25, 9] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
}

export type Mode = 'facade' | 'plan' | 'explode'
