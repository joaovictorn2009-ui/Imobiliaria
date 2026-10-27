import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PrefsProvider } from '@/components/PrefsProvider'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'),
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'Imobiliária Prime', statusBarStyle: 'black-translucent' },
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
      <body className={`${inter.variable} ${display.variable} font-sans antialiased`}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-800 focus:shadow-xl"
        >
          Pular para o conteúdo
        </a>
        <PrefsProvider>
          {children}
          <WhatsAppFloat />
        </PrefsProvider>
        <ServiceWorkerRegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
