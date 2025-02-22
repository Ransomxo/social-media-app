import { BaseProfile, BasePost, BaseAnalyticsResponse } from './base';

export interface InstagramProfile extends BaseProfile {
  following: number;
  posts: number;
  reach: number;
}

export interface InstagramPost extends BasePost {
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  reach: number;
  saved: number;
  video_views?: number;
  carousel_album_engagement?: number;
  comments: number;
  shares: number;
}

export interface InstagramAnalyticsResponse extends BaseAnalyticsResponse {
  profile: InstagramProfile;
  posts: InstagramPost[];
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
