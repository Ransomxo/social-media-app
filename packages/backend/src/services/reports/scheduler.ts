import { PrismaClient, Prisma } from '@prisma/client';
import { ReportConfig } from './emailGenerator';
import { ReportSchedule, EmailConfig } from '../../types/reports';

type SerializedEmailConfig = EmailConfig;

function validateEmailConfig(config: unknown): config is EmailConfig {
  const c = config as EmailConfig;
  return Array.isArray(c?.to) && typeof c?.subject === 'string';
}

function toEmailConfig(json: Prisma.JsonValue | null): EmailConfig {
  const data = json as any || {};
  return {
    to: Array.isArray(data.to) ? data.to : [],
    cc: Array.isArray(data.cc) ? data.cc : [],
    subject: typeof data.subject === 'string' ? data.subject : '',
    customHeader: data.customHeader
  };
}

function toJsonValue(config: EmailConfig | undefined): Prisma.InputJsonValue {
  if (!config) {
    return { to: [], cc: [], subject: '' };
  }
  return {
    to: config.to,
    cc: config.cc || [],
    subject: config.subject || '',
    customHeader: config.customHeader
  };
}

export class ReportScheduler {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createSchedule(userId: string, config: ReportConfig): Promise<ReportSchedule> {
    const { frequency, platforms, metrics, emailConfig } = config;
    const serializedConfig: SerializedEmailConfig = {
      to: emailConfig.to,
      cc: emailConfig.cc,
      subject: emailConfig.subject,
      customHeader: emailConfig.customHeader
    };

    const schedule = await this.prisma.reportSchedule.create({
      data: {
        userId,
        frequency,
        platforms,
        metrics,
        emailConfig: toJsonValue(serializedConfig),
      }
    });

    const result: ReportSchedule = {
      id: schedule.id,
      userId: schedule.userId,
      frequency: schedule.frequency as 'daily' | 'weekly',
      platforms: schedule.platforms,
      metrics: schedule.metrics,
      emailConfig: toEmailConfig(schedule.emailConfig),
      lastSent: schedule.lastSent || undefined,
      nextScheduled: schedule.nextScheduled || undefined,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt
    };
    return result;
  }

  async updateSchedule(scheduleId: string, config: Partial<ReportConfig>): Promise<ReportSchedule> {
    const schedule = await this.prisma.reportSchedule.findUnique({
      where: { id: scheduleId }
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const serializedConfig = config.emailConfig ? {
      to: config.emailConfig.to,
      cc: config.emailConfig.cc,
      subject: config.emailConfig.subject,
      customHeader: config.emailConfig.customHeader
    } : undefined;

    const updated = await this.prisma.reportSchedule.update({
      where: { id: scheduleId },
      data: {
        frequency: config.frequency,
        platforms: config.platforms,
        metrics: config.metrics,
        emailConfig: toJsonValue(serializedConfig),
      }
    });

    const result: ReportSchedule = {
      id: updated.id,
      userId: updated.userId,
      frequency: updated.frequency as 'daily' | 'weekly',
      platforms: updated.platforms,
      metrics: updated.metrics,
      emailConfig: toEmailConfig(updated.emailConfig),
      lastSent: updated.lastSent || undefined,
      nextScheduled: updated.nextScheduled || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    };
    return result;
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    await this.prisma.reportSchedule.delete({
      where: { id: scheduleId }
    });
  }

  async getSchedule(scheduleId: string): Promise<ReportSchedule | null> {
    const schedule = await this.prisma.reportSchedule.findUnique({
      where: { id: scheduleId }
    });

    if (!schedule) return null;

    const result: ReportSchedule = {
      id: schedule.id,
      userId: schedule.userId,
      frequency: schedule.frequency as 'daily' | 'weekly',
      platforms: schedule.platforms,
      metrics: schedule.metrics,
      emailConfig: toEmailConfig(schedule.emailConfig),
      lastSent: schedule.lastSent || undefined,
      nextScheduled: schedule.nextScheduled || undefined,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt
    };
    return result;
  }

  async getUserSchedules(userId: string): Promise<ReportSchedule[]> {
    const schedules = await this.prisma.reportSchedule.findMany({
      where: { userId }
    });

    return schedules.map(schedule => {
      const result: ReportSchedule = {
        id: schedule.id,
        userId: schedule.userId,
        frequency: schedule.frequency as 'daily' | 'weekly',
        platforms: schedule.platforms,
        metrics: schedule.metrics,
        emailConfig: toEmailConfig(schedule.emailConfig),
        lastSent: schedule.lastSent || undefined,
        nextScheduled: schedule.nextScheduled || undefined,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt
      };
      return result;
    });
  }
}
