import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import debug from 'debug';

const log = debug('app:server');
const buildLog = debug('app:build');
const envLog = debug('app:env');
const dbLog = debug('app:database');
const deployLog = debug('app:deploy');

import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import analyticsRoutes from './routes/social-media/analytics';
import postRoutes from './routes/social-media/post';
import oauthRoutes from './routes/oauth';
import { prisma } from './lib/prisma';

dotenv.config();

dbLog('Initializing database connection');

process.on('beforeExit', async () => {
  await prisma.$disconnect();
  dbLog('Database connection closed');
});

// Log environment and build information
buildLog('Node version:', process.version);
buildLog('TypeScript version:', require('typescript').version);
buildLog('Current working directory:', process.cwd());
buildLog('Environment:', process.env.NODE_ENV);

// Log environment variables (safely)
envLog('Environment variables configured:', {
  DATABASE_URL: !!process.env.DATABASE_URL,
  JWT_SECRET: !!process.env.JWT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  PORT: process.env.PORT || '3000'
});

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Import middleware and routes
import { authMiddleware } from './middleware/auth';
import healthRoutes from './routes/health';

// Middleware
log('Configuring middleware...');
buildLog('Setting up middleware configuration');

// Configure CORS
const corsOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
log('CORS configured with origin:', corsOrigin);
buildLog('CORS middleware configured with origin:', corsOrigin);

// Configure JSON parsing
app.use(express.json());
log('Express JSON middleware configured');
buildLog('Express JSON middleware configured');

// Routes
app.get('/', (req: express.Request, res: express.Response): void => {
  res.json({ message: 'Welcome to the Social Media Analytics API' });
});

// Health check route
app.use('/api/health', healthRoutes);

app.use('/api/auth', authRoutes);

// Protected routes with auth middleware
app.use('/api/social-media', authMiddleware, analyticsRoutes);
app.use('/api/posts', authMiddleware, postRoutes);
app.use('/api/oauth', oauthRoutes);

// Error handling
app.use(errorHandler);

// Server start
export const initializeApp = async () => {
  try {
    if (require.main === module) {
      app.listen(port, () => {
        log(`Server is running on port ${port}`);
        deployLog('Server deployment status:', {
          port,
          nodeEnv: process.env.NODE_ENV,
          corsOrigin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        });
      });
    }
  } catch (error) {
    log('Error starting server:', error);
    buildLog('Build failed with error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  initializeApp();
}

export default app;
