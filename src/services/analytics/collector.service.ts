import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../utils/errors/AppError';
import { EncryptionService } from '../../utils/encryption';
import { collectTwitterMetrics } from './platforms/twitter';
import { collectInstagramMetrics } from './platforms/instagram';
import { EmailService, EmailReport } from '../email/report.service';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export interface AnalyticsMetrics {
  impressions: number;
  engagements: number;
  clicks: number;
  shares: number;
  likes: number;
  comments: number;
  reach: number;
}

export interface ReportOptions {
  frequency: 'daily' | 'weekly';
  metrics: (keyof AnalyticsMetrics)[];
  email: string;
}

interface PlatformSummary {
  posts: number;
  metrics: Record<keyof AnalyticsMetrics, number>;
}

interface AnalyticsData {
  createdAt: Date;
  metrics: Prisma.JsonValue;
  socialAccount: { platform: string };
  post: { id: string };
}

export class AnalyticsCollectorService {
  static async collectAnalytics(): Promise<void> {
    const posts = await prisma.post.findMany({
      where: {
        status: 'posted',
        analytics: null
      },
      include: {
        socialAccount: true
      }
    });

    for (const post of posts) {
      try {
        const accessToken = EncryptionService.decrypt(post.socialAccount.accessToken);
        const metrics = await this.collectPlatformMetrics(
          post.socialAccount.platform,
          post.id,
          accessToken
        );

        const metricsJson: Prisma.JsonObject = {
          impressions: metrics.impressions,
          engagements: metrics.engagements,
          clicks: metrics.clicks,
          shares: metrics.shares,
          likes: metrics.likes,
          comments: metrics.comments,
          reach: metrics.reach
        };

        await prisma.analytics.create({
          data: {
            postId: post.id,
            socialAccountId: post.socialAccount.id,
            metrics: metricsJson,
            period: 'daily',
            startDate: new Date(),
            endDate: new Date()
          }
        });
      } catch (error) {
        console.error(`Failed to collect metrics for post ${post.id}:`, error);
      }
    }
  }

  static async generateReport(userId: string, options: ReportOptions): Promise<void> {
    const analytics = await prisma.analytics.findMany({
      where: {
        socialAccount: {
          userId
        },
        createdAt: {
          gte: options.frequency === 'daily'
            ? new Date(Date.now() - 24 * 60 * 60 * 1000)
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        createdAt: true,
        metrics: true,
        socialAccount: {
          select: {
            platform: true
          }
        },
        post: {
          select: {
            id: true
          }
        }
      }
    });

    if (!analytics.length) {
      throw new AppError('No analytics data found for the specified period', 404);
    }

    const processedAnalytics = analytics.map(a => ({
      createdAt: a.createdAt,
      metrics: a.metrics as Record<keyof AnalyticsMetrics, number>,
      socialAccount: a.socialAccount,
      post: a.post
    }));

    const reportContent = this.generateReportContent(processedAnalytics, options.metrics);
    const csvContent = this.generateCSVReport(processedAnalytics, options.metrics);

    const report: EmailReport = {
      to: options.email,
      subject: `Social Media Analytics Report - ${format(new Date(), 'yyyy-MM-dd')}`,
      content: reportContent,
      attachments: [{
        filename: `analytics_report_${format(new Date(), 'yyyy-MM-dd')}.csv`,
        content: csvContent
      }]
    };

    await EmailService.sendReport(report);
  }

  private static async collectPlatformMetrics(
    platform: string,
    postId: string,
    accessToken: string
  ): Promise<AnalyticsMetrics> {
    switch (platform) {
      case 'twitter':
        return collectTwitterMetrics(postId, accessToken);
      case 'instagram':
        return collectInstagramMetrics(postId, accessToken);
      default:
        throw new AppError(`Unsupported platform: ${platform}`, 400);
    }
  }

  private static generateReportContent(
    analytics: Array<{
      metrics: Record<keyof AnalyticsMetrics, number>;
      socialAccount: { platform: string };
    }>,
    metrics: (keyof AnalyticsMetrics)[]
  ): string {
    const platformSummary = analytics.reduce<Record<string, PlatformSummary>>((acc, a) => {
      const platform = a.socialAccount.platform;
      if (!acc[platform]) {
        acc[platform] = {
          posts: 0,
          metrics: {
            impressions: 0,
            engagements: 0,
            clicks: 0,
            shares: 0,
            likes: 0,
            comments: 0,
            reach: 0
          }
        };
      }
      acc[platform].posts++;
      metrics.forEach(m => {
        acc[platform].metrics[m] += a.metrics[m] || 0;
      });
      return acc;
    }, {});

    return `
      <h1>Social Media Analytics Report</h1>
      <p>Period: ${format(new Date(), 'yyyy-MM-dd')}</p>
      ${Object.entries(platformSummary).map(([platform, data]) => `
        <h2>${platform} Summary</h2>
        <p>Total Posts: ${data.posts}</p>
        <ul>
          ${metrics.map(metric => `
            <li>${metric}: ${data.metrics[metric]}</li>
          `).join('')}
        </ul>
      `).join('')}
    `;
  }

  private static generateCSVReport(
    analytics: Array<{
      createdAt: Date;
      metrics: Record<keyof AnalyticsMetrics, number>;
      socialAccount: { platform: string };
      post: { id: string };
    }>,
    metrics: (keyof AnalyticsMetrics)[]
  ): string {
    const headers = ['Date', 'Platform', 'Post ID', ...metrics];
    const rows = analytics.map(a => [
      format(a.createdAt, 'yyyy-MM-dd'),
      a.socialAccount.platform,
      a.post.id,
      ...metrics.map(m => a.metrics[m] || 0)
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }
}
