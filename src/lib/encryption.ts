import CryptoJS from 'crypto-js';

// Use environment variable for encryption key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-dev-key-change-in-production';

export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashSensitiveData(data: any): string {
  // Create a deterministic hash of the sensitive data
  // For hashing purposes, we don't need encryption - just consistent hashing
  const dataString = JSON.stringify({
    ...data,
    bio: data.bio || '',
    links: data.links ? JSON.stringify(data.links) : '',
  });

  return CryptoJS.SHA256(dataString).toString();
}