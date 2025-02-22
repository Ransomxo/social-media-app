import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';

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

// Error handling
app.use(errorHandler);

// Database initialization and server start
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log('Database connection established');
      });
    })
    .catch((error) => {
      console.error('Error connecting to database:', error);
      process.exit(1);
    });
}

export default app;
