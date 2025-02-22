import { SocialToken } from '@prisma/client';

export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface OAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface SocialTokenResponse extends SocialToken {
  platform: SocialPlatform;
}
