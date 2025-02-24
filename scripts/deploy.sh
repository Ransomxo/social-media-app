#!/bin/bash
set -e

echo "Deploying to Vercel..."

# Ensure we're on the correct branch
git checkout devin/1740361034-backend-implementation

# Run the build script
./scripts/build.sh

# Deploy to Vercel
npm run deploy

echo "Deployment completed successfully"
