export interface SocialMediaPlatform {
  name: 'twitter' | 'instagram' | 'linkedin' | 'facebook';
  displayName: string;
  authUrl: string;
  tokenUrl: string;
  apiBaseUrl: string;
}

export interface SocialMediaAccountDTO {
  id: string;
  platform: string;
  accountId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectAccountRequest {
  platform: string;
  code: string;
  redirectUri: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}
