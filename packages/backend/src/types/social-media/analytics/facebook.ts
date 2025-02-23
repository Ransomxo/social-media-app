import { BaseAnalyticsResponse, BaseMetrics, BasePost, BaseProfile } from './base';

export interface FacebookMetrics extends BaseMetrics {
  likes: number;
  shares: number;
  comments: number;
  reach: number;
}

export interface FacebookProfile extends BaseProfile {
  page_likes: number;
  reach: number;
}

export interface FacebookPost extends Omit<BasePost, 'metrics'> {
  message: string;
  metrics: FacebookMetrics;
}

export interface FacebookAnalyticsResponse extends Omit<BaseAnalyticsResponse, 'profile' | 'posts'> {
  profile: FacebookProfile;
  posts: FacebookPost[];
}
