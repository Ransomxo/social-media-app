import axios from 'axios';
import { AppError } from '../../../utils/errors/AppError';

interface TwitterTokens {
  accessToken: string;
  refreshToken: string;
  accountId: string;
}

interface TwitterAnalytics {
  likes: number;
  shares: number;
  comments: number;
  reach: number;
}

export class TwitterService {
  static async getAccessToken(
    authCode: string,
    redirectUri: string
  ): Promise<TwitterTokens> {
    try {
      if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
        throw new AppError('Twitter credentials not configured', 500);
      }

      const response = await axios.post('https://api.twitter.com/2/oauth2/token', {
        code: authCode,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID,
        client_secret: process.env.TWITTER_CLIENT_SECRET
      });

      if (!response.data.access_token || !response.data.refresh_token || !response.data.user_id) {
        throw new AppError('Invalid response from Twitter', 500);
      }

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        accountId: response.data.user_id
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get Twitter access token', 500);
    }
  }

  static async schedulePost(
    content: string,
    scheduledTime: Date,
    accessToken: string
  ): Promise<void> {
    try {
      if (!content || !scheduledTime || !accessToken) {
        throw new AppError('Missing required parameters for scheduling post', 400);
      }

      await axios.post(
        'https://api.twitter.com/2/tweets',
        {
          text: content,
          scheduled_time: scheduledTime.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to schedule Twitter post', 500);
    }
  }

  static async getPostAnalytics(
    postId: string,
    accessToken: string
  ): Promise<TwitterAnalytics> {
    try {
      if (!postId || !accessToken) {
        throw new AppError('Missing required parameters for analytics', 400);
      }

      const response = await axios.get(
        `https://api.twitter.com/2/tweets/${postId}/metrics`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.data) {
        throw new AppError('Invalid response from Twitter', 500);
      }

      return {
        likes: response.data.like_count || 0,
        shares: response.data.retweet_count || 0,
        comments: response.data.reply_count || 0,
        reach: response.data.impression_count || 0
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get Twitter analytics', 500);
    }
  }
}
