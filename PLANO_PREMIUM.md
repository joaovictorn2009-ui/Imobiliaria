# Plano: Imobiliária Prime - Site de Nível Mundial

## Visão Geral
Transformar o site atual (já excelente tecnicamente) em uma referência de mercado imobiliário - design premium, UX impecável, 3D de ponta, conversão máxima.

---

## 1. DESIGN SYSTEM PREMIUM (Prioridade Máxima)

### 1.1 Paleta de Cores Sofisticada
- **Primary**: Deep Navy `#0B1D3A` → `#13345C` (confiança, premium)
- **Accent**: Champagne Gold `#D4A843` → `#E8C98F` (luxo, destaque)
- **Neutral**: Warm grays com undertone azulado
- **Semantic**: Success (emerald), Warning (amber), Error (rose)

### 1.2 Tipografia Distintiva
- **Display**: Playfair Display (já usado) - elegância editorial
- **UI**: Inter (já usado) - legibilidade perfeita
- **Mono**: JetBrains Mono para números/preços

### 1.3 Sistema de Espaçamento & Escala
- Escala 4px base, tokens semânticos (space-xs a space-3xl)
- Container max-width: 1280px (lg), 1440px (xl)

### 1.4 Componentes Base Aprimorados
- Button: variants (primary, secondary, ghost, outline, gold), sizes, loading states
- Card: elevation levels, hover states refinados
- Input: floating labels, validation states, icons
- Badge: variants semânticos + outline + gold

---

## 2. HERO & HOME PAGE - "WOW FACTOR"

### 2.1 Hero Section Reimaginada
- Background: WebGL shader sutil (partículas/gradiente animado) ou vídeo loop silencioso
- Headline animada字 por字 (split text)
- Stats counter com stagger
- CTA primário + secundário com micro-interações
- Scroll indicator inteligente (some após primeira seção)

### 2.2 Seção de Destaque (Featured Properties)
- Carousel 3D estilo cover-flow ou grid masonry
- "Quick view" modal com galeria + 3D mini

### 2.3 Trust Indicators
- Logos de parceiros/certificações (CRECI, Secovi, etc.)
- Depoimentos em carousel auto-play
- Números animados (já tem CountUp)

### 2.4 Neighborhood Guide
- Mapa interativo (Mapbox/Leaflet) com pins de bairros
- Cards de bairro com média de preço, estilo de vida, transporte

### 2.5 Market Insights
- Gráficos de tendência (Recharts) - preço m² por bairro
- "Melhor hora para comprar/alugar" baseado em dados

---

## 3. PROPERTY LISTINGS - EXPERIÊNCIA DE BUSCA SUPERIOR

### 3.1 Layout Híbrido (Mapa + Lista)
- Split view: mapa à esquerda, lista à direita (desktop)
- Mobile: tabs alternando mapa/lista
- Clustering de pins no mapa
- Draw polygon search no mapa

### 3.2 Filtros Avançados (Drawer Mobile + Sidebar Desktop)
- Filtros colapsíveis com contagem de resultados em tempo real
- Range sliders duplos (preço, área) com inputs numéricos
- Multi-select com chips removíveis
- "Mais filtros" expansível: características, ano construção, andar, etc.
- Presets: "Primeira casa", "Investimento", "Alto padrão", "Pet-friendly"

### 3.3 Property Card Premium
- Image: lazy load com blur placeholder (LQIP)
- Badge de status animado
- Hover: revela galeria mini + ações rápidas (favoritar, compartilhar, comparar)
- Skeleton loading state

### 3.4 Sort & View Options
- View: Grid (3/2/1 colunas), Lista, Mapa
- Sort: Relevância, Preço, Área, Mais recentes, Menor preço/m²

### 3.5 URL State & Shareability
- Todos filtros na URL (já implementado parcialmente)
- Botão "Compartilhar busca" → copia link + QR code

---

## 4. PROPERTY DETAIL PAGE - IMERSIVA E CONVERSORA

### 4.1 Gallery Hero
- Full-width image slider com thumbnails
- Zoom on hover (lightbox)
- Indicador de "X fotos" + "Tour 3D" + "Planta"
- Auto-play pause on hover

### 4.2 Sticky Sidebar (Desktop) / Bottom Sheet (Mobile)
- Preço grande + preço/m²
- Condomínio/IPTU breakdown
- CTA principal: "Agendar visita" (scroll to form)
- CTA secundário: "WhatsApp" + "Ligar"
- Agent card com foto, CRECI, avaliações

