import { LinkedInAPI } from './api';
import axios from 'axios';
import { AppError, ValidationError } from '../../../utils/errors/AppError';
import { LinkedInPostOptions } from '../../../types/social-media/linkedin';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LinkedInAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for access token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'mock_access_token',
          expires_in: 3600,
          scope: 'r_liteprofile w_member_social'
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await LinkedInAPI.exchangeCodeForToken(
        'test_code',
        'http://localhost:3000/callback',
        'client_id',
        'client_secret'
      );

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.linkedin.com/oauth/v2/accessToken',
        expect.any(URLSearchParams),
        expect.any(Object)
      );
    });

    it('should handle LinkedIn API errors', async () => {
      const mockError = new Error('Invalid OAuth code') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          status: 400,
          code: 'INVALID_REQUEST',
          message: 'Invalid OAuth code'
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        LinkedInAPI.exchangeCodeForToken(
          'invalid_code',
          'http://localhost:3000/callback',
          'client_id',
          'client_secret'
        )
      ).rejects.toThrow('LinkedIn API Error: Invalid OAuth code');
    });
  });

  describe('createPost', () => {
    const mockPost: LinkedInPostOptions = {
      content: 'Test post',
      scheduledAt: new Date('2025-03-01T12:00:00Z'),
      platforms: ['linkedin'],
      media: {
        title: 'Test Image',
        description: 'Test Description',
        url: 'https://example.com/image.jpg'
      }
    };

    it('should create a post with media successfully', async () => {
      const mockMediaUploadResponse = {
        data: {
          value: {
            uploadMechanism: {
              'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
                uploadUrl: 'https://upload.linkedin.com/media',
                headers: {
                  'Authorization': 'Bearer mock_token'
                }
              }
            },
            mediaArtifact: 'urn:li:media:123',
            asset: 'urn:li:asset:456'
          }
        }
      };

      const mockPostResponse = {
        data: {
          id: 'post_123',
          created: {
            actor: 'urn:li:person:123',
            time: 1614556800000
          },
          lastModified: {
            actor: 'urn:li:person:123',
            time: 1614556800000
          },
          lifecycleState: 'PUBLISHED'
        }
      };

      mockedAxios.post
        .mockResolvedValueOnce(mockMediaUploadResponse)
        .mockResolvedValueOnce(mockPostResponse);
      
      mockedAxios.get.mockResolvedValueOnce({ data: Buffer.from('image data') });
      mockedAxios.put.mockResolvedValueOnce({});

      const result = await LinkedInAPI.createPost('access_token', mockPost);

      expect(result).toEqual(mockPostResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.linkedin.com/v2/assets?action=registerUpload',
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('should handle post creation errors', async () => {
      const mockError = new Error('Post creation failed') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          status: 400,
          code: 'INVALID_REQUEST',
          message: 'Post creation failed'
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        LinkedInAPI.createPost('invalid_token', mockPost)
      ).rejects.toThrow('LinkedIn API Error: Post creation failed');
    });
  });

  describe('schedulePost', () => {
    const mockPost: LinkedInPostOptions = {
      content: 'Scheduled post',
      scheduledAt: new Date('2025-03-01T12:00:00Z'),
      platforms: ['linkedin']
    };

    it('should schedule a post successfully', async () => {
      const mockResponse = {
        data: {
          id: 'scheduled_post_123',
          created: {
            actor: 'urn:li:person:123',
            time: 1614556800000
          },
          lastModified: {
            actor: 'urn:li:person:123',
            time: 1614556800000
          },
          lifecycleState: 'SCHEDULED'
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await LinkedInAPI.schedulePost('access_token', mockPost);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.linkedin.com/v2/ugcPosts',
        expect.objectContaining({
          lifecycleState: 'SCHEDULED',
          scheduledTime: Math.floor(mockPost.scheduledAt.getTime() / 1000)
        }),
        expect.any(Object)
      );
    });

    it('should handle scheduling errors', async () => {
      const mockError = new Error('Post scheduling failed') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          status: 400,
          code: 'INVALID_REQUEST',
          message: 'Post scheduling failed'
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        LinkedInAPI.schedulePost('invalid_token', mockPost)
      ).rejects.toThrow('LinkedIn API Error: Post scheduling failed');
    });

    it('should require scheduledAt for scheduling', async () => {
      const postWithoutSchedule = {
        content: 'Test post',
        platforms: ['linkedin'] as ['linkedin']
      };

      await expect(
        LinkedInAPI.schedulePost('access_token', postWithoutSchedule as LinkedInPostOptions)
      ).rejects.toThrow('Scheduled time is required for scheduling a post');
    });
  });
});
