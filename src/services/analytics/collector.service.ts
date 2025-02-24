import prisma from '../../lib/prisma';
import { SocialMediaPost } from '@prisma/client';
import { Platform, AnalyticsMetrics } from '../../types/models';
import logger from '../../utils/monitoring/logger';
import { TwitterService } from '../social-media/platforms/twitter';
import { AppError } from '../../utils/errors/AppError';

type AnalyticsData = AnalyticsMetrics;

export class AnalyticsCollectorService {
  static async collectAnalytics(
    userId: string,
    platform: Platform
  ): Promise<AnalyticsData[]> {
    try {
      const account = await prisma.socialMediaAccount.findFirst({
        where: { userId, platform }
      });

      if (!account) {
        throw new AppError(`No ${platform} account connected`, 400);
      }

      const posts = await prisma.socialMediaPost.findMany({
        where: {
          userId,
          platform,
          status: 'published'
        }
      });

      const analyticsData = await this.fetchAnalytics(posts, account.accessToken);
      
      logger.info('Analytics collected', {
        userId,
        platform,
        postsCount: posts.length
      });

      return analyticsData;
    } catch (error) {
      logger.error('Analytics collection failed', {
        userId,
        platform,
        error
      });
      throw new AppError('Failed to collect analytics', 500);
    }
  }

  private static async fetchAnalytics(
    posts: SocialMediaPost[],
    accessToken: string
  ): Promise<AnalyticsData[]> {
    const analyticsPromises = posts.map(post => {
      switch (post.platform) {
        case 'twitter':
          return TwitterService.getPostAnalytics(post.id, accessToken);
        default:
          throw new AppError(`Unsupported platform: ${post.platform}`, 400);
      }
    });

    return Promise.all(analyticsPromises);
  }
}
