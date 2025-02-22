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
let testUserData: { id: string; email: string };

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

    // Create a shared test user with a unique email
    const timestamp = Date.now();
    const hashedPassword = await UserModel.hashPassword('password123');
    const user = await prisma.user.create({
      data: {
        email: `test-user-${timestamp}@example.com`,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        teamMembers: [],
      },
    });
    testUserData = { id: user.id, email: user.email };
    testUser = testUserData; // Set the exported testUser
    console.log('Created shared test user:', { id: user.id, email: user.email });
  } catch (error) {
    console.error('Error setting up test environment:', error);
    throw error;
  }
});

// Clean up posts between tests, but keep users
afterEach(async () => {
  try {
    await prisma.post.deleteMany();
    // Log current users for debugging
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });
    console.log('Current users after test:', users);
  } catch (error) {
    console.error('Error cleaning up test data:', error);
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
