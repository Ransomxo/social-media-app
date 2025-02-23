import { FacebookAnalyticsService } from './facebook';
import { FacebookAnalyticsResponse } from '../../types/social-media/analytics/facebook';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FacebookAnalyticsService', () => {
  let service: FacebookAnalyticsService;

  beforeEach(() => {
    service = new FacebookAnalyticsService();
    jest.clearAllMocks();
  });

  it('should get analytics data', async () => {
    const mockProfileData = {
      data: {
        followers_count: 1000,
        page_likes: 500,
        engagement: 0.05,
        reach: 2000,
        impressions: 3000
      }
    };

    const mockPostsData = {
      data: {
        data: [{
          id: 'post1',
          message: 'Test post',
          created_time: '2024-01-15T12:00:00Z',
          type: 'status',
          insights: {
            data: [
              { values: [{ value: 100 }] }, // likes
              { values: [{ value: 50 }] },  // comments
              { values: [{ value: 25 }] },  // shares
              { values: [{ value: 1000 }] }, // reach
              { values: [{ value: 1500 }] }  // impressions
            ]
          }
        }]
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockProfileData)
      .mockResolvedValueOnce(mockPostsData);

    const response = await service.getAnalytics('user-id', 'test-token', '2024-01-01', '2024-01-31');
    
    expect(response).toBeDefined();
    expect(response.profile.followers).toBe(1000);
    expect(response.profile.page_likes).toBe(500);
    expect(response.posts).toHaveLength(1);
    expect(response.posts[0].metrics.likes).toBe(100);
  });
});
