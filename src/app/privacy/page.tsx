import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = { title: 'Política de privacidade - Imobiliária Prime' }

export default function PrivacyPage() {
  return (
    <PageShell title="Política de privacidade">
      <section className="container mx-auto max-w-3xl px-4 py-16 text-gray-700 leading-relaxed">
        <p>Conteúdo provisório. Substitua pelo documento oficial revisado pelo jurídico da Imobiliária Prime.</p>
      </section>
    </PageShell>
  )
}
