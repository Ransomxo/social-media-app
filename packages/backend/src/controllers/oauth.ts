import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { OAuthService } from '../services/oauth';
import { SocialPlatform } from '../types/social-media/oauth';
import { ValidationError } from '../utils/errors/AppError';

export const getAuthUrl = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const platform = req.params.platform as SocialPlatform;
    const authUrl = await OAuthService.getAuthorizationUrl(platform);
    res.json({ url: authUrl });
  } catch (error) {
    next(error);
  }
};

export const handleCallback = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not found');
    }

    const platform = req.params.platform as SocialPlatform;
    const code = req.query.code as string;
    
    if (!code) {
      throw new ValidationError('Authorization code is required');
    }

    // TODO: Exchange code for access token using platform-specific OAuth flow
    // For now, we'll just return a success message
    res.json({ message: 'OAuth callback received successfully' });
  } catch (error) {
    next(error);
  }
};

export const listConnections = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not found');
    }

    const connections = await OAuthService.getUserSocialTokens(req.user.id);
    res.json(connections);
  } catch (error) {
    next(error);
  }
};

export const removeConnection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not found');
    }

    const platform = req.params.platform as SocialPlatform;
    await OAuthService.deleteSocialToken(req.user.id, platform);
    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    next(error);
  }
};
