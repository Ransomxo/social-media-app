import { Request, Response, NextFunction } from 'express';
import logger from '../utils/monitoring/logger';
import { QuotaTracker } from '../utils/monitoring/quotaTracker';

export const logRequest = (req: Request, _res: Response, next: NextFunction): void => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    userId: req.user?.id
  });
  next();
};

export const trackApiUsage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const platform = req.body.platform || req.query.platform;

    if (userId && platform) {
      const hasQuota = await QuotaTracker.checkQuota(userId, platform);
      if (!hasQuota) {
        res.status(429).json({
          status: 'error',
          message: 'Daily API quota exceeded'
        });
        return;
      }

      await QuotaTracker.trackApiUsage(userId, platform);
    }
    next();
  } catch (error) {
    next(error);
  }
};
