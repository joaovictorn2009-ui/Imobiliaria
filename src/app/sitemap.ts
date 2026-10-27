import { MetadataRoute } from 'next'
import { mockProperties } from '@/data/mockProperties'
import { getNeighborhoods } from '@/data/neighborhoods'
import { POSTS } from '@/data/posts'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/properties',
    '/about',
    '/contact',
    '/bairros',
    '/faq',
    '/blog',
    '/login',
    '/register',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const propertyRoutes = mockProperties.map((property) => ({
    url: `${BASE_URL}/properties/${property.id}`,
    lastModified: property.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const neighborhoodRoutes = getNeighborhoods().map((n) => ({
    url: `${BASE_URL}/bairros/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const postRoutes = POSTS.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(`${p.date}T12:00:00`),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...propertyRoutes, ...neighborhoodRoutes, ...postRoutes]
}