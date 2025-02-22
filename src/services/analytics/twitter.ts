import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';
import {
  TwitterAnalyticsResponse,
  TwitterMetricType,
  TwitterTweetMetricType,
  TwitterError
} from '../../types/social-media/analytics/twitter';

const TWITTER_API_VERSION = '2';
const TWITTER_API_URL = `https://api.twitter.com/v${TWITTER_API_VERSION}`;

export class TwitterAnalyticsAPI {
  protected static handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const twitterError = error.response?.data as TwitterError | undefined;
      if (twitterError?.errors && twitterError.errors.length > 0) {
        throw new ValidationError(twitterError.errors[0].message);
      }
      if (twitterError?.message) {
        throw new ValidationError(twitterError.message);
      }
    }
    if (error instanceof Error) {
      throw new ValidationError(error.message);
    }
    throw new ValidationError('An unknown error occurred while calling the Twitter Analytics API');
  }

  protected static async getUserMetrics(
    userId: string,
    accessToken: string,
    startTime?: string,
    endTime?: string
  ): Promise<TwitterMetricType> {
    try {
      const params = new URLSearchParams({
        'user.fields': 'public_metrics'
      });

      if (startTime) params.append('start_time', startTime);
      if (endTime) params.append('end_time', endTime);

      const response = await axios.get(
        `${TWITTER_API_URL}/users/${userId}/metrics`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params
        }
      );

      return response.data.data.public_metrics;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected static async getTweetMetrics(
    tweetId: string,
    accessToken: string
  ): Promise<TwitterTweetMetricType> {
    try {
      const response = await axios.get(
        `${TWITTER_API_URL}/tweets/${tweetId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            'tweet.fields': 'public_metrics,non_public_metrics'
          }
        }
      );

      return {
        ...response.data.data.public_metrics,
        ...response.data.data.non_public_metrics
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
  ): Promise<TwitterAnalyticsResponse> {
    try {
      const startDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = until || new Date().toISOString();

      // Get user metrics
      const userMetrics = await this.getUserMetrics(userId, accessToken, startDate, endDate);

      // Get recent tweets
      const tweetsResponse = await axios.get(
        `${TWITTER_API_URL}/users/${userId}/tweets`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            'tweet.fields': 'created_at,public_metrics',
            'max_results': 100,
            'start_time': startDate,
            'end_time': endDate
          }
        }
      );

      // Get metrics for each tweet
      const tweetsWithMetrics = await Promise.all(
        tweetsResponse.data.data.map(async (tweet: any) => {
          const metrics = await this.getTweetMetrics(tweet.id, accessToken);
          return {
            id: tweet.id,
            created_at: tweet.created_at,
            text: tweet.text,
            metrics: {
              impressions: metrics.impressions,
              likes: metrics.likes,
              retweets: metrics.retweets,
              replies: metrics.replies,
              engagement_rate: this.calculateTweetEngagementRate(metrics),
              url_clicks: metrics.url_clicks,
              profile_clicks: metrics.profile_clicks,
              hashtag_clicks: metrics.hashtag_clicks
            }
          };
        })
      );

      return {
        profile: {
          followers: userMetrics.followers,
          following: userMetrics.engagement,
          tweets: userMetrics.tweets,
          engagement_rate: this.calculateProfileEngagementRate(userMetrics),
          impressions: userMetrics.impressions
        },
        tweets: tweetsWithMetrics,
        period: {
          start: startDate,
          end: endDate
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static calculateTweetEngagementRate(metrics: TwitterTweetMetricType): number {
    const engagements = metrics.likes + metrics.retweets + metrics.replies;
    return metrics.impressions > 0 ? (engagements / metrics.impressions) * 100 : 0;
  }

  private static calculateProfileEngagementRate(metrics: TwitterMetricType): number {
    const engagements = metrics.engagement;
    return metrics.impressions > 0 ? (engagements / metrics.impressions) * 100 : 0;
  }
}
