# Deployment Guide

## Overview
The application is deployed on Vercel with the following components:
- Backend API: api.omniposting.com
- Database: Neon.tech PostgreSQL
- Infrastructure access: rowdyroque8@gmail.com

## Prerequisites
1. Vercel CLI installed
2. Access to Neon.tech dashboard
3. Environment variables configured

## Environment Variables
Required environment variables:
```
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
ENCRYPTION_KEY=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
```

## Deployment Steps

### 1. Database Setup
1. Create Neon.tech database
2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### 2. Vercel Deployment
1. Configure project:
   ```bash
   vercel link
   vercel env pull
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### 3. Domain Configuration
1. Configure custom domain api.omniposting.com
2. Set up SSL certificates
3. Configure CORS for frontend domain

### 4. Monitoring Setup
1. Enable Vercel Analytics
2. Configure error tracking
3. Set up performance monitoring

## Error Codes

### Authentication (400-499)
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - Insufficient permissions
- 409: Conflict - Resource already exists

### Server Errors (500-599)
- 500: Internal Server Error
- 503: Service Unavailable - External API down

## Rollback Procedure
1. Identify failing deployment
2. Revert to last working version:
   ```bash
   vercel rollback
   ```
3. Verify database consistency
