import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Eye, FileCheck2, Handshake, HeartHandshake, KeyRound, Search, ShieldCheck, UserRoundSearch } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'
import { CountUp } from '@/components/CountUp'

export const metadata: Metadata = {
  title: 'Sobre nós - Imobiliária Prime',
  description: 'Conheça a Imobiliária Prime: como trabalhamos, nossos valores e o que você pode esperar do atendimento.',
  alternates: { canonical: '/about' },
}

const VALUES = [
  { icon: Eye, title: 'Transparência', text: 'Valores, custos e condições claros desde a primeira conversa, sem letras miúdas.' },
  { icon: ShieldCheck, title: 'Segurança jurídica', text: 'Conferência de documentos e riscos antes de qualquer pagamento.' },
  { icon: HeartHandshake, title: 'Atendimento humano', text: 'Um corretor acompanha você de ponta a ponta, no seu ritmo.' },
]

const STEPS = [
  { icon: UserRoundSearch, title: 'Entendemos seu perfil', text: 'Conversamos sobre orçamento, rotina, região e o que não pode faltar.' },
  { icon: Search, title: 'Selecionamos opções', text: 'Você recebe uma lista enxuta de imóveis, com comparativo de preço e custos.' },
  { icon: KeyRound, title: 'Visitas sem pressa', text: 'Agendamos no melhor horário, presencialmente ou com apoio do tour em 3D.' },
  { icon: FileCheck2, title: 'Conferimos a documentação', text: 'Matrícula, certidões e pendências analisadas antes da proposta.' },
  { icon: Handshake, title: 'Fechamento e pós-venda', text: 'Apoio na negociação, no contrato e na entrega das chaves.' },
]

const STATS = [
  { end: 15, suffix: '+', label: 'Anos de mercado' },
  { end: 3000, suffix: '+', label: 'Famílias atendidas' },
  { end: 500, suffix: '+', label: 'Imóveis no portfólio' },
]

export default function AboutPage() {
  return (
    <PageShell title="Sobre nós" subtitle="Mais de 15 anos ajudando famílias a encontrar o lar ideal.">
      <section className="container mx-auto max-w-3xl px-4 py-16">
        <Reveal>
          <p className="text-lg leading-relaxed text-gray-700">
            A Imobiliária Prime atua na compra, venda e locação de imóveis residenciais e comerciais, com foco em
            transparência, segurança jurídica e atendimento próximo.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Nossos corretores são credenciados no CRECI e acompanham você em todas as etapas: da escolha do imóvel à
            assinatura do contrato.
          </p>
        </Reveal>
      </section>

      <section className="bg-primary-950 py-14 text-white">
        <div className="container mx-auto px-4">
          <dl className="grid gap-8 text-center sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 120} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-primary-200">{s.label}</dt>
                <dd className="font-display text-5xl font-bold text-gold-300">
                  <CountUp end={s.end} suffix={s.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 lg:text-4xl">Nossos valores</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="h-full rounded-3xl border border-gray-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gold-100 text-gold-700">
                    <v.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-gray-600">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <Reveal className="mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 lg:text-4xl">Como trabalhamos</h2>
          </Reveal>
          <ol className="relative space-y-8 border-l-2 border-gold-200 pl-8">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="relative">
                <span className="absolute -left-[3.05rem] grid h-9 w-9 place-items-center rounded-full bg-primary-900 text-sm font-bold text-gold-300 ring-4 ring-gray-50">
                  {i + 1}
                </span>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <s.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  {s.title}
                </h3>
                <p className="mt-1 text-gray-600">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-gray-900">Vamos conversar?</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">Conte o que você procura e nós ajudamos a encontrar.</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Falar com um corretor
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
