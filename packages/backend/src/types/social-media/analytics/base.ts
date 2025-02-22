export interface BaseMetrics {
  impressions: number;
  engagement_rate: number;
}

export interface BaseProfile extends BaseMetrics {
  followers: number;
}

export interface BasePost {
  id: string;
  created_at: string;
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
