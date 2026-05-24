'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Smartphone, Wifi, WifiOff, RefreshCw, Bell, HardDrive } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'
import { formatBytes } from '@/lib/utils'
import toast from 'react-hot-toast'

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, install } = usePWA()
  const [dismissed, setDismissed] = useState(false)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    const d = sessionStorage.getItem('cv_install_dismissed')
    if (d) setDismissed(true)
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem('cv_install_dismissed', '1')
    setDismissed(true)
  }

  const handleInstall = async () => {
    setInstalling(true)
    try {
      await install()
      toast.success('🎉 تم تثبيت التطبيق! يمكنك فتحه من شاشتك الرئيسية')
    } catch {
      toast.error('تعذّر التثبيت')
    } finally {
      setInstalling(false)
    }
  }

  const show = isInstallable && !isInstalled && !dismissed

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{ y: 100,   opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto sm:w-96 z-50"
          style={{ direction: 'rtl' }}
        >
          <div className="glass-card rounded-3xl p-5 shadow-glow-md border border-royal-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white mb-0.5">ثبّت التطبيق</p>
                <p className="text-xs text-white/60 leading-relaxed">
                  احصل على تجربة تطبيق أصلي مع وصول سريع وعمل بلا إنترنت
                </p>
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleInstall}
                    disabled={installing}
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5 disabled:opacity-70"
                  >
                    {installing
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Download className="w-3.5 h-3.5" />}
                    تثبيت
                  </motion.button>
                  <button onClick={handleDismiss} className="btn-ghost text-sm py-2 px-4">
                    لاحقاً
                  </button>
                </div>
              </div>
              <button onClick={handleDismiss} className="text-white/30 hover:text-white flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Offline indicator ────────────────────────────────────────────────────────
export function OfflineIndicator() {
  const { isOnline } = usePWA()
  const [wasOffline, setWasOffline] = useState(false)
  const [showBack, setShowBack]     = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      setShowBack(true)
      const t = setTimeout(() => setShowBack(false), 3000)
      return () => clearTimeout(t)
    }
  }, [isOnline, wasOffline])

  return (
    <AnimatePresence>
      {(!isOnline || showBack) && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{ y: -60,   opacity: 0 }}
          className={`fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none`}
          style={{ direction: 'rtl' }}
        >
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg ${
            isOnline
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/20 border border-red-500/40 text-red-300'
          }`}>
            {isOnline
              ? <><Wifi className="w-4 h-4" /><span>عاد الاتصال بالإنترنت</span></>
              : <><WifiOff className="w-4 h-4" /><span>لا يوجد اتصال — وضع بلا إنترنت</span></>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Update available banner ──────────────────────────────────────────────────
export function UpdateBanner() {
  const { isUpdateAvailable, update } = usePWA()
  const [dismissed, setDismissed]    = useState(false)

  return (
    <AnimatePresence>
      {isUpdateAvailable && !dismissed && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{ y: -80,   opacity: 0 }}
          className="fixed top-16 inset-x-0 z-40 flex justify-center px-4"
          style={{ direction: 'rtl' }}
        >
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 border border-royal-500/30 shadow-glow-sm max-w-sm w-full">
            <RefreshCw className="w-4 h-4 text-royal-400 flex-shrink-0" />
            <p className="text-sm text-white/80 flex-1">تحديث جديد متاح</p>
            <button onClick={update} className="btn-primary text-xs py-1.5 px-3">تحديث</button>
            <button onClick={() => setDismissed(true)} className="text-white/30 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Video cache manager ──────────────────────────────────────────────────────
export function VideoCacheManager({ onClose }: { onClose: () => void }) {
  const { videoCacheSize, clearVideoCache, cacheVideo, isOnline } = usePWA()

  const handleClear = async () => {
    await clearVideoCache()
    toast.success('تم مسح كاش الفيديو')
    onClose()
  }

  const cachedVideos = [
    { name: 'مشروع التصميم.mp4', size: 890 * 1024 * 1024, cached: true },
    { name: 'فيديو تعليمي.mp4',  size: 650 * 1024 * 1024, cached: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ direction: 'rtl' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-3xl overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          <HardDrive className="w-5 h-5 text-royal-400" />
          <h2 className="font-bold text-white flex-1">كاش الفيديو</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-black glow-text">{formatBytes(videoCacheSize)}</p>
            <p className="text-xs text-white/50 mt-1">إجمالي مساحة الكاش المستخدمة</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-white/40 font-medium">الفيديوهات المحفوظة للتشغيل دون إنترنت:</p>
            {cachedVideos.map((v, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-xl p-3">
                <span className="text-xl">🎬</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{v.name}</p>
                  <p className="text-xs text-white/40">{formatBytes(v.size)}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleClear} className="btn-ghost flex-1 text-sm py-2.5 text-red-400 border-red-500/20 hover:bg-red-500/10">
              مسح الكل
            </button>
            <button onClick={onClose} className="btn-primary flex-1 text-sm py-2.5">إغلاق</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
