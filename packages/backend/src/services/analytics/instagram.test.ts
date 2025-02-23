import { InstagramAnalyticsService } from './instagram';
import { InstagramAnalyticsResponse } from '../../types/social-media/analytics/instagram';
import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InstagramAnalyticsAPI', () => {
  const mockUserId = '123456789';
  const mockAccessToken = 'mock_access_token';
  const mockSince = '2025-01-01';
  const mockUntil = '2025-02-01';

  const mockProfileMetrics = {
    data: {
      followers_count: 5000,
      engagement_rate: 3.5,
      media_count: 100,
      reach: 10000,
      profile_views: 500
    }
  };

  const mockPostsData = {
    data: [
      {
        id: 'media_123',
        timestamp: '2025-01-15T12:00:00Z',
        caption: 'Test post',
        media_type: 'IMAGE',
        metrics: {
          likes: 50,
          comments: 20,
          saves: 10,
          shares: 5,
          reach: 1000,
          impressions: 1500,
          engagement: 75
        }
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should fetch analytics data successfully', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProfileMetrics })
        .mockResolvedValueOnce({ data: mockPostsData });

      const service = new InstagramAnalyticsService();
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
          error: {
            message: 'Invalid token',
            type: 'OAuthException'
          }
        }
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        new InstagramAnalyticsService().getAnalytics(
          mockUserId,
          'invalid_token',
          mockSince,
          mockUntil
        )
      ).rejects.toThrow('Invalid token');
    });

    it('should use default date range when not provided', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProfileMetrics })
        .mockResolvedValueOnce({ data: mockPostsData });

      const service = new InstagramAnalyticsService();
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
