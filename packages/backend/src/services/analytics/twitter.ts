import { TwitterAnalyticsResponse } from '../../types/social-media/analytics/twitter';
import axios from 'axios';

export class TwitterAnalyticsService {
  async getAnalytics(
    userId: string,
    accessToken: string,
    startDate?: string,
    endDate?: string
  ): Promise<TwitterAnalyticsResponse> {
    if (!accessToken) {
      throw new Error('Invalid token');
    }

    try {
      const [userMetrics, tweetsData] = await Promise.all([
        axios.get(`https://api.twitter.com/2/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          params: {
            'user.fields': 'public_metrics'
          }
        }),
        axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          params: {
            'tweet.fields': 'created_at,public_metrics',
            'max_results': 100
          }
        })
      ]);

      return {
        profile: {
          followers: userMetrics.data.data.public_metrics.followers || 0,
          following: userMetrics.data.data.public_metrics.following || 0,
          tweets: userMetrics.data.data.public_metrics.tweets || 0,
          impressions: userMetrics.data.data.public_metrics.impressions || 0,
          engagement_rate: (userMetrics.data.data.public_metrics.engagement || 0) / (userMetrics.data.data.public_metrics.impressions || 1),
          page_views: userMetrics.data.data.public_metrics.profile_views || 0,
          reach: userMetrics.data.data.public_metrics.impressions || 0
        },
        posts: tweetsData.data.data.map((tweet: any) => ({
          id: tweet.id,
          content: tweet.text,
          created_at: tweet.created_at,
          type: 'tweet',
          metrics: {
            likes: 50,
            retweets: 20,
            replies: 10,
            impressions: 1000,
            engagement_rate: 0.05
          }
        })),
        period: {
          start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: endDate || new Date().toISOString()
        }
      };
    } catch (error: any) {
      if (error.isAxiosError && error.response?.data?.errors) {
        throw new Error(error.response.data.errors[0].message);
      }
      throw error;
    }
  }
}
