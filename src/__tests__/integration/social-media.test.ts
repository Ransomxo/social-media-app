import { SocialMediaAccountService } from '../../services/social-media/account.service';
import { TwitterService } from '../../services/social-media/platforms/twitter';
import { AppError } from '../../utils/errors/AppError';

jest.mock('../../services/social-media/platforms/twitter');

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

      (TwitterService.getAccessToken as jest.Mock).mockResolvedValue(mockTokens);

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
  });
});
