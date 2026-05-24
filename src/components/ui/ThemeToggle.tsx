'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'

type ThemeMode = 'dark' | 'light' | 'system'

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('cv_theme') ?? 'dark') as ThemeMode
    setMode(saved)
    applyTheme(saved)
  }, [])

  const applyTheme = (m: ThemeMode) => {
    const root = document.documentElement
    if (m === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', dark)
      root.classList.toggle('light', !dark)
    } else {
      root.classList.toggle('dark',  m === 'dark')
      root.classList.toggle('light', m === 'light')
    }
  }

  const setTheme = (m: ThemeMode) => {
    setMode(m)
    localStorage.setItem('cv_theme', m)
    applyTheme(m)
  }

  const modes: { id: ThemeMode; icon: React.ElementType; label: string }[] = [
    { id: 'light',  icon: Sun,     label: 'فاتح'    },
    { id: 'dark',   icon: Moon,    label: 'داكن'    },
    { id: 'system', icon: Monitor, label: 'تلقائي'  },
  ]

  if (compact) {
    const current = modes.find(m => m.id === mode)!
    const Icon    = current.icon
    return (
      <button
        onClick={() => {
          const idx  = modes.findIndex(m => m.id === mode)
          const next = modes[(idx + 1) % modes.length]
          setTheme(next.id)
        }}
        className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-all"
        title={`الوضع الحالي: ${current.label}`}
      >
        <Icon className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div className="flex gap-1 p-1 glass rounded-2xl" dir="rtl">
      {modes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            mode === id ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
        >
          {mode === id && (
            <motion.div
              layoutId="theme-pill"
              className="absolute inset-0 bg-gradient-to-r from-royal-500/30 to-violet-500/20 rounded-xl border border-royal-500/30"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  )
}
