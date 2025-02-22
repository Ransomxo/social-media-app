import { DataSource } from 'typeorm';
import { User } from '../models/User';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'ep-royal-queen-a5munids-pooler.us-east-2.aws.neon.tech',
  port: 5432,
  username: 'neondb_owner',
  password: 'npg_RZIM5o6xFIhC',
  database: 'neondb',
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: true,
  logging: false,
  entities: [User],
  dropSchema: true
});
