'use client'

import { motion } from 'framer-motion'
import { WifiOff, RotateCcw, Film, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { useContinueWatching } from '@/hooks/useContinueWatching'

export default function OfflinePage() {
  const { continueWatching } = useContinueWatching()

  return (
    <div className="min-h-screen flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-6"
        >
          <WifiOff className="w-12 h-12 text-white/40" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-3xl font-black text-white mb-3">أنت غير متصل</h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            لا يوجد اتصال بالإنترنت، لكن يمكنك تشغيل الفيديوهات المحفوظة مسبقاً.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button onClick={() => window.location.reload()} className="btn-primary flex items-center justify-center gap-2 py-3 px-6">
              <RotateCcw className="w-4 h-4" /><span>إعادة المحاولة</span>
            </button>
            <Link href="/files" className="btn-ghost flex items-center justify-center gap-2 py-3 px-6">
              <FolderOpen className="w-4 h-4" /><span>الملفات المحفوظة</span>
            </Link>
          </div>
        </motion.div>

        {continueWatching.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-3xl p-5 text-right">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-4 h-4 text-violet-400" />
              <h3 className="font-bold text-white text-sm">متابعة المشاهدة</h3>
            </div>
            <div className="space-y-3">
              {continueWatching.slice(0, 3).map((item, i) => (
                <Link key={i} href={`/player?fileId=${item.fileId}&t=${Math.floor(item.currentTime)}`}
                  className="flex items-center gap-3 p-3 glass rounded-2xl hover:bg-white/8 transition-all">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl flex-shrink-0">🎬</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-white/10 rounded-full">
                        <div className="h-full bg-gradient-to-r from-royal-500 to-violet-500 rounded-full" style={{ width: `${item.percent}%` }} />
                      </div>
                      <span className="text-xs text-white/40">{Math.round(item.percent)}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 grid grid-cols-3 gap-3">
          {[['🎬','فيديوهات محفوظة'],['📁','ملفات مؤقتة'],['📝','ترجمات محلية']].map(([icon, label], i) => (
            <div key={i} className="glass-card rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs text-white/50">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
