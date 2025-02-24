#!/bin/bash
set -e

echo "Starting deployment..."

# Load environment variables
set -a
source .env.production
set +a

# Build application
echo "Building application..."
npm run build

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Restart PM2 process
echo "Restarting application..."
pm2 reload ecosystem.config.js --update-env

# Verify application status
echo "Verifying application status..."
pm2 status api

echo "Deployment completed successfully"
