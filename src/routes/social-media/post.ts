import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { PostController } from '../../controllers/social-media/post.controller';

const router = Router();

// Schedule a new post
router.post('/schedule', authMiddleware, PostController.schedulePost);

// Get scheduled posts
router.get('/', authMiddleware, PostController.getScheduledPosts);

export default router;
