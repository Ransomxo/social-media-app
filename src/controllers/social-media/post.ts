import { Response, NextFunction } from 'express';
import { ValidationError, NotFoundError } from '../../utils/errors/AppError';
import { AuthRequest } from '../../middleware/auth';
import prisma from '../../lib/prisma';
import { CreatePostDto } from '../../types/social-media/post';

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

    // Validate input
    if (!postData.content) {
      throw new ValidationError('Content is required');
    }
    if (!postData.platforms || postData.platforms.length === 0) {
      throw new ValidationError('At least one platform must be selected');
    }
    if (!postData.scheduledAt) {
      throw new ValidationError('Scheduled time is required');
    }

    // Ensure scheduled time is in the future
    if (new Date(postData.scheduledAt) <= new Date()) {
      throw new ValidationError('Scheduled time must be in the future');
    }

    // Create post with proper type casting
    const post = await prisma.post.create({
      data: {
        content: postData.content,
        media: postData.media || null,
        platforms: postData.platforms,
        scheduledAt: new Date(postData.scheduledAt),
        status: 'scheduled',
        userId: req.user.id,
      },
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

    const posts = await prisma.post.findMany({
      where: {
        userId: req.user.id,
        status: 'scheduled',
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};
