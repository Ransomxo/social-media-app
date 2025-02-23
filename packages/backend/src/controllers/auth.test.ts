import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { register, login } from './auth';
import { UserModel } from '../models/User';

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../models/User', () => ({
  UserModel: {
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  },
}));

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockRequest.body = userData;
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        ...userData,
        password: hashedPassword,
        plan: 'minimal',
      };

      (UserModel.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully',
          token: expect.any(String),
          user: expect.objectContaining({
            id: createdUser.id,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            plan: createdUser.plan,
          }),
        })
      );
    });

    // Add more register tests...
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockRequest.body = userData;
      const user = {
        id: '1',
        ...userData,
        firstName: 'John',
        lastName: 'Doe',
        plan: 'minimal',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (UserModel.validatePassword as jest.Mock).mockResolvedValue(true);

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login successful',
          token: expect.any(String),
          user: expect.objectContaining({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            plan: user.plan,
          }),
        })
      );
    });

    // Add more login tests...
  });
});
