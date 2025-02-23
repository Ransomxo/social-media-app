import { BaseAnalyticsResponse, BaseMetrics, BasePost, BaseProfile } from './base';

export interface LinkedInMetrics extends BaseMetrics {
  likes: number;
  clicks: number;
  reactions: number;
  shares: number;
}

export interface LinkedInProfile extends BaseProfile {
  connections: number;
  unique_visitors: number;
}

export interface LinkedInPost extends Omit<BasePost, 'metrics'> {
  content: string;
  metrics: LinkedInMetrics;
}

export interface LinkedInAnalyticsResponse extends Omit<BaseAnalyticsResponse, 'profile' | 'posts'> {
  profile: LinkedInProfile;
  posts: LinkedInPost[];
}
