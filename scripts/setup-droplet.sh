#!/bin/bash
set -e

echo "Setting up DigitalOcean droplet..."

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
sudo apt-get install -y nginx

# Install Certbot
echo "Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# Create application directory
echo "Setting up application directory..."
mkdir -p /var/www/api.omniposting.com
chown -R $USER:$USER /var/www/api.omniposting.com

# Configure Nginx
echo "Configuring Nginx..."
sudo cp nginx/api.omniposting.com.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/api.omniposting.com.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
echo "Obtaining SSL certificate..."
sudo certbot --nginx -d api.omniposting.com --non-interactive --agree-tos --email rowdyroque8@gmail.com

# Install application dependencies
echo "Installing application dependencies..."
npm ci

# Build application
echo "Building application..."
npm run build

# Start application with PM2
echo "Starting application..."
pm2 start ecosystem.config.js

# Save PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Setup PM2 startup script
echo "Setting up PM2 startup..."
pm2 startup | tail -n 1 | bash

echo "Droplet setup completed successfully"
