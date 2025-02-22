import { Router } from 'express';
import { createPost, getScheduledPosts } from '../../controllers/social-media/post';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/scheduled', authMiddleware, getScheduledPosts);

export default router;
