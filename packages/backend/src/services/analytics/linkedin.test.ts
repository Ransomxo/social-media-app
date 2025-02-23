import { LinkedInAnalyticsService } from './linkedin';
import { LinkedInAnalyticsResponse } from '../../types/social-media/analytics/linkedin';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LinkedInAnalyticsService', () => {
  let service: LinkedInAnalyticsService;

  beforeEach(() => {
    service = new LinkedInAnalyticsService();
    jest.clearAllMocks();
  });

  it('should get analytics data', async () => {
    const mockProfileData = {
      data: {
        numConnections: 1000,
        engagementRate: 0.05,
        uniqueVisitors: 500
      }
    };

    const mockPostsData = {
      data: {
        elements: [{
          id: 'post1',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: 'Test post'
              },
              shareMediaCategory: 'IMAGE'
            }
          },
          created: {
            time: '2024-01-15T12:00:00Z'
          },
          social: {
            totalSocialActivityCounts: {
              numLikes: 100,
              numComments: 50,
              numShares: 25
            }
          },
          totalShareStatistics: {
            impressionCount: 1000,
            engagement: 0.05
          }
        }]
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockProfileData)
      .mockResolvedValueOnce(mockPostsData);

    const response = await service.getAnalytics('user-id', 'test-token', '2024-01-01', '2024-01-31');
    
    expect(response).toBeDefined();
    expect(response.profile.connections).toBe(1000);
    expect(response.profile.unique_visitors).toBe(500);
    expect(response.posts).toHaveLength(1);
    expect(response.posts[0].metrics.likes).toBe(100);
  });
});
