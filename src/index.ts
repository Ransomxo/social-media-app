import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import teamRoutes from './routes/team';
import socialMediaRoutes from './routes/social-media';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/social-media', socialMediaRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
