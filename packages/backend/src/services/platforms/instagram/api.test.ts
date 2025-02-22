import { InstagramAPI } from './api';
import axios from 'axios';
import { AppError, ValidationError } from '../../../utils/errors/AppError';
import { InstagramPostOptions } from '../../../types/social-media/instagram';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InstagramAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for access token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'mock_access_token',
          token_type: 'bearer',
          expires_in: 3600,
          user_id: '12345'
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await InstagramAPI.exchangeCodeForToken(
        'test_code',
        'http://localhost:3000/callback',
        'client_id',
        'client_secret'
      );

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.instagram.com/oauth/access_token',
        expect.any(URLSearchParams),
        expect.any(Object)
      );
    });

    it('should handle Instagram API errors', async () => {
      const mockError = new Error('Invalid OAuth code') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          error: {
            error_type: 'OAuthException',
            code: 400,
            message: 'Invalid OAuth code'
          }
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        InstagramAPI.exchangeCodeForToken(
          'invalid_code',
          'http://localhost:3000/callback',
          'client_id',
          'client_secret'
        )
      ).rejects.toThrow('Instagram API Error: Invalid OAuth code');
    });
  });

  describe('createPost', () => {
    const mockPost: InstagramPostOptions = {
      content: 'Test post',
      scheduledAt: new Date('2025-03-01T12:00:00Z'),
      platforms: ['instagram'],
      media: {
        media_type: 'IMAGE',
        media_url: 'https://example.com/image.jpg'
      }
    };

    it('should create a post successfully', async () => {
      const mockMediaResponse = {
        data: {
          id: 'media_123'
        }
      };
      const mockPublishResponse = {
        data: {
          id: 'post_123',
          status_code: 'PUBLISHED'
        }
      };
      mockedAxios.post
        .mockResolvedValueOnce(mockMediaResponse)
        .mockResolvedValueOnce(mockPublishResponse);

      const result = await InstagramAPI.createPost('access_token', mockPost);

      expect(result).toEqual(mockPublishResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://graph.instagram.com/v18.0/me/media',
        {
          image_url: mockPost.media.media_url,
          caption: mockPost.content,
          access_token: 'access_token'
        }
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://graph.instagram.com/v18.0/me/media_publish',
        {
          creation_id: 'media_123',
          access_token: 'access_token'
        }
      );
    });

    it('should handle post creation errors', async () => {
      const mockError = new Error('Post creation failed') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          error: {
            error_type: 'APIError',
            code: 400,
            message: 'Post creation failed'
          }
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        InstagramAPI.createPost('invalid_token', mockPost)
      ).rejects.toThrow('Instagram API Error: Post creation failed');
    });
  });

  describe('schedulePost', () => {
    const mockPost: InstagramPostOptions = {
      content: 'Scheduled post',
      scheduledAt: new Date('2025-03-01T12:00:00Z'),
      platforms: ['instagram'],
      media: {
        media_type: 'IMAGE',
        media_url: 'https://example.com/image.jpg'
      }
    };

    it('should schedule a post successfully', async () => {
      const mockResponse = {
        data: {
          id: 'scheduled_post_123',
          status_code: 'SCHEDULED'
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await InstagramAPI.schedulePost('access_token', mockPost);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://graph.instagram.com/v18.0/me/media',
        {
          image_url: mockPost.media.media_url,
          caption: mockPost.content,
          access_token: 'access_token',
          published: false,
          scheduled_publish_time: Math.floor(mockPost.scheduledAt.getTime() / 1000)
        }
      );
    });

    it('should handle scheduling errors', async () => {
      const mockError = new Error('Post scheduling failed') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          error: {
            error_type: 'APIError',
            code: 400,
            message: 'Post scheduling failed'
          }
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        InstagramAPI.schedulePost('invalid_token', mockPost)
      ).rejects.toThrow('Instagram API Error: Post scheduling failed');
    });

    it('should require scheduledAt for scheduling', async () => {
      const postWithoutSchedule = {
        content: 'Test post',
        platforms: ['instagram'] as ['instagram'],
        media: {
          media_type: 'IMAGE' as const,
          media_url: 'https://example.com/image.jpg'
        }
      };

      await expect(
        InstagramAPI.schedulePost('access_token', postWithoutSchedule as InstagramPostOptions)
      ).rejects.toThrow('Scheduled time is required for scheduling a post');
    });
  });
});
