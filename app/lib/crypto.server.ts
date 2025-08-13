/**
 * Web Crypto API utilities for Cloudflare Workers
 * Replaces bcrypt functionality with Web Standards
 */

const encoder = new TextEncoder();

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
  
  const key = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 10000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  // Combine salt and hash
  const hashArray = new Uint8Array(hashBuffer);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
}

/**
 * Compare password with hash using PBKDF2
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    // Decode the stored hash
    const combined = new Uint8Array(
      atob(hash).split('').map(char => char.charCodeAt(0))
    );

    // Extract salt (first 16 bytes) and stored hash (rest)
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);

    const passwordData = encoder.encode(password);
    
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 10000,
        hash: 'SHA-256'
      },
      key,
      256
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
