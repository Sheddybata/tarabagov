/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from localhost and Supabase storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Enable image optimization
    unoptimized: false,
  },
  // Ensure proper routing on Vercel
  trailingSlash: false,
  // Optimize for Vercel
  reactStrictMode: true,
  // Compression
  compress: true,
  // Production optimizations
  swcMinify: true,
  // Power optimizations
  poweredByHeader: false,
}

module.exports = nextConfig

