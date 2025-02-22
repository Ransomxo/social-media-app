import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { UserModel } from '../models/User';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Ensure consistent test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '3001';

// Create a new Prisma client for tests with debug logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Create shared test user
let testUser: { id: string; email: string };

// Initialize test environment
beforeAll(async () => {
  try {
    // Clean up existing data
    await prisma.$transaction([
      prisma.post.deleteMany(),
      prisma.user.deleteMany()
    ]);

    // Verify database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection test:', dbTest);

    // Create initial test user with unique email
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const hashedPassword = await UserModel.hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: `test-user-${timestamp}-${randomId}@example.com`,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        teamMembers: [],
      },
    });
    testUser = { id: user.id, email: user.email };
    console.log('Created shared test user:', { id: user.id, email: user.email });
  } catch (error) {
    console.error('Error setting up test environment:', error);
    throw error;
  }
});

// Clean up posts between tests, but keep test user
afterEach(async () => {
  try {
    await prisma.post.deleteMany();
  } catch (error) {
    console.error('Error cleaning up posts:', error);
  }
});

// Ensure test user exists before each test
beforeEach(async () => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { id: true, email: true }
    });
    if (!user) {
      console.log('Recreating test user before test...');
      const hashedPassword = await UserModel.hashPassword('password123');
      await prisma.user.create({
        data: {
          id: testUser.id,
          email: testUser.email,
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'User',
          plan: 'minimal',
          teamMembers: [],
        },
      });
    }
  } catch (error) {
    console.error('Error ensuring test user exists:', error);
    throw error;
  }
});

// Export test user for use in tests
export { testUser };

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Export prisma client for tests
export { prisma };
