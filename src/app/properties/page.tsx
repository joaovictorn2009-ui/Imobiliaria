import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { PropertyExplorer } from '@/components/PropertyExplorer'
import { PROPERTY_TYPE_LABELS, type PropertyType } from '@/types'

export const metadata: Metadata = { title: 'Imóveis - Imobiliária Prime' }

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: { type?: string; q?: string }
}) {
  const type = searchParams.type as PropertyType | undefined
  const types = type && type in PROPERTY_TYPE_LABELS ? [type] : []
  const keyword = searchParams.q ?? ''

  return (
    <PageShell title="Imóveis" subtitle="Encontre o imóvel ideal para venda ou aluguel.">
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
