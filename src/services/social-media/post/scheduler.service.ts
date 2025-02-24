import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../utils/errors/AppError';
import { EncryptionService } from '../../../utils/encryption';

const prisma = new PrismaClient();

export interface CreatePostRequest {
  content: string;
  mediaUrls: string[];
  scheduledTime: Date;
  socialAccountIds: string[];
}

export interface ScheduledPost {
  id: string;
  content: string;
  mediaUrls: string[];
  scheduledTime: Date;
  status: string;
  socialAccount: {
    id: string;
    platform: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class PostSchedulerService {
  static async schedulePost(userId: string, request: CreatePostRequest): Promise<void> {
    const { content, mediaUrls, scheduledTime, socialAccountIds } = request;

    // Validate request
    if (!content) {
      throw new AppError('Content is required', 400);
    }
    if (scheduledTime < new Date()) {
      throw new AppError('Scheduled time must be in the future', 400);
    }
    if (!socialAccountIds.length) {
      throw new AppError('At least one social media account is required', 400);
    }

    // Verify account ownership
    const accounts = await prisma.socialMediaAccount.findMany({
      where: {
        id: { in: socialAccountIds },
        userId
      }
    });

    if (accounts.length !== socialAccountIds.length) {
      throw new AppError('Invalid social media account IDs', 400);
    }

    // Create posts for each platform
    await Promise.all(accounts.map(account => 
      prisma.post.create({
        data: {
          content,
          mediaUrls,
          scheduledTime,
          status: 'scheduled',
          socialAccountId: account.id
        }
      })
    ));
  }

  static async getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    const posts = await prisma.post.findMany({
      where: {
        socialAccount: {
          userId
        }
      },
      include: {
        socialAccount: {
          select: {
            id: true,
            platform: true
          }
        }
      },
      orderBy: {
        scheduledTime: 'asc'
      }
    });

    return posts;
  }

  static async processScheduledPosts(): Promise<void> {
    const now = new Date();
    const posts = await prisma.post.findMany({
      where: {
        status: 'scheduled',
        scheduledTime: {
          lte: now
        }
      },
      include: {
        socialAccount: true
      }
    });

    for (const post of posts) {
      try {
        await this.publishPost(post);
        await prisma.post.update({
          where: { id: post.id },
          data: { status: 'posted' }
        });
      } catch (error) {
        console.error(`Failed to publish post ${post.id}:`, error);
        await prisma.post.update({
          where: { id: post.id },
          data: { 
            status: 'failed',
            updatedAt: new Date()
          }
        });
      }
    }
  }

  private static async publishPost(post: any): Promise<void> {
    const accessToken = EncryptionService.decrypt(post.socialAccount.accessToken);
    
    switch (post.socialAccount.platform) {
      case 'twitter':
        await this.publishToTwitter(post, accessToken);
        break;
      case 'instagram':
        await this.publishToInstagram(post, accessToken);
        break;
      default:
        throw new AppError(`Unsupported platform: ${post.socialAccount.platform}`, 400);
    }
  }

  private static async publishToTwitter(post: any, accessToken: string): Promise<void> {
    // Implementation will be added in platform-specific handlers
    throw new Error('Not implemented');
  }

  private static async publishToInstagram(post: any, accessToken: string): Promise<void> {
    // Implementation will be added in platform-specific handlers
    throw new Error('Not implemented');
  }
}
