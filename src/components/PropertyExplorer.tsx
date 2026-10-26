'use client'

import { useMemo, useState } from 'react'
import { PropertyCard } from '@/components/PropertyCard'
import { Reveal } from '@/components/Reveal'
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
import { cn } from '@/lib/utils'

interface PropertyExplorerProps {
  initialFilters?: Partial<ListingFilters>
  pageSize?: number
  showViewToggle?: boolean
}

export function PropertyExplorer({ initialFilters, pageSize = 6, showViewToggle = true }: PropertyExplorerProps) {
  const [filters, setFilters] = useState<ListingFilters>({ ...emptyFilters, ...initialFilters })
  const [sort, setSort] = useState<SortOption>('recent')
  const [visible, setVisible] = useState(pageSize)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Ordenar:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="recent">Mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="area-desc">Maior área</option>
            </select>

            {showViewToggle && (
              <div className="flex bg-gray-100 rounded-xl p-1" role="group" aria-label="Modo de visualização">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  aria-label="Visualização em grade"
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  aria-label="Visualização em lista"
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-600 bg-gray-50">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel encontrado</p>
            <p className="text-gray-500">Tente ajustar os filtros para ver mais resultados.</p>
            <Button variant="outline" className="mt-4" onClick={() => setFilters(emptyFilters)}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((property, i) => (
                  <Reveal key={property.id} delay={(i % 3) * 100}>
                    <PropertyCard property={property} variant={property.featured ? 'featured' : 'elevated'} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="space-y-4" role="list">
                {shown.map((property, i) => (
                  <Reveal key={property.id} delay={i * 80}>
                    <PropertyCard property={property} variant="elevated" />
                  </Reveal>
                ))}
              </div>
            )}

            {visible < results.length && (
              <div className="mt-12 flex justify-center">
                <Button size="lg" onClick={() => setVisible((v) => v + pageSize)} className="min-w-[220px]">
                  Carregar mais imóveis
                  <span className="ml-2" aria-hidden="true">({visible + pageSize} de {results.length})</span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}