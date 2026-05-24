'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layout/AppLayout'
import { useAppStore } from '@/lib/store'
import ThemeSwitcher from '@/components/pwa/ThemeSwitcher'
import { usePWA } from '@/hooks/usePWA'
import { formatBytes } from '@/lib/utils'
import { formatBytes, STORAGE_TOTAL, STORAGE_USED_DEMO } from '@/lib/utils'
import {
  User, Shield, Bell, Palette, Globe, HardDrive, Key,
  Cpu, Wifi, ChevronRight, Check, Camera, Mail, Phone,
  LogOut, Trash2, Download, Link, Eye, EyeOff, Moon,
  Sun, Monitor, Smartphone, Save, RefreshCw, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile',   label: 'الملف الشخصي', icon: User },
  { id: 'security',  label: 'الأمان',         icon: Shield },
  { id: 'storage',   label: 'التخزين',        icon: HardDrive },
  { id: 'ai',        label: 'الذكاء الاصطناعي', icon: Cpu },
  { id: 'notif',     label: 'الإشعارات',      icon: Bell },
  { id: 'appear',    label: 'المظهر',         icon: Palette },
]

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

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 gap-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

// ── Profile tab ──
function ProfileTab() {
  const { user } = useAppStore()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('+966 50 000 0000')
  const [bio, setBio] = useState('مطور ويب وعاشق التكنولوجيا')

  const handleSave = () => toast.success('تم حفظ التغييرات!')

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col sm:flex-row items-center gap-6 glass-card rounded-3xl p-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-royal-400 to-violet-500 flex items-center justify-center text-4xl font-black text-white shadow-glow-md">
            {name[0] ?? 'أ'}
          </div>
          <button className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-sm">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="text-center sm:text-right flex-1">
          <p className="text-lg font-bold text-white">{name}</p>
          <p className="text-sm text-white/50">{email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
            <span className="text-xs bg-gradient-to-r from-royal-500/30 to-violet-500/30 border border-royal-500/30 px-3 py-1 rounded-full text-royal-300 font-medium">
              {user?.plan === 'pro' ? '⭐ Pro' : 'مجاني'}
            </span>
            <span className="text-xs text-white/40">عضو منذ 2024</span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-white mb-2">معلومات الحساب</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'الاسم الكامل', value: name, setter: setName, icon: User, type: 'text', placeholder: 'أحمد محمد' },
            { label: 'البريد الإلكتروني', value: email, setter: setEmail, icon: Mail, type: 'email', placeholder: 'ahmed@example.com' },
            { label: 'رقم الجوال', value: phone, setter: setPhone, icon: Phone, type: 'tel', placeholder: '+966 50 000 0000' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">{f.label}</label>
              <div className="relative">
                <f.icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder={f.placeholder}
                  className="input-glass pr-10 text-sm"
                />
              </div>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs text-white/60 mb-1.5 font-medium">نبذة شخصية</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="input-glass text-sm resize-none"
            />
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="btn-primary flex items-center gap-2 py-2.5 px-6 text-sm mt-2">
          <Save className="w-4 h-4" />حفظ التغييرات
        </motion.button>
      </div>
    </div>
  )
}

// ── Security tab ──
function SecurityTab() {
  const [showPass, setShowPass] = useState(false)
  const [twoFA, setTwoFA] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [biometric, setBiometric] = useState(false)

  const sessions = [
    { device: 'iPhone 15 Pro', location: 'الرياض، السعودية', time: 'نشط الآن', current: true },
    { device: 'MacBook Pro', location: 'جدة، السعودية', time: 'منذ 2 ساعة', current: false },
    { device: 'Chrome — Windows', location: 'دبي، الإمارات', time: 'منذ يوم', current: false },
  ]

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">تغيير كلمة المرور</h3>
        <div className="space-y-3">
          {['كلمة المرور الحالية', 'كلمة المرور الجديدة', 'تأكيد كلمة المرور'].map((label) => (
            <div key={label}>
              <label className="block text-xs text-white/60 mb-1.5">{label}</label>
              <div className="relative">
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="input-glass pr-10 pl-10 text-sm" />
                <button onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <button className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 mt-1">
            <Key className="w-4 h-4" />تحديث كلمة المرور
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-2">إعدادات الأمان</h3>
        <SettingRow label="المصادقة الثنائية (2FA)" desc="طبقة حماية إضافية لحسابك">
          <Toggle value={twoFA} onChange={setTwoFA} />
        </SettingRow>
        <SettingRow label="تنبيهات تسجيل الدخول" desc="إشعار عند تسجيل دخول جديد">
          <Toggle value={loginAlerts} onChange={setLoginAlerts} />
        </SettingRow>
        <SettingRow label="بصمة الإصبع / Face ID" desc="تسجيل دخول بالبيومترك">
          <Toggle value={biometric} onChange={setBiometric} />
        </SettingRow>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">الجلسات النشطة</h3>
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl glass">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {s.device.includes('iPhone') ? '📱' : s.device.includes('Mac') ? '💻' : '🖥️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{s.device}</p>
                <p className="text-xs text-white/50">{s.location} · {s.time}</p>
              </div>
              {s.current
                ? <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">حالية</span>
                : <button className="text-xs text-red-400 hover:text-red-300 transition-colors">إنهاء</button>
              }
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5">
          <LogOut className="w-4 h-4" />إنهاء جميع الجلسات الأخرى
        </button>
      </div>
    </div>
  )
}

// ── Storage tab ──
function StorageTab() {
  const usedPct = (STORAGE_USED_DEMO / STORAGE_TOTAL) * 100
  const breakdown = [
    { label: 'فيديو', size: '1.8 TB', pct: 60, color: 'from-violet-500 to-purple-600' },
    { label: 'صور', size: '312 GB', pct: 22, color: 'from-pink-500 to-rose-500' },
    { label: 'موسيقى', size: '45 GB', pct: 8, color: 'from-green-500 to-emerald-600' },
    { label: 'مستندات', size: '28 GB', pct: 5, color: 'from-blue-500 to-indigo-600' },
    { label: 'أخرى', size: '62 GB', pct: 5, color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white">استخدام التخزين</h3>
            <p className="text-xs text-white/50 mt-0.5">{formatBytes(STORAGE_USED_DEMO)} من {formatBytes(STORAGE_TOTAL)}</p>
          </div>
          <div className="text-left">
            <p className="text-2xl font-black glow-text">{usedPct.toFixed(1)}%</p>
            <p className="text-xs text-white/40">مستخدم</p>
          </div>
        </div>

        {/* Segmented bar */}
        <div className="h-4 rounded-full overflow-hidden flex gap-0.5 mb-5">
          {breakdown.map((b) => (
            <div key={b.label} className={`h-full bg-gradient-to-r ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
          ))}
          <div className="flex-1 bg-white/10 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${b.color} flex-shrink-0`} />
              <div>
                <p className="text-xs text-white/70 font-medium">{b.label}</p>
                <p className="text-xs text-white/40">{b.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">إدارة التخزين</h3>
        {[
          { label: 'تنظيف الملفات المكررة', desc: 'حذف النسخ المتطابقة تلقائياً', icon: RefreshCw, action: 'تنظيف', color: 'text-blue-400' },
          { label: 'ضغط الصور', desc: 'تقليل حجم الصور بجودة عالية', icon: Download, action: 'ضغط', color: 'text-green-400' },
          { label: 'تفريغ سلة المحذوفات', desc: '23 ملف · 4.2 GB', icon: Trash2, action: 'تفريغ', color: 'text-red-400' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
            <div className={`w-10 h-10 rounded-xl glass flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
            <button className={`text-xs py-1.5 px-3 rounded-xl glass border border-white/10 ${item.color} hover:bg-white/5 transition-colors`}>
              {item.action}
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white text-sm">ترقية الخطة</p>
            <p className="text-xs text-white/60 mt-1 mb-3">استخدمت 41% من مساحتك. قم بالترقية للحصول على مساحة أكبر.</p>
            <button className="btn-primary text-xs py-2 px-4">ترقية إلى Pro — 10TB</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── AI tab ──
function AITab() {
  const [autoSubtitles, setAutoSubtitles]   = useState(true)
  const [autoTranslate, setAutoTranslate]   = useState(true)
  const [smartSearch,   setSmartSearch]     = useState(true)
  const [autoSummary,   setAutoSummary]     = useState(false)
  const [lang,          setLang]            = useState('ar')
  const [quality,       setQuality]         = useState('high')

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-sm">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">إعدادات الذكاء الاصطناعي</h3>
            <p className="text-xs text-white/50">تخصيص ميزات AI لتناسب احتياجاتك</p>
          </div>
        </div>

        <SettingRow label="توليد الترجمة تلقائياً" desc="Whisper AI — دقة 95%+">
          <Toggle value={autoSubtitles} onChange={setAutoSubtitles} />
        </SettingRow>
        <SettingRow label="الترجمة التلقائية" desc="ترجمة المحتوى إلى العربية">
          <Toggle value={autoTranslate} onChange={setAutoTranslate} />
        </SettingRow>
        <SettingRow label="البحث الذكي" desc="بحث داخل محتوى الملفات">
          <Toggle value={smartSearch} onChange={setSmartSearch} />
        </SettingRow>
        <SettingRow label="التلخيص التلقائي" desc="ملخص قصير لكل مقطع فيديو">
          <Toggle value={autoSummary} onChange={setAutoSummary} />
        </SettingRow>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">إعدادات الترجمة</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-2">لغة الترجمة الافتراضية</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="input-glass text-sm">
              <option value="ar">العربية</option>
              <option value="en">الإنجليزية</option>
              <option value="fr">الفرنسية</option>
              <option value="es">الإسبانية</option>
              <option value="de">الألمانية</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-2">جودة المعالجة</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fast', label: 'سريع', desc: 'دقة 85%' },
                { id: 'high', label: 'عالي', desc: 'دقة 95%' },
                { id: 'ultra', label: 'فائق', desc: 'دقة 99%' },
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuality(q.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    quality === q.id
                      ? 'border-royal-500/50 bg-royal-500/10 text-royal-300'
                      : 'border-white/10 text-white/60 hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-bold">{q.label}</p>
                  <p className="text-xs opacity-60 mt-0.5">{q.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-3">إحصائيات AI</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'ملفات مُحللة', value: '1,247' },
            { label: 'ساعات مُترجمة', value: '284 ساعة' },
            { label: 'ترجمات منشأة', value: '89 ملف' },
            { label: 'توفير في الوقت', value: '~140 ساعة' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-3 text-center">
              <p className="text-lg font-black glow-text">{s.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Notifications tab ──
function NotifTab() {
  const [push, setPush] = useState(true)
  const [email, setEmail] = useState(true)
  const [uploadDone, setUploadDone] = useState(true)
  const [shareDone, setShareDone] = useState(true)
  const [storage80, setStorage80] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-2">قنوات الإشعارات</h3>
        <SettingRow label="الإشعارات الفورية" desc="إشعارات على الجوال">
          <Toggle value={push} onChange={setPush} />
        </SettingRow>
        <SettingRow label="إشعارات البريد الإلكتروني" desc="ملخص يومي أو فوري">
          <Toggle value={email} onChange={setEmail} />
        </SettingRow>
      </div>
      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-2">نوع الإشعارات</h3>
        <SettingRow label="اكتمال الرفع" desc="عند الانتهاء من رفع ملف">
          <Toggle value={uploadDone} onChange={setUploadDone} />
        </SettingRow>
        <SettingRow label="مشاركة الملفات" desc="عند مشاركة ملف معك">
          <Toggle value={shareDone} onChange={setShareDone} />
        </SettingRow>
        <SettingRow label="تنبيه التخزين 80%" desc="حين تصل المساحة لـ 80%">
          <Toggle value={storage80} onChange={setStorage80} />
        </SettingRow>
        <SettingRow label="تقرير أسبوعي" desc="ملخص نشاطك الأسبوعي">
          <Toggle value={weeklyReport} onChange={setWeeklyReport} />
        </SettingRow>
      </div>
    </div>
  )
}

// ── Appearance tab ──
function AppearTab() {
  const [lang, setLang] = useState('ar')

  const themes = [
    { id: 'royal',  label: 'ملكي',   colors: ['#6366f1','#8b5cf6'] },
    { id: 'ocean',  label: 'المحيط', colors: ['#06b6d4','#0ea5e9'] },
    { id: 'forest', label: 'الغابة', colors: ['#10b981','#059669'] },
    { id: 'sunset', label: 'الغروب', colors: ['#f59e0b','#ef4444'] },
    { id: 'rose',   label: 'الوردي', colors: ['#f43f5e','#ec4899'] },
    { id: 'gold',   label: 'ذهبي',   colors: ['#f59e0b','#d97706'] },
  ]

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">المظهر والألوان</h3>
        <ThemeSwitcher />
      </div>
      <div className="hidden glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">---HIDDEN---</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'داكن', icon: Moon },
            { id: 'light', label: 'فاتح', icon: Sun },
            { id: 'auto', label: 'تلقائي', icon: Monitor },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => m.id === 'dark' && !darkMode && toggleDarkMode()}
              className={`p-4 rounded-2xl border text-center transition-all ${
                (m.id === 'dark' && darkMode) || (m.id === 'light' && !darkMode)
                  ? 'border-royal-500/50 bg-royal-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <m.icon className="w-6 h-6 mx-auto mb-2 text-white/70" />
              <p className="text-sm font-medium text-white">{m.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">لون المنصة</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                theme === t.id ? 'border-white/40 bg-white/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }}
              />
              <span className="text-xs text-white/70">{t.label}</span>
              {theme === t.id && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold text-white mb-4">اللغة والمنطقة</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">لغة الواجهة</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="input-glass text-sm">
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">المنطقة الزمنية</label>
            <select className="input-glass text-sm">
              <option>توقيت الرياض (GMT+3)</option>
              <option>توقيت القاهرة (GMT+2)</option>
              <option>توقيت دبي (GMT+4)</option>
            </select>
          </div>
        </div>
        <button onClick={() => toast.success('تم حفظ إعدادات المظهر!')} className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 mt-4">
          <Save className="w-4 h-4" />حفظ التغييرات
        </button>
      </div>
    </div>
  )
}

// ── Main settings page ──
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabContent: Record<string, React.ReactNode> = {
    profile:  <ProfileTab />,
    security: <SecurityTab />,
    storage:  <StorageTab />,
    ai:       <AITab />,
    notif:    <NotifTab />,
    appear:   <AppearTab />,
  }

  return (
    <AppLayout title="الإعدادات" subtitle="إدارة حسابك وتفضيلاتك">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="glass-card rounded-3xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-royal-500/20 to-violet-500/10 text-royal-300 border border-royal-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  )
}
