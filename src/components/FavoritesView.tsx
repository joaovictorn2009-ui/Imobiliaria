'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { usePrefs } from '@/components/PrefsProvider'
import { mockProperties } from '@/data/mockProperties'
import type { Property } from '@/types'

export function FavoritesView() {
  const { favorites, ready } = usePrefs()
  const items = favorites
    .map((id) => mockProperties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p))

  if (!ready) return <div className="h-64" aria-hidden="true" />

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
        <p className="text-lg font-semibold text-gray-900">Nenhum favorito ainda</p>
        <p className="mt-1 text-gray-500">Toque no coração de um imóvel para guardá-lo aqui.</p>
        <Link
          href="/properties"
          className="mt-6 inline-flex rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Ver imóveis
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-gray-600" aria-live="polite">
        {items.length} imóve{items.length === 1 ? 'l salvo' : 'is salvos'} neste aparelho
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} variant="elevated" />
        ))}
      </div>
    </>
  )
}
