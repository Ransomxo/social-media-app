import { BaseAnalyticsResponse } from './base';

export interface LinkedInAnalyticsResponse extends BaseAnalyticsResponse {
  profile: {
    followers: number;
    connections: number;
    posts: number;
    engagement_rate: number;
    impressions: number;
    unique_visitors: number;
  };
  posts: Array<{
    id: string;
    created_at: string;
    content: string;
    media_type?: 'IMAGE' | 'VIDEO' | 'ARTICLE' | 'DOCUMENT';
    metrics: {
      impressions: number;
      clicks: number;
      likes: number;
      comments: number;
      shares: number;
      engagement_rate: number;
    };
  }>;
  period: {
    start: string;
    end: string;
  };
}

export interface LinkedInMetricType {
  impressions: number;
  unique_visitors: number;
  clicks: number;
  followers: number;
  connections: number;
  posts: number;
}

export interface LinkedInPostMetricType {
  impressions: number;
  clicks: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface LinkedInError {
  status: number;
  message: string;
  serviceErrorCode?: number;
  code?: string;
}
