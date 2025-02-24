import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/errors/AppError';

export class AnalyticsController {
  static async getAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { platform, startDate, endDate } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const posts = await prisma.socialMediaPost.findMany({
        where: {
          userId,
          ...(platform && { platform: platform as string }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string)
            }
          })
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      next(error);
    }
  }
}
