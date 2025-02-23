import { PrismaClient, Prisma } from '@prisma/client';
import { ReportConfig } from './emailGenerator';
import { ReportSchedule, SerializedEmailConfig } from '../../types/reports';

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
        emailConfig: serializedConfig,
      }
    });

    const result: ReportSchedule = {
      id: schedule.id,
      userId: schedule.userId,
      frequency: schedule.frequency as 'daily' | 'weekly',
      platforms: schedule.platforms,
      metrics: schedule.metrics,
      emailConfig: serializedConfig,
      lastSent: schedule.lastSent,
      nextScheduled: schedule.nextScheduled,
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
        emailConfig: serializedConfig,
      }
    });

    const result: ReportSchedule = {
      id: updated.id,
      userId: updated.userId,
      frequency: updated.frequency as 'daily' | 'weekly',
      platforms: updated.platforms,
      metrics: updated.metrics,
      emailConfig: updated.emailConfig as SerializedEmailConfig,
      lastSent: updated.lastSent,
      nextScheduled: updated.nextScheduled,
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
      emailConfig: schedule.emailConfig as SerializedEmailConfig,
      lastSent: schedule.lastSent,
      nextScheduled: schedule.nextScheduled,
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
        emailConfig: schedule.emailConfig as SerializedEmailConfig,
        lastSent: schedule.lastSent,
        nextScheduled: schedule.nextScheduled,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt
      };
      return result;
    });
  }
}
