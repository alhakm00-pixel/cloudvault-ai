'use client'

import { useState, useCallback, useRef } from 'react'
import { uploadApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { generateId } from '@/lib/utils'

export interface UploadItem {
  id: string
  file: File
  progress: number
  speed: number
  eta: number
  status: 'pending' | 'uploading' | 'done' | 'error' | 'cancelled'
  error?: string
}

export function useUpload() {
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const abortControllers = useRef<Map<string, AbortController>>(new Map())
  const { addFile } = useAppStore()

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setUploads((prev) => prev.map((u) => u.id === id ? { ...u, ...patch } : u))
  }, [])

  const uploadFiles = useCallback(async (files: File[], folderId?: string) => {
    const items: UploadItem[] = files.map((file) => ({
      id: generateId(), file, progress: 0, speed: 0, eta: 0, status: 'pending',
    }))
    setUploads((prev) => [...items, ...prev])

    for (const item of items) {
      const controller = new AbortController()
      abortControllers.current.set(item.id, controller)
      updateItem(item.id, { status: 'uploading' })

      try {
        await uploadApi.uploadFile(item.file, {
          folderId,
          signal: controller.signal,
          onProgress: (pct, speed, eta) => updateItem(item.id, { progress: pct, speed, eta }),
          onComplete: (fileData) => {
            updateItem(item.id, { status: 'done', progress: 100 })
            addFile({
              id: fileData.id, name: fileData.name, type: fileData.mimeType,
              size: Number(fileData.size), url: fileData.storageUrl ?? '#',
              thumbnail: fileData.thumbnailUrl,
              createdAt: fileData.createdAt, updatedAt: fileData.updatedAt,
              starred: false, shared: false, tags: [],
            })
            toast.success(`✅ تم رفع ${item.file.name}`)
          },
        })
      } catch (err: any) {
        if (err.message === 'Upload cancelled') {
          updateItem(item.id, { status: 'cancelled' })
        } else {
          updateItem(item.id, { status: 'error', error: err.message })
          toast.error(`❌ فشل رفع ${item.file.name}`)
        }
      } finally {
        abortControllers.current.delete(item.id)
      }
    }
  }, [updateItem, addFile])

  const cancelUpload = useCallback((id: string) => {
    abortControllers.current.get(id)?.abort()
    updateItem(id, { status: 'cancelled' })
  }, [updateItem])

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status !== 'done' && u.status !== 'cancelled'))
  }, [])

  const activeCount = uploads.filter((u) => u.status === 'uploading').length
  const totalProgress = uploads.length > 0
    ? Math.round(uploads.reduce((s, u) => s + u.progress, 0) / uploads.length)
    : 0

  return { uploads, uploadFiles, cancelUpload, clearCompleted, activeCount, totalProgress }
}
