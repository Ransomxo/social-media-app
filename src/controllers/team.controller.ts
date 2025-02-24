import { Request, Response, NextFunction } from 'express';
import { TeamService, CreateTeamRequest, AddMemberRequest } from '../services/team/team.service';
import { AppError } from '../utils/errors/AppError';

export class TeamController {
  static async createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const request: CreateTeamRequest = {
        name: req.body.name,
        ownerId: userId
      };

      const team = await TeamService.createTeam(request);
      
      res.status(201).json({
        message: 'Team created successfully',
        team
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const request: AddMemberRequest = {
        userId: req.body.userId,
        teamId: req.params.teamId,
        role: req.body.role
      };

      const member = await TeamService.addMember(request);
      
      res.status(201).json({
        message: 'Team member added successfully',
        member
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      await TeamService.removeMember(req.params.teamId, req.params.userId);
      
      res.json({
        message: 'Team member removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMemberRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      await TeamService.updateMemberRole(req.params.teamId, req.params.userId, req.body.role);
      
      res.json({
        message: 'Member role updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTeamMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const members = await TeamService.getTeamMembers(req.params.teamId);
      
      res.json({
        members
      });
    } catch (error) {
      next(error);
    }
  }
}
