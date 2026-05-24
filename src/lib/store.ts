import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
  folder?: string
  starred: boolean
  shared: boolean
  tags: string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  storageUsed: number
  storageTotal: number
}

interface AppState {
  user: User | null
  files: FileItem[]
  currentFolder: string
  viewMode: 'grid' | 'list'
  sortBy: 'name' | 'size' | 'date' | 'type'
  darkMode: boolean
  sidebarOpen: boolean
  uploadProgress: { [key: string]: number }
  searchQuery: string

  setUser: (user: User | null) => void
  addFile: (file: FileItem) => void
  removeFile: (id: string) => void
  toggleStar: (id: string) => void
  setCurrentFolder: (folder: string) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setSortBy: (sort: 'name' | 'size' | 'date' | 'type') => void
  toggleDarkMode: () => void
  setSidebarOpen: (open: boolean) => void
  setUploadProgress: (key: string, progress: number) => void
  setSearchQuery: (query: string) => void
}

const demoFiles: FileItem[] = [
  {
    id: '1', name: 'مشروع التصميم النهائي.mp4', type: 'video/mp4', size: 2.4e9,
    url: '#', thumbnail: '', createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), starred: true, shared: false, tags: ['فيديو', 'مشروع'],
  },
  {
    id: '2', name: 'صور العائلة - رحلة 2024.zip', type: 'application/zip', size: 847e6,
    url: '#', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    starred: false, shared: true, tags: ['صور', 'عائلة'],
  },
  {
    id: '3', name: 'تقرير الأعمال الربع الأول.pdf', type: 'application/pdf', size: 3.2e6,
    url: '#', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    starred: true, shared: false, tags: ['عمل', 'تقرير'],
  },
  {
    id: '4', name: 'موسيقى خلفية المشروع.mp3', type: 'audio/mp3', size: 12.4e6,
    url: '#', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    starred: false, shared: false, tags: ['موسيقى'],
  },
  {
    id: '5', name: 'شعار الشركة الجديد.png', type: 'image/png', size: 2.1e6,
    url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    starred: false, shared: true, tags: ['تصميم', 'شعار'],
  },
  {
    id: '6', name: 'نسخة احتياطية قاعدة البيانات.sql', type: 'application/sql', size: 156e6,
    url: '#', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    starred: false, shared: false, tags: ['بيانات', 'نسخ احتياطي'],
  },
  {
    id: '7', name: 'عرض تقديمي للعملاء.pptx', type: 'application/vnd.ms-powerpoint', size: 24.5e6,
    url: '#', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    starred: true, shared: true, tags: ['عرض', 'عمل'],
  },
  {
    id: '8', name: 'فيديو تعليمي - Next.js.mp4', type: 'video/mp4', size: 1.8e9,
    url: '#', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    starred: false, shared: false, tags: ['تعليم', 'برمجة'],
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        id: '1',
        name: 'أحمد محمد',
        email: 'ahmed@cloudvault.ai',
        plan: 'pro',
        storageUsed: 847 * 1024 * 1024 * 1024,
        storageTotal: 2 * 1024 * 1024 * 1024 * 1024,
      },
      files: demoFiles,
      currentFolder: 'home',
      viewMode: 'grid',
      sortBy: 'date',
      darkMode: true,
      sidebarOpen: true,
      uploadProgress: {},
      searchQuery: '',

      setUser: (user) => set({ user }),
      addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
      removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
      toggleStar: (id) => set((s) => ({
        files: s.files.map((f) => f.id === id ? { ...f, starred: !f.starred } : f)
      })),
      setCurrentFolder: (folder) => set({ currentFolder: folder }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sort) => set({ sortBy: sort }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setUploadProgress: (key, progress) => set((s) => ({
        uploadProgress: { ...s.uploadProgress, [key]: progress }
      })),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    { name: 'cloudvault-store', partialize: (s) => ({ viewMode: s.viewMode, darkMode: s.darkMode }) }
  )
)
