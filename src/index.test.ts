import request from 'supertest';
import { Response } from 'supertest';
import app from './index';

describe('API Endpoints', () => {
  it('should return welcome message', async () => {
    const res: Response = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Welcome to the Social Media Analytics API');
  });
});
