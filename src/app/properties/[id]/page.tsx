import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bath, Bed, Car, MapPin, Phone, Mail, Square } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockProperties } from '@/data/mockProperties'
import { getPropertyById } from '@/lib/properties'
import { formatCurrency } from '@/lib/utils'
import { PROPERTY_FEATURE_LABELS, PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '@/types'

export function generateStaticParams() {
  return mockProperties.map((p) => ({ id: p.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const property = getPropertyById(params.id)
  return { title: property ? `${property.title} - Imobiliária Prime` : 'Imóvel não encontrado' }
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const p = getPropertyById(params.id)
  if (!p) notFound()

  const { address } = p
  const stats = [
    { icon: Square, label: 'Área', value: `${p.area} m²` },
    { icon: Bed, label: 'Quartos', value: p.bedrooms },
    { icon: Bath, label: 'Banheiros', value: p.bathrooms },
    { icon: Car, label: 'Vagas', value: p.parkingSpaces },
  ]

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Link href="/properties" className="mb-6 inline-flex items-center gap-2 text-sm text-primary-700 hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar para imóveis
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image src={p.mainImage} alt={p.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
            </div>
            {p.images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {p.images.slice(0, 3).map((img, i) => (
                  <div key={img} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image src={img} alt={`${p.title} - foto ${i + 1}`} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant={p.status === 'sale' ? 'success' : 'warning'}>{PROPERTY_STATUS_LABELS[p.status]}</Badge>
              <Badge variant="outline">{PROPERTY_TYPE_LABELS[p.type]}</Badge>
              {p.featured && <Badge>Destaque</Badge>}
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold text-gray-900">{p.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-gray-600">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {address.street}, {address.number} - {address.neighborhood}, {address.city}/{address.state} - CEP {address.zipCode}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-gray-50 p-4 text-center">
                  <s.icon className="mx-auto h-5 w-5 text-primary-600" aria-hidden="true" />
                  <dd className="mt-1 text-lg font-semibold text-gray-900">{s.value}</dd>
                  <dt className="text-xs text-gray-500">{s.label}</dt>
                </div>
              ))}
            </dl>

            <h2 className="mt-8 text-xl font-bold text-gray-900">Descrição</h2>
            <p className="mt-2 leading-relaxed text-gray-700">{p.description}</p>

            {p.features.length > 0 && (
              <>
                <h2 className="mt-8 text-xl font-bold text-gray-900">Comodidades</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.features.map((f) => (
                    <li key={f}>
                      <Badge variant="secondary" className="px-3 py-1 text-sm">{PROPERTY_FEATURE_LABELS[f]}</Badge>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 p-6 lg:sticky lg:top-24">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(p.price)}
              {p.status === 'rent' && <span className="text-base font-normal text-gray-500"> /mês</span>}
            </p>
            {p.condoFee ? <p className="mt-1 text-sm text-gray-600">Condomínio: {formatCurrency(p.condoFee)}/mês</p> : null}
            {p.iptu ? <p className="text-sm text-gray-600">IPTU: {formatCurrency(p.iptu)}/mês</p> : null}

            <Button className="mt-6 w-full" size="lg" asChild>
              <Link href={`/contact?imovel=${encodeURIComponent(p.title)}`}>Agendar visita</Link>
            </Button>

            {p.agent && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <p className="font-semibold text-gray-900">{p.agent.name}</p>
                <p className="text-xs text-gray-500">CRECI {p.agent.creci}</p>
                <a href={`tel:${p.agent.phone.replace(/\D/g, '')}`} className="mt-3 flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {p.agent.phone}
                </a>
                <a href={`mailto:${p.agent.email}`} className="mt-2 flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {p.agent.email}
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
