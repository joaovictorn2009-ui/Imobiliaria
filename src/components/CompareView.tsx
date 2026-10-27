'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Minus, Scale, X } from 'lucide-react'
import { usePrefs } from '@/components/PrefsProvider'
import { mockProperties } from '@/data/mockProperties'
import { formatCurrency } from '@/lib/utils'
import {
  PROPERTY_FEATURE_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
  type PropertyFeature,
} from '@/types'

type Row = {
  label: string
  value: (p: Property) => number
  /** 'min' destaca o menor valor, 'max' o maior */
  best: 'min' | 'max'
  money?: boolean
}

const ROWS: Row[] = [
  { label: 'Preço', value: (p) => p.price, best: 'min', money: true },
  { label: 'Preço por m²', value: (p) => Math.round(p.price / p.area), best: 'min', money: true },
  { label: 'Área (m²)', value: (p) => p.area, best: 'max' },
  { label: 'Quartos', value: (p) => p.bedrooms, best: 'max' },
  { label: 'Banheiros', value: (p) => p.bathrooms, best: 'max' },
  { label: 'Vagas', value: (p) => p.parkingSpaces, best: 'max' },
  { label: 'Condomínio', value: (p) => p.condoFee ?? 0, best: 'min', money: true },
  { label: 'IPTU', value: (p) => p.iptu ?? 0, best: 'min', money: true },
]

export function CompareView({ idsFromUrl }: { idsFromUrl: string[] }) {
  const { compare, ready, toggleCompare } = usePrefs()
  const ids = idsFromUrl.length ? idsFromUrl : compare
  const items = ids
    .map((id) => mockProperties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p))

  if (!ready && idsFromUrl.length === 0) return <div className="h-64" aria-hidden="true" />

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Scale className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
        <p className="text-lg font-semibold text-gray-900">Escolha pelo menos 2 imóveis</p>
        <p className="mt-1 text-gray-500">Use o botão de balança nos cartões para adicionar até 3 imóveis.</p>
        <Link
          href="/properties"
          className="mt-6 inline-flex rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Ver imóveis
        </Link>
      </div>
    )
  }

  // venda e aluguel têm preços de natureza diferente: não faz sentido apontar o "melhor" entre eles
  const mixed = new Set(items.map((p) => p.status)).size > 1
  const allFeatures = Array.from(new Set(items.flatMap((p) => p.features))) as PropertyFeature[]

  const bestOf = (row: Row) => {
    if (mixed && row.label.startsWith('Preço')) return -1
    const vals = items.map(row.value)
    if (new Set(vals).size === 1) return -1
    // zero em condomínio/IPTU significa "não informado": não conta como melhor
    const candidates = vals.map((v, i) => ({ v, i })).filter((x) => !(row.best === 'min' && x.v === 0))
    if (!candidates.length) return -1
    const target = row.best === 'min' ? Math.min(...candidates.map((c) => c.v)) : Math.max(...candidates.map((c) => c.v))
    return vals.indexOf(target)
  }

  return (
    <div>
      {mixed && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="note">
          Você está comparando imóveis à venda com imóveis para alugar. Os valores têm naturezas diferentes, por isso não
          destacamos o melhor preço.
        </p>
      )}
      <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Comparação lado a lado dos imóveis escolhidos</caption>
        <thead>
          <tr>
            <th className="w-40 bg-white p-3 text-left align-bottom text-xs font-semibold uppercase tracking-wider text-gray-400">
              Imóvel
            </th>
            {items.map((p) => (
              <th key={p.id} scope="col" className="p-3 align-top font-normal">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white text-left">
                  <div className="relative aspect-[4/3]">
                    <Image src={p.mainImage} alt={p.title} fill sizes="(max-width: 768px) 60vw, 30vw" className="object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500">
                      {PROPERTY_TYPE_LABELS[p.type]} · {PROPERTY_STATUS_LABELS[p.status]}
                    </p>
                    <Link href={`/properties/${p.id}`} className="mt-0.5 block font-semibold text-gray-900 hover:text-primary-600">
                      {p.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {p.address.neighborhood}, {p.address.city}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    aria-label={`Remover ${p.title} da comparação`}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-600 shadow hover:text-rose-600"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const best = bestOf(row)
            return (
              <tr key={row.label} className="even:bg-gray-50/70">
                <th scope="row" className="p-3 text-left font-medium text-gray-600">
                  {row.label}
                </th>
                {items.map((p, i) => {
                  const v = row.value(p)
                  const text = row.money ? (v ? formatCurrency(v) : '—') : String(v)
                  return (
                    <td key={p.id} className={`p-3 font-semibold ${best === i ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {text}
                      {best === i && (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          melhor
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
          {allFeatures.map((f) => (
            <tr key={f} className="even:bg-gray-50/70">
              <th scope="row" className="p-3 text-left font-medium text-gray-600">
                {PROPERTY_FEATURE_LABELS[f]}
              </th>
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  {p.features.includes(f) ? (
                    <Check className="h-5 w-5 text-emerald-600" aria-label="Possui" />
                  ) : (
                    <Minus className="h-5 w-5 text-gray-300" aria-label="Não possui" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
