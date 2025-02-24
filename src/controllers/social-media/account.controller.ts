import { Request, Response, NextFunction } from 'express';
import { SocialMediaAccountService } from '../../services/social-media/account.service';
import { ConnectAccountRequest } from '../../types/social-media';
import { AppError } from '../../utils/errors/AppError';

export class SocialMediaAccountController {
  static async connectAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const connectRequest: ConnectAccountRequest = {
        platform: req.body.platform,
        code: req.body.code,
        redirectUri: req.body.redirectUri
      };

      await SocialMediaAccountService.connectAccount(userId, connectRequest);
      
      res.status(201).json({
        message: 'Social media account connected successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const accounts = await SocialMediaAccountService.getAccounts(userId);
      
      res.json({
        accounts
      });
    } catch (error) {
      next(error);
    }
  }
}
