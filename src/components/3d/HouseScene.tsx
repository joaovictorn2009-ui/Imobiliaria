'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
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

const LIFT_HIDDEN = 18

function liftTargets(mode: Mode, planFloor: LevelId) {
  if (mode === 'explode') return { ground: 0, upper: 5, roof: 10 }
  if (mode === 'plan') {
    return planFloor === 'ground'
      ? { ground: 0, upper: LIFT_HIDDEN, roof: LIFT_HIDDEN }
      : { ground: 0, upper: 0, roof: LIFT_HIDDEN }
  }
  return { ground: 0, upper: 0, roof: 0 }
}

/** Grupo que sobe/desce suavemente e some quando sai de cena. */
function Lift({ base, target, children }: { base: number; target: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const cur = useRef(target)

  useFrame((_, dt) => {
    cur.current = THREE.MathUtils.damp(cur.current, target, 4, dt)
    if (!ref.current) return
    ref.current.position.y = base + cur.current
    ref.current.visible = cur.current < LIFT_HIDDEN * 0.8
  })

  return <group ref={ref}>{children}</group>
}

interface Box {
  cx: number
  cy: number
  cz: number
  sx: number
  sy: number
  sz: number
  kind: 'wall' | 'glass' | 'door'
}

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
    if (o.kind === 'glass') parts.push({ a0: s, a1: e, y0: o.bottom, y1: o.top, kind: 'glass' })
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
    const thick = p.kind === 'glass' ? 0.04 : p.kind === 'door' ? 0.06 : t
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
  const boxes = useMemo(() => wallBoxes(def), [def])
  const wallMat = def.tone === 'timber' ? mats.timber : def.exterior ? mats.wallExt : mats.wallInt
  return (
    <>
      {boxes.map((b, i) => (
        <mesh
          key={i}
          position={[b.cx, b.cy, b.cz]}
          castShadow={b.kind !== 'glass'}
          receiveShadow
          material={b.kind === 'glass' ? mats.glass : b.kind === 'door' ? mats.door : wallMat}
        >
          <boxGeometry args={[b.sx, b.sy, b.sz]} />
        </mesh>
      ))}
    </>
  )
}

interface Mats {
  wallExt: THREE.Material
  wallInt: THREE.Material
  timber: THREE.Material
  glass: THREE.Material
  door: THREE.Material
  slab: THREE.Material
  roof: THREE.Material
  rail: THREE.Material
}

