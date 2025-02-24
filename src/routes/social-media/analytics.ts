import { Router } from 'express';
import { AnalyticsController } from '../../controllers/analytics.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get(
  '/data',
  authenticate,
  AnalyticsController.getAnalytics
);

router.get(
  '/metrics',
  authenticate,
  AnalyticsController.getMetrics
);

export default router;
