'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Property } from '@/types'

const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const RADII = [
  { meters: 500, label: '500 m · ~6 min a pé' },
  { meters: 1000, label: '1 km · ~12 min a pé' },
  { meters: 2000, label: '2 km · ~25 min a pé' },
]

/** Mapa de um imóvel, com círculo de distância a pé. */
export default function PropertyMap({ property }: { property: Property }) {
  const el = useRef<HTMLDivElement>(null)
  const circleRef = useRef<import('leaflet').Circle | null>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const [radius, setRadius] = useState(1000)
  const { latitude, longitude } = property.address

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return
    let cancelled = false

    ;(async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !el.current) return
      const map = L.map(el.current, { scrollWheelZoom: false }).setView([latitude, longitude], 14)
      mapRef.current = map
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 18 }).addTo(map)
      L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: '',
          html: '<div class="price-pin is-active">Aqui</div>',
          iconSize: [0, 0],
        }),
        title: property.title,
      }).addTo(map)
      circleRef.current = L.circle([latitude, longitude], {
        radius: 1000,
        color: '#2a5499',
        weight: 2,
        fillColor: '#2a5499',
        fillOpacity: 0.08,
      }).addTo(map)
      map.fitBounds(circleRef.current.getBounds(), { padding: [20, 20] })
      setTimeout(() => map.invalidateSize(), 200)
    })()

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      circleRef.current = null
    }
  }, [latitude, longitude, property.title])

  useEffect(() => {
    circleRef.current?.setRadius(radius)
    if (circleRef.current && mapRef.current) mapRef.current.fitBounds(circleRef.current.getBounds(), { padding: [20, 20] })
  }, [radius])

  if (latitude === undefined || longitude === undefined) {
    return <p className="rounded-xl bg-gray-50 p-6 text-gray-500">Localização no mapa indisponível para este imóvel.</p>
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Raio de distância a pé">
        {RADII.map((r) => (
          <button
            key={r.meters}
            type="button"
            onClick={() => setRadius(r.meters)}
            aria-pressed={radius === r.meters}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              radius === r.meters
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div
        ref={el}
        className="h-[380px] w-full overflow-hidden rounded-2xl border border-gray-200"
        role="region"
        aria-label={`Mapa de ${property.title}`}
      />
      <p className="mt-2 text-xs text-gray-500">
        {property.address.street}, {property.address.number} · {property.address.neighborhood}. O círculo mostra a
        distância em linha reta, não o trajeto.
      </p>
    </div>
  )
}
