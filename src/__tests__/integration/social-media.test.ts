import { SocialMediaAccountService } from '../../services/social-media/account.service';
import { prismaMock } from '../setup/setup';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Social Media Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Twitter Integration', () => {
    it('should connect Twitter account', async () => {
      const mockTokens = {
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
        accountId: 'twitter123'
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockTokens });

      prismaMock.socialMediaAccount.create.mockResolvedValue({
        id: '1',
        platform: 'twitter',
        accountId: mockTokens.accountId,
        userId: 'user1',
        accessToken: 'encrypted_token',
        refreshToken: 'encrypted_refresh',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const account = await SocialMediaAccountService.connectAccount(
        'twitter',
        'auth_code',
        'http://localhost:3000/callback',
        'user1'
      );

      expect(account).toBeDefined();
      expect(account.platform).toBe('twitter');
      expect(account.accountId).toBe(mockTokens.accountId);
    });

    it('should handle Twitter API errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        SocialMediaAccountService.connectAccount(
          'twitter',
          'invalid_code',
          'http://localhost:3000/callback',
          'user1'
        )
      ).rejects.toThrow();
    });
  });
});
