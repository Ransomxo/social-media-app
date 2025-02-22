export interface FacebookInsightsMetric {
  name: string;
  period: string;
  values: Array<{
    value: number;
    end_time: string;
  }>;
  title: string;
  description: string;
  id: string;
}

export interface FacebookPageInsights {
  data: FacebookInsightsMetric[];
  paging?: {
    previous: string;
    next: string;
  };
}

export interface FacebookPostInsights {
  data: FacebookInsightsMetric[];
  paging?: {
    previous: string;
    next: string;
  };
}

import { BaseProfile, BasePost, BaseAnalyticsResponse } from './base';

export interface FacebookProfile extends BaseProfile {
  reach: number;
  impressions: number;
  page_views: number;
}

export interface FacebookPost extends BasePost {
  reactions: number;
  comments: number;
  shares: number;
  reach: number;
}

export interface FacebookAnalyticsResponse extends BaseAnalyticsResponse {
  profile: FacebookProfile;
  posts: FacebookPost[];
    page_views: number;
  };
  posts: Array<{
    id: string;
    created_time: string;
    message?: string;
    insights: {
      reactions: number;
      comments: number;
      shares: number;
      reach: number;
      impressions: number;
      engagement_rate: number;
    };
  }>;
  period: {
    start: string;
    end: string;
  };
}

export type FacebookMetricType = 
  | 'page_impressions'
  | 'page_engaged_users'
  | 'page_post_engagements'
  | 'page_fans'
  | 'page_views_total';

export type FacebookPostMetricType =
  | 'post_impressions'
  | 'post_engaged_users'
  | 'post_reactions_by_type_total'
  | 'post_clicks'
  | 'post_activity';
