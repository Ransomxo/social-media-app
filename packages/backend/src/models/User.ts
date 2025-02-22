import { User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface User extends PrismaUser {}

export class UserModel {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async validatePassword(hashedPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
