import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { PriceBars } from '@/components/PriceBars'
import { getNeighborhoods } from '@/data/neighborhoods'
import { formatCurrency } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Bairros - Imobiliária Prime',
  description: 'Conheça os bairros onde atuamos: perfil da região, preço médio do m² e imóveis disponíveis.',
  alternates: { canonical: '/bairros' },
}

export default function BairrosPage() {
  const list = getNeighborhoods()
  return (
    <PageShell title="Guia de bairros" subtitle="Conheça a região antes de escolher o imóvel.">
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((n) => (
              <Link
                key={n.slug}
                href={`/bairros/${n.slug}`}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
              >
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {n.city} - {n.state}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-gray-900">{n.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{n.intro}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {n.tags.map((t) => (
                    <span key={t} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                  <span className="text-gray-500">
                    {n.properties.length} imóve{n.properties.length === 1 ? 'l' : 'is'}
                    {n.avgSqmSale ? ` · ${formatCurrency(n.avgSqmSale)}/m²` : ''}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">Preço médio do m² por bairro</h2>
          <PriceBars />
        </div>
      </section>
    </PageShell>
  )
}
