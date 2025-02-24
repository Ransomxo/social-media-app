import { Router } from 'express';
import { AnalyticsController } from '../../controllers/analytics.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get(
  '/data',
  authMiddleware,
  AnalyticsController.getAnalytics
);

router.get(
  '/metrics',
  authMiddleware,
  AnalyticsController.getAnalytics
);

export default router;
