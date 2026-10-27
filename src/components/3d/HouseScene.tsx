'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, Lightformer, OrbitControls, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import {
  CAMERA_PRESETS,
  FLOOR_H,
  FURNITURE,
  HOUSE_D,
  HOUSE_W,
  ROOMS,
  WALLS,
  WALL_EXT,
  WALL_INT,
  type LevelId,
  type Mode,
  type RoomDef,
  type WallDef,
} from './houseData'
import { createTextures, disposeTextures, tbox, type TextureSet } from './textures'

const LIFT_HIDDEN = 18
const FOG = '#2b3556'
const FOG_NIGHT = '#070b16'

function liftTargets(mode: Mode, planFloor: LevelId) {
  if (mode === 'explode') return { ground: 0, upper: 5, roof: 10 }
  if (mode === 'plan') {
    return planFloor === 'ground'
      ? { ground: 0, upper: LIFT_HIDDEN, roof: LIFT_HIDDEN }
      : { ground: 0, upper: 0, roof: LIFT_HIDDEN }
  }
  return { ground: 0, upper: 0, roof: 0 }
}

/**
 * Física leve: massa-mola amortecida. Os andares sobem com leve "quique" e,
 * ao voltar, caem e batem no andar de baixo (sem engine de física pesada).
 */
function Lift({ base, target, children }: { base: number; target: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const cur = useRef(target)
  const vel = useRef(0)

  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 30)
    vel.current += ((target - cur.current) * 55 - vel.current * 8.5) * d
    cur.current += vel.current * d
    if (cur.current < 0) {
      cur.current = 0
      vel.current *= -0.35
    }
    if (!ref.current) return
    ref.current.position.y = base + cur.current
    ref.current.visible = cur.current < LIFT_HIDDEN * 0.8
  })

  return <group ref={ref}>{children}</group>
}

interface Mats {
  wallExt: THREE.Material
  wallInt: THREE.Material
  timber: THREE.Material
  glass: THREE.Material
  frame: THREE.Material
  door: THREE.Material
  slab: THREE.Material
  roof: THREE.Material
  rail: THREE.Material
  floors: Record<string, THREE.Material>
  steps: THREE.Material
}

interface Assets {
  tex: TextureSet
  mats: Mats
}

const FLOOR_KIND: Record<string, keyof TextureSet> = {
  living: 'wood',
  master: 'wood',
  bed2: 'wood',
  bed3: 'wood',
  kitchen: 'tile',
  hall: 'woodDark',
  corridor: 'woodDark',
  wc: 'tileLight',
  bath: 'tileLight',
  closet: 'wood',
  masterbath: 'tileLight',
  balcony: 'stone',
}

function useAssets(): Assets {
  const assets = useMemo<Assets>(() => {
    const tex = createTextures()
    const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p)
    const floors: Record<string, THREE.Material> = {}
    for (const r of ROOMS) {
      const kind = FLOOR_KIND[r.id] ?? 'wood'
      const glossy = kind === 'tile' || kind === 'tileLight' || kind === 'stone'
      floors[r.id] = std({ map: tex[kind], roughness: glossy ? 0.35 : 0.55, bumpMap: tex.bump, bumpScale: 0.4 })
    }
    return {
      tex,
      mats: {
        wallExt: std({ map: tex.stucco, bumpMap: tex.bump, bumpScale: 0.9, roughness: 0.95 }),
        wallInt: std({ map: tex.stucco, color: '#f4f0ea', bumpMap: tex.bump, bumpScale: 0.6, roughness: 0.95 }),
        timber: std({ map: tex.timber, bumpMap: tex.bump, bumpScale: 0.8, roughness: 0.65 }),
        glass: new THREE.MeshStandardMaterial({
          color: '#a9d8ff',
          transparent: true,
          opacity: 0.3,
          roughness: 0.02,
          metalness: 0.7,
          envMapIntensity: 1.6,
          depthWrite: false,
        }),
        frame: std({ color: '#1d2024', metalness: 0.6, roughness: 0.4 }),
        door: std({ map: tex.woodDark, roughness: 0.55 }),
        slab: std({ map: tex.concrete, bumpMap: tex.bump, bumpScale: 0.7, roughness: 0.9 }),
        roof: std({ map: tex.roof, bumpMap: tex.bump, bumpScale: 1.1, roughness: 0.85 }),
        rail: new THREE.MeshStandardMaterial({
          color: '#c7e8ff',
          transparent: true,
          opacity: 0.28,
          roughness: 0.03,
          metalness: 0.6,
          envMapIntensity: 1.4,
          depthWrite: false,
        }),
        floors,
        steps: std({ map: tex.woodDark, roughness: 0.5 }),
      },
    }
  }, [])

  useEffect(
    () => () => {
      disposeTextures(assets.tex)
    },
    [assets]
  )
  return assets
}

