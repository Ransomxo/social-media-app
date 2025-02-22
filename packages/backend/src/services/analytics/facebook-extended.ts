import axios from 'axios';
import { ValidationError } from '../../utils/errors/AppError';
import {
  FacebookExtendedAnalyticsResponse,
  FacebookDemographics,
  FacebookContentPerformance,
  FacebookAudienceInsights
} from '../../types/social-media/analytics/facebook-extended';
import { FacebookAnalyticsAPI } from './facebook';

const FACEBOOK_API_VERSION = 'v18.0';
const FACEBOOK_API_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

export class FacebookExtendedAnalyticsAPI extends FacebookAnalyticsAPI {
  private static async getDemographics(
    pageId: string,
    accessToken: string
  ): Promise<FacebookDemographics> {
    try {
      const [ageGender, location, language] = await Promise.all([
        axios.get(`${FACEBOOK_API_URL}/${pageId}/insights`, {
          params: {
            access_token: accessToken,
            metric: 'page_fans_gender_age',
            period: 'lifetime'
          }
        }),
        axios.get(`${FACEBOOK_API_URL}/${pageId}/insights`, {
          params: {
            access_token: accessToken,
            metric: 'page_fans_country,page_fans_city',
            period: 'lifetime'
          }
        }),
        axios.get(`${FACEBOOK_API_URL}/${pageId}/insights`, {
          params: {
            access_token: accessToken,
            metric: 'page_fans_locale',
            period: 'lifetime'
          }
        })
      ]);

      return {
        age_gender: this.processAgeGenderData(ageGender.data),
        location: this.processLocationData(location.data),
        language: this.processLanguageData(language.data)
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static async getContentPerformance(
    pageId: string,
    accessToken: string,
    since: string,
    until: string
  ): Promise<FacebookContentPerformance> {
    try {
      const posts = await axios.get(`${FACEBOOK_API_URL}/${pageId}/posts`, {
        params: {
          access_token: accessToken,
          fields: 'id,message,type,created_time,insights.metric(post_impressions,post_engaged_users,post_reactions_by_type)',
          since,
          until
        }
      });

      const postsWithMetrics = await Promise.all(
        posts.data.data.map(async (post: any) => {
          const insights = await this.getPostInsights(
            post.id,
            accessToken,
            ['post_impressions', 'post_engaged_users', 'post_reactions_by_type_total']
          );
          return {
            id: post.id,
            content: post.message || '',
            type: post.type,
            engagement_rate: this.calculateEngagementRate(insights),
            reach: this.extractMetricValue(insights, 'post_impressions'),
            impressions: this.extractMetricValue(insights, 'post_impressions'),
            reactions: this.processReactions(insights),
            comments: this.extractMetricValue(insights, 'post_engaged_users'),
            shares: 0, // Requires additional API call
            posted_at: post.created_time
          };
        })
      );

      return {
        best_performing_posts: this.getBestPerformingPosts(postsWithMetrics),
        content_type_performance: this.analyzeContentTypePerformance(postsWithMetrics),
        optimal_posting_times: this.calculateOptimalPostingTimes(postsWithMetrics)
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static async getAudienceInsights(
    pageId: string,
    accessToken: string,
    since: string,
    until: string
  ): Promise<FacebookAudienceInsights> {
    try {
      const [fanGrowth, engagement, reach] = await Promise.all([
        axios.get(`${FACEBOOK_API_URL}/${pageId}/insights`, {
          params: {
            access_token: accessToken,
            metric: 'page_fans,page_fan_adds,page_fan_removes',
            period: 'day',
            since,
            until
          }
        }),
        axios.get(`${FACEBOOK_API_URL}/${pageId}/insights`, {
          params: {
            access_token: accessToken,
            metric: 'page_engaged_users,page_post_engagements',
            period: 'day',
            since,
            until
          }
        }),
        axios.get(`${FACEBOOK_API_URL}/${pageId}/insights`, {
          params: {
            access_token: accessToken,
            metric: 'page_impressions,page_impressions_paid,page_impressions_organic',
            period: 'day',
            since,
            until
          }
        })
      ]);

      return {
        fan_growth: this.processFanGrowthData(fanGrowth.data),
        engagement_trends: this.processEngagementData(engagement.data),
        reach_trends: this.processReachData(reach.data)
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getExtendedAnalytics(
    pageId: string,
    accessToken: string,
    since?: string,
    until?: string
  ): Promise<FacebookExtendedAnalyticsResponse> {
    try {
      const startDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = until || new Date().toISOString();

      const [baseAnalytics, demographics, contentPerformance, audienceInsights] = await Promise.all([
        super.getAnalytics(pageId, accessToken, startDate, endDate).catch(() => ({
          page: {
            followers: 0,
            engagement_rate: 0,
            reach: 0,
            impressions: 0,
            page_views: 0
          },
          posts: [],
          period: { start: startDate, end: endDate }
        })),
        this.getDemographics(pageId, accessToken).catch(() => ({
          age_gender: [],
          location: [],
          language: []
        })),
        this.getContentPerformance(pageId, accessToken, startDate, endDate).catch(() => ({
          best_performing_posts: [],
          content_type_performance: [],
          optimal_posting_times: []
        })),
        this.getAudienceInsights(pageId, accessToken, startDate, endDate).catch(() => ({
          fan_growth: [],
          engagement_trends: [],
          reach_trends: []
        }))
      ]);

      return {
        ...baseAnalytics,
        demographics,
        content_performance: contentPerformance,
        audience_insights: audienceInsights,
        date_range: {
          start: startDate,
          end: endDate
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Helper methods for data processing
  private static processAgeGenderData(data: any): FacebookDemographics['age_gender'] {
    // Implementation for processing age and gender data
    return [];
  }

  private static processLocationData(data: any): FacebookDemographics['location'] {
    // Implementation for processing location data
    return [];
  }

  private static processLanguageData(data: any): FacebookDemographics['language'] {
    // Implementation for processing language data
    return [];
  }

  private static processReactions(insights: any) {
    return {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0
    };
  }

  private static getBestPerformingPosts(posts: any[]): FacebookContentPerformance['best_performing_posts'] {
    return posts
      .sort((a, b) => b.engagement_rate - a.engagement_rate)
      .slice(0, 10);
  }

  private static analyzeContentTypePerformance(posts: any[]): FacebookContentPerformance['content_type_performance'] {
    const types = ['photo', 'video', 'link', 'status'];
    return types.map(type => {
      const typePosts = posts.filter(post => post.type === type);
      return {
        type: type as 'photo' | 'video' | 'link' | 'status',
        average_engagement_rate: this.calculateAverageEngagement(typePosts),
        average_reach: this.calculateAverageReach(typePosts),
        total_posts: typePosts.length
      };
    });
  }

  private static calculateOptimalPostingTimes(posts: any[]): FacebookContentPerformance['optimal_posting_times'] {
    // Implementation for calculating optimal posting times
    return [];
  }

  private static processFanGrowthData(data: any): FacebookAudienceInsights['fan_growth'] {
    // Implementation for processing fan growth data
    return [];
  }

  private static processEngagementData(data: any): FacebookAudienceInsights['engagement_trends'] {
    // Implementation for processing engagement data
    return [];
  }

  private static processReachData(data: any): FacebookAudienceInsights['reach_trends'] {
    // Implementation for processing reach data
    return [];
  }

  private static calculateAverageEngagement(posts: any[]): number {
    if (posts.length === 0) return 0;
    return posts.reduce((sum, post) => sum + post.engagement_rate, 0) / posts.length;
  }

  private static calculateAverageReach(posts: any[]): number {
    if (posts.length === 0) return 0;
    return posts.reduce((sum, post) => sum + post.reach, 0) / posts.length;
  }
}
