import { Router } from 'express';
import analyticsRoutes from './analytics';
import postRoutes from './post';
import accountRoutes from './account';

const router = Router();

router.use('/analytics', analyticsRoutes);
router.use('/posts', postRoutes);
router.use('/accounts', accountRoutes);

export default router;
