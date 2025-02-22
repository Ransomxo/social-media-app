export interface SocialMediaAnalytics {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'tiktok';
  metrics: {
    followers: number;
    engagement: number;
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
  };
  period: {
    start: Date;
    end: Date;
  };
}

export interface AnalyticsResponse {
  data: SocialMediaAnalytics[];
  timestamp: Date;
}
