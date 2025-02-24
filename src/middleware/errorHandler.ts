import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';
import logger from '../utils/monitoring/logger';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error('Application error', {
    error: err,
    request: {
      method: req.method,
      path: req.path,
      query: req.query
    }
  });

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
