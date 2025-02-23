import { TwitterAnalyticsService } from './twitter';
import { TwitterAnalyticsResponse } from '../../types/social-media/analytics/twitter';
import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TwitterAnalyticsAPI', () => {
  const mockUserId = '123456789';
  const mockAccessToken = 'mock_access_token';
  const mockSince = '2025-01-01';
  const mockUntil = '2025-02-01';

  const mockUserMetrics = {
    data: {
      public_metrics: {
        followers: 5000,
        engagement: 100,
        tweets: 1000,
        impressions: 10000,
        profile_visits: 500,
        mentions: 50
      }
    }
  };

  const mockTweetsData = {
    data: [
      {
        id: 'tweet_123',
        created_at: '2025-01-15T12:00:00Z',
        text: 'Test tweet'
      }
    ]
  };

  const mockTweetMetrics = {
    data: {
      public_metrics: {
        likes: 50,
        retweets: 20,
        replies: 10,
        impressions: 1000
      },
      non_public_metrics: {
        url_clicks: 30,
        profile_clicks: 15,
        hashtag_clicks: 5
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should fetch analytics data successfully', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockUserMetrics })
        .mockResolvedValueOnce({ data: mockTweetsData })
        .mockResolvedValueOnce({ data: mockTweetMetrics });

      const service = new TwitterAnalyticsService();
      const result = await service.getAnalytics(
        mockUserId,
        mockAccessToken
      );

      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('period');

      expect(result.profile.followers).toBe(5000);
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].metrics.likes).toBe(50);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Invalid token');
      (mockError as any).isAxiosError = true;
      (mockError as any).response = {
        data: {
          errors: [
            {
              message: 'Invalid token',
              code: 'invalid_token'
            }
          ]
        }
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        new TwitterAnalyticsService().getAnalytics(
          mockUserId,
          'invalid_token',
          mockSince,
          mockUntil
        )
      ).rejects.toThrow('Invalid token');
    });

    it('should use default date range when not provided', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockUserMetrics })
        .mockResolvedValueOnce({ data: mockTweetsData })
        .mockResolvedValueOnce({ data: mockTweetMetrics });

      const service = new TwitterAnalyticsService();
      const result = await service.getAnalytics(
        mockUserId,
        mockAccessToken
      );

      expect(result.period.start).toBeDefined();
      expect(result.period.end).toBeDefined();
      expect(new Date(result.period.start)).toBeInstanceOf(Date);
      expect(new Date(result.period.end)).toBeInstanceOf(Date);
    });
  });
});
