import prisma from '../../lib/prisma';
import { EncryptionService } from '../../utils/encryption';
import { SocialMediaAccount } from '@prisma/client';

export class SocialMediaAccountService {
  static async createAccount(
    userId: string,
    platform: string,
    accountId: string,
    accessToken: string,
    refreshToken?: string
  ): Promise<SocialMediaAccount> {
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
