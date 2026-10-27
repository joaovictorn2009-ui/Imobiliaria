'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Property } from '@/types'
import { formatCurrency } from '@/lib/utils'

const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const short = (n: number) =>
  n >= 1_000_000
    ? `R$ ${(n / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mi`
    : `R$ ${Math.round(n / 1000)} mil`

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

/** Mapa com um pino de preço para cada imóvel. O Leaflet só é baixado quando o mapa é aberto. */
export default function ListingsMap({ properties }: { properties: Property[] }) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: import('leaflet').Map | null = null
    let cancelled = false

    ;(async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !el.current) return

      map = L.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView([-23.55, -46.65], 10)
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 18 }).addTo(map)

      const points: [number, number][] = []
      properties.forEach((p) => {
        const { latitude, longitude } = p.address
        if (latitude === undefined || longitude === undefined) return
        points.push([latitude, longitude])
        const icon = L.divIcon({
          className: '',
          html: `<div class="price-pin">${short(p.price)}${p.status === 'rent' ? '/mês' : ''}</div>`,
          iconSize: [0, 0],
        })
        L.marker([latitude, longitude], { icon, title: p.title })
          .addTo(map as import('leaflet').Map)
          .bindPopup(
            `<strong>${esc(p.title)}</strong><br/>${esc(p.address.neighborhood)}<br/>` +
              `<span>${esc(formatCurrency(p.price))}</span><br/>` +
              `<a href="/properties/${esc(p.id)}" style="color:#2a5499;font-weight:600">Ver detalhes</a>`
          )
      })

      if (points.length) map.fitBounds(points, { padding: [40, 40], maxZoom: 13 })
      // o contêiner pode ter sido medido antes de aparecer: recalcula o tamanho
      setTimeout(() => map?.invalidateSize(), 200)
    })()

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [properties])

  return <div ref={el} className="h-[520px] w-full overflow-hidden rounded-2xl border border-gray-200" role="region" aria-label="Mapa dos imóveis" />
}
