/**
 * Web Crypto API utilities for Cloudflare Workers
 * Replaces bcrypt functionality with Web Standards
 */

const encoder = new TextEncoder();

function encodeBase64(data: Uint8Array): string {
  if (typeof globalThis.btoa === 'function') {
    let binary = '';
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    return globalThis.btoa(binary);
  }

  const nodeBuffer = (globalThis as { Buffer?: any }).Buffer;
  if (nodeBuffer) {
    return nodeBuffer.from(data).toString('base64');
  }

  throw new Error('Base64 encoder is not available in this environment.');
}

function decodeBase64(value: string): Uint8Array {
  if (typeof globalThis.atob === 'function') {
    const binary = globalThis.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const nodeBuffer = (globalThis as { Buffer?: any }).Buffer;
  if (nodeBuffer) {
    const buffer: Uint8Array = nodeBuffer.from(value, 'base64');
    return buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  }

  throw new Error('Base64 decoder is not available in this environment.');
}

/**
 * Generate salt using Web Crypto API
 */
async function generateSalt(): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Hash password using PBKDF2 with Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await generateSalt();
  const passwordData = encoder.encode(password);

  const key = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, ['deriveBits']);

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 10000,
      hash: 'SHA-256',
    },
    key,
    256,
  );

  // Combine salt and hash
  const hashArray = new Uint8Array(hashBuffer);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);

  // Convert to base64 for storage
  return encodeBase64(combined);
}

/**
 * Compare password with hash using PBKDF2
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    // Decode the stored hash
    const combined = decodeBase64(hash);

    // Extract salt (first 16 bytes) and stored hash (rest)
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);

    const passwordData = encoder.encode(password);

    const key = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, ['deriveBits']);

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 10000,
        hash: 'SHA-256',
      },
      key,
      256,
    );

    const computedHash = new Uint8Array(hashBuffer);

    // Compare hashes
    if (computedHash.length !== storedHash.length) {
      return false;
    }

    let isEqual = true;
    for (let i = 0; i < computedHash.length; i++) {
      if (computedHash[i] !== storedHash[i]) {
        isEqual = false;
      }
    }

    return isEqual;
  } catch (error) {
    console.error('Password comparison failed:', error);
    return false;
  }
}
