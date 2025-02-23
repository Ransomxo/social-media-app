import request from 'supertest';
import app from '../../index';
import { prisma, testUser } from '../../test/setup';
import jwt from 'jsonwebtoken';

describe('Social Media Analytics Endpoints', () => {
  let authToken: string;

  beforeEach(async () => {
    // Token is generated after test user is created in global beforeEach
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be set for tests');
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Test token generated:', { userId: testUser.id });
  });

  afterAll(async () => {
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
