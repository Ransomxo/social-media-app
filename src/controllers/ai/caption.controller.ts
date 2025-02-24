import { Request, Response, NextFunction } from 'express';
import { OpenAIService, GenerateCaptionRequest } from '../../services/ai/openai.service';
import { AppError } from '../../utils/errors/AppError';

export class CaptionController {
  static async generateCaption(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const request: GenerateCaptionRequest = {
        content: req.body.content,
        platform: req.body.platform,
        tone: req.body.tone,
        length: req.body.length
      };

      const caption = await OpenAIService.generateCaption(request);
      
      res.json({
        caption
      });
    } catch (error) {
      next(error);
    }
  }
}
