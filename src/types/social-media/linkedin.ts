import { CreatePostDto } from './post';

export interface LinkedInTokenExchangeResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope: string;
}

export interface LinkedInError {
  status: number;
  code: string;
  message: string;
  requestId?: string;
}

export interface LinkedInPostResponse {
  id: string;
  created: {
    actor: string;
    time: number;
  };
  lastModified: {
    actor: string;
    time: number;
  };
  lifecycleState: string;
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: string;
      media?: Array<{
        status: string;
        description?: {
          text: string;
        };
        media: string;
        title: {
          text: string;
        };
      }>;
    };
  };
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': string;
  };
}

export interface LinkedInMediaUploadResponse {
  value: {
    uploadMechanism: {
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
        uploadUrl: string;
        headers: {
          [key: string]: string;
        };
      };
    };
    mediaArtifact: string;
    asset: string;
  };
}

export interface LinkedInPostOptions extends Omit<CreatePostDto, 'platforms' | 'media'> {
  platforms: ['linkedin'];
  media?: {
    title: string;
    description?: string;
    url: string;
  };
  visibility?: 'PUBLIC' | 'CONNECTIONS';
}
