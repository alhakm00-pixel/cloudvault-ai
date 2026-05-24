'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle2, XCircle, ChevronUp, ChevronDown, Pause, RotateCcw } from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'
import { formatBytes } from '@/lib/utils'

function SpeedEta({ speed, eta }: { speed: number; eta: number }) {
  const speedLabel = speed > 1e6 ? `${(speed / 1e6).toFixed(1)} MB/s`
    : speed > 1e3 ? `${(speed / 1e3).toFixed(0)} KB/s`
    : `${speed.toFixed(0)} B/s`
  const etaLabel = !eta || !isFinite(eta) ? '' :
    eta > 3600 ? `${Math.floor(eta / 3600)}س ${Math.floor((eta % 3600) / 60)}د` :
    eta > 60   ? `${Math.floor(eta / 60)} دقيقة` :
    `${Math.round(eta)} ثانية`
  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      {speed > 0 && <span>{speedLabel}</span>}
      {etaLabel   && <span>· متبقي {etaLabel}</span>}
    </div>
  )
}

export default function UploadQueue() {
  const { uploads, cancelUpload, clearCompleted, activeCount, totalProgress } = useUpload()
  const [collapsed, setCollapsed] = useState(false)

  if (uploads.length === 0) return null

  const done    = uploads.filter(u => u.status === 'done').length
  const errors  = uploads.filter(u => u.status === 'error').length
  const pending = uploads.filter(u => u.status === 'uploading' || u.status === 'pending').length

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      exit={{ y: 120,   opacity: 0 }}
      className="fixed bottom-6 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-84 max-w-sm"
      style={{ direction: 'rtl' }}
    >
      <div className="glass-card rounded-3xl overflow-hidden shadow-glow-md border border-royal-500/20">
        {/* Header */}
        <div
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {/* Overall progress ring */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="url(#prog)" strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - totalProgress / 100)}`}
                strokeLinecap="round" className="transition-all duration-300" />
              <defs>
                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {activeCount > 0
                ? <Upload className="w-4 h-4 text-royal-400" />
                : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">
              {activeCount > 0 ? `جاري رفع ${activeCount} ملف` : 'اكتمل الرفع'}
            </p>
            <p className="text-xs text-white/50">
              {done > 0 && `${done} مكتمل`}
              {errors > 0 && ` · ${errors} خطأ`}
              {pending > 0 && ` · ${pending} جاري`}
              {totalProgress > 0 && totalProgress < 100 && ` · ${totalProgress}%`}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {(done > 0 || errors > 0) && (
              <button
                onClick={e => { e.stopPropagation(); clearCompleted() }}
                className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/30 hover:text-white transition-all"
                title="مسح المكتملة"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/30 hover:text-white transition-all">
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Items */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="max-h-72 overflow-y-auto border-t border-white/10 p-3 space-y-2">
                {uploads.map(u => (
                  <div key={u.id} className="glass rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      {/* Status icon */}
                      {u.status === 'done'      && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      {u.status === 'error'     && <XCircle      className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      {u.status === 'cancelled' && <XCircle      className="w-4 h-4 text-white/20 flex-shrink-0" />}
                      {(u.status === 'uploading' || u.status === 'pending') && (
                        <div className="w-4 h-4 border-2 border-royal-500/40 border-t-royal-400 rounded-full animate-spin flex-shrink-0" />
                      )}

                      <p className="text-xs text-white/80 flex-1 truncate">{u.file.name}</p>
                      <span className="text-xs text-white/40 flex-shrink-0">{formatBytes(u.file.size)}</span>

                      {u.status === 'uploading' && (
                        <button
                          onClick={() => cancelUpload(u.id)}
                          className="w-5 h-5 rounded flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {(u.status === 'uploading' || u.status === 'pending') && (
                      <>
                        {/* Progress bar */}
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                          <motion.div
                            className="h-full bg-gradient-to-r from-royal-500 via-violet-500 to-purple-500 rounded-full"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            initial={{ width: '0%' }}
                            animate2={{ width: `${u.progress}%` }}
                            style2={{ width: `${u.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-royal-400 font-medium">{u.progress}%</span>
                          <SpeedEta speed={u.speed} eta={u.eta} />
                        </div>
                      </>
                    )}

                    {u.status === 'error' && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-red-400 flex-1">{u.error ?? 'فشل الرفع'}</p>
                        <button className="text-xs text-royal-400 hover:text-royal-300 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> إعادة
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
