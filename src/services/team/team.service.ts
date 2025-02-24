import prisma from '../../lib/prisma';
import { TeamMember } from '@prisma/client';
import { AppError } from '../../utils/errors/AppError';

export class TeamService {
  static async addMember(
    teamId: string,
    userId: string,
    role: string
  ): Promise<TeamMember> {
    try {
      if (!teamId || !userId || !role) {
        throw new AppError('Missing required parameters', 400);
      }

      const existingMember = await prisma.teamMember.findFirst({
        where: {
          teamId,
          userId
        }
      });

      if (existingMember) {
        throw new AppError('User is already a team member', 409);
      }

      return await prisma.teamMember.create({
        data: {
          teamId,
          userId,
          role
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to add team member', 500);
    }
  }
}
