import prisma from '../../lib/prisma';
import { Team, TeamMember } from '@prisma/client';
import { AppError } from '../../utils/errors/AppError';

export class TeamService {
  static async createTeam(name: string, ownerId: string): Promise<Team> {
    try {
      return await prisma.team.create({
        data: {
          name,
          ownerId
        }
      });
    } catch (error) {
      throw new AppError('Failed to create team', 500);
    }
  }

  static async addMember(teamId: string, userId: string, role: string): Promise<TeamMember> {
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

  static async removeMember(teamId: string, userId: string): Promise<void> {
    try {
      await prisma.teamMember.delete({
        where: {
          id: (await prisma.teamMember.findFirst({
            where: { teamId, userId }
          }))?.id
        }
      });
    } catch (error) {
      throw new AppError('Failed to remove team member', 500);
    }
  }

  static async updateMemberRole(teamId: string, userId: string, role: string): Promise<TeamMember> {
    try {
      const member = await prisma.teamMember.findFirst({
        where: { teamId, userId }
      });
      
      if (!member) {
        throw new AppError('Team member not found', 404);
      }

      return await prisma.teamMember.update({
        where: { id: member.id },
        data: { role }
      });
    } catch (error) {
      throw new AppError('Failed to update member role', 500);
    }
  }

  static async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      return await prisma.teamMember.findMany({
        where: { teamId }
      });
    } catch (error) {
      throw new AppError('Failed to get team members', 500);
    }
  }
}
