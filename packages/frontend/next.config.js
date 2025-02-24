/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['i.pravatar.cc'],
    unoptimized: true
  }
};

module.exports = nextConfig;
