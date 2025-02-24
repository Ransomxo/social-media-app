import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/', healthRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
