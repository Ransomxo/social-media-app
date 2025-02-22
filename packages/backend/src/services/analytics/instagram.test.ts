import { InstagramAnalyticsAPI } from './instagram';
import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InstagramAnalyticsAPI', () => {
  const mockUserId = '123456789';
  const mockAccessToken = 'mock_access_token';
  const mockSince = '2025-01-01';
  const mockUntil = '2025-02-01';

  // Mock profile metrics response
  const mockProfileMetrics = {
    data: [
      {
        name: 'impressions',
        values: [{ value: 10000 }]
      },
      {
        name: 'reach',
        values: [{ value: 5000 }]
      },
      {
        name: 'profile_views',
        values: [{ value: 1000 }]
      },
      {
        name: 'website_clicks',
        values: [{ value: 200 }]
      }
    ]
  };

  // Mock profile info response
  const mockProfileInfo = {
    followers_count: 5000,
    media_count: 100
  };

  // Mock media list response
  const mockMediaList = {
    data: [
      {
        id: 'media_123',
        timestamp: '2025-01-15T12:00:00Z',
        media_type: 'IMAGE',
        media_url: 'https://example.com/image.jpg',
        permalink: 'https://instagram.com/p/123',
        caption: 'Test post'
      }
    ]
  };

  // Mock media metrics response
  const mockMediaMetrics = {
    data: [
      {
        name: 'impressions',
        values: [{ value: 1000 }]
      },
      {
        name: 'reach',
        values: [{ value: 500 }]
      },
      {
        name: 'engagement',
        values: [{ value: 100 }]
      },
      {
        name: 'saved',
        values: [{ value: 50 }]
      }
    ]
  };

  // Mock media info response
  const mockMediaInfo = {
    like_count: 50,
    comments_count: 10,
    shares_count: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should fetch analytics data successfully', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProfileMetrics }) // Profile metrics
        .mockResolvedValueOnce({ data: mockProfileInfo }) // Profile info
        .mockResolvedValueOnce({ data: mockMediaList }) // Media list
        .mockResolvedValueOnce({ data: mockMediaMetrics }) // Media metrics
        .mockResolvedValueOnce({ data: mockMediaInfo }); // Media info

      const result = await InstagramAnalyticsAPI.getAnalytics(
        mockUserId,
        mockAccessToken,
        mockSince,
        mockUntil
      );

      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('media');
      expect(result).toHaveProperty('period');

      expect(result.profile.followers).toBe(5000);
      expect(result.media).toHaveLength(1);
      expect(result.media[0].metrics.likes).toBe(50);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Invalid token');
      (mockError as any).isAxiosError = true;
      (mockError as any).response = {
        data: {
          error: {
            message: 'Invalid token',
            type: 'OAuthException',
            code: 190,
            fbtrace_id: 'mock_trace_id'
          }
        }
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        InstagramAnalyticsAPI.getAnalytics(
          mockUserId,
          'invalid_token',
          mockSince,
          mockUntil
        )
      ).rejects.toThrow('Invalid token');
    });

    it('should use default date range when not provided', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProfileMetrics }) // Profile metrics
        .mockResolvedValueOnce({ data: mockProfileInfo }) // Profile info
        .mockResolvedValueOnce({ data: mockMediaList }) // Media list
        .mockResolvedValueOnce({ data: mockMediaMetrics }) // Media metrics
        .mockResolvedValueOnce({ data: mockMediaInfo }); // Media info

      const result = await InstagramAnalyticsAPI.getAnalytics(
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
