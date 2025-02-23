/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
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
  }
};

module.exports = nextConfig;
