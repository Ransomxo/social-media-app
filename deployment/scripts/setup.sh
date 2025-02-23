#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install pnpm
npm install -g pnpm@9.15.1

# Install nginx
apt-get install -y nginx

# Install PostgreSQL client
apt-get install -y postgresql-client

# Copy nginx configuration
cp /root/deployment/nginx/nginx.conf /etc/nginx/nginx.conf
systemctl restart nginx

# Setup application
cd /root/social-media-app
pnpm install

# Setup PM2 for process management
npm install -g pm2

# Start services
pm2 start "cd packages/frontend && pnpm dev" --name frontend
pm2 start "cd packages/backend && pnpm dev" --name backend
pm2 save

# Setup PM2 to start on boot
pm2 startup
