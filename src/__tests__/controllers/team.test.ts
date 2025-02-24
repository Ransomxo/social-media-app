import { Request, Response } from 'express';
import { TeamController } from '../../controllers/team.controller';
import { prismaMock } from '../setup/setup';

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
        teamMembers: []
      },
      body: {
        userId: '2',
        role: 'member'
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

      prismaMock.teamMember.create.mockResolvedValue(mockTeamMember);

      await TeamController.addTeamMember(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTeamMember
      });
    });
  });
});
