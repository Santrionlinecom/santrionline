const encoder = new TextEncoder();

type CryptoLike = typeof crypto;

async function getCrypto(): Promise<CryptoLike> {
  if (typeof crypto !== 'undefined') return crypto;
  // @ts-expect-error -- fallback for environments where crypto is not global
  return (await import('node:crypto')).webcrypto as CryptoLike;
}

function toBase64(data: Uint8Array) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(data).toString('base64');
  }
  let binary = '';
  data.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function fromBase64(value: string) {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64'));
  }
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function hashPassword(password: string): Promise<string> {
  const cryptoApi = await getCrypto();
  const salt = cryptoApi.getRandomValues(new Uint8Array(16));
  const salted = new Uint8Array([...salt, ...encoder.encode(password)]);
  const hashBuffer = await cryptoApi.subtle.digest('SHA-256', salted);
  const hashArray = new Uint8Array(hashBuffer);
  return `${toBase64(salt)}:${toBase64(hashArray)}`;
}

export async function verifyPassword(password: string, storedHash: string | null): Promise<boolean> {
  if (!storedHash) return false;
  const [saltPart, hashPart] = storedHash.split(':');
  if (!saltPart || !hashPart) return false;
  const cryptoApi = await getCrypto();
  const salt = fromBase64(saltPart);
  const target = fromBase64(hashPart);
  const salted = new Uint8Array([...salt, ...encoder.encode(password)]);
  const hashBuffer = await cryptoApi.subtle.digest('SHA-256', salted);
  const hashArray = new Uint8Array(hashBuffer);
  if (hashArray.byteLength !== target.byteLength) return false;
  return hashArray.every((byte, index) => byte === target[index]);
}
