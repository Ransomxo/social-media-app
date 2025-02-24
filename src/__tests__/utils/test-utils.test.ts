import { createMockRequest, createMockResponse, createMockUser } from './test-utils';

describe('Test Utilities', () => {
  describe('createMockRequest', () => {
    it('should create a mock request with default values', () => {
      const mockReq = createMockRequest();
      expect(mockReq).toEqual({
        body: {},
        params: {},
        query: {}
      });
    });

    it('should merge overrides with default values', () => {
      const mockReq = createMockRequest({
        body: { test: 'value' }
      });
      expect(mockReq).toEqual({
        body: { test: 'value' },
        params: {},
        query: {}
      });
    });
  });

  describe('createMockResponse', () => {
    it('should create a mock response with status and json functions', () => {
      const mockRes = createMockResponse();
      expect(mockRes.status).toBeDefined();
      expect(mockRes.json).toBeDefined();
      expect(typeof mockRes.status).toBe('function');
      expect(typeof mockRes.json).toBe('function');
    });

    it('should chain status and json calls', () => {
      const mockRes = createMockResponse();
      const data = { test: 'value' };
      mockRes.status!(200).json!(data);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(data);
    });
  });

  describe('createMockUser', () => {
    it('should create a mock user with default values', () => {
      const mockUser = createMockUser();
      expect(mockUser).toEqual({
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should merge overrides with default values', () => {
      const mockUser = createMockUser({
        id: '2',
        email: 'other@example.com'
      });
      expect(mockUser).toEqual({
        id: '2',
        email: 'other@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        plan: 'minimal',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });
  });
});
