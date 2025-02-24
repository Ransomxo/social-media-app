#!/bin/bash
set -e

echo "Starting deployment..."

# Run build script
./scripts/build.sh

# Deploy to Vercel
vercel --prod

echo "Deployment completed successfully"
