'use client'

import { useEffect } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorBoundary({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Erro - Imobiliária Prime</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">Erro crítico</h1>
          <p className="mb-6 text-gray-600">
            Ocorreu um erro inesperado na aplicação. Por favor, recarregue a página.
          </p>
          <Button onClick={reset} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Recarregar aplicação
          </Button>
          {error.digest && (
            <p className="mt-6 text-xs text-gray-400 font-mono">
              Referência: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}