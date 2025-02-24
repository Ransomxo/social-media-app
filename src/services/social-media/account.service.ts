import { PlatformService } from './platforms/twitter';
import { EncryptionService } from '../../utils/encryption';
import prisma from '../../lib/prisma';

export class SocialMediaAccountService {
  static async connectAccount(
    platform: string,
    code: string,
    redirectUri: string,
    userId: string
  ) {
    const platformService = new PlatformService();
    const tokens = await platformService.getAccessToken(code, redirectUri);

    const encryptedAccessToken = EncryptionService.encrypt(tokens.accessToken);
    const encryptedRefreshToken = tokens.refreshToken 
      ? EncryptionService.encrypt(tokens.refreshToken)
      : null;

    return prisma.socialMediaAccount.create({
      data: {
        platform,
        accountId: tokens.accountId,
        userId,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken
      }
    });
  }
}
