import 'reflect-metadata';
import request from 'supertest';
import { TestDataSource } from '../config/database.test';
import app, { initializeApp } from '../index';
import { User } from '../models/User';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    try {
      await initializeApp();
      const userRepository = TestDataSource.getRepository(User);
      await userRepository.clear();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  beforeEach(async () => {
    const userRepository = TestDataSource.getRepository(User);
    await userRepository.clear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should not register a user with invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
          firstName: '',
          lastName: ''
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const userRepository = TestDataSource.getRepository(User);
      const user = new User();
      Object.assign(user, {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
      await user.hashPassword();
      await userRepository.save(user);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should not login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });
  });
});
