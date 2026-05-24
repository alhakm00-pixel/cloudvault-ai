'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  prompt(): Promise<void>
}

export interface PWAState {
  isInstallable:   boolean
  isInstalled:     boolean
  isOnline:        boolean
  isUpdateAvailable: boolean
  swRegistered:    boolean
  swVersion:       string
  videoCacheSize:  number
  install:         () => Promise<void>
  update:          () => void
  clearVideoCache: () => Promise<void>
  cacheVideo:      (url: string) => void
  requestPushPermission: () => Promise<NotificationPermission>
  sendTestNotification: () => void
}

export function usePWA(): PWAState {
  const [isInstallable,    setInstallable]    = useState(false)
  const [isInstalled,      setInstalled]      = useState(false)
  const [isOnline,         setOnline]         = useState(true)
  const [isUpdateAvailable,setUpdateAvailable]= useState(false)
  const [swRegistered,     setSwRegistered]   = useState(false)
  const [swVersion,        setSwVersion]      = useState('')
  const [videoCacheSize,   setVideoCacheSize] = useState(0)

  const deferredPrompt   = useRef<BeforeInstallPromptEvent | null>(null)
  const swRegistrationRef= useRef<ServiceWorkerRegistration | null>(null)

  // ── Register Service Worker ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => {
        swRegistrationRef.current = reg
        setSwRegistered(true)
        setSwVersion('v2.0.0')

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
            }
          })
        })
      })
      .catch(err => console.warn('SW registration failed:', err))

    // Listen for controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })

    // Messages from SW
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data?.type === 'VIDEO_CACHE_CLEARED') {
        setVideoCacheSize(0)
      }
    })
  }, [])

  // ── Online / offline ─────────────────────────────────────────────────────
  useEffect(() => {
    setOnline(navigator.onLine)
    const goOnline  = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline) }
  }, [])

  // ── Install prompt ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Check already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      setInstallable(false)
    }

    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setInstallable(false)
      deferredPrompt.current = null
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // ── Measure video cache ───────────────────────────────────────────────────
  useEffect(() => {
    const measure = async () => {
      if (!('caches' in window)) return
      try {
        const keys = await caches.keys()
        const videoKey = keys.find(k => k.includes('cv-videos'))
        if (!videoKey) return
        const cache  = await caches.open(videoKey)
        const cacheKeys = await cache.keys()
        let total = 0
        for (const req of cacheKeys) {
          const res = await cache.match(req)
          if (res) {
            const buf = await res.clone().arrayBuffer()
            total += buf.byteLength
          }
        }
        setVideoCacheSize(total)
      } catch {}
    }
    measure()
  }, [])

  // ── Actions ───────────────────────────────────────────────────────────────
  const install = useCallback(async () => {
    if (!deferredPrompt.current) return
    await deferredPrompt.current.prompt()
    const choice = await deferredPrompt.current.userChoice
    if (choice.outcome === 'accepted') {
      setInstalled(true); setInstallable(false)
    }
    deferredPrompt.current = null
  }, [])

  const update = useCallback(() => {
    const sw = swRegistrationRef.current?.waiting
    if (sw) {
      sw.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [])

  const clearVideoCache = useCallback(async () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_VIDEO_CACHE' })
    } else {
      const keys = await caches.keys()
      const vk   = keys.find(k => k.includes('cv-videos'))
      if (vk) await caches.delete(vk)
      setVideoCacheSize(0)
    }
  }, [])

  const cacheVideo = useCallback((url: string) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CACHE_VIDEO', url })
    }
  }, [])

  const requestPushPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) return 'denied'
    if (Notification.permission === 'granted') return 'granted'
    return Notification.requestPermission()
  }, [])

  const sendTestNotification = useCallback(() => {
    if (Notification.permission !== 'granted') return
    swRegistrationRef.current?.showNotification('CloudVault AI 🎉', {
      body:  'اكتمل رفع الملف بنجاح!',
      icon:  '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      tag:   'test',
      dir:   'rtl',
      lang:  'ar',
    })
  }, [])

  return {
    isInstallable, isInstalled, isOnline, isUpdateAvailable,
    swRegistered, swVersion, videoCacheSize,
    install, update, clearVideoCache, cacheVideo,
    requestPushPermission, sendTestNotification,
  }
}
