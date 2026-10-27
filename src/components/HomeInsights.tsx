import Link from 'next/link'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { PriceBars } from '@/components/PriceBars'
import { getNeighborhoods } from '@/data/neighborhoods'
import { POSTS, formatPostDate } from '@/data/posts'
import { formatCurrency } from '@/lib/utils'

/** Bairros em destaque + gráfico de preço do m². */
export function NeighborhoodsSection() {
  const list = getNeighborhoods().slice(0, 4)
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700">Guia de bairros</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 lg:text-5xl">Conheça a região antes de decidir</h2>
          <p className="mt-4 text-lg text-gray-600">
            Perfil de cada bairro, imóveis disponíveis e o preço médio do metro quadrado.
          </p>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((n, i) => (
              <Reveal key={n.slug} delay={i * 100}>
                <Link
                  href={`/bairros/${n.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
                >
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {n.city}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-gray-900">{n.name}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-600">{n.intro}</p>
                  <p className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {n.properties.length} imóve{n.properties.length === 1 ? 'l' : 'is'}
                      {n.avgSqmSale ? ` · ${formatCurrency(n.avgSqmSale)}/m²` : ''}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </p>
                </Link>
              </Reveal>
            ))}
            <Reveal className="sm:col-span-2">
              <Link href="/bairros" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline">
                Ver todos os bairros <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

          <Reveal direction="right" className="rounded-3xl border border-gray-200 bg-gray-50 p-6 lg:p-8">
            <h3 className="mb-5 font-display text-xl font-bold text-gray-900">Preço médio do m² (venda)</h3>
            <PriceBars />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Três guias do blog. */
export function BlogTeasers() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700">Guias do comprador</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 lg:text-5xl">Decida com mais segurança</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline">
            Ver todos os guias <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="w-fit rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">{p.category}</span>
                <h3 className="mt-4 font-display text-xl font-bold text-gray-900 group-hover:text-primary-600">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{p.excerpt}</p>
                <p className="mt-5 flex items-center gap-1.5 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {p.readMinutes} min · {formatPostDate(p.date)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
