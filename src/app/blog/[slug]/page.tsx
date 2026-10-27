import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { NewsletterForm } from '@/components/NewsletterForm'
import { POSTS, formatPostDate, getPost } from '@/data/posts'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return { title: 'Artigo não encontrado' }
  return {
    title: `${post.title} - Imobiliária Prime`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date },
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Imobiliária Prime' },
    publisher: { '@type': 'Organization', name: 'Imobiliária Prime' },
    mainEntityOfPage: `${base}/blog/${post.slug}`,
  }
  const others = POSTS.filter((p) => p.slug !== post.slug)

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Todos os guias
        </Link>
        <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">{post.category}</span>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {post.readMinutes} min de leitura · {formatPostDate(post.date)} · Equipe Imobiliária Prime
        </p>

        <div className="mt-10 space-y-10">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl font-bold text-gray-900">{s.heading}</h2>
              {s.paragraphs.map((t) => (
                <p key={t} className="mt-3 leading-relaxed text-gray-700">
                  {t}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-10 rounded-2xl bg-gray-50 p-5 text-sm text-gray-500">
          Este conteúdo é informativo e não substitui a orientação de um profissional. Regras, taxas e impostos mudam:
          confirme os detalhes com o banco, o cartório ou um advogado.
        </p>

        <div className="mt-12 rounded-3xl bg-primary-950 p-8 text-white">
          <h2 className="font-display text-xl font-bold">Receba os próximos guias</h2>
          <p className="mb-4 mt-1 text-sm text-primary-100">Dicas de compra, aluguel e mercado no seu e-mail.</p>
          <NewsletterForm />
        </div>

        <h2 className="mb-4 mt-14 font-display text-xl font-bold text-gray-900">Continue lendo</h2>
        <ul className="space-y-3">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="font-medium text-primary-700 hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </PageShell>
  )
}
