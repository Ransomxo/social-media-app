import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../../utils/encryption';
import { ConnectAccountRequest, TokenResponse, SocialMediaPlatform } from '../../types/social-media';
import { AppError } from '../../utils/errors/AppError';
import { exchangeTwitterCode, getTwitterAccountId } from './platforms/twitter';
import { exchangeInstagramCode, getInstagramAccountId } from './platforms/instagram';

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
    switch (platform.name) {
      case 'twitter':
        return exchangeTwitterCode(code, redirectUri);
      case 'instagram':
        return exchangeInstagramCode(code, redirectUri);
      default:
        throw new AppError(`OAuth flow not implemented for ${platform.name}`, 501);
    }
  }

  private static async getAccountId(
    platform: SocialMediaPlatform,
    accessToken: string
  ): Promise<string> {
    switch (platform.name) {
      case 'twitter':
        return getTwitterAccountId(accessToken);
      case 'instagram':
        return getInstagramAccountId(accessToken);
      default:
        throw new AppError(`Account ID fetch not implemented for ${platform.name}`, 501);
    }
  }
}
