import axios from 'axios';
import { ValidationError } from '../../../utils/errors/AppError';
import {
  LinkedInError,
  LinkedInPostOptions,
  LinkedInPostResponse,
  LinkedInTokenExchangeResponse,
  LinkedInMediaUploadResponse
} from '../../../types/social-media/linkedin';

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

export class LinkedInAPI {
  private static handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.data) {
      const linkedinError = error.response.data as LinkedInError;
      throw new ValidationError(`LinkedIn API Error: ${linkedinError.message}`);
    }
    if (error instanceof Error) {
      throw new ValidationError(`LinkedIn API Error: ${error.message}`);
    }
    throw new ValidationError('An unknown error occurred while calling the LinkedIn API');
  }

  static async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    clientId: string,
    clientSecret: string
  ): Promise<LinkedInTokenExchangeResponse> {
    try {
      const response = await axios.post<LinkedInTokenExchangeResponse>(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static async uploadMedia(
    accessToken: string,
    mediaUrl: string,
    title: string,
    description?: string
  ): Promise<string> {
    try {
      // Register media upload
      const registerResponse = await axios.post<LinkedInMediaUploadResponse>(
        `${LINKEDIN_API_URL}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: 'urn:li:person:me',
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      
      // Upload media to LinkedIn
      await axios.put(
        uploadUrl,
        mediaResponse.data,
        {
          headers: {
            ...registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].headers,
            'Content-Type': 'application/octet-stream'
          }
        }
      );

      return registerResponse.data.value.asset;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async createPost(accessToken: string, options: LinkedInPostOptions): Promise<LinkedInPostResponse> {
    try {
      const payload: any = {
        author: 'urn:li:person:me',
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: options.content
            },
            shareMediaCategory: options.media ? 'IMAGE' : 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC'
        }
      };

      if (options.media) {
        const mediaAsset = await this.uploadMedia(
          accessToken,
          options.media.url,
          options.media.title,
          options.media.description
        );

        payload.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          description: {
            text: options.media.description || ''
          },
          media: mediaAsset,
          title: {
            text: options.media.title
          }
        }];
      }

      const response = await axios.post<LinkedInPostResponse>(
        `${LINKEDIN_API_URL}/ugcPosts`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async schedulePost(accessToken: string, options: LinkedInPostOptions): Promise<LinkedInPostResponse> {
    if (!options.scheduledAt) {
      throw new ValidationError('Scheduled time is required for scheduling a post');
    }

    try {
      const payload: any = {
        author: 'urn:li:person:me',
        lifecycleState: 'SCHEDULED',
        scheduledTime: Math.floor(options.scheduledAt.getTime() / 1000),
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: options.content
            },
            shareMediaCategory: options.media ? 'IMAGE' : 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC'
        }
      };

      if (options.media) {
        const mediaAsset = await this.uploadMedia(
          accessToken,
          options.media.url,
          options.media.title,
          options.media.description
        );

        payload.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          description: {
            text: options.media.description || ''
          },
          media: mediaAsset,
          title: {
            text: options.media.title
          }
        }];
      }

      const response = await axios.post<LinkedInPostResponse>(
        `${LINKEDIN_API_URL}/ugcPosts`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
