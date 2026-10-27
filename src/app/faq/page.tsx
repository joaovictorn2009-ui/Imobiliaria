import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = {
  title: 'Perguntas frequentes - Imobiliária Prime',
  description: 'Respostas rápidas sobre visitas, documentação, financiamento e aluguel.',
  alternates: { canonical: '/faq' },
}

const FAQ = [
  {
    q: 'Como agendo uma visita?',
    a: 'Abra o imóvel e clique em "Agendar visita", chame no WhatsApp ou ligue para nós. Um corretor confirma o melhor horário com você.',
  },
  {
    q: 'Quais documentos preciso para comprar?',
    a: 'Em geral, documentos pessoais, comprovante de renda e de residência. Do imóvel, conferimos matrícula atualizada e certidões. Veja o guia completo em nosso blog.',
  },
  {
    q: 'Posso financiar o imóvel?',
    a: 'Na maioria dos casos sim. As condições (entrada, prazo e taxas) variam entre bancos e mudam com o tempo, então faça simulações e compare o CET. Nosso time ajuda nessa etapa.',
  },
  {
    q: 'Como funciona o aluguel?',
    a: 'Você escolhe o imóvel, apresenta os documentos para análise e define a garantia do contrato (como fiador, seguro-fiança ou caução). Os valores de condomínio e IPTU aparecem em cada anúncio, quando informados.',
  },
  {
    q: 'O 3D mostra a planta exata do imóvel?',
    a: 'Não. O modelo 3D do site é ilustrativo e mostra como a visualização funciona. A planta oficial do imóvel pode ser solicitada ao corretor.',
  },
  {
    q: 'Como salvo e comparo imóveis?',
    a: 'Use o coração para salvar e a balança para comparar até 3 imóveis lado a lado. Os favoritos ficam guardados no seu aparelho.',
  },
]

export default function FaqPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <PageShell title="Perguntas frequentes" subtitle="Respostas rápidas para as dúvidas mais comuns.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="container mx-auto max-w-3xl px-4 py-14">
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white p-5 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                {f.q}
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-center text-gray-600">
          Não encontrou o que procurava?{' '}
          <Link href="/contact" className="font-semibold text-primary-700 hover:underline">
            Fale com a gente
          </Link>
          .
        </p>
      </section>
    </PageShell>
  )
}
