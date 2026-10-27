'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Bath,
  Bed,
  Calendar,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  Square,
  X,
} from 'lucide-react'
import { Badge, FeatureBadge, StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/ContactForm'
import { PropertyActions } from '@/components/PropertyActions'
import { PropertyCard } from '@/components/PropertyCard'
import { AlertForm } from '@/components/AlertForm'
import { House3DLazy } from '@/components/3d'
import { planForProperty } from '@/components/3d/plans'
import { PHONE_DISPLAY, PHONE_HREF, whatsappLink } from '@/lib/contact'
import { cn, formatCurrency } from '@/lib/utils'
import {
  PROPERTY_FEATURE_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
} from '@/types'

// O mapa (Leaflet) só é baixado quando a aba "Localização" é aberta.
const PropertyMap = dynamic(() => import('@/components/maps/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] animate-pulse rounded-2xl bg-gray-100" aria-hidden="true" />,
})

type TabId = 'sobre' | 'caracteristicas' | 'plantas' | 'local' | 'docs'

const TABS: { id: TabId; label: string }[] = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'caracteristicas', label: 'Características' },
  { id: 'plantas', label: 'Planta e 3D' },
  { id: 'local', label: 'Localização' },
  { id: 'docs', label: 'Documentação' },
]

const DOCS = [
  'Matrícula atualizada do imóvel',
  'Certidões negativas de débitos (IPTU e condomínio)',
  'Certidões pessoais do vendedor',
  'Habite-se e regularização da construção',
  'Conferência de ônus, penhoras e restrições',
]

interface Props {
  property: Property
  similarProperties: Property[]
}

