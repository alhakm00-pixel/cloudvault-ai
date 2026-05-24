'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Cloud, Menu, X, ChevronDown, Bell, 
  Search, Sparkles, Shield, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled || !transparent
          ? 'glass border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-royal-600 to-violet-600 flex items-center justify-center shadow-glow-blue group-hover:shadow-glow-purple transition-all duration-300">
              <Cloud className="w-5 h-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 border border-dark-900 animate-pulse-slow" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base text-white tracking-tight">
                My <span className="gradient-text">CloudVault</span>
              </span>
              <div className="flex items-center gap-1 -mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-violet-400" />
                <span className="text-[10px] text-violet-300/70 font-medium">AI Powered</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'المميزات', href: '#features' },
              { label: 'الأسعار', href: '#pricing' },
              { label: 'الذكاء الاصطناعي', href: '#ai', badge: 'جديد' },
              { label: 'الأمان', href: '#security' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/06 transition-all duration-200"
              >
                {item.label}
                {item.badge && (
                  <span className="badge badge-purple text-[10px] px-1.5 py-0.5">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">
              تسجيل الدخول
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm">
              ابدأ مجاناً
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl glass border border-white/10 text-white/70 hover:text-white transition-all"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden glass border-t border-white/10 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {[
              { label: 'المميزات', href: '#features' },
              { label: 'الأسعار', href: '#pricing' },
              { label: 'الذكاء الاصطناعي', href: '#ai' },
              { label: 'الأمان', href: '#security' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/06 transition-all"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 pb-1 space-y-2">
              <Link href="/auth/login" className="block btn-secondary text-center text-sm">
                تسجيل الدخول
              </Link>
              <Link href="/auth/register" className="block btn-primary text-center text-sm">
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
