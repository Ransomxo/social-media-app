import { PrismaClient } from '@prisma/client';
import logger from '../utils/monitoring/logger';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function verifyDatabase(): Promise<void> {
  try {
    logger.info('Testing database connection...');
    await prisma.$connect();
    logger.info('Database connection successful');

    // Test basic query
    const userCount = await prisma.user.count();
    logger.info('Current user count:', { userCount });

    // Get database info based on environment
    if (process.env.DATABASE_URL?.startsWith('postgresql://')) {
      // PostgreSQL specific checks
      const dbInfo = await prisma.$queryRaw`SELECT version()`;
      logger.info('Database info:', { dbInfo });

      const connInfo = await prisma.$queryRaw`
        SELECT current_database(), current_user, inet_server_addr(), inet_server_port()
      `;
      logger.info('Connection info:', { connInfo });
    } else {
      // SQLite specific checks
      const dbInfo = await prisma.$queryRaw`SELECT sqlite_version()`;
      logger.info('Database info:', { dbInfo });
    }

    // Test transaction
    const result = await prisma.$transaction(async (tx) => {
      const testUser = await tx.user.create({
        data: {
          email: 'test@example.com',
          password: 'test-password',
          firstName: 'Test',
          lastName: 'User',
          plan: 'minimal'
        }
      });
      await tx.user.delete({ where: { id: testUser.id } });
      return 'Transaction successful';
    });
    logger.info('Transaction test:', { result });

  } catch (error) {
    logger.error('Database verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
