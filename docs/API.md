# API Documentation

## Authentication
### POST /api/auth/login
Login with email and password.

### POST /api/auth/register
Register a new user account.

## Social Media Integration
### GET /api/social-media-data
Get analytics data from connected platforms.

### POST /api/generate-caption
Generate AI-powered captions.

### POST /api/schedule-post
Schedule posts across platforms.

## Team Management
### POST /api/team/add
Add members to a team.

### GET /api/team/{id}
Get team details and members.

## Analytics
### GET /api/analytics/{platform}
Get platform-specific analytics.

Parameters:
- startDate (optional): Start date for analytics period
- endDate (optional): End date for analytics period

Supported platforms:
- facebook
- twitter
- instagram
- linkedin

## Error Responses
All endpoints return standardized error responses:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
