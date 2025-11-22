/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  // Ensure proper routing on Vercel
  trailingSlash: false,
  // Optimize for Vercel
  reactStrictMode: true,
}

module.exports = nextConfig

