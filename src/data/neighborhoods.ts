import { mockProperties } from '@/data/mockProperties'
import type { Property } from '@/types'

export interface Neighborhood {
  slug: string
  name: string
  city: string
  state: string
  intro: string
  lifestyle: string
  mobility: string
  tags: string[]
  lat: number
  lng: number
  properties: Property[]
  /** média do preço por m² dos imóveis à venda (null se não houver venda) */
  avgSqmSale: number | null
  minPrice: number
  maxPrice: number
}

// Textos de apoio, de caráter geral. Revise com a equipe antes de usar como material oficial.
const COPY: Record<string, Pick<Neighborhood, 'intro' | 'lifestyle' | 'mobility' | 'tags'>> = {
  jardins: {
    intro: 'Região tradicional e arborizada de São Paulo, muito procurada por quem quer morar perto de tudo.',
    lifestyle: 'Restaurantes, lojas e cafés a poucos passos, com ruas tranquilas e boa parte do comércio a pé.',
    mobility: 'Fácil acesso à Avenida Paulista e a estações de metrô.',
    tags: ['Gastronomia', 'Comércio de rua', 'Arborizado'],
  },
  alphaville: {
    intro: 'Bairro planejado em Barueri, formado por condomínios fechados e grandes empresas.',
    lifestyle: 'Casas amplas, áreas de lazer nos condomínios e shoppings por perto.',
    mobility: 'Acesso por rodovias para a capital; o carro é o meio de transporte mais comum.',
    tags: ['Condomínios', 'Segurança', 'Casas amplas'],
  },
  'riviera-de-sao-lourenco': {
    intro: 'Bairro planejado no litoral de Bertioga, com praia, marina e muito verde.',
    lifestyle: 'Rotina voltada ao lazer ao ar livre, esportes náuticos e descanso.',
    mobility: 'Chega-se de carro pela Rio–Santos e pelas rodovias da Baixada Santista.',
    tags: ['Praia', 'Lazer', 'Terrenos'],
  },
  'itaim-bibi': {
    intro: 'Um dos principais polos de negócios de São Paulo, ao redor da Avenida Brigadeiro Faria Lima.',
    lifestyle: 'Muitos escritórios, bons restaurantes e serviços para quem trabalha e mora na região.',
    mobility: 'Bem servido por corredores de ônibus e metrô nos arredores.',
    tags: ['Escritórios', 'Negócios', 'Restaurantes'],
  },
  'vila-madalena': {
    intro: 'Bairro conhecido pela vida cultural, pelos bares e pela arte de rua.',
    lifestyle: 'Agitado à noite, com ateliês, galerias, feiras e muitos cafés.',
    mobility: 'Compacto e bom para andar a pé; metrô a uma curta distância.',
    tags: ['Cultura', 'Vida noturna', 'Arte de rua'],
  },
  moema: {
    intro: 'Bairro residencial tradicional da zona sul de São Paulo, vizinho ao Parque Ibirapuera.',
    lifestyle: 'Ruas com muitos prédios residenciais, comércio de bairro e parques para esporte e lazer.',
    mobility: 'Atendido por metrô e por grandes avenidas.',
    tags: ['Residencial', 'Parques', 'Família'],
  },
  'granja-viana': {
    intro: 'Região residencial e arborizada de Cotia, com muitos condomínios horizontais.',
    lifestyle: 'Mais espaço verde e tranquilidade, com comércio concentrado ao longo da Raposo Tavares.',
    mobility: 'Acesso à capital pela Rodovia Raposo Tavares; o carro costuma ser necessário.',
    tags: ['Condomínios', 'Verde', 'Tranquilidade'],
  },
  pinheiros: {
    intro: 'Bairro central da zona oeste de São Paulo, com cenário gastronômico e cultural movimentado.',
    lifestyle: 'Bares, restaurantes, feiras e comércio variado, com muita gente jovem.',
    mobility: 'Boa oferta de metrô, trem e ônibus, além de ciclovias.',
    tags: ['Gastronomia', 'Transporte', 'Vida urbana'],
  },
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export function getNeighborhoods(): Neighborhood[] {
  const groups = new Map<string, Property[]>()
  for (const p of mockProperties) {
    const slug = slugify(p.address.neighborhood)
    groups.set(slug, [...(groups.get(slug) ?? []), p])
  }

  return Array.from(groups.entries()).map(([slug, props]) => {
    const first = props[0]
    const copy = COPY[slug] ?? {
      intro: `Imóveis em ${first.address.neighborhood}, ${first.address.city}.`,
      lifestyle: 'Fale com um corretor para conhecer o dia a dia da região.',
      mobility: 'Consulte as opções de transporte com nossa equipe.',
      tags: [],
    }
    const sale = props.filter((p) => p.status === 'sale' && p.area > 0)
    const lats = props.map((p) => p.address.latitude).filter((n): n is number => typeof n === 'number')
    const lngs = props.map((p) => p.address.longitude).filter((n): n is number => typeof n === 'number')
    const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / (a.length || 1)
    return {
      slug,
      name: first.address.neighborhood,
      city: first.address.city,
      state: first.address.state,
      ...copy,
      lat: avg(lats),
      lng: avg(lngs),
      properties: props,
      avgSqmSale: sale.length ? Math.round(avg(sale.map((p) => p.price / p.area))) : null,
      minPrice: Math.min(...props.map((p) => p.price)),
      maxPrice: Math.max(...props.map((p) => p.price)),
    }
  })
}

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return getNeighborhoods().find((n) => n.slug === slug)
}
