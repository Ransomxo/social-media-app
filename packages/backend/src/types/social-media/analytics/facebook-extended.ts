export interface FacebookExtendedMetrics {
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  clicks: number;
  video_views: number;
  duration: number;
}

export interface FacebookExtendedProfile {
  followers: number;
  page_likes: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  page_views: number;
  video_views: number;
  total_posts: number;
}

export interface FacebookExtendedPost {
  id: string;
  created_time: string;
  message: string;
  type: string;
  metrics: FacebookExtendedMetrics;
}

export interface FacebookExtendedDemographics {
  age_gender: Record<string, { male: number; female: number }>;
  location: Record<string, number>;
  language: Record<string, number>;
  profile: {
    age_range: string;
    gender: string;
    location: string;
    language: string;
  };
}

export interface FacebookContentPerformance {
  top_posts: Array<FacebookExtendedPost>;
  content_types: Array<{ type: string; engagement_rate: number }>;
}

export interface FacebookAudienceGrowth {
  total_followers: number;
  new_followers: number;
  follower_growth_rate: number;
  unfollow_rate: number;
}

export interface FacebookEngagementMetrics {
  engagement_rate: number;
  interactions_per_post: number;
  reach_per_post: number;
  impressions_per_post: number;
}

export interface FacebookExtendedAnalyticsResponse {
  profile: FacebookExtendedProfile;
  demographics: FacebookExtendedDemographics;
  content_performance: FacebookContentPerformance;
  audience_growth: FacebookAudienceGrowth;
  engagement_metrics: FacebookEngagementMetrics;
  period: {
    start: string;
    end: string;
  };
}
