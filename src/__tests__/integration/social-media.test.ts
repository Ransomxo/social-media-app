import { SocialMediaAccountService } from '../../services/social-media/account.service';
import { TwitterService } from '../../services/social-media/platforms/twitter';
import { AppError } from '../../utils/errors/AppError';
import { prismaMock } from '../setup/setup';

jest.mock('../../services/social-media/platforms/twitter');
jest.mock('../../utils/encryption', () => ({
  EncryptionService: {
    encrypt: jest.fn().mockImplementation((text) => `encrypted_${text}`)
  }
}));

describe('Social Media Integration', () => {
  describe('Twitter Integration', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should connect Twitter account', async () => {
      const mockTokens = {
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        accountId: 'twitter123'
      };

      const mockAccount = {
        id: '1',
        userId: 'user123',
        platform: 'twitter',
        accountId: 'twitter123',
        accessToken: 'encrypted_test_access_token',
        refreshToken: 'encrypted_test_refresh_token',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (TwitterService.getAccessToken as jest.Mock).mockResolvedValue(mockTokens);
      prismaMock.socialMediaAccount.create.mockResolvedValue(mockAccount);

      const account = await SocialMediaAccountService.connectAccount(
        'twitter',
        'auth_code',
        'http://localhost:3000/callback',
        'user123'
      );

      expect(account).toBeDefined();
      expect(account.platform).toBe('twitter');
      expect(account.accountId).toBe('twitter123');
      expect(TwitterService.getAccessToken).toHaveBeenCalledWith(
        'auth_code',
        'http://localhost:3000/callback'
      );
    });

    it('should handle Twitter API errors', async () => {
      (TwitterService.getAccessToken as jest.Mock).mockRejectedValue(
        new Error('Invalid auth code')
      );

      await expect(
        SocialMediaAccountService.connectAccount(
          'twitter',
          'invalid_code',
          'http://localhost:3000/callback',
          'user123'
        )
      ).rejects.toThrow(AppError);
    });

    it('should handle unsupported platforms', async () => {
      await expect(
        SocialMediaAccountService.connectAccount(
          'unsupported',
          'auth_code',
          'http://localhost:3000/callback',
          'user123'
        )
      ).rejects.toThrow('Unsupported platform: unsupported');
    });
  });
});
