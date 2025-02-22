import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';
import { UnauthorizedError } from '../utils/errors/AppError';
import prisma from '../lib/prisma';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as JwtPayload;
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw error;
    }
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};
