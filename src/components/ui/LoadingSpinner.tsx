'use client'

import { motion } from 'framer-motion'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
}

const sizes = { sm: 24, md: 40, lg: 64, xl: 96 }

export default function LoadingSpinner({ size = 'md', text, fullScreen = false }: SpinnerProps) {
  const px = sizes[size]

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: px, height: px }}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-royal-500/30 border-t-royal-500"
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-full border-2 border-violet-500/20 border-b-violet-500"
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-gradient-to-br from-royal-500 to-violet-500"
          />
        </div>
      </div>
      {text && <p className="text-white/60 text-sm font-medium">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────
export function FileSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 animate-pulse">
      <div className="h-28 rounded-xl bg-white/5 mb-3" />
      <div className="h-4 bg-white/5 rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded-full w-1/3" />
    </div>
  )
}

export function FileSkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-3 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-white/5 rounded-full w-2/3 mb-2" />
        <div className="h-3 bg-white/5 rounded-full w-1/4" />
      </div>
      <div className="w-16 h-3 bg-white/5 rounded-full" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-3xl p-5 h-28" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-3xl h-64" />
        <div className="glass-card rounded-3xl h-64" />
      </div>
    </div>
  )
}
