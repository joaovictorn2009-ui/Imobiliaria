'use client'

import { useMemo, useState } from 'react'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyFilter } from '@/components/PropertyFilter'
import { Button } from '@/components/ui/button'
import { mockProperties } from '@/data/mockProperties'
import {
  emptyFilters,
  filterProperties,
  sortProperties,
  type ListingFilters,
  type SortOption,
} from '@/lib/properties'

interface PropertyExplorerProps {
  initialFilters?: Partial<ListingFilters>
  pageSize?: number
}

export function PropertyExplorer({ initialFilters, pageSize = 6 }: PropertyExplorerProps) {
  const [filters, setFilters] = useState<ListingFilters>({ ...emptyFilters, ...initialFilters })
  const [sort, setSort] = useState<SortOption>('recent')
  const [visible, setVisible] = useState(pageSize)

  const results = useMemo(
    () => sortProperties(filterProperties(mockProperties, filters), sort),
    [filters, sort]
  )
  const shown = results.slice(0, visible)

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="flex-shrink-0 lg:w-72">
        <PropertyFilter
          value={filters}
          onChange={(f) => {
            setFilters(f)
            setVisible(pageSize)
          }}
        />
      </aside>

      <div className="flex-1">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 lg:text-3xl">Imóveis disponíveis</h2>
            <p className="mt-1 text-gray-600" aria-live="polite">
              {results.length} imóve{results.length === 1 ? 'l encontrado' : 'is encontrados'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Ordenar:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recent">Mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="area-desc">Maior área</option>
            </select>
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-600">
            Nenhum imóvel encontrado com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {visible < results.length && (
          <div className="mt-12 flex justify-center">
            <Button size="lg" onClick={() => setVisible((v) => v + pageSize)}>
              Carregar mais imóveis
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
