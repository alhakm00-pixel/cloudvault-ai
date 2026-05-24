// ─── CloudVault AI — Service Worker v2 ───────────────────────────────────────
const APP_VERSION    = 'v2.0.0'
const STATIC_CACHE   = `cv-static-${APP_VERSION}`
const DYNAMIC_CACHE  = `cv-dynamic-${APP_VERSION}`
const VIDEO_CACHE    = `cv-videos-${APP_VERSION}`
const API_CACHE      = `cv-api-${APP_VERSION}`

const MAX_DYNAMIC_ITEMS = 60
const MAX_VIDEO_BYTES   = 2 * 1024 * 1024 * 1024  // 2 GB video cache

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/dashboard',
  '/files',
  '/player',
  '/settings',
  '/offline',
  '/manifest.json',
]

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => ![STATIC_CACHE, DYNAMIC_CACHE, VIDEO_CACHE, API_CACHE].includes(k))
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ─── Fetch strategy ───────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Skip non-GET
  if (request.method !== 'GET') return

  // ── Video/audio streaming: cache-then-network with range support ──────────
  if (isMediaRequest(url, request)) {
    e.respondWith(handleMediaFetch(request))
    return
  }

  // ── API calls: network-first, fall back to cache ──────────────────────────
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(networkFirst(request, API_CACHE, 5000))
    return
  }

  // ── Static assets: cache-first ────────────────────────────────────────────
  if (isStaticAsset(url)) {
    e.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // ── App shell (navigation): stale-while-revalidate ───────────────────────
  if (request.mode === 'navigate') {
    e.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
    return
  }

  // ── Default: dynamic cache ────────────────────────────────────────────────
  e.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
})

// ─── Media streaming with partial content support ────────────────────────────
async function handleMediaFetch(request) {
  const cache      = await caches.open(VIDEO_CACHE)
  const rangeHeader = request.headers.get('Range')

  // If range request and cached, serve from cache
  if (rangeHeader) {
    const cached = await cache.match(request.url)
    if (cached) {
      const body       = await cached.arrayBuffer()
      const totalSize  = body.byteLength
      const range      = parseRange(rangeHeader, totalSize)
      if (range) {
        const slice = body.slice(range.start, range.end + 1)
        return new Response(slice, {
          status: 206,
          headers: {
            'Content-Type':  cached.headers.get('Content-Type') || 'video/mp4',
            'Content-Range': `bytes ${range.start}-${range.end}/${totalSize}`,
            'Content-Length': String(slice.byteLength),
            'Accept-Ranges': 'bytes',
          },
        })
      }
    }
  }

  // Fetch from network
  try {
    const response = await fetch(request)
    if (response.ok && !rangeHeader) {
      // Cache full response (no range)
      const cloned = response.clone()
      cache.put(request.url, cloned).catch(() => {})
      trimCache(VIDEO_CACHE, 20).catch(() => {})
    }
    return response
  } catch {
    return new Response('Video not available offline', { status: 503 })
  }
}

// ─── Cache strategies ─────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return offlineFallback(request)
  }
}

async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName)
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    const response = await fetch(request, { signal: controller.signal })
    clearTimeout(timer)
    if (response.ok) cache.put(request, response.clone()).catch(() => {})
    return response
  } catch {
    const cached = await cache.match(request)
    return cached || offlineFallback(request)
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName)
  const cached = await cache.match(request)

  const networkFetch = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone()).catch(() => {})
        trimCache(cacheName, MAX_DYNAMIC_ITEMS).catch(() => {})
      }
      return response
    })
    .catch(() => null)

  return cached || await networkFetch || offlineFallback(request)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isMediaRequest(url, request) {
  const ext = url.pathname.split('.').pop()?.toLowerCase()
  return ['mp4','webm','mkv','mp3','wav','ogg','m4v','avi'].includes(ext) ||
    url.pathname.includes('/stream') ||
    (request.headers.get('Accept') || '').includes('video')
}

function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf)$/.test(url.pathname)
}

function parseRange(rangeHeader, totalSize) {
  const m = rangeHeader.match(/bytes=(\d+)-(\d*)/)
  if (!m) return null
  const start = parseInt(m[1])
  const end   = m[2] ? parseInt(m[2]) : Math.min(start + 1024 * 1024 - 1, totalSize - 1)
  if (start >= totalSize) return null
  return { start, end: Math.min(end, totalSize - 1) }
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const keys  = await cache.keys()
  if (keys.length > maxItems) {
    await Promise.all(keys.slice(0, keys.length - maxItems).map(k => cache.delete(k)))
  }
}

function offlineFallback(request) {
  if (request.mode === 'navigate') {
    return caches.match('/offline') || new Response('<h1>غير متصل بالإنترنت</h1>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
  return new Response('Offline', { status: 503 })
}

// ─── Background sync ──────────────────────────────────────────────────────────
self.addEventListener('sync', (e) => {
  if (e.tag === 'cv-upload-queue') {
    e.waitUntil(processUploadQueue())
  }
})

async function processUploadQueue() {
  const clients = await self.clients.matchAll()
  clients.forEach(c => c.postMessage({ type: 'SYNC_UPLOAD_QUEUE' }))
}

// ─── Push notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (e) => {
  if (!e.data) return
  const data = e.data.json()
  e.waitUntil(
    self.registration.showNotification(data.title || 'CloudVault AI', {
      body:    data.body   || '',
      icon:    data.icon   || '/icon-192.png',
      badge:   '/badge-72.png',
      tag:     data.tag    || 'cv-notif',
      data:    data.url    || '/dashboard',
      actions: [
        { action: 'open',    title: 'فتح' },
        { action: 'dismiss', title: 'إغلاق' },
      ],
      dir:  'rtl',
      lang: 'ar',
    })
  )
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  if (e.action === 'dismiss') return
  const url = e.notification.data || '/dashboard'
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes(self.location.origin))
      if (existing) { existing.focus(); existing.navigate(url) }
      else           self.clients.openWindow(url)
    })
  )
})

// ─── Message from main thread ─────────────────────────────────────────────────
self.addEventListener('message', (e) => {
  if (e.data?.type === 'CACHE_VIDEO') {
    const { url } = e.data
    caches.open(VIDEO_CACHE).then(cache => {
      fetch(url).then(res => { if (res.ok) cache.put(url, res) }).catch(() => {})
    })
  }
  if (e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (e.data?.type === 'CLEAR_VIDEO_CACHE') {
    caches.delete(VIDEO_CACHE).then(() => {
      e.source?.postMessage({ type: 'VIDEO_CACHE_CLEARED' })
    })
  }
})
