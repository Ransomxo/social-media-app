import { PrismaClient, Platform } from '@prisma/client';
import { OAuthToken, SocialPlatform, SocialTokenResponse } from '../types/social-media/oauth';
import { oauthConfigs } from '../config/oauth';
import { ValidationError } from '../utils/errors/AppError';

const prisma = new PrismaClient();

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
  ): Promise<SocialTokenResponse> {
    const result = await prisma.socialToken.upsert({
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
    
    return {
      ...result,
      platform: result.platform as SocialPlatform
    };
  }

  static async getUserSocialTokens(userId: string): Promise<SocialTokenResponse[]> {
    const tokens = await prisma.socialToken.findMany({
      where: { userId }
    });
    
    return tokens.map((token: { 
      id: string;
      platform: string;
      accessToken: string;
      refreshToken: string | null;
      expiresAt: Date | null;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      ...token,
      platform: token.platform as SocialPlatform
    }));
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
