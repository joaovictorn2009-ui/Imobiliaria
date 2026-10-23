import Link from 'next/link'
import { PageShell } from '@/components/PageShell'

export default function NotFound() {
  return (
    <PageShell title="Página não encontrada">
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="mb-6 text-gray-600">O conteúdo que você procura não existe ou foi removido.</p>
        <Link href="/" className="font-semibold text-primary-700 hover:underline">Voltar ao início</Link>
      </section>
    </PageShell>
  )
}
