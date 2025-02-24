import { Request, Response, NextFunction } from 'express';
import { OpenAIService } from '../../services/ai/openai.service';
import { AppError } from '../../utils/errors/AppError';

export class CaptionController {
  static async generateCaption(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { content, platform, tone, length } = req.body;
      const caption = await OpenAIService.generateCaption(content, platform, tone, length);
      res.status(200).json({ caption });
    } catch (error) {
      next(new AppError('Failed to generate caption', 500));
    }
  }
}
