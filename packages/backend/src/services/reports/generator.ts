import { FacebookAnalyticsService } from '../analytics/facebook';
import { InstagramAnalyticsService } from '../analytics/instagram';
import { LinkedInAnalyticsService } from '../analytics/linkedin';
import { TwitterAnalyticsService } from '../analytics/twitter';

interface Services {
  facebook: FacebookAnalyticsService;
  instagram: InstagramAnalyticsService;
  linkedin: LinkedInAnalyticsService;
  twitter: TwitterAnalyticsService;
}

export class ReportGenerator {
  constructor(private readonly services: Services) {}

  async generateReport(startDate: string, endDate: string) {
    const [facebook, instagram, linkedin, twitter] = await Promise.all([
      this.services.facebook.getAnalytics(startDate, endDate),
      this.services.instagram.getAnalytics(startDate, endDate),
      this.services.linkedin.getAnalytics(startDate, endDate),
      this.services.twitter.getAnalytics(startDate, endDate),
    ]);

    return {
      facebook,
      instagram,
      linkedin,
      twitter,
    };
  }
}
