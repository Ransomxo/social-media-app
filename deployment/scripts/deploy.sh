#!/bin/bash

# Exit on any error
set -e

# Pull latest changes
cd /root/social-media-app
git pull

# Install dependencies
pnpm install

# Build frontend
cd packages/frontend
pnpm install
pnpm build

# Restart services
pm2 restart frontend

# Reload nginx
systemctl reload nginx
