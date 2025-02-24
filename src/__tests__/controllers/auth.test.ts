import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { register, login } from '../../controllers/auth';
import { prismaMock } from '../setup/setup';
import { ValidationError, UnauthorizedError } from '../../utils/errors/AppError';

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('register', () => {
    it('should create a new user and return token', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      mockRequest.body = userData;

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: '1',
        email: userData.email,
        password: 'hashedPassword',
        firstName: userData.firstName,
        lastName: userData.lastName,
        plan: 'minimal',
        teamMembers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully',
          token: expect.any(String)
        })
      );
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      mockRequest.body = userData;

      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        teamMembers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login successful',
          token: expect.any(String)
        })
      );
    });
  });
});
