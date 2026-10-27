'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  OrbitControls,
  OrthographicCamera,
  PerformanceMonitor,
  PerspectiveCamera,
} from '@react-three/drei'
import * as THREE from 'three'
import type { BuiltPlan, FurnM } from '../plans/types'
import { useCasaAssets, type CasaAssets } from './assets'
import { DoorArcs, Dimensions, Floors, Furniture, Highlight, RoomLabels, Roof, ScaleBar, TexBox, Walls } from './parts'

export type CasaMode = 'fachada' | 'corte' | 'planta'

const FOG_DAY = '#cfe2f4'
const FOG_NIGHT = '#070b16'
const HIDDEN = 16

// ---------------------------------------------------------------- física leve (massa-mola)

function useSpring(target: number, k = 55, c = 8.5) {
  const cur = useRef(target)
  const vel = useRef(0)
  return (dt: number, floor?: number) => {
    const d = Math.min(dt, 1 / 30)
    vel.current += ((target - cur.current) * k - vel.current * c) * d
    cur.current += vel.current * d
    if (floor !== undefined && cur.current < floor) {
      cur.current = floor
      vel.current *= -0.3
    }
    return cur.current
  }
}

/** Sobe o telhado com um leve "quique" e o remove da cena quando sai de vista. */
function RoofLift({ target, children }: { target: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const step = useSpring(target)
  const [gone, setGone] = useState(target >= HIDDEN)
  const goneRef = useRef(gone)
  useFrame((_, dt) => {
    const v = step(dt, 0)
    const hide = v >= HIDDEN * 0.8
    if (hide !== goneRef.current) {
      goneRef.current = hide
      setGone(hide)
    }
    if (ref.current) ref.current.position.y = v
  })
  return <group ref={ref}>{!gone && children}</group>
}

/** As paredes "abaixam" no modo corte, para mostrar o interior como numa maquete. */
function WallScale({ target, children }: { target: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const step = useSpring(target, 70, 9)
  useFrame((_, dt) => {
    const v = step(dt, 0.04)
    if (ref.current) ref.current.scale.y = v
  })
  return <group ref={ref}>{children}</group>
}

// ---------------------------------------------------------------- céu

function Sky({ night, center }: { night: boolean; center: THREE.Vector3 }) {
  const uniforms = useMemo(
    () => ({
      uHorizon: { value: new THREE.Color(FOG_DAY) },
      uMid: { value: new THREE.Color('#8dbcec') },
      uTop: { value: new THREE.Color('#3a78c6') },
      uSun: { value: new THREE.Vector3(0.69, 0.3, 0.66).normalize() },
      uSunCol: { value: new THREE.Color('#ffd9a0') },
    }),
    []
  )
  useEffect(() => {
    uniforms.uHorizon.value.set(night ? FOG_NIGHT : FOG_DAY)
    uniforms.uMid.value.set(night ? '#0b1430' : '#8dbcec')
    uniforms.uTop.value.set(night ? '#02040a' : '#3a78c6')
    uniforms.uSunCol.value.set(night ? '#9fb4ff' : '#fff0cc')
  }, [night, uniforms])
  return (
    <mesh renderOrder={-1} position={center}>
      <sphereGeometry args={[400, 32, 20]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`uniform vec3 uHorizon; uniform vec3 uMid; uniform vec3 uTop; uniform vec3 uSun; uniform vec3 uSunCol; varying vec3 vDir;
          void main(){
            float t = clamp(vDir.y, 0.0, 1.0);
            vec3 c = mix(uHorizon, uMid, smoothstep(0.0, 0.22, t));
            c = mix(c, uTop, smoothstep(0.18, 0.85, t));
            float s = max(dot(normalize(vDir), normalize(uSun)), 0.0);
            c += uSunCol * (pow(s, 900.0) * 3.0 + pow(s, 28.0) * 0.28 + pow(s, 6.0) * 0.08);
            gl_FragColor = vec4(c, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`}
      />
    </mesh>
  )
}

// ---------------------------------------------------------------- paisagismo

function Tree({ x, z, s, phase, cone }: { x: number; z: number; s: number; phase: number; cone: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.026
    ref.current.rotation.x = Math.cos(t * 0.8 + phase) * 0.018
  })
  return (
    <group position={[x, -0.3, z]} scale={s}>
      <group ref={ref}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.2, 1.8, 8]} />
          <meshStandardMaterial color="#5a3d26" roughness={1} />
        </mesh>
        {cone ? (
          <>
            <mesh position={[0, 3.0, 0]} castShadow>
              <coneGeometry args={[1.0, 4.2, 9]} />
              <meshStandardMaterial color="#2a5f3a" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, 4.5, 0]} castShadow>
              <coneGeometry args={[0.7, 2.6, 9]} />
              <meshStandardMaterial color="#336f44" roughness={0.9} flatShading />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[0, 2.6, 0]} castShadow>
              <icosahedronGeometry args={[1.3, 1]} />
              <meshStandardMaterial color="#2f6b3d" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.55, 3.3, 0.2]} castShadow>
              <icosahedronGeometry args={[0.85, 1]} />
              <meshStandardMaterial color="#3d8a4d" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[-0.6, 3.0, -0.3]} castShadow>
              <icosahedronGeometry args={[0.75, 1]} />
              <meshStandardMaterial color="#357a43" roughness={0.9} flatShading />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}

