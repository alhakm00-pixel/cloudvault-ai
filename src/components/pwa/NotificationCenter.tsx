'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, X, Check, CheckCheck, Trash2, Settings, Upload, Share2, HardDrive, Cpu } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'
import toast from 'react-hot-toast'

interface Notification {
  id:        string
  title:     string
  message:   string
  type:      'upload' | 'share' | 'storage' | 'ai' | 'system'
  isRead:    boolean
  createdAt: number
  action?:   { label: string; url: string }
}

const DEMO_NOTIFS: Notification[] = [
  { id: '1', title: 'اكتمل الرفع ✅', message: 'تم رفع "مشروع التصميم.mp4" بنجاح (2.4 GB)', type: 'upload', isRead: false, createdAt: Date.now() - 120000 },
  { id: '2', title: 'ترجمة جاهزة 🤖', message: 'تم توليد الترجمة العربية لـ "فيديو تعليمي.mp4"', type: 'ai', isRead: false, createdAt: Date.now() - 600000, action: { label: 'مشاهدة', url: '/player' } },
  { id: '3', title: 'تنبيه التخزين ⚠️', message: 'وصلت مساحتك إلى 80% — 1.6TB من أصل 2TB', type: 'storage', isRead: true, createdAt: Date.now() - 3600000 },
  { id: '4', title: 'مشاركة جديدة 🔗', message: 'شارك أحمد معك ملف "تقرير Q4.pdf"', type: 'share', isRead: true, createdAt: Date.now() - 86400000 },
]

const typeIcon: Record<Notification['type'], React.ElementType> = {
  upload:  Upload,
  share:   Share2,
  storage: HardDrive,
  ai:      Cpu,
  system:  Bell,
}

const typeColor: Record<Notification['type'], string> = {
  upload:  'from-emerald-500 to-teal-500',
  share:   'from-royal-500 to-indigo-500',
  storage: 'from-amber-500 to-orange-500',
  ai:      'from-violet-500 to-purple-500',
  system:  'from-white/20 to-white/10',
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m    = Math.floor(diff / 60000)
  if (m < 1)  return 'الآن'
  if (m < 60) return `منذ ${m} دقيقة`
  const h = Math.floor(m / 60)
  if (h < 24) return `منذ ${h} ساعة`
  return `منذ ${Math.floor(h / 24)} يوم`
}

interface NotificationCenterProps {
  open:    boolean
  onClose: () => void
}

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const { requestPushPermission, sendTestNotification } = usePWA()
  const [notifs,       setNotifs]       = useState<Notification[]>(DEMO_NOTIFS)
  const [pushEnabled,  setPushEnabled]  = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setPushEnabled(Notification.permission === 'granted')
  }, [])

  const unreadCount = notifs.filter(n => !n.isRead).length

  const markRead = (id: string) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))

  const deleteNotif = (id: string) =>
    setNotifs(prev => prev.filter(n => n.id !== id))

  const handlePushToggle = async () => {
    if (pushEnabled) {
      setPushEnabled(false)
      toast('تم إيقاف الإشعارات')
    } else {
      const perm = await requestPushPermission()
      if (perm === 'granted') {
        setPushEnabled(true)
        toast.success('✅ تم تفعيل الإشعارات!')
        sendTestNotification()
      } else {
        toast.error('لم يتم السماح بالإشعارات')
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1,   y: 0 }}
            exit={{ opacity: 0,   scale: 0.9,  y: -10 }}
            className="fixed top-16 left-4 sm:left-auto sm:right-4 z-50 w-[calc(100vw-2rem)] sm:w-96 glass-card rounded-3xl overflow-hidden shadow-glow-md"
            style={{ direction: 'rtl' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Bell className="w-5 h-5 text-royal-400" />
              <h3 className="font-bold text-white flex-1">الإشعارات</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-royal-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} title="تحديد الكل كمقروء"
                    className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => setShowSettings(!showSettings)}
                  className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button onClick={onClose}
                  className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Settings panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden border-b border-white/10"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">إشعارات Push</p>
                        <p className="text-xs text-white/40">تلقّي إشعارات حتى عند إغلاق التطبيق</p>
                      </div>
                      <button
                        onClick={handlePushToggle}
                        className={`relative w-11 h-6 rounded-full transition-all ${pushEnabled ? 'bg-gradient-to-r from-royal-500 to-violet-500' : 'bg-white/10'}`}
                      >
                        <motion.div
                          animate={{ x: pushEnabled ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                        />
                      </button>
                    </div>
                    <button
                      onClick={() => { sendTestNotification(); toast('إشعار تجريبي أُرسل!') }}
                      disabled={!pushEnabled}
                      className="btn-ghost w-full text-xs py-2 disabled:opacity-40"
                    >
                      إرسال إشعار تجريبي
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications list */}
            <div className="max-h-[60vh] overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="text-center py-12">
                  <BellOff className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifs.map((notif) => {
                    const Icon = typeIcon[notif.type]
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer group ${
                          !notif.isRead ? 'bg-white/5 border border-white/8' : 'hover:bg-white/5'
                        }`}
                        onClick={() => markRead(notif.id)}
                      >
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${typeColor[notif.type]} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-semibold ${!notif.isRead ? 'text-white' : 'text-white/70'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <div className="w-2 h-2 rounded-full bg-royal-400 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{notif.message}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-white/30">{timeAgo(notif.createdAt)}</span>
                            {notif.action && (
                              <a href={notif.action.url}
                                onClick={e => e.stopPropagation()}
                                className="text-xs text-royal-400 hover:text-royal-300 transition-colors">
                                {notif.action.label} ←
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); deleteNotif(notif.id) }}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifs.length > 0 && (
              <div className="border-t border-white/10 p-3">
                <button
                  onClick={() => setNotifs([])}
                  className="w-full text-xs text-white/30 hover:text-white/60 transition-colors py-1"
                >
                  مسح جميع الإشعارات
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
