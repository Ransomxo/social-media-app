import prisma from '../../lib/prisma';
import { AppError } from '../../utils/errors/AppError';

export class TeamService {
  static async createTeam(name: string, ownerId: string) {
    return prisma.team.create({
      data: {
        name,
        ownerId
      }
    });
  }

  static async addMember(teamId: string, userId: string, role: string, ownerId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    if (team.ownerId !== ownerId) {
      throw new AppError('Not authorized to add team members', 403);
    }

    return prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role
      }
    });
  }
}
