import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { POSTS, formatPostDate } from '@/data/posts'

export const metadata: Metadata = {
  title: 'Blog e guias - Imobiliária Prime',
  description: 'Guias práticos sobre financiamento, documentação e como escolher o bairro certo.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <PageShell title="Guias do comprador" subtitle="Conteúdo prático para decidir com segurança.">
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="w-fit rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">{p.category}</span>
                <h2 className="mt-4 font-display text-xl font-bold text-gray-900 group-hover:text-primary-600">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {p.readMinutes} min · {formatPostDate(p.date)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
