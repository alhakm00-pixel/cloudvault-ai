'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import AppLayout from '@/components/layout/AppLayout'
import { useAppStore, type FileItem } from '@/lib/store'
import { formatBytes, formatDate, getFileColor, generateId } from '@/lib/utils'
import {
  Grid3X3, List, Upload, SortAsc, Filter, Star, Share2,
  Trash2, Download, MoreVertical, Play, Eye, FolderOpen,
  ChevronDown, Search, X, Check, Film, Image, Music,
  FileText, Archive, File, Package, Plus, LayoutGrid
} from 'lucide-react'
import toast from 'react-hot-toast'
import FilePreview from '@/components/preview/FilePreview'
import ShareModal from '@/components/preview/ShareModal'

function FileIcon({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' }[size]
  if (type.startsWith('video/')) return <span className={sizeClass}>🎬</span>
  if (type.startsWith('image/')) return <span className={sizeClass}>🖼️</span>
  if (type.startsWith('audio/')) return <span className={sizeClass}>🎵</span>
  if (type.includes('pdf')) return <span className={sizeClass}>📄</span>
  if (type.includes('zip') || type.includes('rar')) return <span className={sizeClass}>📦</span>
  if (type.includes('word') || type.includes('doc')) return <span className={sizeClass}>📝</span>
  if (type.includes('excel') || type.includes('sheet')) return <span className={sizeClass}>📊</span>
  if (type.includes('powerpoint') || type.includes('ppt')) return <span className={sizeClass}>📑</span>
  return <span className={sizeClass}>📁</span>
}

function FileCard({ file, onToggleStar, onDelete, onShare }: {
  file: FileItem
  onToggleStar: (id: string) => void
  onDelete: (id: string) => void
  onShare: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const color = getFileColor(file.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-4 group relative cursor-pointer file-item"
      onClick={() => handlePreview(file)}
    >
      {/* Thumbnail / icon */}
      <div className={`h-28 rounded-xl bg-gradient-to-br ${color} opacity-90 flex items-center justify-center mb-3 relative overflow-hidden`}>
        {file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <FileIcon type={file.type} size="lg" />
        )}
        {file.type.startsWith('video/') && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        )}
        {/* Star */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStar(file.id) }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            file.starred ? 'bg-amber-500/80 opacity-100' : 'bg-black/20 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${file.starred ? 'text-white fill-white' : 'text-white'}`} />
        </button>
        {/* Shared badge */}
        {file.shared && (
          <div className="absolute top-2 left-2 bg-royal-500/80 backdrop-blur-sm rounded-lg px-1.5 py-0.5 text-xs text-white flex items-center gap-1">
            <Share2 className="w-3 h-3" />
          </div>
        )}
      </div>

      <p className="text-sm font-semibold text-white truncate mb-1">{file.name}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{formatBytes(file.size)}</span>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute left-0 bottom-full mb-2 w-40 glass-card rounded-xl overflow-hidden z-50 shadow-glass"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {[
                  { icon: Eye,      label: 'معاينة', action: () => {} },
                  { icon: Download, label: 'تحميل',  action: () => toast.success('جاري التحميل...') },
                  { icon: Share2,   label: 'مشاركة', action: () => onShare(file.id) },
                  { icon: Star,     label: file.starred ? 'إلغاء المفضلة' : 'مفضلة', action: () => onToggleStar(file.id) },
                  { icon: Trash2,   label: 'حذف', action: () => onDelete(file.id), danger: true },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); item.action(); setMenuOpen(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors ${
                      (item as any).danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function FileRow({ file, onToggleStar, onDelete, onShare }: {
  file: FileItem
  onToggleStar: (id: string) => void
  onDelete: (id: string) => void
  onShare: (id: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all group"
    >
      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0">
        <FileIcon type={file.type} size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {file.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">{tag}</span>
          ))}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-xs text-white/50">
        <span className="w-20 text-left">{formatBytes(file.size)}</span>
        <span className="w-32 text-left hidden md:block">{formatDate(file.createdAt)}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onToggleStar(file.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Star className={`w-3.5 h-3.5 ${file.starred ? 'text-amber-400 fill-amber-400' : 'text-white/40'}`} />
        </button>
        <button onClick={() => toast.success('جاري التحميل...')} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Download className="w-3.5 h-3.5 text-white/40" />
        </button>
        <button onClick={() => onShare(file.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Share2 className="w-3.5 h-3.5 text-white/40" />
        </button>
        <button onClick={() => onDelete(file.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
        </button>
      </div>
    </motion.div>
  )
}

export default function FilesPage() {
  const { files, viewMode, setViewMode, sortBy, setSortBy, toggleStar, removeFile, searchQuery, addFile, setUploadProgress } = useAppStore()
  const [filter, setFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [previewFile, setPreviewFile] = useState<any>(null)
  const [shareFile, setShareFile]     = useState<any>(null)

  const handleShare = (id: string) => {
    const file = displayed.find(f => f.id === id) ?? null
    setShareFile(file)
  }

  const handlePreview = (file: any) => {
    setPreviewFile(file)
  }

  const previewIndex = previewFile ? displayed.findIndex(f => f.id === previewFile.id) : -1

  const handleDelete = (id: string) => {
    removeFile(id)
    toast.success('تم حذف الملف')
  }

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return
    setUploading(true)
    accepted.forEach((file) => {
      const id = generateId()
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          addFile({
            id, name: file.name, type: file.type || 'application/octet-stream',
            size: file.size, url: URL.createObjectURL(file),
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
            starred: false, shared: false, tags: [],
          })
          setUploadProgress(id, 100)
          toast.success(`✅ تم رفع ${file.name}`)
          setUploading(false)
        }
        setUploadProgress(id, Math.min(progress, 100))
      }, 200)
    })
  }, [addFile, setUploadProgress])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, noClick: true, multiple: true,
  })

  const filterTabs = [
    { id: 'all',    label: 'الكل' },
    { id: 'video',  label: 'فيديو' },
    { id: 'image',  label: 'صور' },
    { id: 'doc',    label: 'مستندات' },
    { id: 'audio',  label: 'موسيقى' },
    { id: 'starred',label: 'المفضلة' },
  ]

  let displayed = [...files]
  if (searchQuery) displayed = displayed.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (filter === 'video')   displayed = displayed.filter(f => f.type.startsWith('video'))
  if (filter === 'image')   displayed = displayed.filter(f => f.type.startsWith('image'))
  if (filter === 'audio')   displayed = displayed.filter(f => f.type.startsWith('audio'))
  if (filter === 'doc')     displayed = displayed.filter(f => f.type.includes('pdf') || f.type.includes('doc') || f.type.includes('sheet'))
  if (filter === 'starred') displayed = displayed.filter(f => f.starred)
  if (sortBy === 'name')    displayed.sort((a, b) => a.name.localeCompare(b.name))
  if (sortBy === 'size')    displayed.sort((a, b) => b.size - a.size)
  if (sortBy === 'date')    displayed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  if (sortBy === 'type')    displayed.sort((a, b) => a.type.localeCompare(b.type))

  return (
    <AppLayout title="ملفاتي" subtitle={`${files.length} ملف — ${formatBytes(files.reduce((s, f) => s + f.size, 0))}`}>
      {/* Drag overlay */}
      <div {...getRootProps()} className="relative">
        <input {...getInputProps()} />

        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="glass-card rounded-3xl p-12 text-center border-2 border-dashed border-royal-400">
                <div className="text-7xl mb-4">☁️</div>
                <p className="text-2xl font-black text-white mb-2">أفلت الملفات هنا</p>
                <p className="text-white/60">سيتم رفعها إلى CloudVault فوراً</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Filter tabs */}
          <div className="flex gap-1 p-1 glass rounded-2xl flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-royal-500 to-violet-500 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-glass py-2 text-xs w-auto pr-3 pl-8 appearance-none cursor-pointer"
            style={{ backgroundImage: 'none' }}
          >
            <option value="date">الأحدث</option>
            <option value="name">الاسم</option>
            <option value="size">الحجم</option>
            <option value="type">النوع</option>
          </select>

          {/* View mode */}
          <div className="flex gap-1 p-1 glass rounded-xl">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-royal-500/50 text-white' : 'text-white/40 hover:text-white'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-royal-500/50 text-white' : 'text-white/40 hover:text-white'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload button */}
          <label className="btn-primary flex items-center gap-2 py-2 px-4 text-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>رفع</span>
            <input type="file" multiple className="hidden" onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))} />
          </label>
        </div>

        {/* Upload zone hint */}
        <div className="upload-zone p-4 mb-5 flex items-center gap-3 cursor-pointer"
          onClick={() => document.querySelector<HTMLInputElement>('input[type=file]')?.click()}
        >
          <div className="w-10 h-10 rounded-xl bg-royal-500/20 flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5 text-royal-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">اسحب الملفات هنا أو انقر للرفع</p>
            <p className="text-xs text-white/40">يدعم جميع الأنواع — حتى 10GB لكل ملف</p>
          </div>
        </div>

        {/* Files */}
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white/60 text-lg">لا توجد ملفات</p>
            <p className="text-white/40 text-sm mt-1">ارفع ملفاتك الأولى لتبدأ</p>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {displayed.map((file) => (
                <FileCard key={file.id} file={file} onToggleStar={toggleStar} onDelete={handleDelete} onShare={handleShare} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10 text-xs text-white/40 font-medium">
              <div className="w-10" />
              <div className="flex-1">الاسم</div>
              <div className="w-20 hidden sm:block">الحجم</div>
              <div className="w-32 hidden md:block">التاريخ</div>
              <div className="w-24" />
            </div>
            <AnimatePresence>
              {displayed.map((file) => (
                <FileRow key={file.id} file={file} onToggleStar={toggleStar} onDelete={handleDelete} onShare={handleShare} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          hasNext={previewIndex < displayed.length - 1}
          hasPrev={previewIndex > 0}
          onNext={() => setPreviewFile(displayed[previewIndex + 1])}
          onPrev={() => setPreviewFile(displayed[previewIndex - 1])}
          onToggleStar={toggleStar}
          onShare={(id) => { setPreviewFile(null); setShareFile(displayed.find(f => f.id === id) ?? null) }}
        />
        <ShareModal
          file={shareFile}
          onClose={() => setShareFile(null)}
        />
      </AppLayout>
    )
  }
