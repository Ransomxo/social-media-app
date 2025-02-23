import { FacebookAnalyticsResponse } from '../../types/social-media/analytics/facebook';
import axios from 'axios';

export class FacebookAnalyticsService {
  async getAnalytics(
    userId: string,
    accessToken: string,
    startDate?: string,
    endDate?: string
  ): Promise<FacebookAnalyticsResponse> {
    if (!accessToken) {
      throw new Error('Invalid token');
    }

    try {
      const [profileData, postsData] = await Promise.all([
        axios.get(`https://graph.facebook.com/v12.0/${userId}`, {
          params: {
            fields: 'followers_count,engagement,posts',
            access_token: accessToken
          }
        }),
        axios.get(`https://graph.facebook.com/v12.0/${userId}/posts`, {
          params: {
            fields: 'id,message,created_time,type,insights',
            access_token: accessToken
          }
        })
      ]);

      return {
        profile: {
          followers: profileData.data.followers_count,
          page_likes: profileData.data.page_likes,
          engagement_rate: profileData.data.engagement,
          reach: profileData.data.reach,
          impressions: profileData.data.impressions
        },
        posts: postsData.data.data.map((post: any) => ({
          id: post.id,
          content: post.message || '',
          createdAt: post.created_time || new Date().toISOString(),
          type: (post.type || 'status').toLowerCase(),
          metrics: {
            likes: post.insights?.data?.[0]?.values?.[0]?.value || 0,
            comments: post.insights?.data?.[1]?.values?.[0]?.value || 0,
            shares: post.insights?.data?.[2]?.values?.[0]?.value || 0,
            reach: post.insights?.data?.[3]?.values?.[0]?.value || 0,
            impressions: post.insights?.data?.[4]?.values?.[0]?.value || 0
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
