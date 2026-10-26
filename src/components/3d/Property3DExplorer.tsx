'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, PerspectiveCamera, Environment, ContactShadows, Stage } from '@react-three/drei'
import { createHouseGroup, updateExplosion, defaultApartmentConfig, ROOM_TYPE_LABELS, ROOM_TYPE_COLORS } from './HouseModel'
import { Group, Mesh, Vector3 } from 'three'

// Componente interno para o modelo da casa com animação de explosão
function HouseModel3D({ exploded, explodeFactor, onRoomHover, onRoomClick }: {
  exploded: boolean
  explodeFactor: number
  onRoomHover?: (room: { name: string; type: string } | null) => void
  onRoomClick?: (room: { name: string; type: string }) => void
}) {
  const groupRef = useRef<Group>(null)
  const { camera } = useThree()

  // Atualiza a explosão a cada frame
  useFrame(() => {
    if (groupRef.current) {
      updateExplosion(groupRef.current, explodeFactor)
    }
  })

  return (
    <group ref={groupRef} onPointerOver={(e) => e.stopPropagation()}>
      {defaultApartmentConfig.rooms.map((room, index) => (
        <RoomMesh
          key={index}
          room={room}
          exploded={exploded}
          explodeFactor={explodeFactor}
          onHover={onRoomHover}
          onClick={onRoomClick}
        />
      ))}
      <FloorMesh />
      <RoofMesh />
    </group>
  )
}

// Mesh individual de cada cômodo com interação
function RoomMesh({
  room,
  exploded,
  explodeFactor,
  onHover,
  onClick
}: {
  room: any
  exploded: boolean
  explodeFactor: number
  onHover?: (room: { name: string; type: string } | null) => void
  onClick?: (room: { name: string; type: string }) => void
}) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  useFrame(() => {
    if (meshRef.current) {
      const originalPos = new Vector3(room.position[0], room.position[1], room.position[2])
      const center = new Vector3(0, 0, 0)
      const direction = originalPos.clone().sub(center).normalize()

      if (direction.length() === 0) direction.set(0, 1, 0)

      if (exploded && explodeFactor > 0) {
        meshRef.current.position.copy(originalPos).add(direction.multiplyScalar(explodeFactor * 2))
        if (meshRef.current.material && 'opacity' in meshRef.current.material) {
          ;(meshRef.current.material as any).opacity = hovered ? 0.9 : 0.7
        }
      } else {
        meshRef.current.position.copy(originalPos)
        if (meshRef.current.material && 'opacity' in meshRef.current.material) {
          ;(meshRef.current.material as any).opacity = hovered ? 0.95 : 0.85
        }
      }

      // Rótulo sempre virado para a câmera
      if (exploded && explodeFactor > 0.5) {
        const label = meshRef.current.getObjectByName('label')
        if (label) label.quaternion.copy(camera.quaternion)
      }
    }
  })

  const handlePointerOver = () => {
    setHovered(true)
    onHover?.({ name: room.name, type: room.type })
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHover?.(null)
  }

  const handleClick = (e: any) => {
    e.stopPropagation()
    onClick?.({ name: room.name, type: room.type })
  }

  return (
    <mesh
      ref={meshRef}
      geometry={new (require('three').BoxGeometry)(room.size[0], room.size[1], room.size[2])}
      material={new (require('three').MeshStandardMaterial)({
        color: room.color,
        transparent: true,
        opacity: exploded ? 0.7 : 0.85,
        metalness: 0.1,
        roughness: 0.7,
        side: 2,
      })}
      position={room.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      userData={{ roomName: room.name, roomType: room.type }}
    >
      {/* Rótulo do cômodo (visível apenas quando explodido) */}
      {exploded && explodeFactor > 0.5 && (
        <Html
          position={[0, room.size[1] / 2 + 0.3, 0]}
          name="label"
          occlude={false}
          transform
          style={{
            pointerEvents: 'none',
            fontSize: '12px',
            fontWeight: 600,
            color: '#fff',
            textShadow: '0 0 4px #000, 0 0 8px #000',
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 8px',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)',
          }}
        >
          {room.name}
        </Html>
      )}
    </mesh>
  )
}

function FloorMesh() {
  return (
    <mesh
      geometry={new (require('three').BoxGeometry)(30, 0.2, 30)}
      material={new (require('three').MeshStandardMaterial)({
        color: '#1e293b',
        roughness: 0.9,
        metalness: 0.1,
      })}
      position={[0, -1.45, 0]}
      userData={{ roomName: 'Chão', roomType: 'floor' }}
    />
  )
}

function RoofMesh() {
  const maxHeight = Math.max(...defaultApartmentConfig.rooms.map(r => r.position[1] + r.size[1] / 2))

  return (
    <mesh
      geometry={new (require('three').BoxGeometry)(32, 1, 32)}
      material={new (require('three').MeshStandardMaterial)({
        color: '#78350f',
        roughness: 0.8,
        metalness: 0.1,
      })}
      position={[0, maxHeight + 1.5, 0]}
      userData={{ roomName: 'Telhado', roomType: 'roof' }}
    />
  )
}

// Câmera com controles de órbita
function ExplorerCamera() {
  const { camera } = useThree()

  useFrame(() => {
    // Animação suave da câmera
  })

  return (
    <PerspectiveCamera
      makeDefault
      position={[15, 12, 15]}
      fov={50}
      near={0.1}
      far={100}
    />
  )
}

