'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src:         string
  alt:         string
  className?:  string
  fallback?:   React.ReactNode
  placeholder?: string
}

export default function LazyImage({
  src, alt, className, fallback, placeholder
}: LazyImageProps) {
  const [loaded,  setLoaded]  = useState(false)
  const [error,   setError]   = useState(false)
  const [visible, setVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin: '200px' }
    )
    if (imgRef.current) obs.observe(imgRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={imgRef as any} className={cn('relative overflow-hidden', className)}>
      {/* Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Placeholder emoji/icon */}
      {!visible && !loaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
          {placeholder}
        </div>
      )}

      {/* Actual image */}
      {visible && !error && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn('w-full h-full object-cover', className)}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback ?? <span className="text-4xl opacity-30">📁</span>}
        </div>
      )}
    </div>
  )
}
