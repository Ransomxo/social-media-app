import { SocialToken } from '@prisma/client';
import prisma from '../lib/prisma';
import { OAuthToken, SocialPlatform } from '../types/social-media/oauth';
import { oauthConfigs } from '../config/oauth';
import { ValidationError } from '../utils/errors/AppError';

export class OAuthService {
  static async getAuthorizationUrl(platform: SocialPlatform): Promise<string> {
    const config = oauthConfigs[platform];
    if (!config) {
      throw new ValidationError(`Unsupported platform: ${platform}`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope.join(' '),
      response_type: 'code',
      state: platform // Used to verify the callback
    });

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/v12.0/dialog/oauth?${params}`;
      case 'twitter':
        return `https://twitter.com/i/oauth2/authorize?${params}`;
      case 'instagram':
        return `https://api.instagram.com/oauth/authorize?${params}`;
      case 'linkedin':
        return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
      default:
        throw new ValidationError(`Unsupported platform: ${platform}`);
    }
  }

  static async saveSocialToken(
    userId: string,
    platform: SocialPlatform,
    token: OAuthToken
  ): Promise<SocialToken> {
    return prisma.socialToken.upsert({
      where: {
        userId_platform: {
          userId,
          platform
        }
      },
      update: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt
      },
      create: {
        userId,
        platform,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt
      }
    });
  }

  static async getUserSocialTokens(userId: string): Promise<SocialToken[]> {
    return prisma.socialToken.findMany({
      where: { userId }
    });
  }

  static async deleteSocialToken(userId: string, platform: SocialPlatform): Promise<void> {
    await prisma.socialToken.delete({
      where: {
        userId_platform: {
          userId,
          platform
        }
      }
    });
  }
}
