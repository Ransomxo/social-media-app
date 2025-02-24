import prisma from '../../../lib/prisma';
import { SocialMediaPost } from '@prisma/client';
import logger from '../../../utils/monitoring/logger';
import { TwitterService } from '../platforms/twitter';
import { AppError } from '../../../utils/errors/AppError';
import { Platform } from '../../../types/models';

export interface PostScheduleRequest {
  content: string;
  platform: Platform;
  scheduledFor: Date;
  userId: string;
}

export class PostSchedulerService {
  static async schedulePost(data: PostScheduleRequest): Promise<SocialMediaPost> {
    const { content, platform, scheduledFor, userId } = data;

    // Validate scheduling time
    if (new Date(scheduledFor) <= new Date()) {
      throw new AppError('Scheduled time must be in the future', 400);
    }

    // Create post record
    const post = await prisma.socialMediaPost.create({
      data: {
        content,
        platform,
        scheduledFor,
        status: 'scheduled',
        userId
      }
    });

    // Schedule the post
    try {
      await this.scheduleForPlatform(post);
      return post;
    } catch (error) {
      logger.error('Failed to schedule post', {
        postId: post.id,
        platform,
        error
      });
      
      await prisma.socialMediaPost.update({
        where: { id: post.id },
        data: { status: 'failed' }
      });

      throw new AppError('Failed to schedule post', 500);
    }
  }

  private static async scheduleForPlatform(post: SocialMediaPost): Promise<void> {
    const account = await prisma.socialMediaAccount.findFirst({
      where: {
        userId: post.userId,
        platform: post.platform
      }
    });

    if (!account) {
      throw new AppError(`No connected ${post.platform} account found`, 400);
    }

    switch (post.platform) {
      case 'twitter':
        await TwitterService.schedulePost(post.content, post.scheduledFor, account.accessToken);
        break;
      default:
        throw new AppError(`Unsupported platform: ${post.platform}`, 400);
    }
  }

  static async getScheduledPosts(userId: string): Promise<SocialMediaPost[]> {
    return prisma.socialMediaPost.findMany({
      where: {
        userId,
        status: 'scheduled'
      }
    });
  }
}
