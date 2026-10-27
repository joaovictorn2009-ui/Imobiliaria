import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Heart, Shield, Truck, Star, Award, CheckCircle } from 'lucide-react'
import { NewsletterForm } from '@/components/NewsletterForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const footerLinks = {
  empresa: [
    { href: '/about', label: 'Sobre nós' },
    { href: '/contact', label: 'Fale conosco' },
    { href: '/bairros', label: 'Guia de bairros' },
  ],
  imoveis: [
    { href: '/properties?type=apartment', label: 'Apartamentos' },
    { href: '/properties?type=house', label: 'Casas' },
    { href: '/properties?type=land', label: 'Terrenos' },
    { href: '/properties?type=commercial', label: 'Comerciais' },
    { href: '/properties?type=office', label: 'Escritórios' },
  ],
  suporte: [
    { href: '/terms', label: 'Termos de uso' },
    { href: '/privacy', label: 'Política de privacidade' },
    { href: '/faq', label: 'Perguntas frequentes' },
  ],
  recursos: [
    { href: '/blog/como-financiar-um-imovel', label: 'Como financiar' },
    { href: '/blog/documentos-para-comprar-imovel', label: 'Documentos para comprar' },
    { href: '/blog/como-escolher-o-bairro', label: 'Como escolher o bairro' },
    { href: '/favorites', label: 'Meus favoritos' },
  ],
}

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
]

const benefits = [
  { icon: Shield, title: 'Segurança', desc: 'Documentação verificada' },
  { icon: Truck, title: 'Mudança grátis', desc: 'Para contratos > 12 meses' },
  { icon: Star, title: 'Avaliação grátis', desc: 'Do seu imóvel atual' },
  { icon: Heart, title: 'Satisfação', desc: 'Ou seu dinheiro de volta' },
]

const certifications = [
  { label: 'CRECI-SP', desc: 'Conselho Regional de Corretores' },
  { label: 'SECOVI', desc: 'Sindicato da Habitação' },
  { label: 'ABMI', desc: 'Associação Brasileira do Mercado Imobiliário' },
  { label: 'ISO 9001', desc: 'Gestão de Qualidade' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-display font-bold text-white mb-6" aria-label="Imobiliária Prime - Página inicial">
              <svg className="w-10 h-10 text-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Imobiliária Prime</span>
            </Link>
            <p className="text-gray-400 text-base mb-6 max-w-xs leading-relaxed">
              Há mais de 15 anos ajudando você a encontrar o imóvel ideal. A maior seleção de imóveis para venda e aluguel com total segurança e transparência.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                <address className="not-italic text-sm">Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100</address>
              </div>
              <a href="tel:+551130000000" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-sm">(11) 3000-0000</span>
              </a>
              <a href="mailto:contato@imobiliariaprime.com.br" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-sm">contato@imobiliariaprime.com.br</span>
              </a>
            </div>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-gray-950 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) => (
                <Badge key={i} variant="goldOutline" size="sm" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{cert.label}</span>
                </Badge>
              ))}
            </div>
          </div>

          <nav aria-label="Links da empresa">
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tipos de imóveis">
            <h3 className="font-semibold text-white mb-4">Imóveis</h3>
            <ul className="space-y-3">
              {footerLinks.imoveis.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Suporte e ajuda">
            <h3 className="font-semibold text-white mb-4">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Recursos e guias">
            <h3 className="font-semibold text-white mb-4">Recursos</h3>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              Receba as melhores ofertas de imóveis e novidades do mercado imobiliário no seu e-mail.
            </p>
            <NewsletterForm />
            <p className="text-gray-500 text-xs mt-3 max-w-xs">
              Ao cadastrar, você concorda com nossa <Link href="/privacy" className="underline hover:text-gold">Política de Privacidade</Link>.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Imobiliária Prime. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <benefit.icon className="w-4 h-4 text-gold" />
                  <span>{benefit.title}: {benefit.desc}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Heart className="w-4 h-4 text-error" aria-hidden="true" />
              <span>Feito com carinho para você</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}