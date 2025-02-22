import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';
import {
  InstagramAnalyticsResponse,
  InstagramMetricType,
  InstagramMediaMetricType,
  InstagramError
} from '../../types/social-media/analytics/instagram';

const INSTAGRAM_GRAPH_API_VERSION = 'v18.0';
const INSTAGRAM_GRAPH_API_URL = `https://graph.facebook.com/${INSTAGRAM_GRAPH_API_VERSION}`;

export class InstagramAnalyticsAPI {
  protected static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.data) {
      const instagramError = error.response.data as InstagramError;
      if (instagramError.error?.message) {
        throw new ValidationError(instagramError.error.message);
      }
    }
    if (error instanceof Error) {
      throw new ValidationError(error.message);
    }
    throw new ValidationError('An unknown error occurred while calling the Instagram Analytics API');
  }

  protected static async getProfileMetrics(
    userId: string,
    accessToken: string,
    since?: string,
    until?: string
  ): Promise<InstagramMetricType> {
    try {
      const params = new URLSearchParams({
        metric: [
          'impressions',
          'reach',
          'profile_views',
          'website_clicks'
        ].join(','),
        period: 'day'
      });

      if (since) params.append('since', since);
      if (until) params.append('until', until);

      const response = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/${userId}/insights`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params
        }
      );

      const metrics = response.data.data.reduce((acc: any, metric: any) => {
        acc[metric.name] = metric.values[0].value;
        return acc;
      }, {});

      // Get follower count and media count separately as they're not part of insights
      const profileResponse = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            fields: 'followers_count,media_count'
          }
        }
      );

      return {
        ...metrics,
        followers: profileResponse.data.followers_count || 0,
        posts: profileResponse.data.media_count || 0
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static async getMediaMetrics(
    mediaId: string,
    accessToken: string
  ): Promise<InstagramMediaMetricType> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/${mediaId}/insights`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            metric: [
              'impressions',
              'reach',
              'engagement',
              'saved',
              'video_views',
              'carousel_album_engagement'
            ].join(',')
          }
        }
      );

      const metrics = response.data.data.reduce((acc: any, metric: any) => {
        acc[metric.name] = metric.values[0].value;
        return acc;
      }, {});

      // Get likes, comments and shares separately
      const mediaResponse = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/${mediaId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            fields: 'like_count,comments_count,shares_count'
          }
        }
      );

      return {
        ...metrics,
        likes: mediaResponse.data.like_count || 0,
        comments: mediaResponse.data.comments_count || 0,
        shares: mediaResponse.data.shares_count || 0
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
  ): Promise<InstagramAnalyticsResponse> {
    try {
      const startDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = until || new Date().toISOString();

      // Get profile metrics
      const profileMetrics = await this.getProfileMetrics(userId, accessToken, startDate, endDate);

      // Get recent media
      const mediaResponse = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/${userId}/media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            fields: 'id,timestamp,media_type,media_url,permalink,caption',
            since: startDate,
            until: endDate
          }
        }
      );

      // Get metrics for each media
      const mediaWithMetrics = await Promise.all(
        mediaResponse.data.data.map(async (media: any) => {
          const metrics = await this.getMediaMetrics(media.id, accessToken);
          return {
            id: media.id,
            created_at: media.timestamp,
            media_type: media.media_type,
            media_url: media.media_url,
            permalink: media.permalink,
            caption: media.caption,
            metrics: {
              impressions: metrics.impressions,
              reach: metrics.reach,
              engagement: metrics.engagement,
              saved: metrics.saved,
              video_views: metrics.video_views,
              carousel_album_engagement: metrics.carousel_album_engagement,
              likes: metrics.likes,
              comments: metrics.comments,
              shares: metrics.shares
            }
          };
        })
      );

      return {
        profile: {
          followers: profileMetrics.followers,
          following: 0, // Not available via API
          posts: profileMetrics.posts,
          engagement_rate: this.calculateProfileEngagementRate(profileMetrics),
          reach: profileMetrics.reach,
          impressions: profileMetrics.impressions
        },
        media: mediaWithMetrics,
        period: {
          start: startDate,
          end: endDate
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static calculateProfileEngagementRate(metrics: InstagramMetricType): number {
    return metrics.impressions > 0 ? (metrics.profile_views / metrics.impressions) * 100 : 0;
  }
}
