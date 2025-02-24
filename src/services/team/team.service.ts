import prisma from '../../lib/prisma';
import { Team, TeamMember } from '@prisma/client';
import { AppError } from '../../utils/errors/AppError';

export class TeamService {
  static async createTeam(name: string, ownerId: string): Promise<Team> {
    return prisma.team.create({
      data: {
        name,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'admin'
          }
        }
      }
    });
  }

  static async addMember(
    teamId: string,
    userId: string,
    role: string
  ): Promise<TeamMember> {
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });

    if (!team) {
      throw new AppError('Team not found', 404);
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
