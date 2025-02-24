import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../../utils/encryption';
import { ConnectAccountRequest, TokenResponse, SocialMediaPlatform } from '../../types/social-media';
import { AppError } from '../../utils/errors/AppError';

const prisma = new PrismaClient();

const PLATFORMS: Record<string, SocialMediaPlatform> = {
  twitter: {
    name: 'twitter',
    displayName: 'Twitter',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    apiBaseUrl: 'https://api.twitter.com/2'
  },
  instagram: {
    name: 'instagram',
    displayName: 'Instagram',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    apiBaseUrl: 'https://graph.instagram.com'
  },
  linkedin: {
    name: 'linkedin',
    displayName: 'LinkedIn',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    apiBaseUrl: 'https://api.linkedin.com/v2'
  },
  facebook: {
    name: 'facebook',
    displayName: 'Facebook',
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
    apiBaseUrl: 'https://graph.facebook.com/v12.0'
  }
};

export class SocialMediaAccountService {
  static async connectAccount(userId: string, request: ConnectAccountRequest): Promise<void> {
    const platform = PLATFORMS[request.platform];
    if (!platform) {
      throw new AppError('Unsupported platform', 400);
    }

    const tokens = await this.exchangeCodeForTokens(platform, request.code, request.redirectUri);
    const accountId = await this.getAccountId(platform, tokens.accessToken);

    const existingAccount = await prisma.socialMediaAccount.findFirst({
      where: {
        userId,
        platform: platform.name,
        accountId
      }
    });

    if (existingAccount) {
      throw new AppError('Account already connected', 400);
    }

    await prisma.socialMediaAccount.create({
      data: {
        userId,
        platform: platform.name,
        accountId,
        accessToken: EncryptionService.encrypt(tokens.accessToken),
        refreshToken: tokens.refreshToken ? EncryptionService.encrypt(tokens.refreshToken) : null
      }
    });
  }

  static async getAccounts(userId: string) {
    const accounts = await prisma.socialMediaAccount.findMany({
      where: { userId },
      select: {
        id: true,
        platform: true,
        accountId: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return accounts;
  }

  private static async exchangeCodeForTokens(
    platform: SocialMediaPlatform,
    code: string,
    redirectUri: string
  ): Promise<TokenResponse> {
    // Implementation will vary by platform
    // This is a placeholder that will be implemented per platform
    throw new Error('Not implemented');
  }

  private static async getAccountId(
    platform: SocialMediaPlatform,
    accessToken: string
  ): Promise<string> {
    // Implementation will vary by platform
    // This is a placeholder that will be implemented per platform
    throw new Error('Not implemented');
  }
}
