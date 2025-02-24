import axios from 'axios';
import { TokenResponse } from '../../../types/social-media';
import { AppError } from '../../../utils/errors/AppError';

export async function exchangeTwitterCode(code: string, redirectUri: string): Promise<TokenResponse> {
  try {
    const response = await axios.post('https://api.twitter.com/2/oauth2/token', {
      code,
      grant_type: 'authorization_code',
      client_id: process.env.TWITTER_CLIENT_ID,
      client_secret: process.env.TWITTER_CLIENT_SECRET,
      redirect_uri: redirectUri,
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  } catch (error) {
    throw new AppError('Failed to exchange Twitter authorization code', 500);
  }
}

export async function getTwitterAccountId(accessToken: string): Promise<string> {
  try {
    const response = await axios.get('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.data.id;
  } catch (error) {
    throw new AppError('Failed to fetch Twitter account ID', 500);
  }
}
