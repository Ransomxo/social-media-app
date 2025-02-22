import { CreatePostDto } from './post';

export interface FacebookPostResponse {
  id: string;
  created_time: string;
}

export interface FacebookPageInfo {
  id: string;
  name: string;
  access_token: string;
}

export interface FacebookTokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface FacebookError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id: string;
}

export type FacebookPostType = 'PHOTO' | 'VIDEO' | 'LINK' | 'STATUS';

export interface FacebookPostOptions extends CreatePostDto {
  type?: FacebookPostType;
  link?: string;
  picture?: string;
  scheduled_publish_time?: number;
}
