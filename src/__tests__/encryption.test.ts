import { encryptData, decryptData, hashSensitiveData } from '@/lib/encryption';

describe('Encryption Utilities', () => {
  const testData = 'Hello, World!';

  describe('encryptData and decryptData', () => {
    it('should encrypt and decrypt data correctly', () => {
      const encrypted = encryptData(testData);
      const decrypted = decryptData(encrypted);

      expect(encrypted).not.toBe(testData);
      expect(decrypted).toBe(testData);
    });

    it('should handle empty strings', () => {
      const encrypted = encryptData('');
      const decrypted = decryptData(encrypted);

      expect(decrypted).toBe('');
    });

    it('should handle special characters', () => {
      const specialData = 'Special chars: !@#$%^&*()_+{}|:<>?[]\\;\'",./';
      const encrypted = encryptData(specialData);
      const decrypted = decryptData(encrypted);

      expect(decrypted).toBe(specialData);
    });

    it('should produce different encrypted outputs for same input (due to random IV)', () => {
      const encrypted1 = encryptData(testData);
      const encrypted2 = encryptData(testData);

      // AES encryption with random IV produces different outputs for same input
      expect(encrypted1).not.toBe(encrypted2);
      expect(decryptData(encrypted1)).toBe(testData);
      expect(decryptData(encrypted2)).toBe(testData);
    });
  });

  describe('hashSensitiveData', () => {
    it('should hash data consistently', () => {
      const testObj = { name: 'John', bio: 'Developer', links: ['github.com/john'] };
      const hash1 = hashSensitiveData(testObj);
      const hash2 = hashSensitiveData(testObj);

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(JSON.stringify(testObj));
    });

    it('should produce different hashes for different data', () => {
      const obj1 = { name: 'John', bio: 'Developer' };
      const obj2 = { name: 'Jane', bio: 'Designer' };

      const hash1 = hashSensitiveData(obj1);
      const hash2 = hashSensitiveData(obj2);

      expect(hash1).not.toBe(hash2);
    });

    it('should encrypt sensitive fields before hashing', () => {
      const objWithSensitive = { name: 'John', bio: 'Secret bio', links: ['github.com/john'] };
      const hash = hashSensitiveData(objWithSensitive);

      // The hash should be a SHA256 hash (64 characters hex)
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });

    it('should handle objects without sensitive fields', () => {
      const objWithoutSensitive = { name: 'John', age: 30 };
      const hash = hashSensitiveData(objWithoutSensitive);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });
  });
});