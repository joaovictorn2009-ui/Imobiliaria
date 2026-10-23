'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Informe telefone com DDD'),
  message: z.string().min(10, 'Escreva pelo menos 10 caracteres'),
})
type FormData = z.infer<typeof schema>

export function ContactForm({ property }: { property?: string }) {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { message: property ? `Tenho interesse no imóvel: ${property}. ` : '' },
  })

  if (sent) {
    return (
      <div className="rounded-xl bg-green-50 p-8 text-green-800" role="status">
        Mensagem enviada! Entraremos em contato em breve.
      </div>
    )
  }

  const err = (m?: string) => (m ? <p className="mt-1 text-xs text-red-600">{m}</p> : null)

  return (
    <form
      onSubmit={handleSubmit(async () => {
        // Sem backend ainda: simula o envio.
        await new Promise((r) => setTimeout(r, 400))
        setSent(true)
      })}
      className="space-y-4"
      noValidate
    >
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Nome</label>
        <Input id="name" {...register('name')} />
        {err(errors.name?.message)}
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">E-mail</label>
        <Input id="email" type="email" {...register('email')} />
        {err(errors.email?.message)}
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">Telefone</label>
        <Input id="phone" type="tel" {...register('phone')} />
        {err(errors.phone?.message)}
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">Mensagem</label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {err(errors.message?.message)}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
      </Button>
    </form>
  )
}
