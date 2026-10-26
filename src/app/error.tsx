'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log do erro para debugging (em produção, enviar para Sentry/LogRocket)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">Ops! Algo deu errado</h1>
        <p className="mb-6 text-gray-600">
          Encontramos um problema inesperado. Nossa equipe já foi notificada.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" aria-hidden="true" />
              Voltar ao início
            </Link>
          </Button>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-gray-400 font-mono">
            Referência: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}