import type { Metadata } from 'next'
import { PageShell } from '@/components/PageShell'
import { AuthForm } from '@/components/AuthForm'

export const metadata: Metadata = { title: 'Cadastrar - Imobiliária Prime' }

export default function RegisterPage() {
  return (
    <PageShell title="Cadastrar">
      <section className="px-4 py-16">
        <AuthForm mode="register" />
      </section>
    </PageShell>
  )
}
