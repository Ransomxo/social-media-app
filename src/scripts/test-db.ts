import { PrismaClient } from '@prisma/client';
import logger from '../utils/monitoring/logger';

const prisma = new PrismaClient();

async function testConnection(): Promise<void> {
  try {
    // Test basic connection
    await prisma.$connect();
    logger.info('Database connection successful');

    // Test SSL
    const sslMode = await prisma.$queryRaw`SHOW ssl`;
    logger.info('SSL Mode:', { sslMode });

    // Test connection pooling
    const poolInfo = await prisma.$queryRaw`
      SELECT count(*) as connections 
      FROM pg_stat_activity 
      WHERE application_name LIKE '%prisma%'
    `;
    logger.info('Connection pool info:', { poolInfo });

    // Test schema access
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    logger.info('Available tables:', { tables });

  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