interface Box {
  cx: number
  cy: number
  cz: number
  sx: number
  sy: number
  sz: number
  kind: 'wall' | 'glass' | 'door' | 'frame'
}

const FRAME = 0.06

function wallBoxes(w: WallDef): Box[] {
  const horizontal = w.z1 === w.z2
  const len = horizontal ? Math.abs(w.x2 - w.x1) : Math.abs(w.z2 - w.z1)
  const t = w.exterior ? WALL_EXT : WALL_INT
  const origin = horizontal ? Math.min(w.x1, w.x2) : Math.min(w.z1, w.z2)
  const ops = [...(w.openings ?? [])].sort((a, b) => a.at - b.at)

  const parts: { a0: number; a1: number; y0: number; y1: number; kind: Box['kind'] }[] = []
  let cursor = 0
  for (const o of ops) {
    const s = o.at - o.w / 2
    const e = o.at + o.w / 2
    if (s > cursor) parts.push({ a0: cursor, a1: s, y0: 0, y1: FLOOR_H, kind: 'wall' })
    if (o.bottom > 0) parts.push({ a0: s, a1: e, y0: 0, y1: o.bottom, kind: 'wall' })
    if (o.top < FLOOR_H) parts.push({ a0: s, a1: e, y0: o.top, y1: FLOOR_H, kind: 'wall' })
    if (o.kind === 'glass') {
      parts.push({ a0: s, a1: e, y0: o.bottom, y1: o.top, kind: 'glass' })
      // esquadrias de alumínio
      parts.push({ a0: s, a1: e, y0: o.top - FRAME, y1: o.top, kind: 'frame' })
      parts.push({ a0: s, a1: e, y0: o.bottom, y1: o.bottom + FRAME, kind: 'frame' })
      parts.push({ a0: s, a1: s + FRAME, y0: o.bottom, y1: o.top, kind: 'frame' })
      parts.push({ a0: e - FRAME, a1: e, y0: o.bottom, y1: o.top, kind: 'frame' })
      if (o.w > 2) parts.push({ a0: o.at - FRAME / 2, a1: o.at + FRAME / 2, y0: o.bottom, y1: o.top, kind: 'frame' })
    }
    if (o.kind === 'door') parts.push({ a0: s + 0.02, a1: e - 0.02, y0: o.bottom, y1: o.top, kind: 'door' })
    cursor = e
  }
  if (cursor < len) parts.push({ a0: cursor, a1: len, y0: 0, y1: FLOOR_H, kind: 'wall' })

  return parts.map((p) => {
    // paredes externas avançam meia espessura nas pontas para fechar os cantos
    const a0 = w.exterior && horizontal && p.a0 === 0 ? -t / 2 : p.a0
    const a1 = w.exterior && horizontal && p.a1 === len ? len + t / 2 : p.a1
    const mid = origin + (a0 + a1) / 2
    const along = a1 - a0
    const thick = p.kind === 'glass' ? 0.04 : p.kind === 'door' ? 0.07 : p.kind === 'frame' ? t * 0.55 : t
    return {
      cx: horizontal ? mid : w.x1,
      cz: horizontal ? w.z1 : mid,
      cy: (p.y0 + p.y1) / 2,
      sx: horizontal ? along : thick,
      sz: horizontal ? thick : along,
      sy: p.y1 - p.y0,
      kind: p.kind,
    }
  })
}

