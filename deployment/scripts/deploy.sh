#!/bin/bash

# Pull latest changes
cd /root/social-media-app
git pull

# Install dependencies
pnpm install

# Rebuild applications
cd packages/frontend && pnpm build
cd ../backend && pnpm build

# Restart services
pm2 restart all
