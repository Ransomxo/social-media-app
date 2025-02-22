import { EmailReportConfig, EmailReportTemplate } from '../../types/reports/email';
import { FacebookAnalyticsAPI } from '../analytics/facebook';
import { TwitterAnalyticsAPI } from '../analytics/twitter';
import { InstagramAnalyticsAPI } from '../analytics/instagram';
import { LinkedInAnalyticsAPI } from '../analytics/linkedin';
import { ValidationError } from '../../utils/errors/AppError';

export class ReportGenerator {
import { BaseAnalyticsResponse } from '../../types/social-media/analytics/base';

export class ReportGenerator {
  private static readonly platformAPIs: {
    [key: string]: {
      getAnalytics(
        userId: string,
        accessToken: string,
        startDate?: string,
        endDate?: string
      ): Promise<BaseAnalyticsResponse>;
    };
  } = {
    facebook: FacebookAnalyticsAPI,
    twitter: TwitterAnalyticsAPI,
    instagram: InstagramAnalyticsAPI,
    linkedin: LinkedInAnalyticsAPI
  };

  static async generateReport(
    userId: string,
    accessTokens: { [platform: string]: string },
    config: EmailReportConfig,
    startDate: string,
    endDate: string
  ): Promise<EmailReportTemplate> {
    try {
      const metrics: { [platform: string]: any } = {};

      // Fetch analytics for each configured platform
      for (const platform of config.platforms) {
        if (!this.platformAPIs[platform]) {
          throw new ValidationError(`Unsupported platform: ${platform}`);
        }

        if (!accessTokens[platform]) {
          throw new ValidationError(`Missing access token for platform: ${platform}`);
        }

        const api = this.platformAPIs[platform];
        const analytics = await api.getAnalytics(
          userId,
          accessTokens[platform],
          startDate,
          endDate
        );

        // Filter metrics based on config
        metrics[platform] = {
          profile: this.filterMetrics(analytics.profile, config.metrics.profile),
          posts: analytics.posts.map((post: BaseAnalyticsPost) => ({
            id: post.id,
            created_at: post.created_at,
            metrics: this.filterMetrics(post.metrics, config.metrics.posts)
          }))
        };
      }

      // Generate email template
      return {
        subject: this.generateSubject(config.frequency, startDate, endDate),
        body: this.generateBody(metrics, config),
        data: {
          period: {
            start: startDate,
            end: endDate
          },
          metrics
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw new ValidationError('Failed to generate report');
    }
  }

  private static filterMetrics(data: any, allowedMetrics: string[]): { [key: string]: number } {
    return Object.keys(data)
      .filter(key => allowedMetrics.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {} as { [key: string]: number });
  }

  private static generateSubject(
    frequency: 'daily' | 'weekly',
    startDate: string,
    endDate: string
  ): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (frequency === 'daily') {
      return `Social Media Analytics Report for ${start.toLocaleDateString()}`;
    }

    return `Weekly Social Media Analytics Report (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`;
  }

  private static generateBody(
    metrics: { [platform: string]: any },
    config: EmailReportConfig
  ): string {
    let body = `Social Media Analytics Report\n\n`;

    for (const platform of config.platforms) {
      body += `${platform.toUpperCase()}\n`;
      body += `==========\n\n`;

      // Profile metrics
      body += `Profile Metrics:\n`;
      for (const metric of config.metrics.profile) {
        body += `${metric}: ${metrics[platform].profile[metric]}\n`;
      }
      body += '\n';

      // Post metrics
      body += `Recent Posts:\n`;
      for (const post of metrics[platform].posts) {
        body += `Post (${new Date(post.created_at).toLocaleDateString()}):\n`;
        for (const metric of config.metrics.posts) {
          body += `  ${metric}: ${post.metrics[metric]}\n`;
        }
        body += '\n';
      }

      body += '\n';
    }

    return body;
  }
}
