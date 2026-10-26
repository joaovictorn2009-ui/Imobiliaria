'use client'

import { useRef, useMemo } from 'react'
import { Group, Mesh, BoxGeometry, MeshStandardMaterial, Vector3, Material } from 'three'

// Definição dos cômodos da casa/apartamento
export interface Room {
  name: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
  type: 'bedroom' | 'bathroom' | 'living' | 'kitchen' | 'balcony' | 'hallway' | 'office' | 'laundry' | 'storage'
}

export interface HouseConfig {
  rooms: Room[]
  floors: number
  scale: number
}

// Configuração padrão para um apartamento de 3 quartos
export const defaultApartmentConfig: HouseConfig = {
  scale: 1,
  floors: 1,
  rooms: [
    // Sala de estar (maior cômodo)
    { name: 'Sala de Estar', position: [-3, 0, 2], size: [4, 2.5, 4], color: '#4ade80', type: 'living' },
    // Sala de jantar
    { name: 'Sala de Jantar', position: [-3, 0, -1.5], size: [4, 2.5, 2.5], color: '#22c55e', type: 'living' },
    // Cozinha
    { name: 'Cozinha', position: [1.5, 0, 2], size: [3, 2.5, 3.5], color: '#f97316', type: 'kitchen' },
    // Varanda
    { name: 'Varanda', position: [-3, 0, -4.5], size: [4, 2.5, 1.5], color: '#06b6d4', type: 'balcony' },
    // Suíte master
    { name: 'Suíte Master', position: [4.5, 0, 3], size: [3.5, 2.5, 4], color: '#8b5cf6', type: 'bedroom' },
    // Banheiro da suíte
    { name: 'Banheiro Suíte', position: [4.5, 0, -0.5], size: [2, 2.5, 2], color: '#a855f7', type: 'bathroom' },
    // Quarto 2
    { name: 'Quarto 2', position: [4.5, 0, -3], size: [3, 2.5, 3], color: '#a855f7', type: 'bedroom' },
    // Quarto 3
    { name: 'Quarto 3', position: [4.5, 0, -6.5], size: [3, 2.5, 3], color: '#a855f7', type: 'bedroom' },
    // Banheiro social
    { name: 'Banheiro Social', position: [1.5, 0, -4.5], size: [2.5, 2.5, 2], color: '#ec4899', type: 'bathroom' },
    // Lavanderia
    { name: 'Lavanderia', position: [1.5, 0, -1.5], size: [2, 2.5, 2], color: '#f472b6', type: 'laundry' },
    // Hall de entrada
    { name: 'Hall de Entrada', position: [-6, 0, 0], size: [2, 2.5, 4], color: '#64748b', type: 'hallway' },
  ],
}

// Configuração para uma casa térrea
export const defaultHouseConfig: HouseConfig = {
  scale: 1,
  floors: 1,
  rooms: [
    // Sala de estar
    { name: 'Sala de Estar', position: [-4, 0, 4], size: [6, 3, 6], color: '#4ade80', type: 'living' },
    // Sala de jantar
    { name: 'Sala de Jantar', position: [2, 0, 4], size: [5, 3, 4], color: '#22c55e', type: 'living' },
    // Cozinha
    { name: 'Cozinha', position: [7, 0, 4], size: [4, 3, 5], color: '#f97316', type: 'kitchen' },
    // Varanda/Área externa
    { name: 'Área Gourmet', position: [7, 0, -1], size: [4, 3, 4], color: '#06b6d4', type: 'balcony' },
    // Suíte master
    { name: 'Suíte Master', position: [-4, 0, -4], size: [5, 3, 5], color: '#8b5cf6', type: 'bedroom' },
    // Banheiro suíte
    { name: 'Banheiro Suíte', position: [-4, 0, -9.5], size: [3, 3, 3], color: '#a855f7', type: 'bathroom' },
    // Quarto 2
    { name: 'Quarto 2', position: [2, 0, -4], size: [4, 3, 4], color: '#a855f7', type: 'bedroom' },
    // Quarto 3
    { name: 'Quarto 3', position: [7, 0, -7], size: [4, 3, 4], color: '#a855f7', type: 'bedroom' },
    // Banheiro social
    { name: 'Banheiro Social', position: [2, 0, -8.5], size: [3, 3, 2.5], color: '#ec4899', type: 'bathroom' },
    // Escritório
    { name: 'Escritório', position: [-4, 0, -10], size: [4, 3, 3], color: '#3b82f6', type: 'office' },
    // Lavanderia
    { name: 'Lavanderia', position: [7, 0, -11], size: [3, 3, 2.5], color: '#f472b6', type: 'laundry' },
    // Garagem
    { name: 'Garagem', position: [-9, 0, 0], size: [5, 3, 6], color: '#64748b', type: 'storage' },
  ],
}

