export interface InstagramAnalyticsResponse {
  profile: {
    followers: number;
    following: number;
    posts: number;
    engagement_rate: number;
    reach: number;
    impressions: number;
  };
  media: Array<{
    id: string;
    created_at: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    permalink: string;
    caption?: string;
    metrics: {
      impressions: number;
      reach: number;
      engagement: number;
      saved: number;
      video_views?: number;
      carousel_album_engagement?: number;
      likes: number;
      comments: number;
      shares: number;
    };
  }>;
  period: {
    start: string;
    end: string;
  };
}

export interface InstagramMetricType {
  impressions: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
  followers: number;
  posts: number;
}

export interface InstagramMediaMetricType {
  impressions: number;
  reach: number;
  engagement: number;
  saved: number;
  video_views?: number;
  carousel_album_engagement?: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface InstagramError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}
