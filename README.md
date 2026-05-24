# ☁️ My CloudVault AI

منصة تخزين سحابي شخصية مدعومة بالذكاء الاصطناعي — مشابهة لـ TeraBox لكن أقوى وأجمل.

---

## 🚀 تشغيل المشروع محلياً

### المتطلبات
- Node.js 18+
- npm أو yarn أو pnpm

### الخطوات

```bash
# 1. فك الضغط أو clone من GitHub
cd my-cloudvault-ai

# 2. تثبيت الحزم
npm install

# 3. نسخ ملف البيئة
cp .env.local.example .env.local
# عدّل القيم في .env.local

# 4. تشغيل في وضع التطوير
npm run dev

# 5. افتح المتصفح على
# http://localhost:3000
```

---

## 📱 تشغيل على الجوال

### طريقة 1 — شبكة Wi-Fi المحلية
```bash
npm run dev -- --hostname 0.0.0.0
# ثم افتح http://[IP-الكمبيوتر]:3000 من الجوال
# مثال: http://192.168.1.5:3000
```

### طريقة 2 — نشر على Vercel (أسهل)
ثم استخدم الرابط من أي جهاز في العالم.

### طريقة 3 — ngrok (مؤقت)
```bash
npm install -g ngrok
ngrok http 3000
# يعطيك رابط مؤقت https://xxx.ngrok.io
```

---

## 🐙 نشر على GitHub

```bash
git init
git add .
git commit -m "🚀 initial commit — CloudVault AI"
git branch -M main
git remote add origin https://github.com/USERNAME/my-cloudvault-ai.git
git push -u origin main
```

---

## ▲ نشر على Vercel (مجاناً)

```bash
# الطريقة الأسرع:
npx vercel

# أو من لوحة Vercel:
# 1. vercel.com → New Project
# 2. Import from GitHub
# 3. أضف Environment Variables من .env.local
# 4. Deploy ✅
```

متغيرات البيئة المطلوبة في Vercel:
- `NEXT_PUBLIC_APP_URL`
- `JWT_SECRET`
- `DATABASE_URL`
- `CLOUDFLARE_R2_*`
- `OPENAI_API_KEY`

---

## 🌐 نشر على Cloudflare Pages

```bash
# 1. بناء المشروع
npm run build

# 2. من Cloudflare Dashboard:
# Pages → Create project → Connect to Git
# Build command: npm run build
# Build output: .next
# Framework preset: Next.js

# 3. أو عبر CLI:
npm install -g wrangler
wrangler pages deploy .next
```

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── page.tsx              # الصفحة الرئيسية
│   ├── layout.tsx            # Layout الرئيسي
│   ├── globals.css           # التصميم العام
│   ├── auth/
│   │   ├── login/page.tsx    # تسجيل الدخول
│   │   └── register/page.tsx # إنشاء حساب
│   ├── dashboard/page.tsx    # لوحة التحكم
│   ├── files/page.tsx        # إدارة الملفات
│   ├── player/page.tsx       # مشغل الفيديو
│   └── settings/page.tsx     # الإعدادات
├── components/
│   └── layout/
│       ├── AppLayout.tsx     # Layout المصادق
│       ├── Sidebar.tsx       # الشريط الجانبي
│       └── TopBar.tsx        # الشريط العلوي
└── lib/
    ├── store.ts              # Zustand store
    └── utils.ts              # أدوات مساعدة
```

---

## 🎨 المميزات — المرحلة 1

- ✅ الصفحة الرئيسية (Landing Page) مع glassmorphism
- ✅ تسجيل الدخول + إنشاء حساب
- ✅ Dashboard مع رسوم بيانية
- ✅ صفحة الملفات + Drag & Drop
- ✅ مشغل الفيديو مع ترجمات AI
- ✅ صفحة الإعدادات (6 أقسام)
- ✅ Sidebar متجاوب
- ✅ RTL عربي كامل
- ✅ Dark mode
- ✅ Service Worker (Offline)
- ✅ PWA ready

---

## 🛣️ المراحل القادمة

- **المرحلة 2**: Backend — Node.js + Express + PostgreSQL + Prisma + JWT
- **المرحلة 3**: Cloudflare R2 — رفع حقيقي + مشاركة + روابط مباشرة
- **المرحلة 4**: AI — Whisper + ترجمة عربية + بحث ذكي
- **المرحلة 5**: Offline mode + PWA متقدم + إشعارات

