import { Request, Response } from 'express';
import { AnalyticsController } from '../../controllers/analytics.controller';
import { prismaMock } from '../setup/setup';

describe('AnalyticsController', () => {
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
        createdAt: new Date(),
  updatedAt: new Date()
      },
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('getAnalytics', () => {
    it('should return analytics data for all platforms', async () => {
      const mockPosts = [
        {
          id: '1',
          platform: 'twitter',
          userId: '1',
          content: 'Test post',
          status: 'published',
          scheduledFor: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      prismaMock.socialMediaPost.findMany.mockResolvedValue(mockPosts);

      await AnalyticsController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockPosts
      });
    });

    it('should filter by platform', async () => {
      mockRequest.query = { platform: 'twitter' };

      await AnalyticsController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prismaMock.socialMediaPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            platform: 'twitter'
          })
        })
      );
    });

    it('should filter by date range', async () => {
      const startDate = '2025-01-01';
      const endDate = '2025-02-01';
      mockRequest.query = { startDate, endDate };

      await AnalyticsController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prismaMock.socialMediaPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        })
      );
    });

    it('should handle unauthorized requests', async () => {
      mockRequest.user = undefined;

      await AnalyticsController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not authenticated',
          statusCode: 401
        })
      );
    });
  });
});
