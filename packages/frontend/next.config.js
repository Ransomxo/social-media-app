/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
    level: 'debug',
    buildErrors: true,
    development: {
      compilationErrorsCount: true,
      stackTraceLimit: 50
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || 'localhost',
        port: '',
        pathname: '/avatars/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },

  webpack: (config) => config
};

module.exports = nextConfig;
