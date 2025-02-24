import nodemailer from 'nodemailer';
import { AppError } from '../../utils/errors/AppError';

export interface EmailReport {
  to: string;
  subject: string;
  content: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  static async sendReport(report: EmailReport): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: report.to,
        subject: report.subject,
        html: report.content,
        attachments: report.attachments
      });
    } catch (error) {
      throw new AppError('Failed to send email report', 500);
    }
  }
}
