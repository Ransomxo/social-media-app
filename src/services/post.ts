import { Post } from '@prisma/client';
import prisma from '../lib/prisma';
import { ValidationError } from '../utils/errors/AppError';

const SUPPORTED_PLATFORMS = ['facebook', 'twitter', 'instagram', 'linkedin'] as const;
type Platform = typeof SUPPORTED_PLATFORMS[number];

export interface SchedulePostOptions {
  content: string;
  platforms: Platform[];
  scheduledAt: Date;
  media?: string;
  userId: string;
}

export class PostService {
  static validatePlatforms(platforms: string[]): Platform[] {
    const validPlatforms = platforms.filter((platform): platform is Platform => 
      SUPPORTED_PLATFORMS.includes(platform as Platform)
    );

    if (validPlatforms.length === 0) {
      throw new ValidationError(`At least one valid platform must be selected. Supported platforms: ${SUPPORTED_PLATFORMS.join(', ')}`);
    }

    return validPlatforms;
  }

  static async schedulePost(options: SchedulePostOptions): Promise<Post> {
    const { content, platforms, scheduledAt, media, userId } = options;

    // Validate scheduling time
    if (scheduledAt <= new Date()) {
      throw new ValidationError('Scheduled time must be in the future');
    }

    // Validate platforms
    const validatedPlatforms = this.validatePlatforms(platforms);

    // Create post
    const post = await prisma.post.create({
      data: {
        content,
        platforms: validatedPlatforms,
        scheduledAt,
        media: media || null,
        status: 'scheduled',
        userId
      }
    });

    return post;
  }

  static async getScheduledPosts(userId: string): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        userId,
        status: 'scheduled',
        scheduledAt: {
          gte: new Date()
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });
  }
}
