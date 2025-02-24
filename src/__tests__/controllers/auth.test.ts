import { Request, Response } from 'express';
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
        ...userData,
        password: 'hashedPassword',
        plan: 'minimal',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully',
          token: expect.any(String),
          user: expect.objectContaining({
            id: '1',
            email: userData.email
          })
        })
      );
    });

    it('should return error for invalid email', async () => {
      mockRequest.body = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(ValidationError)
      );
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockRequest.body = userData;

      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
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

    it('should return error for invalid credentials', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(UnauthorizedError)
      );
    });
  });
});
