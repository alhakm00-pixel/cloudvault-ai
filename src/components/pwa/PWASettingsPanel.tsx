'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smartphone, Wifi, WifiOff, Bell, BellOff, HardDrive,
  RefreshCw, Download, Trash2, Check, ChevronRight,
  Shield, Zap, Globe, Battery, Monitor
} from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'
import { formatBytes } from '@/lib/utils'
import toast from 'react-hot-toast'
import ThemeToggle from '../ui/ThemeToggle'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all ${value ? 'bg-gradient-to-r from-royal-500 to-violet-500' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  )
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0 mr-4">{children}</div>
    </div>
  )
}

export default function PWASettingsPanel() {
  const { isInstallable, isInstalled, isOnline, swRegistered, swVersion,
    videoCacheSize, install, update, clearVideoCache, isUpdateAvailable,
    requestPushPermission, sendTestNotification } = usePWA()

  const [pushEnabled,    setPushEnabled]    = useState(typeof Notification !== 'undefined' && Notification.permission === 'granted')
  const [offlineEnabled, setOfflineEnabled] = useState(true)
  const [autoCacheNew,   setAutoCacheNew]   = useState(false)
  const [dataSaver,      setDataSaver]      = useState(false)
  const [bgSync,         setBgSync]         = useState(true)
  const [clearing,       setClearing]       = useState(false)
  const [installing,     setInstalling]     = useState(false)

  const handleClearCache = async () => {
    setClearing(true)
    await clearVideoCache()
    setTimeout(() => setClearing(false), 800)
    toast.success('تم مسح ذاكرة التخزين المؤقت')
  }

  const handleInstall = async () => {
    setInstalling(true)
    try {
      await install()
      toast.success('🎉 تم تثبيت التطبيق!')
    } catch {
      toast.error('تعذّر التثبيت — جرّب من متصفح Chrome أو Safari')
    } finally {
      setInstalling(false)
    }
  }

  const handlePushToggle = async (v: boolean) => {
    if (v) {
      const perm = await requestPushPermission()
      if (perm === 'granted') {
        setPushEnabled(true)
        sendTestNotification()
        toast.success('✅ الإشعارات مفعّلة!')
      } else {
        toast.error('لم يُسمح بالإشعارات — تحقق من إعدادات المتصفح')
      }
    } else {
      setPushEnabled(false)
      toast('تم إيقاف الإشعارات')
    }
  }

  return (
    <div className="space-y-5" dir="rtl">

      {/* PWA Status Card */}
      <div className="glass-card rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isInstalled ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/10'
          }`}>
            <Smartphone className={`w-5 h-5 ${isInstalled ? 'text-emerald-400' : 'text-white/50'}`} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">تطبيق PWA</p>
            <p className={`text-xs ${isInstalled ? 'text-emerald-400' : 'text-white/50'}`}>
              {isInstalled ? '✅ مثبّت على الجهاز' : 'غير مثبّت بعد'}
            </p>
          </div>
          {isInstalled ? (
            <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full">
              مثبّت
            </span>
          ) : isInstallable ? (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleInstall}
              disabled={installing}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              {installing
                ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Download className="w-3 h-3" />}
              تثبيت
            </motion.button>
          ) : (
            <span className="text-xs text-white/30">غير متاح</span>
          )}
        </div>

        {/* Status grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: isOnline ? Wifi : WifiOff, label: 'الاتصال', value: isOnline ? 'متصل' : 'غير متصل', color: isOnline ? 'text-emerald-400' : 'text-red-400' },
            { icon: Shield, label: 'Service Worker', value: swRegistered ? swVersion : 'غير نشط', color: swRegistered ? 'text-royal-400' : 'text-white/30' },
            { icon: HardDrive, label: 'كاش الفيديو', value: formatBytes(videoCacheSize), color: 'text-amber-400' },
            { icon: Zap, label: 'التحديث', value: isUpdateAvailable ? 'متاح!' : 'محدّث', color: isUpdateAvailable ? 'text-amber-400' : 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-3 flex items-center gap-2">
              <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
              <div className="min-w-0">
                <p className="text-xs text-white/40">{s.label}</p>
                <p className={`text-xs font-semibold ${s.color} truncate`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {isUpdateAvailable && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={update}
            className="btn-primary w-full mt-4 text-sm py-2.5 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث التطبيق الآن
          </motion.button>
        )}
      </div>

      {/* Offline & Cache */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-bold text-white mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4 text-royal-400" />وضع بلا إنترنت
        </h3>
        <p className="text-xs text-white/40 mb-4">التحكم في التخزين المؤقت والوصول دون اتصال</p>

        <Row label="تمكين الوضع غير المتصل" desc="الوصول للملفات المحفوظة بدون إنترنت">
          <Toggle value={offlineEnabled} onChange={setOfflineEnabled} />
        </Row>
        <Row label="تخزين الفيديوهات الجديدة" desc="حفظ الفيديوهات المشاهدة تلقائياً">
          <Toggle value={autoCacheNew} onChange={setAutoCacheNew} />
        </Row>
        <Row label="توفير البيانات" desc="تقليل جودة الصور عند الاتصال البطيء">
          <Toggle value={dataSaver} onChange={setDataSaver} />
        </Row>
        <Row label="المزامنة في الخلفية" desc="رفع الملفات عند استعادة الاتصال">
          <Toggle value={bgSync} onChange={setBgSync} />
        </Row>

        {/* Cache usage */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white">كاش الفيديو</p>
              <p className="text-xs text-white/40">{formatBytes(videoCacheSize)} مستخدمة</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleClearCache}
              disabled={clearing || videoCacheSize === 0}
              className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 text-red-400 border-red-500/20 hover:bg-red-500/10 disabled:opacity-40"
            >
              {clearing
                ? <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                : <Trash2 className="w-3 h-3" />}
              مسح
            </motion.button>
          </div>

          {/* Cache breakdown */}
          <div className="space-y-2">
            {[
              { label: 'فيديوهات',     pct: 74, color: 'from-violet-500 to-purple-500', size: '1.8 GB' },
              { label: 'واجهة التطبيق', pct: 15, color: 'from-royal-500 to-indigo-500', size: '380 MB' },
              { label: 'بيانات API',    pct: 11, color: 'from-amber-500 to-orange-500', size: '264 MB' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${c.color} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-white/60">{c.label}</span>
                    <span className="text-white/40">{c.size}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full">
                    <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-bold text-white mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />الإشعارات
        </h3>
        <p className="text-xs text-white/40 mb-4">إدارة إشعارات التطبيق وأذونات Push</p>

        <Row label="إشعارات Push" desc="تلقّي الإشعارات حتى عند إغلاق التطبيق">
          <Toggle value={pushEnabled} onChange={handlePushToggle} />
        </Row>
        {[
          { label: 'اكتمال الرفع',    desc: 'عند انتهاء رفع ملف'            },
          { label: 'مشاركة جديدة',    desc: 'عند مشاركة ملف معك'            },
          { label: 'ترجمة جاهزة',     desc: 'عند اكتمال ترجمة AI'           },
          { label: 'تنبيه التخزين',   desc: 'عند الاقتراب من حد المساحة'    },
        ].map((n, i) => (
          <Row key={i} label={n.label} desc={n.desc}>
            <Toggle value={pushEnabled} onChange={() => {}} />
          </Row>
        ))}

        {pushEnabled && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { sendTestNotification(); toast('إشعار تجريبي أُرسل! 🔔') }}
            className="btn-ghost w-full mt-3 text-sm py-2.5 flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />إرسال إشعار تجريبي
          </motion.button>
        )}
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-bold text-white mb-1 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-pink-400" />المظهر والأداء
        </h3>
        <p className="text-xs text-white/40 mb-4">تخصيص واجهة التطبيق</p>

        <div className="mb-4">
          <p className="text-sm text-white/70 mb-2">وضع العرض</p>
          <ThemeToggle />
        </div>

        {[
          { label: 'حركات التحريك', desc: 'تأثيرات وانتقالات سلسة', state: true },
          { label: 'تأثير الزجاج',  desc: 'Glassmorphism UI',         state: true },
          { label: 'خلفية متحركة',  desc: 'كرات اللون المتحركة',      state: true },
        ].map((item, i) => (
          <Row key={i} label={item.label} desc={item.desc}>
            <Toggle value={item.state} onChange={() => {}} />
          </Row>
        ))}
      </div>

      {/* Performance tips */}
      <div className="glass-card rounded-3xl p-5 border border-royal-500/15">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-royal-400" />
          <h3 className="font-bold text-white text-sm">نصائح الأداء</h3>
        </div>
        <ul className="space-y-2.5">
          {[
            { icon: '✅', text: 'Service Worker نشط — التطبيق يعمل بدون إنترنت' },
            { icon: '✅', text: 'الفيديوهات تُشغَّل بتقنية Range Streaming' },
            { icon: isInstalled ? '✅' : '⚠️', text: isInstalled ? 'التطبيق مثبّت كـ PWA' : 'ثبّت التطبيق للحصول على أداء أفضل' },
            { icon: pushEnabled ? '✅' : 'ℹ️', text: pushEnabled ? 'الإشعارات مفعّلة' : 'فعّل الإشعارات لمتابعة التحديثات' },
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/60">
              <span className="flex-shrink-0">{tip.icon}</span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
