import { Request, Response } from 'express';
import { SocialMediaAccountController } from '../../../controllers/social-media/account.controller';
import { SocialMediaAccountService } from '../../../services/social-media/account.service';

jest.mock('../../../services/social-media/account.service', () => ({
  SocialMediaAccountService: {
    connectAccount: jest.fn()
  }
}));

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
      body: {
        platform: 'twitter',
        authCode: 'test_auth_code',
        redirectUri: 'http://localhost:3000/callback'
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connectAccount', () => {
    it('should connect a Twitter account', async () => {
      const mockAccount = {
        id: '1',
        userId: '1',
        platform: 'twitter',
        accountId: 'twitter123',
        accessToken: 'encrypted_token',
        refreshToken: 'encrypted_refresh_token',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (SocialMediaAccountService.connectAccount as jest.Mock).mockResolvedValueOnce(mockAccount);

      await SocialMediaAccountController.connectAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(SocialMediaAccountService.connectAccount).toHaveBeenCalledWith(
        'twitter',
        'test_auth_code',
        'http://localhost:3000/callback',
        '1'
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Social media account connected successfully',
        data: mockAccount
      });
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      (SocialMediaAccountService.connectAccount as jest.Mock).mockRejectedValueOnce(error);

      await SocialMediaAccountController.connectAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
