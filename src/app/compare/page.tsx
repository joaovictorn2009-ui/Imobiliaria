import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { CompareView } from '@/components/CompareView'

export const metadata: Metadata = { title: 'Comparar imóveis - Imobiliária Prime', robots: { index: false } }

export default function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
  const ids = (searchParams.ids ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)

  return (
    <PageShell title="Comparar imóveis" subtitle="Veja lado a lado preço, área, custos e comodidades.">
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <CompareView idsFromUrl={ids} />
        </div>
      </section>
    </PageShell>
  )
}
