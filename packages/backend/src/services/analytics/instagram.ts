import { InstagramAnalyticsResponse } from '../../types/social-media/analytics/instagram';
import axios from 'axios';

export class InstagramAnalyticsService {
  async getAnalytics(
    userId: string,
    accessToken: string,
    startDate?: string,
    endDate?: string
  ): Promise<InstagramAnalyticsResponse> {
    if (!accessToken) {
      throw new Error('Invalid token');
    }

    try {
      const [{ data: { data: profileData } }, { data: postsData }] = await Promise.all([
        axios.get(`https://graph.instagram.com/v12.0/${userId}`, {
          params: {
            fields: 'followers_count,media_count,profile_views,engagement_rate',
            access_token: accessToken
          }
        }),
        axios.get(`https://graph.instagram.com/v12.0/${userId}/media`, {
          params: {
            fields: 'id,caption,timestamp,media_type,metrics',
            access_token: accessToken
          }
        })
      ]);

      return {
        profile: {
          followers: profileData.followers_count || 0,
          following: profileData.following_count || 0,
          engagement_rate: profileData.engagement_rate || 0,
          impressions: profileData.impressions || 0,
          reach: profileData.reach || 0,
          profile_views: profileData.profile_views || 0,
          media_count: profileData.media_count || 0,
          page_views: profileData.profile_views || 0
        },
        posts: postsData.data.map((post: any) => ({
          id: post.id,
          caption: post.caption || '',
          created_at: post.timestamp || new Date().toISOString(),
          media_type: post.media_type || 'IMAGE',
          metrics: {
            likes: post.metrics?.likes || 0,
            comments: post.metrics?.comments || 0,
            saves: post.metrics?.saves || 0,
            shares: post.metrics?.shares || 0,
            reach: post.metrics?.reach || 0,
            impressions: post.metrics?.impressions || 0,
            engagement_rate: (post.metrics?.engagement || 0) / (post.metrics?.impressions || 1)
          }
        })),
        period: {
          start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: endDate || new Date().toISOString()
        }
      };
    } catch (error: any) {
      if (error.isAxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  }
}
