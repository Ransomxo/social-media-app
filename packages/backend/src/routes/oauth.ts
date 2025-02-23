import { Router } from 'express';
import { getAuthUrl, handleCallback, listConnections, removeConnection } from '../controllers/oauth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/auth/:platform', authMiddleware, getAuthUrl);
router.get('/:platform/callback', authMiddleware, handleCallback);
router.get('/connections', authMiddleware, listConnections);
router.delete('/:platform', authMiddleware, removeConnection);

export default router;
