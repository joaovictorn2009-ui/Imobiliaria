import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { AuthForm } from '@/components/AuthForm'

export const metadata: Metadata = { title: 'Entrar - Imobiliária Prime' }

export default function LoginPage() {
  return (
    <PageShell title="Entrar">
      <section className="px-4 py-16">
        <AuthForm mode="login" />
      </section>
    </PageShell>
  )
}
