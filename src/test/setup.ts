import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Ensure JWT secret is set for tests
process.env.JWT_SECRET = 'test-secret-key';

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
    await prisma.$transaction([
      prisma.post.deleteMany(),
      prisma.user.deleteMany()
    ]);
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
