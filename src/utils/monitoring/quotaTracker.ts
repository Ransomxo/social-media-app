import prisma from '../../lib/prisma';
import logger from './logger';

export class QuotaTracker {
  static async trackApiUsage(userId: string, platform: string): Promise<void> {
    try {
      await prisma.apiUsage.create({
        data: {
          userId,
          platform,
          timestamp: new Date()
        }
      });
    } catch (error) {
      logger.error('Failed to track API usage', {
        userId,
        platform,
        error
      });
    }
  }

  static async checkQuota(userId: string, platform: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.apiUsage.count({
      where: {
        userId,
        platform,
        timestamp: {
          gte: today
        }
      }
    });

    const limits = {
      twitter: 1000,
      facebook: 1000,
      instagram: 1000
    };

    return usage < (limits as Record<string, number>)[platform] || false;
  }
}
