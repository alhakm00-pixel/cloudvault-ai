import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 بايت'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'music'
  if (type.includes('pdf')) return 'file-text'
  if (type.includes('word') || type.includes('document')) return 'file-text'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'table'
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return 'archive'
  if (type.includes('text')) return 'file-text'
  if (type.includes('code') || type.includes('javascript') || type.includes('typescript')) return 'code'
  return 'file'
}

export function getFileColor(type: string): string {
  if (type.startsWith('image/')) return 'from-pink-500 to-rose-500'
  if (type.startsWith('video/')) return 'from-violet-500 to-purple-500'
  if (type.startsWith('audio/')) return 'from-green-500 to-emerald-500'
  if (type.includes('pdf')) return 'from-red-500 to-orange-500'
  if (type.includes('word') || type.includes('document')) return 'from-blue-500 to-indigo-500'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'from-green-600 to-teal-500'
  if (type.includes('zip') || type.includes('rar')) return 'from-yellow-500 to-amber-500'
  return 'from-royal-500 to-violet-500'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const STORAGE_TOTAL = 2 * 1024 * 1024 * 1024 * 1024 // 2TB in bytes
export const STORAGE_USED_DEMO = 847 * 1024 * 1024 * 1024  // 847GB demo
