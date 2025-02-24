#!/bin/bash
# Update PM2 configuration for frontend service
pm2 delete frontend || true
pm2 start "cd /root/social-media-app/packages/frontend && pnpm start" --name frontend --watch
pm2 save
