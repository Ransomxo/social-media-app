import { Request, Response } from 'express';
import { TeamController } from '../../controllers/team.controller';
import { prismaMock } from '../setup/setup';
import { AppError } from '../../utils/errors/AppError';

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
      body: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('createTeam', () => {
    it('should create a new team', async () => {
      const teamData = {
        name: 'Test Team'
      };

      mockRequest.body = teamData;

      prismaMock.team.create.mockResolvedValue({
        id: '1',
        name: teamData.name,
        ownerId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await TeamController.createTeam(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Team created successfully',
          team: expect.objectContaining({
            id: '1',
            name: teamData.name
          })
        })
      );
    });
  });

  describe('addMember', () => {
    it('should add a member to the team', async () => {
      const memberData = {
        userId: '2',
        role: 'editor'
      };

      mockRequest.body = memberData;
      mockRequest.params = { teamId: '1' };

      prismaMock.team.findUnique.mockResolvedValue({
        id: '1',
        name: 'Test Team',
        ownerId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      prismaMock.teamMember.create.mockResolvedValue({
        id: '1',
        teamId: '1',
        userId: '2',
        role: 'editor',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await TeamController.addMember(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Team member added successfully'
        })
      );
    });
  });
});
