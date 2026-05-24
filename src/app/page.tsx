'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cloud, Shield, Zap, Globe, Play, Star, ChevronLeft,
  HardDrive, Lock, Cpu, Wifi, Upload, Download, Share2,
  Check, ArrowLeft, Sparkles, Database, Eye
} from 'lucide-react'
import { useState, useEffect } from 'react'

const features = [
  { icon: HardDrive, title: '2 تيرابايت مجاناً', desc: 'مساحة هائلة لجميع ملفاتك الشخصية والمهنية', color: 'from-blue-500 to-indigo-600', delay: 0 },
  { icon: Shield, title: 'تشفير عسكري', desc: 'حماية بيانات AES-256 مع مصادقة ثنائية متقدمة', color: 'from-violet-500 to-purple-600', delay: 0.1 },
  { icon: Cpu, title: 'ذكاء اصطناعي', desc: 'ترجمة تلقائية، ترجمة ترجمات، بحث ذكي بالمحتوى', color: 'from-pink-500 to-rose-600', delay: 0.2 },
  { icon: Zap, title: 'سرعة فائقة', desc: 'رفع وتحميل متعدد المقاطع مع استئناف تلقائي', color: 'from-amber-500 to-orange-600', delay: 0.3 },
  { icon: Globe, title: 'وصول عالمي', desc: 'خوادم موزعة حول العالم لأسرع أداء ممكن', color: 'from-teal-500 to-green-600', delay: 0.4 },
  { icon: Wifi, title: 'وضع بلا إنترنت', desc: 'تحميل الملفات مسبقاً والوصول دون اتصال', color: 'from-cyan-500 to-blue-600', delay: 0.5 },
]

const plans = [
  {
    name: 'مجاني', price: '0', period: 'للأبد',
    storage: '2 تيرابايت',
    features: ['2 تيرابايت تخزين', 'مشغل فيديو متقدم', 'مشاركة الملفات', 'تطبيق جوال', 'دعم أساسي'],
    cta: 'ابدأ مجاناً', popular: false, color: 'border-white/10',
  },
  {
    name: 'Pro', price: '29', period: 'شهرياً',
    storage: '10 تيرابايت',
    features: ['10 تيرابايت تخزين', 'AI ترجمة تلقائية', 'ترجمات فيديو', 'بحث ذكي', 'أولوية الدعم', 'تشفير متقدم'],
    cta: 'جرّب مجاناً 14 يوم', popular: true, color: 'border-royal-500/50',
  },
  {
    name: 'Enterprise', price: '99', period: 'شهرياً',
    storage: 'غير محدود',
    features: ['تخزين غير محدود', 'فريق متعدد المستخدمين', 'لوحة تحكم مشتركة', 'API مخصص', 'SLA 99.99%', 'دعم 24/7'],
    cta: 'تواصل معنا', popular: false, color: 'border-white/10',
  },
]

const stats = [
  { value: '2M+', label: 'مستخدم نشط' },
  { value: '50PB+', label: 'بيانات محفوظة' },
  { value: '99.99%', label: 'وقت التشغيل' },
  { value: '180+', label: 'دولة حول العالم' },
]

