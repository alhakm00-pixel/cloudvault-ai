import type { Metadata, Viewport } from 'next'
import './globals.css'
import CVToaster from '@/components/ui/Toast'
import MobileNav from '@/components/pwa/MobileNav'
import { PWAInstallBanner, OfflineIndicator, UpdateBanner } from '@/components/pwa/PWAInstallBanner'

export const metadata: Metadata = {
  title: 'My CloudVault AI | تخزين سحابي ذكي',
  description: 'منصة تخزين سحابي شخصية مدعومة بالذكاء الاصطناعي - 2TB مجاناً',
  keywords: 'تخزين سحابي, ملفات, فيديو, ذكاء اصطناعي, CloudVault',
  authors: [{ name: 'CloudVault AI' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CloudVault AI',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192' },
    ],
  },
  openGraph: {
    title: 'My CloudVault AI',
    description: 'منصة تخزين سحابي شخصية مدعومة بالذكاء الاصطناعي',
    type: 'website',
    locale: 'ar_SA',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0d0b1e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-vault antialiased">
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />
        <CVToaster />
        <main className="relative z-10">
          {children}
        </main>
        <PWAInstallBanner />
        <OfflineIndicator />
        <UpdateBanner />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
        <MobileNav />
      </body>
    </html>
  )
}
