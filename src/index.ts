import express from 'express';
import cors from 'cors';
import { initSentry } from './utils/monitoring/sentry';
import { apiLimiter, authLimiter, socialMediaLimiter } from './utils/monitoring/rateLimit';
import { logRequest, trackApiUsage } from './middleware/monitoring';
import authRoutes from './routes/auth';
import socialMediaRoutes from './routes/social-media';
import teamRoutes from './routes/team';
import logger from './utils/monitoring/logger';

const app = express();

// Initialize Sentry
initSentry(app);

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

// Error handling
app.use((err, req, res, next) => {
  logger.error('Application error', {
    error: err,
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      userId: req.user?.id
    }
  });

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;
