// Catálogo de móveis: cada peça é um conjunto de formas simples (caixas, caixas arredondadas,
// cilindros e esferas) posicionadas em metros, com a origem no centro da peça, no chão.

export type PrimKind = 'box' | 'rbox' | 'cyl' | 'sph'

export interface Prim {
  k: PrimKind
  /** posição do centro (x, y, z), em metros */
  p: [number, number, number]
  /** tamanho (x, y, z); para cilindro: [raio, altura, raio] */
  s: [number, number, number]
  c: string
  rough?: number
  metal?: number
  emissive?: string
  ei?: number
  /** não aparece na planta técnica (detalhes pequenos) */
  detail?: boolean
}

export type FurnType =
  | 'sofa'
  | 'armchair'
  | 'coffee'
  | 'rug'
  | 'tvunit'
  | 'dining'
  | 'bed'
  | 'bedSingle'
  | 'night'
  | 'wardrobe'
  | 'desk'
  | 'run'
  | 'island'
  | 'fridge'
  | 'toilet'
  | 'vanity'
  | 'shower'
  | 'tub'
  | 'washer'
  | 'bbq'
  | 'outTable'
  | 'lounge'
  | 'car'
  | 'plant'
  | 'shelf'
  | 'bench'
  | 'sofaOut'

export interface Furnishing {
  prims: Prim[]
  /** pegada no chão (largura x, profundidade z) */
  w: number
  d: number
}

export interface FurnOpts {
  len?: number
  color?: string
}

const WOOD = '#8a6a4a'
const WOOD_DARK = '#4a3425'
const FABRIC = '#6f7f8f'
const FABRIC_LIGHT = '#b8c2cc'
const WHITE = '#f3f1ec'
const STONE = '#d9d4cc'
const STONE_DARK = '#3a3d42'
const STEEL = '#b9bec5'
const BLACK = '#17191c'

const box = (p: [number, number, number], s: [number, number, number], c: string, extra: Partial<Prim> = {}): Prim => ({ k: 'box', p, s, c, ...extra })
const rbox = (p: [number, number, number], s: [number, number, number], c: string, extra: Partial<Prim> = {}): Prim => ({ k: 'rbox', p, s, c, ...extra })
const cyl = (p: [number, number, number], r: number, h: number, c: string, extra: Partial<Prim> = {}): Prim => ({ k: 'cyl', p, s: [r, h, r], c, ...extra })
const sph = (p: [number, number, number], r: number, c: string, extra: Partial<Prim> = {}): Prim => ({ k: 'sph', p, s: [r, r, r], c, ...extra })

function chair(x: number, z: number, face: 1 | -1, c = WOOD_DARK): Prim[] {
  return [
    rbox([x, 0.45, z], [0.42, 0.06, 0.42], c),
    rbox([x, 0.75, z + 0.19 * face], [0.42, 0.55, 0.05], c),
    box([x - 0.17, 0.22, z - 0.17], [0.04, 0.44, 0.04], '#222', { detail: true }),
    box([x + 0.17, 0.22, z - 0.17], [0.04, 0.44, 0.04], '#222', { detail: true }),
    box([x - 0.17, 0.22, z + 0.17], [0.04, 0.44, 0.04], '#222', { detail: true }),
    box([x + 0.17, 0.22, z + 0.17], [0.04, 0.44, 0.04], '#222', { detail: true }),
  ]
}

