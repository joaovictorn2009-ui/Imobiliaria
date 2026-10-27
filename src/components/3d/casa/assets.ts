import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { createTextures, disposeTextures, type TextureSet } from '../textures'
import type { FloorKind } from '../plans/types'

export interface RealMats {
  wallExt: THREE.Material
  wallInt: THREE.Material
  timber: THREE.Material
  stone: THREE.Material
  glass: THREE.MeshStandardMaterial
  frame: THREE.Material
  door: THREE.Material
  slab: THREE.Material
  roofTop: THREE.Material
  roofSoffit: THREE.Material
  concrete: THREE.Material
  floors: Record<FloorKind, THREE.Material>
  pavers: THREE.Material
  grass: THREE.Material
  asphalt: THREE.Material
  deck: THREE.Material
  water: THREE.MeshStandardMaterial
  coping: THREE.Material
}

export interface PlanMats {
  wall: THREE.Material
  glass: THREE.Material
  frame: THREE.Material
  slab: THREE.Material
  floors: Record<FloorKind, THREE.Material>
  furniture: THREE.Material
  ground: THREE.Material
  pool: THREE.Material
  deck: THREE.Material
}

export interface CasaAssets {
  tex: TextureSet
  real: RealMats
  plan: PlanMats
}

const FLOOR_TEX: Record<FloorKind, keyof TextureSet> = {
  wood: 'wood',
  woodDark: 'woodDark',
  tile: 'tile',
  tileLight: 'tileLight',
  stone: 'stone',
  concrete: 'concrete',
}

const PLAN_FLOOR: Record<FloorKind, string> = {
  wood: '#f1e8d9',
  woodDark: '#ece1cf',
  tile: '#e7edf2',
  tileLight: '#eef3f6',
  stone: '#ebe8e1',
  concrete: '#e3e3e1',
}

export function useCasaAssets(): CasaAssets {
  const assets = useMemo<CasaAssets>(() => {
    const tex = createTextures()
    const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p)
    const basic = (color: string, extra: THREE.MeshBasicMaterialParameters = {}) => new THREE.MeshBasicMaterial({ color, ...extra })

    tex.grass.repeat.set(70, 70)
    tex.water.repeat.set(3, 2)

    const floors = {} as Record<FloorKind, THREE.Material>
    ;(Object.keys(FLOOR_TEX) as FloorKind[]).forEach((k) => {
      const glossy = k === 'tile' || k === 'tileLight' || k === 'stone'
      floors[k] = std({
        map: tex[FLOOR_TEX[k]],
        roughness: glossy ? 0.32 : k === 'concrete' ? 0.85 : 0.5,
        metalness: glossy ? 0.05 : 0,
        bumpMap: tex.bump,
        bumpScale: 0.35,
        envMapIntensity: glossy ? 0.9 : 0.5,
      })
    })

    const planFloors = {} as Record<FloorKind, THREE.Material>
    ;(Object.keys(PLAN_FLOOR) as FloorKind[]).forEach((k) => {
      planFloors[k] = basic(PLAN_FLOOR[k])
    })

    const real: RealMats = {
      wallExt: std({ map: tex.stucco, color: '#f4f1ea', bumpMap: tex.bump, bumpScale: 0.9, roughness: 0.95 }),
      wallInt: std({ map: tex.stucco, color: '#f7f4ee', bumpMap: tex.bump, bumpScale: 0.5, roughness: 0.95 }),
      timber: std({ map: tex.timber, bumpMap: tex.bump, bumpScale: 0.8, roughness: 0.62 }),
      stone: std({ map: tex.stoneClad, bumpMap: tex.bump, bumpScale: 1.4, roughness: 0.9 }),
      glass: new THREE.MeshStandardMaterial({
        color: '#a9d8ff',
        transparent: true,
        opacity: 0.26,
        roughness: 0.02,
        metalness: 0.7,
        envMapIntensity: 1.6,
        depthWrite: false,
      }),
      frame: std({ color: '#1d2024', metalness: 0.6, roughness: 0.4 }),
      door: std({ map: tex.woodDark, roughness: 0.5 }),
      slab: std({ map: tex.concrete, color: '#d8d3ca', bumpMap: tex.bump, bumpScale: 0.7, roughness: 0.9 }),
      roofTop: std({ map: tex.roof, bumpMap: tex.bump, bumpScale: 1.1, roughness: 0.85 }),
      roofSoffit: std({ map: tex.timber, color: '#c9a77c', roughness: 0.7 }),
      concrete: std({ map: tex.concrete, color: '#cfcac1', bumpMap: tex.bump, bumpScale: 0.7, roughness: 0.9 }),
      floors,
      pavers: std({ map: tex.pavers, roughness: 0.9 }),
      grass: std({ map: tex.grass, roughness: 1 }),
      asphalt: std({ map: tex.concrete, color: '#55585e', roughness: 1 }),
      deck: std({ map: tex.deck, roughness: 0.78 }),
      water: std({
        color: '#1fb5d6',
        emissive: '#0a6a85',
        emissiveIntensity: 0.5,
        roughness: 0.06,
        metalness: 0.15,
        bumpMap: tex.water,
        bumpScale: 1.2,
        envMapIntensity: 1.6,
      }),
      coping: std({ map: tex.concrete, color: '#e8e4da', roughness: 0.8 }),
    }

    const plan: PlanMats = {
      wall: basic('#272b32'),
      glass: basic('#6fa8e0'),
      frame: basic('#3b414a'),
      slab: basic('#fbfaf7'),
      floors: planFloors,
      furniture: basic('#ffffff'),
      ground: basic('#f6f5f1'),
      pool: basic('#cfe8f6'),
      deck: basic('#efece4'),
    }

    return { tex, real, plan }
  }, [])

  useEffect(() => () => disposeTextures(assets.tex), [assets])
  return assets
}
