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
    // Clean up any existing test users
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-user-'
        }
      }
    });

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

// Clean up posts between tests, but keep test user
afterEach(async () => {
  try {
    await prisma.post.deleteMany();
    // Verify test user still exists
    const user = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { id: true, email: true }
    });
    if (!user) {
      console.error('Test user not found after test, recreating...');
      const hashedPassword = await UserModel.hashPassword('password123');
      const newUser = await prisma.user.create({
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
      console.log('Recreated test user:', { id: newUser.id, email: newUser.email });
    }
  } catch (error) {
    console.error('Error in afterEach:', error);
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
