'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Cloud, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Fingerprint } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('الرجاء تعبئة جميع الحقول')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success('مرحباً بك في CloudVault AI!')
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-md">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black glow-text">CloudVault AI</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black text-white mb-2">مرحباً بعودتك</h1>
            <p className="text-white/60 text-sm">سجّل دخولك للوصول إلى ملفاتك</p>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="btn-ghost flex items-center justify-center gap-2 py-2.5 text-sm">
              <span className="text-lg">🌐</span>
              <span>Google</span>
            </button>
            <button className="btn-ghost flex items-center justify-center gap-2 py-2.5 text-sm">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-xs">أو بالبريد الإلكتروني</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed@example.com"
                  className="input-glass pr-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-glass pr-10 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-royal-500"
                />
                <span className="text-sm text-white/60">تذكرني</span>
              </label>
              <a href="#" className="text-sm text-royal-400 hover:text-royal-300 transition-colors">
                نسيت كلمة المرور؟
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Biometric */}
          <div className="mt-4 text-center">
            <button className="inline-flex items-center gap-2 text-sm text-royal-400 hover:text-royal-300 transition-colors">
              <Fingerprint className="w-4 h-4" />
              <span>تسجيل بصمة / Face ID</span>
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-white/50 mt-6"
        >
          ليس لديك حساب؟{' '}
          <Link href="/auth/register" className="text-royal-400 hover:text-royal-300 font-medium transition-colors">
            أنشئ حساباً مجانياً
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
