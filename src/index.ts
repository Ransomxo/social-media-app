import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { initSentry, sentryErrorHandler } from './utils/monitoring/sentry';
import { apiLimiter, authLimiter, socialMediaLimiter } from './utils/monitoring/rateLimit';
import { logRequest, trackApiUsage } from './middleware/monitoring';
import authRoutes from './routes/auth';
import socialMediaRoutes from './routes/social-media';
import teamRoutes from './routes/team';
import logger from './utils/monitoring/logger';
import { AppError } from './utils/errors/AppError';

const app = express();

// Initialize Sentry (must be first)
initSentry(app);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://omniposting.com',
  credentials: true
}));
app.use(express.json());
app.use(logRequest);

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/social-media', socialMediaLimiter);
app.use('/api', apiLimiter);

// API usage tracking
app.use('/api/social-media', trackApiUsage);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/team', teamRoutes);

// Sentry error handler must be before any other error middleware
app.use(sentryErrorHandler);

// Global error handler
app.use((err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Application error', {
    error: err,
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      userId: req.user?.id
    }
  });

  // Send error response
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, '0.0.0.0', () => {
  logger.info(`Server running on port ${port}`);
});

export default app;
