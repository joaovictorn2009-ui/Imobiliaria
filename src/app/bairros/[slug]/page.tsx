import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bus, Coffee } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { PropertyCard } from '@/components/PropertyCard'
import { NeighborhoodMap } from '@/components/maps/NeighborhoodMap'
import { getNeighborhood, getNeighborhoods } from '@/data/neighborhoods'
import { formatCurrency } from '@/lib/utils'

export function generateStaticParams() {
  return getNeighborhoods().map((n) => ({ slug: n.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const n = getNeighborhood(params.slug)
  if (!n) return { title: 'Bairro não encontrado' }
  return {
    title: `Imóveis em ${n.name}, ${n.city} - Imobiliária Prime`,
    description: `${n.intro} Veja os imóveis disponíveis em ${n.name}.`,
    alternates: { canonical: `/bairros/${n.slug}` },
  }
}

export default function BairroPage({ params }: { params: { slug: string } }) {
  const n = getNeighborhood(params.slug)
  if (!n) notFound()

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: `${n.name}, ${n.city}`,
        description: n.intro,
        geo: { '@type': 'GeoCoordinates', latitude: n.lat, longitude: n.lng },
        address: { '@type': 'PostalAddress', addressLocality: n.city, addressRegion: n.state, addressCountry: 'BR' },
      },
      {
        '@type': 'ItemList',
        itemListElement: n.properties.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${base}/properties/${p.id}`,
          name: p.title,
        })),
      },
    ],
  }

  return (
    <PageShell title={n.name} subtitle={`${n.city} - ${n.state}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto px-4 py-12">
        <Link href="/bairros" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Todos os bairros
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <p className="text-lg leading-relaxed text-gray-700">{n.intro}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Coffee className="h-4 w-4 text-gold-700" aria-hidden="true" />
                  Estilo de vida
                </p>
                <p className="text-sm leading-relaxed text-gray-600">{n.lifestyle}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Bus className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  Como chegar
                </p>
                <p className="text-sm leading-relaxed text-gray-600">{n.mobility}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Descrição de caráter geral, para orientação. Confirme detalhes da região com um corretor.
            </p>

            <NeighborhoodMap properties={n.properties} />
          </div>

          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-display text-xl font-bold text-gray-900">Em números</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Imóveis disponíveis</dt>
                <dd className="font-semibold text-gray-900">{n.properties.length}</dd>
              </div>
              {n.avgSqmSale && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Preço médio do m² (venda)</dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(n.avgSqmSale)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Menor valor</dt>
                <dd className="font-semibold text-gray-900">{formatCurrency(n.minPrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Maior valor</dt>
                <dd className="font-semibold text-gray-900">{formatCurrency(n.maxPrice)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {n.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                  {t}
                </span>
              ))}
            </div>
            <Link
              href={`/properties?q=${encodeURIComponent(n.name)}`}
              className="mt-6 inline-flex w-full justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Buscar em {n.name}
            </Link>
          </aside>
        </div>

        <h2 className="mb-6 mt-14 font-display text-2xl font-bold text-gray-900">Imóveis em {n.name}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {n.properties.map((p) => (
            <PropertyCard key={p.id} property={p} variant="elevated" />
          ))}
        </div>
      </div>
    </PageShell>
  )
}
