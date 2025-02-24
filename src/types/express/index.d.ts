declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      plan: string;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}
