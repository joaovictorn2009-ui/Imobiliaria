import { mockProperties } from '@/data/mockProperties'
import {
  PROPERTY_FEATURE_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
  type PropertyFeature,
  type PropertyStatus,
  type PropertyType,
} from '@/types'

export type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'area-desc' | 'sqm-asc'

export interface ListingFilters {
  keyword: string
  status: PropertyStatus | ''
  types: PropertyType[]
  minPrice: number | null
  maxPrice: number | null
  minArea: number | null
  maxArea: number | null
  bedrooms: number
  bathrooms: number
  parking: number
  features: PropertyFeature[]
}

export const emptyFilters: ListingFilters = {
  keyword: '',
  status: '',
  types: [],
  minPrice: null,
  maxPrice: null,
  minArea: null,
  maxArea: null,
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  features: [],
}

export function filterProperties(list: Property[], f: ListingFilters): Property[] {
  const kw = f.keyword.trim().toLowerCase()
  return list.filter((p) => {
    if (f.status && p.status !== f.status) return false
    if (f.types.length && !f.types.includes(p.type)) return false
    if (f.minPrice !== null && p.price < f.minPrice) return false
    if (f.maxPrice !== null && p.price > f.maxPrice) return false
    if (f.minArea !== null && p.area < f.minArea) return false
    if (f.maxArea !== null && p.area > f.maxArea) return false
    if (f.bedrooms && p.bedrooms < f.bedrooms) return false
    if (f.bathrooms && p.bathrooms < f.bathrooms) return false
    if (f.parking && p.parkingSpaces < f.parking) return false
    if (f.features.length && !f.features.every((x) => p.features.includes(x))) return false
    if (kw) {
      const hay = `${p.title} ${p.description} ${p.address.neighborhood} ${p.address.city}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    return true
  })
}

export function sortProperties(list: Property[], sort: SortOption): Property[] {
  const copy = [...list]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'area-desc':
      return copy.sort((a, b) => b.area - a.area)
    case 'sqm-asc':
      return copy.sort((a, b) => a.price / a.area - b.price / b.area)
    default:
      return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find((p) => p.id === id)
}

export function getSimilarProperties(property: Property, limit: number = 4): Property[] {
  return mockProperties
    .filter((p) => p.id !== property.id)
    .filter((p) => p.type === property.type || p.status === property.status)
    .sort((a, b) => {
      const scoreA =
        (a.type === property.type ? 2 : 0) +
        (a.status === property.status ? 1 : 0) -
        Math.abs(a.price - property.price) / 100000
      const scoreB =
        (b.type === property.type ? 2 : 0) +
        (b.status === property.status ? 1 : 0) -
        Math.abs(b.price - property.price) / 100000
      return scoreB - scoreA
    })
    .slice(0, limit)
}

/** Atalhos de busca: cada um aplica um conjunto de filtros de uma vez. */
export interface FilterPreset {
  id: string
  label: string
  filters: Partial<ListingFilters>
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'primeira', label: 'Primeira casa', filters: { status: 'sale', types: ['apartment', 'house'], maxPrice: 1_300_000 } },
  { id: 'familia', label: 'Para a família', filters: { bedrooms: 3, parking: 2 } },
  { id: 'luxo', label: 'Alto padrão', filters: { status: 'sale', minPrice: 2_000_000 } },
  { id: 'piscina', label: 'Com piscina', filters: { features: ['pool'] } },
  { id: 'alugar', label: 'Para alugar', filters: { status: 'rent' } },
  { id: 'comercial', label: 'Negócios', filters: { types: ['commercial', 'office'] } },
]

export const PRICE_BOUNDS = { min: 1_000, max: 6_000_000 }
export const AREA_BOUNDS = { min: 0, max: 500 }

export function countActiveFilters(f: ListingFilters): number {
  return (
    (f.keyword.trim() ? 1 : 0) +
    (f.status ? 1 : 0) +
    f.types.length +
    (f.minPrice !== null || f.maxPrice !== null ? 1 : 0) +
    (f.minArea !== null || f.maxArea !== null ? 1 : 0) +
    (f.bedrooms ? 1 : 0) +
    (f.bathrooms ? 1 : 0) +
    (f.parking ? 1 : 0) +
    f.features.length
  )
}

export interface FilterChip {
  key: string
  label: string
  remove: (f: ListingFilters) => ListingFilters
}

const brl = (n: number) =>
  n >= 1_000_000 ? `R$ ${(n / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi` : `R$ ${n.toLocaleString('pt-BR')}`

export function activeChips(f: ListingFilters): FilterChip[] {
  const chips: FilterChip[] = []
  if (f.keyword.trim()) chips.push({ key: 'q', label: `“${f.keyword.trim()}”`, remove: (x) => ({ ...x, keyword: '' }) })
  if (f.status) {
    chips.push({ key: 'status', label: f.status === 'sale' ? 'Venda' : 'Aluguel', remove: (x) => ({ ...x, status: '' }) })
  }
  f.types.forEach((t) =>
    chips.push({ key: `t-${t}`, label: PROPERTY_TYPE_LABELS[t], remove: (x) => ({ ...x, types: x.types.filter((y) => y !== t) }) })
  )
  if (f.minPrice !== null || f.maxPrice !== null) {
    const label =
      f.minPrice !== null && f.maxPrice !== null
        ? `${brl(f.minPrice)} – ${brl(f.maxPrice)}`
        : f.minPrice !== null
          ? `a partir de ${brl(f.minPrice)}`
          : `até ${brl(f.maxPrice as number)}`
    chips.push({ key: 'price', label, remove: (x) => ({ ...x, minPrice: null, maxPrice: null }) })
  }
  if (f.minArea !== null || f.maxArea !== null) {
    const label =
      f.minArea !== null && f.maxArea !== null
        ? `${f.minArea}–${f.maxArea} m²`
        : f.minArea !== null
          ? `a partir de ${f.minArea} m²`
          : `até ${f.maxArea} m²`
    chips.push({ key: 'area', label, remove: (x) => ({ ...x, minArea: null, maxArea: null }) })
  }
  if (f.bedrooms) chips.push({ key: 'beds', label: `${f.bedrooms}+ quartos`, remove: (x) => ({ ...x, bedrooms: 0 }) })
  if (f.bathrooms) chips.push({ key: 'baths', label: `${f.bathrooms}+ banheiros`, remove: (x) => ({ ...x, bathrooms: 0 }) })
  if (f.parking) chips.push({ key: 'park', label: `${f.parking}+ vagas`, remove: (x) => ({ ...x, parking: 0 }) })
  f.features.forEach((ft) =>
    chips.push({
      key: `f-${ft}`,
      label: PROPERTY_FEATURE_LABELS[ft],
      remove: (x) => ({ ...x, features: x.features.filter((y) => y !== ft) }),
    })
  )
  return chips
}

// ---------- Estado na URL (para compartilhar a busca) ----------

const num = (v: string | null): number | null => {
  if (v === null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function paramsToFilters(params: URLSearchParams | Record<string, string | undefined>): ListingFilters {
  const get = (k: string) => (params instanceof URLSearchParams ? params.get(k) : (params[k] ?? null))
  const status = get('status')
  const types = (get('type') ?? '')
    .split(',')
    .filter((t): t is PropertyType => t in PROPERTY_TYPE_LABELS)
  const features = (get('feat') ?? '')
    .split(',')
    .filter((t): t is PropertyFeature => t in PROPERTY_FEATURE_LABELS)
  return {
    keyword: get('q') ?? '',
    status: status === 'sale' || status === 'rent' ? status : '',
    types,
    minPrice: num(get('min')),
    maxPrice: num(get('max')),
    minArea: num(get('amin')),
    maxArea: num(get('amax')),
    bedrooms: num(get('beds')) ?? 0,
    bathrooms: num(get('baths')) ?? 0,
    parking: num(get('park')) ?? 0,
    features,
  }
}

export function paramsToSort(params: URLSearchParams | Record<string, string | undefined>): SortOption {
  const v = params instanceof URLSearchParams ? params.get('sort') : params.sort
  return v === 'price-asc' || v === 'price-desc' || v === 'area-desc' || v === 'sqm-asc' ? v : 'recent'
}

export function filtersToParams(f: ListingFilters, sort: SortOption): URLSearchParams {
  const p = new URLSearchParams()
  if (f.keyword.trim()) p.set('q', f.keyword.trim())
  if (f.status) p.set('status', f.status)
  if (f.types.length) p.set('type', f.types.join(','))
  if (f.minPrice !== null) p.set('min', String(f.minPrice))
  if (f.maxPrice !== null) p.set('max', String(f.maxPrice))
  if (f.minArea !== null) p.set('amin', String(f.minArea))
  if (f.maxArea !== null) p.set('amax', String(f.maxArea))
  if (f.bedrooms) p.set('beds', String(f.bedrooms))
  if (f.bathrooms) p.set('baths', String(f.bathrooms))
  if (f.parking) p.set('park', String(f.parking))
  if (f.features.length) p.set('feat', f.features.join(','))
  if (sort !== 'recent') p.set('sort', sort)
  return p
}
