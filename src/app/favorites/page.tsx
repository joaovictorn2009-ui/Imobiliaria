import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { FavoritesView } from '@/components/FavoritesView'

export const metadata: Metadata = { title: 'Favoritos - Imobiliária Prime', robots: { index: false } }

export default function FavoritesPage() {
  return (
    <PageShell title="Meus favoritos" subtitle="Os imóveis que você salvou ficam guardados neste aparelho.">
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <FavoritesView />
        </div>
      </section>
    </PageShell>
  )
}
