'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Share2, Trash2, Download, Play, MoreVertical } from 'lucide-react'
import type { FileItem } from '@/lib/store'
import { formatBytes, formatDate, getFileColor } from '@/lib/utils'

// ─── Virtual scroll: only renders visible rows ────────────────────────────────
const ITEM_HEIGHT_GRID = 200
const ITEM_HEIGHT_LIST = 64
const OVERSCAN         = 5

interface VirtualFileListProps {
  files:          FileItem[]
  viewMode:       'grid' | 'list'
  onPreview:      (file: FileItem) => void
  onToggleStar:   (id: string) => void
  onDelete:       (id: string) => void
  onShare:        (id: string) => void
  containerHeight?: number
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('video/')) return <span className="text-3xl">🎬</span>
  if (type.startsWith('image/')) return <span className="text-3xl">🖼️</span>
  if (type.startsWith('audio/')) return <span className="text-3xl">🎵</span>
  if (type.includes('pdf'))      return <span className="text-3xl">📄</span>
  if (type.includes('zip'))      return <span className="text-3xl">📦</span>
  if (type.includes('word'))     return <span className="text-3xl">📝</span>
  return <span className="text-3xl">📁</span>
}

function GridCard({ file, onPreview, onToggleStar, onDelete, onShare }: {
  file: FileItem; onPreview: (f: FileItem) => void
  onToggleStar: (id: string) => void; onDelete: (id: string) => void; onShare: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const color = getFileColor(file.type)

  return (
    <motion.div
      layout
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={() => onPreview(file)}
      className="glass-card rounded-2xl p-4 cursor-pointer group relative"
    >
      {/* Thumbnail */}
      <div className={`h-28 rounded-xl bg-gradient-to-br ${color} opacity-90 flex items-center justify-center mb-3 relative overflow-hidden`}>
        {file.thumbnail
          ? <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
          : <FileIcon type={file.type} />}

        {file.type.startsWith('video/') && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        )}

        <button
          onClick={e => { e.stopPropagation(); onToggleStar(file.id) }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            file.starred ? 'bg-amber-500/80 opacity-100' : 'bg-black/20 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${file.starred ? 'text-white fill-white' : 'text-white'}`} />
        </button>
        {file.shared && (
          <div className="absolute top-2 left-2 bg-royal-500/80 backdrop-blur-sm rounded-lg px-1.5 py-0.5 text-xs text-white">
            <Share2 className="w-3 h-3" />
          </div>
        )}
      </div>

      <p className="text-sm font-semibold text-white truncate mb-1">{file.name}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{formatBytes(file.size)}</span>
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div
              className="absolute left-0 bottom-full mb-2 w-36 glass-card rounded-xl overflow-hidden z-50 shadow-glass"
              onMouseLeave={() => setMenuOpen(false)}
            >
              {[
                { icon: Download, label: 'تحميل',  action: () => {} },
                { icon: Share2,   label: 'مشاركة', action: () => onShare(file.id) },
                { icon: Star,     label: file.starred ? 'إلغاء المفضلة' : 'مفضلة', action: () => onToggleStar(file.id) },
                { icon: Trash2,   label: 'حذف',    action: () => onDelete(file.id), danger: true },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); item.action(); setMenuOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors ${
                    (item as any).danger ? 'text-red-400 hover:bg-red-500/10' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ListRow({ file, onPreview, onToggleStar, onDelete, onShare }: {
  file: FileItem; onPreview: (f: FileItem) => void
  onToggleStar: (id: string) => void; onDelete: (id: string) => void; onShare: (id: string) => void
}) {
  return (
    <div
      onClick={() => onPreview(file)}
      className="flex items-center gap-4 px-4 h-16 hover:bg-white/5 cursor-pointer transition-all group border-b border-white/5 last:border-0"
    >
      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0">
        <FileIcon type={file.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {file.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">{tag}</span>
          ))}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-xs text-white/40">
        <span className="w-20 text-left">{formatBytes(file.size)}</span>
        <span className="w-28 text-left hidden md:block">{formatDate(file.createdAt)}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); onToggleStar(file.id) }}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Star className={`w-3.5 h-3.5 ${file.starred ? 'text-amber-400 fill-amber-400' : 'text-white/40'}`} />
        </button>
        <button onClick={e => { e.stopPropagation(); onShare(file.id) }}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Share2 className="w-3.5 h-3.5 text-white/40" />
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(file.id) }}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
        </button>
      </div>
    </div>
  )
}

export default function VirtualFileList({
  files, viewMode, onPreview, onToggleStar, onDelete, onShare, containerHeight = 600,
}: VirtualFileListProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [cols, setCols]           = useState(4)

  // Determine grid columns based on container width
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setCols(w < 480 ? 2 : w < 768 ? 3 : w < 1024 ? 4 : 5)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  if (viewMode === 'list') {
    // Virtual scroll for list mode
    const itemH    = ITEM_HEIGHT_LIST
    const total    = files.length
    const startIdx = Math.max(0, Math.floor(scrollTop / itemH) - OVERSCAN)
    const endIdx   = Math.min(total, Math.ceil((scrollTop + containerHeight) / itemH) + OVERSCAN)
    const visible  = files.slice(startIdx, endIdx)
    const topPad   = startIdx * itemH
    const botPad   = Math.max(0, (total - endIdx) * itemH)

    return (
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="glass-card rounded-3xl overflow-hidden overflow-y-auto"
        style={{ height: containerHeight, maxHeight: containerHeight }}
      >
        {/* Header row */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10 text-xs text-white/40 font-medium sticky top-0 glass z-10">
          <div className="w-10" /><div className="flex-1">الاسم</div>
          <div className="w-20 hidden sm:block">الحجم</div>
          <div className="w-28 hidden md:block">التاريخ</div>
          <div className="w-24" />
        </div>
        <div style={{ paddingTop: topPad }}>
          {visible.map(file => (
            <ListRow key={file.id} file={file}
              onPreview={onPreview} onToggleStar={onToggleStar}
              onDelete={onDelete} onShare={onShare} />
          ))}
        </div>
        <div style={{ height: botPad }} />
      </div>
    )
  }

  // Grid virtual scroll
  const rows       = Math.ceil(files.length / cols)
  const rowH       = ITEM_HEIGHT_GRID + 16
  const startRow   = Math.max(0, Math.floor(scrollTop / rowH) - OVERSCAN)
  const endRow     = Math.min(rows, Math.ceil((scrollTop + containerHeight) / rowH) + OVERSCAN)
  const topPad     = startRow * rowH
  const botPad     = Math.max(0, (rows - endRow) * rowH)

  const visibleFiles = files.slice(startRow * cols, endRow * cols)

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="overflow-y-auto"
      style={{ height: containerHeight, maxHeight: containerHeight }}
    >
      <div style={{ paddingTop: topPad }}>
        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {visibleFiles.map(file => (
            <GridCard key={file.id} file={file}
              onPreview={onPreview} onToggleStar={onToggleStar}
              onDelete={onDelete} onShare={onShare} />
          ))}
        </div>
      </div>
      <div style={{ height: botPad }} />
    </div>
  )
}
