'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormState {
  success: boolean
  error?: string
  errors?: Partial<Record<'name' | 'email' | 'phone' | 'message', string>>
  isPending: boolean
}

const initialState: FormState = { success: false, isPending: false }

export function ContactForm({ property }: { property?: string }) {
  const [state, setState] = useState<FormState>(initialState)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState(prev => ({ ...prev, isPending: true, error: undefined, errors: undefined }))

    const formData = new FormData(e.currentTarget)
    formData.append('property', property ?? '')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()

      if (result.success) {
        setState(prev => ({ ...prev, success: true, isPending: false }))
        setSent(true)
      } else {
        setState(prev => ({
          ...prev,
          success: false,
          isPending: false,
          error: result.error,
          errors: result.errors,
        }))
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setState(prev => ({
        ...prev,
        success: false,
        isPending: false,
        error: 'Erro de conexão. Tente novamente.',
      }))
    }
  }

  // Reset sent state when form data changes
  if (state.success && !sent) {
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-green-800 border border-green-100" role="status">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Mensagem enviada com sucesso!</h3>
        </div>
        <p className="text-green-700">Entraremos em contato em breve. Obrigado por escolher a Imobiliária Prime.</p>
        <Button variant="outline" className="mt-6" onClick={() => { setSent(false); setState(initialState); }}>
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot anti-spam */}
      <input type="hidden" name="property" value={property ?? ''} />
      <input type="hidden" name="honeypot" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Nome completo"
          placeholder="João da Silva"
          error={state.errors?.name}
          required
          autoComplete="name"
        />
        <Input
          id="email"
          type="email"
          name="email"
          label="E-mail"
          placeholder="joao@email.com"
          error={state.errors?.email}
          required
          autoComplete="email"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="phone"
          type="tel"
          name="phone"
          label="Telefone (com DDD)"
          placeholder="(11) 99999-9999"
          error={state.errors?.phone}
          required
          autoComplete="tel"
        />
        <Input
          id="subject"
          name="subject"
          label="Assunto"
          placeholder="Interesse em imóvel / Dúvida / Parceria"
          autoComplete="off"
        />
      </div>

      <Textarea
        id="message"
        name="message"
        label="Mensagem"
        placeholder="Conte-nos o que procura, tire suas dúvidas ou agende uma visita..."
        error={state.errors?.message}
        required
        rows={5}
      />

      {state.error && (
        <div className="rounded-xl bg-error/10 border border-error/20 p-4 text-error" role="alert">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{state.error}</span>
          </div>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" loading={state.isPending}>
        {state.isPending ? 'Enviando...' : 'Enviar mensagem'}
      </Button>

      <p className="text-center text-xs text-gray-500">
        Seus dados estão seguros. Não compartilhamos suas informações com terceiros.
      </p>
    </form>
  )
}