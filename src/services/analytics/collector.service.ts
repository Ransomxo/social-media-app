import { PrismaClient } from '@prisma/client';
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

        await prisma.analytics.create({
          data: {
            postId: post.id,
            socialAccountId: post.socialAccount.id,
            metrics: metrics as unknown as Record<string, unknown>,
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        socialAccounts: {
          include: {
            posts: {
              include: {
                analytics: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const startDate = options.frequency === 'daily' 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const analytics = await prisma.analytics.findMany({
      where: {
        socialAccount: {
          userId: user.id
        },
        createdAt: {
          gte: startDate
        }
      },
      include: {
        post: true,
        socialAccount: true
      }
    });

    const reportContent = this.generateReportContent(analytics, options.metrics);
    const csvContent = this.generateCSVReport(analytics, options.metrics);

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

  private static generateReportContent(analytics: any[], metrics: (keyof AnalyticsMetrics)[]): string {
    const platformSummary = analytics.reduce((acc, a) => {
      const platform = a.socialAccount.platform;
      if (!acc[platform]) {
        acc[platform] = {
          posts: 0,
          metrics: Object.fromEntries(metrics.map(m => [m, 0]))
        };
      }
      acc[platform].posts++;
      metrics.forEach(m => {
        acc[platform].metrics[m] += (a.metrics as AnalyticsMetrics)[m] || 0;
      });
      return acc;
    }, {} as Record<string, { posts: number; metrics: Record<string, number> }>);

    return `
      <h1>Social Media Analytics Report</h1>
      <p>Period: ${format(new Date(), 'yyyy-MM-dd')}</p>
      ${Object.entries(platformSummary).map(([platform, data]) => `
        <h2>${platform} Summary</h2>
        <p>Total Posts: ${data.posts}</p>
        <ul>
          ${Object.entries(data.metrics).map(([metric, value]) => `
            <li>${metric}: ${value}</li>
          `).join('')}
        </ul>
      `).join('')}
    `;
  }

  private static generateCSVReport(analytics: any[], metrics: (keyof AnalyticsMetrics)[]): string {
    const headers = ['Date', 'Platform', 'Post ID', ...metrics];
    const rows = analytics.map(a => [
      format(a.createdAt, 'yyyy-MM-dd'),
      a.socialAccount.platform,
      a.post.id,
      ...metrics.map(m => (a.metrics as AnalyticsMetrics)[m] || 0)
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }
}
