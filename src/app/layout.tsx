import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Imobiliária Prime - Encontre seu imóvel ideal',
  description: 'Imóveis para venda e aluguel. Apartamentos, casas, terrenos e comerciais. A melhor seleção do mercado.',
  keywords: ['imobiliária', 'imóveis', 'venda', 'aluguel', 'apartamentos', 'casas', 'terrenos'],
  authors: [{ name: 'Imobiliária Prime' }],
  creator: 'Imobiliária Prime',
  publisher: 'Imobiliária Prime',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://imobiliariaprime.com.br',
    title: 'Imobiliária Prime - Encontre seu imóvel ideal',
    description: 'Imóveis para venda e aluguel. Apartamentos, casas, terrenos e comerciais.',
    siteName: 'Imobiliária Prime',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imobiliária Prime',
    description: 'Encontre seu imóvel ideal',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
