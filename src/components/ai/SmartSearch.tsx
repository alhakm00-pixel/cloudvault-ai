'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Cpu, Clock, Film, Image, FileText, Music, File, Loader2, TrendingUp, Sparkles } from 'lucide-react'
import { useAppStore, type FileItem } from '@/lib/store'
import { formatBytes } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const SUGGESTIONS = ['فيديو', 'تقرير', 'صور', 'موسيقى', 'مشروع', 'نسخة احتياطية', 'عرض تقديمي']

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('video/'))       return <Film     className="w-4 h-4 text-violet-400" />
  if (mimeType.startsWith('image/'))       return <Image    className="w-4 h-4 text-pink-400" />
  if (mimeType.startsWith('audio/'))       return <Music    className="w-4 h-4 text-green-400" />
  if (mimeType === 'application/pdf')      return <FileText className="w-4 h-4 text-red-400" />
  return <File className="w-4 h-4 text-royal-400" />
}

interface SmartSearchProps {
  open:     boolean
  onClose:  () => void
}

export default function SmartSearch({ open, onClose }: SmartSearchProps) {
  const { files } = useAppStore()
  const router    = useRouter()
  const inputRef  = useRef<HTMLInputElement>(null)

  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [mode,    setMode]    = useState<'keyword' | 'ai'>('keyword')
  const [selected, setSelected] = useState(0)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery(''); setResults([]); setSelected(0)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowDown')  setSelected(s => Math.min(s + 1, results.length - 1))
      if (e.key === 'ArrowUp')    setSelected(s => Math.max(s - 1, 0))
      if (e.key === 'Enter' && results[selected]) {
        router.push(`/files?preview=${results[selected].id}`)
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, results, selected, onClose, router])

  // Search logic
  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)

    setTimeout(() => {
      const lower = q.toLowerCase()
      let found = files.filter(f =>
        f.name.toLowerCase().includes(lower) ||
        f.tags.some(t => t.toLowerCase().includes(lower)) ||
        f.type.includes(lower)
      )

      // AI mode: also match by type keywords
      if (mode === 'ai') {
        const typeMap: Record<string, string> = {
          'فيديو': 'video/', 'صور': 'image/', 'صورة': 'image/',
          'موسيقى': 'audio/', 'صوت': 'audio/', 'مستندات': 'pdf',
          'ملفات مضغوطة': 'zip',
        }
        const mimeFilter = Object.entries(typeMap).find(([k]) => lower.includes(k))?.[1]
        if (mimeFilter) found = [...new Set([...found, ...files.filter(f => f.type.includes(mimeFilter))])]
      }

      setResults(found.slice(0, 8))
      setSelected(0)
      setLoading(false)
    }, mode === 'ai' ? 600 : 100)
  }, [files, mode])

  useEffect(() => { doSearch(query) }, [query, doSearch])

  const recent = files.slice(0, 4)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4"
          style={{ direction: 'rtl' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{ scale: 0.95,   opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-2xl glass-card rounded-3xl overflow-hidden shadow-glow-lg"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              {loading
                ? <Loader2 className="w-5 h-5 text-royal-400 animate-spin flex-shrink-0" />
                : mode === 'ai'
                  ? <Cpu    className="w-5 h-5 text-royal-400 flex-shrink-0" />
                  : <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
              }
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={mode === 'ai' ? 'ابحث بالذكاء الاصطناعي... "فيديوهات الأسبوع الماضي"' : 'ابحث عن ملف...'}
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base"
              />
              <div className="flex items-center gap-2">
                {/* Mode toggle */}
                <button
                  onClick={() => setMode(m => m === 'keyword' ? 'ai' : 'keyword')}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    mode === 'ai'
                      ? 'border-royal-500/50 bg-royal-500/10 text-royal-300'
                      : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />AI
                </button>
                {query && (
                  <button onClick={() => { setQuery(''); setResults([]) }}
                    className="text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onClose}
                  className="text-white/40 hover:text-white transition-colors text-xs px-2 py-1 glass rounded-lg">
                  ESC
                </button>
              </div>
            </div>

            {/* Results / Recent */}
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Empty state — show suggestions */}
              {!query && (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" />الأخيرة</p>
                    <div className="space-y-1">
                      {recent.map((f, i) => (
                        <button key={i} onClick={() => { setQuery(f.name) }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-right">
                          <FileTypeIcon mimeType={f.type} />
                          <span className="text-sm text-white/70 flex-1 truncate">{f.name}</span>
                          <span className="text-xs text-white/30">{formatBytes(f.size)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" />اقتراحات</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => setQuery(s)}
                          className="glass rounded-xl px-3 py-1.5 text-xs text-white/60 hover:text-white hover:border-royal-500/30 transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Search results */}
              {query && (
                <div className="p-2">
                  {results.length === 0 && !loading && (
                    <div className="text-center py-10">
                      <Search className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">لا توجد نتائج لـ &quot;{query}&quot;</p>
                      {mode === 'keyword' && (
                        <button onClick={() => setMode('ai')}
                          className="mt-3 text-xs text-royal-400 hover:text-royal-300 flex items-center gap-1 mx-auto">
                          <Sparkles className="w-3 h-3" />جرّب البحث الذكي
                        </button>
                      )}
                    </div>
                  )}

                  {results.map((file, i) => (
                    <motion.button
                      key={file.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { router.push(`/files`); onClose() }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-right transition-all ${
                        selected === i ? 'bg-royal-500/10 border border-royal-500/20' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0 text-lg">
                        {file.thumbnail
                          ? <img src={file.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" />
                          : file.type.startsWith('video/') ? '🎬'
                          : file.type.startsWith('image/') ? '🖼️'
                          : file.type.startsWith('audio/') ? '🎵'
                          : file.type.includes('pdf') ? '📄' : '📁'
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {/* Highlight matching text */}
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-white/40">{formatBytes(file.size)}</span>
                          {file.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full text-white/50">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <FileTypeIcon mimeType={file.type} />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1"><kbd className="glass rounded px-1.5 py-0.5 font-mono">↑↓</kbd> تنقل</span>
                <span className="flex items-center gap-1"><kbd className="glass rounded px-1.5 py-0.5 font-mono">Enter</kbd> فتح</span>
                <span className="flex items-center gap-1"><kbd className="glass rounded px-1.5 py-0.5 font-mono">Esc</kbd> إغلاق</span>
              </div>
              {mode === 'ai' && (
                <div className="flex items-center gap-1 text-xs text-royal-400">
                  <Sparkles className="w-3 h-3" /><span>بحث ذكي مفعّل</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
