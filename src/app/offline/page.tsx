import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sem conexão - Imobiliária Prime', robots: { index: false } }

export default function OfflinePage() {
  return (
    <main id="conteudo" className="grid min-h-screen place-items-center bg-primary-950 px-6 text-center text-white">
      <div className="max-w-md">
        <h1 className="font-display text-3xl font-bold">Você está sem conexão</h1>
        <p className="mt-3 text-primary-100">
          Não foi possível carregar esta página. Verifique sua internet e tente novamente. Páginas que você já abriu
          podem continuar disponíveis.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-primary-800">
          Tentar de novo
        </Link>
      </div>
    </main>
  )
}
