import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';
import {
  FacebookAnalyticsResponse,
  FacebookInsightsMetric,
  FacebookMetricType,
  FacebookPageInsights,
  FacebookPostInsights,
  FacebookPostMetricType
} from '../../types/social-media/analytics/facebook';

const FACEBOOK_API_VERSION = 'v18.0';
const FACEBOOK_API_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

export class FacebookAnalyticsAPI {
  protected static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new ValidationError(error.response.data.error.message);
    }
    if (error instanceof Error) {
      throw new ValidationError(error.message);
    }
    if (typeof error === 'string') {
      throw new ValidationError(error);
    }
    throw new ValidationError('An unknown error occurred while calling the Facebook Analytics API');
  }

  protected static async getPageInsights(
    pageId: string,
    accessToken: string,
    metrics: FacebookMetricType[],
    period: 'day' | 'week' | 'month' = 'day',
    since?: string,
    until?: string
  ): Promise<FacebookPageInsights> {
    try {
      const params = new URLSearchParams({
        access_token: accessToken,
        metric: metrics.join(','),
        period
      });

      if (since) params.append('since', since);
      if (until) params.append('until', until);

      const response = await axios.get<FacebookPageInsights>(
        `${FACEBOOK_API_URL}/${pageId}/insights`,
        { params }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static async getPostInsights(
    postId: string,
    accessToken: string,
    metrics: FacebookPostMetricType[]
  ): Promise<FacebookPostInsights> {
    try {
      const response = await axios.get<FacebookPostInsights>(
        `${FACEBOOK_API_URL}/${postId}/insights`,
        {
          params: {
            access_token: accessToken,
            metric: metrics.join(',')
          }
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getAnalytics(
    pageId: string,
    accessToken: string,
    since?: string,
    until?: string
  ): Promise<FacebookAnalyticsResponse> {
    try {
      // Get page-level insights
      const pageInsights = await this.getPageInsights(
        pageId,
        accessToken,
        ['page_impressions', 'page_engaged_users', 'page_fans', 'page_views_total'],
        'day',
        since,
        until
      );

      // Get recent posts
      const postsResponse = await axios.get(
        `${FACEBOOK_API_URL}/${pageId}/posts`,
        {
          params: {
            access_token: accessToken,
            fields: 'id,created_time,message',
            since,
            until
          }
        }
      );

      // Get insights for each post
      const postsWithInsights = await Promise.all(
        postsResponse.data.data.map(async (post: any) => {
          const postInsights = await this.getPostInsights(
            post.id,
            accessToken,
            ['post_impressions', 'post_engaged_users', 'post_reactions_by_type_total']
          );

          return {
            id: post.id,
            created_time: post.created_time,
            message: post.message,
            insights: {
              reactions: this.extractMetricValue(postInsights, 'post_reactions_by_type_total'),
              comments: this.extractMetricValue(postInsights, 'post_engaged_users'),
              shares: 0, // Requires additional API call to get shares count
              reach: this.extractMetricValue(postInsights, 'post_impressions'),
              impressions: this.extractMetricValue(postInsights, 'post_impressions'),
              engagement_rate: this.calculateEngagementRate(postInsights)
            }
          };
        })
      );

      const profile: FacebookProfile = {
        followers: this.extractMetricValue(pageInsights, 'page_fans'),
        engagement_rate: this.calculatePageEngagementRate(pageInsights),
        reach: this.extractMetricValue(pageInsights, 'page_impressions'),
        impressions: this.extractMetricValue(pageInsights, 'page_impressions'),
        page_views: this.extractMetricValue(pageInsights, 'page_views_total')
      };

      return {
        profile,
        posts: postsWithInsights,
        period: {
          start: since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: until || new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static extractMetricValue(insights: FacebookPageInsights | FacebookPostInsights, metricName: string): number {
    const metric = insights.data.find(m => m.name === metricName);
    return metric?.values[0]?.value || 0;
  }

  protected static calculateEngagementRate(insights: FacebookPostInsights): number {
    const impressions = this.extractMetricValue(insights, 'post_impressions');
    const engagements = this.extractMetricValue(insights, 'post_engaged_users');
    return impressions > 0 ? (engagements / impressions) * 100 : 0;
  }

  protected static calculatePageEngagementRate(insights: FacebookPageInsights): number {
    const impressions = this.extractMetricValue(insights, 'page_impressions');
    const engagements = this.extractMetricValue(insights, 'page_engaged_users');
    return impressions > 0 ? (engagements / impressions) * 100 : 0;
  }
}
