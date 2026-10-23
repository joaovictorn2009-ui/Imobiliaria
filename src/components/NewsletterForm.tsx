'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewsletterForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return <p className="text-sm text-primary-300" role="status">Obrigado! Você receberá nossas novidades.</p>
  }

  return (
    <form
      className="flex gap-2 max-w-xs"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <label htmlFor="email-footer" className="sr-only">E-mail</label>
      <input
        type="email"
        id="email-footer"
        name="email"
        placeholder="Seu e-mail"
        required
        className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
      />
      <Button type="submit" className="h-11" aria-label="Cadastrar e-mail">
        <ArrowUpRight className="w-5 h-5" />
      </Button>
    </form>
  )
}
