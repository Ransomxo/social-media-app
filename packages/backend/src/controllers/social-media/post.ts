import { Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '../../utils/errors/AppError';
import { AuthRequest } from '../../middleware/auth';
import { CreatePostDto } from '../../types/social-media/post';
import { PostService, Platform, SUPPORTED_PLATFORMS } from '../../services/post';

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

    try {
      // Validate required fields
      if (!postData.content || !postData.platforms || !postData.scheduledAt) {
        throw new ValidationError('Missing required fields');
      }

      // Validate platforms array
      if (!Array.isArray(postData.platforms) || postData.platforms.length === 0) {
        throw new ValidationError('Platforms must be a non-empty array');
      }

      // Validate scheduling time
      const scheduledAt = new Date(postData.scheduledAt);
      if (scheduledAt <= new Date()) {
        throw new ValidationError('Scheduled time must be in the future');
      }

      const post = await PostService.schedulePost({
        content: postData.content,
        platforms: postData.platforms as Platform[],
        scheduledAt,
        media: postData.media,
        userId: req.user.id
      });

      res.status(201).json(post);
    } catch (serviceError) {
      if (serviceError instanceof ValidationError) {
        res.status(400).json({ error: serviceError.message });
        return;
      }
      throw serviceError;
    }
  } catch (error) {
    console.error('Post creation error:', error);
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
    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};
