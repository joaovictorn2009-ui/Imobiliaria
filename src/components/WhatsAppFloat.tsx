'use client'

import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/contact'
import { cn } from '@/lib/utils'

/** Botão fixo do WhatsApp, com mensagem adequada à página em que a pessoa está. */
export function WhatsAppFloat() {
  const pathname = usePathname()
  const onDetail = /^\/properties\/[^/]+$/.test(pathname)

  const message = onDetail
    ? `Olá! Vi este imóvel no site e gostaria de mais informações: ${typeof window !== 'undefined' ? window.location.href : ''}`
    : 'Olá! Vim pelo site da Imobiliária Prime e gostaria de ajuda para encontrar um imóvel.'

  return (
    <a
      href={whatsappLink(message)}
      onClick={(e) => {
        // atualiza a mensagem com a URL atual no momento do clique
        if (onDetail) e.currentTarget.href = whatsappLink(`Olá! Vi este imóvel no site: ${window.location.href}`)
      }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className={cn(
        'group fixed right-4 z-[80] hidden items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-xl shadow-green-900/20 transition-all hover:scale-105 hover:bg-[#1ebe5a] sm:flex',
        'bottom-4'
      )}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[8rem] group-hover:pr-2">
        WhatsApp
      </span>
    </a>
  )
}
