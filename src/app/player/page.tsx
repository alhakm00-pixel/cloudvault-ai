'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layout/AppLayout'
import AIPanel from '@/components/ai/AIPanel'
import { useAppStore } from '@/lib/store'
import {
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  SkipBack, SkipForward, Settings2, Subtitles, ChevronLeft,
  ChevronRight, ListVideo, X, Download, Share2, Cpu,
  RotateCcw, RotateCw, Film
} from 'lucide-react'

const demoVideos = [
  { id: '1', title: 'مشروع التصميم النهائي', duration: '45:32', size: '2.4 GB', thumb: '🎬', hasSubtitles: true },
  { id: '2', title: 'فيديو تعليمي - Next.js كامل', duration: '1:24:15', size: '1.8 GB', thumb: '💻', hasSubtitles: false },
  { id: '3', title: 'اجتماع الفريق - يناير', duration: '58:44', size: '890 MB', thumb: '👥', hasSubtitles: true },
  { id: '4', title: 'رحلة دبي 2024', duration: '12:30', size: '456 MB', thumb: '✈️', hasSubtitles: false },
  { id: '5', title: 'درس فوتوشوب متقدم', duration: '2:10:05', size: '3.2 GB', thumb: '🎨', hasSubtitles: true },
]

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function PlayerPage() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [progress, setProgress] = useState(0)
  const [duration] = useState(2732)
  const [current, setCurrent] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(demoVideos[0])
  const [showPlaylist, setShowPlaylist] = useState(true)
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [aiMode, setAiMode] = useState(false)
  const controlsTimeout = useRef<NodeJS.Timeout>()

  // Simulate progress
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setCurrent((c) => {
        const next = c + playbackRate
        setProgress((next / duration) * 100)
        return next >= duration ? 0 : next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [playing, duration, playbackRate])

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeout.current)
    if (playing) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  const subtitle = showSubtitles ? 'هذا مقطع من محتوى الفيديو التعليمي المترجم تلقائياً بواسطة الذكاء الاصطناعي إلى اللغة العربية' : null

  return (
    <AppLayout title="مشغل الفيديو" subtitle="تشغيل وإدارة مقاطع الفيديو">
      <div className="flex gap-5 h-full">
        {/* Main player */}
        <div className={`flex-1 flex flex-col gap-4 min-w-0 ${!showPlaylist ? 'w-full' : ''}`}>
          {/* Video screen */}
          <div
            className="relative bg-black rounded-3xl overflow-hidden group"
            style={{ aspectRatio: '16/9' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
          >
            {/* Video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-pulse-slow">{selectedVideo.thumb}</div>
                <p className="text-white/60 text-sm">{selectedVideo.title}</p>
                {!playing && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 text-xs text-white/30"
                  >
                    انقر للتشغيل
                  </motion.div>
                )}
              </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

            {/* Subtitles */}
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-20 inset-x-0 flex justify-center px-8"
                >
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 text-center max-w-2xl">
                    <p className="text-white text-sm leading-relaxed">{subtitle}</p>
                    <p className="text-royal-300 text-xs mt-0.5 flex items-center justify-center gap-1">
                      <Cpu className="w-3 h-3" />ترجمة AI — عربي
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 bottom-0 p-4"
                >
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div
                      className="h-1 bg-white/20 rounded-full cursor-pointer group/bar"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const pct = (x / rect.width) * 100
                        setProgress(pct)
                        setCurrent((pct / 100) * duration)
                      }}
                    >
                      <div className="h-full bg-gradient-to-r from-royal-500 to-violet-500 rounded-full relative" style={{ width: `${progress}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-white/50 mt-1">
                      <span>{formatTime(current)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setCurrent(Math.max(0, current - 10))} className="text-white/70 hover:text-white transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button onClick={() => {}} className="text-white/70 hover:text-white">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPlaying(!playing)}
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center hover:scale-110 transition-transform shadow-glow-sm"
                    >
                      {playing
                        ? <Pause className="w-5 h-5 text-white fill-white" />
                        : <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      }
                    </button>
                    <button onClick={() => {}} className="text-white/70 hover:text-white">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrent(Math.min(duration, current + 10))} className="text-white/70 hover:text-white transition-colors">
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <div className="flex-1" />

                    {/* Volume */}
                    <button onClick={() => setMuted(!muted)} className="text-white/70 hover:text-white">
                      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range" min="0" max="100" value={muted ? 0 : volume}
                      onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
                      className="w-20 h-1 accent-royal-500"
                    />

                    {/* Speed */}
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(Number(e.target.value))}
                      className="text-xs bg-transparent text-white/70 border-none outline-none cursor-pointer"
                    >
                      {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => (
                        <option key={r} value={r} className="bg-gray-900">{r}x</option>
                      ))}
                    </select>

                    {/* Subtitles toggle */}
                    <button
                      onClick={() => setShowSubtitles(!showSubtitles)}
                      className={`transition-colors ${showSubtitles ? 'text-royal-400' : 'text-white/40'}`}
                    >
                      <Subtitles className="w-4 h-4" />
                    </button>

                    {/* Playlist toggle */}
                    <button onClick={() => setShowPlaylist(!showPlaylist)} className="text-white/70 hover:text-white">
                      <ListVideo className="w-4 h-4" />
                    </button>

                    {/* Fullscreen */}
                    <button onClick={() => setFullscreen(!fullscreen)} className="text-white/70 hover:text-white">
                      {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center play button */}
            {!playing && showControls && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
              </motion.button>
            )}
          </div>

          {/* Video info + AI */}
          <div className="glass-card rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">{selectedVideo.title}</h2>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span>{selectedVideo.duration}</span>
                  <span>•</span>
                  <span>{selectedVideo.size}</span>
                  {selectedVideo.hasSubtitles && (
                    <><span>•</span><span className="text-royal-400 flex items-center gap-1"><Cpu className="w-3 h-3" />ترجمة AI</span></>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />تحميل
                </button>
                <button className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />مشاركة
                </button>
              </div>
            </div>

            {/* AI panel */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setAiMode(!aiMode)}
                className="flex items-center gap-2 text-sm font-medium text-royal-300 hover:text-royal-200 transition-colors"
              >
                <Cpu className="w-4 h-4" />
                <span>مساعد AI — ترجمة، ملخص، بحث</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${aiMode ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {aiMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'توليد ترجمة', icon: '📝', action: 'subtitle' },
                        { label: 'ترجمة عربي', icon: '🌍', action: 'translate' },
                        { label: 'ملخص AI', icon: '🤖', action: 'summary' },
                        { label: 'بحث في المحتوى', icon: '🔍', action: 'search' },
                      ].map((btn) => (
                        <button
                          key={btn.action}
                          className="glass rounded-xl p-3 text-center hover:border-royal-500/40 transition-all text-xs"
                        >
                          <div className="text-xl mb-1">{btn.icon}</div>
                          <div className="text-white/70">{btn.label}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden lg:flex flex-col glass-card rounded-3xl overflow-hidden"
              style={{ minWidth: 280 }}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-royal-400" />
                  <span className="font-bold text-white text-sm">قائمة التشغيل</span>
                </div>
                <button onClick={() => setShowPlaylist(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {demoVideos.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVideo(v)}
                    className={`w-full text-right flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      selectedVideo.id === v.id
                        ? 'bg-gradient-to-r from-royal-500/20 to-violet-500/10 border border-royal-500/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      selectedVideo.id === v.id ? 'bg-royal-500/30' : 'glass'
                    }`}>
                      {selectedVideo.id === v.id && playing ? '▶️' : v.thumb}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{v.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/40">{v.duration}</span>
                        {v.hasSubtitles && <span className="text-xs text-royal-400/70">CC</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  )
}
