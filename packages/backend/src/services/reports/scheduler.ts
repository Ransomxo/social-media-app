import { PrismaClient } from '@prisma/client';
import { ReportConfig, ReportGenerator } from './emailGenerator';
import { ReportSchedule } from '../../types/reports';

export class ReportScheduler {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createSchedule(userId: string, config: ReportConfig): Promise<ReportSchedule> {
    return await this.prisma.reportSchedule.create({
      data: {
        userId,
        frequency: config.frequency,
        platforms: config.platforms,
        metrics: config.metrics,
        emailConfig: config.emailConfig,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async updateSchedule(scheduleId: string, config: Partial<ReportConfig>): Promise<ReportSchedule> {
    return await this.prisma.reportSchedule.update({
      where: { id: scheduleId },
      data: {
        ...config,
        updatedAt: new Date()
      }
    });
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    await this.prisma.reportSchedule.delete({
      where: { id: scheduleId }
    });
  }

  async getSchedule(scheduleId: string): Promise<ReportSchedule | null> {
    return await this.prisma.reportSchedule.findUnique({
      where: { id: scheduleId }
    });
  }

  async getUserSchedules(userId: string): Promise<ReportSchedule[]> {
    return await this.prisma.reportSchedule.findMany({
      where: { userId }
    });
  }
}
