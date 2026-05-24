'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Link, Copy, Check, Lock, Clock, Download,
  Eye, Edit, Share2, QrCode, Mail, AlertCircle
} from 'lucide-react'
import type { FileItem } from '@/lib/store'
import toast from 'react-hot-toast'

interface ShareModalProps {
  file: FileItem | null
  onClose: () => void
}

const EXPIRE_OPTIONS = [
  { label: 'لا ينتهي',      value: 0 },
  { label: 'ساعة واحدة',    value: 1 },
  { label: '24 ساعة',       value: 24 },
  { label: '7 أيام',        value: 168 },
  { label: '30 يوماً',      value: 720 },
]

export default function ShareModal({ file, onClose }: ShareModalProps) {
  const [shareType, setShareType]     = useState<'VIEW' | 'DOWNLOAD' | 'EDIT'>('VIEW')
  const [withPassword, setWithPassword] = useState(false)
  const [password, setPassword]       = useState('')
  const [expiresIn, setExpiresIn]     = useState(0)
  const [maxDownloads, setMaxDownloads] = useState('')
  const [creating, setCreating]       = useState(false)
  const [shareUrl, setShareUrl]       = useState('')
  const [copied, setCopied]           = useState(false)
  const [step, setStep]               = useState<'config' | 'done'>('config')

  if (!file) return null

  const handleCreate = async () => {
    setCreating(true)
    await new Promise(r => setTimeout(r, 800)) // simulate API

    const token = Math.random().toString(36).substring(2, 14)
    const url   = `${window.location.origin}/share/${token}`
    setShareUrl(url)
    setStep('done')
    setCreating(false)
    toast.success('تم إنشاء رابط المشاركة!')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('تم نسخ الرابط!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareTypeOptions = [
    { id: 'VIEW',     label: 'عرض فقط',      desc: 'يمكن المشاهدة فقط',      icon: Eye },
    { id: 'DOWNLOAD', label: 'عرض + تحميل',  desc: 'يمكن التحميل أيضاً',     icon: Download },
    { id: 'EDIT',     label: 'تعديل',         desc: 'يمكن الوصول الكامل',     icon: Edit },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        style={{ direction: 'rtl' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1,   opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md glass-card rounded-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-white">مشاركة الملف</h2>
              <p className="text-xs text-white/50 truncate">{file.name}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {/* ── Config step ── */}
              {step === 'config' && (
                <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                  {/* Share type */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">صلاحية الرابط</label>
                    <div className="grid grid-cols-3 gap-2">
                      {shareTypeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setShareType(opt.id as any)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            shareType === opt.id
                              ? 'border-royal-500/50 bg-royal-500/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <opt.icon className="w-5 h-5 mx-auto mb-1 text-white/70" />
                          <p className="text-xs font-medium text-white">{opt.label}</p>
                          <p className="text-xs text-white/40 mt-0.5 leading-tight">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expiry */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />انتهاء الصلاحية
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {EXPIRE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setExpiresIn(opt.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            expiresIn === opt.value
                              ? 'bg-gradient-to-r from-royal-500 to-violet-500 text-white'
                              : 'glass text-white/60 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="checkbox" checked={withPassword} onChange={(e) => setWithPassword(e.target.checked)}
                        className="w-4 h-4 rounded accent-royal-500" />
                      <span className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />حماية بكلمة مرور
                      </span>
                    </label>
                    <AnimatePresence>
                      {withPassword && (
                        <motion.input
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور..."
                          className="input-glass text-sm"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Max downloads */}
                  {shareType !== 'VIEW' && (
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />حد التحميل (اختياري)
                      </label>
                      <input
                        type="number"
                        value={maxDownloads}
                        onChange={(e) => setMaxDownloads(e.target.value)}
                        placeholder="غير محدود"
                        min="1"
                        className="input-glass text-sm"
                      />
                    </div>
                  )}

                  {/* Warning */}
                  <div className="flex items-start gap-2 glass rounded-2xl p-3 border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/60">
                      أي شخص لديه الرابط يمكنه الوصول للملف. تأكد من مشاركة الرابط مع الأشخاص الموثوقين فقط.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={creating || (withPassword && !password.trim())}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>جاري الإنشاء...</span></>
                    ) : (
                      <><Link className="w-4 h-4" /><span>إنشاء رابط المشاركة</span></>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* ── Done step ── */}
              {step === 'done' && (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  {/* Success icon */}
                  <div className="text-center py-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="font-bold text-white">تم إنشاء الرابط!</p>
                    <p className="text-xs text-white/50 mt-1">انسخ الرابط وشاركه مع من تريد</p>
                  </div>

                  {/* Link box */}
                  <div className="glass rounded-2xl p-3 flex items-center gap-2">
                    <p className="flex-1 text-xs text-royal-300 truncate font-mono">{shareUrl}</p>
                    <button onClick={copyLink}
                      className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        copied ? 'bg-emerald-500/20 text-emerald-400' : 'glass text-white/60 hover:text-white'
                      }`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Share meta */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'الصلاحية', value: shareTypeOptions.find(o => o.id === shareType)?.label ?? '' },
                      { label: 'الانتهاء', value: expiresIn === 0 ? 'لا ينتهي' : EXPIRE_OPTIONS.find(o => o.value === expiresIn)?.label ?? '' },
                      { label: 'الحماية', value: withPassword ? '🔒 محمي' : '🔓 مفتوح' },
                    ].map((s, i) => (
                      <div key={i} className="glass rounded-xl p-2">
                        <p className="text-xs text-white/40">{s.label}</p>
                        <p className="text-xs font-semibold text-white mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Share via */}
                  <div>
                    <p className="text-xs text-white/50 mb-2 text-center">مشاركة عبر</p>
                    <div className="flex justify-center gap-3">
                      {[
                        { icon: '📧', label: 'البريد', action: () => window.open(`mailto:?subject=مشاركة ملف&body=${encodeURIComponent(shareUrl)}`) },
                        { icon: '💬', label: 'واتساب', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`) },
                        { icon: '📋', label: 'نسخ',    action: copyLink },
                      ].map((btn, i) => (
                        <button key={i} onClick={btn.action}
                          className="flex flex-col items-center gap-1 glass rounded-xl px-4 py-2 hover:bg-white/10 transition-all">
                          <span className="text-xl">{btn.icon}</span>
                          <span className="text-xs text-white/60">{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setStep('config')}
                      className="btn-ghost flex-1 text-sm py-2.5">
                      إنشاء رابط جديد
                    </button>
                    <button onClick={onClose}
                      className="btn-primary flex-1 text-sm py-2.5">
                      إغلاق
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
