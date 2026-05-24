'use client'

import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useTheme, type ThemeColor, type ThemeMode } from '@/hooks/useTheme'

const COLORS: { id: ThemeColor; label: string; from: string; to: string }[] = [
  { id: 'royal',  label: 'ملكي',   from: '#6366f1', to: '#8b5cf6' },
  { id: 'ocean',  label: 'المحيط', from: '#06b6d4', to: '#0ea5e9' },
  { id: 'forest', label: 'غابة',   from: '#10b981', to: '#059669' },
  { id: 'sunset', label: 'غروب',   from: '#f59e0b', to: '#ef4444' },
  { id: 'rose',   label: 'وردي',   from: '#f43f5e', to: '#ec4899' },
  { id: 'gold',   label: 'ذهبي',   from: '#eab308', to: '#f59e0b' },
]

const MODES: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
  { id: 'dark',  label: 'داكن',   icon: Moon    },
  { id: 'light', label: 'فاتح',   icon: Sun     },
  { id: 'auto',  label: 'تلقائي', icon: Monitor },
]

export default function ThemeSwitcher() {
  const { mode, color, setMode, setColor } = useTheme()

  return (
    <div className="space-y-5" style={{ direction: 'rtl' }}>
      {/* Mode */}
      <div>
        <p className="text-xs text-white/50 mb-2 font-medium">وضع العرض</p>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode(m.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                mode === m.id
                  ? 'border-royal-500/60 bg-royal-500/10 text-royal-300'
                  : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
              }`}
            >
              <m.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{m.label}</span>
              {mode === m.id && (
                <motion.div layoutId="mode-check" className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-xs text-white/50 mb-2 font-medium">لون المنصة</p>
        <div className="grid grid-cols-3 gap-2">
          {COLORS.map((c) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setColor(c.id)}
              className={`relative flex items-center gap-2.5 p-3 rounded-2xl border transition-all ${
                color === c.id
                  ? 'border-white/40 bg-white/8'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
              />
              <span className="text-xs font-medium text-white/70">{c.label}</span>
              {color === c.id && (
                <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
