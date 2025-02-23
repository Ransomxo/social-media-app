import { FacebookExtendedAnalyticsResponse } from '../../types/social-media/analytics';

describe('Facebook Extended Analytics', () => {
  it('should process extended analytics data correctly', () => {
    const result: FacebookExtendedAnalyticsResponse = {
      engagement_metrics: {
        reactions: 1000,
        comments: 500,
        shares: 250,
        clicks: 750,
        engagement_rate: 3.5
      },
      audience_growth: {
        new_followers: 200,
        unfollows: 50,
        net_growth: 150,
        total_followers: 5000
      },
      period: {
        start: '2025-02-01T00:00:00Z',
        end: '2025-02-22T00:00:00Z'
      }
    };

    expect(result.engagement_metrics.reactions).toBe(1000);
    expect(result.engagement_metrics.engagement_rate).toBe(3.5);
    expect(result.audience_growth.total_followers).toBe(5000);
    expect(result.audience_growth.net_growth).toBe(150);
  });
});
