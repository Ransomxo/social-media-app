# Analytics Services Documentation

## Overview
The analytics system provides unified access to metrics across multiple social media platforms while maintaining platform-specific features.

## Supported Platforms
- Facebook
- Twitter
- Instagram
- LinkedIn

## Common Features
All analytics services provide:
- Profile metrics
- Post performance data
- Engagement tracking
- Period-based filtering

## Platform-Specific Features

### Facebook
```typescript
interface FacebookMetrics {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
}
```

### Twitter
```typescript
interface TwitterMetrics {
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
}
```

### Instagram
```typescript
interface InstagramMetrics {
  likes: number;
  comments: number;
  saves: number;
  reach: number;
}
```

### LinkedIn
```typescript
interface LinkedInMetrics {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  unique_visitors: number;
}
```

## Error Handling
Each service implements platform-specific error handling:
- Facebook: Graph API errors
- Twitter: API v2 errors
- Instagram: Graph API errors
- LinkedIn: REST API errors

## Usage Example
```typescript
const analytics = new FacebookAnalyticsService();
const data = await analytics.getAnalytics(
  userId,
  accessToken,
  startDate,
  endDate
);
```
