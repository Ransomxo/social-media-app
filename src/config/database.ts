import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'ep-royal-queen-a5munids-pooler.us-east-2.aws.neon.tech',
  port: 5432,
  username: 'neondb_owner',
  password: 'npg_RZIM5o6xFIhC',
  database: 'neondb',
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});
