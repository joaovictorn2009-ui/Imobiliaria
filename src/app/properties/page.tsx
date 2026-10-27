import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { PropertyExplorer } from '@/components/PropertyExplorer'
import { AlertForm } from '@/components/AlertForm'
import { mockProperties } from '@/data/mockProperties'
import { paramsToFilters, paramsToSort } from '@/lib/properties'
import { listingSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  title: 'Imóveis - Imobiliária Prime',
  description: 'Filtre por preço, área, quartos e comodidades. Veja em grade, lista ou no mapa.',
  alternates: { canonical: '/properties' },
}

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const filters = paramsToFilters(searchParams)
  const sort = paramsToSort(searchParams)
  const schema = listingSchema(mockProperties)

  return (
    <PageShell title="Imóveis" subtitle="Encontre o imóvel ideal para venda ou aluguel.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-primary-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar ao início
            </Link>
          </div>
          <PropertyExplorer
            key={JSON.stringify(searchParams)}
            initialFilters={filters}
            initialSort={sort}
            pageSize={9}
            showViewToggle
            syncUrl
          />
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <AlertForm />
        </div>
      </section>
    </PageShell>
  )
}
