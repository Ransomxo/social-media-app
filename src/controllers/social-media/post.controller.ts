import { Request, Response, NextFunction } from 'express';
import { PostSchedulerService, CreatePostRequest } from '../../services/social-media/post/scheduler.service';
import { AppError } from '../../utils/errors/AppError';

export class PostController {
  static async schedulePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const postRequest: CreatePostRequest = {
        content: req.body.content,
        mediaUrls: req.body.mediaUrls || [],
        scheduledTime: new Date(req.body.scheduledTime),
        socialAccountIds: req.body.socialAccountIds
      };

      await PostSchedulerService.schedulePost(userId, postRequest);
      
      res.status(201).json({
        message: 'Post scheduled successfully'
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
        posts
      });
    } catch (error) {
      next(error);
    }
  }
}
