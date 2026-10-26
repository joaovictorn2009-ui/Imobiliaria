'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { ScrollControls, Html, PerspectiveCamera, Environment, ContactShadows, Stage } from '@react-three/drei'
import { Group, Mesh, BoxGeometry, MeshStandardMaterial, Vector3 } from 'three'
import { defaultHouseConfig, ROOM_TYPE_LABELS, ROOM_TYPE_COLORS, updateExplosion } from './HouseModel'
import { motion } from 'framer-motion'

// Estende o Three.js para usar componentes personalizados
extend({ Group, Mesh, BoxGeometry, MeshStandardMaterial })

// Configuração do modelo para a vista explodida (casa térrea)
const EXPLODED_CONFIG = defaultHouseConfig

// Componente do modelo da casa que responde ao scroll
function ExplodedHouseModel({ progress }: { progress: number }) {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      updateExplosion(groupRef.current, progress)
    }
  })

  return (
    <group ref={groupRef}>
      {EXPLODED_CONFIG.rooms.map((room, index) => (
        <ExplodedRoomMesh
          key={index}
          room={room}
          progress={progress}
          index={index}
        />
      ))}
      <ExplodedFloorMesh progress={progress} />
      <ExplodedRoofMesh progress={progress} />
    </group>
  )
}

// Mesh individual de cada cômodo com animação de explosão baseada no scroll
function ExplodedRoomMesh({
  room,
  progress,
  index
}: {
  room: any
  progress: number
  index: number
}) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  // Calcula a posição baseada no progress do scroll (0 a 1)
  useFrame(() => {
    if (meshRef.current) {
      const originalPos = new Vector3(room.position[0], room.position[1], room.position[2])
      const center = new Vector3(0, 0, 0)
      const direction = originalPos.clone().sub(center).normalize()

      if (direction.length() === 0) direction.set(0, 1, 0)

      // Fator de explosão: 0 = junto, 1 = totalmente explodido
      // Usa curva ease-out para animação mais natural
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const explodeDistance = easedProgress * 3.5 // distância máxima da explosão

      // Atraso escalonado para cada cômodo (efeito cascata)
      const delay = index * 0.03
      const roomProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay * EXPLODED_CONFIG.rooms.length)))
      const roomEasedProgress = 1 - Math.pow(1 - roomProgress, 3)
      const roomExplodeDistance = roomEasedProgress * 3.5

      meshRef.current.position.copy(originalPos).add(direction.multiplyScalar(roomExplodeDistance))

      // Opacidade muda durante a explosão
      if (meshRef.current.material && 'opacity' in meshRef.current.material) {
        const opacity = hovered ? 0.95 : 0.7 + (1 - roomEasedProgress) * 0.2
        ;(meshRef.current.material as any).opacity = opacity
      }

      // Rótulo sempre virado para a câmera quando explodido
      if (roomEasedProgress > 0.3) {
        const label = meshRef.current.getObjectByName('label')
        if (label) label.quaternion.copy(camera.quaternion)
      }
    }
  })

  const handlePointerOver = () => setHovered(true)
  const handlePointerOut = () => setHovered(false)

  return (
    <mesh
      ref={meshRef}
      geometry={new BoxGeometry(room.size[0], room.size[1], room.size[2])}
      material={new MeshStandardMaterial({
        color: room.color,
        transparent: true,
        opacity: 0.85,
        metalness: 0.1,
        roughness: 0.7,
        side: 2,
      })}
      position={room.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      userData={{ roomName: room.name, roomType: room.type }}
    >
      {/* Rótulo do cômodo - aparece durante a explosão */}
      {progress > 0.2 && (
        <Html
          position={[0, room.size[1] / 2 + 0.5, 0]}
          name="label"
          occlude={false}
          transform
          style={{
            pointerEvents: 'none',
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            textShadow: '0 0 6px #000, 0 0 12px #000',
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: '6px',
            backdropFilter: 'blur(4px)',
            opacity: progress > 0.5 ? 1 : progress * 2,
            transform: `scale(${progress > 0.5 ? 1 : progress * 2})`,
            transition: 'opacity 0.3s, transform 0.3s',
          }}
        >
          {room.name}
          <span style={{
            marginLeft: '8px',
            padding: '1px 6px',
            borderRadius: '3px',
            background: ROOM_TYPE_COLORS[room.type],
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {ROOM_TYPE_LABELS[room.type] || room.type}
          </span>
        </Html>
      )}
    </mesh>
  )
}

function ExplodedFloorMesh({ progress }: { progress: number }) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      // O chão sobe ligeiramente durante a explosão
      const yOffset = progress * 0.5
      meshRef.current.position.y = -1.45 + yOffset
      // Opacidade diminui
      if (meshRef.current.material && 'opacity' in meshRef.current.material) {
        ;(meshRef.current.material as any).opacity = 1 - progress * 0.3
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={new BoxGeometry(30, 0.2, 30)}
      material={new MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      })}
      position={[0, -1.45, 0]}
    />
  )
}

