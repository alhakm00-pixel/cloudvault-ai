'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, FolderOpen, Film, Upload, Settings } from 'lucide-react'
import { useRef } from 'react'
import { useUpload } from '@/hooks/useUpload'
import UploadProgress from './UploadProgress'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home,       label: 'الرئيسية' },
  { href: '/files',     icon: FolderOpen, label: 'الملفات'  },
  { href: '/player',    icon: Film,       label: 'فيديو'    },
  { href: '/settings',  icon: Settings,   label: 'الإعدادات' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const fileRef  = useRef<HTMLInputElement>(null)
  const { uploads, uploadFiles, cancelUpload, clearCompleted, activeCount } = useUpload()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) uploadFiles(files)
    e.target.value = ''
  }

  return (
    <>
      {/* Upload progress (floating) */}
      <UploadProgress uploads={uploads} onCancel={cancelUpload} onClear={clearCompleted} />

      {/* Bottom nav bar */}
      <nav
        className="mobile-nav fixed bottom-0 inset-x-0 z-40 glass border-t border-white/10 safe-bottom"
        style={{ direction: 'rtl', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {/* First two nav items */}
          {NAV_ITEMS.slice(0, 2).map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl transition-all ${active ? 'text-royal-300' : 'text-white/40'}`}
                >
                  <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-royal-500/20' : ''}`}>
                    <item.icon className="w-5 h-5" />
                    {active && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 rounded-xl bg-royal-500/20 border border-royal-500/30"
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}

          {/* Upload FAB (center) */}
          <div className="relative -mt-5">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => fileRef.current?.click()}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-md"
            >
              <Upload className="w-6 h-6 text-white" />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </motion.button>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Last two nav items */}
          {NAV_ITEMS.slice(2).map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl transition-all ${active ? 'text-royal-300' : 'text-white/40'}`}
                >
                  <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-royal-500/20' : ''}`}>
                    <item.icon className="w-5 h-5" />
                    {active && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 rounded-xl bg-royal-500/20 border border-royal-500/30"
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
