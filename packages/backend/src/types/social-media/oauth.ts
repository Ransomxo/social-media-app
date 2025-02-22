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

export interface SocialTokenResponse {
  id: string;
  platform: SocialPlatform;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
