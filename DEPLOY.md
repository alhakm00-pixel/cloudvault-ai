# 🚀 CloudVault AI — دليل النشر الكامل

## المرحلة 1: التشغيل المحلي

```bash
cd cloudvault

# تثبيت الحزم
npm install

# تشغيل
npm run dev
# http://localhost:3000
```

## المرحلة 2: التشغيل مع Backend

```bash
# Terminal 1 — Database
cd cloudvault-backend
docker-compose up -d postgres redis

# Terminal 2 — Backend API
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
# http://localhost:5000

# Terminal 3 — Frontend
cd cloudvault
npm run dev
# http://localhost:3000
```

---

## 📱 تثبيت على الجوال

### Android (Chrome)
1. افتح `http://localhost:3000` أو رابط Vercel
2. اضغط ⋮ ثم "إضافة إلى الشاشة الرئيسية"
3. اضغط "تثبيت"

### iOS (Safari)
1. افتح الرابط في Safari
2. اضغط زر المشاركة ↑
3. اضغط "إضافة إلى الشاشة الرئيسية"

### تشغيل على شبكة Wi-Fi المحلية
```bash
npm run dev -- --hostname 0.0.0.0
# استخدم: http://[IP-الكمبيوتر]:3000
# مثال:   http://192.168.1.5:3000
```

---

## ▲ نشر Vercel (مجاناً)

```bash
# 1. ارفع على GitHub
git init && git add . && git commit -m "CloudVault AI"
git remote add origin https://github.com/USER/cloudvault.git
git push -u origin main

# 2. من vercel.com
# New Project → Import → Deploy

# 3. أو CLI
npx vercel
```

**متغيرات البيئة:**
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
```

---

## 🌐 نشر Cloudflare Pages

```bash
npm run build

# من Cloudflare Dashboard:
# Pages → Create project → Connect GitHub
# Framework: Next.js
# Build:     npm run build
# Output:    .next

# أو CLI:
npm install -g wrangler
wrangler pages deploy .next --project-name cloudvault
```

---

## 🚂 نشر Backend على Railway

```bash
cd cloudvault-backend

# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع
railway new

# إضافة PostgreSQL + Redis
railway add
# اختر PostgreSQL
railway add
# اختر Redis

# نشر
railway up
```

---

## 🐳 نشر Docker كامل

```bash
# docker-compose.yml في cloudvault-backend/
docker-compose up --build

# Frontend
docker build -t cloudvault-frontend .
docker run -p 3000:3000 cloudvault-frontend
```

---

## 🔧 إعداد Cloudflare R2

1. افتح Cloudflare Dashboard → R2
2. Create Bucket → `cloudvault-files`
3. Settings → Public Access → Enable
4. Create API Token → R2 Read & Write
5. أضف في `.env`:
   ```
   R2_ACCESS_KEY_ID=xxx
   R2_SECRET_ACCESS_KEY=xxx
   R2_BUCKET_NAME=cloudvault-files
   R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
   R2_PUBLIC_URL=https://pub-xxx.r2.dev
   ```

---

## 🤖 إعداد OpenAI (للـ AI)

1. platform.openai.com → API Keys → Create
2. أضف في `.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

---

## 📊 ملخص التقنيات

| الطبقة      | التقنية                            |
|-------------|-------------------------------------|
| Frontend    | Next.js 14 + TypeScript + Tailwind  |
| State       | Zustand                             |
| Animation   | Framer Motion                       |
| Backend     | Node.js + Express + TypeScript      |
| Database    | PostgreSQL + Prisma ORM             |
| Storage     | Cloudflare R2 (S3-compatible)       |
| Auth        | JWT + Refresh Tokens                |
| AI          | OpenAI Whisper + GPT-4o             |
| PWA         | Service Worker + Web Push           |
| Cache       | Redis + Browser Cache               |
| Deploy      | Vercel + Railway + Cloudflare       |
