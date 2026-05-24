'use client'

import { useEffect, useRef, useState, RefObject } from 'react'

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver<T extends Element>(
  options: Options = {},
): [RefObject<T>, boolean] {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options
  const ref     = useRef<T>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen   = entry?.isIntersecting && freezeOnceVisible
  const isVisible = !!entry?.isIntersecting

  useEffect(() => {
    const el = ref.current
    if (!el || frozen) return

    const observer = new IntersectionObserver(
      ([e]) => setEntry(e),
      { threshold, root, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, root, rootMargin, frozen])

  return [ref, isVisible]
}

// ─── Lazy image loader ────────────────────────────────────────────────────────
export function useLazyImage(src: string): {
  ref: RefObject<HTMLImageElement>
  loaded: boolean
  currentSrc: string
} {
  const [ref, isVisible]  = useIntersectionObserver<HTMLImageElement>({
    rootMargin: '200px',
    freezeOnceVisible: true,
  })
  const [loaded,     setLoaded]     = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')

  useEffect(() => {
    if (!isVisible || !src) return
    const img = new Image()
    img.onload  = () => { setCurrentSrc(src); setLoaded(true) }
    img.onerror = () => setLoaded(false)
    img.src = src
  }, [isVisible, src])

  return { ref, loaded, currentSrc }
}
