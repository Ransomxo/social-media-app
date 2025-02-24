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
      if (!platform || !authCode || !redirectUri || !userId) {
        throw new AppError('Missing required parameters', 400);
      }

      let accessToken: string;
      let accountId: string;
      let refreshToken: string | undefined;

      switch (platform) {
        case 'twitter': {
          const { accessToken: twitterAccessToken, refreshToken: twitterRefreshToken, accountId: twitterAccountId } = await TwitterService.getAccessToken(authCode, redirectUri);
          accessToken = twitterAccessToken;
          refreshToken = twitterRefreshToken;
          accountId = twitterAccountId;
          break;
        }
        default:
          throw new AppError(`Unsupported platform: ${platform}`, 400);
      }

      const encryptedAccessToken = EncryptionService.encrypt(accessToken);
      const encryptedRefreshToken = refreshToken 
        ? EncryptionService.encrypt(refreshToken)
        : null;

      try {
        return await prisma.socialMediaAccount.create({
          data: {
            userId,
            platform,
            accountId,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken
          }
        });
      } catch (dbError) {
        throw new AppError(`Failed to create social media account: ${(dbError as Error).message}`, 500);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Failed to connect ${platform} account: ${(error as Error).message}`,
        (error as { statusCode?: number }).statusCode || 500
      );
    }
  }

  static async getAccount(
    userId: string,
    platform: string
  ): Promise<SocialMediaAccount | null> {
    if (!userId || !platform) {
      throw new AppError('Missing required parameters', 400);
    }
    return prisma.socialMediaAccount.findFirst({
      where: {
        userId,
        platform
      }
    });
  }

  static async getAccounts(userId: string): Promise<SocialMediaAccount[]> {
    try {
      return await prisma.socialMediaAccount.findMany({
        where: { userId }
      });
    } catch (error) {
      throw new AppError('Failed to fetch social media accounts', 500);
    }
  }
}
