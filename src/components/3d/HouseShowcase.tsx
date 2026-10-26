'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { HouseScene } from './HouseScene'
import { CAMERA_PRESETS, ROOMS, type LevelId, type Mode } from './houseData'

const MODES: { id: Mode; label: string }[] = [
  { id: 'facade', label: 'Fachada' },
  { id: 'plan', label: 'Planta' },
  { id: 'explode', label: 'Explodir' },
]

const FLOORS: { id: LevelId; label: string }[] = [
  { id: 'ground', label: 'Térreo' },
  { id: 'upper', label: 'Superior' },
]

const GOLD = '#e8c98f'

function Segmented<T extends string>({
  items,
  value,
  onChange,
  small = false,
}: {
  items: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  small?: boolean
}) {
  const index = Math.max(0, items.findIndex((i) => i.id === value))
  return (
    <div
      role="tablist"
      className="relative grid rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur-xl"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1 top-1 rounded-full bg-gradient-to-b from-[#f3dba8] to-[#d7b06a] shadow-[0_4px_18px_rgba(232,201,143,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 0.5rem) / ${items.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          type="button"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={`relative z-10 rounded-full font-medium tracking-wide transition-colors duration-300 ${
            small ? 'px-4 py-1.5 text-xs' : 'px-5 py-2.5 text-sm sm:px-7'
          } ${value === it.id ? 'text-[#1a1408]' : 'text-white/70 hover:text-white'}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}

export default function HouseShowcase() {
  const [mode, setMode] = useState<Mode>('facade')
  const [planFloor, setPlanFloor] = useState<LevelId>('ground')
  const [selected, setSelected] = useState<string | null>(null)
  const [zoomOn, setZoomOn] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [dpr, setDpr] = useState(1.5)
  const [visible, setVisible] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)

  // pausa a renderização quando o 3D sai da tela (economiza bateria e CPU)
  useEffect(() => {
    const el = wrap.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const room = ROOMS.find((r) => r.id === selected) ?? null

  const selectRoom = (id: string | null) => {
    setSelected(id)
    if (!id) return
    const r = ROOMS.find((x) => x.id === id)
    if (!r) return
    setAutoRotate(false)
    if (mode === 'facade') setMode('plan')
    if (mode !== 'explode') setPlanFloor(r.level)
  }

  const changeMode = (m: Mode) => {
    setMode(m)
    if (m !== 'facade') setAutoRotate(false)
  }

  return (
    <div ref={wrap} className="relative h-[600px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#070c18] shadow-2xl shadow-black/50 sm:h-[680px]">
      <Canvas
        shadows="soft"
        dpr={dpr}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: CAMERA_PRESETS.facade.pos, fov: 38 }}
        style={{ touchAction: 'pan-y' }}
        onPointerDown={() => {
          setZoomOn(true)
          setAutoRotate(false)
        }}
        onPointerLeave={() => setZoomOn(false)}
      >
        <HouseScene
          mode={mode}
          planFloor={planFloor}
          selected={selected}
          onSelect={selectRoom}
          zoomOn={zoomOn}
          autoRotate={autoRotate}
          onPerf={(level) => setDpr(level === 'low' ? 1 : 1.5)}
        />
      </Canvas>

      {/* Título */}
      <div className="pointer-events-none absolute left-5 top-5 sm:left-8 sm:top-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
          Projeto ilustrativo
        </p>
        <h3 className="mt-1.5 font-display text-2xl text-white sm:text-3xl">Residência Prime</h3>
        <p className="mt-1 text-xs text-white/55 sm:text-sm">2 pavimentos · 192 m² · 3 dormitórios · piscina</p>
        <p className="mt-3 hidden text-[11px] text-white/40 sm:block">
          Arraste para girar · clique na cena para ativar o zoom
        </p>
      </div>

      {/* Lista de cômodos (desktop) */}
      <aside className="absolute right-5 top-7 hidden max-h-[calc(100%-9rem)] w-56 overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl md:block">
        {FLOORS.slice()
          .reverse()
          .map((f) => (
            <div key={f.id} className="mb-2 last:mb-0">
              <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                {f.label}
              </p>
              {ROOMS.filter((r) => r.level === f.id).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectRoom(selected === r.id ? null : r.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                    selected === r.id ? 'bg-[#e8c98f] text-[#1a1408]' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="truncate">{r.name}</span>
                  <span className={`shrink-0 text-[11px] ${selected === r.id ? 'text-[#1a1408]/70' : 'text-white/40'}`}>
                    {r.w * r.d} m²
                  </span>
                </button>
              ))}
            </div>
          ))}
      </aside>

      {/* Cartão do cômodo */}
      {room && (
        <div className="absolute inset-x-4 bottom-24 rounded-3xl border border-white/10 bg-[#0b1224]/80 p-5 backdrop-blur-2xl sm:inset-x-auto sm:bottom-24 sm:left-8 sm:w-80">
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Fechar detalhes do cômodo"
            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: GOLD }}>
            {room.level === 'ground' ? 'Térreo' : 'Pavimento superior'} · {room.w * room.d} m²
          </p>
          <h4 className="mt-1.5 pr-6 font-display text-xl text-white">{room.name}</h4>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{room.desc}</p>
        </div>
      )}

      {/* Controles */}
      <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-3 px-4">
        {mode === 'plan' && <Segmented items={FLOORS} value={planFloor} onChange={setPlanFloor} small />}
        <Segmented items={MODES} value={mode} onChange={changeMode} />
      </div>
    </div>
  )
}