### 4.3 Tabs de Conteúdo
1. **Sobre**: Descrição rica + highlights (bullet points animados)
2. **Características**: Grid de ícones + descrições
3. **Plantas**: PDF viewer + 3D floor plan (já tem HouseShowcase)
4. **Localização**: Mapa interativo + POIs (mercados, escolas, transporte, lazer) com raio de caminhada
5. **Condomínio**: Fotos áreas comuns, regras, taxas
6. **Documentação**: Checklist (matrícula, IPTU, certidões) - trust signal
7. **Similares**: Carousel de imóveis parecidos

### 4.4 Micro-conversões
- "Salvar imóvel" (heart icon, localStorage → sync future backend)
- "Comparar" (até 3, página de comparação side-by-side)
- "Enviar para amigo" (share API nativa)
- "Alertar queda de preço" (email capture)

### 4.5 Social Proof
- "X pessoas viram nas últimas 24h"
- "Última visita agendada: 2h atrás"
- Depoimentos de moradores do condomínio

---

## 5. 3D EXPERIENCE - NEXT LEVEL

### 5.1 HouseShowcase Aprimorado
- **Materiais PBR reais**: texturas 4K (albedo, normal, roughness, AO, displacement)
- **Iluminação**: HDRI environment + sun positioning por horário
- **Post-processing**: Bloom, tone mapping (ACES), SSAO, vignette
- **Interação**: Click no cômodo → fly-to + highlight + info panel
- **Modos**: Fachada, Planta (2D/3D toggle), Explodida, Corte (section plane), Noturno (lights on/off)
- **Mobile**: Touch controls otimizados, gyroscope opt-in

### 5.2 Virtual Tour (Novo)
- Panorama 360° nodes conectados (hotspots)
- Floor plan minimap com posição atual
- Auto-tour mode
- VR button (WebXR) para headsets

### 5.3 Performance
- Progressive loading: low-poly → high-poly
- Texture streaming por nível de detalhe
- Instanced meshes para móveis repetidos
- GPU frustum culling

---

## 6. LEAD GENERATION & CONVERSÃO

### 6.1 Smart CTAs Contextuais
- Hero: "Buscar imóveis" → /properties
- Property card: "Agendar visita" → contact com prefill
- Property detail: Sticky "Agendar" + WhatsApp float
- Exit intent: "Não vai embora sem ver isto" modal
- Scroll depth: "Gostou? Salve sua busca" newsletter

### 6.2 WhatsApp Integration
- Float button fixo (mobile/desktop)
- Mensagem pré-preenchida por contexto (página, imóvel)
- Múltiplos atendentes (round-robin)

### 6.3 Property Alerts
- Form: "Avise-me quando imóveis em [bairro] < R$ [X] aparecerem"
- Frequência: Imediato, Diário, Semanal
- Unsubscribe one-click

### 6.4 Chat Widget (Intercom/Crisp/Tawk.to ready)
- Proactive messages baseados em comportamento
- FAQ integrado
- Handoff para corretor humano

---

## 7. TRUST & AUTHORITY PAGES

### 7.1 About Page Rica
- Timeline interativa da empresa
- Team grid com fotos, CRECI, especialidade, LinkedIn
- Certificações e premiações
- Valores com ícones animados
- Escritório virtual (3D tour do escritório real)

### 7.2 Testimonials / Reviews
- Carousel com schema.org Review
- Filtro por tipo (venda, aluguel, bairro)
- Video testimonials (YouTube embed)
- Integração Google Reviews API

### 7.3 Blog / Guia do Comprador
- Artigos SEO: "Como financiar", "Documentos para compra", "Bairros em alta"
- Categoria: Mercado, Dicas, Bairros, Financiamento
- Newsletter capture inline
- Author boxes com corretores

### 7.4 Neighborhood Pages (Programmatic SEO)
- /bairros/[slug] - landing page por bairro
- Mapa, stats, imóveis em destaque, guia de vida, escolas, transporte
- Schema.org Place + ItemList

---

## 8. TECHNICAL EXCELLENCE

### 8.1 Performance (Core Web Vitals)
- LCP < 2.0s: Hero image priority, font preload, critical CSS inline
- CLS < 0.1: Aspect ratios em todas images, font-display swap
- INP < 200ms: Code splitting, defer non-critical JS, web workers para filtros
- Image optimization: next/image com AVIF/WebP, sizes otimizados, blur placeholders

