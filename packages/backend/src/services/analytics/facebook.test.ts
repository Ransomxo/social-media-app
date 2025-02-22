import { FacebookAnalyticsAPI } from './facebook';
import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FacebookAnalyticsAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    const mockPageId = '123456789';
    const mockAccessToken = 'mock_access_token';
    const mockSince = '2025-01-01';
    const mockUntil = '2025-02-01';

    it('should fetch page and post analytics successfully', async () => {
      // Mock page insights response
      const mockPageInsights = {
        data: [
          {
            name: 'page_impressions',
            period: 'day',
            values: [{ value: 1000, end_time: '2025-02-01' }],
            title: 'Page Impressions',
            description: 'Daily page impressions',
            id: 'page_impressions_id'
          },
          {
            name: 'page_engaged_users',
            period: 'day',
            values: [{ value: 100, end_time: '2025-02-01' }],
            title: 'Engaged Users',
            description: 'Daily engaged users',
            id: 'page_engaged_users_id'
          },
          {
            name: 'page_fans',
            period: 'day',
            values: [{ value: 5000, end_time: '2025-02-01' }],
            title: 'Page Fans',
            description: 'Total page fans',
            id: 'page_fans_id'
          },
          {
            name: 'page_views_total',
            period: 'day',
            values: [{ value: 2000, end_time: '2025-02-01' }],
            title: 'Page Views',
            description: 'Total page views',
            id: 'page_views_id'
          }
        ]
      };

      // Mock posts response
      const mockPosts = {
        data: [
          {
            id: 'post_123',
            created_time: '2025-01-15T12:00:00Z',
            message: 'Test post'
          }
        ]
      };

      // Mock post insights response
      const mockPostInsights = {
        data: [
          {
            name: 'post_impressions',
            period: 'lifetime',
            values: [{ value: 500, end_time: '2025-02-01' }],
            title: 'Post Impressions',
            description: 'Lifetime post impressions',
            id: 'post_impressions_id'
          },
          {
            name: 'post_engaged_users',
            period: 'lifetime',
            values: [{ value: 50, end_time: '2025-02-01' }],
            title: 'Post Engaged Users',
            description: 'Lifetime post engaged users',
            id: 'post_engaged_users_id'
          },
          {
            name: 'post_reactions_by_type_total',
            period: 'lifetime',
            values: [{ value: 30, end_time: '2025-02-01' }],
            title: 'Post Reactions',
            description: 'Lifetime post reactions',
            id: 'post_reactions_id'
          }
        ]
      };

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockPageInsights }) // Page insights
        .mockResolvedValueOnce({ data: mockPosts }) // Posts list
        .mockResolvedValueOnce({ data: mockPostInsights }); // Post insights

      const result = await FacebookAnalyticsAPI.getAnalytics(
        mockPageId,
        mockAccessToken,
        mockSince,
        mockUntil
      );

      expect(result).toEqual({
        page: {
          followers: 5000,
          engagement_rate: 10, // (100 / 1000) * 100
          reach: 1000,
          impressions: 1000,
          page_views: 2000
        },
        posts: [
          {
            id: 'post_123',
            created_time: '2025-01-15T12:00:00Z',
            message: 'Test post',
            insights: {
              reactions: 30,
              comments: 50,
              shares: 0,
              reach: 500,
              impressions: 500,
              engagement_rate: 10 // (50 / 500) * 100
            }
          }
        ],
        period: {
          start: mockSince,
          end: mockUntil
        }
      });

      // Verify API calls
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/${mockPageId}/insights`),
        expect.any(Object)
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/${mockPageId}/posts`),
        expect.any(Object)
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/post_123/insights'),
        expect.any(Object)
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Invalid access token') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          error: {
            message: 'Invalid access token'
          }
        }
      };
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(
        FacebookAnalyticsAPI.getAnalytics(mockPageId, 'invalid_token', mockSince, mockUntil)
      ).rejects.toThrow('Invalid access token');
    });

    it('should use default date range when not provided', async () => {
      // Mock minimal successful responses
      mockedAxios.get
        .mockResolvedValueOnce({ data: { data: [] } }) // Page insights
        .mockResolvedValueOnce({ data: { data: [] } }) // Posts list
        .mockResolvedValueOnce({ data: { data: [] } }); // Post insights

      const result = await FacebookAnalyticsAPI.getAnalytics(mockPageId, mockAccessToken);

      expect(result.period.start).toBeDefined();
      expect(result.period.end).toBeDefined();
      expect(new Date(result.period.start)).toBeInstanceOf(Date);
      expect(new Date(result.period.end)).toBeInstanceOf(Date);
    });
  });
});
