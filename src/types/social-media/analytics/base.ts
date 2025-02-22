export interface BaseAnalyticsProfile {
  followers: number;
  engagement_rate: number;
}

export interface BaseAnalyticsPost {
  id: string;
  created_at: string;
  metrics: {
    impressions: number;
    likes: number;
  };
}

export interface BaseAnalyticsResponse {
  profile: BaseAnalyticsProfile;
  posts: BaseAnalyticsPost[];
  period: {
    start: string;
    end: string;
  };
}
