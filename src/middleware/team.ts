import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';
import prisma from '../lib/prisma';

export const checkTeamPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const teamId = req.params.teamId || req.body.teamId;

    if (!userId || !teamId) {
      throw new AppError('Unauthorized', 401);
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
        role: 'admin'
      }
    });

    if (!teamMember) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