function Wall({ def, mats }: { def: WallDef; mats: Mats }) {
  const boxes = useMemo(
    () => wallBoxes(def).map((b) => ({ ...b, geo: tbox(b.sx, b.sy, b.sz, def.tone === 'timber' ? 2 : 2.5) })),
    [def]
  )
  useEffect(() => () => boxes.forEach((b) => b.geo.dispose()), [boxes])

  const wallMat = def.tone === 'timber' ? mats.timber : def.exterior ? mats.wallExt : mats.wallInt
  const matFor = (k: Box['kind']) =>
    k === 'glass' ? mats.glass : k === 'door' ? mats.door : k === 'frame' ? mats.frame : wallMat

  return (
    <>
      {boxes.map((b, i) => (
        <mesh
          key={i}
          position={[b.cx, b.cy, b.cz]}
          geometry={b.geo}
          material={matFor(b.kind)}
          castShadow={b.kind !== 'glass'}
          receiveShadow
        />
      ))}
    </>
  )
}

function TexBox({
  size,
  position,
  material,
  tile = 2,
  cast = true,
}: {
  size: [number, number, number]
  position: [number, number, number]
  material: THREE.Material
  tile?: number
  cast?: boolean
}) {
  const geo = useMemo(() => tbox(size[0], size[1], size[2], tile), [size, tile])
  useEffect(() => () => geo.dispose(), [geo])
  return <mesh position={position} geometry={geo} material={material} castShadow={cast} receiveShadow />
}

function Highlight({ room }: { room: RoomDef }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    if (mat.current) mat.current.opacity = 0.4 + Math.sin(clock.elapsedTime * 3) * 0.14
  })
  return (
    <mesh position={[room.x + room.w / 2, 0.075, room.z + room.d / 2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[room.w - 0.1, room.d - 0.1]} />
      <meshBasicMaterial ref={mat} color="#f5d08a" transparent opacity={0.5} depthWrite={false} />
    </mesh>
  )
}

const LIGHTS: Record<LevelId, [number, number, number][]> = {
  ground: [
    [3, 2.4, 4],
    [9.5, 2.4, 2],
  ],
  upper: [
    [2.5, 2.4, 4],
    [8.5, 2.4, 4],
  ],
}

