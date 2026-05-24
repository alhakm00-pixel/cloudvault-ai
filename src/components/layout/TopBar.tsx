'use client'

import { Search, Bell, Menu, Sun, Moon, Settings } from 'lucide-react'
import SmartSearch from '@/components/ai/SmartSearch'
import NotificationCenter from '@/components/pwa/NotificationCenter'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

interface TopBarProps {
  title: string
  subtitle?: string
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { searchQuery, setSearchQuery, setSidebarOpen, darkMode, toggleDarkMode } = useAppStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen,  setNotifOpen]  = useState(false)

  return (
    <header className="h-16 flex items-center gap-4 px-4 sm:px-6 border-b border-white/10 glass sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <h1 className="text-lg font-black text-white truncate">{title}</h1>
        {subtitle && <p className="text-xs text-white/50 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex-1 sm:flex-none sm:w-72 max-w-xs"
      >
        <div className="relative pointer-events-none">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <div className="input-glass pr-10 py-2 text-sm h-9 text-white/30 flex items-center">
            بحث ذكي...
          </div>
        </div>
      </button>
      <SmartSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotifOpen(true)}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-royal-500 rounded-full" />
          </motion.button>
          <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <Link href="/settings">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </header>
  )
}
