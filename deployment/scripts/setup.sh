#!/bin/bash

# Exit on any error
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install pnpm
npm install -g pnpm@9.15.1

# Install PM2
npm install -g pm2

# Install nginx
apt-get install -y nginx

# Clone repository if not exists
if [ ! -d "/root/social-media-app" ]; then
  cd /root
  git clone https://github.com/Ransomxo/social-media-app.git
fi

# Setup application
cd /root/social-media-app
pnpm install

# Setup PM2 for process management
pm2 start "cd packages/frontend && pnpm dev" --name frontend
pm2 save

# Setup PM2 to start on boot
pm2 startup
