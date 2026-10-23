import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface PageShellProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {title && (
          <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <h1 className="hero-in font-display text-3xl lg:text-4xl font-bold">{title}</h1>
              {subtitle && <p style={{ '--hero-delay': '150ms' } as React.CSSProperties} className="hero-in mt-3 max-w-2xl text-primary-100">{subtitle}</p>}
            </div>
          </section>
        )}
        {children}
      </main>
      <Footer />
    </div>
  )
}
