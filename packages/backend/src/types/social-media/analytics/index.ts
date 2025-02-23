import { BaseAnalyticsResponse } from './base';
import { FacebookAnalyticsResponse } from './facebook';
import { FacebookExtendedAnalyticsResponse } from './facebook-extended';
import { InstagramAnalyticsResponse } from './instagram';
import { LinkedInAnalyticsResponse } from './linkedin';
import { TwitterAnalyticsResponse } from './twitter';

export type AnalyticsResponse = BaseAnalyticsResponse;

export {
  FacebookAnalyticsResponse,
  FacebookExtendedAnalyticsResponse,
  InstagramAnalyticsResponse,
  LinkedInAnalyticsResponse,
  TwitterAnalyticsResponse,
};
