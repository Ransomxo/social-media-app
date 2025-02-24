import { TwitterService } from '../../../../services/social-media/platforms/twitter';
import axios from 'axios';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TwitterService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TWITTER_CLIENT_ID = 'test_client_id';
    process.env.TWITTER_CLIENT_SECRET = 'test_client_secret';
  });

  describe('getAccessToken', () => {
    it('should get access token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
          user_id: 'test_user_id'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await TwitterService.getAccessToken(
        'test_code',
        'http://localhost:3000/callback'
      );

      expect(result).toEqual({
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        accountId: 'test_user_id'
      });
    });

    it('should handle missing credentials', async () => {
      delete process.env.TWITTER_CLIENT_ID;
      
      await expect(
        TwitterService.getAccessToken('test_code', 'http://localhost:3000/callback')
      ).rejects.toThrow('Twitter credentials not configured');
    });

    it('should handle invalid response', async () => {
      const mockResponse = {
        data: {}
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await expect(
        TwitterService.getAccessToken('test_code', 'http://localhost:3000/callback')
      ).rejects.toThrow('Invalid response from Twitter');
    });

    it('should handle API errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        TwitterService.getAccessToken('test_code', 'http://localhost:3000/callback')
      ).rejects.toThrow('Failed to get Twitter access token');
    });
  });

  describe('schedulePost', () => {
    it('should schedule post successfully', async () => {
      const scheduledTime = new Date();
      mockedAxios.post.mockResolvedValueOnce({ data: { id: 'test_post_id' } });

      await expect(
        TwitterService.schedulePost('Test content', scheduledTime, 'test_token')
      ).resolves.not.toThrow();
    });

    it('should validate required parameters', async () => {
      await expect(
        TwitterService.schedulePost('', new Date(), 'test_token')
      ).rejects.toThrow('Missing required parameters');
    });

    it('should handle API errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        TwitterService.schedulePost('Test content', new Date(), 'test_token')
      ).rejects.toThrow('Failed to schedule Twitter post');
    });
  });

  describe('getPostAnalytics', () => {
    it('should get analytics successfully', async () => {
      const mockResponse = {
        data: {
          like_count: 10,
          retweet_count: 5,
          reply_count: 3,
          impression_count: 100
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await TwitterService.getPostAnalytics('test_post_id', 'test_token');

      expect(result).toEqual({
        likes: 10,
        shares: 5,
        comments: 3,
        reach: 100
      });
    });

    it('should validate required parameters', async () => {
      await expect(
        TwitterService.getPostAnalytics('', 'test_token')
      ).rejects.toThrow('Missing required parameters');
    });

    it('should handle invalid response', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: null });

      await expect(
        TwitterService.getPostAnalytics('test_post_id', 'test_token')
      ).rejects.toThrow('Invalid response from Twitter');
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        TwitterService.getPostAnalytics('test_post_id', 'test_token')
      ).rejects.toThrow('Failed to get Twitter analytics');
    });
  });
});
