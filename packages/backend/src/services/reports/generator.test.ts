import { ReportGenerator } from './generator';
import { FacebookAnalyticsService } from '../analytics/facebook';
import { LinkedInAnalyticsService } from '../analytics/linkedin';
import { TwitterAnalyticsService } from '../analytics/twitter';
import { InstagramAnalyticsService } from '../analytics/instagram';

describe('ReportGenerator', () => {
  let generator: ReportGenerator;
  let facebookService: FacebookAnalyticsService;
  let linkedinService: LinkedInAnalyticsService;
  let twitterService: TwitterAnalyticsService;
  let instagramService: InstagramAnalyticsService;

  beforeEach(() => {
    facebookService = new FacebookAnalyticsService();
    linkedinService = new LinkedInAnalyticsService();
    twitterService = new TwitterAnalyticsService();
    instagramService = new InstagramAnalyticsService();

    // Mock implementations
    jest.spyOn(facebookService, 'getAnalytics').mockResolvedValue({} as any);
    jest.spyOn(linkedinService, 'getAnalytics').mockResolvedValue({} as any);
    jest.spyOn(twitterService, 'getAnalytics').mockResolvedValue({} as any);
    jest.spyOn(instagramService, 'getAnalytics').mockResolvedValue({} as any);
    
    generator = new ReportGenerator({
      facebook: facebookService,
      linkedin: linkedinService,
      twitter: twitterService,
      instagram: instagramService
    });
  });

  it('should generate a combined analytics report', async () => {
    const report = await generator.generateReport('2024-01-01', '2024-01-31');
    expect(report).toBeDefined();
    expect(report.facebook).toBeDefined();
    expect(report.linkedin).toBeDefined();
    expect(report.twitter).toBeDefined();
    expect(report.instagram).toBeDefined();
  });
});
