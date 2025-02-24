import axios from 'axios';
import { AppError } from '../../../utils/errors/AppError';
import { AnalyticsMetrics } from '../collector.service';

export async function collectInstagramMetrics(postId: string, accessToken: string): Promise<AnalyticsMetrics> {
  try {
    const response = await axios.get(`https://graph.instagram.com/${postId}/insights`, {
      params: {
        access_token: accessToken,
        metric: 'impressions,reach,engagement,saved'
      }
    });

    const metrics = response.data.data;
    return {
      impressions: metrics.impressions.values[0].value,
      engagements: metrics.engagement.values[0].value,
      clicks: 0, // Instagram API doesn't provide click metrics
      shares: metrics.saved.values[0].value,
      likes: 0, // Need separate API call for likes
      comments: 0, // Need separate API call for comments
      reach: metrics.reach.values[0].value
    };
  } catch (error) {
    throw new AppError('Failed to collect Instagram metrics', 500);
  }
}
