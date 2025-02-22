import { Response } from 'express';
import { TeamController } from './team';
import { prisma } from '../lib/prisma';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors/AppError';
import { AuthRequest } from '../middleware/auth';

describe('TeamController', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownedTeams: [],
        memberOfTeams: [],
        posts: [],
        socialTokens: []
      },
      params: {},
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('createTeam', () => {
    it('should create a team successfully', async () => {
      mockRequest.body = { name: 'Test Team' };
      const mockTeam = {
        id: 'test-team-id',
        name: 'Test Team',
        ownerId: 'test-user-id',
        members: []
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        ...mockRequest.user,
        ownedTeams: []
      } as any);
      jest.spyOn(prisma.team, 'create').mockResolvedValue(mockTeam as any);

      await TeamController.createTeam(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTeam);
    });

    it('should throw error if team name is missing', async () => {
      mockRequest.body = {};

      await TeamController.createTeam(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(ValidationError)
      );
    });

    it('should throw error if minimal plan user tries to create second team', async () => {
      mockRequest.body = { name: 'Test Team' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        ...mockRequest.user,
        ownedTeams: [{ id: 'existing-team' }]
      } as any);

      await TeamController.createTeam(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(ForbiddenError)
      );
    });
  });

  describe('inviteTeamMember', () => {
    const mockTeam = {
      id: 'test-team-id',
      ownerId: 'test-user-id',
      members: [],
      owner: {
        plan: 'team',
        ownedTeams: []
      }
    };

    beforeEach(() => {
      mockRequest.params = { teamId: 'test-team-id' };
      mockRequest.body = {
        email: 'member@example.com',
        role: 'member'
      };
    });

    it('should invite team member successfully', async () => {
      const mockInvitedUser = {
        id: 'invited-user-id',
        email: 'member@example.com'
      };
      const mockTeamMember = {
        id: 'team-member-id',
        userId: 'invited-user-id',
        teamId: 'test-team-id',
        role: 'member'
      };

      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(mockTeam as any);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockInvitedUser as any);
      jest.spyOn(prisma.teamMember, 'create').mockResolvedValue(mockTeamMember as any);

      await TeamController.inviteTeamMember(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTeamMember);
    });

    it('should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);

      await TeamController.inviteTeamMember(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(NotFoundError)
      );
    });

    it('should throw error if user is not team owner', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue({
        ...mockTeam,
        ownerId: 'different-user-id'
      } as any);

      await TeamController.inviteTeamMember(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(ForbiddenError)
      );
    });
  });
});
