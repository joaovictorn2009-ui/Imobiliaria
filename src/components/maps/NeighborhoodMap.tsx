'use client'

import dynamic from 'next/dynamic'
import type { Property } from '@/types'

const ListingsMap = dynamic(() => import('@/components/maps/ListingsMap'), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-2xl bg-gray-100" aria-hidden="true" />,
})

/** Mapa do bairro (carrega o Leaflet só no navegador). */
export function NeighborhoodMap({ properties }: { properties: Property[] }) {
  return <ListingsMap properties={properties} />
}
