import { Request, Response, NextFunction } from 'express';
import { SocialMediaAccountService } from '../../services/social-media/account.service';

export class SocialMediaAccountController {
  static async connectAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { platform, authCode, redirectUri } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const account = await SocialMediaAccountService.connectAccount(
        platform,
        authCode,
        redirectUri,
        userId
      );

      res.status(201).json({
        success: true,
        message: 'Social media account connected successfully',
        data: account
      });
    } catch (error) {
      next(error);
    }
  }
}
