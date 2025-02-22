export interface EmailReportConfig {
  frequency: 'daily' | 'weekly';
  platforms: string[];
  metrics: {
    profile: string[];
    posts: string[];
  };
  recipients: string[];
  timeZone: string;
  sendTime: string; // HH:mm format
}

export interface EmailReportTemplate {
  subject: string;
  body: string;
  data: {
    period: {
      start: string;
      end: string;
    };
    metrics: {
      [platform: string]: {
        profile: {
          [metric: string]: number;
        };
        posts: Array<{
          id: string;
          created_at: string;
          metrics: {
            [metric: string]: number;
          };
        }>;
      };
    };
  };
}

export interface EmailReportSchedule {
  id: string;
  userId: string;
  config: EmailReportConfig;
  lastSent?: Date;
  nextScheduled: Date;
  createdAt: Date;
  updatedAt: Date;
}