function ExplodedRoofMesh({ progress }: { progress: number }) {
  const meshRef = useRef<Mesh>(null)
  const maxHeight = Math.max(...EXPLODED_CONFIG.rooms.map(r => r.position[1] + r.size[1] / 2))

  useFrame(() => {
    if (meshRef.current) {
      // Telhado explode para cima
      const baseY = maxHeight + 1.5
      meshRef.current.position.y = baseY + progress * 5
      // Rotação leve para efeito dramático
      meshRef.current.rotation.y = progress * 0.1
      // Opacidade
      if (meshRef.current.material && 'opacity' in meshRef.current.material) {
        ;(meshRef.current.material as any).opacity = 1 - progress * 0.5
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={new BoxGeometry(32, 1, 32)}
      material={new MeshStandardMaterial({
        color: '#78350f',
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      })}
      position={[0, maxHeight + 1.5, 0]}
    />
  )
}

// Câmera que acompanha a explosão
function ExplodedCamera({ progress }: { progress: number }) {
  return (
    <PerspectiveCamera
      makeDefault
      position={[20, 15, 20]}
      fov={50}
      near={0.1}
      far={100}
    />
  )
}

// Indicador de progresso do scroll
function ScrollProgressIndicator({ progress }: { progress: number }) {
  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div style={{
        width: '200px',
        height: '6px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '3px',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6)',
            borderRadius: '3px',
            width: `${progress * 100}%`,
          }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
      <span style={{
        fontSize: '12px',
        color: '#94a3b8',
        fontWeight: 500,
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '4px 12px',
        borderRadius: '20px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      }}>
        {Math.round(progress * 100)}% explorado
      </span>
    </Html>
  )
}

// Painel lateral com lista dos cômodos
function RoomListPanel({ progress }: { progress: number }) {
  const visibleRooms = EXPLODED_CONFIG.rooms.filter((_, index) => {
    const delay = index * 0.03
    return progress > delay
  })

  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        minWidth: '250px',
        maxWidth: '300px',
        maxHeight: '60vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Cômodos revelados
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {EXPLODED_CONFIG.rooms.map((room, index) => {
          const delay = index * 0.03
          const isVisible = progress > delay
          const roomProgress = isVisible ? Math.min(1, (progress - delay) / 0.1) : 0

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isVisible ? 1 : 0.3, x: 0 }}
              transition={{ duration: 0.3, delay: delay * 1000 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                background: isVisible ? 'rgba(34, 197, 94, 0.15)' : 'rgba(148, 163, 184, 0.1)',
                borderRadius: '8px',
                border: `1px solid ${isVisible ? 'rgba(34, 197, 94, 0.3)' : 'rgba(148, 163, 184, 0.15)'}`,
                transition: 'all 0.3s',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: ROOM_TYPE_COLORS[room.type],
                  boxShadow: isVisible ? `0 0 8px ${ROOM_TYPE_COLORS[room.type]}` : 'none',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, color: isVisible ? '#fff' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {room.name}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>
                  {ROOM_TYPE_LABELS[room.type] || room.type}
                </p>
              </div>
              {isVisible && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#22c55e',
                    background: 'rgba(34, 197, 94, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          )
        })}
      </div>
    </Html>
  )
}

// Legenda fixa
function FixedLegend() {
  const types = [
    { type: 'living', label: 'Salas' },
    { type: 'kitchen', label: 'Cozinha' },
    { type: 'bedroom', label: 'Quartos' },
    { type: 'bathroom', label: 'Banheiros' },
    { type: 'balcony', label: 'Varanda/Área Externa' },
    { type: 'office', label: 'Escritório' },
    { type: 'laundry', label: 'Lavanderia' },
    { type: 'storage', label: 'Garagem/Depósito' },
  ]

  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px 16px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '12px 20px',
        maxWidth: '90vw',
      }}
    >
      {types.map(({ type, label }) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: ROOM_TYPE_COLORS[type],
              boxShadow: `0 0 6px ${ROOM_TYPE_COLORS[type]}`,
            }}
          />
          <span style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: 500 }}>
            {label}
          </span>
        </div>
      ))}
    </Html>
  )
}

