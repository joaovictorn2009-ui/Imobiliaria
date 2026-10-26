import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { PropertyExplorer } from '@/components/PropertyExplorer'
import { PROPERTY_TYPE_LABELS, type PropertyType } from '@/types'
import { mockProperties } from '@/data/mockProperties'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { listingSchema } from '@/lib/schemas'

export const metadata: Metadata = { title: 'Imóveis - Imobiliária Prime' }

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
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Voltar ao início
            </Link>
          </div>
          <PropertyExplorer
            key={`${types.join()}|${keyword}`}
            initialFilters={{ types, keyword }}
            pageSize={9}
            showViewToggle
          />
        </div>
      </section>
    </PageShell>
  )
}