# Database Configuration Guide

## Development Environment
- Uses SQLite for local development
- Connection URL: `file:./dev.db`
- No SSL or connection pooling required
- Automatically created during `prisma migrate dev`

## Production Environment (Neon.tech PostgreSQL)
- Uses PostgreSQL with SSL enabled
- Connection pooling enabled with connection limit of 5
- Connection string format: `postgresql://user:password@host:port/database?sslmode=require&connection_limit=5`
- SSL mode is required for security

### Production Setup Steps
1. Create a Neon.tech PostgreSQL database
2. Configure the following environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&connection_limit=5
   ```
3. Run database migrations:
   ```bash
   NODE_ENV=production npx prisma migrate deploy
   ```

## Testing Environment
- Uses SQLite for testing
- Connection URL: `file:./test.db`
- Isolated database for each test run
- Created and destroyed during test execution

## Database Verification
Run the database verification script:
```bash
# Development
NODE_ENV=development node dist/scripts/verify-db.js

# Production
NODE_ENV=production DATABASE_URL="your-neon-url" node dist/scripts/verify-db.js
```

## Connection Pool Settings
- Development: Default SQLite pool (17 connections)
- Production: Limited to 5 connections per instance
- Connection timeout: 10 seconds

## Security Considerations
- SSL is enforced in production
- Connection strings must never be committed to version control
- Use environment variables for all database credentials
- Regular database backups are automated by Neon.tech
