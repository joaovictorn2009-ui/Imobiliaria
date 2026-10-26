import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { PropertyDetailClient } from './PropertyDetailClient'
import { getPropertyById, getSimilarProperties } from '@/lib/properties'
import { propertySchema } from '@/lib/schemas'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = getPropertyById(id)

  if (!property) {
    return { title: 'Imóvel não encontrado - Imobiliária Prime' }
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'

  return {
    title: property.title + ' - Imobiliária Prime',
    description: property.description.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.substring(0, 160),
      images: property.images.map((img) => ({ url: img, width: 800, height: 600 })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: property.description.substring(0, 160),
      images: property.images[0],
    },
    other: {
      'property:id': property.id,
      'property:price': property.price.toString(),
      'property:price:currency': 'BRL',
      'property:type': property.type,
      'property:status': property.status,
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const property = getPropertyById(id)

  if (!property) {
    notFound()
  }

  const similarProperties = getSimilarProperties(property, 4)
  const schema = propertySchema(property)

  return (
    <PageShell
      title={property.title}
      subtitle={`${property.address.neighborhood}, ${property.address.city} - ${property.address.state}`}
      className="pb-0"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PropertyDetailClient
        property={property}
        similarProperties={similarProperties}
      />
    </PageShell>
  )
}