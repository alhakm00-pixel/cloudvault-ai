'use client'

import { Toaster } from 'react-hot-toast'

export default function CVToaster() {
  return (
    <Toaster
      position="top-left"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background:  'rgba(13, 11, 30, 0.95)',
          color:       '#f8f8ff',
          border:      '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius:'14px',
          backdropFilter: 'blur(20px)',
          fontFamily:  'Cairo, Tajawal, sans-serif',
          fontSize:    '14px',
          direction:   'rtl',
          padding:     '12px 16px',
          boxShadow:   '0 8px 32px rgba(0,0,0,0.4)',
          maxWidth:    '340px',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#fff' },
          style:     { borderColor: 'rgba(16, 185, 129, 0.3)' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
          style:     { borderColor: 'rgba(239, 68, 68, 0.3)' },
          duration:  5000,
        },
        loading: {
          iconTheme: { primary: '#6366f1', secondary: '#fff' },
        },
      }}
    />
  )
}
