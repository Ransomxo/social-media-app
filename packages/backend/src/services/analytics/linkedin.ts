import { LinkedInAnalyticsResponse } from '../../types/social-media/analytics/linkedin';
import axios from 'axios';

export class LinkedInAnalyticsService {
  async getAnalytics(
    userId: string,
    accessToken: string,
    startDate?: string,
    endDate?: string
  ): Promise<LinkedInAnalyticsResponse> {
    if (!accessToken) {
      throw new Error('Invalid token');
    }
    try {
      const [profileData, postsData] = await Promise.all([
        axios.get(`https://api.linkedin.com/v2/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }),
        axios.get(`https://api.linkedin.com/v2/shares`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            q: 'owners',
            owners: `urn:li:person:${userId}`
          }
        })
      ]);

      return {
        profile: {
          followers: profileData.data.numConnections || 0,
          connections: profileData.data.numConnections || 0,
          engagement_rate: profileData.data.engagementRate || 0,
          impressions: profileData.data.impressions || 0,
          unique_visitors: profileData.data.uniqueVisitors || 0
        },
        posts: (postsData.data.elements || []).map((post: any) => ({
          id: post.id,
          content: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '',
          createdAt: post.created?.time || '',
          type: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareMediaCategory?.toLowerCase() || 'text',
          metrics: {
            likes: post.social?.totalSocialActivityCounts?.numLikes || 0,
            comments: post.social?.totalSocialActivityCounts?.numComments || 0,
            shares: post.social?.totalSocialActivityCounts?.numShares || 0,
            impressions: post.totalShareStatistics?.impressionCount || 0,
            engagement: post.totalShareStatistics?.engagement || 0
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
