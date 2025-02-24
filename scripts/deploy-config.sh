#!/bin/bash
set -e

# Configure Vercel environment variables
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add OPENAI_API_KEY production
vercel env add ENCRYPTION_KEY production

# Configure domain
vercel domains add api.omniposting.com

# Enable logging
vercel env add DEBUG "app:*" production

echo "Deployment configuration completed"
