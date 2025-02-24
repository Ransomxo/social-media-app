import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { CaptionController } from '../../controllers/ai/caption.controller';

const router = Router();

router.post('/generate', authMiddleware, CaptionController.generateCaption);

export default router;
