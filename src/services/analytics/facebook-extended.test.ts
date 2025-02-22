import { FacebookExtendedAnalyticsAPI } from './facebook-extended';
import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FacebookExtendedAnalyticsAPI', () => {
  const mockPageId = '123456789';
  const mockAccessToken = 'mock_access_token';
  const mockSince = '2025-01-01';
  const mockUntil = '2025-02-01';

  // Mock page insights response
  const mockPageInsights = {
    data: [
      {
        name: 'page_impressions',
        period: 'day',
        values: [{ value: 1000, end_time: '2025-02-01' }]
      },
      {
        name: 'page_engaged_users',
        period: 'day',
        values: [{ value: 100, end_time: '2025-02-01' }]
      },
      {
        name: 'page_fans',
        period: 'day',
        values: [{ value: 5000, end_time: '2025-02-01' }]
      },
      {
        name: 'page_views_total',
        period: 'day',
        values: [{ value: 2000, end_time: '2025-02-01' }]
      }
    ]
  };

  // Mock posts response
  const mockPostsData = {
    data: [
      {
        id: 'post_123',
        created_time: '2025-01-15T12:00:00Z',
        message: 'Test post'
      }
    ]
  };

  // Mock post insights response
  const mockPostInsightsData = {
    data: [
      {
        name: 'post_impressions',
        period: 'lifetime',
        values: [{ value: 500, end_time: '2025-02-01' }]
      },
      {
        name: 'post_engaged_users',
        period: 'lifetime',
        values: [{ value: 50, end_time: '2025-02-01' }]
      },
      {
        name: 'post_reactions_by_type_total',
        period: 'lifetime',
        values: [{ value: 30, end_time: '2025-02-01' }]
      }
    ]
  };

  // Mock demographics response
  const mockDemographics = {
    data: [
      {
        name: 'page_fans_gender_age',
        values: [{ value: { 'M.18-24': 500, 'F.18-24': 600 } }]
      }
    ]
  };

  // Mock insights response
  const mockInsights = {
    data: [
      {
        name: 'page_fans',
        values: [{ value: 5000, end_time: '2025-02-01' }]
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExtendedAnalytics', () => {

    it('should fetch extended analytics data successfully', async () => {
      // Mock base analytics response
      const mockPageInsights = {
        data: [
          {
            name: 'page_impressions',
            period: 'day',
            values: [{ value: 1000, end_time: '2025-02-01' }]
          },
          {
            name: 'page_engaged_users',
            period: 'day',
            values: [{ value: 100, end_time: '2025-02-01' }]
          },
          {
            name: 'page_fans',
            period: 'day',
            values: [{ value: 5000, end_time: '2025-02-01' }]
          },
          {
            name: 'page_views_total',
            period: 'day',
            values: [{ value: 2000, end_time: '2025-02-01' }]
          }
        ]
      };

  // Mock posts response
  const mockPostsData = {
        data: [
          {
            id: 'post_123',
            created_time: '2025-01-15T12:00:00Z',
            message: 'Test post'
          }
        ]
      };

  // Mock post insights response
  const mockPostInsightsData = {
        data: [
          {
            name: 'post_impressions',
            period: 'lifetime',
            values: [{ value: 500, end_time: '2025-02-01' }]
          },
          {
            name: 'post_engaged_users',
            period: 'lifetime',
            values: [{ value: 50, end_time: '2025-02-01' }]
          },
          {
            name: 'post_reactions_by_type_total',
            period: 'lifetime',
            values: [{ value: 30, end_time: '2025-02-01' }]
          }
        ]
      };

  // Mock demographics response
  const mockDemographics = {
        data: [
          {
            name: 'page_fans_gender_age',
            values: [{ value: { 'M.18-24': 500, 'F.18-24': 600 } }]
          }
        ]
      };

      // Mock content performance response
      const mockPosts = {
        data: [
          {
            id: 'post_123',
            message: 'Test post',
            type: 'photo',
            created_time: '2025-01-15T12:00:00Z',
            insights: {
              data: [
                {
                  name: 'post_impressions',
                  values: [{ value: 1000 }]
                }
              ]
            }
          }
        ]
      };

      // Mock audience insights response
      const mockInsights = {
        data: [
          {
            name: 'page_fans',
            values: [{ value: 5000, end_time: '2025-02-01' }]
          }
        ]
      };

      mockedAxios.get
        // Base analytics mocks
        .mockResolvedValueOnce({ data: mockPageInsights }) // Page insights
        .mockResolvedValueOnce({ data: mockPostsData }) // Posts list
        .mockResolvedValueOnce({ data: mockPostInsightsData }) // Post insights
        // Extended analytics mocks
        .mockResolvedValueOnce({ data: mockDemographics }) // Demographics
        .mockResolvedValueOnce({ data: mockDemographics }) // Location
        .mockResolvedValueOnce({ data: mockDemographics }) // Language
        .mockResolvedValueOnce({ data: mockPostsData }) // Posts for content performance
        .mockResolvedValueOnce({ data: mockPostInsightsData }) // Post insights for content performance
        .mockResolvedValueOnce({ data: mockInsights }) // Fan growth
        .mockResolvedValueOnce({ data: mockInsights }) // Engagement
        .mockResolvedValueOnce({ data: mockInsights }); // Reach

      const result = await FacebookExtendedAnalyticsAPI.getExtendedAnalytics(
        mockPageId,
        mockAccessToken,
        mockSince,
        mockUntil
      );

      expect(result).toHaveProperty('demographics');
      expect(result).toHaveProperty('content_performance');
      expect(result).toHaveProperty('audience_insights');
      expect(result).toHaveProperty('date_range');

      // Verify API calls
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/${mockPageId}/insights`),
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
      mockedAxios.get
        .mockRejectedValueOnce(mockError) // Page insights
        .mockRejectedValueOnce(mockError) // Posts list
        .mockRejectedValueOnce(mockError) // Post insights
        .mockRejectedValueOnce(mockError) // Demographics
        .mockRejectedValueOnce(mockError) // Location
        .mockRejectedValueOnce(mockError) // Language
        .mockRejectedValueOnce(mockError) // Posts for content performance
        .mockRejectedValueOnce(mockError) // Post insights for content performance
        .mockRejectedValueOnce(mockError) // Fan growth
        .mockRejectedValueOnce(mockError) // Engagement
        .mockRejectedValueOnce(mockError); // Reach

      await expect(
        FacebookExtendedAnalyticsAPI.getExtendedAnalytics(
          mockPageId,
          'invalid_token',
          mockSince,
          mockUntil
        )
      ).rejects.toThrow('Invalid access token');
    });

    it('should use default date range when not provided', async () => {
      // Mock successful responses for default date range test
      mockedAxios.get
        // Base analytics mocks
        .mockResolvedValueOnce({ data: mockPageInsights }) // Page insights
        .mockResolvedValueOnce({ data: mockPostsData }) // Posts list
        .mockResolvedValueOnce({ data: mockPostInsightsData }) // Post insights
        // Extended analytics mocks
        .mockResolvedValueOnce({ data: mockDemographics }) // Demographics
        .mockResolvedValueOnce({ data: mockDemographics }) // Location
        .mockResolvedValueOnce({ data: mockDemographics }) // Language
        .mockResolvedValueOnce({ data: mockPostsData }) // Posts for content performance
        .mockResolvedValueOnce({ data: mockPostInsightsData }) // Post insights for content performance
        .mockResolvedValueOnce({ data: mockInsights }) // Fan growth
        .mockResolvedValueOnce({ data: mockInsights }) // Engagement
        .mockResolvedValueOnce({ data: mockInsights }); // Reach

      const result = await FacebookExtendedAnalyticsAPI.getExtendedAnalytics(
        mockPageId,
        mockAccessToken
      );

      expect(result.date_range.start).toBeDefined();
      expect(result.date_range.end).toBeDefined();
      expect(new Date(result.date_range.start)).toBeInstanceOf(Date);
      expect(new Date(result.date_range.end)).toBeInstanceOf(Date);
    });
  });
});
