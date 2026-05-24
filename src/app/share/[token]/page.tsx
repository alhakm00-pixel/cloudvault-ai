'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
  Cloud, Download, Eye, Lock, AlertCircle,
  File, Film, Image, Music, FileText, Archive,
  Share2, ExternalLink, Clock, Shield
} from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import Link from 'next/link'

// Demo shared file data
const DEMO_SHARED = {
  file: {
    id: 'shared-1',
    name: 'مشروع التصميم النهائي',
    originalName: 'مشروع_التصميم_النهائي.mp4',
    mimeType: 'video/mp4',
    size: 2400000000,
    thumbnailUrl: null,
    duration: 2732,
    width: 1920,
    height: 1080,
    createdAt: new Date().toISOString(),
  },
  shareType: 'DOWNLOAD',
  canDownload: true,
  previewType: 'video',
}

function FileTypeIcon({ mimeType, size = 'md' }: { mimeType: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }[size]
  if (mimeType.startsWith('video/'))       return <Film     className={cls} />
  if (mimeType.startsWith('image/'))       return <Image    className={cls} />
  if (mimeType.startsWith('audio/'))       return <Music    className={cls} />
  if (mimeType === 'application/pdf')      return <FileText className={cls} />
  if (mimeType.includes('zip'))            return <Archive  className={cls} />
  return <File className={cls} />
}

function FileTypeBg(mimeType: string) {
  if (mimeType.startsWith('video/')) return 'from-violet-600 to-purple-700'
  if (mimeType.startsWith('image/')) return 'from-pink-600 to-rose-700'
  if (mimeType.startsWith('audio/')) return 'from-green-600 to-emerald-700'
  if (mimeType === 'application/pdf') return 'from-red-600 to-orange-700'
  return 'from-royal-600 to-indigo-700'
}

export default function SharedFilePage() {
  const params = useParams()
  const token  = params.token as string

  const [data, setData]           = useState<typeof DEMO_SHARED | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [needsPassword, setNeedsPassword] = useState(false)
  const [password, setPassword]   = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded]   = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (token === 'expired') {
        setError('انتهت صلاحية هذا الرابط')
      } else if (token === 'protected') {
        setNeedsPassword(true)
      } else {
        setData(DEMO_SHARED)
      }
      setLoading(false)
    }, 800)
  }, [token])

  const handlePasswordSubmit = () => {
    if (password === '1234') {
      setNeedsPassword(false)
      setData(DEMO_SHARED)
    } else {
      setError('كلمة المرور غير صحيحة')
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    await new Promise(r => setTimeout(r, 1500))
    setDownloading(false)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.floor(s % 60)
    return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}` : `${m}:${sec.toString().padStart(2,'0')}`
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 glass border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span className="font-black glow-text text-sm hidden sm:block">CloudVault AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>مشاركة آمنة</span>
            </div>
            <Link href="/auth/register" className="btn-primary py-1.5 px-4 text-xs">
              احصل على 2TB مجاناً
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center pt-14 px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* Loading */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-12 h-12 border-2 border-royal-500/30 border-t-royal-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">جاري تحميل الملف...</p>
            </motion.div>
          )}

          {/* Password gate */}
          {needsPassword && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">ملف محمي بكلمة مرور</h2>
              <p className="text-white/60 text-sm mb-6">أدخل كلمة المرور للوصول إلى الملف المشارك</p>
              <div className="space-y-3 max-w-xs mx-auto">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  placeholder="كلمة المرور..."
                  className="input-glass text-center text-lg tracking-widest"
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                <button onClick={handlePasswordSubmit} className="btn-primary w-full py-3">
                  فتح الملف
                </button>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {error && !needsPassword && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">الرابط غير متاح</h2>
              <p className="text-white/60 text-sm mb-6">{error}</p>
              <Link href="/" className="btn-ghost text-sm py-2.5 px-6 inline-flex">
                الذهاب للرئيسية
              </Link>
            </motion.div>
          )}

          {/* File card */}
          {data && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              {/* Main card */}
              <div className="glass-card rounded-3xl overflow-hidden">
                {/* Thumbnail / preview area */}
                <div className={`h-52 bg-gradient-to-br ${FileTypeBg(data.file.mimeType)} flex items-center justify-center relative`}>
                  {data.file.thumbnailUrl ? (
                    <img src={data.file.thumbnailUrl} alt={data.file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white/40">
                      <FileTypeIcon mimeType={data.file.mimeType} size="lg" />
                    </div>
                  )}
                  {/* Play overlay for video */}
                  {data.previewType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <span className="text-3xl ml-1">▶</span>
                      </div>
                    </div>
                  )}
                  {/* Share badge */}
                  <div className="absolute top-3 right-3 glass rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
                    <Share2 className="w-3 h-3 text-royal-400" />
                    <span className="text-white/80">
                      {data.shareType === 'VIEW' ? 'عرض فقط' : data.shareType === 'DOWNLOAD' ? 'عرض + تحميل' : 'تعديل'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h1 className="text-xl font-black text-white mb-1 truncate">{data.file.name}</h1>
                  <p className="text-sm text-white/50 mb-5 truncate">{data.file.originalName}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'الحجم',     value: formatBytes(data.file.size) },
                      { label: 'النوع',     value: data.file.mimeType.split('/')[1]?.toUpperCase() ?? 'ملف' },
                      ...(data.file.duration ? [{ label: 'المدة', value: formatDuration(data.file.duration) }] : []),
                      ...(data.file.width   ? [{ label: 'الدقة', value: `${data.file.width}×${data.file.height}` }] : []),
                    ].map((s, i) => (
                      <div key={i} className="glass rounded-2xl p-3 text-center">
                        <p className="text-xs text-white/40">{s.label}</p>
                        <p className="text-sm font-bold text-white mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {data.canDownload && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={downloading}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-70"
                      >
                        {downloading ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>جاري التحميل...</span></>
                        ) : downloaded ? (
                          <><span>✅</span><span>تم التحميل</span></>
                        ) : (
                          <><Download className="w-4 h-4" /><span>تحميل الملف</span></>
                        )}
                      </motion.button>
                    )}
                    <button className="btn-ghost flex items-center gap-2 py-3 px-4">
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">معاينة</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CloudVault promo */}
              <div className="glass-card rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">احفظ ملفاتك في CloudVault AI</p>
                  <p className="text-xs text-white/50">2TB مجاناً · تشفير كامل · ذكاء اصطناعي</p>
                </div>
                <Link href="/auth/register"
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 flex-shrink-0">
                  <span>ابدأ مجاناً</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
