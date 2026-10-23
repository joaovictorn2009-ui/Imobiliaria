import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = { title: 'Sobre nós - Imobiliária Prime' }

export default function AboutPage() {
  return (
    <PageShell title="Sobre nós" subtitle="Mais de 15 anos ajudando famílias a encontrar o lar ideal.">
      <section className="container mx-auto max-w-3xl px-4 py-16 space-y-6 text-gray-700 leading-relaxed">
        <p>
          A Imobiliária Prime atua na compra, venda e locação de imóveis residenciais e comerciais, com foco em
          transparência, segurança jurídica e atendimento próximo.
        </p>
        <p>
          Nossos corretores são credenciados no CRECI e acompanham você em todas as etapas: da escolha do imóvel
          à assinatura do contrato.
        </p>
        <h2 className="text-2xl font-bold text-gray-900">Nossos valores</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Transparência em cada negociação</li>
          <li>Verificação documental rigorosa</li>
          <li>Atendimento humano e personalizado</li>
        </ul>
      </section>
    </PageShell>
  )
}
