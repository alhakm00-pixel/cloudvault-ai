'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Download, Share2, Star, ZoomIn, ZoomOut,
  RotateCw, ChevronLeft, ChevronRight, Maximize2,
  Volume2, VolumeX, Play, Pause, Cpu, FileText,
  Image as ImageIcon, Film, Music, Archive, File
} from 'lucide-react'
import { formatBytes, formatDate } from '@/lib/utils'
import type { FileItem } from '@/lib/store'

interface FilePreviewProps {
  file: FileItem | null
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  hasNext?: boolean
  hasPrev?: boolean
  onToggleStar?: (id: string) => void
  onShare?: (id: string) => void
}

// ─── Image Viewer ─────────────────────────────────────────────────────────────
function ImageViewer({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom]       = useState(1)
  const [rotate, setRotate]   = useState(0)
  const [dragging, setDragging] = useState(false)
  const [pos, setPos]         = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  return (
    <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black/40 rounded-2xl select-none">
      <motion.img
        src={src}
        alt={alt}
        style={{
          transform: `scale(${zoom}) rotate(${rotate}deg) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`,
          cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
          maxWidth: '100%', maxHeight: '100%',
          objectFit: 'contain',
        }}
        className="max-h-full w-auto transition-transform duration-150"
        onMouseDown={(e) => { setDragging(true); setStartPos({ x: e.clientX - pos.x, y: e.clientY - pos.y }) }}
        onMouseMove={(e) => { if (dragging) setPos({ x: e.clientX - startPos.x, y: e.clientY - startPos.y }) }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onDoubleClick={() => { setZoom(z => z === 1 ? 2 : 1); setPos({ x: 0, y: 0 }) }}
      />

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-card rounded-2xl px-3 py-2">
        <button onClick={() => { setZoom(z => Math.max(0.5, z - 0.25)); setPos({ x: 0, y: 0 }) }}
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-white/60 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => { setZoom(z => Math.min(5, z + 0.25)) }}
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button onClick={() => setRotate(r => r + 90)}
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={() => { setZoom(1); setRotate(0); setPos({ x: 0, y: 0 }) }}
          className="text-xs text-white/50 hover:text-white px-2 transition-colors">
          إعادة
        </button>
      </div>
    </div>
  )
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ src, mimeType }: { src: string; mimeType: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying]   = useState(false)
  const [muted, setMuted]       = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent]   = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef<NodeJS.Timeout>()

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) videoRef.current.pause()
    else         videoRef.current.play()
    setPlaying(!playing)
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const onMouseMove = () => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    if (playing) hideTimer.current = setTimeout(() => setShowControls(false), 2500)
  }

  return (
    <div
      className="relative flex-1 bg-black rounded-2xl overflow-hidden flex items-center justify-center"
      onMouseMove={onMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        className="max-h-full max-w-full"
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          setCurrent(v.currentTime)
          setProgress((v.currentTime / v.duration) * 100 || 0)
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />

      {/* Centre play */}
      {!playing && (
        <button onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            {/* Seek */}
            <div className="mb-3">
              <input type="range" min={0} max={100} value={progress}
                onChange={(e) => {
                  const v = videoRef.current
                  if (!v) return
                  const t = (Number(e.target.value) / 100) * v.duration
                  v.currentTime = t; setProgress(Number(e.target.value))
                }}
                className="w-full h-1 accent-royal-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>{fmt(current)}</span><span>{fmt(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center">
                {playing
                  ? <Pause className="w-4 h-4 text-white fill-white" />
                  : <Play  className="w-4 h-4 text-white fill-white ml-0.5" />}
              </button>
              <button onClick={() => setMuted(!muted)} className="text-white/60 hover:text-white">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="flex-1" />
              <button onClick={() => videoRef.current?.requestFullscreen()}
                className="text-white/60 hover:text-white">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Audio Player ─────────────────────────────────────────────────────────────
function AudioPlayer({ src, fileName }: { src: string; fileName: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent]   = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted]       = useState(false)
  const [volume, setVolume]     = useState(1)

  const fmt = (s: number) => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) audioRef.current.pause()
    else         audioRef.current.play()
    setPlaying(!playing)
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 text-center">
        {/* Animated wave */}
        <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-lg relative">
          <Music className="w-12 h-12 text-white" />
          {playing && (
            <div className="absolute inset-0 rounded-full border-2 border-royal-400/40 animate-ping" />
          )}
        </div>
        <p className="font-bold text-white mb-6 truncate">{fileName}</p>

        <audio
          ref={audioRef}
          src={src}
          muted={muted}
          onTimeUpdate={(e) => {
            const a = e.currentTarget
            setCurrent(a.currentTime)
            setProgress((a.currentTime / a.duration) * 100 || 0)
          }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setPlaying(false)}
        />

        <input type="range" min={0} max={100} value={progress}
          onChange={(e) => {
            const a = audioRef.current; if (!a) return
            a.currentTime = (Number(e.target.value) / 100) * a.duration
            setProgress(Number(e.target.value))
          }}
          className="w-full h-1 accent-royal-500 mb-2 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-white/50 mb-5">
          <span>{fmt(current)}</span><span>{fmt(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setMuted(!muted)} className="text-white/60 hover:text-white">
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-md hover:scale-110 transition-transform">
            {playing
              ? <Pause className="w-6 h-6 text-white fill-white" />
              : <Play  className="w-6 h-6 text-white fill-white ml-0.5" />}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={volume}
            onChange={(e) => {
              const v = Number(e.target.value); setVolume(v)
              if (audioRef.current) audioRef.current.volume = v
            }}
            className="w-20 h-1 accent-royal-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────
function PdfViewer({ src }: { src: string }) {
  return (
    <div className="flex-1 rounded-2xl overflow-hidden bg-white/5">
      <iframe
        src={`${src}#toolbar=1&navpanes=0&scrollbar=1`}
        className="w-full h-full"
        title="PDF Preview"
      />
    </div>
  )
}

// ─── Text Viewer ──────────────────────────────────────────────────────────────
function TextViewer({ src }: { src: string }) {
  const [text, setText] = useState<string>('جاري التحميل...')
  useEffect(() => {
    fetch(src).then(r => r.text()).then(setText).catch(() => setText('تعذّر تحميل الملف النصي'))
  }, [src])

  return (
    <div className="flex-1 glass rounded-2xl overflow-auto p-6">
      <pre className="text-sm text-white/80 font-mono leading-relaxed whitespace-pre-wrap">{text}</pre>
    </div>
  )
}

// ─── Generic placeholder ──────────────────────────────────────────────────────
function FilePlaceholder({ file }: { file: FileItem }) {
  const icons: Record<string, React.ElementType> = {
    'image/':       ImageIcon,
    'video/':       Film,
    'audio/':       Music,
    'application/pdf': FileText,
    'text/':        FileText,
    'application/zip': Archive,
  }
  const Icon = Object.entries(icons).find(([k]) => file.type.startsWith(k))?.[1] ?? File

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center">
        <Icon className="w-12 h-12 text-white/50" />
      </div>
      <p className="text-white/50 text-sm">لا تتوفر معاينة لهذا النوع من الملفات</p>
      <p className="text-white/30 text-xs">{file.type}</p>
    </div>
  )
}

// ─── Main FilePreview modal ───────────────────────────────────────────────────
export default function FilePreview({
  file, onClose, onNext, onPrev, hasNext, hasPrev,
  onToggleStar, onShare,
}: FilePreviewProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext()
      if (e.key === 'ArrowLeft'  && onPrev && hasPrev) onPrev()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, onNext, onPrev, hasNext, hasPrev])

  if (!file) return null

  const isImage  = file.type.startsWith('image/')
  const isVideo  = file.type.startsWith('video/')
  const isAudio  = file.type.startsWith('audio/')
  const isPdf    = file.type === 'application/pdf'
  const isText   = file.type.startsWith('text/')
  const fileUrl  = file.url

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col"
        style={{ direction: 'rtl' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-3 glass border-b border-white/10 flex-shrink-0">
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{file.name}</p>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span>{formatBytes(file.size)}</span>
              <span>·</span>
              <span>{formatDate(file.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleStar && (
              <button onClick={() => onToggleStar(file.id)}
                className={`w-9 h-9 rounded-xl glass flex items-center justify-center transition-all ${file.starred ? 'text-amber-400' : 'text-white/40 hover:text-white'}`}>
                <Star className={`w-4 h-4 ${file.starred ? 'fill-current' : ''}`} />
              </button>
            )}
            {onShare && (
              <button onClick={() => onShare(file.id)}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white transition-all">
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <a href={fileUrl} download={file.name}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white transition-all">
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-stretch overflow-hidden p-4 gap-4 min-h-0">
          {/* Prev button */}
          {hasPrev && (
            <button onClick={onPrev}
              className="flex-shrink-0 w-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Viewer */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {isImage && fileUrl && <ImageViewer src={fileUrl} alt={file.name} />}
            {isVideo && fileUrl && <VideoPlayer src={fileUrl} mimeType={file.type} />}
            {isAudio && fileUrl && <AudioPlayer src={fileUrl} fileName={file.name} />}
            {isPdf   && fileUrl && <PdfViewer   src={fileUrl} />}
            {isText  && fileUrl && <TextViewer  src={fileUrl} />}
            {!isImage && !isVideo && !isAudio && !isPdf && !isText && <FilePlaceholder file={file} />}
          </div>

          {/* Next button */}
          {hasNext && (
            <button onClick={onNext}
              className="flex-shrink-0 w-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