### 8.2 Bundle Optimization
- Dynamic imports para 3D (já feito), charts, mapas
- Tree shaking: lucide-react individual imports
- Analyze bundle: @next/bundle-analyzer

### 8.3 PWA Features
- Manifest.json + service worker (workbox)
- Offline: cache shell + última busca
- Install prompt
- Push notifications para alertas de preço

### 8.4 Analytics & Monitoring
- Vercel Analytics + Speed Insights
- GA4 enhanced ecommerce (view_item, select_item, begin_checkout=agendar)
- Custom events: 3d_interaction, filter_use, save_property, share_property
- Error tracking: Sentry

### 8.5 Accessibility (WCAG 2.1 AA)
- Audit completo com axe-core
- Focus visible em TODOS elementos
- Skip links
- ARIA live regions para filtros
- Contraste verificado em todos temas
- Teste com NVDA/VoiceOver

---

## 9. ADMIN/CMS READY (Future-proof)

### 9.1 Content Layer
- MDX para blog + páginas institucionais
- Schema validation com Zod
- Type-safe content fetching

### 9.2 Property Management (Mock → Real)
- Interface única: mockProperties.ts → Prisma/PostgreSQL
- Admin routes protegidas (/admin/*)
- Image upload → Vercel Blob / Cloudinary

### 9.3 i18n Ready
- next-intl structure
- pt-BR, en-US, es-ES

---

## 10. IMPLEMENTAÇÃO - FASES

### Fase 1: Design System + Home (Semana 1)
- [ ] Nova paleta, tokens CSS, componentes base
- [ ] Hero reimaginado + WebGL background
- [ ] PropertyCard premium
- [ ] Header/Footer refinados

### Fase 2: Listings + Detail (Semana 2)
- [ ] Mapa + Lista split view
- [ ] Filtros avançados com URL state
- [ ] Property detail tabs + mapa POIs
- [ ] Comparison page

### Fase 3: 3D Excellence (Semana 3)
- [ ] PBR materials + HDRI
- [ ] Post-processing pipeline
- [ ] Virtual tour 360°
- [ ] Performance optimization

### Fase 4: Conversion & Trust (Semana 4)
- [ ] WhatsApp float + smart CTAs
- [ ] Property alerts
- [ ] Testimonials + team page
- [ ] Blog/guides structure

### Fase 5: Polish & Launch (Semana 5)
- [ ] PWA + Analytics
- [ ] Accessibility audit
- [ ] Performance budget
- [ ] Vercel deploy + preview environments

---

## MÉTRICAS DE SUCESSO

| Métrica | Atual | Meta |
|---------|-------|------|
| LCP | ~2.5s | < 1.8s |
| CLS | ~0.05 | < 0.05 |
| INP | ~150ms | < 100ms |
| Conversion Rate (contato) | ~1% | > 3% |
| 3D Interaction Rate | ~15% | > 40% |
| Avg Session Duration | ~2min | > 5min |
| Pages/Session | ~3 | > 6 |
| Mobile Score (Lighthouse) | ~85 | > 95 |

---

## STACK DECISIONS

| Área | Escolha | Justificativa |
|------|---------|---------------|
| Styling | Tailwind + CSS Variables | Já usado, design tokens nativos |
| 3D | R3F + Drei + Postprocessing | Já implementado, ecossistema maduro |
| Maps | Mapbox GL JS | Melhor DX, clustering nativo, 3D buildings |
| Charts | Recharts | React-native, SSR-friendly, tree-shakeable |
| Forms | React Hook Form + Zod | Já usado, performático |
| Animations | Framer Motion (seletivo) + CSS | CSS para scroll, FM para complexos |
| Icons | Lucide (já) + custom SVG | Consistência |
| Dates | date-fns | Leve, modular |
| Validation | Zod (já) | Type-safe |
| CMS | Contentlayer / MDX | Type-safe, Git-based |
| DB (futuro) | Prisma + PostgreSQL (Neon/Vercel) | Type-safe, serverless-ready |
| Auth (futuro) | NextAuth v5 / Clerk | Enterprise-ready |
| Email | Resend (já preparado) | Developer experience |
| Search (futuro) | Meilisearch / Algolia | Typo-tolerance, filters |