'use client'

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'

interface VirtualGridProps<T> {
  items:        T[]
  renderItem:   (item: T, index: number) => ReactNode
  columnCount:  number
  itemHeight:   number
  gap?:         number
  overscan?:    number
  className?:   string
}

export function VirtualGrid<T>({
  items, renderItem, columnCount, itemHeight,
  gap = 16, overscan = 3, className = '',
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop,  setScrollTop]  = useState(0)
  const [height,     setHeight]     = useState(600)

  const rowHeight  = itemHeight + gap
  const rowCount   = Math.ceil(items.length / columnCount)
  const totalH     = rowCount * rowHeight

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const endRow   = Math.min(rowCount, Math.ceil((scrollTop + height) / rowHeight) + overscan)

  const visibleRows  = Array.from({ length: endRow - startRow }, (_, i) => startRow + i)
  const offsetTop    = startRow * rowHeight

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setHeight(entries[0].contentRect.height)
    })
    ro.observe(el)
    setHeight(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop)
  }, [])

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={`overflow-auto ${className}`}
      style={{ position: 'relative' }}
    >
      <div style={{ height: totalH, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetTop, left: 0, right: 0 }}>
          {visibleRows.map(rowIndex => {
            const rowItems = items.slice(rowIndex * columnCount, (rowIndex + 1) * columnCount)
            return (
              <div
                key={rowIndex}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                  gap: `${gap}px`,
                  marginBottom: `${gap}px`,
                }}
              >
                {rowItems.map((item, colIndex) =>
                  renderItem(item, rowIndex * columnCount + colIndex)
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Simple virtual list (single column) ─────────────────────────────────────
interface VirtualListProps<T> {
  items:       T[]
  renderItem:  (item: T, index: number) => ReactNode
  itemHeight:  number
  overscan?:   number
  className?:  string
}

export function VirtualList<T>({
  items, renderItem, itemHeight, overscan = 5, className = '',
}: VirtualListProps<T>) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const [scrollTop,   setScrollTop]  = useState(0)
  const [height,      setHeight]     = useState(600)

  const totalH   = items.length * itemHeight
  const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIdx   = Math.min(items.length, Math.ceil((scrollTop + height) / itemHeight) + overscan)
  const visible  = items.slice(startIdx, endIdx)
  const offsetTop = startIdx * itemHeight

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(e => setHeight(e[0].contentRect.height))
    ro.observe(el)
    setHeight(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      onScroll={e => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      className={`overflow-auto ${className}`}
      style={{ position: 'relative' }}
    >
      <div style={{ height: totalH, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetTop, left: 0, right: 0 }}>
          {visible.map((item, i) => (
            <div key={startIdx + i} style={{ height: itemHeight }}>
              {renderItem(item, startIdx + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
