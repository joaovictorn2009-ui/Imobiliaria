import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { PropertyExplorer } from '@/components/PropertyExplorer'
import { PROPERTY_TYPE_LABELS, type PropertyType } from '@/types'
import { mockProperties } from '@/data/mockProperties'

export const metadata: Metadata = { title: 'Imóveis - Imobiliária Prime' }

function listingSchema(properties: typeof mockProperties) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: p.title,
        url: `${BASE_URL}/properties/${p.id}`,
        image: p.mainImage,
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'BRL',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: p.address.city,
          addressRegion: p.address.state,
          addressCountry: 'BR',
        },
      },
    })),
  }
}

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: { type?: string; q?: string }
}) {
  const type = searchParams.type as PropertyType | undefined
  const types = type && type in PROPERTY_TYPE_LABELS ? [type] : []
  const keyword = searchParams.q ?? ''
  const schema = listingSchema(mockProperties)

  return (
    <PageShell title="Imóveis" subtitle="Encontre o imóvel ideal para venda ou aluguel.">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <PropertyExplorer
            key={`${types.join()}|${keyword}`}
            initialFilters={{ types, keyword }}
            pageSize={9}
          />
        </div>
      </section>
    </PageShell>
  )
}
