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

      const team = await TeamService.createTeam(name, userId);

      res.status(201).json({
        message: 'Team created successfully',
        team
      });
    } catch (error) {
      next(new AppError('Failed to create team', 500));
    }
  }

  static async addMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { teamId } = req.params;
      const { userId, role } = req.body;
      const ownerId = req.user?.id;

      const member = await TeamService.addMember(teamId, userId, role, ownerId);

      res.status(201).json({
        message: 'Team member added successfully',
        member
      });
    } catch (error) {
      next(new AppError('Failed to add team member', 500));
    }
  }
}
