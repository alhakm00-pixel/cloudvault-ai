'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Cloud, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const passwordChecks = [
  { label: '8 أحرف على الأقل', test: (p: string) => p.length >= 8 },
  { label: 'حرف كبير', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'رقم', test: (p: string) => /[0-9]/.test(p) },
  { label: 'رمز خاص', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)

  const strength = passwordChecks.filter((c) => c.test(password)).length
  const strengthLabels = ['', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية']
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error('الرجاء تعبئة جميع الحقول'); return }
    if (!agree) { toast.error('يجب الموافقة على الشروط'); return }
    if (strength < 2) { toast.error('كلمة المرور ضعيفة جداً'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success('تم إنشاء حسابك! مرحباً بك 🎉')
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-violet-500 flex items-center justify-center shadow-glow-md">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black glow-text">CloudVault AI</span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black text-white mb-2">أنشئ حسابك المجاني</h1>
            <p className="text-white/60 text-sm">2TB مجاناً — لا بطاقة ائتمان مطلوبة</p>
          </div>

          {/* Free plan banner */}
          <div className="glass rounded-2xl p-4 mb-6 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-lg">🎁</div>
              <div>
                <p className="text-sm font-bold text-white">تشمل الخطة المجانية:</p>
                <p className="text-xs text-white/60">2 تيرابايت · مشغل فيديو · مشاركة ملفات · AI أساسي</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="أحمد محمد" className="input-glass pr-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ahmed@example.com" className="input-glass pr-10" />
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-white/50">القوة: <span className="text-white/80">{strengthLabels[strength]}</span></p>
                  <div className="grid grid-cols-2 gap-1">
                    {passwordChecks.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <Check className={`w-3 h-3 ${c.test(password) ? 'text-emerald-400' : 'text-white/20'}`} />
                        <span className={c.test(password) ? 'text-emerald-400' : 'text-white/40'}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-4 h-4 rounded accent-royal-500" />
              <span className="text-xs text-white/60 leading-relaxed">
                أوافق على{' '}
                <a href="#" className="text-royal-400 hover:underline">شروط الاستخدام</a>
                {' '}و{' '}
                <a href="#" className="text-royal-400 hover:underline">سياسة الخصوصية</a>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>جاري الإنشاء...</span></>
              ) : (
                <><span>إنشاء الحساب مجاناً</span><ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center text-sm text-white/50 mt-6">
          لديك حساب بالفعل؟{' '}
          <Link href="/auth/login" className="text-royal-400 hover:text-royal-300 font-medium transition-colors">سجّل دخولك</Link>
        </motion.p>
      </div>
    </div>
  )
}
