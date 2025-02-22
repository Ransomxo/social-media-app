import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CreateTeamDto, UpdateTeamDto, InviteTeamMemberDto } from '../types/team';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors/AppError';
import { AuthRequest } from '../middleware/auth';
import { Prisma } from '@prisma/client';

export class TeamController {
  static async createTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { name }: CreateTeamDto = req.body;

      if (!name) {
        const error = new ValidationError('Team name is required');
        next(error);
        return;
      }

      // Check user's plan limits
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          teams: true,
          teamMembers: true
        }
      });

      if (!user) {
        next(new NotFoundError('User not found'));
        return;
      }

      if (user.plan === 'minimal' && user.teams.length >= 1) {
        const error = new ForbiddenError('Minimal plan users can only create one team');
        next(error);
        return;
      }

      const team = await prisma.team.create({
        data: {
          name,
          ownerId: userId,
          members: {
            create: [{
              userId: userId,
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
        next(new NotFoundError('Team not found'));
        return;
      }

      if (team.ownerId !== userId) {
        next(new ForbiddenError('Only team owner can update team details'));
        return;
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
        next(new ValidationError('Email is required'));
        return;
      }

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true,
          owner: {
            include: {
              teams: {
                include: { members: true }
              }
            }
          }
        }
      });

      if (!team) {
        next(new NotFoundError('Team not found'));
        return;
      }

      if (team.ownerId !== userId) {
        const error = new ForbiddenError('Only team owner can invite members');
        next(error);
        return;
      }

      // Check plan limits
      if (team.owner.plan === 'minimal' && team.members.length >= 1) {
        next(new ForbiddenError('Minimal plan teams are limited to 1 member'));
        return;
      }

      if (team.owner.plan === 'team' && team.members.length >= 3) {
        next(new ForbiddenError('Team plan teams are limited to 3 members'));
        return;
      }

      // Find or create user
      const invitedUser = await prisma.user.findUnique({
        where: { email }
      });

      if (!invitedUser) {
        next(new NotFoundError('User not found'));
        return;
      }

      // Check if user is already a member
      const existingMember = team.members.find((member: { userId: string }) => member.userId === invitedUser.id);
      if (existingMember) {
        next(new ValidationError('User is already a team member'));
        return;
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
        next(new NotFoundError('Team not found'));
        return;
      }

      if (team.ownerId !== userId) {
        next(new ForbiddenError('Only team owner can remove members'));
        return;
      }

      const member = await prisma.teamMember.findUnique({
        where: { id: memberId }
      });

      if (!member || member.teamId !== teamId) {
        next(new NotFoundError('Team member not found'));
        return;
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