export function PropertyDetailClient({ property, similarProperties }: Props) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [tab, setTab] = useState<TabId>('sobre')
  const [showContact, setShowContact] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const planId = planForProperty(property.id)
  const tabs = TABS.filter((t) => t.id !== 'plantas' || planId)

  const images = property.images
  const total = images.length
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  const statusKey = property.status === 'sale' ? 'sale' : 'rent'
  const perSqm = Math.round(property.price / property.area)
  const monthly = property.status === 'rent' ? property.price + (property.condoFee ?? 0) + (property.iptu ?? 0) : null
  const waMessage = `Olá! Tenho interesse no imóvel "${property.title}" (${property.address.neighborhood}).`

  // abre a aba pedida pela URL (#planta, #local...)
  useEffect(() => {
    const map: Record<string, TabId> = { '#planta': 'plantas', '#3d': 'plantas', '#local': 'local', '#docs': 'docs' }
    const t = map[window.location.hash]
    if (t) setTab(t)
  }, [])

  // navegação do lightbox pelo teclado
  useEffect(() => {
    if (!lightbox) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox, next, prev])

  const goTab = (t: TabId) => {
    setTab(t)
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onTabKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === tab)
    if (e.key === 'ArrowRight') setTab(tabs[(i + 1) % tabs.length].id)
    if (e.key === 'ArrowLeft') setTab(tabs[(i - 1 + tabs.length) % tabs.length].id)
  }

  const specs = [
    { icon: Square, label: 'Área', value: `${property.area} m²` },
    property.bedrooms > 0 && { icon: Bed, label: 'Quartos', value: property.bedrooms },
    property.bathrooms > 0 && { icon: Bath, label: 'Banheiros', value: property.bathrooms },
    property.parkingSpaces > 0 && { icon: Car, label: 'Vagas', value: property.parkingSpaces },
  ].filter(Boolean) as { icon: typeof Square; label: string; value: string | number }[]

  return (
    <div className="pb-24 lg:pb-0">
      <Link
        href="/properties"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar aos imóveis
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        {/* ---------- Coluna principal ---------- */}
        <div className="min-w-0 space-y-8">
          {/* Galeria */}
          <section aria-label="Galeria de fotos">
            <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-gray-100">
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="absolute inset-0 z-[1] cursor-zoom-in focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary-400"
                aria-label="Ampliar foto"
              />
              <Image
                src={images[index]}
                alt={`${property.title} - foto ${index + 1} de ${total}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute left-4 top-4 z-[2] flex flex-col gap-2">
                <StatusBadge status={statusKey} size="md" />
                <Badge variant="outline" size="md" className="bg-white/90 backdrop-blur-sm">
                  {PROPERTY_TYPE_LABELS[property.type]}
                </Badge>
                {property.featured && (
                  <Badge variant="gold" size="md" dot>
                    Destaque
                  </Badge>
                )}
              </div>
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-[62%] z-[2] grid h-11 w-11 -translate-y-1/2 sm:top-1/2 place-items-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Próxima foto"
                    className="absolute right-3 top-[62%] z-[2] grid h-11 w-11 -translate-y-1/2 sm:top-1/2 place-items-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-4 z-[2] flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" />
                  {index + 1} / {total} fotos
                </span>
                {planId && (
                  <button
                    type="button"
                    onClick={() => goTab('plantas')}
                    className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-gold-foreground shadow transition-transform hover:scale-105"
                  >
                    Ver planta 3D
                  </button>
                )}
              </div>
            </div>

            {total > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      'relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                      i === index ? 'border-primary-600' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                  >
                    <Image src={img} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Título e números principais */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">{property.title}</h2>
            <p className="mt-2 flex items-start gap-2 text-gray-600">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>
                {property.address.street}, {property.address.number} - {property.address.neighborhood},{' '}
                {property.address.city} - {property.address.state}
              </span>
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-100 text-primary-700">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs text-gray-500">{s.label}</dt>
                    <dd className="text-lg font-bold text-gray-900">{s.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* Abas */}
          <section ref={tabsRef} className="scroll-mt-24" aria-label="Detalhes do imóvel">
            <div
              role="tablist"
              aria-label="Seções do imóvel"
              onKeyDown={onTabKey}
              className="flex gap-1 overflow-x-auto border-b border-gray-200"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    '-mb-px flex-shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                    tab === t.id
                      ? 'border-gold text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pt-6" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
              {tab === 'sobre' && (
                <div className="space-y-8">
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">{property.description}</p>

                  {property.features.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-display text-xl font-bold text-gray-900">Destaques</h3>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {property.features.slice(0, 6).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-gray-700">
                            <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                            {PROPERTY_FEATURE_LABELS[f]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-gray-900">
                      <Calendar className="h-5 w-5 text-primary-600" aria-hidden="true" />
                      Valores
                    </h3>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <Row label={property.status === 'rent' ? 'Aluguel' : 'Preço'} value={formatCurrency(property.price)} />
                      <Row label="Preço por m²" value={`${formatCurrency(perSqm)}/m²`} />
                      {property.condoFee ? <Row label="Condomínio" value={`${formatCurrency(property.condoFee)}/mês`} /> : null}
                      {property.iptu ? <Row label="IPTU" value={`${formatCurrency(property.iptu)}/mês`} /> : null}
                      {monthly ? <Row label="Total mensal estimado" value={formatCurrency(monthly)} strong /> : null}
                    </dl>
                  </div>
                </div>
              )}

              {tab === 'caracteristicas' && (
                <div>
                  {property.features.length === 0 ? (
                    <p className="text-gray-500">Sem comodidades cadastradas.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((f) => (
                        <FeatureBadge key={f} feature={f} variant="outline" size="md" />
                      ))}
                    </div>
                  )}
                  <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Row label="Tipo" value={PROPERTY_TYPE_LABELS[property.type]} />
                    <Row label="Finalidade" value={PROPERTY_STATUS_LABELS[property.status]} />
                    <Row label="Área" value={`${property.area} m²`} />
                    <Row label="CEP" value={property.address.zipCode} />
                  </dl>
                </div>
              )}

              {tab === 'plantas' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Modelo 3D e planta <strong>ilustrativos</strong>, feitos a partir dos dados deste anúncio (área, suítes,
                    vagas e ambientes). Não substituem o projeto arquitetônico oficial: peça a planta ao corretor.
                  </p>
                  {planId && <House3DLazy planId={planId} showListingLink={false} />}
                </div>
              )}

              {tab === 'local' && <PropertyMap property={property} />}

              {tab === 'docs' && (
                <div>
                  <p className="mb-4 flex items-center gap-2 text-gray-700">
                    <FileCheck2 className="h-5 w-5 text-primary-600" aria-hidden="true" />
                    Documentos que conferimos antes de uma negociação:
                  </p>
                  <ul className="space-y-2">
                    {DOCS.map((d) => (
                      <li key={d} className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-gray-700">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-gray-500">
                    A lista é de referência e pode variar conforme o imóvel e o tipo de negócio. Fale com um corretor para
                    o checklist completo.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ---------- Barra lateral ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">{property.status === 'rent' ? 'Aluguel' : 'Valor de venda'}</p>
              <p className="font-display text-4xl font-bold text-gray-900">
                {formatCurrency(property.price)}
                {property.status === 'rent' && <span className="text-base font-normal text-gray-500"> /mês</span>}
              </p>
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(perSqm)} por m²</p>
              {(property.condoFee || property.iptu) && (
                <p className="mt-2 text-sm text-gray-600">
                  {property.condoFee ? `Condomínio ${formatCurrency(property.condoFee)}` : ''}
                  {property.condoFee && property.iptu ? ' · ' : ''}
                  {property.iptu ? `IPTU ${formatCurrency(property.iptu)}` : ''}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Button variant="gold" size="lg" className="w-full" onClick={() => setShowContact(true)}>
                Agendar visita
              </Button>
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-base font-semibold text-white transition-colors hover:bg-[#1ebe5a]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Chamar no WhatsApp
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 text-base font-semibold text-gray-800 transition-colors hover:bg-gray-50"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
            </div>

            <PropertyActions property={property} variant="bar" className="border-t border-gray-100 pt-4" />

            {property.agent && (
              <div className="border-t border-gray-100 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Corretor responsável</p>
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                    {property.agent.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{property.agent.name}</p>
                    <p className="text-xs text-gray-500">CRECI {property.agent.creci}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Alerta e semelhantes */}
      <div className="mt-16 space-y-16">
        {similarProperties.length > 0 && (
          <section>
            <h2 className="mb-8 font-display text-2xl font-bold text-gray-900 lg:text-3xl">Imóveis semelhantes</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} variant="elevated" />
              ))}
            </div>
          </section>
        )}
        <AlertForm defaultNeighborhood={property.address.neighborhood} />
      </div>

      {/* Barra fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-gray-900">{formatCurrency(property.price)}</p>
          <p className="truncate text-xs text-gray-500">{property.title}</p>
        </div>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chamar no WhatsApp"
          className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-[#25D366] text-white"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </a>
        <Button variant="gold" onClick={() => setShowContact(true)}>
          Agendar visita
        </Button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95" role="dialog" aria-modal="true" aria-label="Foto ampliada">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="absolute inset-0 m-4 sm:m-12">
            <Image src={images[index]} alt={`${property.title} - foto ${index + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-7 w-7" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-7 w-7" aria-hidden="true" />
              </button>
            </>
          )}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
            {index + 1} / {total}
          </p>
        </div>
      )}

      {/* Formulário de visita */}
      {showContact && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Agendar visita">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-white p-4">
              <h2 className="font-display text-xl font-bold text-gray-900">Agendar visita</h2>
              <button
                type="button"
                onClick={() => setShowContact(false)}
                aria-label="Fechar formulário"
                className="grid h-10 w-10 place-items-center rounded-xl text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6">
              <ContactForm property={property.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3.5">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className={cn('text-sm text-gray-900', strong ? 'font-bold' : 'font-semibold')}>{value}</dd>
    </div>
  )
}
