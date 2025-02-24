import { Request, Response } from 'express';
import { SocialMediaAccountController } from '../../../controllers/social-media/account.controller';
import { prismaMock } from '../../setup/setup';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SocialMediaAccountController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        teamMembers: []
      },
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('connectAccount', () => {
    it('should connect a Twitter account', async () => {
      const accountData = {
        platform: 'twitter',
        code: 'auth_code',
        redirectUri: 'http://localhost:3000/callback'
      };

      mockRequest.body = accountData;

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          access_token: 'mock_token',
          refresh_token: 'mock_refresh',
          account_id: 'twitter123'
        }
      });

      prismaMock.socialMediaAccount.create.mockResolvedValue({
        id: '1',
        platform: 'twitter',
        accountId: 'twitter123',
        userId: '1',
        accessToken: 'encrypted_token',
        refreshToken: 'encrypted_refresh',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await SocialMediaAccountController.connectAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Social media account connected successfully',
          account: expect.objectContaining({
            id: '1',
            platform: 'twitter'
          })
        })
      );
    });

    it('should handle unauthorized requests', async () => {
      const accountData = {
        platform: 'twitter',
        code: 'auth_code',
        redirectUri: 'http://localhost:3000/callback'
      };

      mockRequest.body = accountData;
      mockRequest.user = undefined;

      await SocialMediaAccountController.connectAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not authenticated'
        })
      );
    });
  });
});
