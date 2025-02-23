export interface EmailConfig {
  to: string[];
  cc?: string[];
  subject?: string;
  customHeader?: string;
}

export interface ReportSchedule {
  id: string;
  userId: string;
  frequency: 'daily' | 'weekly';
  platforms: string[];
  metrics: string[];
  emailConfig: EmailConfig;
  lastSent?: Date;
  nextScheduled?: Date;
  createdAt: Date;
  updatedAt: Date;
}
