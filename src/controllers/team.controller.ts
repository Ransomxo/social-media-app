import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../services/team/team.service';
import { AppError } from '../utils/errors/AppError';
import { AppError } from '../utils/errors/AppError';

export class TeamController {
  static async createTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.body;
      const ownerId = req.user?.id;

      if (!name || !ownerId) {
        throw new AppError('Missing required fields', 400);
      }

      const team = await TeamService.createTeam(name, ownerId);
      res.status(201).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, role } = req.body;
      const teamId = req.params.teamId;

      if (!teamId || !userId || !role) {
        throw new AppError('Missing required fields', 400);
      }

      const teamMember = await TeamService.addMember(teamId, userId, role);
      res.status(201).json({ success: true, data: teamMember });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { teamId, userId } = req.params;
      await TeamService.removeMember(teamId, userId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async updateMemberRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { teamId, userId } = req.params;
      const { role } = req.body;

      if (!role) {
        throw new AppError('Role is required', 400);
      }

      const teamMember = await TeamService.updateMemberRole(teamId, userId, role);
      res.json({ success: true, data: teamMember });
    } catch (error) {
      next(error);
    }
  }

  static async getTeamMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { teamId } = req.params;
      const members = await TeamService.getTeamMembers(teamId);
      res.json({ success: true, data: members });
    } catch (error) {
      next(error);
    }
  }
}
