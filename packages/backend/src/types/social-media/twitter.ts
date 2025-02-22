import { CreatePostDto } from './post';

export interface TwitterTokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

export interface TwitterError {
  type: string;
  title: string;
  detail: string;
  status: number;
}

export interface TwitterPostResponse {
  data: {
    id: string;
    text: string;
  };
}

export interface TwitterMediaOptions {
  media_ids: string[];
  tagged_user_ids?: string[];
}

export interface TwitterPostOptions extends Omit<CreatePostDto, 'platforms' | 'media'> {
  platforms: ['twitter'];
  media?: TwitterMediaOptions;
  reply?: {
    in_reply_to_tweet_id: string;
  };
  quote?: {
    quote_tweet_id: string;
  };
  poll?: {
    duration_minutes: number;
    options: string[];
  };
}
