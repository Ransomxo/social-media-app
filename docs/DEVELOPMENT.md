# Development Guide

## Project Structure
```
packages/
  ├── backend/         # Express.js + TypeScript backend
  │   ├── src/
  │   │   ├── controllers/  # Request handlers
  │   │   ├── middleware/   # Express middleware
  │   │   ├── services/     # Business logic
  │   │   └── types/       # TypeScript definitions
  │   └── prisma/      # Database schema
  └── frontend/        # Next.js frontend
      └── src/        # React components and pages
```

## Setup Requirements
- Node.js 18+
- pnpm 8+
- PostgreSQL (via Neon.tech)

## Development Setup
1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Add required environment variables
```

3. Start development servers:
```bash
# Frontend
pnpm --filter frontend dev

# Backend
pnpm --filter backend dev
```

## Testing
```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter backend test
pnpm --filter frontend test
```

## Type Checking
```bash
pnpm typecheck
```

## Deployment
- Frontend: Vercel (omniposting.com)
- Backend: Custom deployment
- Database: Neon.tech PostgreSQL

## Environment Variables
### Backend
- `DATABASE_URL`: Neon.tech PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Server port (default: 3000)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_URL`: Frontend URL

## Social Media Platform Integration
Each platform requires specific API credentials:
- Facebook: App ID, App Secret
- Twitter: API Key, API Secret
- Instagram: App ID, App Secret
- LinkedIn: Client ID, Client Secret