function Outdoors({ plan, assets, isPlan, night }: { plan: BuiltPlan; assets: CasaAssets; isPlan: boolean; night: boolean }) {
  const { minX, maxX, minZ, maxZ } = plan.bbox
  const cx = (minX + maxX) / 2
  const cz = (minZ + maxZ) / 2
  const garage = plan.rooms.find((r) => r.id === 'garagem')
  const hall = plan.rooms.find((r) => r.id === 'hall')
  const gourmet = plan.rooms.find((r) => r.open.includes('n'))
  const { real } = assets
  const pool = plan.pool
  const streetZ = maxZ + 12

  const deck = useMemo(() => {
    const x0 = gourmet ? gourmet.rects[0].x : pool.x - 1.8
    const x1 = pool.x + pool.w + 1.8
    const z0 = pool.z - 1.8
    const z1 = gourmet ? gourmet.rects[0].z + 0.1 : pool.z + pool.d + 2
    return { x0, x1, z0, z1 }
  }, [gourmet, pool])

  const loungers: FurnM[] = useMemo(
    () => [
      { type: 'lounge', x: pool.x + 1.4, z: pool.z + pool.d + 1.1, rot: 0, room: 'deck' },
      { type: 'lounge', x: pool.x + 2.5, z: pool.z + pool.d + 1.1, rot: 0, room: 'deck' },
      { type: 'lounge', x: pool.x + pool.w + 1.0, z: pool.z + 1.4, rot: 90, room: 'deck' },
    ],
    [pool]
  )

  useFrame((_, dt) => {
    assets.tex.water.offset.x += dt * 0.03
    assets.tex.water.offset.y += dt * 0.018
  })

  const trees: [number, number, number, boolean][] = [
    [minX - 6, minZ - 5, 1.4, false],
    [cx - 9, minZ - 8, 1.2, true],
    [cx + 4, minZ - 9, 1.5, false],
    [maxX + 10, minZ - 3, 1.2, true],
    [maxX + 11, cz + 4, 1.3, false],
    [minX - 7, cz, 1.3, true],
    [minX - 6, maxZ + 2, 1.2, false],
    [maxX + 5, maxZ + 8, 1.0, true],
    [cx + 10, maxZ + 8.5, 1.1, false],
  ]

  const shrubs: [number, number][] = []
  for (let x = minX + 1; x < pool.x - 1.5; x += 2.6) shrubs.push([x, minZ - 1.1])
  if (hall) for (const dx of [-2.2, 2.6]) shrubs.push([hall.cx + dx, maxZ + 0.9])

  const lamps: [number, number][] = [
    [(garage ? garage.rects[0].x + garage.rects[0].w : cx) + 1.2, maxZ + 3],
    [(garage ? garage.rects[0].x + garage.rects[0].w : cx) + 1.2, maxZ + 8],
    [(hall ? hall.cx : cx) + 1.6, maxZ + 4],
    [minX - 1.5, cz],
    [deck.x1 + 0.5, deck.z0],
  ]

  return (
    <>
      {/* terreno */}
      <mesh position={[cx, -0.32, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={isPlan ? assets.plan.ground : real.grass}>
        <planeGeometry args={[320, 320]} />
      </mesh>

      {/* deck + piscina */}
      <TexBox x={(deck.x0 + deck.x1) / 2} y={-0.25} z={(deck.z0 + deck.z1) / 2} w={deck.x1 - deck.x0} h={0.12} d={deck.z1 - deck.z0} tile={2.4} cast={false} material={isPlan ? assets.plan.deck : real.deck} />
      <TexBox x={pool.x + pool.w / 2} y={-0.17} z={pool.z + pool.d / 2} w={pool.w + 0.6} h={0.1} d={pool.d + 0.6} tile={1.6} cast={false} material={isPlan ? assets.plan.slab : real.coping} />
      <mesh position={[pool.x + pool.w / 2, -0.11, pool.z + pool.d / 2]} material={isPlan ? assets.plan.pool : real.water} receiveShadow>
        <boxGeometry args={[pool.w, 0.04, pool.d]} />
      </mesh>

      {!isPlan && (
        <>
          <Furniture items={loungers} assets={assets} isPlan={false} baseY={-0.19} />

          {/* rua, calçada e acessos */}
          <TexBox x={cx} y={-0.3} z={streetZ + 3.5} w={320} h={0.04} d={7} tile={4} cast={false} material={real.asphalt} />
          <TexBox x={cx} y={-0.28} z={streetZ - 0.9} w={320} h={0.04} d={1.8} tile={2.4} cast={false} material={real.pavers} />
          {garage && (
            <TexBox
              x={garage.rects[0].x + garage.rects[0].w / 2}
              y={-0.29}
              z={(garage.rects[0].z + garage.rects[0].d + streetZ) / 2}
              w={garage.rects[0].w}
              h={0.04}
              d={streetZ - (garage.rects[0].z + garage.rects[0].d)}
              tile={2.4}
              cast={false}
              material={real.pavers}
            />
          )}
          {hall && (
            <TexBox
              x={hall.cx}
              y={-0.29}
              z={(hall.rects[0].z + hall.rects[0].d + streetZ) / 2}
              w={1.7}
              h={0.04}
              d={streetZ - (hall.rects[0].z + hall.rects[0].d)}
              tile={1.6}
              cast={false}
              material={real.pavers}
            />
          )}

          {/* árvores, arbustos e luminárias de jardim */}
          {trees.map(([x, z, s, cone], i) => (
            <Tree key={i} x={x} z={z} s={s} phase={i * 1.7} cone={cone} />
          ))}
          {shrubs.map(([x, z], i) => (
            <mesh key={i} position={[x, 0.3, z]} castShadow>
              <icosahedronGeometry args={[0.55, 1]} />
              <meshStandardMaterial color={i % 2 ? '#2f6b3d' : '#3a7a46'} roughness={0.95} flatShading />
            </mesh>
          ))}
          {lamps.map(([x, z], i) => (
            <group key={i} position={[x, -0.3, z]}>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              <mesh position={[0, 0.78, 0]}>
                <sphereGeometry args={[0.12, 12, 10]} />
                <meshStandardMaterial color="#fff3d6" emissive="#ffd38a" emissiveIntensity={night ? 2.2 : 0.05} />
              </mesh>
            </group>
          ))}
          {/* luz da piscina */}
          {night && <pointLight position={[pool.x + pool.w / 2, 0.2, pool.z + pool.d / 2]} color="#5fd8ff" intensity={30} distance={9} decay={2} />}
        </>
      )}
    </>
  )
}

// ---------------------------------------------------------------- câmera

function Rig({ mode, plan }: { mode: CasaMode; plan: BuiltPlan }) {
  const controls = useThree((s) => s.controls) as unknown as { target: THREE.Vector3; update: () => void } | null
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.size.width / Math.max(s.size.height, 1))
  const animating = useRef(true)
  const { minX, maxX, minZ, maxZ } = plan.bbox
  const cx = (minX + maxX) / 2
  const cz = (minZ + maxZ) / 2
  const R = Math.max(maxX - minX, maxZ - minZ)

  const [pos, tgt] = useMemo(() => {
    const k = aspect < 1.2 ? Math.min(2.2, Math.pow(1.2 / aspect, 0.85)) : 1
    const t = new THREE.Vector3(cx, mode === 'corte' ? 0 : 1.2, cz)
    const p = mode === 'corte' ? new THREE.Vector3(cx + R * 0.08, R * 0.98, cz + R * 0.58) : new THREE.Vector3(cx + R * 0.58, R * 0.34, cz + R * 1.12)
    return [t.clone().add(p.sub(t).multiplyScalar(k)), t] as const
  }, [mode, aspect, cx, cz, R])

  useEffect(() => {
    animating.current = true
  }, [mode, aspect])

  useFrame((_, dt) => {
    if (mode === 'planta' || !animating.current || !controls) return
    const k = 1 - Math.exp(-dt * 3.2)
    camera.position.lerp(pos, k)
    controls.target.lerp(tgt, k)
    controls.update()
    if (camera.position.distanceTo(pos) < 0.2 && controls.target.distanceTo(tgt) < 0.1) animating.current = false
  })

  return null
}

// ---------------------------------------------------------------- cena

export interface CasaSceneProps {
  plan: BuiltPlan
  mode: CasaMode
  selected: string | null
  onSelect: (id: string) => void
  night: boolean
  zoomOn: boolean
  autoRotate: boolean
  showFurniture: boolean
  showDims: boolean
  panelOpen: boolean
  onPerf: (level: 'low' | 'high') => void
}

export function CasaScene({ plan, mode, selected, onSelect, night, zoomOn, autoRotate, showFurniture, showDims, panelOpen, onPerf }: CasaSceneProps) {
  const assets = useCasaAssets()
  const isPlan = mode === 'planta'
  const { minX, maxX, minZ, maxZ } = plan.bbox
  const cx = (minX + maxX) / 2
  const cz = (minZ + maxZ) / 2
  const bw = maxX - minX
  const bd = maxZ - minZ
  const R = Math.max(bw, bd)
  const size = useThree((s) => s.size)
  const hasPanel = size.width >= 768 && panelOpen
  const zoomFit = Math.max(4, Math.min((size.width - (hasPanel ? 260 : 0)) / (bw + 5), (size.height - 175) / (bd + 5.5)))
  const planOffsetX = hasPanel ? 130 / zoomFit : 0
  // desloca a planta para baixo do título e das cotas
  const planOffsetZ = -2.6
  const center = useMemo(() => new THREE.Vector3(cx, 0, cz), [cx, cz])
  const sunTarget = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(cx, 0, cz)
    return o
  }, [cx, cz])
  const selectedRoom = plan.rooms.find((r) => r.id === selected) ?? null

  // luzes internas (noite acende mais forte)
  const lightRooms = ['living', 'coz', 'tv', 'mb', 'gourmet', 'hall', 'gal', 'esc']
    .map((id) => plan.rooms.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  useEffect(() => {
    const glass = assets.real.glass
    glass.emissive.set(night ? '#ffcf9a' : '#000000')
    glass.emissiveIntensity = night ? 0.5 : 0
    glass.needsUpdate = true
  }, [night, assets])

  return (
    <>
      <PerformanceMonitor onDecline={() => onPerf('low')} onIncline={() => onPerf('high')} />

      {/* câmeras: perspectiva para a casa, ortográfica para a planta técnica */}
      <PerspectiveCamera makeDefault={!isPlan} fov={38} near={0.1} far={900} position={[cx + R * 0.58, R * 0.34, cz + R * 1.12]} />
      <OrthographicCamera makeDefault={isPlan} position={[cx + planOffsetX, 140, cz + planOffsetZ + 0.01]} zoom={zoomFit} near={0.1} far={500} />

      {isPlan ? (
        <color attach="background" args={['#f6f5f1']} />
      ) : (
        <>
          <Sky night={night} center={center} />
          <fog attach="fog" args={[night ? FOG_NIGHT : FOG_DAY, R * 1.6, R * 5]} />
          <Environment resolution={128} frames={1} environmentIntensity={night ? 0.14 : 0.8}>
            <color attach="background" args={['#1b2540']} />
            <Lightformer form="rect" intensity={3} color="#ffe2b8" position={[6, 9, 5]} scale={[12, 7, 1]} />
            <Lightformer form="rect" intensity={1.4} color="#9fc4ff" position={[-9, 5, -6]} rotation-y={Math.PI / 2} scale={[14, 6, 1]} />
            <Lightformer form="rect" intensity={0.9} color="#ffd9a8" position={[0, 3, 12]} scale={[16, 4, 1]} />
          </Environment>
        </>
      )}

      <hemisphereLight args={[night ? '#5f7bd8' : '#d6e9ff', night ? '#10131c' : '#8a9a78', isPlan ? 1.0 : night ? 0.16 : 0.75]} />
      <primitive object={sunTarget} />
      <directionalLight
        position={[cx + R * 0.7, R * 0.6, cz + R * 0.62]}
        target={sunTarget}
        intensity={isPlan ? 0 : night ? 0.35 : 3.1}
        color={night ? '#8aa4ff' : '#fff1d6'}
        castShadow={!isPlan}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-R * 0.85}
        shadow-camera-right={R * 0.85}
        shadow-camera-top={R * 0.85}
        shadow-camera-bottom={-R * 0.85}
        shadow-camera-near={1}
        shadow-camera-far={R * 3}
        shadow-bias={-0.0003}
        shadow-normalBias={0.04}
        shadow-radius={3}
      />

      <Outdoors plan={plan} assets={assets} isPlan={isPlan} night={night} />

      <Floors plan={plan} assets={assets} isPlan={isPlan} />
      <WallScale target={mode === 'corte' ? 0.42 : 1}>
        <Walls plan={plan} assets={assets} isPlan={isPlan} />
      </WallScale>
      {showFurniture && <Furniture items={plan.furniture} assets={assets} isPlan={isPlan} />}
      {/* na planta técnica o telhado nem entra na cena; no corte ele sobe com um leve quique */}
      {!isPlan && (
        <RoofLift target={mode === 'fachada' ? 0 : HIDDEN}>
          <Roof plan={plan} assets={assets} />
        </RoofLift>
      )}

      {/* luzes de dentro de casa */}
      {!isPlan &&
        lightRooms.map((r) => (
          <pointLight key={r.id} position={[r.cx, plan.ceiling - 0.4, r.cz]} color="#ffcf9a" intensity={night ? 55 : 12} distance={night ? 12 : 9} decay={2} />
        ))}

      {selectedRoom && <Highlight room={selectedRoom} />}
      {mode !== 'fachada' && <RoomLabels plan={plan} selected={selected} onSelect={onSelect} detailed={isPlan} dense={size.width < 640} />}
      {isPlan && (
        <>
          <DoorArcs arcs={plan.arcs} />
          {showDims && <Dimensions plan={plan} />}
          <ScaleBar plan={plan} />
        </>
      )}

      <OrbitControls
        makeDefault
        target={isPlan ? [cx + planOffsetX, 0, cz + planOffsetZ] : [cx, 1, cz]}
        enableRotate={!isPlan}
        enablePan={isPlan}
        screenSpacePanning
        enableZoom={zoomOn}
        enableDamping
        dampingFactor={0.07}
        minDistance={R * 0.3}
        maxDistance={R * 2.6}
        minZoom={zoomFit * 0.6}
        maxZoom={zoomFit * 5}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 - 0.03}
        autoRotate={autoRotate && mode === 'fachada'}
        autoRotateSpeed={0.5}
      />
      <Rig mode={mode} plan={plan} />
    </>
  )
}
