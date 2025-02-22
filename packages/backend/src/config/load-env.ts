import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before any other imports
const envPath =
  process.env.NODE_ENV === 'test'
    ? path.resolve(__dirname, '../../.env.test')
    : path.resolve(__dirname, '../../.env');

const result = dotenv.config({ path: envPath });

if (result.error) {
  throw new Error(
    `Failed to load environment variables: ${result.error.message}`,
  );
}
