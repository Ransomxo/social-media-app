import { ReportGenerator } from './generator';
import { EmailReportConfig } from '../../types/reports/email';
import { FacebookAnalyticsAPI } from '../analytics/facebook';
import { TwitterAnalyticsAPI } from '../analytics/twitter';
import { InstagramAnalyticsAPI } from '../analytics/instagram';
import { LinkedInAnalyticsAPI } from '../analytics/linkedin';
import { ValidationError } from '../../utils/errors/AppError';

jest.mock('../analytics/facebook');
jest.mock('../analytics/twitter');
jest.mock('../analytics/instagram');
jest.mock('../analytics/linkedin');

describe('ReportGenerator', () => {
  const mockUserId = '123456789';
  const mockAccessTokens = {
    facebook: 'facebook_token',
    twitter: 'twitter_token',
    instagram: 'instagram_token',
    linkedin: 'linkedin_token'
  };

  const mockConfig: EmailReportConfig = {
    frequency: 'daily',
    platforms: ['facebook', 'twitter'],
    metrics: {
      profile: ['followers', 'engagement_rate'],
      posts: ['impressions', 'likes']
    },
    recipients: ['user@example.com'],
    timeZone: 'UTC',
    sendTime: '09:00'
  };

  const mockStartDate = '2025-01-01';
  const mockEndDate = '2025-01-02';

  const mockAnalyticsResponse = {
    profile: {
      followers: 1000,
      engagement_rate: 2.5,
      posts: 50
    },
    posts: [
      {
        id: 'post1',
        created_at: '2025-01-01T12:00:00Z',
        metrics: {
          impressions: 500,
          likes: 50,
          shares: 10
        }
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (FacebookAnalyticsAPI.getAnalytics as jest.Mock).mockResolvedValue(mockAnalyticsResponse);
    (TwitterAnalyticsAPI.getAnalytics as jest.Mock).mockResolvedValue(mockAnalyticsResponse);
  });

  describe('generateReport', () => {
    it('should generate a report successfully', async () => {
      const report = await ReportGenerator.generateReport(
        mockUserId,
        mockAccessTokens,
        mockConfig,
        mockStartDate,
        mockEndDate
      );

      expect(report).toHaveProperty('subject');
      expect(report).toHaveProperty('body');
      expect(report).toHaveProperty('data');

      expect(report.data.metrics).toHaveProperty('facebook');
      expect(report.data.metrics).toHaveProperty('twitter');

      // Verify filtered metrics
      expect(report.data.metrics.facebook.profile).toHaveProperty('followers');
      expect(report.data.metrics.facebook.profile).toHaveProperty('engagement_rate');
      expect(report.data.metrics.facebook.profile).not.toHaveProperty('posts');

      expect(report.data.metrics.facebook.posts[0].metrics).toHaveProperty('impressions');
      expect(report.data.metrics.facebook.posts[0].metrics).toHaveProperty('likes');
      expect(report.data.metrics.facebook.posts[0].metrics).not.toHaveProperty('shares');
    });

    it('should handle unsupported platforms', async () => {
      const invalidConfig = {
        ...mockConfig,
        platforms: ['invalid_platform']
      };

      await expect(
        ReportGenerator.generateReport(
          mockUserId,
          mockAccessTokens,
          invalidConfig,
          mockStartDate,
          mockEndDate
        )
      ).rejects.toThrow('Unsupported platform: invalid_platform');
    });

    it('should handle missing access tokens', async () => {
      const incompleteTokens = {
        facebook: 'facebook_token'
      };

      await expect(
        ReportGenerator.generateReport(
          mockUserId,
          incompleteTokens,
          mockConfig,
          mockStartDate,
          mockEndDate
        )
      ).rejects.toThrow('Missing access token for platform: twitter');
    });

    it('should generate correct subject for daily report', async () => {
      const report = await ReportGenerator.generateReport(
        mockUserId,
        mockAccessTokens,
        mockConfig,
        mockStartDate,
        mockEndDate
      );

      expect(report.subject).toContain('Social Media Analytics Report for');
    });

    it('should generate correct subject for weekly report', async () => {
      const weeklyConfig = {
        ...mockConfig,
        frequency: 'weekly'
      };

      const report = await ReportGenerator.generateReport(
        mockUserId,
        mockAccessTokens,
        weeklyConfig as EmailReportConfig,
        mockStartDate,
        mockEndDate
      );

      expect(report.subject).toContain('Weekly Social Media Analytics Report');
    });
  });
});
