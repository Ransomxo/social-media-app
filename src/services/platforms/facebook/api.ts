import axios from 'axios';
import { ValidationError } from '../../../utils/errors/AppError';
import { FacebookError, FacebookPostOptions, FacebookPostResponse, FacebookTokenExchangeResponse } from '../../../types/social-media/facebook';

const FACEBOOK_API_VERSION = 'v18.0';
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

export class FacebookGraphAPI {
  private static async handleError(error: any): Promise<never> {
    if (axios.isAxiosError(error) && error.response?.data) {
      const fbError = error.response.data.error as FacebookError;
      return Promise.reject(new ValidationError(`Facebook API Error: ${fbError.message}`));
    }
    return Promise.reject(error);
  }

  static async exchangeCodeForToken(code: string, redirectUri: string, clientId: string, clientSecret: string): Promise<FacebookTokenExchangeResponse> {
    try {
      const response = await axios.get<FacebookTokenExchangeResponse>(`${FACEBOOK_GRAPH_URL}/oauth/access_token`, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async createPost(pageId: string, accessToken: string, options: FacebookPostOptions): Promise<FacebookPostResponse> {
    try {
      const params: Record<string, any> = {
        message: options.content,
        access_token: accessToken
      };

      if (options.media) {
        params.url = options.media;
      }

      if (options.scheduledAt) {
        params.scheduled_publish_time = Math.floor(options.scheduledAt.getTime() / 1000);
      }

      const response = await axios.post<FacebookPostResponse>(
        `${FACEBOOK_GRAPH_URL}/${pageId}/feed`,
        params
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getPageAccessToken(userAccessToken: string, pageId: string): Promise<string> {
    try {
      const response = await axios.get(`${FACEBOOK_GRAPH_URL}/${pageId}`, {
        params: {
          fields: 'access_token',
          access_token: userAccessToken
        }
      });
      return response.data.access_token;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
