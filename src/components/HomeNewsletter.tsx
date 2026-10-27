'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Formulário de newsletter da home (componente de cliente por causa do onSubmit). */
export function HomeNewsletter() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div
        className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
        role="status"
      >
        <Check className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium">Obrigado! Você receberá nossas novidades.</span>
      </div>
    )
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        // Sem backend ainda: só confirma o cadastro na tela.
        setSent(true)
      }}
    >
      <label htmlFor="email-home-newsletter" className="sr-only">
        E-mail para newsletter
      </label>
      <input
        id="email-home-newsletter"
        type="email"
        name="email"
        placeholder="Seu e-mail"
        required
        autoComplete="email"
        className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold"
      />
      <Button type="submit" variant="gold" size="lg" className="whitespace-nowrap">
        Cadastrar
      </Button>
    </form>
  )
}
