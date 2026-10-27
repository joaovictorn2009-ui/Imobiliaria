'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ArrowUpRight, Armchair, ListTree, Moon, Ruler, Sun } from 'lucide-react'
import { CasaScene, type CasaMode } from './CasaScene'
import { buildPlan } from '../plans/build'
import { PLANS, type PlanId } from '../plans'

const GOLD = '#e8c98f'

const MODES: { id: CasaMode; label: string }[] = [
  { id: 'fachada', label: 'Fachada' },
  { id: 'corte', label: 'Corte 3D' },
  { id: 'planta', label: 'Planta' },
]

const fmt = (n: number, d = 1) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })

function Segmented<T extends string>({ items, value, onChange, light = false }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; light?: boolean }) {
  const index = Math.max(0, items.findIndex((i) => i.id === value))
  return (
    <div
      role="tablist"
      aria-label="Modo de visualização"
      className={`relative grid rounded-full border p-1 backdrop-blur-xl ${light ? 'border-gray-300 bg-white/80' : 'border-white/10 bg-white/[0.06]'}`}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1 top-1 rounded-full bg-gradient-to-b from-[#f3dba8] to-[#d7b06a] shadow-[0_4px_18px_rgba(232,201,143,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `calc((100% - 0.5rem) / ${items.length})`, transform: `translateX(${index * 100}%)` }}
      />
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          type="button"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={`relative z-10 rounded-full px-4 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300 sm:px-6 ${
            value === it.id ? 'text-[#1a1408]' : light ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c98f]`}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ on, onClick, icon: Icon, label }: { on: boolean; onClick: () => void; icon: typeof Ruler; label: string }) {
  // usado apenas na planta (fundo claro)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition-colors ${
        on ? 'border-[#c9a24a] bg-[#d4a843]/25 text-[#6b5214]' : 'border-gray-300 bg-white/85 text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  )
}

export interface CasaShowcaseProps {
  planId?: PlanId
  /** mostra o botão "Ver anúncio" (some quando já estamos na página do anúncio) */
  showListingLink?: boolean
}

export default function CasaShowcase({ planId = 'alphaville', showListingLink = true }: CasaShowcaseProps) {
  const spec = PLANS[planId]
  const plan = useMemo(() => buildPlan(spec), [spec])

  const [mode, setMode] = useState<CasaMode>('fachada')
  const [selected, setSelected] = useState<string | null>(null)
  const [zoomOn, setZoomOn] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [night, setNight] = useState(false)
  const [showFurniture, setShowFurniture] = useState(true)
  const [showDims, setShowDims] = useState(true)
  const [dpr, setDpr] = useState(1.5)
  const [listOpen, setListOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)

  // pausa a renderização quando o 3D sai da tela
  useEffect(() => {
    const el = wrap.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const room = plan.rooms.find((r) => r.id === selected) ?? null
  const isPlan = mode === 'planta'

  const selectRoom = (id: string | null) => {
    setSelected(id)
    if (id) {
      setAutoRotate(false)
      if (mode === 'fachada') setMode('corte')
    }
  }
  const changeMode = (m: CasaMode) => {
    setMode(m)
    setZoomOn(false)
    if (m !== 'fachada') setAutoRotate(false)
  }

  const interior = plan.rooms.filter((r) => !r.covered)
  const outdoors = plan.rooms.filter((r) => r.covered)

  return (
    <div
      ref={wrap}
      className={`relative h-[640px] w-full overflow-hidden rounded-[28px] border shadow-2xl sm:h-[720px] ${
        isPlan ? 'border-gray-200 bg-[#f6f5f1] shadow-black/20' : 'border-white/10 bg-[#070c18] shadow-black/50'
      }`}
    >
      <Canvas
        shadows="soft"
        dpr={dpr}
        frameloop={visible && !reduce ? 'always' : 'never'}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        style={{ touchAction: isPlan ? 'none' : 'pan-y' }}
        onPointerDown={() => {
          setZoomOn(true)
          setAutoRotate(false)
        }}
        onPointerLeave={() => setZoomOn(false)}
        aria-label={`Visualização 3D de ${spec.title}`}
        role="img"
      >
        <CasaScene
          plan={plan}
          mode={mode}
          selected={selected}
          onSelect={selectRoom}
          night={night}
          zoomOn={zoomOn}
          autoRotate={autoRotate && !reduce}
          showFurniture={showFurniture}
          showDims={showDims}
          panelOpen={listOpen}
          onPerf={(l) => setDpr(l === 'low' ? 1 : 1.5)}
        />
      </Canvas>

      {/* vinheta suave (só no 3D) */}
      {!isPlan && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.38)_100%)]" aria-hidden="true" />}

      {!isPlan && <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 via-black/20 to-transparent" aria-hidden="true" />}

      {/* título */}
      <div className="pointer-events-none absolute left-5 top-5 max-w-[60%] sm:left-8 sm:top-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: isPlan ? '#9a7a2e' : GOLD }}>
          {isPlan ? 'Planta técnica ilustrativa' : 'Modelo 3D do anúncio'}
        </p>
        <h3 className={`mt-1.5 font-display text-xl leading-tight sm:text-3xl ${isPlan ? 'text-gray-900' : 'text-white'}`}>{spec.title}</h3>
        <p className={`mt-1 hidden text-xs sm:block sm:text-sm ${isPlan ? 'text-gray-600' : 'text-white/60'}`}>
          {spec.subtitle} · {fmt(spec.targetArea, 0)} m²
        </p>
        <p className={`mt-3 hidden text-[11px] sm:block ${isPlan ? 'text-gray-500' : 'text-white/40'}`}>
          {isPlan ? 'Arraste para mover · clique na planta e use a roda para o zoom' : 'Arraste para girar · clique na cena para ativar o zoom'}
        </p>
        {showListingLink && (
          <Link
            href={`/properties/${spec.propertyId}`}
            className={`pointer-events-auto mt-3 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur ${isPlan ? 'border-[#c9a24a] bg-[#d4a843]/25 text-[#6b5214] hover:bg-[#d4a843]/40' : 'border-[#e8c98f] bg-[#e8c98f] text-[#1a1408] hover:bg-[#f3dba8]'}`}
          >
            Ver anúncio <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* norte (planta) */}
      {isPlan && (
        <div className="pointer-events-none absolute left-5 top-[11.5rem] hidden flex-col items-center text-gray-700 sm:flex sm:left-8" aria-label="Norte para cima">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
            <circle cx="17" cy="17" r="15" fill="none" stroke="#6b7280" strokeWidth="1.2" />
            <path d="M17 5 L22 20 L17 17 L12 20 Z" fill="#272b32" />
          </svg>
          <span className="text-[10px] font-semibold tracking-widest">N</span>
        </div>
      )}

      {/* lista de cômodos (desktop), recolhível */}
      <button
        type="button"
        onClick={() => setListOpen((o) => !o)}
        aria-expanded={listOpen}
        className={`absolute right-5 top-5 z-10 hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition-colors md:inline-flex ${
          isPlan ? 'border-gray-300 bg-white/85 text-gray-700 hover:text-gray-900' : 'border-white/15 bg-black/35 text-white/80 hover:text-white'
        }`}
      >
        <ListTree className="h-3.5 w-3.5" aria-hidden="true" />
        {listOpen ? 'Ocultar cômodos' : 'Cômodos'}
      </button>
      <aside
        className={`absolute right-5 top-14 max-h-[calc(100%-11rem)] w-60 overflow-y-auto rounded-3xl border p-3 backdrop-blur-xl ${listOpen ? 'hidden md:block' : 'hidden'} ${
          isPlan ? 'border-gray-200 bg-white/85' : 'border-white/10 bg-white/[0.05]'
        }`}
      >
        <p className={`px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${isPlan ? 'text-gray-500' : 'text-white/40'}`}>Cômodos</p>
        {[...interior, ...outdoors].map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => selectRoom(selected === r.id ? null : r.id)}
            className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left text-[13px] transition-colors ${
              selected === r.id
                ? 'bg-[#d4a843] text-[#1a1408]'
                : isPlan
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="truncate">{r.name}</span>
            <span className={`shrink-0 text-[11px] tabular-nums ${selected === r.id ? 'text-[#1a1408]/70' : isPlan ? 'text-gray-400' : 'text-white/40'}`}>{fmt(r.area)} m²</span>
          </button>
        ))}
        <p className={`mt-3 border-t px-2 pt-2 text-[10px] leading-snug ${isPlan ? 'border-gray-200 text-gray-500' : 'border-white/10 text-white/40'}`}>
          Áreas internas somam {fmt(plan.netArea, 0)} m². Planta ilustrativa baseada nos dados do anúncio, sem valor de projeto.
        </p>
      </aside>

      {/* cartão do cômodo */}
      {room && (
        <div
          className={`absolute inset-x-4 bottom-24 rounded-3xl border p-5 backdrop-blur-2xl sm:inset-x-auto sm:bottom-24 sm:left-8 sm:w-80 ${
            isPlan ? 'border-gray-200 bg-white/92 text-gray-900' : 'border-white/10 bg-[#0b1224]/80 text-white'
          }`}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Fechar detalhes do cômodo"
            className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full ${isPlan ? 'text-gray-400 hover:bg-gray-100' : 'text-white/50 hover:bg-white/10'}`}
          >
            ✕
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: isPlan ? '#9a7a2e' : GOLD }}>
            {fmt(room.area)} m²{room.rects.length === 1 ? ` · ${fmt(room.w)} × ${fmt(room.d)} m` : ''}
          </p>
          <h4 className="mt-1.5 pr-6 font-display text-xl">{room.name}</h4>
          <p className={`mt-2 text-sm leading-relaxed ${isPlan ? 'text-gray-600' : 'text-white/65'}`}>{room.desc}</p>
        </div>
      )}

      {/* controles */}
      <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-3 px-4">
        {isPlan && (
          <div className="flex gap-2">
            <Toggle on={showFurniture} onClick={() => setShowFurniture((v) => !v)} icon={Armchair} label="Móveis" />
            <Toggle on={showDims} onClick={() => setShowDims((v) => !v)} icon={Ruler} label="Cotas" />
          </div>
        )}
        <Segmented items={MODES} value={mode} onChange={changeMode} light={isPlan} />
      </div>

      {!isPlan && (
        <button
          type="button"
          onClick={() => setNight((n) => !n)}
          aria-pressed={night}
          aria-label={night ? 'Mudar para o dia' : 'Mudar para a noite'}
          className="absolute right-4 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/35 text-[#e8c98f] backdrop-blur-xl transition-all hover:scale-110 hover:bg-black/50 md:bottom-5 md:right-6 md:top-auto md:h-11 md:w-11 md:border-white/10 md:bg-white/[0.08]"
        >
          {night ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
        </button>
      )}
    </div>
  )
}