export function furnishing(type: FurnType, o: FurnOpts = {}): Furnishing {
  switch (type) {
    case 'sofa': {
      const w = 2.4
      const d = 1.0
      const c = o.color ?? FABRIC
      return {
        w,
        d,
        prims: [
          rbox([0, 0.28, 0], [w, 0.36, d], c, { rough: 0.95 }),
          rbox([0, 0.6, -d / 2 + 0.12], [w, 0.5, 0.24], c, { rough: 0.95 }),
          rbox([-w / 2 + 0.12, 0.45, 0], [0.24, 0.3, d], c, { rough: 0.95 }),
          rbox([w / 2 - 0.12, 0.45, 0], [0.24, 0.3, d], c, { rough: 0.95 }),
          rbox([-0.6, 0.52, 0.06], [0.7, 0.14, 0.7], FABRIC_LIGHT, { rough: 1, detail: true }),
          rbox([0.1, 0.52, 0.06], [0.7, 0.14, 0.7], FABRIC_LIGHT, { rough: 1, detail: true }),
          rbox([0.8, 0.52, 0.06], [0.7, 0.14, 0.7], FABRIC_LIGHT, { rough: 1, detail: true }),
          rbox([-0.9, 0.72, -0.2], [0.4, 0.4, 0.12], '#c9a86a', { detail: true, rough: 1 }),
          rbox([0.9, 0.72, -0.2], [0.4, 0.4, 0.12], '#7d8f7a', { detail: true, rough: 1 }),
        ],
      }
    }
    case 'armchair':
      return {
        w: 0.9,
        d: 0.9,
        prims: [
          rbox([0, 0.25, 0], [0.9, 0.34, 0.9], '#a58b6a', { rough: 0.95 }),
          rbox([0, 0.62, -0.36], [0.9, 0.5, 0.18], '#a58b6a', { rough: 0.95 }),
          rbox([-0.39, 0.42, 0], [0.14, 0.26, 0.9], '#a58b6a', { rough: 0.95 }),
          rbox([0.39, 0.42, 0], [0.14, 0.26, 0.9], '#a58b6a', { rough: 0.95 }),
        ],
      }
    case 'coffee':
      return {
        w: 1.2,
        d: 0.65,
        prims: [
          rbox([0, 0.36, 0], [1.2, 0.05, 0.65], WOOD, { rough: 0.5 }),
          box([-0.52, 0.17, -0.24], [0.05, 0.34, 0.05], '#222', { detail: true }),
          box([0.52, 0.17, -0.24], [0.05, 0.34, 0.05], '#222', { detail: true }),
          box([-0.52, 0.17, 0.24], [0.05, 0.34, 0.05], '#222', { detail: true }),
          box([0.52, 0.17, 0.24], [0.05, 0.34, 0.05], '#222', { detail: true }),
          cyl([0.2, 0.42, 0], 0.09, 0.08, '#c9a86a', { detail: true, metal: 0.4 }),
        ],
      }
    case 'rug':
      return { w: o.len ?? 3, d: (o.len ?? 3) * 0.66, prims: [rbox([0, 0.012, 0], [o.len ?? 3, 0.024, (o.len ?? 3) * 0.66], o.color ?? '#cfc6b4', { rough: 1, detail: true })] }
    case 'tvunit':
      return {
        w: 2.2,
        d: 0.42,
        prims: [
          rbox([0, 0.25, 0], [2.2, 0.5, 0.42], WOOD_DARK, { rough: 0.6 }),
          box([0, 1.15, 0.1], [1.5, 0.82, 0.05], BLACK, { rough: 0.2, emissive: '#1b2a44', ei: 0.15 }),
        ],
      }
    case 'dining': {
      const w = 2.2
      const d = 1.0
      const chairs: Prim[] = []
      for (const x of [-0.7, 0, 0.7]) {
        chairs.push(...chair(x, -d / 2 - 0.3, -1), ...chair(x, d / 2 + 0.3, 1))
      }
      chairs.push(...chair(-w / 2 - 0.3, 0, -1), ...chair(w / 2 + 0.3, 0, 1))
      return {
        w: w + 0.9,
        d: d + 0.9,
        prims: [
          rbox([0, 0.74, 0], [w, 0.06, d], WOOD, { rough: 0.45 }),
          box([-0.95, 0.37, 0], [0.08, 0.74, 0.8], WOOD_DARK),
          box([0.95, 0.37, 0], [0.08, 0.74, 0.8], WOOD_DARK),
          ...chairs,
          cyl([0, 2.4, 0], 0.32, 0.18, '#f4efe4', { detail: true, emissive: '#ffd9a0', ei: 0.35 }),
          cyl([0, 2.75, 0], 0.01, 0.9, '#222', { detail: true }),
        ],
      }
    }
    case 'bed': {
      const w = o.len ?? 1.8
      return {
        w: w + 0.2,
        d: 2.1,
        prims: [
          rbox([0, 0.2, 0], [w, 0.28, 2.0], WOOD_DARK, { rough: 0.7 }),
          rbox([0, 0.42, 0.04], [w - 0.06, 0.2, 1.92], WHITE, { rough: 1 }),
          rbox([0, 0.56, 0.5], [w - 0.1, 0.08, 1.0], '#c6ccd4', { rough: 1, detail: true }),
          rbox([0, 0.7, -1.04], [w + 0.1, 0.9, 0.1], WOOD, { rough: 0.6 }),
          rbox([-w / 4, 0.55, -0.78], [w / 2 - 0.12, 0.14, 0.42], WHITE, { rough: 1, detail: true }),
          rbox([w / 4, 0.55, -0.78], [w / 2 - 0.12, 0.14, 0.42], WHITE, { rough: 1, detail: true }),
        ],
      }
    }
    case 'bedSingle':
      return {
        w: 1.0,
        d: 2.0,
        prims: [
          rbox([0, 0.2, 0], [0.95, 0.28, 1.95], WOOD_DARK, { rough: 0.7 }),
          rbox([0, 0.42, 0.04], [0.9, 0.2, 1.87], WHITE, { rough: 1 }),
          rbox([0, 0.7, -1.0], [1.0, 0.8, 0.08], WOOD, { rough: 0.6 }),
          rbox([0, 0.55, -0.72], [0.7, 0.13, 0.4], WHITE, { rough: 1, detail: true }),
        ],
      }
    case 'night':
      return {
        w: 0.5,
        d: 0.45,
        prims: [
          rbox([0, 0.25, 0], [0.5, 0.5, 0.45], WOOD, { rough: 0.6 }),
          cyl([0, 0.62, 0], 0.09, 0.22, '#f4efe4', { detail: true, emissive: '#ffd9a0', ei: 0.4 }),
        ],
      }
    case 'wardrobe': {
      const w = o.len ?? 2.4
      return {
        w,
        d: 0.6,
        prims: [
          rbox([0, 1.1, 0], [w, 2.2, 0.6], '#9a7a58', { rough: 0.55 }),
          box([0, 1.1, 0.305], [0.01, 2.0, 0.01], '#4a3425', { detail: true }),
          box([-w / 4, 1.1, 0.31], [0.02, 0.3, 0.02], '#d9d4cc', { detail: true }),
          box([w / 4, 1.1, 0.31], [0.02, 0.3, 0.02], '#d9d4cc', { detail: true }),
        ],
      }
    }
    case 'desk':
      return {
        w: 1.5,
        d: 0.75,
        prims: [
          rbox([0, 0.73, 0], [1.5, 0.05, 0.75], WOOD, { rough: 0.5 }),
          box([-0.7, 0.36, 0], [0.05, 0.72, 0.65], WOOD_DARK),
          box([0.7, 0.36, 0], [0.05, 0.72, 0.65], WOOD_DARK),
          box([0, 0.95, -0.15], [0.6, 0.38, 0.03], BLACK, { rough: 0.2, emissive: '#2b4a7a', ei: 0.2, detail: true }),
          ...chair(0, 0.75, 1, '#2f3338'),
        ],
      }
    case 'run': {
      // bancada de cozinha: armário + tampo de pedra
      const L = o.len ?? 3
      return {
        w: L,
        d: 0.62,
        prims: [
          rbox([0, 0.43, 0], [L, 0.86, 0.6], o.color ?? '#e6e1d8', { rough: 0.5 }),
          box([0, 0.89, 0], [L + 0.02, 0.04, 0.64], STONE_DARK, { rough: 0.25 }),
          box([0, 1.75, -0.2], [L, 0.7, 0.34], o.color ?? '#e6e1d8', { rough: 0.5, detail: true }),
        ],
      }
    }
    case 'island': {
      const L = o.len ?? 2.6
      return {
        w: L,
        d: 1.4,
        prims: [
          rbox([0, 0.45, 0], [L, 0.9, 1.0], '#2f3338', { rough: 0.5 }),
          box([0, 0.92, 0], [L + 0.06, 0.05, 1.12], '#efece6', { rough: 0.2 }),
          ...[-0.8, 0, 0.8].flatMap((x) => [
            cyl([x, 0.55, 0.85], 0.17, 0.05, '#222', { detail: true }),
            cyl([x, 0.28, 0.85], 0.03, 0.56, '#555', { detail: true }),
          ]),
          cyl([0.5, 0.98, 0], 0.2, 0.04, '#111', { detail: true, metal: 0.5 }),
        ],
      }
    }
    case 'fridge':
      return {
        w: 0.85,
        d: 0.75,
        prims: [
          rbox([0, 0.95, 0], [0.85, 1.9, 0.75], STEEL, { rough: 0.25, metal: 0.8 }),
          box([-0.3, 1.0, 0.38], [0.02, 1.2, 0.03], '#444', { detail: true }),
        ],
      }
    case 'toilet':
      return {
        w: 0.4,
        d: 0.7,
        prims: [
          rbox([0, 0.2, 0.08], [0.38, 0.4, 0.5], '#fbfbfb', { rough: 0.15 }),
          rbox([0, 0.5, -0.24], [0.38, 0.6, 0.2], '#fbfbfb', { rough: 0.15 }),
        ],
      }
    case 'vanity': {
      const L = o.len ?? 1.2
      return {
        w: L,
        d: 0.5,
        prims: [
          rbox([0, 0.4, 0], [L, 0.8, 0.5], '#8a6a4a', { rough: 0.5 }),
          box([0, 0.82, 0], [L + 0.02, 0.04, 0.52], '#efece6', { rough: 0.2 }),
          rbox([0, 0.85, 0.02], [0.45, 0.05, 0.32], '#ffffff', { rough: 0.1, detail: true }),
          box([0, 1.3, -0.24], [L - 0.1, 0.9, 0.02], '#cfe0ea', { rough: 0.05, metal: 0.8, detail: true }),
        ],
      }
    }
    case 'shower':
      return {
        w: 1.0,
        d: 1.0,
        prims: [
          box([0, 0.03, 0], [1.0, 0.06, 1.0], '#dde6ea', { rough: 0.3 }),
          box([0, 1.0, 0.5], [1.0, 2.0, 0.02], '#bfe0ee', { rough: 0.02, metal: 0.4, detail: true }),
          cyl([0, 2.0, -0.45], 0.1, 0.03, STEEL, { detail: true, metal: 0.8 }),
        ],
      }
    case 'tub':
      return {
        w: 1.7,
        d: 0.8,
        prims: [
          rbox([0, 0.3, 0], [1.7, 0.6, 0.8], '#fbfbfb', { rough: 0.15 }),
          rbox([0, 0.58, 0], [1.5, 0.04, 0.6], '#bcd6e4', { rough: 0.05, detail: true }),
        ],
      }
    case 'washer':
      return {
        w: 1.3,
        d: 0.65,
        prims: [
          rbox([-0.33, 0.45, 0], [0.62, 0.9, 0.62], WHITE, { rough: 0.3 }),
          rbox([0.33, 0.45, 0], [0.62, 0.9, 0.62], WHITE, { rough: 0.3 }),
          cyl([-0.33, 0.5, 0.31], 0.2, 0.02, '#556', { detail: true }),
          cyl([0.33, 0.5, 0.31], 0.2, 0.02, '#556', { detail: true }),
        ],
      }
    case 'bbq':
      return {
        w: 2.6,
        d: 0.75,
        prims: [
          rbox([0, 0.45, 0], [2.6, 0.9, 0.7], '#8d8579', { rough: 0.9 }),
          box([0, 0.92, 0], [2.64, 0.05, 0.76], STONE_DARK, { rough: 0.3 }),
          rbox([-0.6, 1.25, -0.1], [0.9, 0.65, 0.42], '#4d4a46', { rough: 0.9, detail: true }),
          rbox([0.1, 1.55, -0.1], [0.4, 0.8, 0.4], '#6d675e', { rough: 0.9, detail: true }),
          box([-0.6, 1.0, 0.12], [0.8, 0.02, 0.3], '#222', { detail: true, metal: 0.6 }),
        ],
      }
    case 'outTable': {
      const w = 2.6
      const d = 1.0
      const chairs: Prim[] = []
      for (const x of [-0.9, -0.3, 0.3, 0.9]) chairs.push(...chair(x, -d / 2 - 0.3, -1, '#6b4f36'), ...chair(x, d / 2 + 0.3, 1, '#6b4f36'))
      return {
        w: w + 0.4,
        d: d + 0.9,
        prims: [
          rbox([0, 0.74, 0], [w, 0.06, d], '#b08a5e', { rough: 0.5 }),
          box([-1.1, 0.37, 0], [0.08, 0.74, 0.8], '#4a3425'),
          box([1.1, 0.37, 0], [0.08, 0.74, 0.8], '#4a3425'),
          ...chairs,
        ],
      }
    }
    case 'lounge':
      return {
        w: 0.75,
        d: 2.0,
        prims: [
          rbox([0, 0.3, 0], [0.7, 0.12, 1.9], '#f0ece3', { rough: 0.9 }),
          rbox([0, 0.55, -0.7], [0.7, 0.12, 0.7], '#f0ece3', { rough: 0.9 }),
          box([-0.3, 0.14, -0.8], [0.04, 0.28, 0.04], '#888', { detail: true }),
          box([0.3, 0.14, 0.8], [0.04, 0.28, 0.04], '#888', { detail: true }),
        ],
      }
    case 'sofaOut':
      return {
        w: 2.2,
        d: 0.9,
        prims: [
          rbox([0, 0.3, 0], [2.2, 0.3, 0.9], '#c9c2b2', { rough: 1 }),
          rbox([0, 0.58, -0.33], [2.2, 0.4, 0.22], '#c9c2b2', { rough: 1 }),
          rbox([-0.55, 0.5, 0.05], [0.9, 0.12, 0.7], '#e9e3d4', { rough: 1, detail: true }),
          rbox([0.55, 0.5, 0.05], [0.9, 0.12, 0.7], '#e9e3d4', { rough: 1, detail: true }),
        ],
      }
    case 'car': {
      const c = o.color ?? '#2c3e57'
      return {
        w: 1.85,
        d: 4.4,
        prims: [
          rbox([0, 0.55, 0], [1.8, 0.62, 4.3], c, { rough: 0.25, metal: 0.6 }),
          rbox([0, 1.08, -0.15], [1.55, 0.5, 2.3], '#9fb6c6', { rough: 0.05, metal: 0.3 }),
          cyl([-0.9, 0.32, 1.35], 0.32, 0.22, '#111'),
          cyl([0.9, 0.32, 1.35], 0.32, 0.22, '#111'),
          cyl([-0.9, 0.32, -1.35], 0.32, 0.22, '#111'),
          cyl([0.9, 0.32, -1.35], 0.32, 0.22, '#111'),
          box([-0.55, 0.62, 2.16], [0.4, 0.12, 0.04], '#fff6d8', { emissive: '#fff2c0', ei: 0.6, detail: true }),
          box([0.55, 0.62, 2.16], [0.4, 0.12, 0.04], '#fff6d8', { emissive: '#fff2c0', ei: 0.6, detail: true }),
        ],
      }
    }
    case 'plant':
      return {
        w: 0.6,
        d: 0.6,
        prims: [
          cyl([0, 0.2, 0], 0.22, 0.4, '#8a8f95', { rough: 0.7 }),
          sph([0, 0.85, 0], 0.4, '#3f7d4a', { rough: 0.9 }),
          sph([0.15, 1.2, 0.05], 0.28, '#4f9158', { rough: 0.9, detail: true }),
        ],
      }
    case 'shelf':
      return {
        w: o.len ?? 1.6,
        d: 0.35,
        prims: [rbox([0, 1.0, 0], [o.len ?? 1.6, 2.0, 0.35], WOOD, { rough: 0.6 })],
      }
    case 'bench':
      return {
        w: o.len ?? 1.4,
        d: 0.4,
        prims: [rbox([0, 0.25, 0], [o.len ?? 1.4, 0.5, 0.4], WOOD_DARK, { rough: 0.6 })],
      }
  }
}
