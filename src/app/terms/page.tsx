import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = { title: 'Termos de uso - Imobiliária Prime' }

export default function TermsPage() {
  return (
    <PageShell title="Termos de uso">
      <section className="container mx-auto max-w-3xl px-4 py-16 text-gray-700 leading-relaxed">
        <p>Conteúdo provisório. Substitua pelo documento oficial revisado pelo jurídico da Imobiliária Prime.</p>
      </section>
    </PageShell>
  )
}
