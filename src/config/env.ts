import { config } from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
config({ path: path.resolve(process.cwd(), envFile) });

// Required environment variables based on environment
const requiredEnvVars = {
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'OPENAI_API_KEY',
    'ENCRYPTION_KEY',
    'SENTRY_DSN'
  ],
  development: ['DATABASE_URL'],
  test: ['DATABASE_URL']
};

// Common required variables for all environments
const commonVars = ['NODE_ENV', 'PORT'];

// Get current environment
const env = process.env.NODE_ENV || 'development';
const required = [...commonVars, ...(requiredEnvVars[env as keyof typeof requiredEnvVars] || [])];

// Verify required environment variables are present
required.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable for ${env} environment: ${envVar}`);
  }
});

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  openaiApiKey: process.env.OPENAI_API_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,
  sentryDsn: process.env.SENTRY_DSN,
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  },
  socialMedia: {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
    },
    instagram: {
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }
  }
};
