import crypto from 'crypto';

// 32-byte master encryption key for AES-256-GCM
const MASTER_KEY_RAW = process.env.ENCRYPTION_MASTER_KEY || 'chinstore_master_cyber_key_2026_aes256_secret_key!';

function getMasterKey(): Buffer {
  // Ensure exactly 32 bytes via sha256 derivation
  return crypto.createHash('sha256').update(MASTER_KEY_RAW).digest();
}

export interface EncryptedPayload {
  encryptedData: string; // hex
  iv: string;            // hex (12 bytes)
  authTag: string;       // hex (16 bytes)
}

/**
 * Encrypt sensitive serialized account data or license key using AES-256-GCM
 */
export function encryptAccountData(plainText: string): EncryptedPayload {
  const key = getMasterKey();
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * Decrypt sensitive account data using AES-256-GCM with authentication tag validation
 */
export function decryptAccountData(
  encryptedData: string,
  ivHex: string,
  authTagHex: string
): string {
  try {
    const key = getMasterKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed or data tampered with (AuthTag mismatch):', error);
    throw new Error('Không thể giải mã dữ liệu kho hàng (Khóa xác thực không hợp lệ)');
  }
}
