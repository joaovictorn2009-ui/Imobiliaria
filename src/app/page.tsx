import Link from 'next/link'
import { ShieldCheck, Users, Key } from 'lucide-react'
import { PropertyExplorer } from '@/components/PropertyExplorer'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 lg:py-32 overflow-hidden">
          <div className="container relative px-4 mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight mb-6 text-balance">
                Encontre o imóvel <span className="text-accent-300">perfeito</span> para você
              </h1>
              <p className="text-lg lg:text-xl text-primary-100 mb-8 max-w-2xl">
                A maior seleção de imóveis para venda e aluguel. Apartamentos, casas, terrenos e comerciais nas melhores localizações.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#properties"
                  className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors text-center"
                >
                  Ver imóveis
                </a>
                <Link
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors text-center"
                >
                  Fale conosco
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        <section id="properties" className="py-16 lg:py-24 bg-white">
          <div className="container px-4 mx-auto">
            <PropertyExplorer pageSize={6} />
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
                Por que escolher a Imobiliária Prime?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Mais de 15 anos de experiência no mercado imobiliário, ajudando milhares de famílias a realizarem o sonho da casa própria.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                    <item.icon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-primary-600 text-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              Pronto para encontrar seu novo lar?
            </h2>
            <p className="text-lg lg:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Nossa equipe está pronta para te ajudar a encontrar o imóvel ideal. Agende uma visita sem compromisso.
            </p>
            <Link
              href="/contact"
              className="bg-white text-primary-700 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors inline-block"
            >
              Agendar visita
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
