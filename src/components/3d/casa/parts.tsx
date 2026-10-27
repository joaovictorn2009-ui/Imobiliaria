'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { tbox } from '../textures'
import { furnishing, type Prim } from '../plans/furniture'
import { WALL_EXT, WALL_INT, type BuiltPlan, type DoorArc, type FurnM, type RoomM, type WallSeg } from '../plans/types'
import type { CasaAssets } from './assets'

const fmt = (n: number, digits = 1) => n.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })

// ---------------------------------------------------------------- paredes

interface WBox {
  cx: number
  cy: number
  cz: number
  sx: number
  sy: number
  sz: number
  kind: 'wall' | 'glass' | 'frame' | 'door'
}

const FRAME = 0.06

function segBoxes(seg: WallSeg, H: number): WBox[] {
  const t = seg.exterior ? WALL_EXT : WALL_INT
  const len = seg.a1 - seg.a0
  const ops = [...seg.openings].sort((a, b) => a.at - b.at)
  type Part = { a0: number; a1: number; y0: number; y1: number; kind: WBox['kind'] }
  const parts: Part[] = []
  let cursor = 0
  for (const o of ops) {
    const s = o.at - o.w / 2
    const e = o.at + o.w / 2
    if (s > cursor + 0.001) parts.push({ a0: cursor, a1: s, y0: 0, y1: H, kind: 'wall' })
    if (o.bottom > 0.001) parts.push({ a0: s, a1: e, y0: 0, y1: o.bottom, kind: 'wall' })
    if (o.top < H - 0.001) parts.push({ a0: s, a1: e, y0: o.top, y1: H, kind: 'wall' })
    if (o.kind === 'glass') {
      parts.push({ a0: s, a1: e, y0: o.bottom, y1: o.top, kind: 'glass' })
      parts.push({ a0: s, a1: e, y0: o.top - FRAME, y1: o.top, kind: 'frame' })
      parts.push({ a0: s, a1: e, y0: o.bottom, y1: o.bottom + FRAME, kind: 'frame' })
      parts.push({ a0: s, a1: s + FRAME, y0: o.bottom, y1: o.top, kind: 'frame' })
      parts.push({ a0: e - FRAME, a1: e, y0: o.bottom, y1: o.top, kind: 'frame' })
      if (o.w > 2.2) {
        const n = Math.floor(o.w / 1.4)
        for (let i = 1; i < n; i++) {
          const c = s + (o.w * i) / n
          parts.push({ a0: c - FRAME / 2, a1: c + FRAME / 2, y0: o.bottom, y1: o.top, kind: 'frame' })
        }
      }
    }
    if (o.kind === 'door') parts.push({ a0: s + 0.02, a1: e - 0.02, y0: 0, y1: o.top, kind: 'door' })
    cursor = e
  }
  if (cursor < len - 0.001) parts.push({ a0: cursor, a1: len, y0: 0, y1: H, kind: 'wall' })

  return parts.map((p) => {
    // as pontas avançam meia espessura para fechar os cantos
    const a0 = p.kind === 'wall' && p.a0 <= 0.001 ? -t / 2 : p.a0
    const a1 = p.kind === 'wall' && p.a1 >= len - 0.001 ? len + t / 2 : p.a1
    const along = seg.a0 + (a0 + a1) / 2
    const length = a1 - a0
    const thick = p.kind === 'glass' ? 0.04 : p.kind === 'door' ? 0.06 : p.kind === 'frame' ? t * 0.55 : t
    const h = seg.axis === 'h'
    return {
      cx: h ? along : seg.line,
      cz: h ? seg.line : along,
      cy: (p.y0 + p.y1) / 2,
      sx: h ? length : thick,
      sz: h ? thick : length,
      sy: p.y1 - p.y0,
      kind: p.kind,
    }
  })
}

function Wall({ seg, H, assets, isPlan }: { seg: WallSeg; H: number; assets: CasaAssets; isPlan: boolean }) {
  const boxes = useMemo(
    () => segBoxes(seg, H).map((b) => ({ ...b, geo: tbox(b.sx, b.sy, b.sz, seg.tone === 'timber' ? 2 : seg.tone === 'stone' ? 3 : 2.5) })),
    [seg, H]
  )
  useEffect(() => () => boxes.forEach((b) => b.geo.dispose()), [boxes])

  const real = assets.real
  const wallMat = seg.exterior ? (seg.tone === 'timber' ? real.timber : seg.tone === 'stone' ? real.stone : real.wallExt) : real.wallInt

  return (
    <>
      {boxes.map((b, i) => {
        if (isPlan && b.kind === 'door') return null
        const material = isPlan
          ? b.kind === 'glass'
            ? assets.plan.glass
            : b.kind === 'frame'
              ? assets.plan.frame
              : assets.plan.wall
          : b.kind === 'glass'
            ? real.glass
            : b.kind === 'frame'
              ? real.frame
              : b.kind === 'door'
                ? real.door
                : wallMat
        return (
          <mesh
            key={i}
            position={[b.cx, b.cy, b.cz]}
            geometry={b.geo}
            material={material}
            castShadow={b.kind !== 'glass'}
            receiveShadow
          />
        )
      })}
    </>
  )
}

