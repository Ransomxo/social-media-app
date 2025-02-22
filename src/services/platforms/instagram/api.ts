import axios from 'axios';
import { ValidationError } from '../../../utils/errors/AppError';
import { InstagramError, InstagramPostOptions, InstagramPostResponse, InstagramTokenExchangeResponse } from '../../../types/social-media/instagram';

const INSTAGRAM_API_VERSION = 'v18.0';
const INSTAGRAM_API_URL = `https://graph.instagram.com/${INSTAGRAM_API_VERSION}`;

export class InstagramAPI {
  private static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const instagramError = error.response.data.error as InstagramError;
      throw new ValidationError(`Instagram API Error: ${instagramError.message}`);
    }
    if (error instanceof Error) {
      throw new ValidationError(`Instagram API Error: ${error.message}`);
    }
    throw new ValidationError('An unknown error occurred while calling the Instagram API');
  }

  static async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    clientId: string,
    clientSecret: string
  ): Promise<InstagramTokenExchangeResponse> {
    try {
      const response = await axios.post<InstagramTokenExchangeResponse>(
        'https://api.instagram.com/oauth/access_token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret
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

  static async createPost(accessToken: string, options: InstagramPostOptions): Promise<InstagramPostResponse> {
    try {
      // First, create a media container
      const mediaResponse = await axios.post(
        `${INSTAGRAM_API_URL}/me/media`,
        {
          image_url: options.media.media_url,
          caption: options.content,
          access_token: accessToken,
          ...options.location_id && { location_id: options.location_id },
          ...options.user_tags && { user_tags: JSON.stringify(options.user_tags) }
        }
      );

      // Then publish the container
      const response = await axios.post<InstagramPostResponse>(
        `${INSTAGRAM_API_URL}/me/media_publish`,
        {
          creation_id: mediaResponse.data.id,
          access_token: accessToken
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async schedulePost(accessToken: string, options: InstagramPostOptions): Promise<InstagramPostResponse> {
    if (!options.scheduledAt) {
      throw new ValidationError('Scheduled time is required for scheduling a post');
    }

    try {
      const response = await axios.post<InstagramPostResponse>(
        `${INSTAGRAM_API_URL}/me/media`,
        {
          image_url: options.media.media_url,
          caption: options.content,
          access_token: accessToken,
          published: false,
          scheduled_publish_time: Math.floor(options.scheduledAt.getTime() / 1000),
          ...options.location_id && { location_id: options.location_id },
          ...options.user_tags && { user_tags: JSON.stringify(options.user_tags) }
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
