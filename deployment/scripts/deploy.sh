#!/bin/bash

# Pull latest changes
cd /root/social-media-app
git pull

# Install dependencies
pnpm install

# Build applications
cd packages/frontend
pnpm build
pm2 restart frontend

# Update nginx configuration if needed
systemctl reload nginx

# Verify deployment
echo "Deployment completed. Changes are live at https://omniposting.com"
