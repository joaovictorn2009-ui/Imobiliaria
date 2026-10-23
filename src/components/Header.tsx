'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, Search, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/properties', label: 'Imóveis' },
  { href: '/about', label: 'Sobre nós' },
  { href: '/contact', label: 'Contato' },
]

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/properties?q=${encodeURIComponent(q)}` : '/properties')
    setSearchOpen(false)
  }

  return (
    <>
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md transition-all duration-300',
        scrolled ? 'border-gray-200 shadow-md shadow-gray-900/5' : 'border-transparent'
      )}
    >
      <nav className="container mx-auto px-4" aria-label="Navegação principal">
        <div className={cn('flex items-center justify-between transition-all duration-300', scrolled ? 'h-14' : 'h-16')}>
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-display font-bold text-primary-700 hover:opacity-80 transition-opacity"
            aria-label="Imobiliária Prime - Página inicial"
          >
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span className="hidden sm:block">Imobiliária Prime</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary-600 hover:after:w-full after:transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Button variant="ghost" size="sm" className="gap-1 text-gray-600 hover:text-primary-600" asChild>
              <a href="tel:+551130000000">
                <Phone className="w-4 h-4 mr-1" aria-hidden="true" />
                (11) 3000-0000
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Fale conosco</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button variant="default" size="sm" asChild className="bg-accent-600 hover:bg-accent-700">
              <Link href="/register">Cadastrar</Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen((o) => !o)} aria-label="Buscar">
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <form className="relative" role="search" onSubmit={submitSearch}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar imóveis..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </form>
          </div>
        )}
      </nav>
    </header>

      <div
        className={cn(
          'fixed inset-0 z-[70] bg-black/50 md:hidden transition-opacity',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed right-0 top-0 z-[80] w-full max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Menu mobile"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-600 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-200 my-4 pt-4 space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} tabIndex={mobileMenuOpen ? 0 : -1}>
                <Mail className="w-5 h-5 mr-2" />
                Fale conosco
              </Link>
            </Button>
            <Button className="w-full justify-start gap-3" asChild>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} tabIndex={mobileMenuOpen ? 0 : -1}>
                Entrar
              </Link>
            </Button>
            <Button className="w-full justify-start gap-3 bg-accent-600 hover:bg-accent-700" asChild>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} tabIndex={mobileMenuOpen ? 0 : -1}>
                Cadastrar
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