function Level({
  night,
  level,
  assets,
  showLabels,
  selected,
  onSelect,
}: {
  night: boolean
  level: LevelId
  assets: Assets
  showLabels: boolean
  selected: string | null
  onSelect: (id: string) => void
}) {
  const { mats } = assets
  const rooms = ROOMS.filter((r) => r.level === level)
  const walls = WALLS.filter((w) => w.level === level)
  const furniture = FURNITURE.filter((f) => f.level === level)
  const floorGeos = useMemo(
    () =>
      rooms.map((r) =>
        tbox(r.w - 0.02, 0.04, r.d - 0.02, r.id === 'kitchen' || r.id === 'wc' || r.id === 'bath' || r.id === 'masterbath' ? 1.6 : 2.4)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <TexBox
        size={[HOUSE_W + WALL_EXT, 0.3, HOUSE_D + WALL_EXT]}
        position={[HOUSE_W / 2, -0.15, HOUSE_D / 2]}
        material={mats.slab}
        tile={3}
      />

      {rooms.map((r, i) => (
        <group key={r.id}>
          <mesh
            position={[r.x + r.w / 2, 0.02, r.z + r.d / 2]}
            geometry={floorGeos[i]}
            material={mats.floors[r.id]}
            receiveShadow
          />
          {selected === r.id && <Highlight room={r} />}
          {showLabels && (
            <Html position={[r.x + r.w / 2, 0.3, r.z + r.d / 2]} center distanceFactor={15} zIndexRange={[20, 0]}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-md transition-colors ${
                  selected === r.id
                    ? 'border-[#e8c98f] bg-[#e8c98f] text-[#1a1408]'
                    : 'border-white/25 bg-black/55 text-white hover:border-[#e8c98f]'
                }`}
              >
                {r.name}
              </button>
            </Html>
          )}
        </group>
      ))}

      {walls.map((w, i) => (
        <Wall key={i} def={w} mats={mats} />
      ))}

      {furniture.map((f, i) => (
        <mesh key={i} position={[f.x, (f.y ?? 0) + f.h / 2, f.z]} castShadow receiveShadow>
          <boxGeometry args={[f.w, f.h, f.d]} />
          <meshStandardMaterial color={f.color} roughness={0.7} />
        </mesh>
      ))}

      {LIGHTS[level].map((p, i) => (
        <pointLight key={i} position={p} color="#ffcf9a" intensity={night ? 48 : 14} distance={night ? 11 : 9} decay={2} />
      ))}

      {level === 'ground' && <Stairs mats={mats} />}
      {level === 'upper' && <Balcony mats={mats} />}
    </>
  )
}

function Stairs({ mats }: { mats: Mats }) {
  const steps = 10
  return (
    <>
      {Array.from({ length: steps }, (_, i) => {
        const h = 0.24 * (i + 1)
        return (
          <mesh key={i} position={[8.55, h / 2, 4.5 + i * 0.3]} material={mats.steps} castShadow receiveShadow>
            <boxGeometry args={[1.1, h, 0.3]} />
          </mesh>
        )
      })}
    </>
  )
}

function Balcony({ mats }: { mats: Mats }) {
  return (
    <>
      <TexBox size={[5, 0.3, 2]} position={[2.5, -0.15, -1]} material={mats.slab} tile={3} />
      <mesh position={[2.5, 0.55, -1.97]} material={mats.rail}>
        <boxGeometry args={[5, 1.1, 0.04]} />
      </mesh>
      <mesh position={[0.03, 0.55, -1]} material={mats.rail}>
        <boxGeometry args={[0.04, 1.1, 2]} />
      </mesh>
      <mesh position={[4.97, 0.55, -1]} material={mats.rail}>
        <boxGeometry args={[0.04, 1.1, 2]} />
      </mesh>
      {/* corrimão metálico */}
      <mesh position={[2.5, 1.12, -1.97]} material={mats.frame}>
        <boxGeometry args={[5, 0.04, 0.06]} />
      </mesh>
    </>
  )
}

function Roof({ mats }: { mats: Mats }) {
  return (
    <>
      <TexBox
        size={[HOUSE_W + 1.8, 0.4, HOUSE_D + 1.8]}
        position={[HOUSE_W / 2, 0.2, HOUSE_D / 2]}
        material={mats.roof}
        tile={3}
      />
      <TexBox
        size={[HOUSE_W + 1.9, 0.07, HOUSE_D + 1.9]}
        position={[HOUSE_W / 2, 0.43, HOUSE_D / 2]}
        material={mats.slab}
        tile={3}
        cast={false}
      />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[3 + i * 2.3, 0.78, 3.2]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[2, 0.05, 1.3]} />
          <meshStandardMaterial color="#14213d" metalness={0.75} roughness={0.2} envMapIntensity={1.8} />
        </mesh>
      ))}
    </>
  )
}

const TREES: [number, number, number][] = [
  [-3.5, -7, 1.2],
  [15, -5, 1.5],
  [15.5, 11, 1.3],
  [-3.5, 11, 1.4],
  [6, -13, 1.1],
  [-5, 2, 0.9],
]

/** Árvore que balança com o "vento" (movimento senoidal leve). */
function Tree({ x, z, s, phase }: { x: number; z: number; s: number; phase: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.028
    ref.current.rotation.x = Math.cos(t * 0.8 + phase) * 0.02
  })
  return (
    <group position={[x, -0.3, z]} scale={s}>
      <group ref={ref}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.2, 1.8, 8]} />
          <meshStandardMaterial color="#5a3d26" roughness={1} />
        </mesh>
        <mesh position={[0, 2.6, 0]} castShadow>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshStandardMaterial color="#2f6b3d" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0.5, 3.3, 0.2]} castShadow>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#3d8a4d" roughness={0.9} flatShading />
        </mesh>
      </group>
    </group>
  )
}

function Garden({ assets }: { assets: Assets }) {
  const { tex, mats } = assets
  const grass = useMemo(() => {
    tex.grass.repeat.set(45, 45)
    return new THREE.MeshStandardMaterial({ map: tex.grass, roughness: 1 })
  }, [tex])
  const water = useMemo(() => {
    tex.water.repeat.set(3, 2)
    return new THREE.MeshStandardMaterial({
      color: '#1fb5d6',
      emissive: '#0a6a85',
      emissiveIntensity: 0.5,
      roughness: 0.08,
      metalness: 0.15,
      bumpMap: tex.water,
      bumpScale: 1.2,
      envMapIntensity: 1.6,
    })
  }, [tex])
  const deck = useMemo(() => new THREE.MeshStandardMaterial({ map: tex.deck, roughness: 0.8 }), [tex])
  const asphalt = useMemo(
    () => new THREE.MeshStandardMaterial({ map: tex.concrete, color: '#6d727b', roughness: 1 }),
    [tex]
  )

  // ondulação da água
  useFrame((_, dt) => {
    tex.water.offset.x += dt * 0.03
    tex.water.offset.y += dt * 0.018
  })

  return (
    <>
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} material={grass} receiveShadow>
        <planeGeometry args={[180, 180]} />
      </mesh>
      <TexBox size={[14, 0.12, 12]} position={[6, -0.25, -6]} material={deck} tile={2.4} cast={false} />
      <TexBox size={[9.4, 0.06, 5.6]} position={[5.5, -0.17, -6.3]} material={mats.slab} tile={1.6} cast={false} />
      <mesh position={[5.5, -0.13, -6.3]} material={water} receiveShadow>
        <boxGeometry args={[8.8, 0.03, 5]} />
      </mesh>
      <TexBox size={[4.5, 0.04, 10]} position={[8.5, -0.3, 13]} material={asphalt} tile={3} cast={false} />
      {TREES.map(([x, z, s], i) => (
        <Tree key={i} x={x} z={z} s={s} phase={i * 1.7} />
      ))}
    </>
  )
}

/** Céu em degradê (um único draw call), com o horizonte igual à cor da névoa. */
function Sky({ night }: { night: boolean }) {
  const uniforms = useMemo(
    () => ({
      uHorizon: { value: new THREE.Color(FOG) },
      uMid: { value: new THREE.Color('#2a4375') },
      uTop: { value: new THREE.Color('#070d22') },
    }),
    []
  )
  useEffect(() => {
    uniforms.uHorizon.value.set(night ? FOG_NIGHT : FOG)
    uniforms.uMid.value.set(night ? '#0b1430' : '#2a4375')
    uniforms.uTop.value.set(night ? '#02040a' : '#070d22')
  }, [night, uniforms])
  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[400, 24, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`varying float vH; void main(){ vH = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`uniform vec3 uHorizon; uniform vec3 uMid; uniform vec3 uTop; varying float vH;
          void main(){
            float t = clamp(vH, 0.0, 1.0);
            vec3 c = mix(uHorizon, uMid, smoothstep(0.0, 0.22, t));
            c = mix(c, uTop, smoothstep(0.18, 0.85, t));
            gl_FragColor = vec4(c, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`}
      />
    </mesh>
  )
}

/** Anima a câmera até a posição de cada modo e depois devolve o controle ao usuário. */
function CameraRig({ mode }: { mode: Mode }) {
  const controls = useThree((s) => s.controls) as unknown as { target: THREE.Vector3; update: () => void } | null
  const camera = useThree((s) => s.camera)
  const animating = useRef(true)
  const aspect = useThree((s) => s.size.width / Math.max(s.size.height, 1))
  const tgt = useMemo(() => new THREE.Vector3(...CAMERA_PRESETS[mode].target), [mode])
  // telas estreitas (celular) precisam de mais distância para enquadrar a casa inteira
  const pos = useMemo(() => {
    const k = aspect < 1.2 ? Math.min(2.1, Math.pow(1.2 / aspect, 0.85)) : 1
    const p = new THREE.Vector3(...CAMERA_PRESETS[mode].pos)
    return tgt.clone().add(p.sub(tgt).multiplyScalar(k))
  }, [mode, aspect, tgt])

  useEffect(() => {
    animating.current = true
  }, [mode, aspect])

  useFrame((_, dt) => {
    if (!animating.current || !controls) return
    const k = 1 - Math.exp(-dt * 3.2)
    camera.position.lerp(pos, k)
    controls.target.lerp(tgt, k)
    controls.update()
    if (camera.position.distanceTo(pos) < 0.2 && controls.target.distanceTo(tgt) < 0.1) animating.current = false
  })

  return null
}

export interface HouseSceneProps {
  mode: Mode
  planFloor: LevelId
  selected: string | null
  onSelect: (id: string) => void
  zoomOn: boolean
  autoRotate: boolean
  night: boolean
  onPerf: (level: 'low' | 'high') => void
}

export function HouseScene({ mode, planFloor, selected, onSelect, zoomOn, autoRotate, night, onPerf }: HouseSceneProps) {
  const assets = useAssets()
  useEffect(() => {
    const glass = assets.mats.glass as THREE.MeshStandardMaterial
    glass.emissive.set(night ? '#ffcf9a' : '#000000')
    glass.emissiveIntensity = night ? 0.5 : 0
    glass.needsUpdate = true
  }, [night, assets])
  const lifts = liftTargets(mode, planFloor)
  const labelsFor = (level: LevelId) => mode === 'explode' || (mode === 'plan' && planFloor === level)

  return (
    <>
      <PerformanceMonitor onDecline={() => onPerf('low')} onIncline={() => onPerf('high')} />
      <Sky night={night} />
      <fog attach="fog" args={[night ? FOG_NIGHT : FOG, 55, 150]} />

      {/* reflexos de ambiente sem baixar nenhuma imagem (apenas painéis de luz) */}
      <Environment resolution={128} frames={1} environmentIntensity={night ? 0.14 : 0.55}>
        <color attach="background" args={['#1b2540']} />
        <Lightformer form="rect" intensity={3} color="#ffe2b8" position={[6, 9, 5]} scale={[12, 7, 1]} />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#9fc4ff"
          position={[-9, 5, -6]}
          rotation-y={Math.PI / 2}
          scale={[14, 6, 1]}
        />
        <Lightformer form="rect" intensity={0.9} color="#ffd9a8" position={[0, 3, 12]} scale={[16, 4, 1]} />
      </Environment>

      <hemisphereLight args={[night ? '#5f7bd8' : '#cfe3ff', night ? '#10131c' : '#3b3a30', night ? 0.16 : 0.45]} />
      <directionalLight
        position={[16, 24, 12]}
        intensity={night ? 0.35 : 2.6}
        color={night ? '#8aa4ff' : '#ffe2b8'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0003}
        shadow-normalBias={0.04}
        shadow-radius={3}
      />

      <group position={[-HOUSE_W / 2, 0, -HOUSE_D / 2]}>
        <Garden assets={assets} />
        <Lift base={0} target={lifts.ground}>
          <Level night={night} level="ground" assets={assets} showLabels={labelsFor('ground')} selected={selected} onSelect={onSelect} />
        </Lift>
        <Lift base={FLOOR_H} target={lifts.upper}>
          <Level night={night} level="upper" assets={assets} showLabels={labelsFor('upper')} selected={selected} onSelect={onSelect} />
        </Lift>
        <Lift base={FLOOR_H * 2} target={lifts.roof}>
          <Roof mats={assets.mats} />
        </Lift>
      </group>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={zoomOn}
        enableDamping
        dampingFactor={0.07}
        minDistance={9}
        maxDistance={70}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 - 0.03}
        autoRotate={autoRotate && mode === 'facade'}
        autoRotateSpeed={0.55}
      />
      <CameraRig mode={mode} />
    </>
  )
}