// Instruções de scroll
function ScrollInstructions({ progress }: { progress: number }) {
  if (progress > 0.1) return null

  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        animation: 'bounce 2s infinite',
      }}
    >
      <motion.div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.2)',
          border: '2px solid #22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s infinite',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
      <span style={{
        fontSize: '14px',
        color: '#fff',
        fontWeight: 600,
        background: 'rgba(15, 23, 42, 0.9)',
        padding: '8px 16px',
        borderRadius: '8px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        whiteSpace: 'nowrap',
      }}>
        Role para explorar
      </span>
      <style jsx global>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
        }
      `}</style>
    </Html>
  )
}

// Componente principal da vista explodida com scroll
export function Property3DExplodedView({
  className = '',
  title = 'Explore o Imóvel em 3D',
  subtitle = 'Role a página para ver o imóvel se desmontar e revelar cada cômodo',
  height = '80vh',
}: {
  className?: string
  title?: string
  subtitle?: string
  height?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`relative w-full rounded-2xl bg-gray-900/50 ${className}`} style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary-500 border-t-transparent mx-auto mb-4" />
            <p>Carregando visualização 3D...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      {/* Canvas 3D com ScrollControls */}
      <Canvas
        camera={{ position: [20, 15, 20], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ touchAction: 'none', height: '100%', width: '100%' }}
      >
        <ScrollControls
          pages={3}
          distance={1.5}
          infinite={false}
          horizontal={false}
        >
          {((scrollProps: { progress: number }) => (
            <>
              <ExplodedCamera progress={scrollProps.progress} />
              <Stage
                environment="city"
                preset="rembrandt"
                intensity={1.2}
              >
                <ExplodedHouseModel progress={scrollProps.progress} />
              </Stage>
              <ContactShadows opacity={0.3} scale={25} blur={2} />
              <Environment preset="city" background={false} />

              {/* UI Overlays */}
              <ScrollProgressIndicator progress={scrollProps.progress} />
              <RoomListPanel progress={scrollProps.progress} />
              <FixedLegend />
              <ScrollInstructions progress={scrollProps.progress} />
            </>
          )) as unknown as React.ReactNode}
        </ScrollControls>
      </Canvas>

      {/* Overlay de título (fora do canvas para SEO/acessibilidade) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

// Wrapper com Suspense
export function Property3DExplodedViewWrapper(props: Parameters<typeof Property3DExplodedView>[0]) {
  return (
    <Suspense fallback={
      <div className={`relative w-full rounded-2xl bg-gray-900/50 ${props.className}`} style={{ height: props.height || '80vh' }}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary-500 border-t-transparent mx-auto mb-4" />
            <p>Carregando visualização 3D...</p>
          </div>
        </div>
      </div>
    }>
      <Property3DExplodedView {...props} />
    </Suspense>
  )
}