import { Request, Response } from 'express';
import { CaptionController } from '../../../controllers/ai/caption.controller';
import { OpenAIService } from '../../../services/ai/openai.service';

jest.mock('../../../services/ai/openai.service');

describe('CaptionController', () => {
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
  });

  describe('generateCaption', () => {
    it('should generate a caption', async () => {
      const captionRequest = {
        content: 'Test content',
        platform: 'twitter',
        tone: 'professional',
        length: 'medium'
      };

      mockRequest.body = captionRequest;

      const generatedCaption = 'Generated test caption #test';
      (OpenAIService.generateCaption as jest.Mock).mockResolvedValue(generatedCaption);

      await CaptionController.generateCaption(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        caption: generatedCaption
      });
    });
  });
});
