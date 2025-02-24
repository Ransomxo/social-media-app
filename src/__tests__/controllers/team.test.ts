import { Request, Response } from 'express';
import { TeamController } from '../../controllers/team.controller';
import { TeamService } from '../../services/team/team.service';
import { prismaMock } from '../setup/setup';

jest.mock('../../services/team/team.service');

describe('TeamController', () => {
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
      body: {
        userId: '2',
        role: 'member'
      },
      params: {
        teamId: '1'
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('addTeamMember', () => {
    it('should add a team member', async () => {
      const mockTeamMember = {
        id: '1',
        teamId: '1',
        userId: '2',
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (TeamService.addMember as jest.Mock).mockResolvedValue(mockTeamMember);

      await TeamController.addMember(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(TeamService.addMember).toHaveBeenCalledWith('1', '2', 'member');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTeamMember
      });
    });

    it('should handle missing fields', async () => {
      mockRequest.params = {};
      
      await TeamController.addMember(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      (TeamService.addMember as jest.Mock).mockRejectedValue(error);

      await TeamController.addMember(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
