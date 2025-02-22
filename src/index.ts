import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import analyticsRoutes from './routes/social-media/analytics.js';

dotenv.config();

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: express.Request, res: express.Response): void => {
  res.json({ message: 'Welcome to the Social Media Analytics API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/social-media', analyticsRoutes);

// Error handling
app.use(errorHandler);

// Server start
export const initializeApp = async () => {
  try {
    if (require.main === module) {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  initializeApp();
}

export default app;
