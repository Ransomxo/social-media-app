import prisma from '../../lib/prisma';
import { EncryptionService } from '../../utils/encryption';
import { SocialMediaAccount } from '@prisma/client';
import { TwitterService } from './platforms/twitter';
import { AppError } from '../../utils/errors/AppError';

export class SocialMediaAccountService {
  static async connectAccount(
    platform: string,
    authCode: string,
    redirectUri: string,
    userId: string
  ): Promise<SocialMediaAccount> {
    try {
      let accessToken: string;
      let accountId: string;
      let refreshToken: string | undefined;

      switch (platform) {
        case 'twitter':
          const tokens = await TwitterService.getAccessToken(authCode, redirectUri);
          accessToken = tokens.accessToken;
          refreshToken = tokens.refreshToken;
          accountId = tokens.accountId;
          break;
        default:
          throw new AppError(`Unsupported platform: ${platform}`, 400);
      }

      const encryptedAccessToken = EncryptionService.encrypt(accessToken);
      const encryptedRefreshToken = refreshToken 
        ? EncryptionService.encrypt(refreshToken)
        : null;

      return prisma.socialMediaAccount.create({
        data: {
          userId,
          platform,
          accountId,
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken
        }
      });
    } catch (error) {
      throw new AppError(
        `Failed to connect ${platform} account: ${error.message}`,
        error.statusCode || 500
      );
    }
  }

  static async getAccount(
    userId: string,
    platform: string
  ): Promise<SocialMediaAccount | null> {
    return prisma.socialMediaAccount.findFirst({
      where: {
        userId,
        platform
      }
    });
  }
}