// Painel de informações do cômodo selecionado
function RoomInfoPanel({ room }: { room: { name: string; type: string } | null }) {
  if (!room) return null

  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '16px 20px',
        minWidth: '220px',
        maxWidth: '280px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            background: ROOM_TYPE_COLORS[room.type] || '#64748b',
            boxShadow: `0 0 8px ${ROOM_TYPE_COLORS[room.type] || '#64748b'}`,
          }}
        />
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff', textTransform: 'capitalize' }}>
          {ROOM_TYPE_LABELS[room.type] || room.type}
        </span>
      </div>
      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
        {room.name}
      </h4>
      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
        Clique para ver detalhes e fotos deste cômodo
      </p>
    </Html>
  )
}

// Controles de UI
function ExplorerControls({
  exploded,
  setExploded,
  explodeFactor,
  setExplodeFactor,
  selectedRoom,
  onCloseRoomInfo
}: {
  exploded: boolean
  setExploded: (v: boolean) => void
  explodeFactor: number
  setExplodeFactor: (v: number) => void
  selectedRoom: { name: string; type: string } | null
  onCloseRoomInfo: () => void
}) {
  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Botão Explodir/Reunir */}
      <button
        onClick={() => setExploded(!exploded)}
        style={{
          background: exploded ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)' }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)' }}
      >
        {exploded ? '🔄 Reunir' : '💥 Explodir'}
      </button>

      {/* Slider de intensidade da explosão */}
      {exploded && (
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '10px', padding: '16px', minWidth: '200px' }}>
          <label style={{ display: 'block', color: '#e2e8f0', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
            Distância da explosão: {Math.round(explodeFactor * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodeFactor}
            onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#22c55e',
              cursor: 'pointer',
            }}
          />
        </div>
      )}

      {/* Painel de info do cômodo selecionado */}
      {selectedRoom && (
        <RoomInfoPanel room={selectedRoom} />
      )}
    </Html>
  )
}

// Legenda dos tipos de cômodos
function RoomLegend() {
  const types = ['living', 'kitchen', 'bedroom', 'bathroom', 'balcony', 'hallway', 'laundry']

  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 16px',
        maxWidth: '400px',
      }}
    >
      {types.map((type) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              background: ROOM_TYPE_COLORS[type],
              boxShadow: `0 0 6px ${ROOM_TYPE_COLORS[type]}`,
            }}
          />
          <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 500 }}>
            {ROOM_TYPE_LABELS[type]}
          </span>
        </div>
      ))}
    </Html>
  )
}

// Componente principal do explorador 3D
export function Property3DExplorer({
  config = defaultApartmentConfig,
  className = '',
  title = 'Explore em 3D',
  subtitle = 'Navegue pelo imóvel, clique nos cômodos para ver detalhes',
}: {
  config?: typeof defaultApartmentConfig
  className?: string
  title?: string
  subtitle?: string
}) {
  const [exploded, setExploded] = useState(false)
  const [explodeFactor, setExplodeFactor] = useState(0.5)
  const [hoveredRoom, setHoveredRoom] = useState<{ name: string; type: string } | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<{ name: string; type: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`relative h-[500px] w-full rounded-2xl bg-gray-900/50 ${className}`}>
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
    <div className={`relative h-[600px] w-full rounded-2xl overflow-hidden bg-gray-950 ${className}`}>
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ touchAction: 'none' }}
      >
        <ExplorerCamera />
        <Stage
          environment="city"
          preset="rembrandt"
          intensity={1.2}
        >
          <HouseModel3D
            exploded={exploded}
            explodeFactor={explodeFactor}
            onRoomHover={setHoveredRoom}
            onRoomClick={setSelectedRoom}
          />
        </Stage>
        <ContactShadows opacity={0.3} scale={20} blur={2} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={40}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 1, 0]}
        />
        <Environment preset="city" background={false} />
      </Canvas>

      {/* UI Overlay */}
      <ExplorerControls
        exploded={exploded}
        setExploded={setExploded}
        explodeFactor={explodeFactor}
        setExplodeFactor={setExplodeFactor}
        selectedRoom={selectedRoom}
        onCloseRoomInfo={() => setSelectedRoom(null)}
      />
      <RoomLegend />

      {/* Dica de interação */}
      <Html
        position={[0, 0, 0]}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '10px',
          padding: '12px 16px',
          color: '#e2e8f0',
          fontSize: '13px',
          lineHeight: 1.6,
          maxWidth: '280px',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#fff' }}>Como navegar:</p>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#94a3b8' }}>
          <li>🖱️ Arrastar: Rotacionar visão</li>
          <li>🔄 Scroll: Zoom in/out</li>
          <li>✋ Botão direito: Mover câmera</li>
          <li>👆 Clique no cômodo: Ver detalhes</li>
        </ul>
      </Html>
    </div>
  )
}

// Componente wrapper com Suspense para carregamento
export function Property3DExplorerWrapper(props: Parameters<typeof Property3DExplorer>[0]) {
  return (
    <Suspense fallback={
      <div className={`relative h-[600px] w-full rounded-2xl bg-gray-900/50 ${props.className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary-500 border-t-transparent mx-auto mb-4" />
            <p>Carregando visualização 3D...</p>
          </div>
        </div>
      </div>
    }>
      <Property3DExplorer {...props} />
    </Suspense>
  )
}