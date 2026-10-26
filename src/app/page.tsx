import Link from 'next/link'
import { ArrowDown, ArrowRight, ShieldCheck, Users, Key } from 'lucide-react'
import { PropertyExplorer } from '@/components/PropertyExplorer'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { CountUp } from '@/components/CountUp'
import { ScrollProgress } from '@/components/ScrollProgress'
import { House3DLazy } from '@/components/3d'

const stats = [
  { end: 15, suffix: '+', label: 'Anos de mercado' },
  { end: 3000, suffix: '+', label: 'Famílias atendidas' },
  { end: 500, suffix: '+', label: 'Imóveis no portfólio' },
  { end: 98, suffix: '%', label: 'Clientes satisfeitos' },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Segurança Total',
    desc: 'Todos os imóveis passam por rigorosa verificação documental e jurídica antes de serem anunciados.',
  },
  {
    icon: Users,
    title: 'Equipe Especializada',
    desc: 'Corretores credenciados e experientes para te acompanhar em todas as etapas da negociação.',
  },
  {
    icon: Key,
    title: 'Variedade de Imóveis',
    desc: 'Portfólio diversificado com opções para todos os perfis e orçamentos, do econômico ao alto padrão.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-primary-950 text-white">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-900 via-primary-950 to-black" />
          <div className="animate-float absolute -left-24 top-10 -z-10 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl" />
          <div className="animate-float-slow absolute -right-20 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-600/25 blur-3xl" />
          <div
            className="absolute inset-0 -z-10 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          <div className="container relative mx-auto px-4 pb-28 pt-24 lg:pb-40 lg:pt-36">
            <div className="max-w-3xl">
              <p
                className="hero-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm tracking-wide text-primary-100 backdrop-blur"
                style={{ '--hero-delay': '100ms' } as React.CSSProperties}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Imobiliária Prime · desde 2009
              </p>
              <h1
                className="hero-in text-balance font-display text-5xl font-bold leading-[1.05] lg:text-7xl"
                style={{ '--hero-delay': '250ms' } as React.CSSProperties}
              >
                Encontre o imóvel <span className="shine italic">perfeito</span> para você
              </h1>
              <p
                className="hero-in mt-8 max-w-2xl text-lg leading-relaxed text-primary-100/90 lg:text-xl"
                style={{ '--hero-delay': '450ms' } as React.CSSProperties}
              >
                A maior seleção de imóveis para venda e aluguel. Apartamentos, casas, terrenos e comerciais nas
                melhores localizações.
              </p>
              <div
                className="hero-in mt-10 flex flex-col gap-4 sm:flex-row"
                style={{ '--hero-delay': '650ms' } as React.CSSProperties}
              >
                <a
                  href="#properties"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary-800 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-400/30"
                >
                  Ver imóveis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 text-lg font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Fale conosco
                </Link>
              </div>
            </div>
          </div>

          <a
            href="#stats"
            aria-label="Rolar para baixo"
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-primary-200/70 transition-colors hover:text-white md:flex"
          >
            <span className="text-xs uppercase tracking-[0.25em]">Role</span>
            <ArrowDown className="scroll-dot h-5 w-5" aria-hidden="true" />
          </a>
        </section>

        <section id="stats" className="relative z-10 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4">
            <dl className="grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 120} className="flex flex-col-reverse text-center">
                  <dt className="mt-1 text-sm text-gray-500">{s.label}</dt>
                  <dd className="font-display text-4xl font-bold text-primary-700 lg:text-5xl">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        <section id="properties" className="scroll-mt-16 bg-white py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Reveal className="mb-12 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Portfólio</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 lg:text-5xl">
                Seleção exclusiva para você
              </h2>
            </Reveal>
            <PropertyExplorer pageSize={6} />
          </div>
        </section>

        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Reveal className="mx-auto mb-16 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 lg:text-5xl">
                Por que escolher a Imobiliária Prime?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Mais de 15 anos de experiência no mercado imobiliário, ajudando milhares de famílias a realizarem o
                sonho da casa própria.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((item, index) => (
                <Reveal key={item.title} delay={index * 150}>
                  <div className="group h-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white">
                      <item.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-primary-900 py-20 text-white lg:py-28">
          <div className="animate-float absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-accent-500/25 blur-3xl" />
          <div className="animate-float-slow absolute -bottom-24 -left-16 -z-10 h-80 w-80 rounded-full bg-primary-400/25 blur-3xl" />
          <Reveal direction="scale" className="container mx-auto px-4 text-center">
            <h2 className="mb-6 font-display text-3xl font-bold lg:text-5xl">Pronto para encontrar seu novo lar?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-100 lg:text-xl">
              Nossa equipe está pronta para te ajudar a encontrar o imóvel ideal. Agende uma visita sem compromisso.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-semibold text-primary-800 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Agendar visita
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Reveal>
        </section>

        {/* Seção de Exploração 3D */}
        <section id="3d-explorer" className="relative bg-gray-950 py-16 lg:py-24">
          <div className="animate-float absolute -left-24 top-10 -z-10 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="animate-float-slow absolute -right-20 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-600/15 blur-3xl" />
          <Reveal className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-3">Visualização Imersiva</p>
              <h2 className="font-display text-3xl font-bold text-white lg:text-5xl mb-4">
                Explore seu futuro lar em <span className="italic text-primary-400">3D</span>
              </h2>
              <p className="text-lg text-primary-100/80">
                Gire a casa, veja a planta de cada pavimento e separe os andares para entender cada cômodo.
              </p>
            </div>
            <div className="mx-auto max-w-5xl">
              <House3DLazy />
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}
