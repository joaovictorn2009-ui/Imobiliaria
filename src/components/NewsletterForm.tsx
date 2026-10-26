'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, send to your backend
    // const formData = new FormData(e.currentTarget)
    // await fetch('/api/newsletter', { method: 'POST', body: formData })

    setStatus('success')
    e.currentTarget.reset()

    // Reset after 5 seconds
    setTimeout(() => setStatus('idle'), 5000)
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-3" role="status">
        <Check className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Obrigado! Você receberá nossas novidades.</span>
      </div>
    )
  }

  return (
    <form className="flex gap-2 max-w-xs w-full" onSubmit={handleSubmit}>
      <label htmlFor="email-footer" className="sr-only">E-mail</label>
      <Input
        id="email-footer"
        name="email"
        type="email"
        placeholder="Seu e-mail"
        required
        autoComplete="email"
        disabled={status === 'submitting'}
        className={cn(
          'flex-1 min-w-0 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      />
      <Button type="submit" className="h-11 w-11 rounded-xl" aria-label={status === 'submitting' ? 'Enviando...' : 'Cadastrar e-mail'}>
        {status === 'submitting' ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
        )}
      </Button>
    </form>
  )
}