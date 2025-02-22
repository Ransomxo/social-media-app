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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth failed: No Bearer token');
      return next(new UnauthorizedError('No Bearer token provided'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Auth failed: Empty token');
      return next(new UnauthorizedError('Empty token provided'));
    }

    const secret = process.env.JWT_SECRET || 'test-secret-key';
    console.log('Using secret:', secret.substring(0, 4) + '...');
    
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log('Token decoded:', { userId: decoded.id });
    
    console.log('Looking up user with id:', decoded.id);
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        plan: true,
        teamMembers: true
      }
    });
    
    if (!user) {
      console.log('Auth failed: User not found:', decoded.id);
      // Try to find any users in the database to verify connection
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true }
      });
      console.log('Current users in database:', allUsers);
      return next(new UnauthorizedError('User not found'));
    }
    
    console.log('Auth successful for user:', user.id);

    req.user = user;
    console.log('Auth successful for user:', user.id);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token'));
    }
    return next(new UnauthorizedError('Authentication failed'));
  }
};
