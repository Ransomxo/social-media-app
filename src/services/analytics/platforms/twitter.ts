import axios from 'axios';
import { AppError } from '../../../utils/errors/AppError';
import { AnalyticsMetrics } from '../../../types/models';

export async function collectTwitterMetrics(postId: string, accessToken: string): Promise<AnalyticsMetrics> {
  try {
    const response = await axios.get(`https://api.twitter.com/2/tweets/${postId}/metrics`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        'tweet.fields': 'public_metrics,non_public_metrics'
      }
    });

    const metrics = response.data.data;
    return {
      impressions: metrics.impression_count,
      engagements: metrics.reply_count + metrics.like_count + metrics.retweet_count,
      clicks: metrics.url_link_clicks || 0,
      shares: metrics.retweet_count,
      likes: metrics.like_count,
      comments: metrics.reply_count,
      reach: metrics.impression_count
    };
  } catch (error) {
    throw new AppError('Failed to collect Twitter metrics', 500);
  }
}
