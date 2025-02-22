import { CreatePostDto } from './post';

export interface InstagramTokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
}

export interface InstagramError {
  error_type: string;
  code: number;
  message: string;
  error_subcode?: number;
  fbtrace_id?: string;
}

export interface InstagramPostResponse {
  id: string;
  status_code: string;
  permalink?: string;
}

export interface InstagramMediaOptions {
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
}

export interface InstagramPostOptions extends Omit<CreatePostDto, 'platforms' | 'media'> {
  platforms: ['instagram'];
  media: InstagramMediaOptions;
  location_id?: string;
  user_tags?: Array<{
    username: string;
    x: number;
    y: number;
  }>;
}
