'use client'

import { useEffect, useCallback } from 'react'

type ShortcutHandler = () => void

interface Shortcut {
  key:        string
  ctrl?:      boolean
  meta?:      boolean
  shift?:     boolean
  alt?:       boolean
  handler:    ShortcutHandler
  description: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't fire when typing in inputs
    const tag = (e.target as HTMLElement).tagName
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return

    for (const sc of shortcuts) {
      const keyMatch   = e.key.toLowerCase() === sc.key.toLowerCase()
      const ctrlMatch  = !sc.ctrl  || (e.ctrlKey  || e.metaKey)
      const metaMatch  = !sc.meta  || e.metaKey
      const shiftMatch = !sc.shift || e.shiftKey
      const altMatch   = !sc.alt   || e.altKey

      // Ctrl/Cmd shortcuts always require modifier
      const needsMod   = sc.ctrl || sc.meta
      const hasMod     = e.ctrlKey || e.metaKey

      if (needsMod && !hasMod) continue

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        e.preventDefault()
        sc.handler()
        return
      }
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// ─── Global shortcut registry (for help modal) ────────────────────────────────
export const GLOBAL_SHORTCUTS: Omit<Shortcut, 'handler'>[] = [
  { key: 'k',      ctrl: true,  description: 'البحث الذكي'          },
  { key: 'u',      ctrl: true,  description: 'رفع ملف'              },
  { key: 'n',      ctrl: true,  description: 'مجلد جديد'            },
  { key: '/',                   description: 'بحث سريع'              },
  { key: 'g',                   description: 'عرض شبكي'              },
  { key: 'l',                   description: 'عرض قائمة'            },
  { key: 'Escape',              description: 'إغلاق النافذة الحالية' },
  { key: 'Delete',              description: 'حذف المحدد'           },
  { key: 'f',                   description: 'إضافة/إزالة مفضلة'    },
  { key: 's',      ctrl: true,  description: 'مشاركة الملف'         },
  { key: 'd',      ctrl: true,  description: 'تحميل الملف'          },
]