function FloatingFile({ style, name, icon }: { style: React.CSSProperties; name: string; icon: string }) {
  return (
    <motion.div
      style={style}
      animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute glass-card rounded-2xl p-3 flex items-center gap-2 min-w-max pointer-events-none"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-white/80 font-medium">{name}</p>
        <p className="text-xs text-white/40">تم الرفع للتو</p>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 inset-x-0 z-50 glass border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-sm">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold glow-text hidden sm:block">CloudVault AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['المميزات', 'الأسعار', 'عن المنصة'].map((item) => (
              <a key={item} href="#" className="text-sm text-white/70 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">تسجيل الدخول</Link>
            <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">ابدأ مجاناً</Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="min-h-screen flex items-center pt-16 px-4">
        <div className="max-w-7xl mx-auto w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left / Text */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm text-royal-300 mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>مدعوم بالذكاء الاصطناعي GPT-4o</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="text-white">مساحتك</span>
                  <br />
                  <span className="glow-text">السحابية</span>
                  <br />
                  <span className="text-white">الذكية</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-lg text-white/60 leading-relaxed max-w-lg"
              >
                منصة تخزين سحابي من الجيل القادم. احفظ، شارك، وشاهد ملفاتك بذكاء مع ترجمة تلقائية
                وبحث بالمحتوى — كل ذلك في مكان واحد آمن ومشفر.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/auth/register"
                  className="btn-primary text-base py-3 px-8 flex items-center justify-center gap-2"
                >
                  <span>ابدأ مجاناً — 2TB</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="btn-ghost text-base py-3 px-8 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  <span>شاهد العرض</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-6 pt-2"
              >
                <div className="flex -space-x-2 space-x-reverse">
                  {['👨‍💻','👩‍💼','👨‍🎨','👩‍🔬'].map((emoji, i) => (
                    <div key={i} className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-sm border border-white/20">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400">{'★★★★★'}</div>
                  <p className="text-xs text-white/50">أكثر من 2 مليون مستخدم</p>
                </div>
              </motion.div>
            </div>

            {/* Right / Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative h-[500px] hidden lg:block"
            >
              {/* Central orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-royal-600/30 to-violet-600/30 animate-pulse-slow" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-royal-500/20 to-violet-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <Database className="w-16 h-16 text-royal-300 mx-auto mb-2" />
                      <p className="text-3xl font-black glow-text">2TB</p>
                      <p className="text-sm text-white/60">تخزين مجاني</p>
                    </div>
                  </div>
                  {/* Orbit rings */}
                  <div className="absolute inset-[-20px] rounded-full border border-royal-500/20 animate-spin-slow" />
                  <div className="absolute inset-[-40px] rounded-full border border-violet-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
                </div>
              </div>

              {/* Floating file cards */}
              {mounted && (
                <>
                  <FloatingFile style={{ top: '8%', right: '-5%' }} name="فيديو 4K.mp4" icon="🎬" />
                  <FloatingFile style={{ top: '30%', left: '-8%' }} name="تقرير.pdf" icon="📄" />
                  <FloatingFile style={{ bottom: '30%', right: '-10%' }} name="صور.zip" icon="🖼️" />
                  <FloatingFile style={{ bottom: '10%', left: '-5%' }} name="مشروع.zip" icon="📦" />
                </>
              )}

              {/* Upload indicator */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-[15%] left-[10%] glass-card rounded-2xl p-4 min-w-[180px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">جاري الرفع</p>
                    <p className="text-xs text-white/50">مشروع_نهائي.mp4</p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '73%' }} />
                </div>
                <p className="text-xs text-white/50 mt-1">73% — 1.2GB من 1.8GB</p>
              </motion.div>

              {/* AI badge */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-[20%] right-[5%] glass-card rounded-2xl p-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">ترجمة تلقائية</p>
                  <p className="text-xs text-emerald-400">✓ مكتملة — عربي</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-4xl font-black glow-text">{s.value}</p>
                  <p className="text-sm text-white/60 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="glow-text">كل ما تحتاجه</span>
              <span className="text-white"> في مكان واحد</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              منصة متكاملة تجمع بين التخزين السحابي القوي والذكاء الاصطناعي المتقدم
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: f.delay }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-3xl p-6 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-glow-sm`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo preview ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-white mb-4">واجهة سهلة وجميلة</h2>
            <p className="text-white/60">لوحة تحكم ذكية تتيح لك إدارة ملفاتك بالكامل</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            {/* Mock browser bar */}
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <p className="text-xs text-white/40">app.cloudvault.ai/dashboard</p>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="p-6 grid grid-cols-12 gap-4 min-h-[400px]">
              {/* Mini sidebar */}
              <div className="col-span-2 space-y-2 hidden sm:block">
                {['🏠 الرئيسية', '📁 ملفاتي', '🎬 فيديو', '⭐ المفضلة', '🔗 المشتركة'].map((item, i) => (
                  <div key={i} className={`text-xs py-2 px-3 rounded-xl flex items-center gap-2 ${i === 0 ? 'bg-royal-500/20 text-royal-300' : 'text-white/50'}`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Content area */}
              <div className="col-span-12 sm:col-span-10 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'إجمالي الملفات', value: '2,847', icon: '📁' },
                    { label: 'المشتركة', value: '34', icon: '🔗' },
                    { label: 'المفضلة', value: '128', icon: '⭐' },
                  ].map((s, i) => (
                    <div key={i} className="glass rounded-2xl p-3 text-center">
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="text-sm font-bold text-white">{s.value}</div>
                      <div className="text-xs text-white/50">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Files grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'فيديو.mp4', icon: '🎬', color: 'from-violet-500/20 to-purple-600/20' },
                    { name: 'صورة.jpg', icon: '🖼️', color: 'from-pink-500/20 to-rose-500/20' },
                    { name: 'تقرير.pdf', icon: '📄', color: 'from-red-500/20 to-orange-500/20' },
                    { name: 'موسيقى.mp3', icon: '🎵', color: 'from-green-500/20 to-emerald-500/20' },
                  ].map((f, i) => (
                    <div key={i} className={`glass rounded-xl p-3 bg-gradient-to-br ${f.color} text-center`}>
                      <div className="text-2xl mb-1">{f.icon}</div>
                      <div className="text-xs text-white/70 truncate">{f.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="text-white">اختر </span>
              <span className="glow-text">خطتك</span>
            </h2>
            <p className="text-white/60 text-lg">ابدأ مجاناً، وطوّر عند الحاجة</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-3xl p-8 relative ${plan.popular ? 'border-royal-500/50 shadow-glow-sm' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-1/2 translate-x-1/2">
                    <div className="bg-gradient-to-r from-royal-500 to-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      ⭐ الأكثر شعبية
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-4xl font-black glow-text">${plan.price}</span>
                  <span className="text-white/50 text-sm mr-1">/ {plan.period}</span>
                </div>
                <p className="text-royal-300 text-sm font-medium mb-6">{plan.storage} تخزين</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`w-full flex items-center justify-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-royal-600/10 to-violet-600/10 pointer-events-none" />
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 relative z-10">
              جاهز للبدء؟
            </h2>
            <p className="text-white/60 text-lg mb-8 relative z-10">
              انضم إلى أكثر من 2 مليون شخص يثقون بـ CloudVault AI لحفظ ملفاتهم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/auth/register" className="btn-primary text-base py-3 px-10">
                ابدأ مجاناً — 2TB
              </Link>
              <Link href="/dashboard" className="btn-ghost text-base py-3 px-10">
                جرّب التطبيق
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold glow-text">CloudVault AI</span>
            </div>
            <p className="text-white/40 text-sm text-center">
              © 2024 CloudVault AI — منصة التخزين السحابي الذكية. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">الخصوصية</a>
              <a href="#" className="hover:text-white transition-colors">الشروط</a>
              <a href="#" className="hover:text-white transition-colors">المساعدة</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
