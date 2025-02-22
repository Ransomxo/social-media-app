import { BaseProfile, BasePost, BaseAnalyticsResponse } from './base';

export interface TwitterProfile extends BaseProfile {
  following: number;
  tweets: number;
}

export interface TwitterPost extends BasePost {
  text: string;
  retweets: number;
  replies: number;
  url_clicks?: number;
  profile_clicks?: number;
  hashtag_clicks?: number;
}

export interface TwitterAnalyticsResponse extends BaseAnalyticsResponse {
  profile: TwitterProfile;
  posts: TwitterPost[];
}

export interface TwitterMetricType {
  impressions: number;
  engagement: number;
  profile_visits: number;
  mentions: number;
  followers: number;
  tweets: number;
}

export interface TwitterTweetMetricType {
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  url_clicks?: number;
  profile_clicks?: number;
  hashtag_clicks?: number;
}

export interface TwitterError {
  code: number;
  message: string;
  errors?: Array<{
    message: string;
    code: string;
  }>;
}
