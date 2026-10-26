import { MetadataRoute } from 'next'
import { mockProperties } from '@/data/mockProperties'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/properties',
    '/about',
    '/contact',
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

  return [...staticRoutes, ...propertyRoutes]
}