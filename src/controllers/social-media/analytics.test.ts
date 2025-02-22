import request from 'supertest';
import app from '../../index';
import prisma from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/User';

describe('Social Media Analytics Endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const hashedPassword = await UserModel.hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        teamMembers: [],
      },
    });
    userId = user.id;
    authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('GET /api/social-media/data', () => {
    it('should return analytics data for authenticated user', async () => {
      const res = await request(app)
        .get('/api/social-media/data')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty('platform');
      expect(res.body.data[0]).toHaveProperty('metrics');
      expect(res.body).toHaveProperty('timestamp');
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app).get('/api/social-media/data');
      expect(res.status).toBe(401);
    });
  });
});
