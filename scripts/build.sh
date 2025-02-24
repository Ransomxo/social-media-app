#!/bin/bash
set -e

echo "Building application..."
npm ci
npm run build

echo "Checking database migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Build completed successfully"
