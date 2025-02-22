import { FacebookExtendedAnalyticsAPI } from './facebook-extended';
import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FacebookExtendedAnalyticsAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExtendedAnalytics', () => {
    const mockPageId = '123456789';
    const mockAccessToken = 'mock_access_token';
    const mockSince = '2025-01-01';
    const mockUntil = '2025-02-01';

    it('should fetch extended analytics data successfully', async () => {
      // Mock base analytics response
      const mockBaseAnalytics = {
        page: {
          followers: 5000,
          engagement_rate: 10,
          reach: 1000,
          impressions: 1000,
          page_views: 2000
        },
        posts: [],
        period: {
          start: mockSince,
          end: mockUntil
        }
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
        .mockResolvedValueOnce({ data: mockDemographics }) // Demographics
        .mockResolvedValueOnce({ data: mockDemographics }) // Location
        .mockResolvedValueOnce({ data: mockDemographics }) // Language
        .mockResolvedValueOnce({ data: mockPosts }) // Posts
        .mockResolvedValueOnce({ data: mockInsights }) // Post insights
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
      mockedAxios.get.mockRejectedValueOnce(mockError);

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
      // Mock minimal successful responses
      mockedAxios.get.mockResolvedValue({ data: { data: [] } });

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
