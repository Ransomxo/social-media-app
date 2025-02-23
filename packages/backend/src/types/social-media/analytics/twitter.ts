import { BaseAnalyticsResponse, BaseMetrics, BasePost, BaseProfile } from './base';

export interface TwitterMetrics extends BaseMetrics {
  likes: number;
  retweets: number;
  replies: number;
}

export interface TwitterProfile extends BaseProfile {
  following: number;
  tweets: number;
}

export interface TwitterPost extends Omit<BasePost, 'metrics'> {
  text: string;
  metrics: TwitterMetrics;
}

export interface TwitterAnalyticsResponse extends Omit<BaseAnalyticsResponse, 'profile' | 'posts'> {
  profile: TwitterProfile;
  posts: TwitterPost[];
}
