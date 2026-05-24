'use client'

import { useState, useEffect, useCallback } from 'react'
import { filesApi } from '@/lib/api'
import toast from 'react-hot-toast'

export function useFiles(params: Record<string, string> = {}) {
  const [files, setFiles]       = useState<any[]>([])
  const [meta, setMeta]         = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const paramsKey = JSON.stringify(params)

  const fetchFiles = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await filesApi.list(params)
      setFiles(res.files); setMeta(res.meta)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [paramsKey])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  const toggleStar = async (id: string) => {
    try {
      const updated = await filesApi.toggleStar(id)
      setFiles((prev) => prev.map((f) => f.id === id ? { ...f, isStarred: updated.isStarred } : f))
    } catch { toast.error('فشل تحديث المفضلة') }
  }

  const deleteFile = async (id: string, permanent = false) => {
    try {
      if (permanent) await filesApi.permanentDelete(id)
      else           await filesApi.softDelete(id)
      setFiles((prev) => prev.filter((f) => f.id !== id))
      toast.success('تم حذف الملف')
    } catch { toast.error('فشل حذف الملف') }
  }

  return { files, meta, loading, error, refetch: fetchFiles, toggleStar, deleteFile }
}
