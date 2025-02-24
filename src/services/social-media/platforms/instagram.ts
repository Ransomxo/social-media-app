import axios from 'axios';
import { TokenResponse } from '../../../types/social-media';
import { AppError } from '../../../utils/errors/AppError';

export async function exchangeInstagramCode(code: string, redirectUri: string): Promise<TokenResponse> {
  try {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', {
      code,
      grant_type: 'authorization_code',
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      redirect_uri: redirectUri,
    });

    const accountId = await getInstagramAccountId(response.data.access_token);
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      accountId
    };
  } catch (error) {
    throw new AppError('Failed to exchange Instagram authorization code', 500);
  }
}

export async function getInstagramAccountId(accessToken: string): Promise<string> {
  try {
    const response = await axios.get('https://graph.instagram.com/me', {
      params: { access_token: accessToken }
    });
    return response.data.id;
  } catch (error) {
    throw new AppError('Failed to fetch Instagram account ID', 500);
  }
}
