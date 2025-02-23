/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react']
  }
}

module.exports = nextConfig
