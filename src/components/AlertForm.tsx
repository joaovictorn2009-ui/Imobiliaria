'use client'

import { useState } from 'react'
import { BellRing, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const FREQ = [
  { id: 'instant', label: 'Imediato' },
  { id: 'daily', label: 'Diário' },
  { id: 'weekly', label: 'Semanal' },
]

/** Alerta de novos imóveis. Ainda sem backend: guarda o pedido só neste aparelho. */
export function AlertForm({ defaultNeighborhood = '' }: { defaultNeighborhood?: string }) {
  const [sent, setSent] = useState(false)
  const [freq, setFreq] = useState('daily')

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const prev = JSON.parse(localStorage.getItem('prime:alerts') ?? '[]')
      localStorage.setItem('prime:alerts', JSON.stringify([...prev, { ...data, freq, at: Date.now() }]))
    } catch {
      /* armazenamento indisponível */
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800" role="status">
        <Check className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
        <p className="font-medium">Alerta criado! Vamos avisar você quando surgirem imóveis com esse perfil.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
          <BellRing className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">Avise-me quando aparecer</h2>
          <p className="mt-1 text-sm text-gray-600">Diga o bairro e o valor máximo e receba os novos imóveis por e-mail.</p>
        </div>
      </div>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="alert-neighborhood" className="mb-1 block text-sm font-medium text-gray-700">
            Bairro
          </label>
          <Input id="alert-neighborhood" name="neighborhood" defaultValue={defaultNeighborhood} placeholder="Ex.: Pinheiros" required />
        </div>
        <div>
          <label htmlFor="alert-max" className="mb-1 block text-sm font-medium text-gray-700">
            Valor máximo (R$)
          </label>
          <Input id="alert-max" name="max" inputMode="numeric" placeholder="Ex.: 900000" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="alert-email" className="mb-1 block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <Input id="alert-email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" required />
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-gray-700">Frequência</legend>
          <div className="flex gap-2">
            {FREQ.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFreq(f.id)}
                aria-pressed={freq === f.id}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  freq === f.id ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <Button type="submit" size="lg">
            Criar alerta
          </Button>
          <p className="mt-3 text-xs text-gray-500">Você pode cancelar a qualquer momento. Não enviamos spam.</p>
        </div>
      </form>
    </div>
  )
}
