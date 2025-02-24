#!/bin/bash

# Build script for frontend deployment
npm install
npm run build

# Copy build files to nginx directory
sudo cp -r .next/standalone/* /var/www/omniposting.com/
sudo cp -r public/* /var/www/omniposting.com/public/
sudo systemctl restart nginx
