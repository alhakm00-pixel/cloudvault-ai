'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cloud, Home, FolderOpen, Film, Star, Share2, Trash2,
  Settings, HelpCircle, ChevronRight, Upload, Bell,
  Cpu, Search, Clock, X, Menu
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { formatBytes, STORAGE_TOTAL, STORAGE_USED_DEMO } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'الرئيسية', badge: null },
  { href: '/files', icon: FolderOpen, label: 'ملفاتي', badge: '2,847' },
  { href: '/player', icon: Film, label: 'مشغل الفيديو', badge: null },
  { href: '/files?filter=recent', icon: Clock, label: 'الأخيرة', badge: null },
  { href: '/files?filter=starred', icon: Star, label: 'المفضلة', badge: '128' },
  { href: '/files?filter=shared', icon: Share2, label: 'المشتركة', badge: '34' },
  { href: '/files?filter=ai', icon: Cpu, label: 'AI المساعد', badge: 'جديد' },
  { href: '/files?filter=trash', icon: Trash2, label: 'المحذوفات', badge: null },
]

const bottomItems = [
  { href: '/settings', icon: Settings, label: 'الإعدادات' },
  { href: '#', icon: HelpCircle, label: 'المساعدة' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, sidebarOpen, setSidebarOpen } = useAppStore()

  const usedPercent = (STORAGE_USED_DEMO / STORAGE_TOTAL) * 100

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col glass border-l border-white/10 md:relative md:translate-x-0 md:flex"
        style={{ direction: 'rtl' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-sm">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="font-black glow-text text-lg">CloudVault</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload button */}
        <div className="px-4 py-4">
          <button className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm">
            <Upload className="w-4 h-4" />
            <span>رفع ملفات</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href.split('?')[0]))
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div className={`sidebar-item ${active ? 'active' : ''}`}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.badge === 'جديد'
                        ? 'bg-gradient-to-r from-royal-500 to-violet-500 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Storage meter */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/70 font-medium">مساحة التخزين</span>
              <span className="text-royal-300">{usedPercent.toFixed(1)}%</span>
            </div>
            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${usedPercent}%` }} />
            </div>
            <div className="flex justify-between text-xs text-white/50">
              <span>{formatBytes(STORAGE_USED_DEMO)} مستخدمة</span>
              <span>{formatBytes(STORAGE_TOTAL)}</span>
            </div>
          </div>
        </div>

        {/* User + bottom nav */}
        <div className="border-t border-white/10 p-3 space-y-1">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
              <div className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}>
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          ))}

          {/* User card */}
          <div className="flex items-center gap-3 p-2 mt-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-royal-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0] ?? 'أ'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name ?? 'المستخدم'}</p>
              <p className="text-xs text-white/50 truncate">{user?.email ?? ''}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 rotate-180" />
          </div>
        </div>
      </motion.aside>
    </>
  )
}
