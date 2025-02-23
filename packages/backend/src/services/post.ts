import { Post } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ValidationError } from '../utils/errors/AppError';

export const SUPPORTED_PLATFORMS = ['facebook', 'twitter', 'instagram', 'linkedin'] as const;
export type Platform = typeof SUPPORTED_PLATFORMS[number];

export interface SchedulePostOptions {
  content: string;
  platforms: Platform[];
  scheduledAt: Date;
  media?: string;
  userId: string;
}

import { FacebookService } from './platforms/facebook';
import { TwitterService } from './platforms/twitter';
import { InstagramService } from './platforms/instagram';
import { LinkedInService } from './platforms/linkedin';

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
    // Ensure platforms is an array and validate
    const platformsArray = Array.isArray(platforms) ? platforms : [platforms];
    const validatedPlatforms = this.validatePlatforms(platformsArray);

    // Mock platform scheduling for now since we don't have real platform integrations yet
    const platformResults = validatedPlatforms.map(platform => ({
      status: 'fulfilled',
      value: {
        success: true,
        platformId: platform
      }
    }));

    // Check for failures
    const failures = platformResults.filter(result => !result.value.success);

    // Create post with appropriate status
    const post = await prisma.post.create({
      data: {
        content,
        platforms: validatedPlatforms,
        scheduledAt,
        media: media || null,
        status: failures.length > 0 ? 'failed' : 'scheduled',
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
