import { LinkedInAnalyticsAPI } from './linkedin';
import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LinkedInAnalyticsAPI', () => {
  const mockUserId = '123456789';
  const mockAccessToken = 'mock_access_token';
  const mockSince = '2025-01-01';
  const mockUntil = '2025-02-01';

  // Mock profile metrics response
  const mockProfileMetrics = {
    elements: [
      {
        impressions: 10000,
        uniqueImpressionsCount: 5000,
        clickCount: 1000,
        engagement: 500,
        shareCount: 100
      }
    ]
  };

  // Mock profile info response
  const mockProfileInfo = {
    followersCount: 5000,
    connections: 1000,
    posts: 100
  };

  // Mock posts list response
  const mockPostsList = {
    elements: [
      {
        id: 'post_123',
        created: {
          time: '2025-01-15T12:00:00Z'
        },
        text: {
          text: 'Test post'
        },
        content: {
          contentEntities: [
            {
              type: 'IMAGE'
            }
          ]
        }
      }
    ]
  };

  // Mock post metrics response
  const mockPostMetrics = {
    impressionCount: 1000,
    clickCount: 200,
    likeCount: 50,
    commentCount: 10,
    shareCount: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should fetch analytics data successfully', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProfileMetrics }) // Profile metrics
        .mockResolvedValueOnce({ data: mockProfileInfo }) // Profile info
        .mockResolvedValueOnce({ data: mockPostsList }) // Posts list
        .mockResolvedValueOnce({ data: mockPostMetrics }); // Post metrics

      const result = await LinkedInAnalyticsAPI.getAnalytics(
        mockUserId,
        mockAccessToken,
        mockSince,
        mockUntil
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
          status: 401,
          message: 'Invalid token',
          serviceErrorCode: 65600,
          code: 'INVALID_TOKEN'
        }
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        LinkedInAnalyticsAPI.getAnalytics(
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
        .mockResolvedValueOnce({ data: mockPostsList }) // Posts list
        .mockResolvedValueOnce({ data: mockPostMetrics }); // Post metrics

      const result = await LinkedInAnalyticsAPI.getAnalytics(
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
