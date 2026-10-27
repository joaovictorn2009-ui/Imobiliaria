'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, Search, Phone, Mail, User, LogIn, UserPlus, Heart } from 'lucide-react'
import { usePrefs } from '@/components/PrefsProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Styled link component to avoid Radix Slot issues during static generation
function StyledLink({
  href,
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode; variant?: 'default' | 'outline' | 'ghost' | 'gold'; size?: 'sm' | 'md' | 'lg' }) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-primary-600',
    gold: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-gold',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <Link
      href={href}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  )
}

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/properties', label: 'Imóveis' },
  { href: '/bairros', label: 'Bairros' },
  { href: '/blog', label: 'Guias' },
  { href: '/about', label: 'Sobre nós' },
  { href: '/contact', label: 'Contato' },
]

function FavoritesLink({ className, onClick, withLabel = false }: { className?: string; onClick?: () => void; withLabel?: boolean }) {
  const { favorites } = usePrefs()
  return (
    <Link
      href="/favorites"
      onClick={onClick}
      aria-label={`Favoritos (${favorites.length})`}
      className={cn('relative inline-flex items-center gap-2 rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-rose-600', className)}
    >
      <Heart className="h-5 w-5" aria-hidden="true" />
      {withLabel && <span className="font-medium">Favoritos</span>}
      {favorites.length > 0 && (
        <span className={cn('grid h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white', withLabel ? 'ml-auto' : 'absolute -right-0.5 -top-0.5')}>
          {favorites.length}
        </span>
      )}
    </Link>
  )
}

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
          'sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl transition-all duration-300',
          scrolled ? 'border-gray-200 shadow-elevation-1' : 'border-transparent'
        )}
      >
        <nav className="container mx-auto px-4" aria-label="Navegação principal">
          <div className={cn('flex items-center justify-between transition-all duration-300', scrolled ? 'h-14' : 'h-16')}>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-display font-bold text-primary-900 hover:opacity-80 transition-opacity"
              aria-label="Imobiliária Prime - Página inicial"
            >
              <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

            <div className="hidden md:flex md:items-center md:gap-3">
              <StyledLink
                href="tel:+551130000000"
                variant="ghost"
                size="sm"
                className="gap-1 text-gray-600 hover:text-primary-600"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                (11) 3000-0000
              </StyledLink>
              <FavoritesLink />
              <StyledLink href="/contact" variant="outline" size="sm">
                Fale conosco
              </StyledLink>
              <StyledLink href="/login" variant="ghost" size="sm">
                <User className="w-4 h-4" aria-hidden="true" />
                Entrar
              </StyledLink>
              <StyledLink href="/register" variant="gold" size="sm">
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                Cadastrar
              </StyledLink>
            </div>

            <div className="flex md:hidden items-center gap-1">
              <FavoritesLink />
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
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar imóveis..."
                  className="pl-10"
                  autoFocus
                />
              </form>
            </div>
          )}
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-70 bg-black/50 md:hidden transition-opacity',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed right-0 top-0 z-80 w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-spring md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Menu mobile"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <span className="font-display font-semibold text-gray-900">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-primary-600 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-200 my-4 pt-4 space-y-3">
            <StyledLink
              href="/contact"
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => setMobileMenuOpen(false)}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              <Mail className="w-5 h-5 mr-2" />
              Fale conosco
            </StyledLink>
            <StyledLink
              href="/login"
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => setMobileMenuOpen(false)}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Entrar
            </StyledLink>
            <StyledLink
              href="/register"
              variant="gold"
              className="w-full justify-start gap-3"
              onClick={() => setMobileMenuOpen(false)}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Cadastrar
            </StyledLink>
          </div>
        </div>
      </aside>
    </>
  )
}