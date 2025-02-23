import { BaseAnalyticsResponse, BaseMetrics, BasePost, BaseProfile } from './base';

export interface InstagramMetrics extends BaseMetrics {
  likes: number;
  saves: number;
  shares: number;
  comments: number;
}

export interface InstagramProfile extends BaseProfile {
  following: number;
  reach: number;
  profile_views: number;
  media_count: number;
}

export interface InstagramPost extends Omit<BasePost, 'metrics'> {
  caption: string;
  media_type: string;
  metrics: InstagramMetrics;
}

export interface InstagramAnalyticsResponse extends Omit<BaseAnalyticsResponse, 'profile' | 'posts'> {
  profile: InstagramProfile;
  posts: InstagramPost[];
}
