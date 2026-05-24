'use client'

import { motion } from 'framer-motion'
import AppLayout from '@/components/layout/AppLayout'
import ContinueWatching from '@/components/pwa/ContinueWatching'
import { useAppStore } from '@/lib/store'
import { formatBytes, STORAGE_TOTAL, STORAGE_USED_DEMO } from '@/lib/utils'
import {
  HardDrive, FolderOpen, Film, Image, Music, FileText,
  Upload, Download, Share2, TrendingUp, Clock, Star,
  Cpu, Wifi, ArrowUpRight, Plus, ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const activityData = [
  { day: 'السبت',  رفع: 2.1, تحميل: 1.4 },
  { day: 'الأحد',  رفع: 3.5, تحميل: 2.1 },
  { day: 'الاثنين', رفع: 1.8, تحميل: 3.2 },
  { day: 'الثلاثاء', رفع: 4.2, تحميل: 1.8 },
  { day: 'الأربعاء', رفع: 2.9, تحميل: 4.5 },
  { day: 'الخميس', رفع: 5.1, تحميل: 2.3 },
  { day: 'الجمعة', رفع: 3.7, تحميل: 3.9 },
]

const recentFiles = [
  { name: 'مشروع التصميم.mp4', type: 'video', size: '2.4 GB', time: 'منذ دقيقتين', icon: '🎬' },
  { name: 'تقرير Q4.pdf', type: 'pdf', size: '3.2 MB', time: 'منذ ساعة', icon: '📄' },
  { name: 'صور الرحلة.zip', type: 'zip', size: '847 MB', time: 'منذ 3 ساعات', icon: '📦' },
  { name: 'شعار الشركة.png', type: 'image', size: '2.1 MB', time: 'أمس', icon: '🖼️' },
  { name: 'موسيقى.mp3', type: 'audio', size: '12.4 MB', time: 'أمس', icon: '🎵' },
]

const quickActions = [
  { label: 'رفع ملف', icon: Upload, color: 'from-blue-500 to-royal-500', action: () => {} },
  { label: 'مجلد جديد', icon: Plus, color: 'from-violet-500 to-purple-600', action: () => {} },
  { label: 'مشاركة', icon: Share2, color: 'from-pink-500 to-rose-500', action: () => {} },
  { label: 'تحليل AI', icon: Cpu, color: 'from-amber-500 to-orange-500', action: () => {} },
]

function StatCard({ icon: Icon, label, value, sub, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-3xl p-5 stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-glow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3" />
          <span>12%</span>
        </div>
      </div>
      <p className="text-2xl font-black text-white mb-0.5">{value}</p>
      <p className="text-sm text-white/60">{label}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user, files } = useAppStore()
  const usedPct = (STORAGE_USED_DEMO / STORAGE_TOTAL) * 100

  const fileTypes = [
    { label: 'فيديو', icon: Film, color: 'from-violet-500 to-purple-600', count: files.filter(f => f.type.startsWith('video')).length, size: '1.8 TB' },
    { label: 'صور', icon: Image, color: 'from-pink-500 to-rose-500', count: files.filter(f => f.type.startsWith('image')).length, size: '312 GB' },
    { label: 'مستندات', icon: FileText, color: 'from-blue-500 to-indigo-600', count: files.filter(f => f.type.includes('pdf') || f.type.includes('doc')).length, size: '28 GB' },
    { label: 'موسيقى', icon: Music, color: 'from-green-500 to-emerald-600', count: files.filter(f => f.type.startsWith('audio')).length, size: '45 GB' },
  ]

  return (
    <AppLayout title="لوحة التحكم" subtitle={`مرحباً، ${user?.name ?? 'المستخدم'} 👋`}>
      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickActions.map((a, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={a.action}
            className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-royal-500/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center flex-shrink-0`}>
              <a.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">{a.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Continue watching */}
      <ContinueWatching />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={HardDrive}   label="إجمالي التخزين"  value={formatBytes(STORAGE_TOTAL)}           sub={`${usedPct.toFixed(1)}% مستخدم`}  color="from-royal-500 to-indigo-600"   delay={0.1} />
        <StatCard icon={FolderOpen}  label="الملفات"          value={files.length.toLocaleString('ar-SA')} sub="ملف محفوظ"                           color="from-violet-500 to-purple-600"  delay={0.15} />
        <StatCard icon={Share2}      label="المشتركة"         value="34"                                   sub="رابط نشط"                            color="from-pink-500 to-rose-500"      delay={0.2} />
        <StatCard icon={Download}    label="التحميلات"        value="1.2 TB"                               sub="هذا الشهر"                           color="from-amber-500 to-orange-500"   delay={0.25} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Activity chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white">نشاط التخزين</h3>
              <p className="text-xs text-white/50">آخر 7 أيام</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-royal-500 inline-block" />رفع</span>
              <span className="flex items-center gap-1.5 text-white/60"><span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />تحميل</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(20,16,58,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#fff', fontFamily: 'Cairo' }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
              <Area type="monotone" dataKey="رفع" stroke="#6366f1" strokeWidth={2} fill="url(#uploadGrad)" />
              <Area type="monotone" dataKey="تحميل" stroke="#8b5cf6" strokeWidth={2} fill="url(#downloadGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Storage breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-3xl p-6"
        >
          <h3 className="font-bold text-white mb-1">توزيع التخزين</h3>
          <p className="text-xs text-white/50 mb-5">حسب نوع الملف</p>

          <div className="mb-5">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/70">{formatBytes(STORAGE_USED_DEMO)} من {formatBytes(STORAGE_TOTAL)}</span>
              <span className="text-royal-300">{usedPct.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-royal-500 via-violet-500 to-purple-500" style={{ width: `${usedPct}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {fileTypes.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                  <t.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 font-medium">{t.label}</span>
                    <span className="text-white/50">{t.size}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-1">
                    <div className={`h-full rounded-full bg-gradient-to-r ${t.color}`} style={{ width: `${[60, 22, 8, 10][i]}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent files */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white">الملفات الأخيرة</h3>
            <p className="text-xs text-white/50">آخر الملفات المرفوعة والمفتوحة</p>
          </div>
          <Link href="/files" className="flex items-center gap-1 text-xs text-royal-400 hover:text-royal-300 transition-colors">
            <span>عرض الكل</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {recentFiles.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl flex-shrink-0">
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{f.name}</p>
                <p className="text-xs text-white/50">{f.size}</p>
              </div>
              <div className="text-left flex-shrink-0">
                <p className="text-xs text-white/40">{f.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  )
}
