import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors/AppError';

const prisma = new PrismaClient();

export const checkTeamAccess = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const teamId = req.params.teamId;

      if (!userId || !teamId) {
        throw new AppError('Unauthorized', 401);
      }

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: {
            where: { userId }
          }
        }
      });

      if (!team) {
        throw new AppError('Team not found', 404);
      }

      // Team owner has full access
      if (team.ownerId === userId) {
        return next();
      }

      const member = team.members[0];
      if (!member || !allowedRoles.includes(member.role)) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
