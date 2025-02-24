import { User, SocialMediaPost, SocialMediaAccount, Team, TeamMember, ApiUsage } from '@prisma/client';

export type Platform = 'twitter' | 'facebook' | 'instagram' | 'linkedin';

export type TokenResponse = {
  accessToken: string;
  refreshToken?: string;
  accountId?: string;
};

export type PostScheduleRequest = {
  content: string;
  platform: Platform;
  scheduledFor: Date;
  userId: string;
};

export type AnalyticsMetrics = {
  likes: number;
  shares: number;
  comments: number;
  views?: number;
  impressions?: number;
  engagements?: number;
  clicks?: number;
  reach?: number;
};

export type { 
  User,
  SocialMediaPost,
  SocialMediaAccount,
  Team,
  TeamMember,
  ApiUsage
};
