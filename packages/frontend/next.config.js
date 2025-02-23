/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
    level: 'debug'
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
  onError: (err) => {
    console.error('Next.js build error:', err);
  },
  webpack: (config, { isServer, dev }) => {
    console.log(`Building for ${isServer ? 'server' : 'client'}, environment: ${process.env.NODE_ENV}`);
    console.log('Next.js config:', {
      reactStrictMode: nextConfig.reactStrictMode,
      swcMinify: nextConfig.swcMinify,
      output: nextConfig.output,
      env: process.env.NODE_ENV
    });
    return config;
  }
};

module.exports = nextConfig;
