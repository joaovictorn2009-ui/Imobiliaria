import { mockProperties } from '@/data/mockProperties'
import type { Property, PropertyStatus, PropertyType } from '@/types'

export type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'area-desc'

export interface ListingFilters {
  keyword: string
  status: PropertyStatus | ''
  types: PropertyType[]
  minPrice: number | null
  maxPrice: number | null
  bedrooms: number
}

export const emptyFilters: ListingFilters = {
  keyword: '',
  status: '',
  types: [],
  minPrice: null,
  maxPrice: null,
  bedrooms: 0,
}

export function filterProperties(list: Property[], f: ListingFilters): Property[] {
  const kw = f.keyword.trim().toLowerCase()
  return list.filter((p) => {
    if (f.status && p.status !== f.status) return false
    if (f.types.length && !f.types.includes(p.type)) return false
    if (f.minPrice !== null && p.price < f.minPrice) return false
    if (f.maxPrice !== null && p.price > f.maxPrice) return false
    if (f.bedrooms && p.bedrooms < f.bedrooms) return false
    if (kw) {
      const hay = `${p.title} ${p.address.neighborhood} ${p.address.city} ${p.address.street}`.toLowerCase()
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
    default:
      return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find((p) => p.id === id)
}
