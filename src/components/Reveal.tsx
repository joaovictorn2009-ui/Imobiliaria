'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
  as?: 'div' | 'li' | 'section'
}

/** Anima o conteúdo quando ele entra na tela ao rolar. */
export function Reveal({ children, className, delay = 0, direction = 'up', as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={cn(
        'reveal',
        direction === 'left' && 'reveal-left',
        direction === 'right' && 'reveal-right',
        direction === 'scale' && 'reveal-scale',
        visible && 'is-visible',
        className
      )}
    >
      {children}
    </Tag>
  )
}
