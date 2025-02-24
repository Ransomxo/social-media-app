import { Request, Response, NextFunction } from 'express';
import { PostSchedulerService, PostScheduleRequest } from '../../services/social-media/post/scheduler.service';
import { AppError } from '../../utils/errors/AppError';

export class PostController {
  static async schedulePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const postRequest: PostScheduleRequest = {
        content: req.body.content,
        platform: req.body.platform,
        scheduledFor: new Date(req.body.scheduledFor),
        userId
      };

      const post = await PostSchedulerService.schedulePost(postRequest);
      
      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  static async getScheduledPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const posts = await PostSchedulerService.getScheduledPosts(userId);
      
      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      next(error);
    }
  }
}
