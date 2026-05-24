'use client'

import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNav from '../ui/MobileNav'

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
// Phase 4: keyboard shortcut is wired in TopBar via SmartSearch
