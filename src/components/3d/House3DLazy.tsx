'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { SafeBoundary } from './SafeBoundary'
import type { PlanId } from './plans'

function Placeholder({ label = 'Preparando o modelo 3D…' }: { label?: string }) {
  return (
    <div className="relative grid h-[640px] w-full place-items-center overflow-hidden rounded-[28px] border border-white/10 bg-[#070c18] sm:h-[720px]">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="relative text-center">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[#e8c98f] border-t-transparent" />
        <p className="text-sm text-white/60">{label}</p>
      </div>
    </div>
  )
}

// O código do 3D (three.js) só é baixado quando o componente é realmente montado.
const CasaShowcase = dynamic(() => import('./casa/CasaShowcase'), {
  ssr: false,
  loading: () => <Placeholder />,
})

/** Só carrega o 3D quando o visitante rola até perto desta seção. */
export function House3DLazy({ planId = 'alphaville', showListingLink = true }: { planId?: PlanId; showListingLink?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {near ? (
        <SafeBoundary>
          <CasaShowcase planId={planId} showListingLink={showListingLink} />
        </SafeBoundary>
      ) : (
        <Placeholder label="O modelo 3D carrega ao chegar aqui" />
      )}
    </div>
  )
}