function useMaterials(): Mats {
  return useMemo(
    () => ({
      wallExt: new THREE.MeshStandardMaterial({ color: '#f1ede6', roughness: 0.9 }),
      wallInt: new THREE.MeshStandardMaterial({ color: '#ebe6de', roughness: 0.95 }),
      timber: new THREE.MeshStandardMaterial({ color: '#8b5e3c', roughness: 0.7 }),
      glass: new THREE.MeshStandardMaterial({
        color: '#9fd3ff',
        transparent: true,
        opacity: 0.28,
        roughness: 0.05,
        metalness: 0.2,
        depthWrite: false,
      }),
      door: new THREE.MeshStandardMaterial({ color: '#6b4a2e', roughness: 0.6 }),
      slab: new THREE.MeshStandardMaterial({ color: '#d6d0c6', roughness: 0.9 }),
      roof: new THREE.MeshStandardMaterial({ color: '#2c2f35', roughness: 0.8 }),
      rail: new THREE.MeshStandardMaterial({
        color: '#bfe3ff',
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
    }),
    []
  )
}

function Highlight({ room }: { room: RoomDef }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    if (mat.current) mat.current.opacity = 0.42 + Math.sin(clock.elapsedTime * 3) * 0.14
  })
  return (
    <mesh position={[room.x + room.w / 2, 0.075, room.z + room.d / 2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[room.w - 0.1, room.d - 0.1]} />
      <meshBasicMaterial ref={mat} color="#f5d08a" transparent opacity={0.5} depthWrite={false} />
    </mesh>
  )
}

function Level({
  level,
  mats,
  showLabels,
  selected,
  onSelect,
}: {
  level: LevelId
  mats: Mats
  showLabels: boolean
  selected: string | null
  onSelect: (id: string) => void
}) {
  const rooms = ROOMS.filter((r) => r.level === level)
  const walls = WALLS.filter((w) => w.level === level)
  const furniture = FURNITURE.filter((f) => f.level === level)

  return (
    <>
      {/* laje do pavimento */}
      <mesh position={[HOUSE_W / 2, -0.15, HOUSE_D / 2]} material={mats.slab} castShadow receiveShadow>
        <boxGeometry args={[HOUSE_W + WALL_EXT, 0.3, HOUSE_D + WALL_EXT]} />
      </mesh>

      {rooms.map((r) => (
        <group key={r.id}>
          <mesh position={[r.x + r.w / 2, 0.02, r.z + r.d / 2]} receiveShadow>
            <boxGeometry args={[r.w - 0.02, 0.04, r.d - 0.02]} />
            <meshStandardMaterial color={r.floor} roughness={0.6} />
          </mesh>
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
          <meshStandardMaterial color={f.color} roughness={0.75} />
        </mesh>
      ))}

      {level === 'ground' && <Stairs />}
      {level === 'upper' && <Balcony mats={mats} />}
    </>
  )
}

function Stairs() {
  const steps = 10
  return (
    <>
      {Array.from({ length: steps }, (_, i) => {
        const h = 0.24 * (i + 1)
        return (
          <mesh key={i} position={[8.55, h / 2, 4.5 + i * 0.3]} castShadow receiveShadow>
            <boxGeometry args={[1.1, h, 0.3]} />
            <meshStandardMaterial color="#a67c52" roughness={0.6} />
          </mesh>
        )
      })}
    </>
  )
}

function Balcony({ mats }: { mats: Mats }) {
  return (
    <>
      <mesh position={[2.5, -0.15, -1]} material={mats.slab} castShadow receiveShadow>
        <boxGeometry args={[5, 0.3, 2]} />
      </mesh>
      <mesh position={[2.5, 0.55, -1.97]} material={mats.rail}>
        <boxGeometry args={[5, 1.1, 0.04]} />
      </mesh>
      <mesh position={[0.03, 0.55, -1]} material={mats.rail}>
        <boxGeometry args={[0.04, 1.1, 2]} />
      </mesh>
      <mesh position={[4.97, 0.55, -1]} material={mats.rail}>
        <boxGeometry args={[0.04, 1.1, 2]} />
      </mesh>
    </>
  )
}

function Roof({ mats }: { mats: Mats }) {
  return (
    <>
      <mesh position={[HOUSE_W / 2, 0.2, HOUSE_D / 2]} material={mats.roof} castShadow receiveShadow>
        <boxGeometry args={[HOUSE_W + 1.8, 0.4, HOUSE_D + 1.8]} />
      </mesh>
      <mesh position={[HOUSE_W / 2, 0.43, HOUSE_D / 2]} receiveShadow>
        <boxGeometry args={[HOUSE_W + 1.9, 0.06, HOUSE_D + 1.9]} />
        <meshStandardMaterial color="#e9e4da" roughness={0.9} />
      </mesh>
      {/* placas solares */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[3 + i * 2.3, 0.75, 3.2]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[2, 0.05, 1.3]} />
          <meshStandardMaterial color="#1c2a44" metalness={0.6} roughness={0.25} />
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

function Garden() {
  return (
    <>
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#27402f" roughness={1} />
      </mesh>
      {/* deck e piscina (frente da casa) */}
      <mesh position={[6, -0.25, -6]} receiveShadow>
        <boxGeometry args={[14, 0.12, 12]} />
        <meshStandardMaterial color="#9a8a76" roughness={0.9} />
      </mesh>
      <mesh position={[5.5, -0.17, -6.3]} receiveShadow>
        <boxGeometry args={[9.4, 0.06, 5.6]} />
        <meshStandardMaterial color="#d9d3c8" roughness={0.6} />
      </mesh>
      <mesh position={[5.5, -0.13, -6.3]}>
        <boxGeometry args={[8.8, 0.03, 5]} />
        <meshStandardMaterial color="#2bb6d9" emissive="#0b6f8a" emissiveIntensity={0.55} roughness={0.15} metalness={0.1} />
      </mesh>
      {/* acesso de veículos */}
      <mesh position={[8.5, -0.3, 13]} receiveShadow>
        <boxGeometry args={[4.5, 0.04, 10]} />
        <meshStandardMaterial color="#4a4e55" roughness={1} />
      </mesh>
      {TREES.map(([x, z, s], i) => (
        <group key={i} position={[x, -0.3, z]} scale={s}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.2, 1.8, 8]} />
            <meshStandardMaterial color="#5a3d26" roughness={1} />
          </mesh>
          <mesh position={[0, 2.6, 0]} castShadow>
            <icosahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial color="#2f6b3d" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0.5, 3.3, 0.2]} castShadow>
            <icosahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#3a8049" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </>
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
}

export function HouseScene({ mode, planFloor, selected, onSelect, zoomOn, autoRotate }: HouseSceneProps) {
  const mats = useMaterials()
  const lifts = liftTargets(mode, planFloor)
  const showLabels = mode !== 'facade'

  return (
    <>
      <color attach="background" args={['#070c18']} />
      <fog attach="fog" args={['#070c18', 48, 120]} />
      <hemisphereLight args={['#cfe3ff', '#3b3a30', 0.85]} />
      <directionalLight
        position={[16, 24, 12]}
        intensity={2.4}
        color="#ffe2b8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-bias={-0.0004}
      />

      <group position={[-HOUSE_W / 2, 0, -HOUSE_D / 2]}>
        <Garden />
        <Lift base={0} target={lifts.ground}>
          <Level level="ground" mats={mats} showLabels={showLabels} selected={selected} onSelect={onSelect} />
        </Lift>
        <Lift base={FLOOR_H} target={lifts.upper}>
          <Level level="upper" mats={mats} showLabels={showLabels} selected={selected} onSelect={onSelect} />
        </Lift>
        <Lift base={FLOOR_H * 2} target={lifts.roof}>
          <Roof mats={mats} />
        </Lift>
      </group>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={zoomOn}
        enableDamping
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
