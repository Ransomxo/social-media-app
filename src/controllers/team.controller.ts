import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../services/team/team.service';
import { AppError } from '../utils/errors/AppError';

export class TeamController {
  static async addTeamMember(
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

      res.status(201).json({
        success: true,
        data: teamMember
      });
    } catch (error) {
      next(error);
    }
  }
}