export function Walls({ plan, assets, isPlan }: { plan: BuiltPlan; assets: CasaAssets; isPlan: boolean }) {
  return (
    <>
      {plan.walls.map((w, i) => (
        <Wall key={i} seg={w} H={plan.ceiling} assets={assets} isPlan={isPlan} />
      ))}
    </>
  )
}

// ---------------------------------------------------------------- pisos, lajes e telhado

function TexBox({
  x,
  y,
  z,
  w,
  h,
  d,
  tile = 2,
  material,
  cast = true,
  receive = true,
}: {
  x: number
  y: number
  z: number
  w: number
  h: number
  d: number
  tile?: number
  material: THREE.Material
  cast?: boolean
  receive?: boolean
}) {
  const geo = useMemo(() => tbox(w, h, d, tile), [w, h, d, tile])
  useEffect(() => () => geo.dispose(), [geo])
  return <mesh position={[x, y, z]} geometry={geo} material={material} castShadow={cast} receiveShadow={receive} />
}

export { TexBox }

export function Floors({ plan, assets, isPlan }: { plan: BuiltPlan; assets: CasaAssets; isPlan: boolean }) {
  return (
    <>
      {plan.slabs.map((s, i) => (
        <TexBox
          key={`s${i}`}
          x={s.x + s.w / 2}
          y={-0.15}
          z={s.z + s.d / 2}
          w={s.w}
          h={0.3}
          d={s.d}
          tile={3}
          material={isPlan ? assets.plan.slab : assets.real.slab}
        />
      ))}
      {plan.rooms.flatMap((r) =>
        r.rects.map((q, i) => (
          <TexBox
            key={`${r.id}${i}`}
            x={q.x + q.w / 2}
            y={0.03}
            z={q.z + q.d / 2}
            w={q.w - 0.02}
            h={0.06}
            d={q.d - 0.02}
            tile={r.floor === 'tile' || r.floor === 'tileLight' ? 1.6 : 2.4}
            material={isPlan ? assets.plan.floors[r.floor] : assets.real.floors[r.floor]}
            cast={false}
          />
        ))
      )}
    </>
  )
}

export function Roof({ plan, assets }: { plan: BuiltPlan; assets: CasaAssets }) {
  const H = plan.ceiling
  return (
    <>
      {plan.roofs.map((r, i) => (
        <group key={i}>
          <TexBox x={r.x + r.w / 2} y={H + 0.13} z={r.z + r.d / 2} w={r.w} h={0.26} d={r.d} tile={3} material={assets.real.roofTop} />
          <TexBox x={r.x + r.w / 2} y={H + 0.02} z={r.z + r.d / 2} w={r.w - 0.1} h={0.04} d={r.d - 0.1} tile={2} material={assets.real.roofSoffit} cast={false} />
        </group>
      ))}
      {plan.posts.map((p, i) => (
        <TexBox key={`p${i}`} x={p.x} y={H / 2} z={p.z} w={0.3} h={H} d={0.3} tile={2} material={assets.real.stone} />
      ))}
    </>
  )
}

// ---------------------------------------------------------------- móveis

function useMatCache(): Map<string, THREE.Material> {
  const cache = useMemo(() => new Map<string, THREE.Material>(), [])
  useEffect(
    () => () => {
      cache.forEach((m) => m.dispose())
      cache.clear()
    },
    [cache]
  )
  return cache
}

function getMat(cache: Map<string, THREE.Material>, p: Prim): THREE.Material {
  const key = `${p.c}|${p.rough ?? 0.6}|${p.metal ?? 0}|${p.emissive ?? ''}|${p.ei ?? 0}`
  let m = cache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color: p.c,
      roughness: p.rough ?? 0.6,
      metalness: p.metal ?? 0,
      emissive: p.emissive ?? '#000000',
      emissiveIntensity: p.ei ?? 0,
    })
    cache.set(key, m)
  }
  return m
}

