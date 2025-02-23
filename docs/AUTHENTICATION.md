# Authentication System Documentation

## Overview
JWT-based authentication system with comprehensive user context loading and team management support.

## Features
- Bearer token validation
- User context loading with related data
- Team membership validation
- Error handling with detailed responses

## Middleware Flow
1. Token extraction and validation
2. User lookup with related data
3. Context population
4. Error handling

## Usage
```typescript
app.use(authMiddleware);
```

## Error Responses
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: User not found

## User Context
The middleware populates:
- User profile
- Owned teams
- Team memberships
- Associated posts
- Platform connections
