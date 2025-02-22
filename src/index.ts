import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.get('/', (req: express.Request, res: express.Response): void => {
  res.json({ message: 'Welcome to the Social Media Analytics API' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
