// Service worker simples: abre offline e acelera arquivos estáticos.
// Para publicar uma versão nova do cache, troque o número de VERSION.
const VERSION = 'v1'
const STATIC_CACHE = `prime-static-${VERSION}`
const PAGES_CACHE = `prime-pages-${VERSION}`

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES_CACHE).then((c) => c.add('/offline')).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![STATIC_CACHE, PAGES_CACHE].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_vercel/')) return

  // Páginas: rede primeiro; se estiver offline, usa a última cópia ou a página /offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(PAGES_CACHE).then((c) => c.put(req, copy))
          return res
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/offline')))
    )
    return
  }

  // Arquivos estáticos (JS, CSS, fontes, ícones, imagens): usa o cache e atualiza em segundo plano
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(req)
        const fresh = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone())
            return res
          })
          .catch(() => hit)
        return hit || fresh
      })
    )
  }
})
