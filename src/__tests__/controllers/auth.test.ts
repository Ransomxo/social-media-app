import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth';
import { prismaMock } from '../setup/setup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockBcryptHash = jest.fn().mockImplementation(() => Promise.resolve('hashedPassword'));
const mockBcryptCompare = jest.fn().mockImplementation(() => Promise.resolve(true));
const mockJwtSign = jest.fn().mockImplementation(() => 'test_token');

(bcrypt.hash as jest.Mock) = mockBcryptHash;
(bcrypt.compare as jest.Mock) = mockBcryptCompare;
(jwt.sign as jest.Mock) = mockJwtSign;

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    mockBcryptHash.mockImplementation(() => Promise.resolve('hashedPassword'));
    mockBcryptCompare.mockImplementation(() => Promise.resolve(true));
    mockJwtSign.mockImplementation(() => 'test_token');
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBcryptHash).toHaveBeenCalledWith('password123', 10);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName
        }
      });
    });

    it('should handle existing email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email already exists'
        })
      );
    });

    it('should handle database errors', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockRejectedValue(new Error('DB Error'));

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBcryptCompare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(mockJwtSign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        'test_secret',
        { expiresIn: '24h' }
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        token: 'test_token'
      });
    });

    it('should handle invalid credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid credentials'
        })
      );
    });

    it('should handle invalid password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      mockBcryptCompare.mockImplementation(() => Promise.resolve(false));

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid credentials'
        })
      );
    });

    it('should handle missing JWT_SECRET', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      delete process.env.JWT_SECRET;
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      mockJwtSign.mockImplementation(() => {
        throw new Error('JWT_SECRET is required');
      });

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
