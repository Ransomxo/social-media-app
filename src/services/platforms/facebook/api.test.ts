import { FacebookGraphAPI } from './api';
import axios from 'axios';
import { ValidationError } from '../../../utils/errors/AppError';
import { Platform } from '../../../services/post';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FacebookGraphAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for access token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'mock_access_token',
          token_type: 'bearer',
          expires_in: 3600
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await FacebookGraphAPI.exchangeCodeForToken(
        'test_code',
        'http://localhost:3000/callback',
        'client_id',
        'client_secret'
      );

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://graph.facebook.com/v18.0/oauth/access_token',
        {
          params: {
            client_id: 'client_id',
            client_secret: 'client_secret',
            redirect_uri: 'http://localhost:3000/callback',
            code: 'test_code'
          }
        }
      );
    });

    it('should handle Facebook API errors', async () => {
      const mockError = {
        response: {
          data: {
            error: {
              message: 'Invalid OAuth code',
              type: 'OAuthException',
              code: 190,
              fbtrace_id: 'mock_trace_id'
            }
          }
        }
      };
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(async () => {
        await FacebookGraphAPI.exchangeCodeForToken(
          'invalid_code',
          'http://localhost:3000/callback',
          'client_id',
          'client_secret'
        );
      }).rejects.toThrow('Facebook API Error: Invalid OAuth code');
    });
  });

  describe('createPost', () => {
    const mockPost = {
      content: 'Test post',
      scheduledAt: new Date('2025-03-01T12:00:00Z'),
      media: 'https://example.com/image.jpg',
      platforms: ['facebook' as Platform]
    };

    it('should create a post successfully', async () => {
      const mockResponse = {
        data: {
          id: 'post_123',
          created_time: '2025-02-22T00:00:00+0000'
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await FacebookGraphAPI.createPost('page_123', 'access_token', mockPost);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://graph.facebook.com/v18.0/page_123/feed',
        {
          message: mockPost.content,
          access_token: 'access_token',
          url: mockPost.media,
          scheduled_publish_time: Math.floor(mockPost.scheduledAt.getTime() / 1000)
        }
      );
    });

    it('should handle post creation errors', async () => {
      const mockError = {
        response: {
          data: {
            error: {
              message: 'Invalid page access token',
              type: 'OAuthException',
              code: 190,
              fbtrace_id: 'mock_trace_id'
            }
          }
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(async () => {
        await FacebookGraphAPI.createPost('page_123', 'invalid_token', mockPost);
      }).rejects.toThrow('Facebook API Error: Invalid page access token');
    });
  });

  describe('getPageAccessToken', () => {
    it('should get page access token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'page_access_token'
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await FacebookGraphAPI.getPageAccessToken('user_token', 'page_123');

      expect(result).toBe('page_access_token');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://graph.facebook.com/v18.0/page_123',
        {
          params: {
            fields: 'access_token',
            access_token: 'user_token'
          }
        }
      );
    });

    it('should handle page token fetch errors', async () => {
      const mockError = {
        response: {
          data: {
            error: {
              message: 'Invalid user access token',
              type: 'OAuthException',
              code: 190,
              fbtrace_id: 'mock_trace_id'
            }
          }
        }
      };
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(async () => {
        await FacebookGraphAPI.getPageAccessToken('invalid_token', 'page_123');
      }).rejects.toThrow('Facebook API Error: Invalid user access token');
    });
  });
});
