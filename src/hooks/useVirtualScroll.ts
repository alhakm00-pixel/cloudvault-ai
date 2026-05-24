'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface VirtualScrollOptions {
  itemHeight:   number
  containerHeight: number
  overscan?:    number
}

export function useVirtualScroll<T>(
  items: T[],
  { itemHeight, containerHeight, overscan = 5 }: VirtualScrollOptions,
) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
  const startIndex   = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex     = Math.min(items.length, startIndex + visibleCount)

  const visibleItems = items.slice(startIndex, endIndex).map((item, i) => ({
    item,
    index: startIndex + i,
    offsetY: (startIndex + i) * itemHeight,
  }))

  const totalHeight = items.length * itemHeight

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight
    }
  }, [itemHeight])

  return { containerRef, visibleItems, totalHeight, onScroll, scrollToIndex }
}