function PrimMesh({ prim, material, isPlan }: { prim: Prim; material: THREE.Material; isPlan: boolean }) {
  const edges = isPlan ? <Edges threshold={25} color="#7b8490" /> : null
  if (prim.k === 'cyl') {
    return (
      <mesh position={prim.p} material={material} castShadow receiveShadow>
        <cylinderGeometry args={[prim.s[0], prim.s[0], prim.s[1], 20]} />
        {edges}
      </mesh>
    )
  }
  if (prim.k === 'sph') {
    return (
      <mesh position={prim.p} material={material} castShadow receiveShadow>
        <sphereGeometry args={[prim.s[0], 18, 14]} />
        {edges}
      </mesh>
    )
  }
  if (prim.k === 'rbox' && !isPlan) {
    const radius = Math.min(0.06, Math.min(prim.s[0], prim.s[1], prim.s[2]) * 0.22)
    return (
      <RoundedBox args={prim.s} radius={radius} smoothness={3} position={prim.p} material={material} castShadow receiveShadow />
    )
  }
  return (
    <mesh position={prim.p} material={material} castShadow receiveShadow>
      <boxGeometry args={prim.s} />
      {edges}
    </mesh>
  )
}

function FurnItem({ f, assets, isPlan, cache, baseY }: { f: FurnM; assets: CasaAssets; isPlan: boolean; cache: Map<string, THREE.Material>; baseY: number }) {
  const fur = useMemo(() => furnishing(f.type, f.opts), [f.type, f.opts])
  return (
    <group position={[f.x, baseY, f.z]} rotation={[0, f.rot, 0]}>
      {fur.prims.map((p, i) => {
        if (isPlan && p.detail && p.k !== 'sph') return null
        return <PrimMesh key={i} prim={p} isPlan={isPlan} material={isPlan ? assets.plan.furniture : getMat(cache, p)} />
      })}
    </group>
  )
}

export function Furniture({ items, assets, isPlan, baseY = 0.06 }: { items: FurnM[]; assets: CasaAssets; isPlan: boolean; baseY?: number }) {
  const cache = useMatCache()
  return (
    <>
      {items.map((f, i) => (
        <FurnItem key={i} f={f} assets={assets} isPlan={isPlan} cache={cache} baseY={baseY} />
      ))}
    </>
  )
}

// ---------------------------------------------------------------- destaque de cômodo