export function createRoomMesh(room: Room, exploded = false, explodeFactor = 1) {
  const geometry = new BoxGeometry(room.size[0], room.size[1], room.size[2])

  // Material com transparência para ver o interior
  const material = new MeshStandardMaterial({
    color: room.color,
    transparent: true,
    opacity: exploded ? 0.7 : 0.85,
    metalness: 0.1,
    roughness: 0.7,
    side: 2, // DoubleSide
  })

  const mesh = new Mesh(geometry, material)

  // Posição original
  const basePosition = new Vector3(room.position[0], room.position[1], room.position[2])

  if (exploded && explodeFactor > 0) {
    // Direção da explosão baseada na posição do cômodo (afasta do centro)
    const center = new Vector3(0, 0, 0)
    const direction = basePosition.clone().sub(center).normalize()
    // Se estiver no centro, usa direção padrão
    if (direction.length() === 0) {
      direction.set(0, 1, 0)
    }
    // Aplica o fator de explosão
    mesh.position.copy(basePosition).add(direction.multiplyScalar(explodeFactor * 2))
  } else {
    mesh.position.copy(basePosition)
  }

  mesh.userData = { roomName: room.name, roomType: room.type, originalPosition: basePosition }

  return mesh
}

export function createHouseGroup(config: HouseConfig, exploded = false, explodeFactor = 1) {
  const group = new Group()

  config.rooms.forEach((room) => {
    const mesh = createRoomMesh(room, exploded, explodeFactor)
    group.add(mesh)
  })

  // Adiciona chão
  const floorGeometry = new BoxGeometry(30, 0.2, 30)
  const floorMaterial = new MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.9,
    metalness: 0.1,
  })
  const floor = new Mesh(floorGeometry, floorMaterial)
  floor.position.y = -1.45
  floor.userData = { roomName: 'Chão', roomType: 'floor' }
  group.add(floor)

  // Adiciona telhado (para casa)
  if (config.floors === 1) {
    const roofGeometry = new BoxGeometry(32, 1, 32)
    const roofMaterial = new MeshStandardMaterial({
      color: '#78350f',
      roughness: 0.8,
      metalness: 0.1,
    })
    const roof = new Mesh(roofGeometry, roofMaterial)
    roof.position.y = config.rooms.reduce((max, r) => Math.max(max, r.position[1] + r.size[1] / 2), 0) + 1.5
    roof.userData = { roomName: 'Telhado', roomType: 'roof' }
    group.add(roof)
  }

  // Escala geral
  group.scale.setScalar(config.scale)

  return group
}

// Hook para criar o modelo da casa
export function useHouseModel(config: HouseConfig = defaultApartmentConfig) {
  const houseRef = useRef<Group | null>(null)

  const houseGroup = useMemo(() => {
    houseRef.current = createHouseGroup(config, false, 0)
    return houseRef.current
  }, [config])

  return houseGroup
}

// Função para atualizar a explosão dos cômodos
export function updateExplosion(group: Group | null, explodeFactor: number) {
  if (!group) return

  group.children.forEach((child) => {
    if (child.userData.originalPosition && child instanceof Mesh) {
      const originalPos = child.userData.originalPosition as Vector3
      const center = new Vector3(0, 0, 0)
      const direction = originalPos.clone().sub(center).normalize()

      if (direction.length() === 0) {
        direction.set(0, 1, 0)
      }

      if (explodeFactor > 0) {
        child.position.copy(originalPos).add(direction.multiplyScalar(explodeFactor * 2))
        // Aumenta transparência durante explosão
        const material = child.material as Material
        if (material && 'opacity' in material) {
          (material as any).opacity = 0.7
        }
      } else {
        child.position.copy(originalPos)
        const material = child.material as Material
        if (material && 'opacity' in material) {
          (material as any).opacity = 0.85
        }
      }
    }
  })
}

// Labels dos tipos de cômodos em português
export const ROOM_TYPE_LABELS: Record<string, string> = {
  bedroom: 'Quarto',
  bathroom: 'Banheiro',
  living: 'Sala',
  kitchen: 'Cozinha',
  balcony: 'Varanda',
  hallway: 'Corredor',
  office: 'Escritório',
  laundry: 'Lavanderia',
  storage: 'Depósito/Garagem',
  floor: 'Chão',
  roof: 'Telhado',
}

// Cores para os tipos
export const ROOM_TYPE_COLORS: Record<string, string> = {
  bedroom: '#8b5cf6',
  bathroom: '#ec4899',
  living: '#4ade80',
  kitchen: '#f97316',
  balcony: '#06b6d4',
  hallway: '#64748b',
  office: '#3b82f6',
  laundry: '#f472b6',
  storage: '#64748b',
  floor: '#1e293b',
  roof: '#78350f',
}