import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CreateTeamDto, UpdateTeamDto, InviteTeamMemberDto } from '../types/team';
import { ValidationError, NotFoundError, ForbiddenError, AppError } from '../utils/errors/AppError';
import { AuthRequest } from '../middleware/auth';

export class TeamController {
  static async createTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { name }: CreateTeamDto = req.body;

      if (!name) {
        throw new ValidationError('Team name is required');
      }

      // Check user's plan limits
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { ownedTeams: true }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.plan === 'minimal' && user.ownedTeams.length >= 1) {
        throw new ForbiddenError('Minimal plan users can only create one team');
      }

      const team = await prisma.team.create({
        data: {
          name,
          owner: {
            connect: { id: userId }
          },
          members: {
            create: [{
              user: {
                connect: { id: userId }
              },
              role: 'admin'
            }]
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      res.status(201).json(team);
    } catch (error) {
      next(error);
    }
  }

  static async getTeams(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const teams = await prisma.team.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      res.json(teams);
    } catch (error) {
      next(error);
    }
  }

  static async updateTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const teamId = req.params.teamId;
      const { name }: UpdateTeamDto = req.body;

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: true }
      });

      if (!team) {
        throw new NotFoundError('Team not found');
      }

      if (team.ownerId !== userId) {
        throw new ForbiddenError('Only team owner can update team details');
      }

      const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: { name },
        include: {
          members: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      res.json(updatedTeam);
    } catch (error) {
      next(error);
    }
  }

  static async inviteTeamMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const teamId = req.params.teamId;
      const { email, role = 'member' }: InviteTeamMemberDto = req.body;

      if (!email) {
        throw new ValidationError('Email is required');
      }

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true,
          owner: {
            include: {
              ownedTeams: {
                include: { members: true }
              }
            }
          }
        }
      });

      if (!team) {
        throw new NotFoundError('Team not found');
      }

      if (team.ownerId !== userId) {
        throw new ForbiddenError('Only team owner can invite members');
      }

      // Check plan limits
      if (team.owner.plan === 'minimal' && team.members.length >= 1) {
        throw new ForbiddenError('Minimal plan teams are limited to 1 member');
      }

      if (team.owner.plan === 'team' && team.members.length >= 3) {
        throw new ForbiddenError('Team plan teams are limited to 3 members');
      }

      // Find or create user
      const invitedUser = await prisma.user.findUnique({
        where: { email }
      });

      if (!invitedUser) {
        throw new NotFoundError('User not found');
      }

      // Check if user is already a member
      const existingMember = team.members.find(member => member.userId === invitedUser.id);
      if (existingMember) {
        throw new ValidationError('User is already a team member');
      }

      const teamMember = await prisma.teamMember.create({
        data: {
          userId: invitedUser.id,
          teamId,
          role
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      res.status(201).json(teamMember);
    } catch (error) {
      next(error);
    }
  }

  static async removeTeamMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const teamId = req.params.teamId;
      const memberId = req.params.memberId;

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: true }
      });

      if (!team) {
        throw new NotFoundError('Team not found');
      }

      if (team.ownerId !== userId) {
        throw new ForbiddenError('Only team owner can remove members');
      }

      const member = await prisma.teamMember.findUnique({
        where: { id: memberId }
      });

      if (!member || member.teamId !== teamId) {
        throw new NotFoundError('Team member not found');
      }

      await prisma.teamMember.delete({
        where: { id: memberId }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
