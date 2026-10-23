export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial' | 'office'

export type PropertyStatus = 'sale' | 'rent'

export type PropertyFeature = 
  | 'pool'
  | 'gym'
  | 'security'
  | 'parking'
  | 'garden'
  | 'balcony'
  | 'air_conditioning'
  | 'heating'
  | 'furnished'
  | 'elevator'
  | 'concierge'
  | 'playground'
  | 'sports_court'
  | 'sauna'
  | 'spa'
  | 'laundry'
  | 'storage'

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType
  status: PropertyStatus
  price: number
  condoFee?: number
  iptu?: number
  area: number // m²
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    latitude?: number
    longitude?: number
  }
  features: PropertyFeature[]
  images: string[]
  mainImage: string
  createdAt: Date
  updatedAt: Date
  featured: boolean
  agent?: {
    name: string
    phone: string
    email: string
    avatar?: string
    creci: string
  }
}

export interface SearchFilters {
  type?: PropertyType[]
  status?: PropertyStatus
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  city?: string
  neighborhood?: string
  features?: PropertyFeature[]
  keyword?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  land: 'Terreno',
  commercial: 'Comercial',
  office: 'Escritório',
}

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  sale: 'Venda',
  rent: 'Aluguel',
}

export const PROPERTY_FEATURE_LABELS: Record<PropertyFeature, string> = {
  pool: 'Piscina',
  gym: 'Academia',
  security: 'Segurança 24h',
  parking: 'Vaga de garagem',
  garden: 'Jardim',
  balcony: 'Varanda',
  air_conditioning: 'Ar condicionado',
  heating: 'Aquecimento',
  furnished: 'Mobiliado',
  elevator: 'Elevador',
  concierge: 'Portaria',
  playground: 'Playground',
  sports_court: 'Quadra esportiva',
  sauna: 'Sauna',
  spa: 'SPA',
  laundry: 'Lavanderia',
  storage: 'Depósito',
}
