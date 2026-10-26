import { mockProperties } from '@/data/mockProperties'
import type { Property } from '@/types'

export function listingSchema(properties: Property[]) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: p.title,
        url: `${BASE_URL}/properties/${p.id}`,
        image: p.mainImage,
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'BRL',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: p.address.city,
          addressRegion: p.address.state,
          addressCountry: 'BR',
        },
      },
    })),
  }
}

export function propertySchema(property: Property) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imobiliariaprime.com.br'
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    image: property.images,
    url: `${BASE_URL}/properties/${property.id}`,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'BRL',
      availability: property.status === 'sale' ? 'https://schema.org/ForSale' : 'https://schema.org/ForLease',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${property.address.street}, ${property.address.number}`,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.zipCode,
      addressCountry: 'BR',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'MTK',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
  }
}