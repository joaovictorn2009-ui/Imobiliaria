'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge, StatusBadge, FeatureBadge } from '@/components/ui/badge'
import { Input, Textarea } from '@/components/ui/input'
import { ContactForm } from '@/components/ContactForm'
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Square,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Mail,
  Clock,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { PROPERTY_TYPE_LABELS, PROPERTY_FEATURE_LABELS, PROPERTY_STATUS_LABELS } from '@/types'
import { cn } from '@/lib/utils'

interface PropertyDetailClientProps {
  property: Property
  similarProperties: Property[]
}

export function PropertyDetailClient({ property, similarProperties }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  const statusLabel = property.status === 'sale' ? 'sale' : 'rent'
  const typeLabel = PROPERTY_TYPE_LABELS[property.type]

  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num)

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Back link */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Voltar aos imóveis
      </Link>

      {/* Image Gallery */}
      <section aria-label="Galeria de imagens do imóvel">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Imagem ${currentImageIndex + 1} de ${property.images.length}`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
            sizes="100vw"
          />

          {/* Navigation arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Image counter */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === currentImageIndex}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-200',
                    i === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white'
                  )}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <StatusBadge status={statusLabel} size="md" />
            <Badge variant="outline" size="md" className="bg-white/90 backdrop-blur-sm">
              {typeLabel}
            </Badge>
            {property.featured && (
              <Badge variant="gold" size="md" dot>Destaque</Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-error hover:bg-error/10 transition-all duration-200 shadow-lg"
              aria-label={`Salvar ${property.title}`}
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-primary hover:bg-primary/10 transition-all duration-200 shadow-lg"
              aria-label={`Compartilhar ${property.title}`}
            >
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Thumbnail strip */}
        {property.images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                aria-label={`Ver imagem ${i + 1}`}
                aria-current={i === currentImageIndex}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200',
                  i === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                )}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Property Info */}
      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={statusLabel} size="lg" />
              <Badge variant="outline" size="md">{typeLabel}</Badge>
              {property.featured && <Badge variant="gold" size="md" dot>Destaque</Badge>}
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span>
                {property.address.street}, {property.address.number} - {property.address.neighborhood},{' '}
                {property.address.city} - {property.address.state}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-4 sm:ml-auto">
            <div className="text-3xl lg:text-4xl font-bold text-gray-900">{formatCurrency(property.price)}</div>
            {property.status === 'rent' && <span className="text-gray-500">/mês</span>}
          </div>
        </div>

        {/* Key specs */}
        <div className="flex flex-wrap gap-4 lg:gap-6 border-y border-gray-200 py-6">
          <div className="flex items-center gap-3 flex-1 min-w-[140px]">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
              <Square className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Área total</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(property.area)} m²</p>
            </div>
          </div>
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-3 flex-1 min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <Bed className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quartos</p>
                <p className="text-xl font-bold text-gray-900">{property.bedrooms}</p>
              </div>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-3 flex-1 min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <Bath className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Banheiros</p>
                <p className="text-xl font-bold text-gray-900">{property.bathrooms}</p>
              </div>
            </div>
          )}
          {property.parkingSpaces > 0 && (
            <div className="flex items-center gap-3 flex-1 min-w-[140px]">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <Car className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vagas</p>
                <p className="text-xl font-bold text-gray-900">{property.parkingSpaces}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-gray max-w-none">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Descrição</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>

        {/* Features */}
        {property.features.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Comodidades</h2>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <FeatureBadge key={feature} feature={feature} variant="outline" size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Financial details */}
        {(property.condoFee || property.iptu) && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" aria-hidden="true" />
              Custos mensais
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.condoFee && (
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                  <dt className="text-gray-600 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary-600" aria-hidden="true" />
                    </div>
                    Condomínio
                  </dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(property.condoFee)}/mês</dd>
                </div>
              )}
              {property.iptu && (
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                  <dt className="text-gray-600 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary-600" aria-hidden="true" />
                    </div>
                    IPTU
                  </dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(property.iptu)}/mês</dd>
                </div>
              )}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 sm:col-span-2">
                <dt className="text-gray-600 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Square className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  </div>
                  Preço por m²
                </dt>
                <dd className="font-semibold text-gray-900">{formatCurrency(Math.round(property.price / property.area))}/m²</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Agent info */}
        {property.agent && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-primary-600" aria-hidden="true" />
              Corretor responsável
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  {property.agent.avatar ? (
                    <Image src={property.agent.avatar} alt={property.agent.name} fill className="rounded-full" />
                  ) : (
                    property.agent.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{property.agent.name}</p>
                  <p className="text-sm text-gray-500">CRECI: {property.agent.creci}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {property.agent.phone}
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {property.agent.email}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 lg:p-12 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl lg:text-3xl font-bold mb-3">Gostou deste imóvel?</h2>
            <p className="text-primary-100 mb-6 max-w-lg mx-auto">
              Agende uma visita sem compromisso ou tire suas dúvidas com nossos especialistas. Estamos prontos para te ajudar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gold"
                size="lg"
                className="w-full sm:w-auto min-w-[200px]"
                onClick={() => setShowContactForm(true)}
              >
                Agendar visita
              </Button>
              <a
                href={`tel:+551130000000`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                (11) 3000-0000
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mb-8">Imóveis semelhantes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similarProperties.map((prop, i) => (
              <Link key={prop.id} href={`/properties/${prop.id}`} className="group">
                <Card className="overflow-hidden h-full hover:shadow-elevation-3 transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={prop.mainImage}
                      alt={prop.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <StatusBadge status={prop.status === 'sale' ? 'sale' : 'rent'} size="sm" />
                      <Badge variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
                        {PROPERTY_TYPE_LABELS[prop.type]}
                      </Badge>
                    </div>
                    {prop.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="gold" size="sm" dot>Destaque</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 pb-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                      {prop.address.neighborhood}, {prop.address.city}
                    </p>
                    <dl className="flex items-center justify-between text-sm text-gray-600 mt-4">
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" aria-hidden="true" />
                        <span>{prop.area}m²</span>
                      </div>
                      {prop.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" aria-hidden="true" />
                          <span>{prop.bedrooms}</span>
                        </div>
                      )}
                      {prop.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" aria-hidden="true" />
                          <span>{prop.bathrooms}</span>
                        </div>
                      )}
                      {prop.parkingSpaces > 0 && (
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4" aria-hidden="true" />
                          <span>{prop.parkingSpaces}</span>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(prop.price)}</p>
                        {prop.status === 'rent' && <p className="text-xs text-gray-500">/mês</p>}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contact Form Modal/Section */}
      {showContactForm && (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="font-display text-xl font-bold text-gray-900">Entre em contato</h2>
              <button
                onClick={() => setShowContactForm(false)}
                className="w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center justify-center"
                aria-label="Fechar formulário"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ContactForm property={property.title} />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}