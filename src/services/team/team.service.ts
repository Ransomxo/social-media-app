import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/errors/AppError';

const prisma = new PrismaClient();

export interface CreateTeamRequest {
  name: string;
  ownerId: string;
}

export interface AddMemberRequest {
  userId: string;
  teamId: string;
  role: 'admin' | 'editor' | 'viewer';
}

export class TeamService {
  static async createTeam(request: CreateTeamRequest) {
    const { name, ownerId } = request;

    const existingTeam = await prisma.team.findFirst({
      where: {
        name,
        ownerId
      }
    });

    if (existingTeam) {
      throw new AppError('Team with this name already exists', 400);
    }

    return prisma.team.create({
      data: {
        name,
        ownerId
      }
    });
  }

  static async addMember(request: AddMemberRequest) {
    const { userId, teamId, role } = request;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true
      }
    });

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const existingMember = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId
      }
    });

    if (existingMember) {
      throw new AppError('User is already a member of this team', 400);
    }

    return prisma.teamMember.create({
      data: {
        userId,
        teamId,
        role
      }
    });
  }

  static async removeMember(teamId: string, userId: string) {
    const member = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId
      }
    });

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    return prisma.teamMember.delete({
      where: {
        id: member.id
      }
    });
  }

  static async updateMemberRole(teamId: string, userId: string, role: string) {
    const member = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId
      }
    });

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    return prisma.teamMember.update({
      where: {
        id: member.id
      },
      data: {
        role
      }
    });
  }

  static async getTeamMembers(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    return team.members;
  }
}
