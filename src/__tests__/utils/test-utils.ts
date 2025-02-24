import { Request, Response } from 'express';
import { User } from '@prisma/client';

export const createMockRequest = (overrides?: Partial<Request>): Partial<Request> => ({
  body: {},
  params: {},
  query: {},
  ...overrides
});

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@example.com',
  password: 'hashedPassword',
  firstName: 'Test',
  lastName: 'User',
  plan: 'minimal',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});
