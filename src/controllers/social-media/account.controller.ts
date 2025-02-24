import { Request, Response, NextFunction } from 'express';
import { SocialMediaAccountService } from '../../services/social-media/account.service';
import { AppError } from '../../utils/errors/AppError';

export class SocialMediaAccountController {
  static async connectAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { platform, code, redirectUri } = req.body;
      const userId = req.user?.id;

      const account = await SocialMediaAccountService.connectAccount(
        platform,
        code,
        redirectUri,
        userId
      );

      res.status(201).json({
        message: 'Social media account connected successfully',
        account
      });
    } catch (error) {
      next(new AppError('Failed to connect social media account', 500));
    }
  }
}
