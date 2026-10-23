'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Car, Square } from 'lucide-react'
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PROPERTY_FEATURE_LABELS } from '@/types'

interface PropertyCardProps {
  property: Property
  priority?: boolean
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const statusColor = property.status === 'sale' ? 'success' : 'warning'
  const statusLabel = PROPERTY_STATUS_LABELS[property.status]
  const typeLabel = PROPERTY_TYPE_LABELS[property.type]

  return (
    <article className="group relative">
      <Link href={`/properties/${property.id}`} className="block">
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={property.mainImage}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge variant={statusColor} className="text-xs px-2 py-1">
                {statusLabel}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm">
                {typeLabel}
              </Badge>
            </div>
            {property.featured && (
              <div className="absolute top-3 right-3">
                <Badge variant="default" className="text-xs px-2 py-1">
                  Destaque
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4 pb-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500 truncate mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {property.address.neighborhood}, {property.address.city} - {property.address.state}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{property.area}m²</span>
              </div>
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.parkingSpaces > 0 && (
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>{property.parkingSpaces}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {property.features.slice(0, 4).map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs px-2 py-0.5">
                  {PROPERTY_FEATURE_LABELS[feature]}
                </Badge>
              ))}
              {property.features.length > 4 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-500">
                  +{property.features.length - 4}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(property.price)}
                </p>
                {property.status === 'rent' && (
                  <p className="text-xs text-gray-500">/mês</p>
                )}
                {(property.condoFee || property.iptu) && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {property.condoFee ? `Cond: ${formatCurrency(property.condoFee)}/mês` : ''}
                    {property.condoFee && property.iptu ? ' • ' : ''}
                    {property.iptu ? `IPTU: ${formatCurrency(property.iptu)}/mês` : ''}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </article>
  )
}