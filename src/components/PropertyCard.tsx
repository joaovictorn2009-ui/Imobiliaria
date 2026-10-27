'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardElevated } from '@/components/ui/card'
import { Badge, StatusBadge, FeatureBadge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Car, Square, ArrowRight } from 'lucide-react'
import { PropertyActions } from '@/components/PropertyActions'
import { PROPERTY_TYPE_LABELS, PROPERTY_FEATURE_LABELS } from '@/types'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  priority?: boolean
  variant?: 'default' | 'elevated' | 'featured'
}

export function PropertyCard({ property, priority = false, variant = 'default' }: PropertyCardProps) {
  const CardComponent = variant === 'elevated' ? CardElevated : Card
  const statusLabel = property.status === 'sale' ? 'sale' : 'rent'
  const typeLabel = PROPERTY_TYPE_LABELS[property.type]

  return (
    <article className="group relative">
      <CardComponent className="overflow-hidden h-full transition-all duration-300 hover:shadow-elevation-3 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link
            href={`/properties/${property.id}`}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`Ver detalhes de ${property.title}`}
          >
            <Image
              src={property.mainImage}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          </Link>
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <StatusBadge status={statusLabel} size="sm" />
            <Badge variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
              {typeLabel}
            </Badge>
            {property.featured && (
              <Badge variant="gold" size="sm" dot>
                Destaque
              </Badge>
            )}
          </div>

          {/* Ações rápidas: sempre visíveis no toque, no hover no desktop */}
          <PropertyActions
            property={property}
            className="absolute right-3 top-3 md:translate-x-2 md:opacity-0 md:transition-all md:duration-300 md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-focus-within:translate-x-0 md:group-focus-within:opacity-100"
          />
        </div>

        <CardContent className="p-4 pb-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <Link
                href={`/properties/${property.id}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors line-clamp-1">
                  {property.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 truncate mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                {property.address.neighborhood}, {property.address.city} - {property.address.state}
              </p>
            </div>
          </div>

          <dl className="flex items-center justify-between text-sm text-gray-600 mb-4" role="list">
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" aria-hidden="true" />
              <span>{property.area}m²</span>
            </div>
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" aria-hidden="true" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" aria-hidden="true" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.parkingSpaces > 0 && (
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4" aria-hidden="true" />
                <span>{property.parkingSpaces}</span>
              </div>
            )}
          </dl>

          <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="Comodidades">
            {property.features.slice(0, 4).map((feature) => (
              <FeatureBadge key={feature} feature={feature} variant="secondary" size="sm" />
            ))}
            {property.features.length > 4 && (
              <Badge variant="outline" size="sm" className="text-gray-500">
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
              {/* Price per m² */}
              {property.area > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatCurrency(Math.round(property.price / property.area))}/m²
                </p>
              )}
            </div>
            <Link
              href={`/properties/${property.id}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group-hover:scale-105"
              aria-label={`Ver detalhes de ${property.title}`}
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </CardFooter>
      </CardComponent>
    </article>
  )
}