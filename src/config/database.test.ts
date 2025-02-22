import { DataSource } from 'typeorm';
import { User } from '../models/User';

export const TestDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_RZlM5o6xFIhC@ep-royal-queen-a5munids-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  synchronize: true,
  logging: false,
  entities: ['src/models/**/*.ts'],
  dropSchema: true
});
