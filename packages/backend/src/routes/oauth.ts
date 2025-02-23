import { Router } from 'express';
import { getAuthorizationUrl, handleCallback, listConnections, deleteSocialToken } from '../controllers/oauth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/auth/:platform', authMiddleware, getAuthorizationUrl);
router.get('/:platform/callback', authMiddleware, handleCallback);
router.get('/connections', authMiddleware, listConnections);
router.delete('/:platform', authMiddleware, deleteSocialToken);

export default router;
