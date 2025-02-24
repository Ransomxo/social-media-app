import { EncryptionService } from '../../utils/encryption';

describe('EncryptionService', () => {
  const testText = 'test-secret-text';

  beforeAll(() => {
    process.env.ENCRYPTION_KEY = 'test-encryption-key-32-bytes-long-k';
  });

  it('should encrypt and decrypt text correctly', () => {
    const encrypted = EncryptionService.encrypt(testText);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe('string');

    const decrypted = EncryptionService.decrypt(encrypted);
    expect(decrypted).toBe(testText);
  });

  it('should generate different ciphertexts for same plaintext', () => {
    const encrypted1 = EncryptionService.encrypt(testText);
    const encrypted2 = EncryptionService.encrypt(testText);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should handle empty strings', () => {
    const emptyText = '';
    const encrypted = EncryptionService.encrypt(emptyText);
    const decrypted = EncryptionService.decrypt(encrypted);
    expect(decrypted).toBe(emptyText);
  });
});
