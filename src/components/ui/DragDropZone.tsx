'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CloudUpload, File, CheckCircle2 } from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'
import UploadProgress from './UploadProgress'
import { cn } from '@/lib/utils'

interface DragDropZoneProps {
  folderId?: string
  className?: string
  compact?:   boolean
  children?:  React.ReactNode
}

export default function DragDropZone({
  folderId, className, compact = false, children
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCount,  setDragCount]  = useState(0)
  const dragRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { uploads, uploadFiles, cancelUpload, clearCompleted } = useUpload()

  const handleFiles = useCallback((files: File[]) => {
    if (!files.length) return
    uploadFiles(files, folderId)
  }, [uploadFiles, folderId])

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setDragCount(c => c + 1)
    setIsDragging(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setDragCount(c => {
      const next = c - 1
      if (next <= 0) setIsDragging(false)
      return next
    })
  }
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setIsDragging(false); setDragCount(0)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    handleFiles(files)
    e.target.value = ''
  }

  if (compact) {
    return (
      <>
        <div
          ref={dragRef}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={cn('relative', className)}
        >
          {/* Full-screen drag overlay when dragging */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                style={{ direction: 'rtl' }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="glass-card rounded-3xl p-12 text-center max-w-sm mx-4 border-2 border-dashed border-royal-400/60"
                >
                  <motion.div
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-7xl mb-4"
                  >
                    ☁️
                  </motion.div>
                  <p className="text-2xl font-black text-white mb-2">أفلت الملفات هنا</p>
                  <p className="text-white/60 text-sm">سيتم رفعها إلى CloudVault فوراً</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {children}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onInputChange}
        />

        <UploadProgress
          uploads={uploads}
          onCancel={cancelUpload}
          onClear={clearCompleted}
        />
      </>
    )
  }

  // Full drop zone UI
  return (
    <>
      <div
        ref={dragRef}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'upload-zone rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all',
          isDragging && 'border-royal-400 bg-royal-500/10',
          className,
        )}
        style={{ direction: 'rtl' }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onInputChange}
        />

        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1, y: isDragging ? -4 : 0 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
            isDragging
              ? 'bg-gradient-to-br from-royal-500 to-violet-500 shadow-glow-md'
              : 'bg-white/10'
          }`}
        >
          {isDragging
            ? <CloudUpload className="w-8 h-8 text-white" />
            : <Upload      className="w-8 h-8 text-white/50" />
          }
        </motion.div>

        <div className="text-center">
          <p className="font-semibold text-white mb-1">
            {isDragging ? 'أفلت الملفات هنا' : 'اسحب الملفات أو انقر للرفع'}
          </p>
          <p className="text-sm text-white/50">
            يدعم جميع الأنواع · حتى 10GB لكل ملف · رفع متعدد
          </p>
        </div>

        {/* Active uploads count badge */}
        {uploads.filter(u => u.status === 'uploading').length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-royal-500/20 border border-royal-500/30 rounded-full px-3 py-1.5 text-sm text-royal-300"
          >
            <div className="w-2 h-2 rounded-full bg-royal-400 animate-pulse" />
            <span>جاري رفع {uploads.filter(u => u.status === 'uploading').length} ملف</span>
          </motion.div>
        )}
      </div>

      <UploadProgress
        uploads={uploads}
        onCancel={cancelUpload}
        onClear={clearCompleted}
      />
    </>
  )
}
