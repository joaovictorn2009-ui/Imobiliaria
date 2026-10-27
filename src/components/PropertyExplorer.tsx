'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, Map as MapIcon, Share2, SlidersHorizontal, X } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { Reveal } from '@/components/Reveal'
import { PropertyFilter } from '@/components/PropertyFilter'
import { usePrefs } from '@/components/PrefsProvider'
import { Button } from '@/components/ui/button'
import { mockProperties } from '@/data/mockProperties'
import {
  activeChips,
  countActiveFilters,
  emptyFilters,
  filterProperties,
  filtersToParams,
  sortProperties,
  type ListingFilters,
  type SortOption,
} from '@/lib/properties'
import { cn } from '@/lib/utils'

// O Leaflet só é baixado quando a pessoa abre a visualização em mapa.
const ListingsMap = dynamic(() => import('@/components/maps/ListingsMap'), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-2xl bg-gray-100" aria-hidden="true" />,
})

type ViewMode = 'grid' | 'list' | 'map'

interface PropertyExplorerProps {
  initialFilters?: Partial<ListingFilters>
  initialSort?: SortOption
  pageSize?: number
  showViewToggle?: boolean
  /** grava filtros e ordenação na URL, para a busca poder ser compartilhada */
  syncUrl?: boolean
}

const VIEWS: { id: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'grid', label: 'Grade', icon: LayoutGrid },
  { id: 'list', label: 'Lista', icon: List },
  { id: 'map', label: 'Mapa', icon: MapIcon },
]

export function PropertyExplorer({
  initialFilters,
  initialSort = 'recent',
  pageSize = 6,
  showViewToggle = true,
  syncUrl = false,
}: PropertyExplorerProps) {
  const { notify } = usePrefs()
  const [filters, setFilters] = useState<ListingFilters>({ ...emptyFilters, ...initialFilters })
  const [sort, setSort] = useState<SortOption>(initialSort)
  const [visible, setVisible] = useState(pageSize)
  const [view, setView] = useState<ViewMode>('grid')
  const [drawer, setDrawer] = useState(false)

  const results = useMemo(() => sortProperties(filterProperties(mockProperties, filters), sort), [filters, sort])
  const shown = results.slice(0, visible)
  const chips = useMemo(() => activeChips(filters), [filters])
  const activeCount = countActiveFilters(filters)

  useEffect(() => {
    if (!syncUrl) return
    const qs = filtersToParams(filters, sort).toString()
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
  }, [filters, sort, syncUrl])

  // trava a rolagem da página enquanto o painel de filtros está aberto no celular
  useEffect(() => {
    if (!drawer) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [drawer])

  const changeFilters = (f: ListingFilters) => {
    setFilters(f)
    setVisible(pageSize)
  }

  const shareSearch = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Imóveis - Imobiliária Prime', url })
        return
      }
      await navigator.clipboard.writeText(url)
      notify('Link da busca copiado')
    } catch {
      /* compartilhamento cancelado */
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="hidden flex-shrink-0 lg:block lg:w-80">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl">
          <PropertyFilter value={filters} onChange={changeFilters} />
        </div>
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-[95] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawer(false)}
            aria-label="Fechar filtros"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-gray-50 p-4 pb-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-gray-900">Filtros</h2>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Fechar"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <PropertyFilter
              value={filters}
              onChange={changeFilters}
              resultCount={results.length}
              onClose={() => setDrawer(false)}
            />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 lg:text-3xl">Imóveis disponíveis</h2>
            <p className="mt-1 text-gray-600" aria-live="polite">
              {results.length} imóve{results.length === 1 ? 'l encontrado' : 'is encontrados'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" className="lg:hidden" onClick={() => setDrawer(true)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
              Filtros{activeCount > 0 ? ` (${activeCount})` : ''}
            </Button>

            <label htmlFor="sort" className="sr-only">
              Ordenar por
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recent">Mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="area-desc">Maior área</option>
              <option value="sqm-asc">Menor preço por m²</option>
            </select>

            {showViewToggle && (
              <div className="flex rounded-xl bg-gray-100 p-1" role="group" aria-label="Modo de visualização">
                {VIEWS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    aria-pressed={view === id}
                    aria-label={`Visualização em ${label.toLowerCase()}`}
                    className={cn(
                      'rounded-lg p-2 transition-all duration-200',
                      view === id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            {syncUrl && (
              <button
                type="button"
                onClick={shareSearch}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Compartilhar busca</span>
              </button>
            )}
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Filtros ativos">
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => changeFilters(c.remove(filters))}
                className="group inline-flex items-center gap-1.5 rounded-full bg-primary-50 py-1 pl-3 pr-2 text-xs font-medium text-primary-800 hover:bg-primary-100"
                aria-label={`Remover filtro ${c.label}`}
              >
                {c.label}
                <X className="h-3 w-3 opacity-60 group-hover:opacity-100" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => changeFilters(emptyFilters)}
              className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline"
            >
              Limpar tudo
            </button>
          </div>
        )}

        {results.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-600">
            <p className="mb-2 text-lg font-medium text-gray-900">Nenhum imóvel encontrado</p>
            <p className="text-gray-500">Tente ajustar os filtros para ver mais resultados.</p>
            <Button variant="outline" className="mt-4" onClick={() => changeFilters(emptyFilters)}>
              Limpar filtros
            </Button>
          </div>
        ) : view === 'map' ? (
          <ListingsMap properties={results} />
        ) : (
          <>
            <div
              className={cn(
                'grid gap-6',
                view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
              )}
            >
              {shown.map((property, i) => (
                <Reveal key={property.id} delay={(i % 3) * 100}>
                  <PropertyCard property={property} variant={property.featured ? 'featured' : 'elevated'} />
                </Reveal>
              ))}
            </div>

            {visible < results.length && (
              <div className="mt-12 flex justify-center">
                <Button size="lg" onClick={() => setVisible((v) => v + pageSize)} className="min-w-[220px]">
                  Carregar mais imóveis
                  <span className="ml-2" aria-hidden="true">
                    ({Math.min(visible + pageSize, results.length)} de {results.length})
                  </span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
