# Deployment Guide

## Frontend Deployment (Vercel)

### Environment Variables
Required environment variables for frontend deployment:
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., https://api.omniposting.com)
- `NEXT_PUBLIC_APP_URL`: Frontend URL (e.g., https://omniposting.com)
- `DATABASE_URL`: Neon.tech PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation

### Vercel Configuration
The frontend is configured for deployment on Vercel with the following settings:
- Framework: Next.js
- Build Command: `npm install && npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Domain Configuration
The application is configured to deploy to:
- Production: omniposting.com
- Preview: frontend-[hash]-ransomxo-[id].vercel.app

### Build Settings
- Node.js Version: >=18.0.0
- Package Manager: npm
- Environment: Production, Preview, Development

### Deployment Steps
1. Configure environment variables in Vercel dashboard
2. Connect repository to Vercel project
3. Deploy using Vercel CLI or automatic deployments
4. Verify deployment and domain configuration

## Database (Neon.tech)
- PostgreSQL Version: 17
- Region: AWS US East (Ohio)
- Connection Pooling: Enabled
- SSL Mode: Required

## Backend API
- Deployment: Custom deployment
- Environment: Production
- Base URL: https://api.omniposting.com
