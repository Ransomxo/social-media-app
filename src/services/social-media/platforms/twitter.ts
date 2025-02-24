import axios from 'axios';
import { TokenResponse } from '../../../types/social-media';
import { AppError } from '../../../utils/errors/AppError';

export class PlatformService {
  private baseUrl = 'https://api.twitter.com';
  private clientId = process.env.TWITTER_CLIENT_ID;
  private clientSecret = process.env.TWITTER_CLIENT_SECRET;

  async getAccessToken(code: string, redirectUri: string): Promise<TokenResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/oauth2/token`,
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        accountId: response.data.account_id
      };
    } catch (error) {
      throw new AppError('Failed to get Twitter access token', 500);
    }
  }
}
