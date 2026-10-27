'use client'

import { useState } from 'react'
import { ChevronDown, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DualRange } from '@/components/DualRange'
import { cn } from '@/lib/utils'
import {
  PROPERTY_FEATURE_LABELS,
  PROPERTY_TYPE_LABELS,
  type PropertyFeature,
  type PropertyType,
} from '@/types'
import {
  AREA_BOUNDS,
  FILTER_PRESETS,
  PRICE_BOUNDS,
  countActiveFilters,
  emptyFilters,
  type ListingFilters,
} from '@/lib/properties'

interface PropertyFilterProps {
  value: ListingFilters
  onChange: (value: ListingFilters) => void
  /** quantidade de imóveis que o filtro atual retorna (aparece no botão do celular) */
  resultCount?: number
  onClose?: () => void
}

const brlShort = (n: number) =>
  n >= 1_000_000
    ? `R$ ${(n / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`
    : n >= 1_000
      ? `R$ ${Math.round(n / 1_000).toLocaleString('pt-BR')} mil`
      : `R$ ${n}`

const MORE_FEATURES: PropertyFeature[] = [
  'pool',
  'gym',
  'security',
  'garden',
  'balcony',
  'air_conditioning',
  'furnished',
  'elevator',
  'concierge',
  'playground',
  'sauna',
  'laundry',
]

function Pills({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  options: number[]
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-gray-900">{label}</legend>
      <div className="flex gap-1.5">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={cn(
              'h-9 flex-1 rounded-lg border text-sm font-medium transition-colors',
              value === n
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            )}
          >
            {n === 0 ? 'Todos' : `${n}+`}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function PropertyFilter({ value, onChange, resultCount, onClose }: PropertyFilterProps) {
  const [more, setMore] = useState(value.features.length > 0 || value.bathrooms > 0 || value.parking > 0)
  const set = (patch: Partial<ListingFilters>) => onChange({ ...value, ...patch })
  const active = countActiveFilters(value)

  const toggleType = (type: PropertyType) =>
    set({ types: value.types.includes(type) ? value.types.filter((t) => t !== type) : [...value.types, type] })
  const toggleFeature = (f: PropertyFeature) =>
    set({ features: value.features.includes(f) ? value.features.filter((x) => x !== f) : [...value.features, f] })

  return (
    <form
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Filtros de imóveis"
    >
      <div>
        <label htmlFor="f-keyword" className="mb-2 block text-sm font-semibold text-gray-900">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <Input
            id="f-keyword"
            type="search"
            placeholder="Bairro, cidade ou nome"
            className="pl-9"
            value={value.keyword}
            onChange={(e) => set({ keyword: e.target.value })}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
          <Sparkles className="h-4 w-4 text-gold-600" aria-hidden="true" />
          Atalhos
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ ...emptyFilters, keyword: value.keyword, ...p.filters })}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-900">Finalidade</legend>
        <div className="flex gap-1.5">
          {([['', 'Todos'], ['sale', 'Venda'], ['rent', 'Aluguel']] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => set({ status: v })}
              aria-pressed={value.status === v}
              className={cn(
                'flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors',
                value.status === v
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-900">Tipo de imóvel</legend>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={value.types.includes(type)}
                onChange={() => toggleType(type)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {PROPERTY_TYPE_LABELS[type]}
            </label>
          ))}
        </div>
      </fieldset>

      <DualRange
        label="Preço"
        min={PRICE_BOUNDS.min}
        max={PRICE_BOUNDS.max}
        low={value.minPrice}
        high={value.maxPrice}
        onChange={(minPrice, maxPrice) => set({ minPrice, maxPrice })}
        format={brlShort}
        log
      />

      <DualRange
        label="Área"
        min={AREA_BOUNDS.min}
        max={AREA_BOUNDS.max}
        low={value.minArea}
        high={value.maxArea}
        onChange={(minArea, maxArea) => set({ minArea, maxArea })}
        format={(n) => `${n} m²`}
      />

      <Pills label="Quartos (mín.)" value={value.bedrooms} onChange={(bedrooms) => set({ bedrooms })} options={[0, 1, 2, 3, 4]} />

      <button
        type="button"
        onClick={() => setMore((m) => !m)}
        aria-expanded={more}
        className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
      >
        Mais filtros
        <ChevronDown className={cn('h-4 w-4 transition-transform', more && 'rotate-180')} aria-hidden="true" />
      </button>

      {more && (
        <div className="space-y-6">
          <Pills label="Banheiros (mín.)" value={value.bathrooms} onChange={(bathrooms) => set({ bathrooms })} options={[0, 1, 2, 3]} />
          <Pills label="Vagas (mín.)" value={value.parking} onChange={(parking) => set({ parking })} options={[0, 1, 2, 3]} />
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-gray-900">Comodidades</legend>
            <div className="flex flex-wrap gap-1.5">
              {MORE_FEATURES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  aria-pressed={value.features.includes(f)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    value.features.includes(f)
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {PROPERTY_FEATURE_LABELS[f]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => onChange(emptyFilters)} disabled={active === 0}>
          Limpar{active > 0 ? ` (${active})` : ''}
        </Button>
        {onClose && (
          <Button type="button" className="flex-1" onClick={onClose}>
            Ver {resultCount ?? ''} imóve{resultCount === 1 ? 'l' : 'is'}
          </Button>
        )}
      </div>
    </form>
  )
}
