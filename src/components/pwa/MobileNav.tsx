'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, FolderOpen, Film, Star, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home,       label: 'الرئيسية' },
  { href: '/files',     icon: FolderOpen, label: 'ملفاتي'   },
  { href: '/player',    icon: Film,       label: 'الفيديو'  },
  { href: '/files?filter=starred', icon: Star, label: 'المفضلة' },
  { href: '/settings',  icon: Settings,   label: 'الإعدادات' },
]

export default function MobileNav() {
  const pathname = usePathname()

  // Hide on auth pages
  if (!pathname || pathname.startsWith('/auth') || pathname === '/') return null

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      style={{ direction: 'rtl' }}
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 glass border-t border-white/10" />

      <div className="relative flex items-center justify-around px-2 py-2 safe-area-bottom">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]))

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center gap-1 py-1.5 relative">
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-2 inset-x-3 h-0.5 rounded-full bg-gradient-to-r from-royal-500 to-violet-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`w-6 h-6 flex items-center justify-center transition-colors ${
                    isActive ? 'text-royal-400' : 'text-white/40'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>

                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-royal-300' : 'text-white/30'
                }`}>
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
