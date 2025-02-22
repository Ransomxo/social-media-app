import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';
import {
  LinkedInAnalyticsResponse,
  LinkedInMetricType,
  LinkedInPostMetricType,
  LinkedInError
} from '../../types/social-media/analytics/linkedin';

const LINKEDIN_API_VERSION = 'v2';
const LINKEDIN_API_URL = `https://api.linkedin.com/${LINKEDIN_API_VERSION}`;

export class LinkedInAnalyticsAPI {
  protected static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.data) {
      const linkedInError = error.response.data as LinkedInError;
      if (linkedInError.message) {
        throw new ValidationError(linkedInError.message);
      }
    }
    if (error instanceof Error) {
      throw new ValidationError(error.message);
    }
    throw new ValidationError('An unknown error occurred while calling the LinkedIn Analytics API');
  }

  protected static async getProfileMetrics(
    userId: string,
    accessToken: string,
    startDate?: string,
    endDate?: string
  ): Promise<LinkedInMetricType> {
    try {
      const response = await axios.get(
        `${LINKEDIN_API_URL}/organizationalEntityShareStatistics`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            q: 'organizationalEntity',
            organizationalEntity: `urn:li:organization:${userId}`,
            timeIntervals: `(timeRange:(start:${startDate},end:${endDate}))`,
            fields: [
              'impressions',
              'uniqueImpressionsCount',
              'clickCount',
              'engagement',
              'shareCount'
            ].join(',')
          }
        }
      );

      // Get follower and connection counts separately
      const profileResponse = await axios.get(
        `${LINKEDIN_API_URL}/organizations/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            fields: 'followersCount,connections,posts'
          }
        }
      );

      return {
        impressions: response.data.elements[0]?.impressions || 0,
        unique_visitors: response.data.elements[0]?.uniqueImpressionsCount || 0,
        clicks: response.data.elements[0]?.clickCount || 0,
        followers: profileResponse.data.followersCount || 0,
        connections: profileResponse.data.connections || 0,
        posts: profileResponse.data.posts || 0
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static async getPostMetrics(
    postId: string,
    accessToken: string
  ): Promise<LinkedInPostMetricType> {
    try {
      const response = await axios.get(
        `${LINKEDIN_API_URL}/socialActions/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            fields: [
              'impressionCount',
              'clickCount',
              'likeCount',
              'commentCount',
              'shareCount'
            ].join(',')
          }
        }
      );

      return {
        impressions: response.data.impressionCount || 0,
        clicks: response.data.clickCount || 0,
        likes: response.data.likeCount || 0,
        comments: response.data.commentCount || 0,
        shares: response.data.shareCount || 0
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getAnalytics(
    userId: string,
    accessToken: string,
    since?: string,
    until?: string
  ): Promise<LinkedInAnalyticsResponse> {
    try {
      const startDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = until || new Date().toISOString();

      // Get profile metrics
      const profileMetrics = await this.getProfileMetrics(userId, accessToken, startDate, endDate);

      // Get recent posts
      const postsResponse = await axios.get(
        `${LINKEDIN_API_URL}/shares`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            q: 'owners',
            owners: `urn:li:organization:${userId}`,
            count: 100,
            start: 0
          }
        }
      );

      // Get metrics for each post
      const postsWithMetrics = await Promise.all(
        postsResponse.data.elements.map(async (post: any) => {
          const metrics = await this.getPostMetrics(post.id, accessToken);
          return {
            id: post.id,
            created_at: post.created.time,
            content: post.text?.text || '',
            media_type: post.content?.contentEntities?.[0]?.type,
            metrics: {
              impressions: metrics.impressions,
              clicks: metrics.clicks,
              likes: metrics.likes,
              comments: metrics.comments,
              shares: metrics.shares,
              engagement_rate: this.calculatePostEngagementRate(metrics)
            }
          };
        })
      );

      return {
        profile: {
          followers: profileMetrics.followers,
          connections: profileMetrics.connections,
          posts: profileMetrics.posts,
          engagement_rate: this.calculateProfileEngagementRate(profileMetrics),
          impressions: profileMetrics.impressions,
          unique_visitors: profileMetrics.unique_visitors
        },
        posts: postsWithMetrics,
        period: {
          start: startDate,
          end: endDate
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static calculatePostEngagementRate(metrics: LinkedInPostMetricType): number {
    const engagements = metrics.likes + metrics.comments + metrics.shares;
    return metrics.impressions > 0 ? (engagements / metrics.impressions) * 100 : 0;
  }

  private static calculateProfileEngagementRate(metrics: LinkedInMetricType): number {
    const engagements = metrics.clicks;
    return metrics.impressions > 0 ? (engagements / metrics.impressions) * 100 : 0;
  }
}
