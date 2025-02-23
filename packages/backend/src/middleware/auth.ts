import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';
import { UnauthorizedError } from '../utils/errors/AppError';
import { prisma } from '../lib/prisma';
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No Bearer token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Empty token provided');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret not configured');
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    } catch (e) {
      throw new UnauthorizedError('Invalid token');
    }
    
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      include: {
        ownedTeams: {
          include: {
            members: true
          }
        },
        posts: true,
        memberTeams: {
          include: {
            team: true
          }
        }
      }
    });
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token'));
    }
    return next(error);
  }
};
