import { CreatePostDto } from '../post';

export interface TwitterAnalyticsResponse {
  profile: {
    followers: number;
    following: number;
    tweets: number;
    engagement_rate: number;
    impressions: number;
  };
  tweets: Array<{
    id: string;
    created_at: string;
    text: string;
    metrics: {
      impressions: number;
      likes: number;
      retweets: number;
      replies: number;
      engagement_rate: number;
      url_clicks?: number;
      profile_clicks?: number;
      hashtag_clicks?: number;
    };
  }>;
  period: {
    start: string;
    end: string;
  };
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
