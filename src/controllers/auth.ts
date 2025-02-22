import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { ValidationError, UnauthorizedError } from '../utils/errors/AppError';
import { validate } from 'class-validator';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const user = new User();
    Object.assign(user, { email, password, firstName, lastName });

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new ValidationError('Invalid input data');
    }

    await user.hashPassword();
    await userRepository.save(user);

    const token = jwt.sign({ id: user.id } as JwtPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

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
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id } as JwtPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

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
