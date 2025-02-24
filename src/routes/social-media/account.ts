import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { SocialMediaAccountController } from '../../controllers/social-media/account.controller';

const router = Router();

// Connect a new social media account
router.post('/connect', authMiddleware, SocialMediaAccountController.connectAccount);

// Get all connected accounts
router.get('/', authMiddleware, SocialMediaAccountController.getAccounts);

export default router;
