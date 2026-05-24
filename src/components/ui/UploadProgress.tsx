'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, XCircle, Upload, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { UploadItem } from '@/hooks/useUpload'
import { formatBytes } from '@/lib/utils'

interface Props {
  uploads: UploadItem[]
  onCancel: (id: string) => void
  onClear: () => void
}

export default function UploadProgress({ uploads, onCancel, onClear }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const active = uploads.filter((u) => u.status === 'uploading').length
  const done   = uploads.filter((u) => u.status === 'done').length
  const errors = uploads.filter((u) => u.status === 'error').length

  if (uploads.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      className="fixed bottom-6 left-6 z-50 w-80 glass-card rounded-3xl overflow-hidden shadow-glow-md"
      style={{ direction: 'rtl' }}
    >
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Upload className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">
            {active > 0 ? `جاري رفع ${active} ملف` : 'اكتمل الرفع'}
          </p>
          <p className="text-xs text-white/50">{done} مكتمل · {errors} خطأ · {uploads.length} إجمالي</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(!collapsed)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onClear} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="max-h-64 overflow-y-auto p-3 space-y-2">
              {uploads.map((u) => (
                <div key={u.id} className="glass rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    {u.status === 'done'      && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {u.status === 'error'     && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                    {u.status === 'cancelled' && <XCircle className="w-4 h-4 text-white/30 flex-shrink-0" />}
                    {(u.status === 'uploading' || u.status === 'pending') && (
                      <div className="w-4 h-4 border-2 border-royal-400/40 border-t-royal-400 rounded-full animate-spin flex-shrink-0" />
                    )}
                    <p className="text-xs text-white/80 flex-1 truncate">{u.file.name}</p>
                    <span className="text-xs text-white/40 flex-shrink-0">{formatBytes(u.file.size)}</span>
                    {u.status === 'uploading' && (
                      <button onClick={() => onCancel(u.id)} className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {(u.status === 'uploading' || u.status === 'pending') && (
                    <>
                      <div className="progress-bar mb-1">
                        <div className="progress-fill" style={{ width: `${u.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-royal-400">{u.progress}%</span>
                        {u.speed > 0 && (
                          <span className="text-xs text-white/40">
                            {u.speed > 1e6 ? `${(u.speed / 1e6).toFixed(1)} MB/s` : `${(u.speed / 1e3).toFixed(0)} KB/s`}
                            {u.eta > 0 && ` · ${Math.round(u.eta)}ث`}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {u.status === 'error' && <p className="text-xs text-red-400 mt-0.5">{u.error ?? 'فشل الرفع'}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