export function Highlight({ room }: { room: RoomM }) {
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  useFrame(({ clock }) => {
    const o = 0.38 + Math.sin(clock.elapsedTime * 3) * 0.14
    mats.current.forEach((m) => m && (m.opacity = o))
  })
  return (
    <>
      {room.rects.map((q, i) => (
        <mesh key={i} position={[q.x + q.w / 2, 0.1, q.z + q.d / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[q.w - 0.12, q.d - 0.12]} />
          <meshBasicMaterial
            ref={(m) => {
              mats.current[i] = m
            }}
            color="#f5c76a"
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  )
}

// ---------------------------------------------------------------- rótulos dos cômodos

export function RoomLabels({
  plan,
  selected,
  onSelect,
  detailed,
  dense = false,
}: {
  plan: BuiltPlan
  selected: string | null
  onSelect: (id: string) => void
  detailed: boolean
  /** telas pequenas: só o nome curto, sem medidas */
  dense?: boolean
}) {
  return (
    <>
      {plan.rooms.map((r) => {
        const small = dense || r.area < 13 || r.w < 3.2
        // no corte 3D (e em telas pequenas), cômodos minúsculos só mostram rótulo quando selecionados
        if ((!detailed || dense) && r.area < 9 && selected !== r.id) return null
        const name = small ? r.short : r.name
        return (
          <Html key={r.id} position={[r.cx, 0.4, r.cz]} center zIndexRange={[20, 0]}>
            <button
              type="button"
              onClick={() => onSelect(r.id)}
              title={`${r.name} · ${fmt(r.area)} m²`}
              className={`pointer-events-auto flex flex-col items-center whitespace-nowrap rounded-md border px-1.5 py-0.5 text-center leading-tight shadow-sm transition-colors ${
                selected === r.id
                  ? 'border-[#d4a843] bg-[#d4a843] text-[#1a1408]'
                  : detailed
                    ? 'border-gray-300/80 bg-white/80 text-gray-800 hover:border-[#d4a843] hover:bg-white'
                    : 'border-white/25 bg-black/60 text-white backdrop-blur hover:border-[#e8c98f]'
              }`}
            >
              <span className={`font-semibold ${small ? 'text-[9px]' : 'text-[11px]'}`}>{name}</span>
              {!dense && (detailed || !small) && <span className="text-[9px] opacity-75">{fmt(r.area)} m²</span>}
              {detailed && !small && !dense && r.rects.length === 1 && (
                <span className="text-[8.5px] opacity-55">
                  {fmt(r.w)} × {fmt(r.d)}
                </span>
              )}
            </button>
          </Html>
        )
      })}
    </>
  )
}

// ---------------------------------------------------------------- acessórios da planta técnica

function Line({ a, b, color = '#3b414a', thick = 0.05 }: { a: [number, number]; b: [number, number]; color?: string; thick?: number }) {
  const dx = b[0] - a[0]
  const dz = b[1] - a[1]
  const len = Math.hypot(dx, dz)
  return (
    <mesh position={[(a[0] + b[0]) / 2, 0.14, (a[1] + b[1]) / 2]} rotation={[0, -Math.atan2(dz, dx), 0]}>
      <boxGeometry args={[len, 0.02, thick]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function DoorSwing({ arc }: { arc: DoorArc }) {
  const geo = useMemo(() => {
    const phi0 = Math.atan2(arc.dz, arc.dx)
    const phi1 = Math.atan2(arc.nz, arc.nx)
    const th0 = -phi0
    const th1 = -phi1
    let delta = th1 - th0
    while (delta > Math.PI) delta -= Math.PI * 2
    while (delta < -Math.PI) delta += Math.PI * 2
    const start = delta > 0 ? th0 : th1
    return new THREE.RingGeometry(arc.w - 0.025, arc.w, 28, 1, start, Math.PI / 2)
  }, [arc])
  useEffect(() => () => geo.dispose(), [geo])
  const leafLen = arc.w
  return (
    <group>
      <mesh position={[arc.hx, 0.13, arc.hz]} rotation={[-Math.PI / 2, 0, 0]} geometry={geo}>
        <meshBasicMaterial color="#59606b" side={THREE.DoubleSide} />
      </mesh>
      {/* folha da porta aberta */}
      <mesh position={[arc.hx + (arc.nx * leafLen) / 2, 0.14, arc.hz + (arc.nz * leafLen) / 2]}>
        <boxGeometry args={[arc.nx !== 0 ? leafLen : 0.05, 0.02, arc.nx !== 0 ? 0.05 : leafLen]} />
        <meshBasicMaterial color="#59606b" />
      </mesh>
    </group>
  )
}

export function DoorArcs({ arcs }: { arcs: DoorArc[] }) {
  return (
    <>
      {arcs.map((a, i) => (
        <DoorSwing key={i} arc={a} />
      ))}
    </>
  )
}

export function Dimensions({ plan }: { plan: BuiltPlan }) {
  const { minX, maxX, minZ, maxZ } = plan.bbox
  const off = 1.8
  const w = maxX - minX
  const d = maxZ - minZ
  const tick = 0.5
  const label = 'whitespace-nowrap rounded border border-gray-400 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm'
  return (
    <>
      {/* largura total */}
      <Line a={[minX, minZ - off]} b={[maxX, minZ - off]} />
      <Line a={[minX, minZ - off - tick]} b={[minX, minZ - off + tick]} />
      <Line a={[maxX, minZ - off - tick]} b={[maxX, minZ - off + tick]} />
      <Html position={[(minX + maxX) / 2, 0.2, minZ - off]} center zIndexRange={[15, 0]}>
        <span className={label}>{fmt(w)} m</span>
      </Html>
      {/* profundidade total */}
      <Line a={[minX - off, minZ]} b={[minX - off, maxZ]} />
      <Line a={[minX - off - tick, minZ]} b={[minX - off + tick, minZ]} />
      <Line a={[minX - off - tick, maxZ]} b={[minX - off + tick, maxZ]} />
      <Html position={[minX - off, 0.2, (minZ + maxZ) / 2]} center zIndexRange={[15, 0]}>
        <span className={label}>{fmt(d)} m</span>
      </Html>
    </>
  )
}

/** Escala gráfica de 5 m, desenhada no mundo (acompanha o zoom). */
export function ScaleBar({ plan }: { plan: BuiltPlan }) {
  const { minX, maxZ } = plan.bbox
  const z = maxZ + 2.4
  const seg = 1.25
  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[minX + seg * i + seg / 2, 0.14, z]}>
          <boxGeometry args={[seg, 0.02, 0.22]} />
          <meshBasicMaterial color={i % 2 ? '#ffffff' : '#272b32'} />
        </mesh>
      ))}
      <Line a={[minX, z - 0.11]} b={[minX + 5, z - 0.11]} thick={0.03} />
      <Line a={[minX, z + 0.11]} b={[minX + 5, z + 0.11]} thick={0.03} />
      <Html position={[minX + 2.5, 0.2, z + 0.9]} center zIndexRange={[15, 0]}>
        <span className="whitespace-nowrap text-[10px] font-medium text-gray-600">Escala gráfica · 0 — 2,5 — 5 m</span>
      </Html>
    </>
  )
}
