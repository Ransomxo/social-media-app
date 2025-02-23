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

  webpack: (config, { isServer, dev }) => {
    console.log('=== Build Debug Information ===');
    console.log(`Build timestamp: ${new Date().toISOString()}`);
    console.log(`Build environment: ${process.env.NODE_ENV}`);
    console.log(`Build target: ${isServer ? 'server' : 'client'}`);
    console.log(`Development mode: ${dev ? 'true' : 'false'}`);
    console.log('Next.js config:', {
      reactStrictMode: nextConfig.reactStrictMode,
      swcMinify: nextConfig.swcMinify,
      output: nextConfig.output,
      logging: nextConfig.logging
    });
    console.log('Environment variables:', {
      NEXT_PUBLIC_API_URL: !!process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_IMAGE_HOSTNAME: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || 'localhost'
    });
    console.log('Node version:', process.version);
    console.log('Working directory:', process.cwd());
    console.log('Webpack mode:', config.mode);
    console.log('=== End Debug Information ===');
    return config;
  }
};

module.exports = nextConfig;
