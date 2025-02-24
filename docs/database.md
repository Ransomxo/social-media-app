# Database Schema Documentation

## Overview
The application uses PostgreSQL (via Neon.tech) for production and SQLite for testing. All database interactions are managed through Prisma ORM.

## Models

### User
- **Purpose**: Stores user account information
- **Fields**:
  - `id`: UUID, Primary Key
  - `email`: String, Unique
  - `password`: String (hashed)
  - `firstName`: String
  - `lastName`: String
  - `plan`: String (default: 'minimal')
  - `teamMembers`: JSON array
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

### SocialMediaAccount
- **Purpose**: Manages connected social media platform accounts
- **Fields**:
  - `id`: UUID, Primary Key
  - `platform`: String
  - `accountId`: String
  - `userId`: UUID, Foreign Key
  - `accessToken`: String (encrypted)
  - `refreshToken`: String (encrypted, optional)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Indexes**:
  - Unique compound index on (platform, accountId)

### Team
- **Purpose**: Manages team organization
- **Fields**:
  - `id`: UUID, Primary Key
  - `name`: String
  - `ownerId`: UUID, Foreign Key
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

### TeamMember
- **Purpose**: Manages team membership and roles
- **Fields**:
  - `id`: UUID, Primary Key
  - `teamId`: UUID, Foreign Key
  - `userId`: UUID, Foreign Key
  - `role`: String
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Indexes**:
  - Unique compound index on (teamId, userId)

## Security
- Sensitive data (tokens, API keys) is encrypted using AES-256-GCM
- Passwords are hashed using bcrypt
- Database access is restricted by IP and requires SSL

## Migrations
- Production migrations are managed through Prisma
- Test migrations use SQLite in-memory database
