import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../services/team/team.service';
import { AppError } from '../utils/errors/AppError';

export class TeamController {
  static async createTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const team = await TeamService.createTeam(name, userId);

      res.status(201).json({
        message: 'Team created successfully',
        team
      });
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
      const { teamId } = req.params;
      const { userId: memberId, role } = req.body;
      const ownerId = req.user?.id;

      if (!ownerId) {
        throw new AppError('User not authenticated', 401);
      }

      const member = await TeamService.addMember(teamId, memberId, role, ownerId);

      res.status(201).json({
        message: 'Team member added successfully',
        member
      });
    } catch (error) {
      next(error);
    }
  }
}
