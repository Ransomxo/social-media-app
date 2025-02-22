import { OAuthConfig, SocialPlatform } from '../types/social-media/oauth';

const baseRedirectUri = process.env.OAUTH_REDIRECT_BASE_URL || 'http://localhost:3000/api/oauth';

export const oauthConfigs: Record<SocialPlatform, OAuthConfig> = {
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirectUri: `${baseRedirectUri}/facebook/callback`,
    scope: ['pages_manage_posts', 'pages_read_engagement']
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
    redirectUri: `${baseRedirectUri}/twitter/callback`,
    scope: ['tweet.read', 'tweet.write', 'users.read']
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    redirectUri: `${baseRedirectUri}/instagram/callback`,
    scope: ['instagram_basic', 'instagram_content_publish']
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: `${baseRedirectUri}/linkedin/callback`,
    scope: ['w_member_social', 'r_liteprofile']
  }
};
