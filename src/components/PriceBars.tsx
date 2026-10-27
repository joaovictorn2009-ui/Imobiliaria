import Link from 'next/link'
import { getNeighborhoods } from '@/data/neighborhoods'
import { formatCurrency } from '@/lib/utils'

/** Barras com o preço médio do m² (venda) por bairro, calculado a partir dos imóveis do site. */
export function PriceBars() {
  const rows = getNeighborhoods()
    .filter((n) => n.avgSqmSale !== null)
    .sort((a, b) => (b.avgSqmSale as number) - (a.avgSqmSale as number))
  const max = Math.max(...rows.map((r) => r.avgSqmSale as number), 1)

  return (
    <figure>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.slug}>
            <Link href={`/bairros/${r.slug}`} className="group block">
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-gray-800 group-hover:text-primary-600">
                  {r.name} <span className="text-gray-400">· {r.city}</span>
                </span>
                <span className="font-semibold tabular-nums text-gray-900">{formatCurrency(r.avgSqmSale as number)}/m²</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-gold transition-all duration-700 group-hover:brightness-110"
                  style={{ width: `${Math.max(6, ((r.avgSqmSale as number) / max) * 100)}%` }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 text-xs text-gray-500">
        Média do preço por m² dos imóveis à venda anunciados no site, por bairro. É um retrato dos nossos anúncios, não
        um índice oficial de mercado.
      </figcaption>
    </figure>
  )
}
