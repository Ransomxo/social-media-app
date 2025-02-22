import axios from 'axios';
import { ValidationError } from '../../../utils/errors/AppError';
import { TwitterError, TwitterPostOptions, TwitterPostResponse, TwitterTokenExchangeResponse } from '../../../types/social-media/twitter';

const TWITTER_API_VERSION = '2';
const TWITTER_API_URL = `https://api.twitter.com/${TWITTER_API_VERSION}`;

export class TwitterAPI {
  private static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      const twitterError = error.response.data.errors[0] as TwitterError;
      throw new ValidationError(`Twitter API Error: ${twitterError.detail}`);
    }
    if (error instanceof Error) {
      throw new ValidationError(`Twitter API Error: ${error.message}`);
    }
    throw new ValidationError('An unknown error occurred while calling the Twitter API');
  }

  static async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    clientId: string,
    clientSecret: string
  ): Promise<TwitterTokenExchangeResponse> {
    try {
      const response = await axios.post<TwitterTokenExchangeResponse>(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
          code_verifier: 'challenge'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async createPost(accessToken: string, options: TwitterPostOptions): Promise<TwitterPostResponse> {
    try {
      const payload: Record<string, any> = {
        text: options.content
      };

      if (options.media?.media_ids) {
        payload.media = options.media;
      }

      if (options.reply) {
        payload.reply = options.reply;
      }

      if (options.quote) {
        payload.quote = options.quote;
      }

      if (options.poll) {
        payload.poll = options.poll;
      }

      const response = await axios.post<TwitterPostResponse>(
        `${TWITTER_API_URL}/tweets`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async schedulePost(accessToken: string, options: TwitterPostOptions): Promise<TwitterPostResponse> {
    if (!options.scheduledAt) {
      throw new ValidationError('Scheduled time is required for scheduling a tweet');
    }

    try {
      const payload = {
        ...options,
        scheduled_time: options.scheduledAt.toISOString()
      };

      const response = await axios.post<TwitterPostResponse>(
        `${TWITTER_API_URL}/tweets/scheduled`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
