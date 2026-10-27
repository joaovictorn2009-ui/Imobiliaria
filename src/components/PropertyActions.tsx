'use client'

import { Heart, Scale, Share2 } from 'lucide-react'
import { usePrefs } from '@/components/PrefsProvider'
import { cn } from '@/lib/utils'
import type { Property } from '@/types'

interface PropertyActionsProps {
  property: Property
  className?: string
  /** 'overlay' = botões redondos sobre a foto; 'bar' = botões com texto */
  variant?: 'overlay' | 'bar'
}

export function PropertyActions({ property, className, variant = 'overlay' }: PropertyActionsProps) {
  const { isFavorite, isCompared, toggleFavorite, toggleCompare, notify } = usePrefs()
  const fav = isFavorite(property.id)
  const cmp = isCompared(property.id)

  const share = async () => {
    const url = `${window.location.origin}/properties/${property.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, text: `Veja este imóvel: ${property.title}`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      notify('Link copiado')
    } catch {
      // o usuário cancelou o compartilhamento: nada a fazer
    }
  }

  const base =
    variant === 'overlay'
      ? 'grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110'
      : 'inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'

  return (
    <div className={cn(variant === 'overlay' ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2', className)}>
      <button
        type="button"
        onClick={() => toggleFavorite(property.id)}
        aria-pressed={fav}
        aria-label={fav ? `Remover ${property.title} dos favoritos` : `Salvar ${property.title} nos favoritos`}
        className={cn(base, fav && 'text-rose-600')}
      >
        <Heart className={cn('h-4 w-4', fav && 'fill-current')} aria-hidden="true" />
        {variant === 'bar' && (fav ? 'Salvo' : 'Salvar')}
      </button>
      <button
        type="button"
        onClick={share}
        aria-label={`Compartilhar ${property.title}`}
        className={cn(base, 'hover:text-primary-600')}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        {variant === 'bar' && 'Compartilhar'}
      </button>
      <button
        type="button"
        onClick={() => toggleCompare(property.id)}
        aria-pressed={cmp}
        aria-label={cmp ? `Remover ${property.title} da comparação` : `Comparar ${property.title}`}
        className={cn(base, cmp && 'bg-primary-600 text-white hover:bg-primary-700', !cmp && 'hover:text-primary-600')}
      >
        <Scale className="h-4 w-4" aria-hidden="true" />
        {variant === 'bar' && (cmp ? 'Na comparação' : 'Comparar')}
      </button>
    </div>
  )
}
