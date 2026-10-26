'use client'

import { useFormState } from 'react-dom'
import { useState } from 'react'
import { sendContactForm } from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FormState {
  success: boolean
  error?: string
  errors?: Partial<Record<'name' | 'email' | 'phone' | 'message', string>>
}

const initialState: FormState = { success: false }

export function ContactForm({ property }: { property?: string }) {
  const [state, formAction, isPending] = useFormState(sendContactForm, initialState)
  const [sent, setSent] = useState(false)

  // Reset sent state when form data changes
  if (state.success && !sent) {
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-green-50 p-8 text-green-800" role="status">
        Mensagem enviada! Entraremos em contato em breve.
      </div>
    )
  }

  const err = (message?: string) => (message ? <p className="mt-1 text-xs text-red-600" role="alert">{message}</p> : null)

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {/* Honeypot anti-spam */}
      <input type="hidden" name="property" value={property ?? ''} />
      <input type="hidden" name="honeypot" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Nome</label>
        <Input id="name" name="name" aria-describedby={state.errors?.name ? 'name-error' : undefined} />
        {err(state.errors?.name)}
        {state.errors?.name && <span id="name-error" className="sr-only">{state.errors.name}</span>}
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">E-mail</label>
        <Input id="email" type="email" name="email" aria-describedby={state.errors?.email ? 'email-error' : undefined} />
        {err(state.errors?.email)}
        {state.errors?.email && <span id="email-error" className="sr-only">{state.errors.email}</span>}
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">Telefone</label>
        <Input id="phone" type="tel" name="phone" aria-describedby={state.errors?.phone ? 'phone-error' : undefined} />
        {err(state.errors?.phone)}
        {state.errors?.phone && <span id="phone-error" className="sr-only">{state.errors.phone}</span>}
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">Mensagem</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
        />
        {err(state.errors?.message)}
        {state.errors?.message && <span id="message-error" className="sr-only">{state.errors.message}</span>}
      </div>

      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700 text-sm" role="alert">
          {state.error}
        </div>
      )}

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? 'Enviando...' : 'Enviar mensagem'}
      </Button>
    </form>
  )
}