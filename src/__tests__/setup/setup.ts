import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import prisma from '../../lib/prisma';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}));

// Setup MSW
export const server = setupServer(...handlers);

beforeAll(() => {
  // Enable API mocking
  server.listen();
});

afterEach(() => {
  // Reset handlers
  server.resetHandlers();
  // Reset Prisma mock
  mockReset(prismaMock);
});

afterAll(() => {
  // Clean up
  server.close();
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
