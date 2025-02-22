import { FacebookAnalyticsResponse } from './facebook';

export interface FacebookDemographics {
  age_gender: Array<{
    age_range: string;
    gender: string;
    percentage: number;
  }>;
  location: Array<{
    country: string;
    city?: string;
    percentage: number;
  }>;
  language: Array<{
    language: string;
    percentage: number;
  }>;
}

export interface FacebookContentPerformance {
  best_performing_posts: Array<{
    id: string;
    content: string;
    type: 'photo' | 'video' | 'link' | 'status';
    engagement_rate: number;
    reach: number;
    impressions: number;
    reactions: {
      like: number;
      love: number;
      haha: number;
      wow: number;
      sad: number;
      angry: number;
    };
    comments: number;
    shares: number;
    posted_at: string;
  }>;
  content_type_performance: Array<{
    type: 'photo' | 'video' | 'link' | 'status';
    average_engagement_rate: number;
    average_reach: number;
    total_posts: number;
  }>;
  optimal_posting_times: Array<{
    day_of_week: string;
    hour: number;
    engagement_rate: number;
  }>;
}

export interface FacebookAudienceInsights {
  fan_growth: Array<{
    date: string;
    total_fans: number;
    new_fans: number;
    unfollows: number;
    net_growth: number;
  }>;
  engagement_trends: Array<{
    date: string;
    engagement_rate: number;
    total_engagements: number;
    reactions: number;
    comments: number;
    shares: number;
  }>;
  reach_trends: Array<{
    date: string;
    organic_reach: number;
    paid_reach: number;
    total_reach: number;
  }>;
}

export interface FacebookExtendedAnalyticsResponse extends FacebookAnalyticsResponse {
  demographics: FacebookDemographics;
  content_performance: FacebookContentPerformance;
  audience_insights: FacebookAudienceInsights;
  date_range: {
    start: string;
    end: string;
  };
}
