'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ContextMenuItem {
  id:        string
  label:     string
  icon?:     ReactNode
  shortcut?: string
  danger?:   boolean
  divider?:  boolean
  disabled?: boolean
  onClick?:  () => void
}

interface ContextMenuProps {
  items:     ContextMenuItem[]
  children:  ReactNode
  className?: string
}

interface MenuState {
  x: number
  y: number
  open: boolean
}

export default function ContextMenu({ items, children, className = '' }: ContextMenuProps) {
  const [menu,    setMenu]    = useState<MenuState>({ x: 0, y: 0, open: false })
  const menuRef  = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const menuW = 200
    const menuH = items.length * 40 + 16
    const viewW = window.innerWidth
    const viewH = window.innerHeight

    let x = e.clientX
    let y = e.clientY
    if (x + menuW > viewW) x = x - menuW
    if (y + menuH > viewH) y = y - menuH

    setMenu({ x, y, open: true })
  }

  const closeMenu = () => setMenu(m => ({ ...m, open: false }))

  useEffect(() => {
    if (!menu.open) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu()
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('contextmenu', closeMenu)
    document.addEventListener('scroll', closeMenu, true)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('contextmenu', closeMenu)
      document.removeEventListener('scroll', closeMenu, true)
    }
  }, [menu.open])

  return (
    <>
      <div ref={containerRef} onContextMenu={openMenu} className={className}>
        {children}
      </div>

      <AnimatePresence>
        {menu.open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0,   scale: 0.92,  y: -8 }}
            transition={{ duration: 0.12 }}
            style={{ position: 'fixed', top: menu.y, left: menu.x, zIndex: 9999, minWidth: 200 }}
            className="glass-card rounded-2xl py-1.5 overflow-hidden shadow-glow-md border border-white/15"
            dir="rtl"
          >
            {items.map((item, i) => {
              if (item.divider) return <div key={i} className="my-1 h-px bg-white/10 mx-2" />
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => { item.onClick?.(); closeMenu() }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-all
                    ${item.danger   ? 'text-red-400 hover:bg-red-500/10' : 'text-white/80 hover:bg-white/8 hover:text-white'}
                    ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {item.icon && <span className="w-4 h-4 flex-shrink-0 opacity-70">{item.icon}</span>}
                  <span className="flex-1 text-right">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="text-xs text-white/25 font-mono ml-2">{item.shortcut}</kbd>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
