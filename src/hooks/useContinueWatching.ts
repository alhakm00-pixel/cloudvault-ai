'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface WatchProgress {
  fileId:        string
  fileName:      string
  mimeType:      string
  thumbnailUrl?: string
  currentTime:   number
  duration:      number
  percent:       number
  updatedAt:     number
}

const STORAGE_KEY = 'cv_watch_progress'
const MAX_ENTRIES = 20

function load(): Record<string, WatchProgress> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function save(data: Record<string, WatchProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useContinueWatching() {
  const [progress, setProgress] = useState<Record<string, WatchProgress>>({})

  useEffect(() => { setProgress(load()) }, [])

  const updateProgress = useCallback((
    fileId: string,
    fileName: string,
    mimeType: string,
    currentTime: number,
    duration: number,
    thumbnailUrl?: string,
  ) => {
    const percent = duration > 0 ? (currentTime / duration) * 100 : 0
    // Don't save if < 5% or > 95% (start/end)
    if (percent < 5 || percent > 95) return

    setProgress(prev => {
      const updated = {
        ...prev,
        [fileId]: { fileId, fileName, mimeType, thumbnailUrl, currentTime, duration, percent, updatedAt: Date.now() },
      }
      // Keep only MAX_ENTRIES most recent
      const entries  = Object.values(updated).sort((a, b) => b.updatedAt - a.updatedAt)
      const trimmed  = Object.fromEntries(entries.slice(0, MAX_ENTRIES).map(e => [e.fileId, e]))
      save(trimmed)
      return trimmed
    })
  }, [])

  const getProgress = useCallback((fileId: string): WatchProgress | null => {
    return progress[fileId] ?? null
  }, [progress])

  const removeProgress = useCallback((fileId: string) => {
    setProgress(prev => {
      const updated = { ...prev }
      delete updated[fileId]
      save(updated)
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    save({})
    setProgress({})
  }, [])

  const continueWatching = Object.values(progress)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 10)

  return { continueWatching, updateProgress, getProgress, removeProgress, clearAll }
}

// ── Hook for auto-saving progress every 5s during playback ────────────────────
export function useVideoProgressTracker(
  fileId: string,
  fileName: string,
  mimeType: string,
  videoRef: React.RefObject<HTMLVideoElement>,
  thumbnailUrl?: string,
) {
  const { updateProgress } = useContinueWatching()
  const intervalRef = useRef<NodeJS.Timeout>()

  const start = useCallback(() => {
    intervalRef.current = setInterval(() => {
      const v = videoRef.current
      if (v && !v.paused && !v.ended) {
        updateProgress(fileId, fileName, mimeType, v.currentTime, v.duration, thumbnailUrl)
      }
    }, 5000)
  }, [fileId, fileName, mimeType, updateProgress, thumbnailUrl, videoRef])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    // Save final position
    const v = videoRef.current
    if (v) updateProgress(fileId, fileName, mimeType, v.currentTime, v.duration, thumbnailUrl)
  }, [fileId, fileName, mimeType, updateProgress, thumbnailUrl, videoRef])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return { start, stop }
}
