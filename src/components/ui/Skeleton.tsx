'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps { className?: string; count?: number }

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer',
      className,
    )} />
  )
}

export function FileCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded-lg" />
      <Skeleton className="h-3 w-1/3 rounded-lg" />
    </div>
  )
}

export function FileListSkeleton({ count = 5 }: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 glass rounded-2xl">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-lg" />
            <Skeleton className="h-3 w-1/3 rounded-lg" />
          </div>
          <Skeleton className="w-16 h-4 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-3xl p-5 space-y-3">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <Skeleton className="h-6 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-3xl p-6">
          <Skeleton className="h-6 w-40 rounded-lg mb-6" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <Skeleton className="h-6 w-32 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
