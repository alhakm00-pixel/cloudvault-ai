/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance
  swcMinify: true,
  compress:  true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats:         ['image/avif', 'image/webp'],
    deviceSizes:     [390, 640, 750, 1080, 1200, 1920],
    imageSizes:      [64, 128, 256, 400],
    minimumCacheTTL: 86400,
    remotePatterns:  [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Cache static assets
        source: '/icons/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Cache SW separately
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ]
  },

  // Bundle analyzer (optional)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },

  // Webpack performance
  webpack(config, { isServer }) {
    if (!isServer) {
      // Tree-shake unused icons
      config.resolve.alias = {
        ...config.resolve.alias,
      }
    }
    return config
  },
}

module.exports = nextConfig
