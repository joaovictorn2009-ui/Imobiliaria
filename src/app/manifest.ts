import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Imobiliária Prime',
    short_name: 'Prime',
    description: 'Imóveis para venda e aluguel, com planta em 3D e busca no mapa.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0b1d3a',
    theme_color: '#0b1d3a',
    lang: 'pt-BR',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
