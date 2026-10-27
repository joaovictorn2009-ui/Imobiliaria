import type {
  BuiltPlan,
  DoorArc,
  DoorSpec,
  FurnM,
  Opening,
  PlanSpec,
  RoofBox,
  RoomM,
  RoomSpec,
  Side,
  WallSeg,
} from './types'

// Tudo é calculado em "unidades" de 10 cm, para as arestas dos cômodos coincidirem exatamente.
const U = 10

interface UnitEdge {
  a?: string // cômodo acima (h) ou à esquerda (v)
  b?: string // cômodo abaixo (h) ou à direita (v)
}

interface IRect {
  x0: number
  x1: number
  z0: number
  z1: number
}

const hKey = (iz: number, ix: number) => `h|${iz}|${ix}`
const vKey = (ix: number, iz: number) => `v|${ix}|${iz}`

function toIRect(r: { x: number; z: number; w: number; d: number }, k: number): IRect {
  return {
    x0: Math.round(r.x * k * U),
    x1: Math.round((r.x + r.w) * k * U),
    z0: Math.round(r.z * k * U),
    z1: Math.round((r.z + r.d) * k * U),
  }
}

export function buildPlan(spec: PlanSpec): BuiltPlan {
  const roomById = new Map<string, RoomSpec>(spec.rooms.map((r) => [r.id, r]))

  // 1) fator de escala para a área total fechar com a do anúncio
  const designNet = spec.rooms
    .filter((r) => !r.covered)
    .reduce((s, r) => s + r.rects.reduce((a, q) => a + q.w * q.d, 0), 0)
  const designCovered = spec.rooms
    .filter((r) => r.covered)
    .reduce((s, r) => s + r.rects.reduce((a, q) => a + q.w * q.d, 0), 0)
  // as paredes ocupam cerca de 11% da área construída
  const k = Math.sqrt((spec.targetArea * 0.89) / (designNet + designCovered))

  // 2) arestas unitárias
  const edges = new Map<string, UnitEdge>()
  const put = (key: string, side: 'a' | 'b', id: string) => {
    const e = edges.get(key) ?? {}
    e[side] = id
    edges.set(key, e)
  }
  const irects = new Map<string, IRect[]>()
  for (const room of spec.rooms) {
    const list = room.rects.map((r) => toIRect(r, k))
    irects.set(room.id, list)
    for (const q of list) {
      for (let ix = q.x0; ix < q.x1; ix++) {
        put(hKey(q.z0, ix), 'b', room.id)
        put(hKey(q.z1, ix), 'a', room.id)
      }
      for (let iz = q.z0; iz < q.z1; iz++) {
        put(vKey(q.x0, iz), 'b', room.id)
        put(vKey(q.x1, iz), 'a', room.id)
      }
    }
  }

  // 3) paredes: cada aresta entre dois cômodos diferentes (ou na borda) vira parede
  interface Unit {
    idx: number
    exterior: boolean
    tone?: 'timber' | 'stone'
  }
  const lines = new Map<string, Unit[]>() // "h|iz" ou "v|ix"
  const sideOf = (axis: 'h' | 'v', e: UnitEdge): Side | null => {
    if (e.a && e.b) return null
    if (axis === 'h') return e.b ? 'n' : 's'
    return e.b ? 'w' : 'e'
  }

  for (const [key, e] of edges) {
    const [axis, lineStr, idxStr] = key.split('|')
    if (e.a && e.b && e.a === e.b) continue
    const ext = !(e.a && e.b)
    let tone: 'timber' | 'stone' | undefined
    if (ext) {
      const rid = (e.a ?? e.b) as string
      const room = roomById.get(rid)
      const side = sideOf(axis as 'h' | 'v', e) as Side
      if (room?.open?.includes(side)) continue
      tone = room?.tone
    }
    const lk = `${axis}|${lineStr}`
    const arr = lines.get(lk) ?? []
    arr.push({ idx: Number(idxStr), exterior: ext, tone })
    lines.set(lk, arr)
  }

  const walls: WallSeg[] = []
  for (const [lk, arr] of lines) {
    const [axis, lineStr] = lk.split('|') as ['h' | 'v', string]
    arr.sort((p, q) => p.idx - q.idx)
    let start = arr[0]
    let prev = arr[0]
    const flush = (end: Unit) => {
      walls.push({
        axis,
        line: Number(lineStr) / U,
        a0: start.idx / U,
        a1: (end.idx + 1) / U,
        exterior: start.exterior,
        tone: start.tone,
        openings: [],
      })
    }
    for (let i = 1; i < arr.length; i++) {
      const cur = arr[i]
      if (cur.idx === prev.idx + 1 && cur.exterior === start.exterior && cur.tone === start.tone) {
        prev = cur
        continue
      }
      flush(prev)
      start = cur
      prev = cur
    }
    flush(prev)
  }

  // 4) localizar trechos de aresta para portas e janelas
  interface Run {
    axis: 'h' | 'v'
    line: number // em unidades
    i0: number
    i1: number // exclusivo
    aRoom?: string
    bRoom?: string
  }

  const runsFor = (pred: (e: UnitEdge) => boolean): Run[] => {
    const hits: { axis: 'h' | 'v'; line: number; idx: number; e: UnitEdge }[] = []
    for (const [key, e] of edges) {
      if (!pred(e)) continue
      const [axis, lineStr, idxStr] = key.split('|')
      hits.push({ axis: axis as 'h' | 'v', line: Number(lineStr), idx: Number(idxStr), e })
    }
    hits.sort((p, q) => (p.axis + p.line).localeCompare(q.axis + q.line) || p.idx - q.idx)
    const runs: Run[] = []
    for (const h of hits) {
      const last = runs[runs.length - 1]
      if (last && last.axis === h.axis && last.line === h.line && last.i1 === h.idx) last.i1 = h.idx + 1
      else runs.push({ axis: h.axis, line: h.line, i0: h.idx, i1: h.idx + 1, aRoom: h.e.a, bRoom: h.e.b })
    }
    return runs
  }

  const longest = (runs: Run[]): Run | null => runs.reduce<Run | null>((best, r) => (!best || r.i1 - r.i0 > best.i1 - best.i0 ? r : best), null)

  const findBetween = (a: string, b: string) =>
    longest(runsFor((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a)))

  const findExterior = (room: string, side: Side) =>
    longest(
      runsFor((e) => {
        if (e.a && e.b) return false
        const rid = e.a ?? e.b
        if (rid !== room) return false
        // h: b = abaixo => face norte; a = acima => face sul. v: b = direita => face oeste; a => leste
        const isB = Boolean(e.b)
        return (side === 'n' && isB) || (side === 's' && !isB) || (side === 'w' && isB) || (side === 'e' && !isB)
      }).filter((r) => (side === 'n' || side === 's' ? r.axis === 'h' : r.axis === 'v'))
    )

  const arcs: DoorArc[] = []

  const addOpening = (run: Run, frac: number, w: number, o: Omit<Opening, 'at' | 'w'>) => {
    const len = run.i1 - run.i0
    let wu = Math.round(w * U)
    wu = Math.min(wu, len - 2)
    if (wu < 4) return null
    const half = wu / 2
    const ic = Math.min(run.i1 - half, Math.max(run.i0 + half, run.i0 + frac * len))
    const seg = walls.find((s) => s.axis === run.axis && Math.round(s.line * U) === run.line && ic >= s.a0 * U - 0.01 && ic <= s.a1 * U + 0.01)
    if (!seg) return null
    seg.openings.push({ ...o, at: ic / U - seg.a0, w: wu / U })
    return { ic, wu, seg }
  }

  const doorArc = (run: Run, ic: number, wu: number, into: string | undefined, hinge: 'lo' | 'hi') => {
    const along = run.axis === 'h' ? 1 : 0 // h: ao longo de x; v: ao longo de z
    const lo = (ic - wu / 2) / U
    const hi = (ic + wu / 2) / U
    const fixed = run.line / U
    const hp = hinge === 'lo' ? lo : hi
    const dirAlong = hinge === 'lo' ? 1 : -1
    // para que lado o cômodo `into` está
    const intoIsA = into ? run.aRoom === into : false
    const intoIsB = into ? run.bRoom === into : true
    const sign = intoIsA && !intoIsB ? -1 : 1
    const w = wu / U
    if (along) arcs.push({ hx: hp, hz: fixed, dx: dirAlong, dz: 0, nx: 0, nz: sign, w })
    else arcs.push({ hx: fixed, hz: hp, dx: 0, dz: dirAlong, nx: sign, nz: 0, w })
  }

  const place = (d: DoorSpec) => {
    const run = d.b ? findBetween(d.a, d.b) : d.side ? findExterior(d.a, d.side) : null
    if (!run) return
    const len = (run.i1 - run.i0) / U
    let w = d.w ?? (d.kind === 'void' ? 1.2 : d.kind === 'slide' ? 2.4 : d.kind === 'garage' ? len * 0.9 : 0.9)
    if (d.wFrac) w = len * d.wFrac
    const kind: Opening['kind'] = d.kind === 'slide' ? 'glass' : d.kind === 'garage' ? 'garage' : d.kind
    const top = d.kind === 'garage' ? 2.6 : d.kind === 'slide' ? 2.6 : d.kind === 'void' ? 2.5 : 2.2
    const res = addOpening(run, d.frac ?? 0.5, w, { bottom: 0, top, kind })
    if (res && d.kind === 'door') doorArc(run, res.ic, res.wu, d.into ?? d.b ?? d.a, d.hinge ?? 'lo')
  }
  spec.doors.forEach(place)

  for (const w of spec.windows) {
    const run = findExterior(w.room, w.side)
    if (!run) continue
    addOpening(run, w.frac, w.w, { bottom: w.sill ?? 0.9, top: w.top ?? 2.3, kind: 'glass' })
  }

  // 5) cômodos em metros
  const rooms: RoomM[] = spec.rooms.map((r) => {
    const rs = (irects.get(r.id) ?? []).map((q) => ({ x: q.x0 / U, z: q.z0 / U, w: (q.x1 - q.x0) / U, d: (q.z1 - q.z0) / U }))
    const area = rs.reduce((s, q) => s + q.w * q.d, 0)
    const big = rs.reduce((b, q) => (q.w * q.d > b.w * b.d ? q : b), rs[0])
    return {
      id: r.id,
      name: r.name,
      floor: r.floor,
      desc: r.desc,
      rects: rs,
      area,
      cx: big.x + big.w / 2,
      cz: big.z + big.d / 2,
      w: big.w,
      d: big.d,
      covered: Boolean(r.covered),
      open: r.open ?? [],
      short: r.short ?? r.name,
    }
  })

  // 6) telhado (laje) por retângulo, com beiral nos lados externos
  const roofs: RoofBox[] = []
  const slabs: RoofBox[] = []
  const posts: { x: number; z: number }[] = []
  for (const room of spec.rooms) {
    for (const q of irects.get(room.id) ?? []) {
      const side = (s: Side) => {
        // há vizinho nessa face?
        const keys: string[] = []
        if (s === 'n') for (let ix = q.x0; ix < q.x1; ix++) keys.push(hKey(q.z0, ix))
        if (s === 's') for (let ix = q.x0; ix < q.x1; ix++) keys.push(hKey(q.z1, ix))
        if (s === 'w') for (let iz = q.z0; iz < q.z1; iz++) keys.push(vKey(q.x0, iz))
        if (s === 'e') for (let iz = q.z0; iz < q.z1; iz++) keys.push(vKey(q.x1, iz))
        return keys.some((key) => {
          const e = edges.get(key)
          return e && e.a && e.b && e.a !== e.b
        })
      }
      const over = (s: Side) => (side(s) ? 0 : room.open?.includes(s) ? 1.4 : 0.6)
      const ox0 = over('w')
      const ox1 = over('e')
      const oz0 = over('n')
      const oz1 = over('s')
      const x = q.x0 / U - ox0
      const z = q.z0 / U - oz0
      const w = (q.x1 - q.x0) / U + ox0 + ox1
      const d = (q.z1 - q.z0) / U + oz0 + oz1
      roofs.push({ x, z, w, d })
      // laje sem folga: lajes vizinhas não se sobrepõem (evita cintilação); as paredes cobrem a borda
      slabs.push({ x: q.x0 / U, z: q.z0 / U, w: (q.x1 - q.x0) / U, d: (q.z1 - q.z0) / U })
      // pilares nos cantos de lados abertos
      const open = room.open ?? []
      if (open.length) {
        const corners: [number, number, Side[]][] = [
          [q.x0 / U - ox0 + 0.2, q.z0 / U - oz0 + 0.2, ['n', 'w']],
          [(q.x1 / U) + ox1 - 0.2, q.z0 / U - oz0 + 0.2, ['n', 'e']],
          [q.x0 / U - ox0 + 0.2, (q.z1 / U) + oz1 - 0.2, ['s', 'w']],
          [(q.x1 / U) + ox1 - 0.2, (q.z1 / U) + oz1 - 0.2, ['s', 'e']],
        ]
        for (const [cx, cz, sides] of corners) if (sides.some((s) => open.includes(s)) && sides.every((s) => open.includes(s))) posts.push({ x: cx, z: cz })
      }
    }
  }

  // 7) móveis
  const furniture: FurnM[] = spec.furniture.flatMap((f): FurnM[] => {
    const room = rooms.find((r) => r.id === f.room)
    const q = room?.rects[f.rect ?? 0]
    if (!room || !q) return []
    return [{ type: f.type, x: q.x + f.fx * q.w, z: q.z + f.fz * q.d, rot: ((f.rot ?? 0) * Math.PI) / 180, opts: f.opts, room: f.room }]
  })

  const xs = rooms.flatMap((r) => r.rects.flatMap((q) => [q.x, q.x + q.w]))
  const zs = rooms.flatMap((r) => r.rects.flatMap((q) => [q.z, q.z + q.d]))
  const bbox = { minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs) }

  return {
    spec,
    k,
    rooms,
    walls,
    arcs,
    roofs,
    slabs,
    furniture,
    posts,
    bbox,
    netArea: rooms.filter((r) => !r.covered).reduce((s, r) => s + r.area, 0),
    pool: { x: spec.pool.x * k, z: spec.pool.z * k, w: spec.pool.w * k, d: spec.pool.d * k },
    ceiling: spec.ceiling,
  }
}
