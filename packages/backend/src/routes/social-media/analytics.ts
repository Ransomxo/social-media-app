import { Router } from 'express';
import { getSocialMediaAnalytics } from '../../controllers/social-media/analytics';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/data', authMiddleware, getSocialMediaAnalytics);

export default router;
