import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Ensure consistent test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '3001';

// Create a new Prisma client for tests
const prisma = new PrismaClient();

// Clean up database before all tests
beforeAll(async () => {
  try {
    await prisma.$transaction([
      prisma.post.deleteMany(),
      prisma.user.deleteMany()
    ]);
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    // Only clean up posts, keep users for authentication tests
    await prisma.post.deleteMany();
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
});

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Export prisma client for tests
export { prisma };
