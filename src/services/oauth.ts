import { OAuthToken, SocialPlatform, SocialTokenResponse } from '../types/social-media/oauth';
import { oauthConfigs } from '../config/oauth';
import { ValidationError } from '../utils/errors/AppError';
import prisma from '../lib/prisma';

interface DBSocialToken {
  id: string;
  platform: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OAuthService {
  private static mapSocialTokenToResponse(token: DBSocialToken): SocialTokenResponse {
    return {
      id: token.id,
      platform: token.platform as SocialPlatform,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: token.expiresAt,
      userId: token.userId,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt
    };
  }

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
    const result = await prisma.$queryRaw`
      INSERT INTO social_tokens (
        id, platform, access_token, refresh_token, expires_at, user_id, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${platform}, ${token.accessToken}, ${token.refreshToken}, ${token.expiresAt}, ${userId}, NOW(), NOW()
      )
      ON CONFLICT (user_id, platform) DO UPDATE SET
        access_token = ${token.accessToken},
        refresh_token = ${token.refreshToken},
        expires_at = ${token.expiresAt},
        updated_at = NOW()
      RETURNING *
    ` as unknown as DBSocialToken;
    
    return this.mapSocialTokenToResponse(result);
  }

  static async getUserSocialTokens(userId: string): Promise<SocialTokenResponse[]> {
    const tokens = await prisma.$queryRaw`
      SELECT * FROM social_tokens WHERE user_id = ${userId}
    ` as unknown as DBSocialToken[];
    
    return tokens.map((token: DBSocialToken) => this.mapSocialTokenToResponse(token));
  }

  static async deleteSocialToken(userId: string, platform: SocialPlatform): Promise<void> {
    await prisma.$executeRaw`
      DELETE FROM social_tokens WHERE user_id = ${userId} AND platform = ${platform}
    `;
  }
}
