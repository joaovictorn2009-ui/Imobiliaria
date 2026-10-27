'use client'

interface DualRangeProps {
  label: string
  min: number
  max: number
  low: number | null
  high: number | null
  onChange: (low: number | null, high: number | null) => void
  format: (n: number) => string
  /** escala logarítmica: ideal para preços, que vão de milhares a milhões */
  log?: boolean
}

const STEPS = 1000

function niceRound(v: number) {
  const step = v < 20_000 ? 500 : v < 200_000 ? 5_000 : v < 1_000_000 ? 25_000 : 100_000
  return Math.max(step, Math.round(v / step) * step)
}

export function DualRange({ label, min, max, low, high, onChange, format, log = false }: DualRangeProps) {
  const toValue = (pos: number) => {
    const t = pos / STEPS
    if (log) return niceRound(Math.exp(Math.log(min) + (Math.log(max) - Math.log(min)) * t))
    return Math.round(min + (max - min) * t)
  }
  const toPos = (v: number) => {
    const t = log ? (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min)) : (v - min) / (max - min)
    return Math.min(STEPS, Math.max(0, Math.round(t * STEPS)))
  }

  const lo = low === null ? 0 : toPos(low)
  const hi = high === null ? STEPS : toPos(high)

  const setLo = (pos: number) => {
    const p = Math.min(pos, hi - 20)
    onChange(p <= 0 ? null : toValue(p), high)
  }
  const setHi = (pos: number) => {
    const p = Math.max(pos, lo + 20)
    onChange(low, p >= STEPS ? null : toValue(p))
  }

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-gray-900">{label}</span>
        <span className="text-xs text-gray-500" aria-live="polite">
          {low === null ? format(min) : format(low)} – {high === null ? `${format(max)}+` : format(high)}
        </span>
      </div>
      <div className="dual-range relative h-6">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary-600"
          style={{ left: `${lo / 10}%`, width: `${(hi - lo) / 10}%` }}
        />
        <input
          type="range"
          min={0}
          max={STEPS}
          value={lo}
          onChange={(e) => setLo(Number(e.target.value))}
          aria-label={`${label}: mínimo`}
        />
        <input
          type="range"
          min={0}
          max={STEPS}
          value={hi}
          onChange={(e) => setHi(Number(e.target.value))}
          aria-label={`${label}: máximo`}
        />
      </div>
    </div>
  )
}
