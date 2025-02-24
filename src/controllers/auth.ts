import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JwtPayload } from '../types/jwt';
import prisma from '../lib/prisma';
import { ValidationError, UnauthorizedError } from '../utils/errors/AppError';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const validatePassword = async (hashedPassword: string, password: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new ValidationError('Invalid email format');
    }
    if (!password || password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    if (!firstName || !lastName) {
      throw new ValidationError('First name and last name are required');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        plan: 'minimal',
        teamMembers: [],
      },
    });

    const token = jwt.sign({ id: user.id } as JwtPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION || '24h'
    } as SignOptions);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await validatePassword(user.password, password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id } as JwtPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION || '24h'
    } as SignOptions);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan,
      },
    });
  } catch (error) {
    next(error);
  }
};
