'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [notice, setNotice] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isRegister = mode === 'register'

  return (
    <form
      className="mx-auto max-w-sm space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        setNotice(true)
      }}
    >
      {isRegister && (
        <Input
          id="name"
          name="name"
          label="Nome completo"
          placeholder="João da Silva"
          required
          autoComplete="name"
          icon={<User className="w-5 h-5" />}
        />
      )}

      <Input
        id="email"
        name="email"
        type="email"
        label="E-mail"
        placeholder="joao@email.com"
        required
        autoComplete="email"
        icon={<Mail className="w-5 h-5" />}
      />

      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Senha"
          placeholder="••••••••"
          required
          minLength={8}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          icon={<Lock className="w-5 h-5" />}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={false}>
        {isRegister ? 'Criar conta' : 'Entrar'}
      </Button>

      {notice && (
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-yellow-800" role="status">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">Autenticação ainda não implementada: é preciso conectar um backend.</span>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-gray-600">
        {isRegister ? 'Já tem conta? ' : 'Não tem conta? '}
        <a href={isRegister ? '/login' : '/register'} className="text-primary-600 hover:underline font-medium">
          {isRegister ? 'Entrar' : 'Cadastrar'}
        </a>
      </p>
    </form>
  )
}