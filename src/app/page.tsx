import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ShieldCheck, Users, Key, TrendingUp, MapPin, Award } from 'lucide-react'
import { PropertyExplorer } from '@/components/PropertyExplorer'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { CountUp } from '@/components/CountUp'
import { ScrollProgress } from '@/components/ScrollProgress'
import { House3DLazy } from '@/components/3d'
import { BlogTeasers, NeighborhoodsSection } from '@/components/HomeInsights'
import { HomeNewsletter } from '@/components/HomeNewsletter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'

function homeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Imobiliária Prime',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: [
          'https://facebook.com/imobiliariaprime',
          'https://instagram.com/imobiliariaprime',
          'https://linkedin.com/company/imobiliariaprime',
          'https://youtube.com/@imobiliariaprime',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+55-11-3000-0000',
          contactType: 'customer service',
          availableLanguage: 'Portuguese',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. Paulista, 1000',
          addressLocality: 'São Paulo',
          addressRegion: 'SP',
          postalCode: '01310-100',
          addressCountry: 'BR',
        },
      },
      {
        '@type': 'WebSite',
        name: 'Imobiliária Prime',
        url: BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/properties?q={search_term_string}`,
          },
          queryInput: 'required name=search_term_string',
        },
      },
    ],
  }
}

const stats = [
  { end: 15, suffix: '+', label: 'Anos de mercado', icon: Award },
  { end: 3000, suffix: '+', label: 'Famílias atendidas', icon: Users },
  { end: 500, suffix: '+', label: 'Imóveis no portfólio', icon: MapPin },
  { end: 98, suffix: '%', label: 'Clientes satisfeitos', icon: TrendingUp },
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

const trustIndicators = [
  { label: 'CRECI-SP', desc: 'Conselho Regional de Corretores' },
  { label: 'SECOVI', desc: 'Sindicato da Habitação' },
  { label: 'ABMI', desc: 'Associação Brasileira do Mercado Imobiliário' },
  { label: 'ISO 9001', desc: 'Gestão de Qualidade' },
]

export default function HomePage() {
  const schema = homeSchema()

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ScrollProgress />
      <Header />
      <main id="conteudo" className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-primary-950 text-white">
          {/* Foto da cidade como plano de fundo, com camadas escuras para o texto ficar legível */}
          <Image
            src="/images/hero-cidade.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 scale-105 object-cover object-[50%_35%] blur-[1.5px]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/95 via-primary-950/75 to-primary-950/35" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/40" />
          <div className="animate-float absolute -left-24 top-10 -z-10 h-96 w-96 rounded-full bg-primary-500/25 blur-3xl" />
          <div className="animate-float-slow absolute -right-20 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-3xl" />
          <div
            className="absolute inset-0 -z-10 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          <div className="container relative mx-auto px-4 pb-28 pt-24 lg:pb-40 lg:pt-36">
            <div className="max-w-3xl">
              <div
                className="hero-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm tracking-wide text-primary-100 backdrop-blur"
                style={{ '--hero-delay': '100ms' } as React.CSSProperties}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Imobiliária Prime · desde 2009
              </div>
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
                <Link
                  href="#properties"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary-800 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-400/30"
                >
                  Ver imóveis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 text-lg font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Fale conosco
                </Link>
              </div>

              {/* Trust indicators */}
              <div
                className="hero-in mt-12 flex flex-wrap items-center gap-6 text-sm text-primary-200/80"
                style={{ '--hero-delay': '850ms' } as React.CSSProperties}
              >
                {trustIndicators.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <Badge variant="goldOutline" size="sm" className="gap-1">
                      <Award className="w-3 h-3" />
                      {item.label}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="absolute bottom-3 right-4 text-[11px] text-white/50">Foto: Leonardo Cruz</p>

          <a
            href="#stats"
            aria-label="Rolar para baixo"
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-primary-200/70 transition-colors hover:text-white md:flex"
          >
            <span className="text-xs uppercase tracking-[0.25em]">Role</span>
            <ArrowDown className="scroll-dot h-5 w-5" aria-hidden="true" />
          </a>
        </section>

        {/* Stats Section */}
        <section id="stats" className="relative z-10 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4">
            <dl className="grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 120} className="flex flex-col-reverse text-center">
                  <dt className="mt-1 text-sm text-gray-500">{s.label}</dt>
                  <dd className="font-display text-4xl font-bold text-primary-700 lg:text-5xl flex items-center justify-center gap-2">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section id="properties" className="scroll-mt-16 bg-white py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Reveal className="mb-12 max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="gold" size="sm">Portfólio</Badge>
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-900 lg:text-5xl">
                Seleção exclusiva para você
              </h2>
            </Reveal>
            <PropertyExplorer pageSize={6} />
            <div className="mt-12 text-center">
              <Link href="/properties" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                Ver todos os imóveis
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Reveal className="mx-auto mb-16 text-center max-w-2xl">
              <Badge variant="goldOutline" size="sm" className="mb-4 inline-flex">Por que nos escolher</Badge>
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
                  <Card className="group h-full border-gray-100 hover:border-primary-200 hover:shadow-elevation-3 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white">
                        <item.icon className="h-7 w-7" aria-hidden="true" />
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative isolate overflow-hidden bg-primary-900 py-20 text-white lg:py-28">
          <div className="animate-float absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
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

        {/* 3D Explorer Section */}
        <section id="3d-explorer" className="relative overflow-hidden bg-gray-950 py-16 lg:py-24">
          <div className="animate-float absolute -left-24 top-10 -z-10 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="animate-float-slow absolute -right-20 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl" />
          <Reveal className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <Badge variant="goldOutline" size="sm" className="mb-3 inline-flex">Visualização Imersiva</Badge>
              <h2 className="font-display text-3xl font-bold text-white lg:text-5xl mb-4">
                Explore seu futuro lar em <span className="italic text-gold">3D</span>
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

        <NeighborhoodsSection />

        {/* Testimonials Section */}
        <section className="bg-white py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Reveal className="mx-auto mb-16 text-center max-w-2xl">
              <Badge variant="goldOutline" size="sm" className="mb-3 inline-flex">Depoimentos</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 lg:text-5xl">
                O que dizem nossos clientes
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Mais de 3.000 famílias confiaram na Imobiliária Prime para realizar seus sonhos.
              </p>
              <p className="mt-2 text-xs text-gray-400">Depoimentos ilustrativos, até a publicação de avaliações reais.</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Encontramos nosso apartamento dos sonhos em menos de 30 dias. O atendimento foi impecável do início ao fim.",
                  author: "Maria Silva",
                  role: "Compradora - Jardins",
                  rating: 5,
                },
                {
                  quote: "A equipe nos guiou em todo o processo de financiamento. Transparência total e zero surpresas.",
                  author: "Carlos Oliveira",
                  role: "Comprador - Moema",
                  rating: 5,
                },
                {
                  quote: "Alugamos nosso imóvel comercial em tempo recorde. Profissionalismo e rede de contatos incrível.",
                  author: "Fernanda Costa",
                  role: "Proprietária - Faria Lima",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <Reveal key={i} delay={i * 150} className="card-lift">
                  <Card className="h-full border-gray-100">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} de 5 estrelas`}>
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <svg key={j} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <BlogTeasers />

        {/* Newsletter CTA */}
        <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
          <div className="animate-float absolute -left-24 top-10 -z-10 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl" />
          <div className="animate-float-slow absolute -right-20 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal className="mb-4">
                <Badge variant="goldOutline" size="sm">Newsletter</Badge>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="font-display text-3xl font-bold text-white lg:text-4xl mb-4">
                  Receba as melhores oportunidades
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-lg text-primary-100/80 mb-8">
                  Seja o primeiro a saber sobre novos imóveis, tendências de mercado e ofertas exclusivas.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="max-w-md mx-auto">
                  <HomeNewsletter />
                  <p className="text-gray-500 text-xs mt-3 text-center">
                    Ao cadastrar, você concorda com nossa Política de Privacidade. Sem spam.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}