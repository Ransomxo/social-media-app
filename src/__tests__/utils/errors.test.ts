import { AppError, ValidationError, UnauthorizedError } from '../../utils/errors/AppError';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with message and status code', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('error');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with default status code', () => {
      const error = new ValidationError('Invalid input');
      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('error');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create unauthorized error with default status code', () => {
      const error = new UnauthorizedError('Not authenticated');
      expect(error.message).toBe('Not authenticated');
      expect(error.statusCode).toBe(401);
      expect(error.status).toBe('error');
    });
  });
});
