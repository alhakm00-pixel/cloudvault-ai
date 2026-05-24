'use client'

import { useState, useEffect, useCallback } from 'react'

export type ThemeColor = 'royal' | 'ocean' | 'forest' | 'sunset' | 'rose' | 'gold'
export type ThemeMode  = 'dark' | 'light' | 'auto'

interface ThemeConfig {
  mode:  ThemeMode
  color: ThemeColor
}

const COLOR_VARS: Record<ThemeColor, Record<string, string>> = {
  royal:  { '--accent-500': '#6366f1', '--accent-600': '#4f46e5', '--accent-400': '#818cf8' },
  ocean:  { '--accent-500': '#06b6d4', '--accent-600': '#0891b2', '--accent-400': '#22d3ee' },
  forest: { '--accent-500': '#10b981', '--accent-600': '#059669', '--accent-400': '#34d399' },
  sunset: { '--accent-500': '#f59e0b', '--accent-600': '#d97706', '--accent-400': '#fbbf24' },
  rose:   { '--accent-500': '#f43f5e', '--accent-600': '#e11d48', '--accent-400': '#fb7185' },
  gold:   { '--accent-500': '#eab308', '--accent-600': '#ca8a04', '--accent-400': '#facc15' },
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [config, setConfig] = useState<ThemeConfig>({ mode: 'dark', color: 'royal' })

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cv_theme')
      if (saved) setConfig(JSON.parse(saved))
    } catch {}
  }, [])

  // Apply CSS vars + dark class
  useEffect(() => {
    const root       = document.documentElement
    const effectiveMode = config.mode === 'auto' ? getSystemTheme() : config.mode

    if (effectiveMode === 'dark') root.classList.add('dark')
    else                          root.classList.remove('dark')

    // Apply color vars
    const vars = COLOR_VARS[config.color]
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  }, [config])

  const setMode = useCallback((mode: ThemeMode) => {
    setConfig(prev => {
      const next = { ...prev, mode }
      localStorage.setItem('cv_theme', JSON.stringify(next))
      return next
    })
  }, [])

  const setColor = useCallback((color: ThemeColor) => {
    setConfig(prev => {
      const next = { ...prev, color }
      localStorage.setItem('cv_theme', JSON.stringify(next))
      return next
    })
  }, [])

  return { ...config, setMode, setColor }
}
