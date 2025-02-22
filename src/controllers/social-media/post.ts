import { Response, NextFunction } from 'express';
import { NotFoundError } from '../../utils/errors/AppError';
import { AuthRequest } from '../../middleware/auth';
import { CreatePostDto } from '../../types/social-media/post';
import { PostService } from '../../services/post';

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new NotFoundError('User not found');
    }

    const postData: CreatePostDto = req.body;

    const post = await PostService.schedulePost({
      content: postData.content,
      platforms: postData.platforms,
      scheduledAt: new Date(postData.scheduledAt),
      media: postData.media,
      userId: req.user.id
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const getScheduledPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new NotFoundError('User not found');
    }

    const posts = await PostService.getScheduledPosts(req.user.id);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
