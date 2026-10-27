'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Scale, X } from 'lucide-react'
import { mockProperties } from '@/data/mockProperties'

const FAV_KEY = 'prime:favorites'
const CMP_KEY = 'prime:compare'
export const MAX_COMPARE = 3

interface Prefs {
  ready: boolean
  favorites: string[]
  compare: string[]
  isFavorite: (id: string) => boolean
  isCompared: (id: string) => boolean
  toggleFavorite: (id: string) => void
  toggleCompare: (id: string) => void
  clearCompare: () => void
  notify: (message: string) => void
}

const Ctx = createContext<Prefs | null>(null)

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* modo privado ou armazenamento bloqueado: continua só em memória */
  }
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setFavorites(read(FAV_KEY))
    setCompare(read(CMP_KEY))
    setReady(true)
    // mantém várias abas sincronizadas
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAV_KEY) setFavorites(read(FAV_KEY))
      if (e.key === CMP_KEY) setCompare(read(CMP_KEY))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const notify = useCallback((message: string) => {
    setToast(message)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const has = prev.includes(id)
        const next = has ? prev.filter((x) => x !== id) : [...prev, id]
        write(FAV_KEY, next)
        notify(has ? 'Removido dos favoritos' : 'Salvo nos favoritos')
        return next
      })
    },
    [notify]
  )

  const toggleCompare = useCallback(
    (id: string) => {
      setCompare((prev) => {
        if (prev.includes(id)) {
          const next = prev.filter((x) => x !== id)
          write(CMP_KEY, next)
          return next
        }
        if (prev.length >= MAX_COMPARE) {
          notify(`Você pode comparar até ${MAX_COMPARE} imóveis`)
          return prev
        }
        const next = [...prev, id]
        write(CMP_KEY, next)
        notify('Adicionado à comparação')
        return next
      })
    },
    [notify]
  )

  const clearCompare = useCallback(() => {
    setCompare([])
    write(CMP_KEY, [])
  }, [])

  const value = useMemo<Prefs>(
    () => ({
      ready,
      favorites,
      compare,
      isFavorite: (id) => favorites.includes(id),
      isCompared: (id) => compare.includes(id),
      toggleFavorite,
      toggleCompare,
      clearCompare,
      notify,
    }),
    [ready, favorites, compare, toggleFavorite, toggleCompare, clearCompare, notify]
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      <CompareBar />
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-24 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-gray-900/95 px-5 py-2.5 text-sm font-medium text-white shadow-xl transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        {toast}
      </div>
    </Ctx.Provider>
  )
}

export function usePrefs(): Prefs {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePrefs precisa estar dentro de <PrefsProvider>')
  return ctx
}

/** Barra fixa que aparece quando há imóveis escolhidos para comparar. */
function CompareBar() {
  const { compare, toggleCompare, clearCompare } = usePrefs()
  const pathname = usePathname()
  // na página de um imóvel o celular tem uma barra fixa embaixo: sobe a barra de comparação
  const onDetail = /^\/properties\/[^/]+$/.test(pathname)
  if (compare.length === 0) return null
  const items = compare.map((id) => mockProperties.find((p) => p.id === id)).filter(Boolean)

  return (
    <div className={`fixed inset-x-0 z-[85] mx-auto ${onDetail ? 'bottom-20 lg:bottom-4' : 'bottom-4'} flex w-[calc(100%-2rem)] max-w-2xl items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl`}>
      <Scale className="ml-1 hidden h-5 w-5 flex-shrink-0 text-primary-600 sm:block" aria-hidden="true" />
      <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
        {items.map((p) => (
          <li
            key={p!.id}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primary-50 py-1 pl-3 pr-1.5 text-xs font-medium text-primary-800"
          >
            <span className="max-w-[9rem] truncate">{p!.title}</span>
            <button
              type="button"
              onClick={() => toggleCompare(p!.id)}
              aria-label={`Remover ${p!.title} da comparação`}
              className="grid h-5 w-5 place-items-center rounded-full hover:bg-primary-100"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={clearCompare} className="hidden text-xs text-gray-500 hover:text-gray-800 sm:block">
        Limpar
      </button>
      <Link
        href={`/compare?ids=${compare.join(',')}`}
        className={`flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
          compare.length >= 2
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'pointer-events-none bg-gray-100 text-gray-400'
        }`}
        aria-disabled={compare.length < 2}
      >
        Comparar ({compare.length})
      </Link>
    </div>
  )
}
