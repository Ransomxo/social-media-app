import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../../lib/prisma';

// Mock external modules
jest.mock('axios');
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}));

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token')
}));

beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  mockReset(prismaMock);
});

describe('Test Setup', () => {
  it('should properly mock Prisma', () => {
    expect(prismaMock).toBeDefined();
  });
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
