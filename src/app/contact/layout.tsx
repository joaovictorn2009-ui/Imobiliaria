import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contato - Imobiliária Prime' }
export const dynamic = 'force-dynamic'

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}