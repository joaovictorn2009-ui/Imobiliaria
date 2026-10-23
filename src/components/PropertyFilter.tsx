'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PROPERTY_TYPE_LABELS, type PropertyType } from '@/types'
import { emptyFilters, type ListingFilters } from '@/lib/properties'

interface PropertyFilterProps {
  value: ListingFilters
  onChange: (value: ListingFilters) => void
}

function parseMoney(raw: string): number | null {
  const n = Number(raw.replace(/\D/g, ''))
  return raw.trim() === '' || Number.isNaN(n) ? null : n
}

export function PropertyFilter({ value, onChange }: PropertyFilterProps) {
  const set = (patch: Partial<ListingFilters>) => onChange({ ...value, ...patch })

  const toggleType = (type: PropertyType) =>
    set({
      types: value.types.includes(type)
        ? value.types.filter((t) => t !== type)
        : [...value.types, type],
    })

  return (
    <form
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-5"
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

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-900">Finalidade</legend>
        <div className="flex gap-2">
          {([['', 'Todos'], ['sale', 'Venda'], ['rent', 'Aluguel']] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => set({ status: v })}
              aria-pressed={value.status === v}
              className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                value.status === v
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-900">Tipo de imóvel</legend>
        <div className="space-y-2">
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

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-900">Preço (R$)</legend>
        <div className="grid grid-cols-2 gap-2">
          <Input
            inputMode="numeric"
            placeholder="Mínimo"
            aria-label="Preço mínimo"
            value={value.minPrice ?? ''}
            onChange={(e) => set({ minPrice: parseMoney(e.target.value) })}
          />
          <Input
            inputMode="numeric"
            placeholder="Máximo"
            aria-label="Preço máximo"
            value={value.maxPrice ?? ''}
            onChange={(e) => set({ maxPrice: parseMoney(e.target.value) })}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-900">Quartos (mín.)</legend>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set({ bedrooms: n })}
              aria-pressed={value.bedrooms === n}
              className={`h-9 flex-1 rounded-lg border text-sm font-medium transition-colors ${
                value.bedrooms === n
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {n === 0 ? 'Todos' : `${n}+`}
            </button>
          ))}
        </div>
      </fieldset>

      <Button type="button" variant="outline" className="w-full" onClick={() => onChange(emptyFilters)}>
        Limpar filtros
      </Button>
    </form>
  )
}
