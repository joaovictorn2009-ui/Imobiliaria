'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [notice, setNotice] = useState(false)
  const isRegister = mode === 'register'

  return (
    <form
      className="mx-auto max-w-sm space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        setNotice(true)
      }}
    >
      {isRegister && (
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Nome</label>
          <Input id="name" required />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">E-mail</label>
        <Input id="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Senha</label>
        <Input id="password" type="password" required minLength={8} />
      </div>
      <Button type="submit" className="w-full" size="lg">{isRegister ? 'Criar conta' : 'Entrar'}</Button>
      {notice && (
        <p className="text-sm text-gray-600" role="status">
          Autenticação ainda não implementada: é preciso conectar um backend.
        </p>
      )}
    </form>
  )
}
