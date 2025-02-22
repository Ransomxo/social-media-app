import request from 'supertest';
import app from '../../index';
import { prisma } from '../../test/setup';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/User';

describe('Post Scheduling Endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user
    const hashedPassword = await UserModel.hashPassword('password123');
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: `test-post-${Date.now()}@example.com`,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        teamMembers: [],
      },
    });
    userId = user.id;
    authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'test-secret-key', { expiresIn: '1h' });
    console.log('Test token generated:', { userId: user.id });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/posts', () => {
    it('should create a scheduled post', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test post content',
          platforms: ['facebook', 'twitter'],
          scheduledAt: futureDate.toISOString(),
          // userId is handled by auth middleware
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.content).toBe('Test post content');
      expect(res.body.platforms).toEqual(['facebook', 'twitter']);
      expect(res.body.status).toBe('scheduled');
    });

    it('should not create post with past schedule date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test post content',
          platforms: ['facebook'],
          scheduledAt: pastDate.toISOString(),
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/posts/scheduled', () => {
    it('should return scheduled posts', async () => {
      const res = await request(app)
        .get('/api/posts/scheduled')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('content');
        expect(res.body[0]).toHaveProperty('platforms');
        expect(res.body[0]).toHaveProperty('scheduledAt');
      }
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app).get('/api/posts/scheduled');
      expect(res.status).toBe(401);
    });
  });
});
