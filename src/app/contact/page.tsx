'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { ContactForm } from '@/components/ContactForm'

export default function ContactPage({ searchParams }: { searchParams: { imovel?: string } }) {
  return (
    <PageShell title="Fale conosco" subtitle="Tire dúvidas ou agende uma visita sem compromisso.">
      <section className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-2">
        <ContactForm property={searchParams.imovel} />
        <div className="space-y-4 text-gray-700">
          <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary-600" aria-hidden="true" /> (11) 3000-0000</p>
          <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary-600" aria-hidden="true" /> contato@imobiliariaprime.com.br</p>
          <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary-600" aria-hidden="true" /> Av. Paulista, 1000 - Bela Vista, São Paulo - SP</p>
        </div>
      </section>
    </PageShell>
  )
}
