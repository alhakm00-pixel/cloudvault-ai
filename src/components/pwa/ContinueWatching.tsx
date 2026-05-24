'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Clock, RotateCcw } from 'lucide-react'
import { useContinueWatching, type WatchProgress } from '@/hooks/useContinueWatching'
import { useRouter } from 'next/navigation'

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    : `${m}:${String(sec).padStart(2,'0')}`
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const m    = Math.floor(diff / 60000)
  if (m < 1)  return 'الآن'
  if (m < 60) return `منذ ${m} دقيقة`
  const h = Math.floor(m / 60)
  if (h < 24) return `منذ ${h} ساعة`
  return `منذ ${Math.floor(h / 24)} يوم`
}

function ProgressCard({ item, onPlay, onRemove }: {
  item:     WatchProgress
  onPlay:   (item: WatchProgress) => void
  onRemove: (fileId: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 w-48"
      onClick={() => onPlay(item)}
    >
      {/* Thumbnail */}
      <div className="h-28 bg-gradient-to-br from-violet-600/40 to-purple-800/40 flex items-center justify-center relative overflow-hidden">
        {item.thumbnailUrl
          ? <img src={item.thumbnailUrl} alt={item.fileName} className="w-full h-full object-cover" />
          : <span className="text-5xl">🎬</span>
        }

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Remove btn */}
        <button
          onClick={e => { e.stopPropagation(); onRemove(item.fileId) }}
          className="absolute top-1.5 left-1.5 w-6 h-6 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Time badge */}
        <div className="absolute top-1.5 right-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-1.5 py-0.5 text-xs text-white/80 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {formatTime(item.currentTime)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-royal-500 to-violet-500 transition-all"
          style={{ width: `${item.percent}%` }}
        />
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-xs font-semibold text-white truncate">{item.fileName}</p>
        <p className="text-xs text-white/40 mt-0.5">
          {Math.round(item.percent)}% · {timeAgo(item.updatedAt)}
        </p>
      </div>
    </motion.div>
  )
}

export default function ContinueWatching() {
  const { continueWatching, removeProgress, clearAll } = useContinueWatching()
  const router = useRouter()

  if (continueWatching.length === 0) return null

  const handlePlay = (item: WatchProgress) => {
    router.push(`/player?fileId=${item.fileId}&t=${Math.floor(item.currentTime)}`)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-royal-400" />
          <h3 className="font-bold text-white text-sm">متابعة المشاهدة</h3>
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">
            {continueWatching.length}
          </span>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          مسح الكل
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        <AnimatePresence>
          {continueWatching.map(item => (
            <ProgressCard
              key={item.fileId}
              item={item}
              onPlay={handlePlay}
              onRemove={removeProgress}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
