export interface BaseMetrics {
  impressions: number;
  engagement_rate: number;
  reach: number;
}

export interface BaseProfile extends BaseMetrics {
  followers: number;
  page_views: number;
  reach: number;
}

export interface BasePost {
  id: string;
  content: string;
  created_at: string;
  posted_at: string;
  engagement: number;
  reach: number;
  impressions: number;
  metrics: BaseMetrics & {
    likes: number;
  };
}

export interface BaseAnalyticsResponse {
  profile: BaseProfile;
  posts: BasePost[];
  period: {
    start: string;
    end: string;
  };
}
