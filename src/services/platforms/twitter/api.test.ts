import { TwitterAPI } from './api';
import axios from 'axios';
import { AppError, ValidationError } from '../../../utils/errors/AppError';
import { TwitterPostOptions } from '../../../types/social-media/twitter';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TwitterAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for access token successfully', async () => {
      const mockResponse = {
        data: {
          access_token: 'mock_access_token',
          token_type: 'bearer',
          expires_in: 7200,
          scope: 'tweet.read tweet.write users.read'
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await TwitterAPI.exchangeCodeForToken(
        'test_code',
        'http://localhost:3000/callback',
        'client_id',
        'client_secret'
      );

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.twitter.com/2/oauth2/token',
        expect.any(URLSearchParams),
        expect.any(Object)
      );
    });

    it('should handle Twitter API errors', async () => {
      const mockError = new Error('Invalid OAuth code') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          errors: [{
            type: 'invalid_request',
            title: 'Invalid Request',
            detail: 'Invalid OAuth code',
            status: 400
          }]
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        TwitterAPI.exchangeCodeForToken(
          'invalid_code',
          'http://localhost:3000/callback',
          'client_id',
          'client_secret'
        )
      ).rejects.toThrow('Twitter API Error: Invalid OAuth code');
    });
  });

  describe('createPost', () => {
    const mockPost: TwitterPostOptions = {
      content: 'Test tweet',
      scheduledAt: new Date('2025-03-01T12:00:00Z'),
      media: 'https://example.com/image.jpg',
      platforms: ['twitter']
    };

    it('should create a tweet successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'tweet_123',
            text: 'Test tweet'
          }
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await TwitterAPI.createPost('access_token', mockPost);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.twitter.com/2/tweets',
        { text: mockPost.content },
        expect.any(Object)
      );
    });

    it('should handle tweet creation errors', async () => {
      const mockError = new Error('Tweet creation failed') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          errors: [{
            type: 'invalid_request',
            title: 'Invalid Request',
            detail: 'Tweet creation failed',
            status: 400
          }]
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        TwitterAPI.createPost('invalid_token', mockPost)
      ).rejects.toThrow('Twitter API Error: Tweet creation failed');
    });
  });

  describe('schedulePost', () => {
    const mockPost: TwitterPostOptions = {
      content: 'Scheduled tweet',
      scheduledAt: new Date('2025-03-01T12:00:00Z'),
      platforms: ['twitter']
    };

    it('should schedule a tweet successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'scheduled_tweet_123',
            text: 'Scheduled tweet'
          }
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await TwitterAPI.schedulePost('access_token', mockPost);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.twitter.com/2/tweets/scheduled',
        expect.objectContaining({
          text: mockPost.content,
          scheduled_time: mockPost.scheduledAt.toISOString()
        }),
        expect.any(Object)
      );
    });

    it('should handle scheduling errors', async () => {
      const mockError = new Error('Tweet scheduling failed') as any;
      mockError.isAxiosError = true;
      mockError.response = {
        data: {
          errors: [{
            type: 'invalid_request',
            title: 'Invalid Request',
            detail: 'Tweet scheduling failed',
            status: 400
          }]
        }
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        TwitterAPI.schedulePost('invalid_token', mockPost)
      ).rejects.toThrow('Twitter API Error: Tweet scheduling failed');
    });

    it('should require scheduledAt for scheduling', async () => {
      const postWithoutSchedule: Partial<TwitterPostOptions> = {
        content: 'Test tweet',
        platforms: ['twitter']
      };

      await expect(
        TwitterAPI.schedulePost('access_token', postWithoutSchedule)
      ).rejects.toThrow('Scheduled time is required for scheduling a tweet');
    });
  });
});
