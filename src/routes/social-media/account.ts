import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// Connect a new social media account
router.post('/connect', authMiddleware, async (req, res, next) => {
  // Implementation coming in social media account management step
  res.status(501).json({ message: 'Not implemented yet' });
});

// Get all connected accounts
router.get('/', authMiddleware, async (req, res, next) => {
  // Implementation coming in social media account management step
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
