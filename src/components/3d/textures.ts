import * as THREE from 'three'

// Texturas geradas em código (canvas pequeno): não baixam nenhuma imagem.

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

type Draw = (ctx: CanvasRenderingContext2D, size: number, r: () => number) => void

function make(size: number, seed: number, draw: Draw, srgb = true) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  draw(ctx, size, rng(seed))
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 4
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

function shade(hex: string, amt: number) {
  const c = new THREE.Color(hex)
  c.offsetHSL(0, 0, amt)
  return `#${c.getHexString()}`
}

const noise = (ctx: CanvasRenderingContext2D, size: number, r: () => number, count: number, alpha: number) => {
  for (let i = 0; i < count; i++) {
    const v = Math.floor(r() * 255)
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha})`
    ctx.fillRect(r() * size, r() * size, 1 + r() * 2, 1 + r() * 2)
  }
}

export function woodTexture(base: string, seed = 1) {
  return make(512, seed, (ctx, size, r) => {
    const rows = 8
    const h = size / rows
    for (let i = 0; i < rows; i++) {
      ctx.fillStyle = shade(base, (r() - 0.5) * 0.12)
      ctx.fillRect(0, i * h, size, h)
      // juntas entre tábuas (deslocadas por linha)
      ctx.fillStyle = 'rgba(30,18,8,0.55)'
      ctx.fillRect(0, i * h, size, 2)
      const x = r() * size
      ctx.fillRect(x, i * h, 2, h)
      // veios
      for (let k = 0; k < 14; k++) {
        ctx.strokeStyle = `rgba(60,35,15,${0.05 + r() * 0.1})`
        ctx.lineWidth = 1
        const y = i * h + 3 + r() * (h - 6)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(size * 0.3, y + (r() - 0.5) * 4, size * 0.6, y + (r() - 0.5) * 4, size, y)
        ctx.stroke()
      }
    }
  })
}

export function tileTexture(base: string, seed = 2) {
  return make(512, seed, (ctx, size, r) => {
    const n = 4
    const s = size / n
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        ctx.fillStyle = shade(base, (r() - 0.5) * 0.05)
        ctx.fillRect(x * s, y * s, s, s)
      }
    }
    ctx.fillStyle = 'rgba(90,90,90,0.65)'
    for (let i = 0; i <= n; i++) {
      ctx.fillRect(i * s - 1.5, 0, 3, size)
      ctx.fillRect(0, i * s - 1.5, size, 3)
    }
    noise(ctx, size, r, 1500, 0.05)
  })
}

export function stuccoTexture(base: string, seed = 3) {
  return make(256, seed, (ctx, size, r) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    noise(ctx, size, r, 2600, 0.07)
  })
}

export function timberTexture(base: string, seed = 4) {
  return make(512, seed, (ctx, size, r) => {
    const boards = 10
    const w = size / boards
    for (let i = 0; i < boards; i++) {
      ctx.fillStyle = shade(base, (r() - 0.5) * 0.1)
      ctx.fillRect(i * w, 0, w, size)
      ctx.fillStyle = 'rgba(20,10,4,0.6)'
      ctx.fillRect(i * w, 0, 2.5, size)
      for (let k = 0; k < 10; k++) {
        ctx.strokeStyle = `rgba(50,28,12,${0.06 + r() * 0.1})`
        const x = i * w + 4 + r() * (w - 8)
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x + (r() - 0.5) * 4, size)
        ctx.stroke()
      }
    }
  })
}

export function concreteTexture(base: string, seed = 5) {
  return make(256, seed, (ctx, size, r) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    noise(ctx, size, r, 3500, 0.09)
  })
}

export function grassTexture(seed = 6) {
  return make(256, seed, (ctx, size, r) => {
    ctx.fillStyle = '#4c8647'
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 2600; i++) {
      const g = 70 + Math.floor(r() * 70)
      ctx.fillStyle = `rgba(${50 + r() * 40},${g + 25},${40 + r() * 30},0.45)`
      ctx.fillRect(r() * size, r() * size, 1, 2 + r() * 3)
    }
  })
}

export function stoneCladTexture(seed = 30) {
  return make(512, seed, (ctx, size, r) => {
    ctx.fillStyle = '#7c766c'
    ctx.fillRect(0, 0, size, size)
    let y = 0
    while (y < size) {
      const h = 46 + r() * 28
      let x = -r() * 70
      while (x < size) {
        const w = 70 + r() * 100
        const g = 118 + Math.floor(r() * 62)
        ctx.fillStyle = `rgb(${g},${g - 6},${g - 14})`
        ctx.fillRect(x + 3, y + 3, w - 6, h - 6)
        ctx.fillStyle = 'rgba(0,0,0,0.14)'
        ctx.fillRect(x + 3, y + h - 10, w - 6, 7)
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.fillRect(x + 3, y + 3, w - 6, 4)
        x += w
      }
      y += h
    }
    noise(ctx, size, r, 1800, 0.06)
  })
}

export function paversTexture(seed = 31) {
  return make(512, seed, (ctx, size, r) => {
    ctx.fillStyle = '#58595d'
    ctx.fillRect(0, 0, size, size)
    const rows = 16
    const bh = size / rows
    const bw = size / 8
    for (let j = 0; j < rows; j++) {
      const off = j % 2 ? bw / 2 : 0
      for (let i = -1; i < 9; i++) {
        const g = 128 + Math.floor(r() * 36)
        ctx.fillStyle = `rgb(${g},${g - 4},${g - 8})`
        ctx.fillRect(i * bw + off + 1.5, j * bh + 1.5, bw - 3, bh - 3)
      }
    }
    noise(ctx, size, r, 1200, 0.05)
  })
}

/** Ruído em tons de cinza, usado como relevo (bump) e para a ondulação da água. */
export function bumpTexture(seed = 7) {
  return make(
    128,
    seed,
    (ctx, size, r) => {
      ctx.fillStyle = '#808080'
      ctx.fillRect(0, 0, size, size)
      noise(ctx, size, r, 2200, 0.5)
    },
    false
  )
}

export interface TextureSet {
  wood: THREE.Texture
  woodDark: THREE.Texture
  tile: THREE.Texture
  tileLight: THREE.Texture
  stone: THREE.Texture
  stucco: THREE.Texture
  timber: THREE.Texture
  concrete: THREE.Texture
  roof: THREE.Texture
  deck: THREE.Texture
  grass: THREE.Texture
  stoneClad: THREE.Texture
  pavers: THREE.Texture
  bump: THREE.Texture
  water: THREE.Texture
}

export function createTextures(): TextureSet {
  return {
    wood: woodTexture('#b98b5e', 11),
    woodDark: woodTexture('#7a5334', 12),
    tile: tileTexture('#d8d3ca', 13),
    tileLight: tileTexture('#cfd8dc', 14),
    stone: tileTexture('#a8a29a', 15),
    stucco: stuccoTexture('#f1ede6', 16),
    timber: timberTexture('#8b5e3c', 17),
    concrete: concreteTexture('#d6d0c6', 18),
    roof: concreteTexture('#7d8189', 19),
    deck: woodTexture('#9a8a76', 20),
    grass: grassTexture(21),
    stoneClad: stoneCladTexture(30),
    pavers: paversTexture(31),
    bump: bumpTexture(22),
    water: bumpTexture(23),
  }
}

export function disposeTextures(set: TextureSet) {
  Object.values(set).forEach((t) => t.dispose())
}

/** Caixa com UVs proporcionais ao tamanho real, para a textura não esticar. */
export function tbox(sx: number, sy: number, sz: number, tile = 2) {
  const g = new THREE.BoxGeometry(sx, sy, sz)
  const uv = g.attributes.uv
  const dims = [
    [sz, sy],
    [sz, sy],
    [sx, sz],
    [sx, sz],
    [sx, sy],
    [sx, sy],
  ]
  for (let f = 0; f < 6; f++) {
    for (let i = 0; i < 4; i++) {
      const idx = f * 4 + i
      uv.setXY(idx, (uv.getX(idx) * dims[f][0]) / tile, (uv.getY(idx) * dims[f][1]) / tile)
    }
  }
  return g
}
